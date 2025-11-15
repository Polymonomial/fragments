POST http://localhost:8080/v1/fragments
Content-Type: text/css
[BasicAuth]
user1@email.com:password1

`This is a fragment!`

# 1. We expect to get back an HTTP 415
HTTP/1.1 415
