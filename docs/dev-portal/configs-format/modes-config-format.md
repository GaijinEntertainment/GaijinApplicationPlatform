---
title: Modes config format
---

# Statistic modes

Modes makes work with [user statistic](stats-config-format.md) more flexible.
Modes is an abstract like a container for statistics, for example:

- different game types: solo, squad, etc.
- different countries: ussr, germany, etc.
- different locations: Moscow, Berlin, etc.
- etc (everything you want in your game).

Each mode contains all user statstics and it can be different for each modes.
For example: user can have 4 kills in _solo_ mode and 10 kills in _squad_.

You can read about the interaction between the game and the statistics server here: [Userstat Api](../services-api/userstat-api.md).

## Mode format

To use and store statistics you need to add modes description to [modes config](../gui/configs-management.md#multi-element-config), and [deploy configs](../gui/configs-management.md#deploy-configs) to services.

**Mode description format**:

```json
{
  "name": "solo",             // required

  "leaderboard": "SIMPLE",    // optional, default = "NONE"
  "public": false             // optional, default = false
}
```

#### Required fields:

- `name` (_string_) - name of the mode, must be unique.

#### Optional fields:

- `leaderboard` (_string_) - type of the leaderboard creating for this mode, possible values:
    - "NONE" - leaderboard will not be generated for this mode.
    - "SIMPLE" - generate leaderboard without _groups_ for this mode.
    - "GROUPING" - generate groups leaderboard for this mode. Group can be used to implement leagues or buckets in leaderboard. See [Leaderboard group](stats-config-format.md#leaderboard-group)
- `public` (_bool_) - determines whether the stats for this mode should be visible to another user.

    !!!note
        This work only for stats with `showForAll = true`
        To request another user statistics use [AnoGetStats action](../services-api/userstat-api.md#anogetstats).
