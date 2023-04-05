---
title: GUI description
---

## User stats tab {#stats-configs}

To add a stat, go to the user stats tab and click `Add Stat`.

### Adding a stat

![1](https://user-images.githubusercontent.com/113108555/189727279-863abacd-e8a9-4198-976c-1784afd384d4.png)

In the modal window that pops up, enter a unique name for the
stat and click `Save`.

![2](https://user-images.githubusercontent.com/113108555/189728505-c95546ce-fe5a-43ed-b123-a7defe11e4f4.png)

![3](https://user-images.githubusercontent.com/113108555/189727284-9edddf44-978e-4086-8bbf-3e75990f3bb5.png)

The stat will show up in the table once it saves.

![4](https://user-images.githubusercontent.com/113108555/189727288-04b73de1-5193-496b-95e0-02b8cd56a29f.png)

If you already have a stat with that name, it won't save.
You'll get a server error telling you what happened.

![5](https://user-images.githubusercontent.com/113108555/189727291-52ac989e-733b-46df-81c6-be50d1c4992e.png)

### Editing a stat in the table

You can edit stats in the table or the code editor.
The table has the basic set of fields, with `name` and `type` required.
Checkboxes are used to edit Boolean types (true/false value); the `minValue`,
`maxValue`, `window`, and `defValue` fields are for editing number data; the
`name` field is for editing string data; and the `type` field has a combo box
that lets you select a data type (`INT` by default).

To edit string or number values, click the cell, and the input field appears.
Enter the valid value in the field. Click `Enter` to save the changes.

### Editing a stat in the code editor

You can edit a stat in the code editor's substring.
Click the arrow in the action field to pull up the editor.

![6](https://user-images.githubusercontent.com/113108555/189727293-7115a64e-b782-4e6b-a051-a973b26b8b0b.png)

In the editor, you can add additional fields the table doesn't come with
by default.
Data is entered in the JSON format.
More details about the stats format see [here](./stats-config-format).

When you're editing attributes, the `SAVE CHANGES` button activates.
Click `SAVE CHANGES` when you're done editing.

![7](https://user-images.githubusercontent.com/113108555/189727294-53a7057c-3790-4132-ab11-65b8b6edeec9.png)

When you save your changes, the table data updates dynamically.

The code editor highlights syntax, entry errors, and tabulation.

### Deleting a stat

To delete a stat, click the delete button in the `Remove` field and confirm
the deletion.
If the stat deletes successfully, the table dynamically updates, and the stat
field disappears.

![8](https://user-images.githubusercontent.com/113108555/189727296-20371a5e-58b8-48ff-8bd4-c8929ddff0b5.png)

If you clicked the delete button accidentally, click `NO` in the pop-up.

![9](https://user-images.githubusercontent.com/113108555/189727297-6a14f1f9-fbd2-4db7-995d-eca409407880.png)

### Downloading the config file

The service lets you download the config file to your computer so you
can make changes in your local code editor.
Just click `Download Config`.
If the file downloads successfully, you'll get a notification,
and the JSON file will be in your downloads.

![10](https://user-images.githubusercontent.com/113108555/189727298-039c5e50-fdd0-4603-95b4-e08710d9791d.png)

![11](https://user-images.githubusercontent.com/113108555/189727299-7be8cc76-b55e-451d-aa7a-d78ef5fa6149.png)

### Uploading the config file

The service lets you upload the config file from your computer.
Just click `UPLOAD CONFIG` and select the JSON file in the window that pops up.
To confirm your upload, click `Open` in this window.

![12](https://user-images.githubusercontent.com/113108555/189727302-41a6f6b9-97b2-491f-a017-37d492811ea8.png)

If the config file is valid and uploaded successfully, you will
see a notification.

![13](https://user-images.githubusercontent.com/113108555/189727305-6dcdc0a3-4f3b-4059-b87a-98f72b67a9ce.png)

If the file is invalid, you will get a server error message.

![14](https://user-images.githubusercontent.com/113108555/189727308-1fb6befc-a931-406f-97a0-11186439dbf0.png)

## Unlock tab

To add an unlock, go to the unlock tab and click `Add Unlock`.

### Adding an unlock

![15](https://user-images.githubusercontent.com/113108555/189727310-400bf76a-2a3e-41cc-b96c-deada271e05f.png)

In the modal window that pops up, enter a unique `name` for the
unlock and click `Save`.

![16](https://user-images.githubusercontent.com/113108555/189727313-e7e7717a-5da7-4e94-b0ad-61a954cdc19c.png)

The unlock will show up in the table once it saves.

![17](https://user-images.githubusercontent.com/113108555/189727316-1906aef5-e94b-44a3-8451-20154b3bf587.png)

If you entered an incorrect `name` for the unlock
(there's already one with that `name`, for instance), it won't save.
You'll get a server error telling you what happened.

![18](https://user-images.githubusercontent.com/113108555/189727318-1a608673-1cc6-4b6d-af3f-370dec1a2024.png)

### Editing an unlock in the table

You can edit unlocks in the table or the code editor.
The table has the basic set of fields, with `name` and `type` required.
Checkboxes are used to edit Boolean types (true/false value), the `name`
field is for editing string data, and the `type` field has a combo box that
lets you select a data type (`NORMAL` by default).

Check or uncheck the `hidden` and `showForAll` fields to edit Boolean values.

![19](https://user-images.githubusercontent.com/113108555/189727321-01df0664-9f01-4369-8e71-4b4f4a15f81a.png)

To edit string values, click the cell, and the input field appears.
Enter the valid value in the field. Click `Enter` to save the changes.

![20](https://user-images.githubusercontent.com/113108555/189727323-15f09a52-a109-4a7e-8b07-8034478669b6.png)

### Editing an unlock in the code editor

You can edit an unlock in the code editor's substring.
Click the arrow in the action field to pull up the editor.

![21](https://user-images.githubusercontent.com/113108555/189727326-50547e36-9ac1-4135-b138-b28406dee8aa.png)

In the editor, you can add additional fields the table doesn't come
with by default.
Data is entered in the JSON format.
More details about the unlock format see [here](./unlocks-config-format).

While you're editing attributes, the `SAVE CHANGES` button activates.
Click `SAVE CHANGES` when you're done editing.

![22](https://user-images.githubusercontent.com/113108555/189727327-a2e91c66-ada5-4095-93e9-6253d356a9bc.png)

When you save your changes, the table data updates dynamically.

The code editor highlights syntax, entry errors, and tabulation.
Fields with empty values are not shown in the editor.

### Deleting an unlock

To delete an unlock, click the button in the `Remove` field and
confirm the deletion.
If the unlock deletes successfully, the table dynamically updates,
and the unlock field disappears.

![23](https://user-images.githubusercontent.com/113108555/189727329-8f4faab2-c548-4b40-bfee-219edb0daccd.png)

If you clicked the delete button accidentally, click `NO` in the pop-up.

![24](https://user-images.githubusercontent.com/113108555/189727330-87ee58a1-ac5a-479f-a08d-463f4f1978ee.png)

### Downloading the config file

The service lets you download the config file to your computer so you can
make changes in your local code editor.
Just click `Download Config`.
If the file downloads successfully, you'll get a notification, and the JSON
file will be in your downloads.

![25](https://user-images.githubusercontent.com/113108555/189727331-1c3562a3-87dd-4c82-ad14-2f88fae5cc94.png)

![26](https://user-images.githubusercontent.com/113108555/189727334-d9ed7aa1-85da-4b00-b5ac-49bf00424636.png)

### Uploading the config file

The service lets you upload the config file from your computer.
Just click `UPLOAD CONFIG` and select the JSON file in the window that pops up.
To confirm your upload, click `Open` in this window.

![27](https://user-images.githubusercontent.com/113108555/189727339-8a92d5f6-6a48-4c19-a7e6-cfbd437edf00.png)

If the config file is valid and uploaded successfully, you will
see a notification.
If the file is invalid, you will get a server error message.

![28](https://user-images.githubusercontent.com/113108555/189727341-07278703-9448-4001-9080-3a80b7d76976.png)

## Leaderboard tab

The leaderboard tab gives you a read-only table view of the attributes
in the table heading.
To sort leaderboards, click a heading.
Leaderboards can be sorted by any field except `idx` and `nick`
(they are sorted by the apples field by default).

![29](https://user-images.githubusercontent.com/113108555/189727342-87494b37-38f3-4681-b27c-037b3dd4be6c.png)

## Configs tab

To update service configs, go to the configs tab and click `Update Config`.
If the update fails, you will get a server error message.

![30](https://user-images.githubusercontent.com/113108555/189727344-e60bfb4b-3ab4-4365-ac53-220ff994dba6.png)

If the config is updated successfully, you'll see a notification to that effect.
