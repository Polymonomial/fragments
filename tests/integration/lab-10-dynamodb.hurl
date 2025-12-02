#Dynamo POST test
# Authenticated POST to /v1/fragments
POST http://localhost:8080/v1/fragments
# We're sending a json metadata object
Content-Type: application/json
# Include HTTP Basic Auth credentials
[BasicAuth]
user1@email.com:password1
# Body of the request goes in ```...``` when it's a string
{ "service" : "DynamoDB"}

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
[Captures]
url: header "Location"
oneID: jsonpath "$.data.id"

# 2. Try to GET the fragment metadata we just posted by its URL
GET {{url}}/info
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
Content-Type: application/json; charset=utf-8
[Asserts]
jsonpath "$.status" == "ok"

# metadata exists and looks like metadata
jsonpath "$.data.id" matches "^[0-9a-fA-F-]{36}$"
jsonpath "$.data.ownerId" matches "^[0-9a-fA-F]+$"
jsonpath "$.data.created" isString
jsonpath "$.data.updated" isString

# fragment is nested and consistent
jsonpath "$.data.fragment.id" matches "^[0-9a-fA-F-]{36}$"
jsonpath "$.data.fragment.ownerId" matches "^[0-9a-fA-F]+$"
jsonpath "$.data.fragment.type" == "application/json"
jsonpath "$.data.fragment.size" == 22


# Authenticated md POST to /v1/fragments
POST http://localhost:8080/v1/fragments
# We're sending a json metadata object
Content-Type: text/markdown
# Include HTTP Basic Auth credentials
[BasicAuth]
user1@email.com:password1
# Body of the request goes in ```...``` when it's a string

"#DynamoDB is **great**"

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
[Captures]
url: header "Location"

# 4. Try to GET both fragments metadata we just posted by its URL
GET {{url}}/info
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
Content-Type: application/json; charset=utf-8
[Asserts]
jsonpath "$.status" == "ok"

# metadata exists and looks like metadata
jsonpath "$.data.id" matches "^[0-9a-fA-F-]{36}$"
jsonpath "$.data.ownerId" matches "^[0-9a-fA-F]+$"
jsonpath "$.data.created" isString
jsonpath "$.data.updated" isString

# fragment is nested and consistent
jsonpath "$.data.fragment.id" matches "^[0-9a-fA-F-]{36}$"
jsonpath "$.data.fragment.ownerId" matches "^[0-9a-fA-F]+$"
jsonpath "$.data.fragment.type" == "text/markdown"
jsonpath "$.data.fragment.size" == 24

# 5. Try to GET the both fragments metadata we just posted by its URL
GET http://localhost:8080/v1/fragments
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
Content-Type: application/json; charset=utf-8
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.data" isCollection
[Captures]
b4length: jsonpath "$.data[0]" count

# 6. Try to DELETE the first fragment
DELETE {{url}}
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200

#7. Try to get deleted fragment should return 404
GET {{url}}
[BasicAuth]
user1@email.com:password1

HTTP/1.1 404

#8. Get all and first should not be in
GET http://localhost:8080/v1/fragments
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
Content-Type: application/json; charset=utf-8
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.data" isCollection
jsonpath "$.data[0]" count < {{b4length}}
