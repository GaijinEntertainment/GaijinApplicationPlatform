---
title: Contacts config format
---

# Player Contacts

Friends are an essential part of all modern games. On our service, friends are implemented more flexible, as contacts.

# Contacts config

To use contacts you need to add the description to [contacts config](./../gui/configs-management#single-config), and [deploy configs](./../gui/configs-management#deploy-configs) to services.

**Contacts description format**:

```json
{
  "allowedGroups": ["Arkanoid"]              // required
}
```

#### Required fields

- `allowedGroups` (_list of string_) - contacts group allowed in the game.

All contacts in game can be splitted by groups. 
You can use only one group in your game, for example named as game:

```json
{
  "allowedGroups": ["DungeonGame"]
}
```

Or different, for example to have different friends in different game modes:

```json
{
  "allowedGroups": ["DungeonGame_solo", "DungeonGame_duo", "DungeonGame_squad"]
}
```

Read about [contacts API](./../services-api/contacts-api) to understand how to use groups in your game.
