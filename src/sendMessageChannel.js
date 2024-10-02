const announcementHandler = require("./announcementHandler.js");
const helperFunctions = require("./helperFunctions.js");
const assignmentHandler = require("./assignmentsHandler.js");

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
    const announcementHTMLtoText = helperFunctions.announcementHTMLtoTextString(
      announcement.message
    );
    //save in db
    await announcementHandler.saveAnnouncement(announcement, db, announcementHTMLtoText, course_id);
    //get course name
    var course_name = await announcementHandler.fetchCourseNameById(course_id, db);
    console.log(course_name);
    //send it to the channel and log in console
    await channel.send(`\`\`\`Title: ${announcement.title}\n\nDescription: ${announcementHTMLtoText}\n\nCourse: ${course_name}\n\nPosted by: ${announcement.author.display_name}\`\`\``);
  }
}
async function postAssignmentAndSave(client, assignments, channel_id, db, course_id) {

  //wait for promise to be resolved
  const channel = await client.channels.fetch(channel_id);

  for (const assignment of assignments) {
    //start conversion html to text
    const assignmentHTMLtoText = helperFunctions.announcementHTMLtoTextONLY(
      assignment.description
    );
    //save in db
    await assignmentHandler.saveAssignment(assignment, db, assignmentHTMLtoText, course_id);
    //get course name
    var course_name = await assignmentHandler.fetchCourseNameById(course_id, db);
    //send it to the channel and log in console
    await channel.send(`\`\`\`Title: ${assignment.name}\n\nDescription: ${assignmentHTMLtoText}\n\nCourse: ${course_name}\`\`\``);
  }
}

module.exports = {
  sendMessageToChannel,
  postAnnouncementsAndSave,
  postAssignmentAndSave
};
