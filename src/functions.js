
//handling the data
function handleData(data, client){
    if(data.length === 0){
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
    }

    client.on("messageCreate", (message) => {
        if(message.content === "!announcement"){
            message.reply("```" + endMessage + " ```");
        }
        
    })
}

function apiCall(apiUrl, requestOptions, client){
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
        handleData(data, client);
    })
    .catch(error =>{
        console.error('Error:', error);
    });
}



module.exports = {
    handleData,
    apiCall,
}