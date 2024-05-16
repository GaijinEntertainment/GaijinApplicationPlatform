---
title: JWT security
---

This topic discusses the recommended practices to ensure the security of JWT and explains how to prevent unauthorized usage of tokens.


#### JWT with fixed audience

JWT can contain the `aud` (application number) field, which is validated by the system. If the `aud` in the token does not match the application id numeric value (`targetAppID` field in the request), then an error is sent. 
 
Thus, the requests in this case are allowed for the applications for which the token is issued.

The code example is provided below:

```
// CheckJwtAudience checks if JWT aud claim is valid for target application.
func CheckJwtAudience(jwt jwt.JWT, targetAppID int) error {
	if audience := jwt.Claims().Get("aud"); audience == nil || targetAppID == 0 || audience == strconv.Itoa(targetAppID) {
		return nil
	}

	return ErrInvalidAudience
} 
```

#### Using JWT from a particular device

A token may contain the factor field, which is saved in the browser. When a user logs in, the randomly generated `factor` field value is transmitted to the server. JWT does not store the `factor` field value directly. Instead, the factor is encoded and its hash value is stored in the token.

The browser saves the `factor` field value, allowing the user to log in with this token only from the same browser that was used for the initial login. This is because only this browser has the factor.

Such a technique makes stealing a token almost pointless, because even if the token is stolen, it will still be impossible to log in without a factor on another browser.

##### Limitations

In some cases, this technique does not work very well. Suppose that a developer performs multiple admin requests, such as uploading new builds. All these commands should be performed with this token. This means that the user must log in and then send the token, but in this case, a user would have no valid factor field. Therefore, they have to log in without using the factor, which is unsafe.

On the other hand, a user may log in every time when one needs to perform any operation, but that would be a very inconvenient practice. One way to solve this problem and improve security is to limit the IP addresses from which this token can be used. 

#### JWT restricted by IP addresses

It is often convenient to keep a user logged in continuously, so that one does not have to log in every time. However, the risk of token theft exists in this case, which can be particularly dangerous when performing access requests for tokens with privileged users’ permissions.

One way to improve the token security is to record the IP address a user logged in from. If the token is stolen, most likely the IP address will be different. If then someone log in with this token from another IP address, such a login will be rejected (with the error message 403).

To receive a token bound to the IP address from which the login was made, it is necessary to specify the additional parameter when logging in. For more information about login parameters, refer to the[Login](https://nginx.org/en/docs/http/ngx_http_auth_request_module.html) article.

`fixed_ip=1`

The system will write the IP address used for login into the token. Hence, this token will not work from any other IP address.

Players may find this technique inconvenient, as their IP addresses can change frequently. But this method of ensuring JWT security is quite efficient for development. Even if the IP address changes, a developer usually knows about it and will be able just to log in again with the fixed IP parameter, receive a token with the new IP address and continue with this new token.

!!!note
    The best use of this mechanism is to protect the personal tokens of users that work with the Central and other GAP tools.

There are two main scenarios when you can use this technique.

**First scenario**

You need to use a token regularly to perform multiple operations from the command line and do not want to log in again every time. Here, you generate a token with a fixed IP address recorded inside this token, and then save this token to the local disk for later use. In this case, stealing this token becomes almost pointless.

A service that supports JWT authorization, when receiving a token, indicates that the token should be bound to the user’s current IP address. If the received token contains a corresponding claim (see the example below), then such a token could be saved on disk and used for subsequent logins.

If the returned token does not include an IP address, or if we requested a bound token and received a regular token in response, then such a token should not be saved.

**Second scenario**

You need to create a token that can be used on the server(s) with known IP address. Suppose that an implemented on a server continuous integration system has a build that assembles a new version of the game and uploads it to GDN. In order to upload a build, the system must have the corresponding credentials. As a developer, you can give such credentials to a service user (service account) created specifically for the build system. For this service user, you can generate a token with the fixed IP address (or IP addresses) from which the build system will work. 

!!!note
    Make sure that you have a fixed IP address for the server or you know a network server, which IP addresses may change within the network. Having a random IP address or unknown network may result in losing access to the system because such an IP address may be changed at any time. 

    When the server has a dynamic IP address (for example, if it is hosted in dynamically created containers), this method does not apply.


To store binding information, the fip claim is used. It stores a list of allowed IP networks in the CIDR format, shown in the example below:
```
{
  "fip": [
      "124.56.48.12/30",
    "127.0.0.1/16",
    "57.234.44.15/32"
  ]
}
```

For more information about CIDR format, refer to [this](https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing) article.