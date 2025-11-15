# Health Check Test
GET http://localhost:8080

# We should get back an HTTP 1.1 200 response
HTTP/1.1 200
# We should get back a non-cacheable response (cache-control header)
Cache-Control: no-cache
# Extra checks to perform against the response
[Asserts]
# We expect to get back a JSON response with { "status": "ok", ... }
jsonpath "$.status" == "ok"
# We expect to get back a JSON response with { ..., "Brendan Chang": "..." }
jsonpath "$.author" isString
# We expect to get back a JSON response with { ..., "https://github.com/Polymonomial/fragments.git"": "..." }
jsonpath "$.githuburl" matches /^https:\/\/github.com\/.+/
# We expect to get back a JSON response with { ..., "version": "0.7.2" }
jsonpath "$.version" matches /^\d+\.\d+\.\d+$/


