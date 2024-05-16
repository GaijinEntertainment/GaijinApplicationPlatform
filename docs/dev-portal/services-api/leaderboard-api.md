---
title: Leaderboard API
---

Leaderboard is a rating list. The Leaderboard API uses the [json-rpc protocol](https://www.jsonrpc.org/specification).

## Client methods

### cln_get_leaderboard

This method is to request representation of a leaderboard. The request example is shown below:

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
Request fields:

- `appid` (_int_) - application id
- `token` (_string_) - user token
- `category` (_string_) -name of the stat on which the rating is based
- `table` (_string_) - has the same meaning as described in the [Userstat API](userstat-api.md#common-params) and [Unlocks format](../configs-format/unlocks-config-format.md#unlocks-format)
- `tableIndex` (_int_) - has the same meaning as described in the [Userstat API](userstat-api.md#common-params)
- `gameMode` (_string_) - has the same meaning, described in the [Userstat API](userstat-api.md#common-params) and [Unlocks format](../configs-format/unlocks-config-format.md#unlocks-format)
- `start` (_int_) - start place (literally means "get leaderboard from \{start\} place and lower")
- `count` (_int_) - count of users to return in respose
- `resolveNick` (_int_) - the flag to use user id _(0)_ or user nickname _(1)_ as a key for user's data
- `platformFilter` (_string_) - allows for the separation of the leaderboard by platforms
- `group` (_string_) - for grouping users by a sign, such as belonging to some leagues.

Response:

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

The response contains leaderboard data, grouped by the user nickname (or user id):

- `self` - field is present in the response if the object belongs to the user who sent the request
- `idx` - place of the user in the leaderboard
- `_id` - user's unique id
- `platform` - user's platform
- `$` - some service object, which contains:
  - `tag` - currently, it is an application id
  - `table` - same as in the request
  - `tableIndex` - same as in the request
  - `mode` - same as in the request
  - `total` - total count of users in this leaderboard
  - `startTime` - service info, leaderboard calculation start time (unix timestamp)
  - `deltaTime` - service info, leaderboard calculation time (seconds)
- `<some_stat_name>` - stat name ( _kills, exp, level_ in the example above)
  - `value_total` - stat's value
- `endOfList` - This flag will be present when the count of users in the request exceeds the number of users that can be returned. In the example above, 3 users have been requested, but only 2 users exist in the leaderboard.
