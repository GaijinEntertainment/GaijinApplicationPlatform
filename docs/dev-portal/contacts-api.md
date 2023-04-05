---
title: Contacts API
---

Contact API uses [json-rpc protocol](https://www.jsonrpc.org/specification).

## Description of common action parameters

### Required for all methods

- `token` (_string_) - user token
- `appid` (_int_) - the application id, you can see this parameter in [GaijinCentral](https://central-admin.gaijin.net) in _Application_ tab see _External IDs_ value.

## Client methods

### Login

For work with contact, the user must log in to the contact server. Without this, the contacts API may not work properly.

```json
{
  "method": "Login",
  "id": "request id",
  "jsonrpc": "2.0",
  "params": {
    "appid": 1197,
    "token": "user token"
  }
}
```

<details>
  <summary>Response</summary>

```json
{
  "user_id": 16929100,
  "nick": "test156",
  "login": {
    "first": 1670923278,
    "last": 1670926150
  },
  "externalid": [] //external data from steam and consoles
}
```

</details>

## Get contact list

Action return the contact list for the user.
Action specific parameters:

- `groups` (_string list_) - works like filter, response contains only groups that are contained in the _groups_ parameter. If the _groups_ parameter is not defined, the response contains all groups allowed for the game.
- `status` (_string list_) - works like filter, response contains only status that are contained in the _status_ parameter. If the \__status_ parameter is not defined, the response contains all types. See more about [contact status](#contact-status)

```json
{
  "method": "GetContacts",
  "id": "request id",
  "jsonrpc": "2.0",
  "params": {
    "appid": 1197,
    "groups": ["Dungeon"],
    "status": ["requestsToMe"],
    "token": "user token"
  }
}
```

<details>
<summary>Response</summary>

```json
{
  "jsonrpc": "2.0",
  "id": "912eb0e0-853e-47d6-a519-49dcb4b7e604",
  "result": {
    "Dungeon": {
      //group
      "requestsToMe": [
        //status
        {
          "uid": 11111111,
          "nick": "user1",
          "time": 1671443640
        }
      ],
      "approved": [
        //status
        {
          "uid": 33333333,
          "nick": "user3",
          "time": 1671443640
        },
        {
          "uid": 44444444,
          "nick": "user4",
          "time": 1671443640
        }
      ]
    }
  }
}
```

</details>

## Client methods to change the status of contact

### Action parameters required for all methods in this section:

- `uid` (_int_) - the unique identifier of another user
- `group` (_string_) - the name of the group, now allowed only one group equal to the name of the game

All actions in this part return "OK" or error

<details>
<summary>"OK" Response</summary>

```json
{
  "id": "request id",
  "jsonrpc": "2.0",
  "result": "OK"
}
```

</details>

<details>
<summary>Example of response with error</summary>

```json
{
  "error": {
    "code": -32603,
    "message": "BLACKLISTED"
  },
  "id": "request id",
  "jsonrpc": "2.0"
}
```

</details>

In examples below all actions are sent by two users:

- **user1** with uid: 11111111 sent friendship request.
- **user2** with uid: 22222222 who approves or rejects friendship request.

### Friendship request

User id for the friendship request specified in the _uid_ parameter.
**user1** send friendship request:

```json
{
  "method": "FriendshipRequest",
  "id": "request id",
  "jsonrpc": "2.0",
  "params": {
    "appid": 1197,
    "token": "user1 token",
    "uid": 22222222,
    "group": "Dungeon"
  }
}
```

### Cancel friendship request

Cancel a friendsip request to the user specified in the _uid_ parameter.
**user1** cancel friendship request:

```json
{
  "method": "CancelFriendshipRequest",
  "id": "request id",
  "jsonrpc": "2.0",
  "params": {
    "appid": 1197,
    "token": "user1 token",
    "uid": 22222222,
    "group": "Dungeon"
  }
}
```

### Approve friendship request

Approve a friendship request from the user specified in the _uid_ parameter.
**user2** approve friendship request from user1:

```json
{
  "method": "ApproveFriendship",
  "id": "request id",
  "jsonrpc": "2.0",
  "params": {
    "appid": 1197,
    "token": "user2 token",
    "uid": 11111111,
    "group": "Dungeon"
  }
}
```

### Reject friendship request

Reject a friendship request from the user specified in the _uid_ parameter.
**user2** reject friendship request from user1:

```json
{
  "method": "RejectFriendship",
  "id": "request id",
  "jsonrpc": "2.0",
  "params": {
    "appid": 1197,
    "token": "user2 token",
    "uid": 11111111,
    "group": "Dungeon"
  }
}
```

### Delete from friend list

Delete the user, specified in the _uid_ parameter, from friends list.
**user1** delete user2 from friend list:

```json
{
  "method": "DeleteFriend",
  "id": "request id",
  "jsonrpc": "2.0",
  "params": {
    "appid": 1197,
    "token": "user1 token",
    "uid": 22222222,
    "group": "Dungeon"
  }
}
```

### Add to blacklist

Added the user, specified in the _uid_ parameter, to the blacklist.
**user1** add user2 to the blacklist:

```json
{
  "method": "AddToBlackList",
  "id": "request id",
  "jsonrpc": "2.0",
  "params": {
    "appid": 1197,
    "token": "user1 token",
    "uid": 22222222,
    "group": "Dungeon"
  }
}
```

### Remove from blacklist

Remove the user, specified in the _uid_ parameter, from blacklist.
**user1** remove user2 from blacklist:

```json
{
  "method": "RemoveFromBlackList",
  "id": "request id",
  "jsonrpc": "2.0",
  "params": {
    "appid": 1197,
    "token": "user1 token",
    "requestorUid": 22222222,
    "groupName": "Dungeon"
  }
}
```

## Contact status

### Possible contact type values:

- `requestsToMe` - the status of the user who received the friend request
- `myRequests` - the status of the user who send the friend request
- `approved` - status means users are friends
- `rejectedByMe` - the status of the user who rejected the friend request
- `myRejectedRequests` - the status of the user whose friend request was rejected
- `meInBlacklist` - the status of the user whose friend request was added to the blacklist
- `myBlacklist` - the status of the user who added to the blacklist

### Status change scheme

#### user1 sends a friendship request. user2 approves friendship

|                                                         |                    user 1                    |                    user2                    |
| :------------------------------------------------------ | :------------------------------------------: | :-----------------------------------------: |
| **status**                                              |                     `-`                      |                     `-`                     |
| user1 -> [Friendship request](#friendship-request)      |                 response: OK                 |                                             |
| **status**                                              |                 `myRequests`                 |               `requestsToMe`                |
| user2 -> [Approve request](#approve-friendship-request) |                 response: OK                 |                                             |
| **status**                                              |                  `approved`                  |                 `approved`                  |

#### user1 sends a friendship request. user2 rejects it

|                                                       |                    user 1                    |                    user2                    |
| :---------------------------------------------------- | :------------------------------------------: | :-----------------------------------------: |
| status                                                |                     `-`                      |                     `-`                     |
| user1 -> [Friendship request](#friendship-request)    |                 response: OK                 |                                             |
| **status**                                            |                 `myRequests`                 |               `requestsToMe`                |
| user2 -> [Reject request](#reject-friendship-request) |                 response: OK                 |                                             |
| **status**                                            |             `myRejectedRequests`             |               `rejectedByMe`                |

#### user1 resubmits friendship request after being rejected

|                                                    |                    user 1                    |                    user2                    |
| :------------------------------------------------- | :------------------------------------------: | :-----------------------------------------: |
| **status**                                         |             `myRejectedRequests`             |               `rejectedByMe`                |
| user1 -> [Friendship request](#friendship-request) |                 response: OK                 |
| **status**                                         |                 `myRequests`                 |               `requestsToMe`                |

#### user1 sends a friendship request and than cancels it

|                                                       |                    user 1                    |                    user2                    |
| :---------------------------------------------------- | :------------------------------------------: | :-----------------------------------------: |
| **status**                                            |                     `-`                      |                     `-`                     |
| user1 -> [Friendship request](#friendship-request)    |                 response: OK                 |                                             |
| **status**                                            |                 `myRequests`                 |               `requestsToMe`                |
| user1 -> [Cancel request](#cancel-friendship-request) |                 response: OK                 |                                             |
| **status**                                            |                     `-`                      |                     `-`                     |

#### user1 sends a friendship request. user2 adds it to the blacklist

|                                                    |                    user 1                    |                    user2                    |
| :------------------------------------------------- | :------------------------------------------: | :-----------------------------------------: |
| **status**                                         |                     `-`                      |                     `-`                     |
| user1 -> [Friendship request](#friendship-request) |                 response: OK                 |                                             |
| **status**                                         |                 `myRequests`                 |               `requestsToMe`                |
| user2 -> [Add to blacklist](#add-to-blacklist)     |                 response: OK                 |                                             |
| **status**                                         |               `meInBlacklist`                |                `myBlacklist`                |

#### user1 resubmits friendship request after being added to the blacklist

|                                                    |                    user 1                    |                    user2                    |
| :------------------------------------------------- | :------------------------------------------: | :-----------------------------------------: |
| **status**                                         |               `meInBlacklist`                |                `myBlacklist`                |
| user1 -> [Friendship request](#friendship-request) |              error: BLACKLISTED              |                                             |
| **status**                                         |               `meInBlacklist`                |                `myBlacklist`                |

#### user2 removes user1 from blacklist

|                                                          |                    user 1                    |                    user2                    |
| :------------------------------------------------------- | :------------------------------------------: | :-----------------------------------------: |
| **status**                                               |               `meInBlacklist`                |                `myBlacklist`                |
| user2 -> [Remove from blacklist](#remove-from-blacklist) |                 response: OK                 |                                             |
| **status**                                               |                     `-`                      |                     `-`                     |
