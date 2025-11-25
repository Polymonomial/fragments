POST http://localhost:8080/v1/fragments
Content-Type: text/plain;charset=utf-8
[BasicAuth]
user1@email.com:password1

`This is a fragment!`

# 1. We expect to get back an HTTP 201
HTTP/1.1 201
[Asserts]
jsonpath "$.data.type" == "text/plain;charset=utf-8"
[Captures]
url: header "Location"

GET {{url}}
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
Content-Type: application/json; charset=utf-8
Content-Length: 90
[Asserts]
body == `{"status":"ok","data":{"contentType":"text/plain","size":19,"data":"This is a fragment!"}}`
