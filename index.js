var duplex = require("duplex")
    , BufferStream = require("buffer-stream")
    , env = process.env

module.exports = Auth

function Auth(first, second, third) {
    if (typeof first === "string") {
        return AuthClient(first, second, third)
    }

    return AuthServer(first, second)
}

function AuthClient(user, pass, stream) {
    var auth = BufferStream().buffer()
    stream.write(user + ":" + pass)

    stream.on("data", isOpen)

    return auth

    function isOpen(data) {
        var msg = data.toString()
        if (msg === "open") {
            return auth.empty(stream)
        }

        var parts = msg.split(":")

        if (parts[0] === "error") {
            auth.emit("error", new Error(parts[1]))
        }
    }
}

function AuthServer(stream, authorize) {
    var auth = duplex()
        , open = false

    authorize = authorize || defaultAuthorize

    auth.on("write", onWrite)

    return auth

    function onWrite(data) {
        if (open) {
            return stream.write(data)
        }

        var parts = data.toString().split(":")
            , user = parts[0]
            , pass = parts[1]

        var success = authorize(user, pass)

        if (success === true) {
            open = true

            auth.sendData("open")
            stream.on("data", forward)
        } else {
            auth.sendData("error:" + success)
        }
    }

    function forward(data) {
        auth.sendData(data)
    }
}

function defaultAuthorize(user, pass) {
    return user === env.AUTH_STREAM_USER && pass === env.AUTH_STREAM_PASS
}