const path = require('path')
const http = require('http')
const express = require('express')
const socketIO = require('socket.io')

//pobranie sciezki do folderu public
const publicPath = path.join(__dirname, '../public')
const port = process.env.PORT || 3000

const app = express()

//stworzenie serwera na podstawie expressa (tez serwera;)), ktory bedzie uzywal biblioteki http
const server = http.createServer(app)

//stworzenie serwera, ktory bedzie obslugiwal sockety
//bedzie nasluchiwal eventow ze strony usera
//lub sam je bedzie wywolywal
let io = socketIO(server)

//ustawienie middleware'a expressa
//express jako server udostepni katalog publiczny (ponizej ustawiamy jego sciezke)
app.use(express.static(publicPath))

//tworzymy listenera eventow. Mozemy nasluchiwac konkretnych eventow od strony klienta
//i ofc reagowac na te eventy
io.on('connection', (socket) => {
  console.log('New user connected')

  //listener nasluchujacy strony klienta - jesli polaczenie padnie od strony klienta,
  //to odpala sie kod listenera ;) 
  socket.on('disconnect', () => {
    console.log('User has been disconnected')
  })
})

server.listen(port, () => {
  console.log(`Started up at port ${port}`)
})

module.exports = {
  app
}