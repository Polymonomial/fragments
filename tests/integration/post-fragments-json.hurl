POST http://localhost:8080/v1/fragments
Content-Type: application/json
[BasicAuth]
user1@email.com:password1

{
  "data": "This is a fragment!"
}


# 1. We expect to get back an HTTP 201
HTTP/1.1 201
[Asserts]
jsonpath "$.data.type" == "application/json"
[Captures]
url: header "Location"

GET {{url}}
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
Content-Type: application/json; charset=utf-8
Content-Length: 105
[Asserts]
body == `{"status":"ok","data":{"contentType":"application/json","size":30,"data":{"data":"This is a fragment!"}}}`
