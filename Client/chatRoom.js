const { username, userface } = Qs.parse(location.search, {ignoreQueryPrefix: true, });
const socket = io();
const mssgBox = document.getElementById('message-box');
const activeUsers = document.getElementById('activeUsers');
const sendButton = document.getElementById('send');
const input = document.getElementById('message');



// Utiliy Functions

function updateUserList(userList){

    let htmlcode = '<div class="text">Active Users</div><hr>';
    for( let user of userList ){
        if( socket.id != user.userid ){

            if( user['typing-status'] ){
                console.log(user.username);
                htmlcode += `<div class="usernames">${user.userface}&nbsp;${user.username}<div class="othertext">typing...</div></div>`;
            }
            else{
                htmlcode += `<div class="usernames">${user.userface}&nbsp;${user.username}</div>`;
            }
        }
    }
    activeUsers.innerHTML = htmlcode;
}


function outputMessage(messageObject, userList){

    if( messageObject.objective != 'chat-message' ){
        updateUserList(userList);
    }

    const mssg = document.createElement('div');
    mssg.classList.add('chat-message');
    if( messageObject.senderID == socket.id ){
        mssg.classList.add('message-right');
    }
    else{
        mssg.classList.add('message-left');
    }
    mssg.innerHTML = `<span class="username">${messageObject.userface}&nbsp;${messageObject.username}&nbsp;</span>
    <sup class="time">${messageObject.time}</sup>
    <p class="user-message"><br>${messageObject.message}</p>`;

    mssgBox.appendChild(mssg);
    mssgBox.scrollTop = mssgBox.scrollHeight;
}


function readAndSendMessage(){

    if( input.value != "" ){
        socket.emit('chat-message', input.value, username, userface);
        input.value = "";
        input.focus();
    }
    else{
        alert('Enter Some Message!!!');
    }
}


// Emiting Events //
socket.emit('user-joined', username, userface);


// Listening For Events //
socket.on('chat-message', outputMessage);
socket.on('typing-status-change', updateUserList);


// Adding Event Listeners //
sendButton.addEventListener('click', readAndSendMessage);
input.addEventListener('focusin', ()=>{socket.emit('typing');});
input.addEventListener('focusout', ()=>{socket.emit('not-typing');});
