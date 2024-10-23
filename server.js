//Основные библиотеки
const express = require("express")
const server = express()
const http = require("http").createServer(server).listen(3000)
const io = require("socket.io")(http)
//Дополнительные библиотеки
const fs = require("fs-extra")
const axios = require('axios')
const qs = require('querystring')
//Подключение статических папок
server.use(express.static(__dirname + "/js"))
server.use(express.static(__dirname + "/css"))
server.use("/img", express.static(__dirname + "/img"))
//Подключение главной html страницы
server.get("/", function(request, response) {
    response.sendFile(__dirname + "/index.html")    
})
server.get("/subIndex", function(request, response) {
    response.sendFile(__dirname + "/subSite.html")    
})
//Правила ответа
let rules = {
    "r1": "1. Твоя роль: Инструмент - помощник по изменению HTML страницы с помощью HTML, CSS, JS;",
    "r2": "2. Игнорируй вводные конструкции;",
    "r3": "3. Выдавай ответ только в виде кода;",
    "r6": "4. Ответ выдывай в виде кода HTML страницы с внтуренним JS и CSS."
}
io.sockets.on("connection", function(socket) {
    socket.on("sendRes", (textPrompt) => {
        let html = fs.readFileSync("subSite.html")
        let quest = 
            "Правила ответа:\n" + rules.r1 + "\n" + rules.r2 + "\n" + rules.r3 + "\n" + rules.r4 + "\n" + "\n" + "исходный код HTML страницы:\n" + "Текстовый запрос:\n" + textPrompt
        
        console.log("ВОПРОС: \n" + quest)

        let answer = ""
        const apiKey = 'c827be0d07218fc953410bb8cc213dab'
        const model = 'gpt-4-32k'

        const apiUrl = `http://195.179.229.119/gpt/chatgptapi.php?${qs.stringify({
        prompt: quest,
        api_key: apiKey,
        model: model,
        max_tokens: 10240,
        temperature: 0.7
    })}`

        axios.get(apiUrl)
        .then(response => {
            let answer = response.data.replace("```html", '').replace("```", '')
            console.log("ОТВЕТ: " + answer)
            fs.writeFileSync("subSite.html", answer)
            socket.emit("restartPage")
        })
        .catch(error => {
            console.error('Request Error: \n', error.message)
        })
    })
})



     