# Cisco Spark Web Services APIs

__Endpoint__

__https://45.55.244.195/__

** __Disclaimer__: Please note that although I am using SSL, I'm also utilizing a Self-Signed Certificate (signed certs cost too much); so your file transfer(s) will be Encrypted between your program and this API, but in the case of trusting the self-signed Cert your requests have to disable strict SSL enforcement

```
// NodeJS using request module
{strictSSL : false}
// NodeJS using (built-in) HTTPS module
{rejectUnauthorized : false}
# PY
req.post(url=..., verify=False)
```

## Machine Based Authentication

Using a __non-Corporate/SSO Spark account__, for example, one using @GMAIL.COM, perform OAuth to:

<img src='http://citydilse.com/images/pr.jpg' width=55 height=22> h3 https://45.55.244.195/authenticate

```
// Headers
{ "Content-Type" : "application/json" }

// POST DATA
{
  "user":      "user@example.com",
  "pass":      "yourpassword",
  "id":        "your apps client_id",
  "secret":    "your apps client_secret",
  redirectUri: "your apps redirect_uri"
}
```

#### HowTo

First You have to have a Machine Account as mentioned.

##### Example Using Python

``` python
import requests
import json

uri = 'https://45.55.244.195/authenticate'
authData = {
  'user': 'someone@example.com',
  'pass': 'someones password',
  'id': 'someones app client_id,
  'secret': 'someones app client_secret',
  redirectUri: 'someones app redirect_uri'
}
headers = { 'Content-Type' : 'application/json' }
requests.post(
  url=uri,
  headers=headers,
  data=json.dumps(authData),
  verify=False
)
# access_token/refresh_token
print requests.text

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

<img src='http://citydilse.com/images/pr.jpg' width=55 height=20> __https://45.55.244.195/fileuploader__

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
var apiUrl = 'https://45.55.244.195/fileuploader';
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
