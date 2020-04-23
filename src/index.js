const path = require('path')
const express = require('express')
const http = require('http')
const socketio = require('socket.io')
const { generateMessage , generateLocateMessage} = require('./utils/message')
const {  addUser, getUser, removeUser, getUsersInRoom } = require('./utils/users')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const PORT =  process.env.PORT || 3000
const publicDirectory = path.join(__dirname , '../public')
app.use(express.static(publicDirectory))

io.on('connection' , (socket)=>{
    console.log('new Websocket is Connected')

    socket.on('join' ,(options,callback)=>{
        const id = socket.id
        const allUser = getUsersInRoom(options.room)

        if(!allUser[0]){
            options.username = `${options.username}(Host)`
        }
         
        const { error, user } = addUser({id,...options})

        if(error){
            return callback(error)
        }
        socket.join(user.room)
        socket.emit('sendMess' , generateMessage('Wellcome!'))
        io.to(user.room).emit('roomdata',{
            room:user.room,
            allUser:getUsersInRoom(user.room)
        })   
        socket.broadcast.to(user.room).emit('sendMess',generateMessage(`${user.username} join the room `))
    })

    socket.on('sendMess' , (input,cb)=>{
        //Updating
        const user = getUser(socket.id)

        io.to(user.room).emit('sendMess',generateMessage(input,user.username))

        cb('message is sended!')
    })

    socket.on('disconnect',()=>{
        const user =  removeUser(socket.id)
        if(user){
            io.to(user.room).emit('sendMess' ,generateMessage(`${user.username} has left the room `))
            io.to(user.room).emit('roomdata',{
                room:user.room,
                allUser:getUsersInRoom(user.room)
            })
        }
    })
    //messenge
    socket.on('location',(location,callback)=>{
        const user = getUser(socket.id)
        const urlLocate = `https://google.com/maps?q=${location.longitude},${location.latitude}`
        io.emit('sendLocate', generateLocateMessage(urlLocate,user.username))
        callback(urlLocate)
    })
})

server.listen(PORT, ()=>{
    console.log(`chat-app is running in ${PORT}`)
})