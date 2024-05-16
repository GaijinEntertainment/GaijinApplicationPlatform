---
title: Contacts API
---

The Contact API uses [json-rpc protocol](https://www.jsonrpc.org/specification).

## Description of common action parameters

### Parameters required for all methods

- `token` (_string_) - user token
- `appid` (_int_) - application id. You can see this parameter in [GaijinCentral](https://central-admin.gaijin.net) (_External IDs_ value in the _Applications_ tab).

## Client methods

### Login

To work with contact, the user must log in to the contact server. Otherwise, the Contacts API may not work properly.

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
  "user_id": 11111111,
  "nick": "user1",
  "login": {
    "first": 1670923278,
    "last": 1670926150
  },
  "externalid": [] //external data from steam and consoles
}
```

</details>

## Getting a contact list

This action returns a contact list for the user. The method uses the following specific parameters:

- `groups` (_string list_) - works like a filter; the response contains only groups that are contained in the `groups` parameter. If this parameter is not present, the response will include all groups allowed for the game.
- `status` (_string list_) - works like a filter; the response contains only status values that are contained in the `status` parameter. If this parameter is not present, the response will include all status values allowed for the game.

See more about [contact status](#contact-status).

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
    "Dungeon": { //group
      "requestsToMe": [ //status
        {
          "uid": 11111111,
          "nick": "user1",
          "time": 1671443640
        }
      ],
      "approved": [ //status
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
- `group` (_string_) - the group name; only one group can be used in your game (see [Contacts config](../configs-format//contacts-config-format.md) for details).

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

In the examples that follow, two users perform all actions:
- **user1** with `uid` 11111111 sends a friendship request
- **user2** with `uid` 22222222 approves (or rejects) the friendship request

### Friendship request

The user for a friendship request is specified by the `uid` parameter. For example:
**user1** sends the friendship request:

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

### Cancelling a friendship request

You can cancel a friendship request to the user specified by the `uid` parameter.
For example, **user1** cancels the friendship request:

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

### Approving a friendship request

This method approves a friendship request from the user specified by the `uid` parameter. In the below example, **user2** approves the friendship request from **user1**:

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

### Rejecting a friendship request

The following method is to reject a friendship request from the user specified by the `uid` parameter.
For example, **user2** is rejecting the friendship request from **user1**:

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

### Deleting a user from the friends list

You can delete the user, specified by the `uid` parameter, from the friends list.
**user1** deletes **user2** from the friends list:

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

### Adding a user to a blacklist

The following method adds the user specified by the `uid` parameter to the blacklist.
**user1** adds **user2** to the blacklist:

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

### Removing a user from a blacklist

The method removes the user, specified by the `uid` parameter, from the blacklist.
**user1** removes **user2** from the blacklist:

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

### Contact status values

The following contact status values are possible:

- _requestsToMe_ - status of the user who received a friendship request.
- _myRequests_ - status of the user who sent a friendship request.
- _approved_ - this status means that the users are friends.
- _rejectedByMe_ - status of the user who rejected a friend request.
- _myRejectedRequests_ - status of the user whose request for friendship was rejected.
- _meInBlacklist_ - status of the user whose friendship request got added to the blacklist.
- _myBlacklist_ - status of the user who added other user to the blacklist.

### Contacts status change scheme

#### user1 sends a friendship request; user2 approves it:

|                                                         |                    user 1                    |                    user2                    |
| :------------------------------------------------------ | :------------------------------------------: | :-----------------------------------------: |
| **status**                                              |                     _-_                      |                     _-_                     |
| user1 -> [Friendship request](#friendship-request)      |                 response: OK                 |                                             |
| **status**                                              |                 _myRequests_                 |               _requestsToMe_                |
| user2 -> [Approve request](#approve-friendship-request) |                 response: OK                 |                                             |
| **status**                                              |                  _approved_                  |                 _approved_                  |

#### user1 sends a friendship request; user2 rejects it:

|                                                       |                    user 1                    |                    user2                    |
| :---------------------------------------------------- | :------------------------------------------: | :-----------------------------------------: |
| **status**                                                |                     _-_                      |                     _-_                     |
| user1 -> [Friendship request](#friendship-request)    |                 response: OK                 |                                             |
| **status**                                            |                 _myRequests_                 |               _requestsToMe_                |
| user2 -> [Reject request](#reject-friendship-request) |                 response: OK                 |                                             |
| **status**                                            |             _myRejectedRequests_             |               _rejectedByMe_                |

#### user1 resubmits friendship request after being rejected:

|                                                    |                    user 1                    |                    user2                    |
| :------------------------------------------------- | :------------------------------------------: | :-----------------------------------------: |
| **status**                                         |             _myRejectedRequests_             |               _rejectedByMe_                |
| user1 -> [Friendship request](#friendship-request) |                 response: OK                 |
| **status**                                         |                 _myRequests_                 |               _requestsToMe_                |

#### user1 sends a friendship request and then cancels it:

|                                                       |                    user 1                    |                    user2                    |
| :---------------------------------------------------- | :------------------------------------------: | :-----------------------------------------: |
| **status**                                            |                     _-_                      |                     _-_                     |
| user1 -> [Friendship request](#friendship-request)    |                 response: OK                 |                                             |
| **status**                                            |                 _myRequests_                 |               _requestsToMe_                |
| user1 -> [Cancel request](#cancel-friendship-request) |                 response: OK                 |                                             |
| **status**                                            |                     _-_                      |                     _-_                     |

#### user1 sends a friendship request; user2 adds it to the blacklist:

|                                                    |                    user 1                    |                    user2                    |
| :------------------------------------------------- | :------------------------------------------: | :-----------------------------------------: |
| **status**                                         |                     _-_                      |                     _-_                     |
| user1 -> [Friendship request](#friendship-request) |                 response: OK                 |                                             |
| **status**                                         |                 _myRequests_                 |               _requestsToMe_                |
| user2 -> [Add to blacklist](#add-to-blacklist)     |                 response: OK                 |                                             |
| **status**                                         |               _meInBlacklist_                |                _myBlacklist_                |

#### user1 resubmits friendship request after being added to the blacklist:

|                                                    |                    user 1                    |                    user2                    |
| :------------------------------------------------- | :------------------------------------------: | :-----------------------------------------: |
| **status**                                         |               _meInBlacklist_                |                _myBlacklist_                |
| user1 -> [Friendship request](#friendship-request) |              error: BLACKLISTED              |                                             |
| **status**                                         |               _meInBlacklist_                |                _myBlacklist_                |

#### user2 removes user1 from the blacklist:

|                                                          |                    user 1                    |                    user2                    |
| :------------------------------------------------------- | :------------------------------------------: | :-----------------------------------------: |
| **status**                                               |               _meInBlacklist_                |                _myBlacklist_                |
| user2 -> [Remove from blacklist](#remove-from-blacklist) |                 response: OK                 |                                             |
| **status**                                               |                     _-_                      |                     _-_                     |
