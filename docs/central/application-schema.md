---
title: Roles and permissions
---

The page allows you to manage roles and permissions within the application (i.e. changing application schema). A permission is an atomic unit of access to an application. Whereas a role is a set of permissions that are assigned to a user and define his access rights within the application.

## Application schema {#app-schema}

![Application schema](./assets/app-schema.png)

Every user may assume several roles at the same time. So, there is no sense in creating a large number of complicated roles that differ literally in a couple of features. It is better to create several roles complementary to each other and assign a necessary role combination to a particular user.

### Creating a permission {#creating-a-permission}

To create a new permission, click the **Add permission** button at the bottom row of the table.

![Creating a permission](./assets/add-permission.png)

In the modal window that opens, there is the following form:

- **Name** _(required)_ – application-wide unique permission key
- **Description** – a text field describing the purpose of the permission
- **Default value** – `TRUE` or `FALSE`

:::note
Permissions do not function on their own. An application can request permissions assigned to a particular user and retrieve a list of actual permissions. The rest is on the part of the application itself.
:::

### Creating a role

To create a new role, click the **Add role** button at the right column of the table.

![Creating a role](./assets/add-role.png)

In the modal window that opens, there is the following form:

- **Name** _(required)_ – application-wide unique role key
- **Description** – a text field describing the purpose of the role
- **Public role** flag – if selected, the role will be available for selection as a project role

### Setting permissions for roles

The value of each permission within a role can be set to `TRUE`, `FALSE` or the _default value_ defined for that permission. The value in a table cell changes with toggle button that cycles between three options upon clicking (`TRUE → FALSE → default → TRUE → ...`)

![Creating a role](./assets/app-schema-changed.png)

To edit or delete an existing role or permission, click the button next to its name (three dots). Note that editing the names of already created roles and permissions is not allowed.

![Role and permission actions](./assets/app-schema-actions.png)

:::info
Keep in mind that changes to the table do not occur instantly. Instead, the operations performed are written to the stack and are applied only after you click the **Save changes** button.
:::

The **Save changes** button displays an edit counter, and the changed fields are highlighted in the table by a special shading. You can also rollback edits by pressing the **Reset** button, or display the view of the table before the changes made by changing the **Show original** switcher.

After clicking on the **Save changes** button, an overview of the changes (added, deleted, changed roles and/or permissions, updated values) will be shown. The **Apply** button will save these changes to the server.

![Creating a role](./assets/app-schema-changes.png)

## Export/Import schema {#export-import-schema}

The export modal window contains a list of roles and permissions that are available for selection. Note that when you select an individual role for export, the permissions related to that role are automatically selected (with no possibility of exclusion). As a result of selecting roles and permissions, in the right part of the list is generated JSON data for export. You must click **Copy export data** to put the data to the clipboard.

![Application schema export](./assets/app-schema-export.png)

To import data, go to the roles page in another application, click **Import**, paste the information from the clipboard and click **Import**.
