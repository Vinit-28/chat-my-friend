const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server)
const utilities = require('./utils/utility');

app.use(express.static('Client'));
let users = [];


io.on('connection', (socket)=>{

    // When a new user Joins the chat //
    socket.on('user-joined', (username, userface)=>{
        socket.emit('chat-message', utilities.getMessageObject('ChatBot', '', `Hey ${userface}&nbsp;${username}, Welcome To ChatBot!!!`, 'user-joined-message'), users);
        users.push(utilities.getUserObject(username, userface, socket.id));
        socket.broadcast.emit('chat-message', utilities.getMessageObject('ChatBot', '', `${userface}&nbsp;${username}, has Joined the Chat.`, 'user-joined-message'), users);
    });
    
    // When a User sends a message //
    socket.on('chat-message', (message, username, userface)=>{
        let messageObject = utilities.getMessageObject(username, userface, message, 'chat-message');
        socket.broadcast.emit('chat-message', messageObject, users);
        messageObject.username = 'You';
        socket.emit('chat-message', messageObject, users);
    });

    // When Someone Starts Typing //
    socket.on('typing', ()=>{
        const typingUser = users.find(user=>user.userid == socket.id);
        users = utilities.updatetypingStatus(users, typingUser, true);
        socket.broadcast.emit('typing-status-change', users)
    });

    // When Someone Stops Typing //
    socket.on('not-typing', ()=>{
        const nontypingUser = users.find(user=>user.userid == socket.id);
        users = utilities.updatetypingStatus(users, nontypingUser, false);
        socket.broadcast.emit('typing-status-change', users);
    });

    // When a User Disconnects //
    socket.on('disconnect', ()=>{
        const userLeft = users.find(user=>user.userid == socket.id);
        users = utilities.deleteUser(users, userLeft);
        socket.broadcast.emit('chat-message', utilities.getMessageObject('ChatBot', '', `${userLeft.userface}&nbsp;${userLeft.username}, has left the ChatRoom.`, 'user-disconnect-message'), users);
    });

})

server.listen(8000, ()=>{console.log("http://localhost:8000");});