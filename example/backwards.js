var Auth = require("../index")
    , net = require("net")
    , through = require("through")

// backwards
var server = net.createServer(function (stream) {
    stream = Auth("steve", "jones", stream)

    stream.on("data", function (data) {
        console.log("[SERVER]", data.toString())
        stream.end()
        server.close()
    })

    stream.write("anything")
}).listen(process.argv[2] || 8080, function () {
    var stream = net.connect(process.argv[2] || 8080)

    var secret = through(function (data) {
            console.log("[CLIENT]", data.toString())
            this.emit("data", "secret")
        })
        , auth = Auth(secret, function (user, pass) {
            if (user === "steve" && pass === "jones") {
                return true
            }

            return "ACCESS DENIED"
        })

    stream.pipe(auth).pipe(stream)
})