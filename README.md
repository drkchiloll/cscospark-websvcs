# Cisco Spark Web Services APIs

__Endpoint__

__https://ciscospark.live/__

** __Disclaimer__: Please note that although I am using SSL, I'm also utilizing a Self-Signed Certificate (signed certs cost too much); so your file transfer(s) will be Encrypted between your program and this API, but in the case of trusting the self-signed Cert your requests have to disable strict SSL enforcement

```
// NodeJS using request module
{strictSSL : false}
// NodeJS using (built-in) HTTPS module
{rejectUnauthorized : false}
# PY
req.post(url=..., verify=False)
```

## Machine Based Authentication Plus Refreshing an AccessToken

Cisco Spark API Access Tokens have a lifespan of __14 DAYS__ and the Refresh Token expires after 90 DAYS. However, whenever you use the Refresh Token during those __90 DAYs__ to retrieve a new Access Token the 90 DAY expiry is reset to a new 90 DAYs lifespan, so in theory if you retrieve a new Access Token every 14 days you will never need to perform an __/authenticate__ action again when using this API; you would perform a __/refresh__.

Using a __non-Corporate/SSO Spark account__, for example, one using @GMAIL.COM or @Outlook.com, perform OAuth to:

<img src='http://citydilse.com/images/pr.jpg' width=55 height=22> https://ciscospark.live/authenticate

```
// Headers
{ "Content-Type" : "application/json" }

// POST DATA
{
  "user":        "user@example.com",
  "pass":        "yourpassword",
  "id":          "your apps client_id",
  "secret":      "your apps client_secret",
  "redirectUri": "your apps redirect_uri"
}
```

<img src='http://citydilse.com/images/pr.jpg' width=55 height=22> https://ciscospark.live/refresh

```
// POST DATA
{
  "id":            "client_id",
  "secret":        "client_secret",
  "refreshToken" : "refresh token received from /auth call"
}
```

#### HowTo

1. You have to have a Machine Account as mentioned. CORPORATE Accounts do not work (mine doesn't at least which is @WWT.COM)
2. Goto https://developer.ciscospark.com Login with the aforementioned account
3. Goto My Apps (top right adjacent your Avatar)
4. Add An Application; The Redirect URL can be anything; The SCOPES need to include ALL Options..
5. SAVE (there will be an Error but don't worry)
6. Go Back Into the App and Copy your Client ID and Secret somewhere you can reference from your Language of Choice

##### Example Using cURL

```
curl -H "Content-Type: application/json" -X POST -d '{"user":"user@gmail.com","pass": "password", "id":"client_id","secret":"client_secret","redirectUri":"http://example.com"}' --insecure https://ciscospark.live/authenticate

curl -H "Content-Type: application/json" -X POST -d '{"id":"client_id","secret":"client_secret","refreshToken":"token"}' --insecure https://ciscospark.live/refresh
```

##### Example Using Python

``` python
import requests
import json

uri = 'https://ciscospark.live/authenticate'
authData = {
  'user': 'someone@example.com',
  'pass': 'someones password',
  'id': 'someones app client_id',
  'secret': 'someones app client_secret',
  'redirectUri': 'someones app redirect_uri'
}
headers = { 'Content-Type' : 'application/json' }
req = requests.post(
  url=uri,
  headers=headers,
  data=json.dumps(authData),
  verify=False
)
# access_token/refresh_token
print req.text

```

### Cisco Spark File Upload Web Service API

This API allows users who do not have an external web server to temporarily post/upload files so that they can be added to a Spark Room of their choosing.

Cisco Spark is a cloud based team collaboration platform that includes an extensive API for developers(builders) to dynamically create collaboration rooms, exchange messages and files, perform video conferences and much more.

#### Usage

Currently this API is under construction and more documentation is coming soon on its more extensive usage.

There are several requirements in order to utilize this API:

1. Have a Cisco Spark Auth Token
2. Have a RoomID (so files can be uploaded accordingly); I could use Room Title, but it requires GETTING all the rooms you are a member of and then matching a Title with Title
3. Sending the API, the fileName you are using for the file
4. Convert your local file into a proper blob (for images the buffer needs to converted into a BASE64 String)
5. File Limitation at this point is 1gb (we'll see how that goes)

#### Supported File Types

* ALL TXT Based Files (JS, HTML, JSON, PY, et al)
* PNG, JPG
* ZIP
* DOCX, PPTX, XLSX
* PDF

#### Examples

##### Endpoint

<img src='http://citydilse.com/images/pr.jpg' width=55 height=20> __https://ciscospark.live/fileuploader__

```javascript
{
  sparkToken: 'token',
  sparkRoom: 'roomId',
  data: [{fileName: 'filename', blob: 'file encoded data'}]
}
```

##### JavaScript/NodeJS

```javascript
var request = require('request'),
    fs = require('fs');

// Examples use the Synchronous API (not necessarily recommended)
var file1 = fs.readFileSync('./file1.txt', 'utf8');
var file2 = fs.readFileSync('./file2.png' 'base64');

// Public URL to the API
var apiUrl = 'https://ciscospark.live/fileuploader';
var postData = {
  sparkToken: 'token',
  sparkRoom: 'Spark roomId',
  data: [
    { fileName: 'file1.txt', blob: file1 },
    { fileName: 'file2.png', blob: file2 }
  ]
};

request({
  uri: apiUrl,
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  strictSSL: false,
  json: postData
}, function(err, res, body) {
  // Handle Response
});
```
