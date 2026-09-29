# Partner Integration


## User integration API

This API is used to add a partner's service to the user's account automatically.

An example of this is the addition of a new cloud vendor to a user's Cloud 66 account without user's manual intervention.

User integration API has three steps:

1. Redirect from Cloud 66 website to Partner website
2. Provisioning of service on the partner side and addition to user's account.
3. Redirect from partner's website to Cloud 66 website.

### Redirecting to Partner's website

Cloud 66 user sees an integration option on his dashboard and clicks on it. He is redirected to the partner's website with the following payload:

```http
GET https://partner/url?uid=abc123&email=jon@smith.com&callback=https://app.cloud66.com/url
```

- **uid**       A unique ID of the user
- **email**     user email address
- **callback**  The URL to redirect the user back when the provisioning is done on the partner side.

### Provisioning

Once the user is redirected to partner's website, the partner will try to provision an new account for the user or locate an existing one based on the email of the user. Depending on the outcome the partner can make an API call to Cloud 66 to add the provisioned information about the user to his Cloud 66 account. This could be the API keys of a cloud vendor or the project UID for an exception handling service.

Each partner is given a unique API endpoint. If you don't have your partner endpoint, please contact [support@cloud66.com](mailto:support@cloud66.com)

You can make an HTTP POST to the partner integration API with the following payload:

- **link_uid** The UID sent to the partner in the original redirect.
- **user_email** User email. Should be the same as the one in the original redirect.

Any other partner specific payload will be here.

#### Failure

| HTTP Code        |  Description |
| - | --:|
| 200      |  service added (integration successful) |
| 403      |  integration specific errors |

## Single Sign-on (SSO)

Cloud 66 provides a simple solution to allow partner customers use their Cloud 66 login credentials to identify themselves. To enable SSO, partners need to contact [support@cloud66.com](mailto:support@cloud66.com). Once the partner account is established you will received a partner `UID` and `PROVIDER` name which can be used as follows:

### Step 1 - Call Cloud 66 SSO endpoint

First step is to redirect user to Cloud 66 to make sure they are logged in (or let them log in if they are not). Users should be redirectd to `https://app.cloud66.com/sso/signin/PROVIDER`. You need to replace `PROVIDER` with the your unique partner name which will be given to you after partner registration.

### Step 2 - Cloud 66 Authenticates

After the redirect, Cloud 66 will authenticate the user as the user might be already logged in or it might need to login. 

### Step 3 - Redirect back to partner

Once the user is authenticated, the user will be redirected back the partner's site. The redirect URL will be the one provided by the partner at the point of registration.

To ensure the authenticity of the redirect, the partner has to check the payload of the callback. The payload will have the following fields: `multipass` and `signature`

MultiPasses are json hashes encrypted with strong AES encryption.  They are typically
passed as cookie values, URL params, or HTTP header values, depending on how
the individual service chooses to implement it. The fields available in multipass are as follows:

- `email`: user's email
- `name`: user's name
- `expires`: time when this multipass expires. (1 minute in future).

The `multipass` is encrypted with the first 16 characters of provider's UID.

Here is a [Ruby implementation of multipass](https://github.com/entp/multipass).

`signature` is a SHA256 hash of the second 16 characters of provider's UID and the multipass. 

Provider needs to recalculate the multipass and signature and check its authenticity using the same method. Once the authenticity of the callback is established, provider can use the data encrypted in the multipass.

## Using OAuth2

If a partner requires specific permissions over a user's account, they can use the [Cloud 66 oAuth2 API](https://developers.cloud66.com/) instead or in addition to the SSO method above.