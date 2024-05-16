---
title: Service accounts
---


Regular users normally create accounts with user roles assigned in the application.

Developers can also create the so-called **service accounts** in order to perform some service functions, like testing. When you create a service account, the system generates a certain user token for this service account.

A service account is a special type of user account that external applications or [services](services.md) can utilise to manage resources within the project.  Such a user cannot log in to the system with e-mail and password, but it has a UID and a system-generated token assigned to the service account. You can  [assign roles](roles-and-permissions_manage.md#assigning-roles-to-application-users) for such accounts, just as you do for regular users. 

 A developer can give to the service account permissions to perform certain functions in the project. A developer can use the service account token and UID to launch sessions on behalf of the service account with the assigned permission.

---

![List of service accounts](./assets/service-account.png)

## Creating a service account

Press the **Create service account** button to create a new one.

![Creating a service account](./assets/service-account-modal.png)

When you create a new service account, you can specify a display name, comment, and its lifetime (e.g for one year). As a result of creating a service account, you will be issued a token that will allow you to make API requests on behalf of the account.

![Creating a service account](./assets/service-account-token.png)

!!!warning
    For your protection, you should never share your token with anyone. If you have lost your token or it has been compromised, you can generate a new token for the account.

## Generating a new token for an existing service account

If you need to generate a new token for an existing service account (e.g. in case your current token has been compromised), click **Generate New Token**. In the dialog box that opens, you can specify the lifetime of the new token.
