
//handling the data
function handleData(data){
    let startNum = data[0].message.indexOf("<p>");
    let endNum = data[0].message.indexOf("</p>");
    console.log(startNum);
    console.log(endNum);
    let announcementMessage = data[0].message.substring(startNum + 3, endNum);
    console.log(announcementMessage);
    client.on("messageCreate", (message) => {
        if(message.content === "firstname"){
            message.reply("```html " + announcementMessage + " ```");
        }
        
    })
}