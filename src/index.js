const path = require('path')
const https = require('https')
const fs = require('fs')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')

const { generateMessage } = require('./utils/messages')
const { generateLocationImage } = require('./utils/location')
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users')

const app = express()

const server = https.createServer({
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.cert')
  }, app)
  
const io = socketio(server)


const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))



io.on('connection', (socket) => {

    console.log('New WebSocket connection.')

    socket.on('join', (options, callback) => {
        
        const { error, user } = addUser({id:socket.id, ...options})

        socket.join(user.room)

        socket.emit('message', generateMessage('Welcome!','Server') )

        socket.broadcast.to(user.room).emit('message', generateMessage(`<b style="text-transform: uppercase;">${user.username}</b> has joined!`,'Server'))
        
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })
    })

    socket.on('sendMessage',(message,callback) => {
        const user = getUser(socket.id)
        const filter = new Filter()
        

        if(filter.isProfane(message)){
            return callback('Profanity is not allowd')
        }
        io.to(user.room).emit('message', generateMessage(message, user.username))
        callback('Server says: delivered')
    })
    
    
    socket.on('sendLocation', (cords, callback) =>{
        const user = getUser(socket.id)
        io.to(user.room).emit('locationMesage', generateLocationImage(cords, user.username))
        return callback('Server says: location delivered')
    })

    socket.on('disconnect', () => {

        const user = removeUser(socket.id)

        if(user){
            io.to(user.room).emit('message', generateMessage(`Client ${user.username} has been disconected`,'Server'))
            io.to(user.room).emit('roomData',{
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }

        
    })
})

server.listen(port, () => {
    console.log(`Server is on port ${port}!`)
})
