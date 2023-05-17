---
title: Tables config format
---

# Statistic tables
Tables combined with [modes](modes-config-format)  makes work with [user statistic](stats-config-format) very flexible and abstract. Table is a time period container for statistics.  
For example:  
* day
* week
* season
* global

Each table contain all game modes which contain user statistics.
So you can use user statistic on each table independent, for [Leaderboards](../gui/leaderboard.md) or for [User achievements](unlocks-config-format)

You can read about the interaction between the game and the statistics server here: [Userstat Api](../services-api/userstat-api).

## Table format

To use and store statistics you need to add tables description to [tables config](../gui/configs-management#multi-element-config), and [deploy configs](../gui/configs-management#deploy-configs) to services.

**Table description format**:

```json
{
  "name": "season",                                                                  // required

  "leaderboard": "SIMPLE",                                                           // optional, default = "NONE"
  "public": false,                                                                   // optional, default = false
  "period": "6w",                                                                    // optional
  "indexOffset": 3,                                                                  // optional, default = 0
  "timeline": [{"start": "2020-01-01T00:00:00Z", "end": "2030-01-01T00:00:00Z"}],    // optional
  "slave": {"duration" : "1d", "master" : "season", "timeOffset" : "2w" },           // optional
  "autoSlaves": [{"period" : "1w", "name" : "week", "persistent" : true}]            // optional
}
```

#### Required fields:

- `name` (_string_) - name of the table, must be unique.

#### Optional fields:

- `leaderboard` (_string_) - type of the leaderboard creating for this table, possible values:
  - "NONE" - leaderboard will not be generated for this table.
  - "SIMPLE" - generate leaderboard without _groups_ for this table.
  - "GROUPING" - generate groups leaderboard for this table. Group can be used to implement leagues or buckets in leaderboard. See [Leaderboard group](stats-config-format#leaderboard-group)
- `public` (_bool_) - determines whether the stats for this table should be visible to another user.
  :::note
  This work only for stats with `showForAll = true` and `public` modes  
  To request another user statistics use [AnoGetStats action](../services-api/userstat-api#anogetstats).  
  :::
- `period` (_string_) - the period of the table, next season will start automatically after period time. Used only with `timeline` parameter. [Example](#periodic)  
  Format: number 1-16 digits and postfix(`s` - seconds, `m` - minutes, `h` - hours, `d` - days, `w` - weeks). For example: `12h`, `1d`, `1w`.  
- `indexOffset` (_int_) - table index offset, useful if you want to remove the old season. Only used with `timeline` parameter. [Example](#index-offset).  
:::caution
You can use only one parameter per table: `timeline`, `autoSlaves`, `slave`
:::
- `timeline` (_array_) - array of table time periods that are set manually. [Example](#seasons).  
  Array parameter is a json object that has the following fields:  
  * `start` (_string_) - date of the table time period start. Date example: `2020-05-15T11:00:00Z`
  * `end` (_string_) - date of the table time period end. Optional parameter, if not set table will be exist always.
- `slave` (_json object_) - block of parameters to create dependent table. See [Example](#slave-tables).  
  Slave table parameters:
  * `master` - name of the master table.
  * `duration` - duration(end - start) of the table timeline.
  * `timeOffset` - offset of slave start time from master table start time.
- `autoSlaves` (_array_) - array of the table generators. Each array element generate a sequence of tables. See [Examples](#auto-slave-tables).  
  Array parameter is a json object that has the following fields:  
  * `period` - the period of generated tables, each generated table will have duration = period.
  * `name` - the prefix of the name of generated tables, index will be added automatically. For example "name":"_week_" will generate tables: _week1_, _week2_, etc.
  * `persistent` - if true all generated tables will have end as master table, otherwise end = start + period.

:::caution
When the table is end all table statistics are cleared. In the next time period of the table, all statistics will be accumulated again.
:::

## Table examples

### Global table
This table always exists:  

**Global table**, not used for Leaderboard, not public  

```json
{
  "name": "global"
}
```

**Global lb table**, with Leaderboard and public  

```json
{
  "name": "global_lb",
  "leaderboard": "SIMPLE",
  "public": true
}
```

### Season tables
**season** - table with 4 seasons, last season is active now. Active season has index = 4.  
```json
{
  "name": "season",
  "timeline": [
    {
      "start": "2022-10-01T00:00:00Z"
      "end": "2022-12-31T00:00:00Z"
    },
    {
      "start": "2022-12-31T00:00:00Z"
      "end": "2023-02-10T00:00:00Z"
    },
    {
      "start": "2023-03-10T00:00:00ZZ"
      "end": "2023-04-15T00:00:00ZZ"
    },
    {
      "start": "2023-05-01T00:00:00ZZ"
      "end": "2030-01-01T00:00:00ZZ"
    }
  ]
}
```

#### Index offset
If old season timeline information not important for you, use `indexOffset` parametr for shorter.  
**season** - table with 4 seasons, first 2 removed and used indexOffset. So active season has index = 4.
```json
{
  "name": "season",
  "indexOffset": 2,
  "timeline": [
    {
      "start": "2023-03-10T00:00:00ZZ"
      "end": "2023-04-15T00:00:00ZZ"
    },
    {
      "start": "2023-05-01T00:00:00ZZ"
      "end": "2030-01-01T00:00:00ZZ"
    }
  ]
}
```

#### Periodic

**week** - periodic table starts in `2022-10-17T00:00:00Z` and repeated each week.
```json
{
  "name": "week",
  "period": "1w",
  "timeline": [
    {
      "start": "2022-10-17T00:00:00Z"
    }
  ]
}
```

**day** - periodic table starts in `2022-10-17T00:00:00Z` and repeated each day.
```json
{
  "name": "day",
  "period": "1d",
  "timeline": [
    {
      "start": "2022-10-17T00:00:00Z"
    }
  ]
}
```

### Slave tables
Slaves table helps implement difficult mechanics.  
**first 3 days** - save statistics for the first 3 days of the start of each season:  
```json
{
  "name": "first_3_days_of_season",
  "slave" : {
    "duration" : "3d",
    "master" : "season"
  }
}
```

Or you need to save statistics only **after first 3 days**:  
```json
{
  "name": "after_first_3_days",
  "slave" : {
    "master" : "season",
    "timeOffset" : "3d"
  }
}
```

When you add new season, and all slave tables will work automatically.  

### Auto slave tables
**tournament daily** - generate daily tables for the tournament.
```json
{
  "name": "tournament",
  "timeline": [
    {
      "start": "2023-05-01T12:00:00ZZ"
      "end": "2023-05-10T23:00:00ZZ"
    }
  ],
  "autoSlaves" : [
    {
      "period" : "1d",
      "name" : "tournament_day"
    }
  ],
}
```

Will be generated 10 tables:  
```json
[
  {
    "name": "tournament_day1",
    "timeline": [
      {
        "start": "2023-05-01T12:00:00ZZ"
        "end": "2023-05-02T12:00:00ZZ"
      }
    ]
  },
  {
    "name": "tournament_day2",
    "timeline": [
      {
        "start": "2023-05-02T12:00:00ZZ"
        "end": "2023-05-03T12:00:00ZZ"
      }
    ]
  },
  ...
  {
    "name": "tournament_day10",
    "timeline": [
      {
        "start": "2023-05-10T12:00:00ZZ"
        "end": "2023-05-10T23:00:00ZZ"
      }
    ]
  }
]
```
:::caution
Maximum number of automatically generated slave tables = 100.
:::
