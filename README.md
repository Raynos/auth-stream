# auth-strream

Authorize access before exposing a stream

## Example Server

``` js
var Auth = require("auth-stream")
    , net = require("net")
    , through = require("through")

net.createServer(function (stream) {
    var secret = through(function (data) {
            console.log("[SERVER]", data)
            this.emit("data", "secret")
        })
        , auth = Auth(secret, function (user, pass) {
            if (user === "steve" && pass === "jones") {
                return true
            }
        })

    stream.pipe(auth).pipe(stream)
}).listen(8080)
```

## Example Client

``` js
var Auth = require("auth-stream")
    , net = require("net")

var stream = net.connect(8080)
    , auth = Auth()

stream.pipe(auth).pipe(stream)

stream.on("data", function (data) {
    console.log("[CLIENT]", data)
})

stream.write("anything")

// login(user, pass)
auth.login("steve", "jones")
```

## Installation

`npm install auth-strream`

## Contributors

 - Raynos

## MIT Licenced