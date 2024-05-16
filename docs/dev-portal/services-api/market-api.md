---
title: Market API
---

## Overview

This API doc describes the methods which have to be implemented on daScript to work with market service. However, it does not work with market directly (the market does not call them). These methods are used by profile server which is a mediator.

Asset actions methods provide information about the user's items, descriptions of items to display with gui.

Trade actions methods are responsible for assigning and removing items from the user's inventory.

In addition, there is a technical need to use the functions from the Items storage part (see more details in the corresponding section).

## Terms

- asset - the particular item (stack of items) which is tradable on market
- assetid - the unique id of particular stack on market (e.g. "1234567")
- itemid - it is the same as assetid, but in context of user's inventory
- context - abstract group for items (e.g. "weapons", "vehicles")
- class - an array of game-defined asset class identifiers. It is up to the game to define what those identifiers are; they just need to provide enough information to reproduce the asset (i.e. describe what kind of item it is)

!!!example
    Let's consider the user has two health potions. They can be represented as one stack with the number of 2 or two stacks with the number of 1. Each stack in market terms will be an asset, each must have its own assetid (itemid). If contexts are is used, it can be assumed that the items belong to the context "support" or "medicine", for example. Let's assume that all items belong to the same "default" context. We will refer to this stack in the following examples. Also, let the "class" contain a single item_type field.


## Asset actions

These methods provide info about tradable items.

!!!note
    The current API of the profile server requires that the responses of asset actions be wrapped in "result" object, despite the fact that the json-rpc formatter will place this object in the same object again.

### get_contexts

Returns a list of contexts that the user has items from. The context id received by the market will be used to request the content of the context (see get_context_contents). As mentioned above, context splitting is optional, but at least one context is required.

Params:

- `no params`

#### Example

```json
// Request
{
  "method": "das.get_contexts",
  "id": "",
  "jsonrpc": "2.0",
  "params": {}
}


// Response (jsonrpc's result obj)
{
  "result": {
    "success": true,
    "contexts": [
      {
        "id": "1", // contextid
        "name": "default", // context name
        "asset_count": 1,  // the number of assets in this context
                           // (here - the one stack of health potions)
      }
    ]
  }
}
```

### get_context_contents

This returns the all of the assets in a particular context for a user.

Params:

- `contextid` (_string_)

#### Example

```json
// Request
{
  "method": "das.get_context_contents",
  "id": "",
  "jsonrpc": "2.0",
  "params": {
    "contextid": "1"
  }
}


// Response (jsonrpc's result obj)
{
  "result": {
    "success": true,
    "assets": [
      {
        "id": "838506080", // assetid
        "amount": 2,       // the number of items in stack
                           // (here - the two health potions)
        "class": [
          {
            "name": "item_type", // field name
            "value": "big_health_potion" // field value
          }
        ]
      }
    ]
  }
}
```

### cst_get_asset_class

Returns the main asset data (including the class) by their assetid for this profile. The response is identical to get_context_contents, except that only assets from the requested list are returned. The profile server is responsible for ensuring that only the assetids associated with the specific profile are passed. It retrieves data from a dedicated storage (refer to Items storage).

Params:

- `contextid` (_string_)
- `assets` (_string array_)

#### Example

```json
// Request
{
  "method": "das.cst_get_asset_class",
  "id": "",
  "jsonrpc": "2.0",
  "params": {
    "contextid": "1",
    "assets": [
      "838506080"
    ]
  }
}


// Response (jsonrpc's result obj)
{
  "result": {
    "success": true,
    "assets": [
      {
        "id": "838506080",
        "amount": 2,
        "class": [
          {
            "name": "item_type",
            "value": "big_health_potion"
          }
        ]
      }
    ]
  }
}
```

### get_asset_class_info

Using the class data, it should return a detailed description of the item to display the information in the GUI of the market.

Params:

- `language` (_string_)
- `class_` (_object {string: string}_)

#### Example

```json
// Request
{
  "method": "das.get_asset_class_info",
  "id": "",
  "jsonrpc": "2.0",
  "params": {
    "language": "english",
    "class_": {
      "item_type": "big_health_potion"
    }
  }
}


// Response (jsonrpc's result obj)
{
  "result": {
    "success": true,
    "asset": {
      "market_hash_name": "Big health potion",
      "market_name": "Big health potion",
      "name": "Big health potion",
      "type": "Potion",
      "background_color": "3C352E",
      "name_color": "2232D1",
      "icon_url": "https://some-scr/big_health_potion.png",
      "commodity": true,
      "market_fee": 0.1,
      "descriptions": [
        {
          "value": "Instantly restores full health bar."
        }
      ],
      "tags": [
        {
          "name": "Rare",
          "category_name": "Quality",
          "category": "quality",
          "internal_name": "rare",
          "color": "2232D1"
        },
        {
          "name": "Support",
          "category_name": "Type",
          "category": "type",
          "internal_name": "support",
          "color": "23a639"
        }
      ]
    }
  }
}
```

- `market_name` - this is the name which will be used to group items together, this should be localized where possible
- `background_color` - an RGB hex color value represented as a string
- `commodity` - the only true is supported currently; indicates that every item with the same market_hash_name as this item is exactly the same
- `name` - the name of the item to display to the user
- `type` - the type of the item to display to the user
- `market_hash_name` - this should always be the English value of market_name, this is used to correlate the various versions together
- `market_fee` - optional, the amount of the transaction (e.g. 10%) which will be taken as the game fee
- `tags` - An array of tags that apply to the asset. These are displayed as filtering options to the user in various places of the UI
    - `category` - the category to place this tag in. This is only used internally for grouping and not shown to the user. Do not use spaces, non-ASCII, or non-printable characters in the category
    - `category_name` - the localized name of the category. Displayed to the user
    - `internal_name` - a name to identify this tag. The internal name is not shown to the user. Do not use spaces, non-ASCII, or non-printable characters in the internal_name
    - `name` - the localized name of this tag. Displayed to the user
    - `color` - an RGB hex color to use when displaying the tag's name

## Trade actions

### cst_set_unowned

This method will be called when the user puts the item up for sale. He is obliged to remove the specified number of amount items from the stack with the assetid. If the amount is equal to the number of items in the stack, the itemid of this stack is returned, and the stack is removed from the user profile. If the amount is less, then you have to create a new itemid, and decrement the number of items in the user's stack.

The duplicate parameter indicates whether this request is repeated (with the same transactid) - in this case, the item should not be taken away again (which is obvious), a response similar to the original one should be returned. So the data have to be stored somewhere (the get_transaction_id function from jsonrpc build-in module can be useful).

The fields of the response object represent the fields of the class (described above) and depend on the specific game. They must match the fields of the item_info object from the cst_set_owned request (see below), but the itemid field is required by profile server API. This data will be used on set own an item to another user after purchase, i.e. the data must be sufficient to create such an item.

Params:

- `assetid` (_uint64_)
- `amount` (_int_)
- `duplicate` (_bool_)

#### Example

```json
// Request
{
  "method": "das.cst_set_unowned",
  "id": "",
  "jsonrpc": "2.0",
  "params": {
    "assetid": 838506080,
    "amount": 1,
    "duplicate": false
  }
}


// Response (jsonrpc's result obj)
{
  "itemid": "123", // required !
  "item_type": "big_health_potion", // game specific
}
```

### cst_set_owned

Assigns a stack of items to the user. A stack with a new assetid should be created based on the game specific data of the item_info object. The itemid parameter will be the exactly itemid that was returned by the cst_set_unowned method for that stack.

The price value can be used to save the history etc. The duplicate flag indicates whether this request is repeated (with the same transactid) - in this case, the item should not be added again (which is obvious), a response similar to the original one should be returned (i.e., the assetid of the created stack).

Params:

- `item_info` (_object_)
    - `itemid` (_string_)
    - ... _game specific fields_
- `amount` (_int_)
- `price` (_string_)
- `duplicate` (_bool_)

#### Example

```json
// Request
{
  "method": "das.cst_set_owned",
  "id": "",
  "jsonrpc": "2.0",
  "params": {
    "item_info": {
      "itemid": "123",
      "item_type": "big_health_potion", // game specific
    },
    "amount": 2,
    "price": "GJN10",
    "duplicate": false
  }
}


// Response (jsonrpc's result obj)
{
  "new_assetid": "321"
}
```

## Items storage

The internal implementation of the profile server for searching for the owner of the item uses a separate storage. To work with it from daScript, the built-in items_storage_db module is used. These functions do not require the implementation of the game developer, but must be called for certain actions with items and profile.

### actualize_items

Params:

- `actualItems` (_uint64 array_)

This function must be called during profile initialization to update the list of items for this profile. It is necessary to send a list of all tradable asset ids. Just call it within `reinitProfile` method, which is called automatically by profile service on profile loading.

```python
[jsonrpc_method]
def reinitProfile()
  var actualItems: array<uint64>

  // collect items //

  actualize_items(actualItems)
```

### add_items_to_db

Params:

- `actualItems` (_uint64 array_)

The function is used to keep the storage up to date after purchase. It is advisable to call it after adding items into player's profile. The argument is a list of added itemids.

## Additional utility requirements

### get_script_global_vars

The method have to return the following information

- `market_config_timestamp` (_int64_) - The UTC timestamp informing when the asset class infos was changed. It is required to update market cache.

Let's consider your scripts store the update time in the `market_config_timestamp` variable. So the implementation could look like this:

```python
[jsonrpc_method(internal)]
def get_script_global_vars()

  send_result(
    {{"market_config_timestamp" => market_config_timestamp}}
  )
```


## Example

An example of the market scripts implementation can be found [here](https://github.com/GaijinEntertainment/GaijinNetApp/tree/main/Examples/market).