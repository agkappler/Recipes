"""
API Gateway HTTP API v2 — Lambda authorizer (SIMPLE response).

Runs on all bounty routes. Forwards Clerk JWT claims as string `context` for the integration.
- Public GETs: allow without Bearer; optional Bearer validated and passed through.
- Writes (POST): require valid Clerk JWT or deny.
"""

from __future__ import annotations

import json
from typing import Any

from shared.clerk_auth import verify_clerk_bearer_token

READ_ROUTES = frozenset(
    {
        "GET /api/bounties",
        "GET /api/bountyCategories",
    }
)
WRITE_ROUTES = frozenset(
    {
        "POST /api/createBounty",
        "POST /api/updateBounty",
        "POST /api/createBountyCategory",
    }
)


def _extract_bearer(event: dict[str, Any]) -> str | None:
    headers = event.get("headers") or {}
    for raw_key, value in headers.items():
        if not value or not isinstance(value, str):
            continue
        if raw_key.lower() == "authorization" and value.lower().startswith("bearer "):
            return value[7:].strip()
    return None


def _claims_to_context(payload: dict[str, Any]) -> dict[str, str]:
    """API Gateway authorizer context: all values must be strings."""
    out: dict[str, str] = {"authenticated": "true"}
    for key in ("sub", "sid", "azp", "iss", "nbf"):
        if key in payload and payload[key] is not None:
            out[key] = str(payload[key])
    for key in ("iat", "exp"):
        if key in payload and payload[key] is not None:
            out[key] = str(int(payload[key]) if isinstance(payload[key], (int, float)) else payload[key])
    primitive: dict[str, Any] = {}
    for k, v in payload.items():
        if isinstance(v, (str, int, float, bool)) or v is None:
            primitive[k] = v
    out["claims_json"] = json.dumps(primitive, default=str)
    return out


def _deny() -> dict[str, Any]:
    return {"isAuthorized": False}


def _allow(ctx: dict[str, str] | None = None) -> dict[str, Any]:
    return {"isAuthorized": True, "context": ctx or {}}


def handler(event: dict[str, Any], context: Any) -> dict[str, Any]:
    try:
        req = event.get("requestContext") or {}
        http = req.get("http") or {}
        method = (http.get("method") or "GET").upper()
        raw_path = event.get("rawPath") or ""
        route_key = f"{method} {raw_path}"

        if method == "OPTIONS":
            return _allow({"authenticated": "false"})

        token = _extract_bearer(event)

        if route_key in READ_ROUTES:
            if not token:
                return _allow({"authenticated": "false"})
            try:
                payload = verify_clerk_bearer_token(token)
                return _allow(_claims_to_context(payload))
            except Exception:
                # Invalid or expired token on a public read — still allow the GET; no user context.
                return _allow({"authenticated": "false"})

        if route_key in WRITE_ROUTES:
            if not token:
                return _deny()
            try:
                payload = verify_clerk_bearer_token(token)
                return _allow(_claims_to_context(payload))
            except Exception:
                return _deny()

        # Unknown path on this API — allow integration to return 404
        return _allow({"authenticated": "false"})
    except RuntimeError:
        return _deny()
