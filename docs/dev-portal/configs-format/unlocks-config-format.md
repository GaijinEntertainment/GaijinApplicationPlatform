---
title: Unlocks config format
sidebar_position: 4
---

# Player Achievements

Most modern game use players achievements. The achievement can be simple, like killing 10 zombies, or more complex, tracking changes of player level, player abilities, battle pass level, etc.  
In our services, player achievements are implemented as unlocks. [Player statistics](stats-config-format) are used to open unlocks.

This article describes the format of unlocks config and provides examples of simple and complex unlocks.
You can read about using unlocks in your game here: [Userstat Api](./../services-api/userstat-api#userstat-api).

## Unlocks format

To use and store an unlock you need to add its description to [unlocks config](./../gui/configs-management#multi-element-config) and [deploy configs](./../gui/configs-management#deploy-configs) to services.

**Unlock description format**:

```json
{
  "name": "pistol_master",           // required
  "type": "NORMAL",                  // required
  "table": "global",                 // required
  "condition": "s.pistol_kills",     // required
  "stages": [{"progress": 10}],      // required

  "mode": "default",                 // optional
  "hidden": false,                   // optional, default = false
  "periodic": false,                 // optional, default = false
  "startStageLoop" 0                 // optional, default = 0
  "autoRewarding": false,            // optional, default = false
  "dynamicUnlock": false,            // optional, default = false
  "dynamicProgress": false,          // optional, default = false
  "dynamicRewards": false,           // optional, default = false
  "showForAll": false,               // optional, default = false
  "requirement": "",                 // optional
  "meta": {},                        // optional
}
```

#### Required fields:

- `name` (_string_) - name of the unlock, must be unique.
- `type` (_string_) - type of the unlock, possible values:
  - "NORMAL" - simple unlock. [example](#simple-unlocks)
  - "SESSIONAL" - unlock progress is calculated using statistics of a single session. This type of unlock opens only _once_. [example](#sessional-unlocks).
  - "MULTISESSIONAL" - unlock works as SESSIONAL but it can be opened _multiple_ times. [example](#multisessional-unlocks).
- `table` (_string_) - The name of the table for calculating the unlock condition. See [Statistic tables](tables-config-format).
- `condition` (_string_) - a [quirrel](https://quirrel.io/doc/index.html) language expression used to calculate the unlock progress. The format is equivalent to [stats condition](stats-config-format#condition-format).
- `stages` (_json array_) - array of unlock stages. An unlock must have at least one stage but may have more. See [stage description format](#stages-format).

#### Optional fields:

- `mode` - the name of the game mode for calculating the unlock condition. See [Statistic modes](modes-config-format).
- `hidden` (_bool_) - if = true, hide unlock from user. Hidden unlocks used like helper to implement some complex mechanics. [examples](#hidden-unlocks).
- `periodic` (_bool_) - if = true, the unlock stages are considered cyclic. [example](#periodic-unlocks).
- `startStageLoop` (_int_) - the number of the stage at which the cycle will begin. Works only if periodic field value is set to true. [example](#progressive-player-level).
- `autoRewarding` - if = true, the rewards of the unlock stage will be received automatically when the unlock stage opens. [example](#auto-rewarding-unlocks) Otherwise you need to use userstat api to [reward unlock](./../services-api/userstat-api#grantrewards).
- `dynamicUnlock` (_bool_) - if = true, the unlock progress and stage will be decreased when the result of condition expression decreases. [example](#dynamic-unlocks).
- `dynamicProgress` (_bool_) - if = true, only the unlock progress will be decreased when the result of condition expression decreases, the unlock stage remains unchanged. [example](#dynamic-progress).
- `dynamicRewards` (_bool_) - if = true, the unlock awards will be given at each opening of the unlock stage. Works only if dynamicUnlock is true. If the unlock stage was awarded, then decreased and then increased again, and that stage has to be rewarded again, set this flag to true. [example](#dynamic-rewards).
- `showForAll` (_bool_) - determines whether the unlock should be visible to another user. To request another user unlocks use [AnoGetUnlocks action](./../services-api/userstat-api#anogetunlocks).
- `requirement` (_string_) - the unlocks necessary for given unlock awards. If the player does not open the required unlocks, the rewards will not be given. [examples](#unlocks-with-requirement)
  Requirement format: `"unlock1 & unlock2"` if player does not open unlock1 and unlock2, the rewards will not be given.
- `meta` (_json object_) - field for custom game data. Can be used to pass arbitrary data to the game client. The value must be a json object. [example](#using-meta).

### Stages format

Each stage has:

- `progress` (_int_) - if the condition expression result is equal to or greater than the progress value, the stage is considered open.
- `updStats` (_json array_) - when a stage is opened, the player can get stage rewards, like extra statistics.

```json
"stages" :
[
  {
    "progress" : 10
  },
  {
    "progress" : 20
    "updStats" :
    [
      {
        "mode" : "default",
        "name" : "rating",
        "value" : 3,
        "type" : "ADD"
      },
      {
        "mode" : "default",
        "name" : "helper_stat",
        "value" : 1,
        "type" : "SET"
      }
    ]
  },
  {
    "progress" : 30
    "updStats" :
    [
      {
        "mode" : "default",
        "name" : "penalty",
        "value" : -2,
        "type" : "ADD"
      }
    ]
  }
]
```

The unlock in the example above has 3 stages:

**Stage 1** will be opened when the progress is equal or greater than 10. Stage 1 does not contain rewards.

**Stage 2** will be opened when the progress is equal or greater than 20. Stage 2 updates two stats as a reward:

- increase the _rating_ stat value by 3 for _default_ mode.  
  If type is "ADD" then the new stat value calculated as `stat_value += unlock_award_value`.
- set _helper_stat_ value to 1 for _default_ mode. If type is "SET", sets the specified stat value directly.

**Stage 3** will be opened when the progress is equal or greater than 20. Stage 3 updates one stat as a reward:

- _penalty_ value is decreased by 2 for _default_ mode.

## Unlocks examples

### Simple unlocks

A simple unlock can be used for some simple player achievements.  
**firstSoloKill** - player achievement for the first kill in _solo_ mode. The unlock opens when player make the first kill in _solo_ mode.

```json
{
  "name": "firstKill",
  "type": "NORMAL",
  "table": "global",
  "mode": "solo",
  "condition": "s.kills",
  "stages": [{ "progress": 1 }]
}
```

Also you can use simple unlocks as a helper for more complex unlocks to split some logic.

### Hidden unlocks

#### Win Limit helper
**winLimitHelper** - unlock opens when player wins 10 battles in squad mode. Unlock is hidden from user.  
Can be used as a helper, for example to block other unlock rewards. See [grenadeKiller](#grenade-killer) example

```json
{
  "name": "winLimitHelper",
  "type": "NORMAL",
  "table": "global",
  "mode": "squad",
  "hidden": true,
  "condition": "s.wins",
  "stages": [{ "progress": 10 }]
}
```

#### Premium helper
**premiumHelper** - unlock opens if player has the premium stat. Unlock is hidden from user.  
Premium stat can be incremented and decremented, so dynamicUnlock is used to open and close unlock when premium stat value changes.  
Can be used as a helper to block other unlocks rewards. See [premiumKiller](#premium-killer) example

```json
{
  "name": "premiumHelper",
  "type": "NORMAL",
  "table": "global",
  "mode": "default",
  "hidden": true,
  "condition": "s.premium",
  "dynamicUnlock": true,
  "stages": [{ "progress": 1 }]
}
```

### Periodic unlocks

Each unlock stage opens when condition expression value >= stage progress. The following shows how to calculate the progress of an arbitrary stage of a periodic unlock:
The progress of an arbitrary stage of a periodic unlock is equal to sum of progress difference of previous stages. We can split this sum to the following parts:

- the progress of the stages preceding the start of the cycle stage, let's call it `progressPrevCycleStartStage`
- the sum of full cycle progress difference is equal to `cycles_count*cycle_delta`.  
  `cycles_count = (stage - startStageLoop + 1)/ (last_stage - startStageLoop + 1)`  
  _stage_ - the arbitrary stage number.  
  _last_stage_ - the number of the last stage specified in the unlock description.  
  _startStageLoop_ - value of startStageLoop unlock field.  
  `cycle_delta = lastStageProgress - progressPrevCycleStartStage`  
  _lastStageProgress_ - the progress of the last stage specified in the unlock description
- the progress of the unfinished cyclical stage: `stageIdx_progress - progressPrevCycleStartStage`  
  _stageIdx_progress_ - the stage progress from the unlock description, when stageIdx calculate as:  
  `stageIdx = (stage - startStageLoop + 1) mod (last_stage - startStageLoop + 1)`

So, formula to calculate arbitrary stage progress is as follows:  
`arbitraryStageProgress = progressPrevCycleStartStage + cycles_count*cycle_delta + stageIdx_progress - progressPrevCycleStartStage`  
simplifier:  
`arbitraryStageProgress = cycles_count*cycle_delta + stageIdx_progress`

let's look at the examples:
#### Simple player level
periodic unlocking with 1 cyclic stage.

```json
{
  "name": "simplePlayerLevel",
  "type": "NORMAL",
  "table": "global",
  "mode": "default",
  "periodic": true,
  "condition": "s.playerExp",
  "stages": [{ "progress": 10 }] //stage 1, 2, 3 ...
}
```

`cycle_delta = 10`

Stages will open repeatedly when condition result >= stage\*progress:

- **stage 1** - stageIdx = 1, cycles_count = 0. progress = 10
- **stage 2** - stageIdx = 1, cycles_count = 1. progress = 20
- **stage 3** - stageIdx = 1, cycles_count = 2. progress = 30
- ...

For this example, you can also use a simpler formula: `arbitraryStageProgress = stage_num*progress`

#### Progressive player level 
periodic unlocking with 5 stages, the cycle starts at the 4th stage.

```json
{
  "name": "simplePlayerLevel",
  "type": "NORMAL",
  "table": "global",
  "mode": "default",
  "periodic": true,
  "startStageLoop": 4,
  "condition": "s.playerExp",
  "stages": [
    { "progress": 5 }, //stage 1
    { "progress": 15 }, //stage 2
    { "progress": 30 }, //stage 3
    { "progress": 50 }, //stage 4, 6, 8 ...
    { "progress": 100 } //stage 5, 7, 9 ...
  ]
}
```

`cycle_delta = stage_5_progress - stage_3_progress = 70`

calculate arbitrary stage progress using formula: `arbitraryStageProgress = cycles_count*70 + stageIdx_progress`

- **stage 1** - stageIdx = 1, cycles\*count = 0. progress = 5
- **stage 2** - stageIdx = 2, cycles\*count = 0. progress = 15
- **stage 3** - stageIdx = 3, cycles\*count = 0. progress = 30
- **stage 4** - stageIdx = 4, cycles\*count = 0. progress = 50
- **stage 5** - stageIdx = 5, cycles\*count = 0. progress = 100
- **stage 6** - stageIdx = 4, cycles\*count = 1. progress = 120
- **stage 7** - stageIdx = 5, cycles\*count = 1. progress = 170
- **stage 8** - stageIdx = 4, cycles_count = 2. progress = 190
- ...

### Auto rewarding unlocks

You can use the auto rewarding unlocks to reward the user immediately after opening the unlock stage.  
For example for some extra experience:  
**expForLoot** - immediately add extra experience points when player has looted 100 items:

```json
{
  "name": "expForLoot",
  "type": "NORMAL",
  "table": "global",
  "mode": "default",
  "condition": "s.lootedItems",
  "autoRewarding": true,
  "stages": [
    {
      "progress": 100,
      "updStats": [
        {
          "mode": "default",
          "name": "playerExp",
          "value": 15,
          "type": "ADD"
        }
      ]
    }
  ]
}
```

### Sessional unlocks

SESSIONAL unlocks calculate condition result using statistics from a single session. See [send session result](./../services-api/userstat-api#sessional-stats).  
Sessional unlocks can be opened only once.  
**battleKiller** - kill 10 enemies in one battle. Increment sessionalUnlocksCount stat as rewards. Open only once.

```json
{
  "name": "battleKiller",
  "type": "SESSIONAL",
  "table": "global",
  "mode": "default",
  "condition": "s.kills",
  "stages": [
    {
      "progress": 10,
      "updStats": [
        {
          "mode": "default",
          "name": "sessionalUnlocksCount",
          "value": 1,
          "type": "ADD"
        }
      ]
    }
  ]
}
```

### Multisessional unlocks

MULTISESSIONAL unlocks work like sessional ones but can be opened in each session  
**battleBonus** - opens in each battle(session) in which players rating >= 5 and rewards 10 extra playerExp points.

```json
{
  "name": "battleKiller",
  "type": "MULISESSIONAL",
  "table": "global",
  "mode": "default",
  "condition": "s.rating",
  "stages": [
    {
      "progress": 5,
      "updStats": [
        {
          "mode": "default",
          "name": "playerExp",
          "value": 10,
          "type": "ADD"
        }
      ]
    }
  ]
}
```

### Dynamic unlocks

The unlock progress and stage will be decreased when the result of condition expression is decreased, example:  
**karmaLevel** - unlock with 3 stages that can be increased and decreased according to karma statistics.

```json
{
  "name": "karmaLevel",
  "type": "NORMAL",
  "table": "global",
  "mode": "default",
  "condition": "s.karma",
  "dynamicUnlock": true,
  "stages": [{ "progress": 5 }, { "progress": 20 }, { "progress": 70 }]
}
```

If the karma stat increases to 5 then the karmaLevel stage = 1.  
If then the karma stat decreases then karmaLevel stage is also decreased and will be equal to 0.  
Similarly with stages 2 and 3. Unlock progress and stage change dynamically when the condition expression value is changed:

- **stage 0** - karma < 5
- **stage 1** - karma >= 5 and karma < 20
- **stage 2** - karma >= 20 and karma < 70
- **stage 3** - karma >= 70

### Dynamic progress

The unlock progress will be decreased when the result of condition expression is decreased, but stage cannot decrease, example:  
**ratingLevel** - unlock with 5 stage. Once unlock stage is opened, it can't decrease.

```json
{
  "name": "ratingLevel",
  "type": "NORMAL",
  "table": "global",
  "mode": "default",
  "condition": "s.playerRating",
  "dynamicProgress": true,
  "stages": [{ "progress": 10 }, { "progress": 20 }, { "progress": 30 }]
}
```

When the progress decreases the unlock stage remains the same. Consider the following scenario:  
In the beginning playerRating stat = 22, unlock stage will be = 2.  
Then the playerRating stat decreases to 12, but the unlock stage stays = 2.  
Then the playerRating stat increases to 25, but unlock stage remains = 2, because 25 >= 20 and 25 < 30  
Only when playerRating is increased to 30 or more, unlock stage changes to 3 and stays equal to 3 forever.

### Dynamic rewards

Works only with [dynamicUnlocks](#dynamic-unlocks). Allows the unlock to give out awards more than once, each time an unlock stage is opened.  
**winSequence** - reward player by extra playerExp stat each time when player wins a sequence of 5 battles.

```json
{
  "name": "winSequence",
  "type": "NORMAL",
  "table": "global",
  "mode": "default",
  "condition": "s.consecutiveWins",
  "dynamicUnlock": true,
  "dynamicRewards": true,
  "stages": [
    {
      "progress": 5,
      "updStats": [
        {
          "mode": "default",
          "name": "playerExp",
          "value": 10,
          "type": "ADD"
        },
        {
          "mode": "default",
          "name": "consecutiveWins",
          "value": 0,
          "type": "SET"
        }
      ]
    }
  ]
}
```

Also when unlock is rewarded, consecutiveWins stat resets to 0. It's needed to start next sequence.

### Unlocks with requirement

#### Grenade killer
**grenadeKiller** - unlock opens when player kills 5 enemies with grenades. But the player cannot receive rewards until [winLimitHelper](#win-limit-helper) is opened too.

```json
{
  "name" : "grenadeKiller",
  "type" : "NORMAL",
  "table" : "global",
  "mode" : "default",
  "condition" : "s.grenadeKill",
  "requirement" : "winLimitHelper"
  "stages" :
  [
    {
      "progress" : 5,
      "updStats" :
      [
        {
          "mode" : "default",
          "name" : "level",
          "value" : 3,
          "type" : "ADD"
        }
      ]
    }
  ]
}
```

#### Premium killer
**premiumKiller** - unlock opens when player kills 100 enemies. But the player cannot receive rewards until [premiumHelper](#premium-helper) is opened too.

```json
{
  "name" : "premiumKiller",
  "type" : "NORMAL",
  "table" : "global",
  "mode" : "default",
  "condition" : "s.kill",
  "requirement" : "premiumHelper"
  "stages" :
  [
    {
      "progress" : 100,
      "updStats" :
      [
        {
          "mode" : "default",
          "name" : "premiumLevel",
          "value" : 5,
          "type" : "ADD"
        }
      ]
    }
  ]
}
```

#### Premium grenade killer
Unlock may require 2 or more other unlocks, for example:
**premiumGrenadeKiller** - unlock opens after player kills 20 enemies with grenades. But the player cannot receive rewards until [winLimitHelper](#win-limit-helper) and [premiumHelper](#premium-helper) are opened too.

```json
{
  "name" : "grenadeKiller",
  "type" : "NORMAL",
  "table" : "global",
  "mode" : "default",
  "condition" : "s.grenadeKill",
  "requirement" : "winLimitHelper & premiumHelper"
  "stages" :
  [
    {
      "progress" : 20,
      "updStats" :
      [
        {
          "mode" : "default",
          "name" : "premiumLevel",
          "value" : 10,
          "type" : "ADD"
        }
      ]
    }
  ]
}
```

### Using meta

You can use the meta field to pass some game-specific data to the client. For example the image file name to display unlock on the client:

```json
{
  "name": "pistolKiller",
  "type": "NORMAL",
  "table": "global",
  "mode": "default",
  "condition": "s.pistolKills",
  "stages": [{ "progress": 10 }],
  "meta": { "fileName": "/images/pistolKiller.png" }
}
```

Meta field value must be _json object_.
