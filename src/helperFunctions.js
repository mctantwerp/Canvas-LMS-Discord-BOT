const mysql = require('mysql2');

//handling the data
function announcementHTMLtoText(data, client) {
        //function to convert html to string, but with an array as input
    if (data.length === 0) {
        return;
    }

    if (data[0].message === null) {
        return;
    }
    var endMessage = "";
    var startMessage = data[0].message;

    while (startMessage.indexOf("&nbsp;") !== -1) {
        startMessage = startMessage.replace("&nbsp;", "");
    }
    endMessage = startMessage.replace(/<(?:.|\n)*?>/gm, '');
    return "```" + endMessage + "```";
}
function announcementHTMLtoTextString(data) {
    //function to convert html to string
    var endMessage = "";
    var startMessage = data;
    while (startMessage.indexOf("&nbsp;") !== -1) {
        startMessage = startMessage.replace("&nbsp;", "");
    }
    endMessage = startMessage.replace(/<(?:.|\n)*?>/gm, '');
    return "```" + endMessage + "```";
}


module.exports = {
    announcementHTMLtoText,
    announcementHTMLtoTextString
}