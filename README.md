### Cisco Spark File Upload Web Service API

This API allows users who do not have an external web server to temporarily post/upload files so that they can be added to a Spark Room of their choosing.

Cisco Spark is a cloud based team collaboration application with an extensive API set for creating collaboration rooms, exchanging messages and files, etc, performing video conferences, et al.

#### Usage

Currently this API is under construction and more documentation is coming soon on its more extensive usage.

There are several requirements in order to utilize this API:

1. Have a Cisco Spark Auth Token
2. Have a RoomID (so files can be uploaded accordingly); I could use Room Title, but it requires GETTING all the rooms you are a member of and then matching a Title with Title
3. Sending the API, the fileName you are using for the file
4. Convert your local file into a proper blob (for images the buffer needs to converted into a BASE64 String)
5. File Limitation at this point is 1gb (we'll see how that goes)

* More Documentation is coming soon..such as the endpoint where you POST files etc.
