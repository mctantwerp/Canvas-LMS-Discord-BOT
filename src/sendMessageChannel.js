const announcementHandler = require("./announcementHandler.js");
const helperFunctions = require("./helperFunctions.js");
const assignmentHandler = require("./assignmentsHandler.js");
const embedBuilder = require("./embedBuilder.js");

async function sendMessageToChannel(client, message, channel_id) {
  if (message === undefined) {
    return;
  }
  if (message === null) {
    return;
  }
  if (message === "") {
    return;
  }
  //wait for promise to be resolved
  const channel = await client.channels.fetch(channel_id);
  channel.send(message);
}

async function postAnnouncementsAndSave(client, announcements, channel_id, db, course_id) {
  //wait for promise to be resolved
  const channel = await client.channels.fetch(channel_id);

  for (const announcement of announcements) {
    //start conversion html to text
    const announcementHTMLtoText = helperFunctions.announcementHTMLtoTextONLY(
      announcement.message
    );

    //save in db
    await announcementHandler.saveAnnouncement(announcement, db, announcementHTMLtoText, course_id);

    //get course name
    var course_name = await announcementHandler.fetchCourseNameById(course_id, db);

    //send it to the channel and log in console
    const embed = embedBuilder.createAnnouncementEmbed(announcement, course_name, announcementHTMLtoText);

    //send in channel
    await channel.send({ embeds: [embed] });
  }
}
async function postAssignmentAndSave(client, assignments, channel_id, db, course_id) {

  //wait for promise to be resolved
  const channel = await client.channels.fetch(channel_id);

  for (const assignment of assignments) {

    //start conversion html to text
    const assignmentHTMLtoText = await helperFunctions.announcementHTMLtoTextONLY(assignment.description);

    //save in db
    await assignmentHandler.saveAssignment(assignment, db, assignmentHTMLtoText, course_id);

    //get course name
    const course_name = await assignmentHandler.fetchCourseNameById(course_id, db);

    //embed builder
    const embed = embedBuilder.createAssignmentEmbed(assignment, course_name, assignmentHTMLtoText);

    //send to channel
    channel.send({ embeds: [embed] });
  }
}

module.exports = {
  sendMessageToChannel,
  postAnnouncementsAndSave,
  postAssignmentAndSave
};
