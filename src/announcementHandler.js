const API = require("./APICalls.js");
const sendMessage = require("./sendMessageChannel.js");
const helperFunctions = require("./helperFunctions.js");

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



async function saveAnnouncement(announcement, db, announcementHTMLtoText, course_id) {
  await db.query('INSERT INTO announcements (canvas_id, title, description, posted_at, course_id) VALUES (?, ?, ?, ?, ?)', [announcement.id, announcement.title, announcementHTMLtoText, announcement.created_at, course_id]);
}


async function getPostedAnnouncements(db) {
  const [rows] = await db.query('SELECT canvas_id FROM announcements');
  // return an array of IDs
  return rows.map(row => row.canvas_id);
}

module.exports = {
  postAnnouncementsFromDatabaseToDiscord,
  saveAnnouncement,
  getPostedAnnouncements,
};
