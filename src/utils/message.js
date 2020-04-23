const generateMessage = (text,username = 'BOT') =>{
    return {
        username, 
        text, 
        createAt: new Date().getTime()
    }
}
const generateLocateMessage = (url,username = 'BOT')=>{
    return {
        username, 
        url, 
        createAt: new Date().getTime()
    }
}
module.exports = {
    generateMessage,
    generateLocateMessage
}