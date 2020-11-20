const generateMessage = (text,username) => {
    return {
        text,
        username,
        createdAt: transformTime()
    }
}

const transformTime = () => {

    timestamp = new Date()

    datevalues = {
        date: `${timestamp.getDate()}. ${timestamp.getMonth()+1}. ${timestamp.getFullYear()}`,
        time: `${timestamp.getHours()}:${timestamp.getMinutes()}:${timestamp.getSeconds()}`,
        chatTime: `${timestamp.getHours() < 10 ? '0' + timestamp.getHours() : timestamp.getHours()}:${timestamp.getMinutes() < 10 ? '0' + timestamp.getMinutes() : timestamp.getMinutes()}`,
    }

    return datevalues
}

module.exports = {
    generateMessage
}