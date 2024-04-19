---
title: User management
---

# User profile management
To see a user management info select appropriate menu item:
![User management](./images/user-management.png)

Input the userid at the field and press `View user profile` button:
![User data](./images/choose-user-data.png)

In User management window you can see sections with:
* User data
* Admin actions

![User data](./images/user-data.png)

You can change width for actions block and data block with separator line:
![Admin actions change width](./images/admin-actions-change-size.png)

To select blocks to reload after sending actions use select block:
![Admin actions select sections to reload](./images/admin-actions-select-sections-to-reload.png)

## User data
User data is presented as tree-view, and splitted by services(userstat, profile, contacts, etc.)
![Userstat data](./images/userstat-user-data.png)

To reload user data and admin actions inside section click to Reload button.
![Userstat data reload](./images/userstat-user-data-reload.png)

To copy any tree node value - click to `Copy Icon` next to the value:
![Value copy](./images/user-info-value-copy.png)

## Admin actions
There are relevant admin actions inside each services(userstat, profile, etc.)
![Admin actions](./images/admin-actions.png)

#### Profile admin actions
To use profile actions in admin panel you must add `admin_panel` tag in [action declaration on daScript](../configs-format/profile-config-format.md).
To use action set action parameters and press `Send action` button:
![Admin actions](./images/send-admin-actions.png)

You can see action result in the console:
![Admin actions result](./images/admin-actions-result.png)

#### Watched values block
To add value to watched block click to the icon next to the value:
![Admin actions add to watched block](./images/admin-actions-add-to-watched-block.png)

After added value you can watch it inside watched block:
![Admin actions](./images/admin-actions-watched-block.png)



#### Userstat admin actions
Not supported yet, will be added nearest time.