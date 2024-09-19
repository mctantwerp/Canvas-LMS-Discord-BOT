
//handling the data
function announcementHTMLtoText(data, client){
    if(data.length === 0){
        return;
    }

    if(data[0].message === null){
        return;
    }
    var endMessage = "";
    var startMessage = data[0].message;
    
    while(startMessage.indexOf("<p>") !== -1){
        startMessage = startMessage.replace("&nbsp;", "");
        let startNum = startMessage.indexOf("<p>");
        let endNum = startMessage.indexOf("</p>");
        endMessage += startMessage.substring(startNum + 3, endNum) + "\n";
        startMessage = startMessage.replace(startMessage.substring(startNum, endNum + 2), endNum);
        console.log(endMessage);
    }

    client.on("messageCreate", (message) => {
        if(message.content === "!announcement"){
            message.reply("```" + endMessage + "```");
        }
        
    })
}

function canvasAPICall(apiUrl, requestOptions, client){
    //fetching data from the api
    fetch(apiUrl, requestOptions)
        .then(response=> {
            if(!response.ok){
            throw new Error('Network response was not ok!');
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
        announcementHTMLtoText(data, client);
    })
    .catch(error =>{
        console.error('Error:', error);
    });
}



module.exports = {
    announcementHTMLtoText,
    canvasAPICall,
}