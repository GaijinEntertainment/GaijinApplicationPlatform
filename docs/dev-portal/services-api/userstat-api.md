---
title: Userstat API
---

This section describes the Userstat API that enables an interaction between the game and the statistics server. The Userstat API uses the [json-rpc protocol](https://www.jsonrpc.org/specification).

For details on using stats, see the [Player statistics](../configs-format/stats-config-format.md) section.

## Description of common action parameters

### Parameters required for all methods

- `appid` (_int_) - application id
- `token` (_string_) - service token or user token

### Parameters required for specific methods

- `transactid` (_int_) - transaction id; in some methods (e.g. [ChangeStats](#changestats)), this parameter must be unique for the packet of changes, which allows to avoid mistakes when recalling a method.
- `userid` (_int_) - some methods (e.g. [ChangeStats](#changestats)) require unique user id.
- `__body__` (_json object_) - object with request parameters for the unlocks/stats data.

Note that some methods use the same parameters:

- `table` (_string_) - has the same meaning as described in the [unlocks doc](../configs-format/unlocks-config-format.md#unlocks-format). It represents a time namespace for calculating statistics, such as:
  - _global_ - stats for all time
  - _day_ - stats for one day

:::note

Currently, only the _global_ `table` is available.

:::

- `index` (_int_) - table index; sequence number for repeating tables (e.g. day table).
- `mode` (_string_) - has the same meaning as described in the [unlocks doc](../configs-format/unlocks-config-format.md#unlocks-format). Currently, only the _default_ mode is available.

## Admin/Server methods

To ensure the security, it is recommended to call these methods from the server and/or protected apps.

### ChangeStats

Method for changing user statistics. The `token` parameter must belong to the user with permissions to change stats, while the `userid` parameter is the id of the user, which stats to be changed.

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

- `$tables` (_string array_) - This optional parameter specifies the tables for which stats will be changed. If undefined, stats will be changed for all tables.
- `$mode` (_string array_) - parameters that define which modes are used to change stats. For details on using statistic modes, click [here](../configs-format/modes-config-format).
  The next key/value pairs means stat_name/increment_value. For the “kill” stat, you have the option to set the increment argument explicitly, where it can be incremented by 10, while the “exp” stat is incremented by 1.


Another way to change stats is to use `"$set"`, which enables you to assign a value to the stat:

```json
"__body__": {
  "$mode": ["default"],
  "$tables": ["global"],
  "exp": {"$set": 100}, // now "exp" is 100
}
```

For the stats, calculating as [moving average](../configs-format/stats-config-format.md#moving-average), the `$avg` parameter is used:

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

For the sessional stats (e.g. "kills per battle"), the `$sessionId` parameter is used:

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

This method requests stats and unlocks description.

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
The following fields are present in the response, but we currently do not support them.

    - rewardsTag
    - currencyCode
    - minPrice
    - price
    - personal
    - purchaseRequirement
    - tags
    - ps4Id
    - xboxId

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

See [stats description format](../configs-format/stats-config-format.md) and [unlocks description format](../configs-format/unlocks-config-format.md) for details.

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

The parameters  `tables`, `modes`, `stats` (string array) work as filter values. When the parameter value is `{}`, `[]`, `null` or absent, the filter becomes empty, resulting in all user stats being sent for this filter type. If some values are set, the response will only include the suitable stats as shown in the examples below:

<details>
<summary>Response on request without "params" <b>(without filters)</b>:</summary>

```json
{
  "jsonrpc": "2.0",
  "id": "ecdf8a03-a1bf-43f4-96eb-06550cdb63f9",
  "result": {
    "stats": {
      "global": {
        // table name
        "$index": 1,
        "default": {
          // mode name
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
      "global": {
        // table name
        "$index": 1,
        "default": {
          // mode name
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

This method is used to request the user’s unlocks progress.

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

The parameters  `unlocks` (_string array_) work as filter values. When the parameter value is `{}`, `[]`, `null` or absent, the filter becomes empty, resulting in all user unlocks being sent for this filter type. If the value is set, the response will only include the suitable unlocks as shown in the examples below:



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

The request without filter:

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

The response contains data of unlocks, grouped by names.

- `stage` value indicates the current unlock's stage.
- `lastRewardedStage` is the last rewarded stage. So if unlock is not [auto rewardable](../configs-format/unlocks-config-format.md#auto-rewarding-unlocks) and there is a difference with `stage`, you can reward [unlock manually](#grantrewards).
- `progress` shows the current [condition](../configs-format/unlocks-config-format.md#unlocks-format) value and the `nextStage` shows which condition value is required to go up to the next stage. For example: for the `gems` unlock, the `nextStage` value is 192, and the `stage` value is 95. This means that you can reach `stage` 96 when the `progress` reaches 192.
- `timestamp` is the time of the last unlock update (e.g. after the reward).
- [lastSeenStage](#setlastseenunlocks) - the field is used for GUI-notifications for the user who has unseen unlocks that can be rewarded.

### ClnChangeStats

A client method for changing the user’s own statistics. With this method, you can change only stats with the [`allowChangeFromClient`](../configs-format/stats-config-format.md) flag.

The token parameter is a jwt token user. An external user id is not allowed. This method can change **only the user's own statistics**. Response contains user stats and unlocks.

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

- `$mode`, `$tables` (_array of strings_) - parameters defining for which mode and table stats are to be changed (work like in the [ChangeStats method](#changestats)).
- `$filter` -  the response filter parameter - an aggregation of filters from the GetStats and GetUnlocks methods. The filter can contain the following fields:

   - `tables` (_string array_) - statistics tables which will be added to response
   - `modes` (_string array_) - statistics modes which will be added to response
   - `stats` (_string array_) - stat names which will be added to response
   - `unlocks` (_string array_) - unlock names which will be added to response


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


This method is for awarding a user by unlock.

Let’s consider the `gems` unlock from the [GetUnlocks](#getunlocks) response. The **stage** exceeds the `lastRewardedStage`, so it can be rewarded with the following request:


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

As seen from the example above, the response format is the same as for the [GetUnlocks](#getunlocks); the `gems` unlock is rewarded successfully. Now, if you call [GetStats](#getstats), the `gems` stat value will be **95**, because every unlock stage updates the `gems` stat by 1 (see [GetDescription](#getdescription) ).


### SetLastSeenUnlocks

The method is for changing the unlock’s `lastSeenStage` field. This field is useful for GUI-notifications for a user who has unseen unlocks that can be rewarded. Mark which the unlock was seen by the user with the following request:

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
