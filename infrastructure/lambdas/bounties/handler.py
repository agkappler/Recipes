"""
Bounties HTTP API — API Gateway HTTP API v2 (payload format 2.0) + DynamoDB.
Paths mirror Java BaseApiController: /api/...
"""

from __future__ import annotations

import json
import os
from decimal import Decimal
from typing import Any

import boto3
from botocore.exceptions import ClientError

STATUS_NUM_TO_NAME: dict[int, str] = {1: "ACTIVE", 2: "COMPLETE", 3: "OVERDUE"}
STATUS_NAME_TO_NUM: dict[str, int] = {v: k for k, v in STATUS_NUM_TO_NAME.items()}

dynamodb = boto3.resource("dynamodb")


def _table(name_env: str):
    n = os.environ.get(name_env)
    if not n:
        raise RuntimeError(f"Missing env {name_env}")
    return dynamodb.Table(n)


def _json_response(status_code: int, body: Any) -> dict[str, Any]:
    return {
        "statusCode": status_code,
        "headers": {"Content-Type": "application/json"},
        "body": json.dumps(body, default=_json_default),
    }


def _json_default(o: Any) -> Any:
    if isinstance(o, Decimal):
        return int(o) if o % 1 == 0 else float(o)
    raise TypeError(f"Object of type {type(o)} is not JSON serializable")


def _parse_body(event: dict[str, Any]) -> dict[str, Any]:
    raw = event.get("body") or "{}"
    if event.get("isBase64Encoded"):
        import base64

        raw = base64.b64decode(raw).decode("utf-8")
    if not raw.strip():
        return {}
    return json.loads(raw)


def _normalize_status(raw: Any) -> int:
    if isinstance(raw, int):
        return raw
    if isinstance(raw, str) and raw in STATUS_NAME_TO_NUM:
        return STATUS_NAME_TO_NUM[raw]
    try:
        return int(raw)
    except (TypeError, ValueError):
        return 1


def _bounty_to_api(item: dict[str, Any]) -> dict[str, Any]:
    sid = item.get("status")
    if isinstance(sid, Decimal):
        sid = int(sid)
    name = STATUS_NUM_TO_NAME.get(int(sid), "ACTIVE") if sid is not None else "ACTIVE"
    out: dict[str, Any] = {
        "bountyId": int(item["bountyId"]) if not isinstance(item["bountyId"], int) else item["bountyId"],
        "title": item.get("title"),
        "description": item.get("description"),
        "status": name,
        "categoryId": int(item["categoryId"])
        if not isinstance(item["categoryId"], int)
        else item["categoryId"],
    }
    if item.get("expirationDate") is not None:
        out["expirationDate"] = item["expirationDate"]
    return out


def _category_to_api(item: dict[str, Any]) -> dict[str, Any]:
    return {
        "categoryId": int(item["categoryId"])
        if not isinstance(item["categoryId"], int)
        else item["categoryId"],
        "name": item.get("name"),
    }


def _next_id(table, key_name: str) -> int:
    max_id = 0
    start_key = None
    while True:
        kwargs: dict[str, Any] = {"ProjectionExpression": key_name}
        if start_key:
            kwargs["ExclusiveStartKey"] = start_key
        resp = table.scan(**kwargs)
        for item in resp.get("Items", []):
            v = item.get(key_name)
            if v is not None:
                max_id = max(max_id, int(v))
        start_key = resp.get("LastEvaluatedKey")
        if not start_key:
            break
    return max_id + 1


def _get_bounties() -> list[dict[str, Any]]:
    table = _table("BOUNTIES_TABLE_NAME")
    items: list[dict[str, Any]] = []
    start_key = None
    while True:
        kwargs: dict[str, Any] = {}
        if start_key:
            kwargs["ExclusiveStartKey"] = start_key
        resp = table.scan(**kwargs)
        items.extend(resp.get("Items", []))
        start_key = resp.get("LastEvaluatedKey")
        if not start_key:
            break
    items.sort(key=lambda x: int(x.get("bountyId", 0)))
    return [_bounty_to_api(i) for i in items]


def _get_categories() -> list[dict[str, Any]]:
    table = _table("BOUNTY_CATEGORIES_TABLE_NAME")
    items: list[dict[str, Any]] = []
    start_key = None
    while True:
        kwargs: dict[str, Any] = {}
        if start_key:
            kwargs["ExclusiveStartKey"] = start_key
        resp = table.scan(**kwargs)
        items.extend(resp.get("Items", []))
        start_key = resp.get("LastEvaluatedKey")
        if not start_key:
            break
    items.sort(key=lambda x: int(x.get("categoryId", 0)))
    return [_category_to_api(i) for i in items]


def _create_bounty(body: dict[str, Any]) -> dict[str, Any]:
    if body.get("categoryId") is None:
        raise ValueError("categoryId is required")
    table = _table("BOUNTIES_TABLE_NAME")
    new_id = _next_id(table, "bountyId")
    status = _normalize_status(body.get("status", 1))
    item = {
        "bountyId": new_id,
        "title": body.get("title") or "",
        "description": body.get("description") or "",
        "status": status,
        "categoryId": int(body["categoryId"]),
    }
    if body.get("expirationDate") is not None:
        item["expirationDate"] = body["expirationDate"]
    table.put_item(Item=item)
    return _bounty_to_api(item)


def _update_bounty(body: dict[str, Any]) -> dict[str, Any]:
    if body.get("bountyId") is None:
        raise ValueError("bountyId is required")
    if body.get("categoryId") is None:
        raise ValueError("categoryId is required")
    table = _table("BOUNTIES_TABLE_NAME")
    bid = int(body["bountyId"])
    status = _normalize_status(body.get("status", 1))
    expr_names = {
        "#t": "title",
        "#d": "description",
        "#s": "status",
        "#c": "categoryId",
    }
    expr_vals = {
        ":t": body.get("title") or "",
        ":d": body.get("description") or "",
        ":s": status,
        ":c": int(body["categoryId"]),
    }
    update_expr = "SET #t = :t, #d = :d, #s = :s, #c = :c"
    if body.get("expirationDate") is not None:
        expr_names["#e"] = "expirationDate"
        expr_vals[":e"] = body["expirationDate"]
        update_expr += ", #e = :e"
    table.update_item(
        Key={"bountyId": bid},
        UpdateExpression=update_expr,
        ExpressionAttributeNames=expr_names,
        ExpressionAttributeValues=expr_vals,
        ConditionExpression="attribute_exists(bountyId)",
    )
    resp = table.get_item(Key={"bountyId": bid})
    got = resp.get("Item")
    if not got:
        raise RuntimeError("bounty missing after update")
    return _bounty_to_api(got)


def _create_category(body: dict[str, Any]) -> dict[str, Any]:
    table = _table("BOUNTY_CATEGORIES_TABLE_NAME")
    new_id = _next_id(table, "categoryId")
    item = {"categoryId": new_id, "name": body.get("name") or ""}
    table.put_item(Item=item)
    return _category_to_api(item)


def handler(event: dict[str, Any], context: Any) -> dict[str, Any]:
    try:
        req = event.get("requestContext") or {}
        http = req.get("http") or {}
        method = http.get("method", "GET").upper()
        raw_path = event.get("rawPath") or ""

        if method == "OPTIONS":
            return {"statusCode": 200, "body": ""}

        route_key = f"{method} {raw_path}"

        if route_key == "GET /api/bounties":
            return _json_response(200, _get_bounties())
        if route_key == "GET /api/bountyCategories":
            return _json_response(200, _get_categories())

        if route_key == "POST /api/createBounty":
            body = _parse_body(event)
            return _json_response(200, _create_bounty(body))

        if route_key == "POST /api/updateBounty":
            body = _parse_body(event)
            return _json_response(200, _update_bounty(body))

        if route_key == "POST /api/createBountyCategory":
            body = _parse_body(event)
            return _json_response(200, _create_category(body))

        return _json_response(
            404,
            {"message": "Not found", "routeKey": route_key},
        )
    except json.JSONDecodeError:
        return _json_response(400, {"message": "Invalid JSON body"})
    except ValueError as e:
        return _json_response(400, {"message": str(e)})
    except ClientError as e:
        code = e.response.get("Error", {}).get("Code", "")
        if code == "ConditionalCheckFailedException":
            return _json_response(404, {"message": "Bounty not found"})
        return _json_response(500, {"message": code or str(e)})
    except Exception as e:
        return _json_response(500, {"message": str(e)})

