const API = require("./APICalls.js");
const sendMessage = require("./sendMessageChannel.js");

async function postAnnouncementsFromDatabaseToDiscord(db, client, requestOptions) {
  //get database items, return array
  const [results] = await db.query("SELECT * FROM courses");
  //loop through array, get api url and channel id for each row
  results.forEach(async courses => {
    var apiUrl = courses.api_url;
    var discordChannel = courses.channeldiscord_id;
    //wait for api call to be resolved...
    var apiCall = await API.canvasAPICall(apiUrl, requestOptions, client)
    //send message to specific channel
    sendMessage.sendMessageToChannel(client, apiCall, discordChannel.toString());
  });
}

module.exports = {
  postAnnouncementsFromDatabaseToDiscord,
};
