
const io = require('socket.io')(8000);

io.on('connection', (socket)=>{


    socket.on('new-user-connected', (name, face)=>{

        console.log('New Connection ' + name);
    })


})