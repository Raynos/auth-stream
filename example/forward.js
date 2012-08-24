var Auth = require("../index")
    , net = require("net")
    , through = require("through")

// forward
var server = net.createServer(function (stream) {
    var secret = through(function (data) {
            console.log("[SERVER]", data.toString())
            this.emit("data", "secret")
        })
        // Auth(secret, login)
        , auth = Auth(secret, function (user, pass) {
            if (user === "steve" && pass === "jones") {
                return true
            }

            return "ACCESS DENIED"
        })

    stream.pipe(auth).pipe(stream)
}).listen(process.argv[2] || 8080, function () {
    var stream = Auth("steve", "jones", net.connect(process.argv[2] || 8080))

    stream.on("data", function (data) {
        console.log("[CLIENT]", data.toString())
        stream.end()
        server.close()
    })

    stream.write("anything")
})