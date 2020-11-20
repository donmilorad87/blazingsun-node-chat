const users = []
let count = 1

const addUser = ({ id, username, room}) => {
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()
 
    const existingUser = users.find((user) => {
        if(user.room === room && user.username === username){
            username = user.username + ' | (' + count + ')'
            count++
        }
        
    })

    const user = { id, username, room}
    users.push(user)
    users.sort((a, b) => (a.username > b.username) ? 1 : -1)
    return {user}
}

const removeUser = (id) => {
    const index = users.findIndex((user) => {
        return user.id === id
    })

    if(index !== -1){
        return users.splice(index, 1)[0]
    }
}

const getUser = (id) => {
    return users.find((user) => {
        return user.id === id
    })
}

const getUsersInRoom = (room) => {
    return users.filter((user) => {
        return user.room === room
    })
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}