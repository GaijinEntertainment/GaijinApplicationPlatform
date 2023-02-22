---
title: Uploading a Project to GDN
sidebar_position: 5
---

# Uploading a Project to Gaijin Distribution Network (GDN)

## Preparation

To work with the GDN servers, you need the following programs:

- `yupgen.exe` - preparing a build for upload to GDN
- `yupload.exe` - uploading a build to GDN
- `gaijin_updater64.exe` - downloading a version from GDN to a local computer

Download tools from the releases page: [GaijinApplicationPlatform/releases](https://github.com/GaijinEntertainment/GaijinApplicationPlatform/releases)

Now assume that all utilities are available on paths, although they may be located at any place and they may be called up by the full name of the file.

Let’s say that your build is in the `.\builds\release` catalog, counting from the current catalog

## Generating a YUP file

Invoke the following command:

```
yupgen.exe -path .\builds\release -proj <PROJECT> -ver <VERSION>
```

As a result, in the current catalog, there should appear a file of the form `a2e61e8a631c353b59091a6b17ef64f7f358b70d.yup`

That file contains the description of your build together with the project name, version, a list of all files, and a hash of their content. Being that YUP contains hashes of all the files from the `.\builds\release` catalog, you must not change the content of that catalog after the build.

## Uploading a build

```
yupload.exe a2e61e8a631c353b59091a6b17ef64f7f358b70d.yup -check 0 -src .\builds\release -deploy -tracker http://yuptracker.gaijinent.com:27022/announce -dev https://gdn.gaijin.net/yuitem
```

This command will request a login and a password of the user on whose behalf the operation will be performed, then it will register the build in GDN and perform the build upload, making sure that all the data has been uploaded successfully and can be available for download.

## Managing builds

Build are managed through the administrative panel at [https://gdn.gaijin.net/yuitem/admin/](https://gdn.gaijin.net/yuitem/admin/)

## Downloading a build

Let us suppose that you want to download the build currently marked with the `nightly` tag to the `last_nightly_build` catalog

```
mkdir last_nightly_build
gaijin_updater64.exe -p <PROJECT> -t nightly -f last_nightly_build --yupmaster gdn.gaijin.net --clear --verbose --norun --noupdate
```
