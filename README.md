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

var stream = Auth("steve", "jones", net.connect(8080))

stream.on("data", function (data) {
    console.log("[CLIENT]", data)
})

stream.write("anything")
```

## Installation

`npm install auth-strream`

## Contributors

 - Raynos

## MIT Licenced