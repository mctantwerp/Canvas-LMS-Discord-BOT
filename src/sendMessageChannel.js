const announcementHandler = require("./announcementHandler.js");
const helperFunctions = require("./helperFunctions.js");
const assignmentHandler = require("./assignmentsHandler.js");
const { ChannelType, EmbedBuilder } = require("discord.js");

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
    const embed = new EmbedBuilder()
      .setColor('e63f3b')
      .setTitle(`📢 -- ${announcement.title} `)
      .setDescription(`${announcementHTMLtoText}`)
      .addFields(
        { name: "Course Name", value: course_name, inline: true },
        { name: "Posted by", value: announcement.user_name, inline: true },
        { name: 'Link', value: announcement.html_url }
      )
      .setFooter({ text: 'The unofficial Canvas Bot!', iconURL: 'https://i.imgur.com/645X62y.png' }); // Correct usage

    await channel.send({ embeds: [embed] });
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
    console.log(Intl.DateTimeFormat('en-US').format(new Date(assignment.due_at)));
    const embed = new EmbedBuilder()
      .setColor('e63f3b')
      .setTitle(`📝 -- ${assignment.name}`)
      .setDescription(`${assignmentHTMLtoText ? assignmentHTMLtoText : "No description available for this assignment."}`)
      .addFields(
        { name: "Course Name", value: course_name, inline: true },
        { name: 'Due Date (US)', value: assignment.due_at ? Intl.DateTimeFormat('en-US').format(new Date(assignment.due_at)) : "No deadline given", inline: true },
        { name: 'Points Possible', value: assignment.points_possible !== undefined ? assignment.points_possible.toString() : "No points possible", inline: true },
        { name: 'Link', value: assignment.html_url, }
      )
      .setFooter({ text: 'The unofficial Canvas Bot!', iconURL: 'https://i.imgur.com/645X62y.png' });
    //send to channel
    channel.send({ embeds: [embed] });

  }
}

module.exports = {
  sendMessageToChannel,
  postAnnouncementsAndSave,
  postAssignmentAndSave
};
