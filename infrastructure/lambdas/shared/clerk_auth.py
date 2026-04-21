"""Verify Clerk session JWTs (RS256 + JWKS) — used by API Gateway Lambda authorizer."""

from __future__ import annotations

import os
from typing import Any

import jwt
from jwt import PyJWKClient
from jwt.exceptions import InvalidTokenError

_jwks_client: PyJWKClient | None = None


def _issuer() -> str:
    v = (os.environ.get("CLERK_JWT_ISSUER") or "").strip().rstrip("/")
    return v


def _jwks_url() -> str:
    iss = _issuer()
    if not iss:
        return ""
    return f"{iss}/.well-known/jwks.json"


def _publishable_key() -> str:
    return (os.environ.get("CLERK_PUBLISHABLE_KEY") or "").strip()


def _get_jwks_client() -> PyJWKClient:
    global _jwks_client
    url = _jwks_url()
    if not url:
        raise RuntimeError("CLERK_JWT_ISSUER is not configured")
    if _jwks_client is None:
        _jwks_client = PyJWKClient(url, cache_keys=True)
    return _jwks_client


def verify_clerk_bearer_token(token: str) -> dict[str, Any]:
    """
    Validate Clerk-issued session JWT: signature (JWKS), iss, exp, optional azp.
    """
    iss = _issuer()
    if not iss:
        raise RuntimeError("CLERK_JWT_ISSUER is not configured")

    jwks = _get_jwks_client()
    signing_key = jwks.get_signing_key_from_jwt(token)

    payload = jwt.decode(
        token,
        signing_key.key,
        algorithms=["RS256"],
        issuer=iss,
        options={"verify_aud": False},
        leeway=60,
    )

    pk = _publishable_key()
    if pk:
        azp = payload.get("azp")
        if azp != pk:
            raise InvalidTokenError("Invalid azp")

    return payload
