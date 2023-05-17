---
title: Userstat API
---

Userstat API uses [json-rpc protocol](https://www.jsonrpc.org/specification).

## Description of common action parameters {#common-params}

### Required for all methods

- `appid` (_int_) - application id
- `token` (_string_) - service or user token

### Required for specific methods

- `transactid` (_int_) - for some methods (e.g. [ChangeStats](#changestats)) this id must be unique for the packet of changes, in the case of a re-call this allows to avoid mistakes
- `userid` (_int_) some methods (e.g. [ChangeStats](#changestats)) needs unique user id
- `__body__` (_json object_) - object with request parameters for the unlocks/stats data

Also some methods use the same parameters:

- `table` (_string_) - has the same meaning, described in the [unlocks doc](../configs-format/unlocks-config-format#unlocks-format). It can be considered as a time-namespace for calculating statistics: _global_ - stats for all the time, _day_ - stats for one day, etc. Currently, only the _global_ table is available.
- `index` (_int_) - table's index, for repeating tables (e.g. day table) sequence number.
- `mode` (_string_) - has the same meaning, described in the [unlocks doc](../configs-format/unlocks-config-format#unlocks-format). Currently only the _default_ mode is available.

## Admin/Server methods

To avoid cheating, this methods is recomended to call from server and/or protected apps.

### ChangeStats

Method for changing user statistics. The `token` parameter have to belong user with permissions to change stats. But the `userid` is the id of the user, which stats will change.

```json
{
  "jsonrpc": "2.0",
  "id": "ecdf8a03-a1bf-43f4-96eb-06550cdb63f9",
  "method": "ChangeStats",
  "params": {
    "token": "qWerty", // service token
    "userid": 126516991, // useser id, which stats changes
    "appid": 1197,
    "transactid": 12345678,
    "__body__": {
      "$mode": ["default"],
      "$tables": ["global"],
      "exp": 1,
      "kills": { "$add": 10 }
    }
  }
}
```

Stats data placed in the `__body__` object.

- `$tables` (_array of strings_) - parameters defining which table we want to change stats. This is optional parameter, if undefined stats will be changed for all tables.
- `$mode` (_array of strings_) - parameters defining which modes we want to change stats.
  The next key/value pairs means stat_name/increment_value. In case of "kill"-stat there is an explicit form of increment argument. So "exp" stat will be increment by 1 and "kills" by 10.

Another way to change stats is to use `"$set"`. In this case the value is assigned to the stat:

```json
"__body__": {
  "$mode": ["default"],
  "$tables": ["global"],
  "exp": {"$set": 100}, // now "exp" is 100
}
```

For the stats, calculating as [moving average](../configs-format/stats-config-format#moving-average) the `$avg` parameter is used:

```json
"__body__": {
  "$mode": ["default"],
  "$tables": ["global"],
  "some_avg_stat_name": {
    "$avg" : {
      "$val" : 20, // current session value
      "$len" : 12.5 // session length (same units as 'window' size in stats configuration)
    }
  }
}
```

#### Sessional stats
For the sessional stats(e.g. kills per battle) the `$sessionId` parameter is used:

```json
"__body__": {
  "$mode": ["default"],
  "$tables": ["global"],
  "$sessionId": "12345678",
  "kills_per_battle": 1
}
```

## Client methods

### GetDescription

Method to request stats and unlocks description.

```json
{
  "jsonrpc": "2.0",
  "id": "ecdf8a03-a1bf-43f4-96eb-06550cdb63f9",
  "method": "GetUserStatDescList",
  "params": {
    "appid": 1197,
    "token": "asdfG" // user token
  }
}
```

<details>
  <summary>Response</summary>

:::note
The following fields are present in response, but currently not supported:

- rewardsTag
- currencyCode
- minPrice
- price
- personal
- purchaseRequirement
- tags
- ps4Id
- xboxId

:::

```json
{
  "jsonrpc": "2.0",
  "id": "ecdf8a03-a1bf-43f4-96eb-06550cdb63f9",
  "result": {
    "stats": {
      "exp": {
        "meta": null,
        "name": "exp",
        "type": "INT"
      },
      "gems": {
        "meta": null,
        "name": "gems",
        "type": "INT"
      },
      "kills": {
        "meta": null,
        "name": "kills",
        "type": "INT"
      },
      "level": {
        "meta": null,
        "name": "level",
        "type": "INT"
      }
    },
    "unlocks": {
      "gems": {
        "name": "gems",
        "type": "NORMAL",
        "table": "global",
        "mode": "default",
        "autoRewarding": false,
        "periodic": true,
        "startStageLoop": 1,
        "requirement": "",
        "iconUrl": "",
        "stages": [
          {
            "progress": "2",
            "updStats": [
              {
                "name": "gems",
                "table": "",
                "mode": "default",
                "type": "ADD",
                "value": "1"
              }
            ],
            "rewardsTag": "", // not supported
            "currencyCode": "", // not supported
            "minPrice": 0, // not supported
            "price": 0 // not supported
          }
        ],
        "personal": "", // not supported
        "purchaseRequirement": "", // not supported
        "tags": "", // not supported
        "ps4Id": "0", // not supported
        "xboxId": "0" // not supported
      },
      "level": {
        "name": "level",
        "type": "NORMAL",
        "table": "global",
        "mode": "default",
        "autoRewarding": true,
        "periodic": true,
        "startStageLoop": 3,
        "requirement": "",
        "iconUrl": "",
        "stages": [
          {
            "progress": "3",
            "updStats": [
              {
                "name": "level",
                "table": "",
                "mode": "default",
                "type": "ADD",
                "value": "1"
              }
            ],
            "rewardsTag": "",
            "currencyCode": "",
            "minPrice": 0,
            "price": 0
          },
          {
            "progress": "10",
            "updStats": [
              {
                "name": "level",
                "table": "",
                "mode": "default",
                "type": "ADD",
                "value": "1"
              }
            ],
            "rewardsTag": "",
            "currencyCode": "",
            "minPrice": 0,
            "price": 0
          },
          {
            "progress": "25",
            "updStats": [
              {
                "name": "level",
                "table": "",
                "mode": "default",
                "type": "ADD",
                "value": "1"
              }
            ],
            "rewardsTag": "",
            "currencyCode": "",
            "minPrice": 0,
            "price": 0
          }
        ],
        "personal": "",
        "ps4Id": "0",
        "purchaseRequirement": "",
        "tags": "",
        "xboxId": "0"
      }
    }
  }
}
```

</details>

See [stats description format](../configs-format/stats-config-format) and [unlocks description format](../configs-format/unlocks-config-format) for details.

### GetStats

Method to request user statistics.

```json
{
  "jsonrpc": "2.0",
  "id": "ecdf8a03-a1bf-43f4-96eb-06550cdb63f9",
  "method": "GetStats",
  "params": {
    "appid": 1197,
    "token": "asdfG", // user token
    "__body__": {
      "tables": ["global"],
      "modes": ["default"],
      "stats": ["level"]
    }
  }
}
```

The parameters `tables`, `modes`, `stats` (_array of string_) work as filter. If param value is `{}`, `[]`, `null` or absent - filter is empty, so all user stats for this filter type will be sent. If some values is set, the only suitable stats will be added to the response.

<details>
<summary>Response on request without "params" <b>(without filters)</b>:</summary>

```json
{
  "jsonrpc": "2.0",
  "id": "ecdf8a03-a1bf-43f4-96eb-06550cdb63f9",
  "result": {
    "stats": {
      "global": { // table name
        "$index": 1,
        "default": { // mode name
          // stats name and value
          "level": 189,
          "gems": 94,
          "exp": 2650,
          "kills": 900
        }
      }
    },
    "timestamp": 1657032352 //request server time stamp
  }
}
```
</details>

<details>
<summary>Response on request with "params" <b>{`{"stats": ["level"]}`}</b>:</summary>

```json
{
  "jsonrpc": "2.0",
  "id": "ecdf8a03-a1bf-43f4-96eb-06550cdb63f9",
  "result": {
    "stats": {
      "global": { // table name
        "$index": 1,
        "default": { // mode name
          "level": 5 // stat name and value
        }
      }
    },
    "timestamp": 1657032352 //request server time stamp
  }
}
```
</details>

### GetUnlocks

Method to request user's unlocks progress.

```json
{
  "jsonrpc": "2.0",
  "id": "ecdf8a03-a1bf-43f4-96eb-06550cdb63f9",
  "method": "GetUnlocks",
  "params": {
    "appid": 1197,
    "token": "qWerty"
    "unlocks": ["level"]
  }
}
```

The parameter `unlocks` (_array of string_) work as filter by unlock name. If param value is `{}`, `[]`, `null` or absent - filter is empty, so all user unlocks for this filter type will be sent. If value is set, the only suitable unlocks will be added to the response.

<details>
<summary>Response filtering by unlock name:</summary>

```json
{
  "jsonrpc": "2.0",
  "id": "20509a19-478a-421d-ba8c-8600b3f9004b",
  "result": {
    "personalUnlocks": {}, // currently not supported
    "timestamp": 1666256920,
    "unlocks": {
      "level": {
        "lastRewardedStage": 148,
        "lastSeenStage": -1,
        "nextStage": 2215,
        "progress": 2208,
        "stage": 148,
        "timestamp": 1666250620
      }
    }
  }
}
```
</details>

Request without filter:

```json
{
  "jsonrpc": "2.0",
  "id": "ecdf8a03-a1bf-43f4-96eb-06550cdb63f9",
  "method": "GetUnlocks",
  "params": {
    "appid": 1197,
    "token": "qWerty"
  }
}
```

<details>
<summary>Response with all unlocks:</summary>

```json
{
  "jsonrpc": "2.0",
  "id": "20509a19-478a-421d-ba8c-8600b3f9004b",
  "result": {
    "personalUnlocks": {}, // currently not supported
    "timestamp": 1666256920,
    "unlocks": {
      "gems": {
        "lastRewardedStage": 94,
        "lastSeenStage": -1,
        "nextStage": 192,
        "progress": 190,
        "stage": 95,
        "timestamp": 1666276680
      },
      "level": {
        "lastRewardedStage": 148,
        "lastSeenStage": -1,
        "nextStage": 2215,
        "progress": 2208,
        "stage": 148,
        "timestamp": 1666250620
      }
    }
  }
}
```
</details>

The response contains unlock's data, grouped by names.

- `stage` value indicates current unlock's stage.
- `lastRewardedStage` is the last rewarded stage. So if unlock is not [auto rewardable](../configs-format/unlocks-config-format#auto-rewarding-unlocks) and there is a difference with `stage`, you can reward [unlock manually](#grantrewards).
- `progress` shows the current value of [condition](../configs-format/unlocks-config-format#unlocks-format) and the `nextStage` shows which condition's value needs to go up to the next stage. For example: `gems` unlock has the `nextStage` equal to 192, and the `stage` equal to 95. That means what the stage 96 can be got when the `progress` reaches 192.
- `timestamp` is the time of last unlock update(e.g after the reward).
- [`lastSeenStage`](#setlastseenunlocks)

### ClnChangeStats

Client method for changing own user statistics. Can change only stats with flag [`allowChangeFromClient`](../configs-format/stats-config-format#stats-format)
The token parameter is user jwt token. External userid not allowed, action can change **only user own statistics**. Response contains user stats and unlocks.

```json
{
  "jsonrpc": "2.0",
  "id": "092a4b0a-2857-478f-a5b9-c922df72fe2c",
  "method": "ClnChangeStats",
  "params": {
    "token": "qWerty",
    "appid": 1145,
    "transactid": 12345678,
    "__body__": {
      "$filter": { "stats": ["level"], "unlocks": ["gem"] }, //add stat "level" and unlock "gem" to response
      "$mode": ["default"],
      "$tables": ["global"],
      "level": 1 // increase the level stat by 1
    }
  }
}
```

`$mode`, `$tables` (_array of strings_) - parameters defining for which mode and table we want to change stats, works like in [ChangeStats method](userstat-api/#changestats).
$filter - parameter defining response filter. This is an aggregation of filter from GetStats and GetUnlocks methods, so the filter can contains next fields:

- `tables` (_array of string_) - statistics tables which will be added to response
- `modes` (_array of string_) - statistics modes which will be added to response
- `stats` (_array of string_) - stat names which will be added to response
- `unlocks` (_array of string_) - unlock names which will be added to response

<details>
<summary>Response:</summary>

```json
{
  "id": "81acdf80-a423-4c62-8ffb-d3aee72ae164",
  "jsonrpc": "2.0",
  "result": {
    "timestamp": 1669031289,
    "stats": {
      "global": {
        "$index": 1,
        "default": {
          "level": 191
        }
      }
    },
    "personalUnlocks": {},
    "unlocks": {
      "gems": {
        "lastRewardedStage": 94,
        "lastSeenStage": -1,
        "nextStage": 192,
        "progress": 190,
        "stage": 95,
        "timestamp": 1666276680
      }
    }
  }
}
```
</details>


### AnoGetStats

WIP


### AnoGetUnlocks

WIP


### GrantRewards

Method for the awarding user by unlock.
Lets take a look onto `gems` unlock from [GetUnlocks](#getunlocks) response. The **stage** exceeds the `lastRewardedStage`. That means it can be rewarded with following request:

```json
{
  "jsonrpc": "2.0",
  "id": "20509a19-478a-421d-ba8c-8600b3f9004b",
  "method": "GrantRewards",
  "params": {
    "appid": 1197,
    "token": "asdfG", // user token
    "__body__": {
      "unlock": "gems",
      "stage": 95
    }
  }
}
```

<details>
<summary>Response:</summary>
Response:

```json
{
  "id": "14a459a2-749e-4d7f-9899-672b7d9f6624",
  "jsonrpc": "2.0",
  "result": {
    "personalUnlocks": {},
    "timestamp": 1666277824,
    "unlocks": {
      "gems": {
        "lastRewardedStage": 95,
        "lastSeenStage": -1,
        "nextStage": 192,
        "progress": 190,
        "stage": 95,
        "timestamp": 1666277824
      },
      "level": {
        "lastRewardedStage": 148,
        "lastSeenStage": -1,
        "nextStage": 2215,
        "progress": 2208,
        "stage": 148,
        "timestamp": 1666250620
      }
    }
  }
}
```
</details>

As seen, the response format is the same as for the [GetUnlocks](#getunlocks). `gems`-unlock is succesfully rewarded and now if we call [GetStats](#getstats), `gems`-stat value will be **95**, because as seen from [GetDescription](#getdescription) every unlock stage updates `gems`-stat by 1.

### SetLastSeenUnlocks

Method for changing unlock's `lastSeenStage` field. This field can be useful for GUI-notifications for the user if he has unseen unlocks, which can be rewarded. Mark what the unlock was seen by user with request:

```json
{
  "jsonrpc": "2.0",
  "id": "14a459a2-749e-4d7f-9899-672b7d9f6624",
  "method": "SetLastSeenUnlocks",
  "params": {
    "appid": 1197,
    "token": "asdfG", // user token
    "__body__": {
      "gems": 95, // stage
      "level": 148 // stage
    }
  }
}
```

The respose is just:

```json
{
  "id": "84f2801b-7a73-4889-8bcb-9aa1daaf9941",
  "jsonrpc": "2.0",
  "result": "OK"
}
```

Now [GetUnlocks](#getunlocks) returns `lastSeenStage` equal **95**, **148** for `gems`, `level` respectively.
