---
title: Applications
sidebar_position: 3
---

# Applications

As soon as a project is created, it consists of one application of the same name.

Application - a logical entity, allowing for breaking a project into separate subsystems, each of whom can have its own permissions, its roles, and its own administrators. It is usually enough for a small project to have just one application. Additional applications within a project can be created at any time. Each application is fully independent and in no way affects the other applications.

In which cases will it be convenient to have several applications? If a project consists of several subsystems that are quite independent. For example, a game itself, which may require moderators, community managers or players with the permission to temporarily mute other players. A marketplace may stand alone, having a completely different range of permissions and roles. It will require permissions to manage transactions, refund, modify players’ inventory and so on.

## Application roles and permissions

Open the **`Users`** section. There is a single user at the moment - it’s you as the project owner. You don’t have any roles or permissions assigned. It’s because no permissions schema has been defined in the application so far.

To make it clearer, let’s create a sample schema. In future, you can build upon it or you can create your own application schema from scratch. Let’s return to the main page of the project and go to the **`Roles and permissions`** section. There’s also nothing here at the moment. Let’s import the ready-made import schema.

- Press the `Import` button
- Put the **`schema`** into the form.

<details>
  <summary>Sample schema</summary>

```json
{
  "roles": {
    "moderator": {
      "name": "moderator",
      "description": "",
      "protected": true,
      "permissions": [
        {
          "name": "user.kick",
          "value": true
        },
        {
          "name": "user.mute",
          "value": true
        }
      ]
    },
    "lead support": {
      "name": "lead support",
      "description": "",
      "protected": true,
      "permissions": [
        {
          "name": "inventory.edit",
          "value": true
        },
        {
          "name": "inventory.view",
          "value": true
        },
        {
          "name": "user.ban",
          "value": true
        }
      ]
    },
    "god": {
      "name": "god",
      "description": "",
      "protected": true,
      "permissions": [
        {
          "name": "inventory.edit",
          "value": true
        },
        {
          "name": "inventory.view",
          "value": true
        },
        {
          "name": "user.ban",
          "value": true
        },
        {
          "name": "user.kick",
          "value": true
        },
        {
          "name": "user.mute",
          "value": true
        }
      ]
    }
  },
  "permissions": {
    "user.kick": {
      "name": "user.kick",
      "value": false,
      "description": "Can kick user from game session",
      "protected": true
    },
    "user.mute": {
      "name": "user.mute",
      "value": false,
      "description": "Can mute a  user permanantly or for limited time",
      "protected": true
    },
    "user.ban": {
      "name": "user.ban",
      "value": false,
      "description": "Can ban a user from the game login",
      "protected": true
    },
    "inventory.edit": {
      "name": "inventory.edit",
      "value": false,
      "description": "Can edit a player inventory content",
      "protected": true
    },
    "inventory.view": {
      "name": "inventory.view",
      "value": false,
      "description": "Can view a player inventory",
      "protected": true
    }
  }
```

</details>

- Press the `Import` button

  The application schema should display in the form of a table.

  ![image2022-5-12_6-42-27](https://user-images.githubusercontent.com/8239624/169347051-c5e81bc9-1a8d-4717-a3ff-9672355f84d0.png)

- Save changes (number 18 means that we have made 18 different edits to the application scheme)

> You could create all permissions and roles manually, one by one, but it is much faster to import a ready-made schema.

The first column shows the list of permissions. In order to take any non-standard action in the game, the user should have the appropriate permission. Try to assign such names to permissions that will reflect the meaning of the permission assigned.

Header rows list roles. They serve to logically unite permissions according to particular tasks. There can be dozens of separate permissions within a single application. Assigning separate permissions to each user is complicated, confusing, and time-consuming. Moreover, if later you decide that all moderators should have the possibility to ban players, as soon as you add the `user.ban` permission to the `moderator` role, all users assuming the `moderator` rule will automatically get the `user.ban` permission.

Every user may assume several roles at the same time. So, there is no sense in creating a large number of complicated roles that differ literally in a couple of features. It is better to create several roles complementary to each other and assign a necessary role combination to a particular user.

:::note

Permissions do not function on their own. An application can request permissions assigned to a particular user and retrieve a list of actual permissions. The rest is on the part of the application itself.

:::

## User Management

Now you can return to the `Users` section and see that our only user may be assigned all three roles. Let’s make them, for instance, a `moderator` and a `lead support`.

![image2022-5-12_7-35-35](https://user-images.githubusercontent.com/8239624/169349178-54c5635a-b852-4c9d-aa15-72f6ad369330.png)

There is also a possibility of adding other users or inviting them to manage the application in the same way it was done in the case of project administrator list management.

## API Access Tokens

To make authorized requests to GAP API in the name of the application, you need to generate an API Access token. It can be done at any time in the `Tokens` section.

![image2022-5-12_7-49-9](https://user-images.githubusercontent.com/8239624/169349472-aa876182-4aa2-4ae1-bfa3-d792241cc79c.png)

You can have a maximum of two active tokens at the same time. Two tokens are necessary in case you need to reissue a token, for example, because the current one was compromised. In this case you can issue a new token, replace the current token with the new one and then remove the previous token, thus making it invalid.

:::caution

When generated, the new token should be saved. Once created, it cannot be restored. Only a new one can be issued. It is not advisable to generate an access token until you really need it.

:::
