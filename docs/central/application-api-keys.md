---
title: API Keys
---

API keys are essentially unique identifiers that are associated with a particular application, and are used to make authorized requests to Gaijin Application Platform API. Caution should be exercised when storing API keys, as failure to securely manage them can result in a compromise of your application's security and potential unauthorized access to the API.

---

![Application API keys](./assets/app-api-keys.png)

You can have a maximum of **two active tokens** at the same time. Two tokens are necessary in case you need to reissue a token, for example, because the current one was compromised. In this case you can issue a new token, replace the current token with the new one and then remove the previous token, thus making it invalid.

:::caution

When generated, the new token should be saved. Once created, it cannot be restored. Only a new one can be issued. It is not advisable to generate an access token until you really need it.

:::
