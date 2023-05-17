---
title: Leaderboard API
---

Leaderboard API uses [json-rpc protocol](https://www.jsonrpc.org/specification). Leaderboard in another words is a rating list.

## Client methods

### cln_get_leaderboard

Method to request leaderboard representation.

```json
{
  "method": "cln_get_leaderboard",
  "id": "ecdf8a03-a1bf-43f4-96eb-06550cdb63f9",
  "jsonrpc": "2.0",
  "params": {
    "appid": 1197,
    "token": "asdfG", // user token
    "category": "kills",
    "table": "global",
    "tableIndex": 0,
    "gameMode": "default",
    "start": 0,
    "count": 3,
    "resolveNick": 1, // 1/0
    "group": "0",
    "platformFilter": "pc"
  }
}
```

- `appid` (_int_) - application id
- `token` (_string_) - user token
- `category` (_string_) - stat's name on which the rating is based
- `table` (_string_) - has the same meaning, described in the [Userstat API](userstat-api#common-params) and [Unlocks format](./../configs-format/unlocks-config-format#unlocks-format).
- `tableIndex` (_int_) - has the same meaning, described in the [Userstat API](userstat-api#common-params).
- `gameMode` (_string_) - has the same meaning, described in the [Userstat API](userstat-api#common-params) and [Unlocks format](./../configs-format/unlocks-config-format#unlocks-format).
- `start` (_int_) - start place (literally "get leaderboard from {start} place and lower")
- `count` (_int_) - count of users to return in respose
- `resolveNick` (_int_) - use user id _(0)_ or user nickname _(1)_ as key of user's data
- `platformFilter` (_string_) - can be used for separating leaderboard by platforms
- `group` (_string_) - can be used for grouping users by a sign, e.g. by some leagues

Response

```json
{
  "jsonrpc": "2.0",
  "id": "f08fb834-b78d-48f8-bfb8-4d46a7c49a41",
  "result": {
    "Gosu1980": {
      "self": true,
      "idx": 0,
      "_id": 126516991,
      "platform": "pc",
      "$": {
        "tag": "1197",
        "table": "global",
        "tableIndex": 1,
        "mode": "default",
        "total": 2,
        "startTime": 1666624626,
        "deltaTime": 0
      },
      "level": {
        "value_total": 192
      },
      "exp": {
        "value_total": 2707
      },
      "kills": {
        "value_total": 909
      }
    },
    "N00b": {
      "idx": 1,
      "_id": 123066914,
      "platform": "pc",
      "level": {
        "value_total": 17
      },
      "exp": {
        "value_total": 235
      },
      "kills": {
        "value_total": 123
      }
    },
    "endOfList": true
  }
}
```

The response contains leaderboard's data, grouped by the user nickname (or the user's id).

- `self` - is present in the object of the user who sent the request
- `idx` - user's place in the leaderboard
- `_id` - user's unique id
- `platform` - user's platform
- `$` - some service object, which contains:
  - `tag` - currently it is just an application id
  - `table` - as request
  - `tableIndex` - as request
  - `mode` - as request
  - `total` - total count of users in this leaderboard
  - `startTime` - service info, start time of the leaderboard calculation (unix timestamp)
  - `deltaTime` - service info, leaderboard calculation time (seconds)
- `<some_stat_name>` - in the example above the _kills, exp, level_
  - `value_total` - stat's value
- `endOfList` - in case of request more user count than can be returned, this flag is present. In the example was requested 3 of users, but only 2 users exist in the leaderboard.
