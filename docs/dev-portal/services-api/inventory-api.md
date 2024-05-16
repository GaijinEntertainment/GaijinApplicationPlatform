---
title: Inventory API
---

Inventory API uses [json-rpc protocol](https://www.jsonrpc.org/specification) basically, but some methods supports json-rpc in part currently, this will be noted.

## Description of common action parameters

### Utility params (outside the `__body__` object)

- `appid` (_int_) - application id
- `userid` (_int_) - admin methods usually require user id
- `token` (_string_) - service or user token
- `transactid` (_int_) - for some methods this id must be unique for the packet of changes, in the case of a re-call this allows to avoid mistakes
- `__body__` (_json object_) - the special object which wraps the specific method's params

### Specific method params (`__body__` - wrapped)

- `itemdefid` (_int_) - the unique id of item description (i.e. id of item entity)
- `itemid` (_string_) - the unique id of particular item stack


## Admin/Server methods

The admin token is used for these actions. The inventory of _userid_ is modifed.

### AddItem

Adds (creates a new) item stack for the user inventory by. Uses _itemdefid_. Can create several stack with one action. Returns added items.
```json
{
  "jsonrpc": "2.0",
  "id": "ecdf8a03-a1bf-43f4-96eb-06550cdb63f9",
  "method": "AddItem",
  "params": {
    "appid": 1146,
    "token": "",
    "userid": 126516991,
    "transactid": 12345678,
    "__body__": {
        "itemdefid": [
            [
                12, // itemdefid
                1 // quantity
            ],
            [
                15, // itemdefid
                10 // quantity
            ]
        ]
    }
  }
}
```

### ConsumeItem

Consumes passed _quantity_ from _itemid_ stack. Consumed items have zero quantity and don't considered as inventory items in [GetInventory](#getinventory) (but can be returned with special action [getConsumedItems](#getconsumeditems)). Returns changed items.
```json
{
  "jsonrpc": "2.0",
  "id": "ecdf8a03-a1bf-43f4-96eb-06550cdb63f9",
  "method": "ConsumeItem",
  "params": {
    "appid": 1146,
    "token": "",
    "userid": 126516991,
    "transactid": 12345678,
    "__body__": {
        "itemid": "34563546",
        "quantity": 1
    }
  }
}
```

### ConsumeItemsByItemDef

Consumes passed _quantity_ of _itemdefid_ items. Returns changed items.
```json
{
  "jsonrpc": "2.0",
  "id": "ecdf8a03-a1bf-43f4-96eb-06550cdb63f9",
  "method": "ConsumeItemsByItemDef",
  "params": {
    "appid": 1146,
    "token": "",
    "userid": 126516991,
    "transactid": 12345678,
    "__body__": {
        "itemdefid": 12,
        "quantity": 1
    }
  }
}
```

### adm_get_all_inventory

Gets user's current inventory by _userid_.
```json
{
  "jsonrpc": "2.0",
  "id": "ecdf8a03-a1bf-43f4-96eb-06550cdb63f9",
  "method": "adm_get_all_inventory",
  "params": {
    "appid": 1146,
    "token": "",
    "userid": 126516991
  }
}
```

### Consolidate

> does not use the `__body__` for specific params

Consolidates several item stacks with same _itemdefid_ into one. Useful when you have many same staks with low quantity in each. Returns changed items.
```json
{
  "jsonrpc": "2.0",
  "id": "ecdf8a03-a1bf-43f4-96eb-06550cdb63f9",
  "method": "Consolidate",
  "params": {
    "appid": 1146,
    "token": "",
    "userid": 126516991,
    "transactid": 12345678,
    "itemdefid": 15
  }
}
```

### adm_get_user_profile_by_appid

Gets user's profile data (including the inventory) by _userid_.
```json
{
  "jsonrpc": "2.0",
  "id": "ecdf8a03-a1bf-43f4-96eb-06550cdb63f9",
  "method": "adm_get_user_profile_by_appid",
  "params": {
    "appid": 1146,
    "token": "",
    "userid": 126516991
  }
}
```

### GetUserHistory

Gets user's profile history (history of actions which was called - include AddItem, Consolidate etc).
```json
{
  "jsonrpc": "2.0",
  "id": "ecdf8a03-a1bf-43f4-96eb-06550cdb63f9",
  "method": "GetUserHistory",
  "params": {
    "appid": 1146,
    "token": "",
    "userid": 126516991
  }
}
```

## Client methods

The user token is used for these actions. Does not require userid param.

### GetInventory
Gets user's current inventory.
```json
{
  "jsonrpc": "2.0",
  "id": "ecdf8a03-a1bf-43f4-96eb-06550cdb63f9",
  "method": "GetInventory",
  "params": {
    "appid": 1146,
    "token": ""
  }
}
```

### GetItemDefsClient

> Simple json response on success

Gets items descriptions by _itemdefid's_.

```json
{
  "jsonrpc": "2.0",
  "id": "ecdf8a03-a1bf-43f4-96eb-06550cdb63f9",
  "method": "GetItemDefsClient",
  "params": {
    "appid": 1146,
    "token": "",
    "__body__": {
        "itemdefids": [
            12,
            15
        ]
    }
  }
}
```

### SetSeenByPlayer

Sets the _seenByPlayer_ flag to `true` for _items_ list (the itemids are used). The flag is used by gui. Returns changed items.
```json
{
  "jsonrpc": "2.0",
  "id": "ecdf8a03-a1bf-43f4-96eb-06550cdb63f9",
  "method": "SetSeenByPlayer",
  "params": {
    "appid": 1146,
    "token": "",
    "__body__": {
        "items": [
            "112421069"
        ]
    }
  }
}
```

### ExchangeItems

Crafts an item with output _itemdefid_ from the passed _materials_ list (_itemids_ are used) if it is craftable from them. Returns changed items.
```json
{
  "jsonrpc": "2.0",
  "id": "ecdf8a03-a1bf-43f4-96eb-06550cdb63f9",
  "method": "ExchangeItems",
  "params": {
    "appid": 1146,
    "token": "",
    "__body__": {
        "materials": [
            "1",
            "2",
            "3"
        ],
        "outputitemdefid": 20,
        "quantity": 1 // quantity of the output items
    }
  }
}
```

### ExchangeItemsByItemdefs

Crafts an item with output _itemdefid_ from the passed recipe's _itemdefids_. So item wiil be crafted if user has enought required items. Returns changed items.
```json
{
  "jsonrpc": "2.0",
  "id": "ecdf8a03-a1bf-43f4-96eb-06550cdb63f9",
  "method": "ExchangeItemsByItemdefs",
  "params": {
    "appid": 1146,
    "token": "",
    "__body__": {
        "materials": [
            [
                12, // itemdefid
                1 // quantity
            ],
            [
                15, // itemdefid
                2 // quantity
            ]
        ],
        "outputitemdefid": 20,
        "quantity": 1 // quantity of the output items
    }
  }
}
```

### CancelDelayedExchange

Allows to take apart item with _delayedexchange_ type (see ItemDef Schema) to their recipe (_exchange_ field) items. Returns changed items.
```json
{
  "jsonrpc": "2.0",
  "id": "ecdf8a03-a1bf-43f4-96eb-06550cdb63f9",
  "method": "CancelDelayedExchange",
  "params": {
    "appid": 1146,
    "token": "",
    "__body__": {
        "itemid": "112421069"
    }
  }
}
```

### getConsumedItems

Gets the items which was consumed after passed timestamp.
```json
{
  "jsonrpc": "2.0",
  "id": "ecdf8a03-a1bf-43f4-96eb-06550cdb63f9",
  "method": "getConsumedItems",
  "params": {
    "appid": 1146,
    "token": "",
    "__body__": {
        "from": 1710944543
    }
  }
}
```

### TriggerItemDrop

Gives to user a random item from the passed _itemdefids_ list. It can give nothing depending on some conditions which are set by config (e.g. minimal required playtime). Returns changed items.
```json
{
  "jsonrpc": "2.0",
  "id": "ecdf8a03-a1bf-43f4-96eb-06550cdb63f9",
  "method": "TriggerItemDrop",
  "params": {
    "appid": 1146,
    "token": "",
    "__body__": {
        "itemdefid": [12, 15]
    }
  }
}
```
