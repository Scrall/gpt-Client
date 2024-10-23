const socket = io() 

let CounterResize = 0

function sendText() {
    if (event.keyCode == 13) {
        socket.emit("sendRes", document.getElementById("textRequest").value)
    }
}

function sendVoice() {
    let recognizer = new webkitSpeechRecognition()
    recognizer.interimResults = true
    recognizer.lang = 'ru-Ru'
    recognizer.onresult = function (event) {
        let result = event.results[event.resultIndex]
        if (result.isFinal) {
            socket.emit("sendRes", result[0].transcript)
        } else {
            document.getElementById("textRequest").value = result[0].transcript
        }
    }
    recognizer.start()
}

socket.on("restartPage", function() {
    location.reload()
})