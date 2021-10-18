const moment = require('moment');

function getMessageObject(username, userface, message, objective){

    return {
        'username' : username,
        'userface' : userface,
        'message' : message,
        'time' : moment().format('hh:mm a'),
        'objective' : objective
    };
}


function getUserObject(username, userface, userid){
    return{
        'username' : username,
        'userface' : userface,
        'userid' : userid,
        'typing-status' : false
    };
}


function deleteUser(userList, user){

    const index = userList.findIndex(temp=>temp.userid == user.userid);
    userList.splice(index, 1);
    return userList;    
}


function updatetypingStatus(userList, user, status){

    const index = userList.findIndex(temp=>temp.userid == user.userid);
    userList[index]['typing-status'] = status; 
    return userList;
}


module.exports = {getMessageObject, getUserObject, deleteUser, updatetypingStatus};