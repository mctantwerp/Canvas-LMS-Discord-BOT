const mysql = require('mysql2');

//handling the data
function announcementHTMLtoText(data, client) {
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


module.exports = {
    announcementHTMLtoText,
}