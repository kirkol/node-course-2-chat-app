const path = require('path')
const http = require('http')
const express = require('express')
const socketIO = require('socket.io')

const {generateMessage} = require('./utils/message')

const publicPath = path.join(__dirname, '../public')
const port = process.env.PORT || 3000
const app = express()
const server = http.createServer(app)
let io = socketIO(server)

app.use(express.static(publicPath))

io.on('connection', (socket) => {
  console.log('New user connected')

  socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'))
  socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined'))

  //listener na nadchodzace wiadomosci od klienta
  //razem z wiadomoscia przekazywana jest tez funkcja (callback),
  //ktora ma sie wywolac, gdy wszystko bedzie OK i wiadomosc zostanie przyjeta na serwer
  socket.on('createMessage', (message, callback) => {
    
    console.log('createMessage', message)
    
    io.emit('newMessage', generateMessage(message.from, message.text))
    //wywolanie callbacka ZE STRONY SERWERA - dzieki czemu klient dostanie potwierdzenie, ze wsio OK
    callback('This is ACK from the server! :)')
  })

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