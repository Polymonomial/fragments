# tests/integration/put-fragments.hurl
# Authenticated POST to /v1/fragments
POST http://localhost:8080/v1/fragments
# We're sending a plain text fragment
Content-Type: text/plain
# Include HTTP Basic Auth credentials
[BasicAuth]
user1@email.com:password1
# Body of the request goes in ```...``` when it's a string
`This is a fragment!`

# 1. We expect to get back an HTTP 201
HTTP/1.1 201
# We have various assertions about the response that we want to check
[Asserts]
# The Location header should look like what we expect (including the fragment id)
header "Location" matches "^http:\/\/localhost:8080\/v1\/fragments\/[A-Za-z0-9_-]+$"
jsonpath "$.status" == "ok"
# Our fragment ids use UUIDs, see https://ihateregex.io/expr/uuid/
jsonpath "$.data.id" matches "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
# Our ownerId hash is a hex encoded string
jsonpath "$.data.ownerId" matches "^[0-9a-fA-F]+$"
# Basic check for the presence of created and updated date strings.
# You could also write a regex for this and use matches
jsonpath "$.data.created" isString
jsonpath "$.data.updated" isString
jsonpath "$.data.type" == "text/plain"
# 19 is the length of our fragment data: 'This is a fragment!'
jsonpath "$.data.size" == 19
# Capture the Location URL and fragment ID
[Captures]
url: header "Location"
fragment_id: jsonpath "$.data.id"

# 2. Try to GET the fragment we just posted by its URL
GET {{url}}
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
Content-Type: application/json; charset=utf-8
Content-Length: 90
[Asserts]
body == `{"status":"ok","data":{"contentType":"text/plain","size":19,"data":"This is a fragment!"}}`

# 3. Update the fragment with PUT using the captured fragment ID
PUT http://localhost:8080/v1/fragments/{{fragment_id}}
Content-Type: text/plain
[BasicAuth]
user1@email.com:password1
`This is updated content!`

HTTP/1.1 200
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.data.type" == "text/plain"
jsonpath "$.data.size" == 24
# Check that updated time is different from created time
jsonpath "$.data.updated" isString
jsonpath "$.data.created" isString

# 4. GET the updated fragment to verify changes
GET http://localhost:8080/v1/fragments/{{fragment_id}}
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
[Asserts]
body == `{"status":"ok","data":{"contentType":"text/plain","size":24,"data":"This is updated content!"}}`

# 5. Test PUT with wrong content type (should fail)
PUT http://localhost:8080/v1/fragments/{{fragment_id}}
Content-Type: application/json
[BasicAuth]
user1@email.com:password1
`{"message": "wrong type"}`

HTTP/1.1 400
[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.code" == 400

