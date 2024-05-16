---
title: Using JWT
---

This topic explains the basic concept of JSON Web Tokens (JWT) and how to use it within Gaijin Application Platform (GAP).

### What is JWT?

JSON Web Tokens (JWT) is an access token standard using JSON. It is an open standard that allows to contain encoded information about the user, signed by the author (or the proof center) that issued the information.

Using JWT is a simple way to distribute user information, ensuring that the contained information is valid. SSO is the certification authority which confirms the authenticity of the reported information with its signature. The public key received from the SSO allows you to verify this signature, confirming that this specific SSO issued this information.

The main purpose of the JWT is to simplify the login process, allowing access without the need to authenticate for each service.

The lifetime of JWTs can be long lasting. Many noncritical services can trust a long-lived token for an extended period. For more important services, a token could be trusted for a shorter time.

A JWT can contain additional information entered by the issuing authority, either independently or at the request of the token recipient. For instance, a token recipient might ask to include their identifiers on third-party sites or the current IP address to facilitate binding the token to this address.

The token may also contain information about user [permissions](../basic_concepts/roles-and-permissions_concepts.md) when generated. Such information can be trusted when the user’s permissions are verified a few seconds after the user logged in and the token has been issued. However, could you trust such user permissions after one hour, or would it be better to request the information again in this case?

Typically, information about user rights that is stored in a JWT is reliable for a limited period of time because user permissions may expire, making the contained information outdated. Consequently, the duration for which the stored information can be trusted is determined by the service that accepts the token with user permissions.

However, developers must decide themselves whether the information stored in the token is trustworthy for a particular service.


### JWT structure

!!!note
    This section describes a specific implementation, not the JWT standard.


The generated token contains three parts separated by a dot: header, payload and sign. All parts are URI-safe Base64 encoded for transport security if sent as a part of the URI.
- Header — Contains metadata that is a technical information about the token and the cryptographic algorithm used (usually HMAC SHA256 or RSA):

  - `alg` (required) – the algorithm used for signing/encoding. For SSO, the system uses the RS256 format signature.
  - `typ` (optional) – the token type, which value is normally “JWT”.
- Payload – Holds the actual data that the token contains, including the user information and additional metadata:
  -	`iss` (required) – the app_id (or project number) that issues a particular JWT.
  -	`exp` (required) – the unix timestamp showing when the token will expire.
  -	Other data specific to a particular request.
- Signature – verified using a public key

### Types of JWT

- Custom tokens 

  - Bound (regular) –  A token that is issued to the user during the authorization process. It is bound to the application. Using this token, you can get a set of user permissions.

  - Unbound (clean) – A special one-time use token that is obtained using a bound token. This type of token is not bound to anything. This is a temporary token that is needed to transfer authorization to another application. Suppose that the user needs to ensure that there is some launcher that could launch games. Here, you need an unbound token enabling each program to log in when you logged in to the launcher.  An attempt to issue a bound token twice will result in an error.

- Service tokens

  - Generated service JWT – It is generated each time on a request and signed with a private key. You can get the private keys of your service (as well as the SSO public key) using devops. This token can be exposed on the client's side.
  
  - Predefined – Manually written token for the application (contact @webdev). It is not permitted to expose JWT of this type on the client’s side

### Getting a custom JWT

In the vast majority of cases, JWT is returned by default for all successful authorization requests. In some cases, you need to specify the flag for generating JWT (we recommend checking the documentation for the login method).

When receiving data from SSO using a refresh token, the response will contain the following fields:

- jwt - a user token, enabling you to get all necessary user rights.

- factor - the identifier of the device from which the login was made; it will be further needed for actions with permissions.

The token signature can be verified with the SSO public key. To obtain the current key, call the Get project public key method, specifying the key ID, which can be obtained from the JWT (`kid` field in the header):

GET `/api/permissions/application/publicKey/<keyId:string>`

The workflow of processing tokens is as follows:

1. Read the header and verify that it belongs to JWT.

2. Get the kid from the header.

3. Using the kid, get the public key.

4. With the public key and algorithm, check the signature.

5. If the signature is correct, decode the token and get information from the payload.

 After decoding, you will receive an object that looks like shown in the picture below:

```
{
“exp”: ..., // unix timestamp when this token expires

“fac”: ..., // hash [sha256(fac+slt)] of the device identifier from which the login was made

"iat" indicates the Unix timestamp at which the token was issued.

“iss”: “1”, // app_id of the service that issued the token (for SSO - 1)

“loc”: ..., // hash [sha256(loc+slt)] geolocation data by login IP

“slt”: ..., // random salt

“tgs”: ..., // string user tags, separated by comma

“uid”: “...” // user id (number as a string),

“rev”: “1” // token revision number ( if missing, then "rev=0").

“kid”: “...” // ID of the public key; it can be used in the method of obtaining the application key for JWT verification

“auth”: “...” // authorization type (auth field from the Auth service authorization response)

“pub_key”: “...” // public key (further used to verify the signature in some API requests)

“fip”: [] // array of IP address(es) with a mask for which the token was issued. Further, these addresses can verified with the address of a particular request initiator on the client side.

“lng”: “...”, // language code

“cntry”: “...” // country (as in response from Auth::userinfo)

“links”: [] // an array of links to external platforms (as in the response from Auth::userinfo)

“prem”: “psn|live” // premium content flag for psn or live consoles (psn_plus or live_premium flag in the Auth service response)

“app”: [1, 2, ...] // external application identifiers (if any),

“env”: [“test”, ...] // list of supported contours (if any),

“app_perm”: 1, // internal identifier of the application for which the set of rights is defined in the permissions system

“aud”: “1” // internal identifier of the target application in the permissions system (contained in tokens issued in the control panel);

“perm”: [] // set of rights for the user
}
```

!!!note
    There may be various custom fields present in the token, depending on the set of flags in the requests for the custom JWTs.


To obtain permissions, a request is made to `/api/permissions/meta/data`. For details on managing permissions refer to the [Roles and Permissions management](../central/roles-and-permissions_manage.md) section.

An example of header and payload of the real SSO JWT is shown below.

- **Header**


```
{
  "alg": "RS256",
  "kid": "381476",
  "typ": "JWT"
}
```

- **Payload**


```
{
  "auth": "login",
  "cntry": "GE",
  "exp": 1703691169,
  "fac": "0b3bf238875dbbcc732d7dbf19c10874d77cdd9e44bd6e2c9bb6965a90a6bbfc",
  "iat": 1695915169,
  "iss": "1",
  "kid": "381476",
  "lng": "ru",
  "loc": "357acf93a26fd2ada0a2853d8d669e04b0feb0315761d8d351da1f2ee913c1dc",
  "nick": "someUserName",
  "slt": "GBgBHnro",
  "tgs": "email_verified,lang_ge,partner_organic,player_el,player_wt,sso_allowed_post,wt_first_login,wt_ge",
  "uid": "133292415"
}

```

### Transferring unbound tokens to an application

1. The process of transferring unbound tokens is as follows:

2. The application “A” authorizes the user and receives the login token.

3. Using the login token, the application “A” gets an unbound token.

4. The application “A” transfers an unbound token to the application “B”.

5. The application “B” exchanges the received token for a bound token.

    !!!note
        If the application “B” encounters the error "Token has already been used" while attempting to get a bound token, the token for which the unbound token was issued should be revoked (refer to API below). This is because, in this scenario, it is likely that the unbound token has been compromised.


6. In addition, a good practice would be to inform the application that issued the unbound token about the status of the operation.

### Unbound token APIs

#### Getting an unbound token

POST `https://login.gaijin.net/api/sso/temporaryJwt`

BODY: `jwt=XXXXX&factor=YYYYY`

- jwt - bound token for which a one-time token will be issued.

- factor - identifier of the device used the login (comes along with the bound token in response to the SSO refresh token)

RESPONSE: JSON
```json
{"status": "OK", "jwt": "XXXXXX"} // in case of successful creation of an unbound token

{"status":"LOGINERROR", "error": errorMessage} // in case of any errors, where errorMessage:

"Wrong token format" - token parsing error.

"Token rejected" - the token has been revoked.

"Wrong token" - the token has expired or is not confirmed.

"Generate token error" - internal error when generating a temporary token.
```

#### Exchanging an unbound token for a bound token API

POST `https://login.gaijin.net/api/sso/securityJwt`

BODY: `jwt=XXXXX`

- jwt - unbound token

**RESPONSE: JSON**
```json
{"status": "OK", "jwt": "XXXXX", "factor": "YYYYY"} // in case of successful creation of a bound token

{"status":"LOGINERROR", “error”: errorMessage} // in case of any errors, where errorMessage:

- “Wrong token format” - token parsing error

- “Token expired” - the token has expired

- “Wrong token” - the token has expired or not confirmed

- “Generate token error, deactive temporary” - failed to mark the token as already used

- “Generate token error” - internal error when generating a temporary token

- “Token has already been used” - the token has already been used
```
#### Revocation of a token for which an unbound token was issued 

POST `https://login.gaijin.net/api/sso/rejectJwt`

BODY: `jwt=XXXXX&cleanjwt=YYYYY`

jwt - a user token (bound)

cleanjwt - temporary token (unbound)

**RESPONSE: JSON**

``` json
{"status": “OK”} // jwt withdrawn

{"status":"LOGINERROR", “error”: message} // in case of any errors, where errorMessage:

- “Wrong token format” - token parsing error

- “Token rejected” - the bound token has been revoked

- “Wrong token” - the token has expired or is not confirmed

- “Wrong temporary token” - temporary token has expired or is not confirmed

- Token expired” - the token has expired or is not confirmed

- Cannot self ban” - it is impossible to revoke a token issued by the current temporary
```
### Ensuring JWT safety

Essentially, any person who has the token can enter and execute a command on behalf of the person to whom the token is issued. Theft of a token is always unacceptable for any user, but it is especially dangerous if the stolen token belongs to a developer or administrator. Therefore, preventing unauthorized use of a token is an important security concern. For details on ensuring JWT safety refer to the [JWT security](../best_practices/JWT_security.md) section.