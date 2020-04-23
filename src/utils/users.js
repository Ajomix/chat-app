const  users = []

const addUser = ({id,username,room}) =>{
    
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()
    if(!username || !room){
        return {
            error:'username and room is required !'
        }
    }

    const userExisted = users.find((user) =>{
        return user.room === room && user.username === username 
    })
    if(userExisted) {
        return {
            error:'Username is existed ! '
        }
    }

    const user = {id,username,room}
    users.push(user)
    return {user}
}

const removeUser = (id)=>{
    
    const index = users.findIndex(user => user.id === id )
    
    if(index === -1) return {error:'Not have User with id to remove !'}
    
    return users.splice(index,1)[0]
}

const getUser = (id)=> users.find(user=>user.id === id)
 
const getUsersInRoom = (room)=>{

    room = room.trim().toLowerCase()

    if(!room) return {error:'room name is required !'}

    return users.filter(user => user.room === room )
}
module.exports = {
    addUser, 
    getUser, 
    removeUser, 
    getUsersInRoom
}