---
title: Stats config format
---

# Player statistics

Player statistics are an important part of all modern games. Most game mechanics, such as character leveling and abilities, achievements, leaderboards, player rewarding, etc use player statistics.
This article describes the format of stats config, also provides examples of different stats.
You can read about the interaction between the game and the statistics server here: [Userstat Api](../services-api/userstat-api.md).

## Stat format

To use and store statistics you need to add stats description to [stats config](../gui/configs-management.md#multi-element-config), and [deploy configs](../gui/configs-management.md#deploy-configs) to services.

**Stat description format**:

```json
{
  "name": "kills_death_rating",                 // required
  "type": "FLOAT",                              // required

  "minValue": 0,                                // optional
  "maxValue": 1,                                // optional
  "defValue": 0                                 // optional, default = 0
  "window": 20,                                 // optional
  "onlyIncrement": true,                        // optional, default = false
  "leaderboard": true,                          // optional, default = false
  "showForAll": true,                           // optional, default = false
  "allowChangeFromClient": false                // optional, default = false
  "meta": {},                                   // optional
  "condition": "s.death ? s.kills/s.death : 0"  // optional
  "gameModesEnabled": ["solo"]                  // optional
  "gameModesDisabled": ["duo"]                  // optional
}
```

#### Required fields:

- `name` (_string_) - name of the stat, must be unique.
- `type` (_string_) - type of the stat, possible values:
  - "INT" - stat with integer value.
  - "FLOAT" - stat with float value.
  - "AVGRATE" - stats calculate as moving average.

#### Optional fields:

- `minValue` (_int or float_) - if set, restrict the minimal value of the stat.
- `maxValue` (_int or float_) - if set, restrict the maximum value of the stat.
- `defValue` (_int or float_) - initial value of the stat.
- `window` (_float_) - coefficient for calculation the moving average, must be > 0. Works only for type = AVGRATE. See [moving average calculation](#moving-average).
- `onlyIncrement` (_bool_) - if = true, the value of the stat can't decrease.
- `leaderboard` (_bool_) - determines whether the stat should be displayed in the leaderboard.
- `showForAll` (_bool_) - determines whether the stat should be visible to another user.
  :::note
  To request another user statistics use [AnoGetStats action](../services-api/userstat-api.md#anogetstats).
  Stats will be returned only for **public** [tables](tables-config-format.md#table-format) and [modes](modes-config-format.md#mode-format).
  :::
- `allowChangeFromClient` (_bool_) - determines the possibility of changing stat by the client.
  :::caution
  use this flag only for non-important statistics or at your own risk, because the client is not protected from hacking, so the statistics can be cheating by the user himself. For changing stat by client use action [ClnChangeStats](../services-api/userstat-api.md#clnchangestats)
  :::
- `meta` (_json object_) - field for custom game data. Can be used to pass arbitrary data to the game client. The value must be a json object
- `condition` (_string_) - if set, the stat value calculate from other stats specified in condition. Calculable stats can't be set or change outside, if you try change, stat will remain unchanged.
- `gameModesEnabled` (_array of string_) - if set, the stat will be created and changed only for the specified modes.
- `gameModesDisabled` (_array of string_) - if set, the stat will not be created and changed for the specified modes. Works only if _gameModesEnabled_ is not set or empty.

### Condition format

Condition is a [quirrel](https://quirrel.io/doc/index.html) language expression. The type of the return value must be compatible with the declared type of the stat.
Stats in the condition are written as: `s.stat_name`. See [calculable stat example](#calculable-stats).

### Condition examples

- kill/death rating calculation:

```
"condition: s.death ? s.kills/s.death.tofloat() : 0"
```

`death` and `kills` - stat names.

- some arbitrary rating calculation:

```
"condition: s.battles_count > 10 ? s.battles_count*s.score : 100"
```

`battles_count` and `score` - stat names.

## Stat examples

### Simple stats

Simple stat used to store a player game statistics. Can be used to calculate other stats and [unlocks](unlocks-config-format.md).

`battle_level` - player level in the battle, type int, can be decrease, not written to leaderboard.

```json
{
  "name": "battle_level",
  "type": "INT"
}
```

`kills` - player kills count, type int, can't be decrease, write to leaderboard.

```json
{
  "name": "kills",
  "type": "INT",
  "onlyIncrement": true,
  "leaderboard": true
}
```

`accuracy` - player shooting accuracy, type float, can be decrease, not written to leaderboard, restrict by minimum and maximum value, has a default value.

```json
{
  "name": "accuracy",
  "type": "FLOAT",
  "minValue": 0.2,
  "maxValue": 1.0,
  "defVal": 0.2
}
```

### Moving average

`relativePlayerPlace` - moving average player place, write to leaderboard.

```json
{
  "name" : "relativePlayerPlace",
  "type" : "AVGRATE",
  "window" : 20
  "leaderboard" : true,
}
```

#### Moving average calculation

To calculate moving average using old value of the stat(oldVal), new value of the stat(val), duration(len), and window(determine in stat config). val and len set in the request to [change stats](../services-api/userstat-api.md#changestats).

Formula for calculation the moving average: `newVal = len/window < 1 ? val/window + oldVal(1- len/window): val/len`

`window` - determines weight of new and old value in calculating.
If len > window - ignoring the oldVal when calculation result.
If window more greater than len - val almost does not change result.

### Calculable stats

Calculable stats using to compute and store complex statistics. At most its different ratings and average values. See [Condition format](#condition-format).

- `win_rate` - stat show player battle wins rating.
- `battle_count` and `battle_wins` stats using for calculation.
- `battle_count` - total number of player battles.
- `battle_wins` - total number of player wins in battles.

Below are descriptions of the stats: `battle_count`, `battle_wins` and calculable stat: `win_rate`.

```json
{
  "name" : "battle_count",
  "type" : "INT",
  "onlyIncrement" : true,
},
{
  "name" : "battle_wins",
  "type" : "INT",
  "onlyIncrement" : true,
},
{
  "name" : "win_rate",
  "type" : "FLOAT",
  "leaderboard" : true,
  "condition" : "s.battle_count ? s.battle_wins/s.battle_count.tofloat() : 0"
}
```

- `avg_score` - stat show the average player score for one life.
- `lifes_count` and `total_score` stats using for calculation.
- `lifes_count` - total number of lives spent by the player.
- `total_score` - total game score.

Below are descriptions of the stats: `lifes_count`, `total_score` and calculable stat: `avg_score`.

```json
{
  "name" : "lifes_count",
  "type" : "INT",
  "onlyIncrement" : true,
},
{
  "name" : "total_score",
  "type" : "INT",
  "onlyIncrement" : true,
},
{
  "name" : "avg_score",
  "type" : "FLOAT",
  "leaderboard" : true,
  "condition" : "s.lifes_count ? s.total_score/s.lifes_count.tofloat() : 0"
}
```

### Special stats

All special stats starts with `__`, please don't use this prefix for game specific stats.

#### Leaderboard group

`__leaderboardGroup` - WIP
