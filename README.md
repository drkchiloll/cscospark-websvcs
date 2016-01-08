### Cisco Spark File Upload Web Service API

This API allows users who do not have an external web server to temporarily post/upload files so that they can be added to a Spark Room of their choosing.

Cisco Spark is a cloud based team collaboration platform that includes an extensive API for developers(builders) to dynamically create collaboration rooms, exchange messages and files, perform video conferences and much more functionality.

#### Usage

Currently this API is under construction and more documentation is coming soon on its more extensive usage.

There are several requirements in order to utilize this API:

1. Have a Cisco Spark Auth Token
2. Have a RoomID (so files can be uploaded accordingly); I could use Room Title, but it requires GETTING all the rooms you are a member of and then matching a Title with Title
3. Sending the API, the fileName you are using for the file
4. Convert your local file into a proper blob (for images the buffer needs to converted into a BASE64 String)
5. File Limitation at this point is 1gb (we'll see how that goes)

#### Examples

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
  headers: {'Content-Type': 'application/json'},
  strictSSL: false,
  json: data
}, function(err, res, body) {
  // Handle Response
});
```
