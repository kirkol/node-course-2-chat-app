const path = require('path')
const http = require('http')
const express = require('express')
const socketIO = require('socket.io')

const publicPath = path.join(__dirname, '../public')
const port = process.env.PORT || 3000
const app = express()
const server = http.createServer(app)
let io = socketIO(server)

app.use(express.static(publicPath))

io.on('connection', (socket) => {
  console.log('New user connected')

  socket.emit('newMessage', {
    from: 'Admin',
    text: 'Welcome to the chat app',
    createdAt: new Date().getTime()
  })
  socket.broadcast.emit('newMessage', {
    from: 'Admin',
    text: 'New user joined',
    createdAt: new Date().getTime()
  })

  socket.on('createMessage', (message) => {
    console.log('createMessage', message)
    //za pomoca linii ponizej powodujemy, ze wiadomosci wyslane przez nas samych
    //trafia do wszystkich Z WYJATKIEM nas samych
    socket.broadcast.emit('newMessage', {
      from: message.from,
      text: message.text,
      createdAt: new Date().getTime()
    })
    
    //wyemitowanie eventu do wszystkich polaczen (np. wielu klientow jednoczesnie)
    //tu: jesli jeden klient wysle wiadomosc na serwer, to dzieki linii nizej dostana ja wszyscy
    // io.emit('newMessage', {
    //   from: message.from,
    //   text: message.text,
    //   createdAt: new Date().getTime()
    // })
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