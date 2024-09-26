const announcementHandler = require("./announcementHandler.js");
const helperFunctions = require("./helperFunctions.js");

async function sendMessageToChannel(client, message, channel_id) {
  //wait for promise to be resolved
  const channel = await client.channels.fetch(channel_id);
  channel.send(message);
}

async function postAnnouncementsAndSave(client, announcements, channel_id, db, course_id) {
  //wait for promise to be resolved
  const channel = await client.channels.fetch(channel_id);
  for (const announcement of announcements) {
    //start conversion html to text
    const announcementHTMLtoText = helperFunctions.announcementHTMLtoTextString(
      announcement.message
    );
    //send it to the channel and log in console
    await channel.send(announcementHTMLtoText);
    //save it in DB
    await announcementHandler.saveAnnouncement(announcement, db, announcementHTMLtoText, course_id);
  }
}

module.exports = {
  sendMessageToChannel,
  postAnnouncementsAndSave,
};
