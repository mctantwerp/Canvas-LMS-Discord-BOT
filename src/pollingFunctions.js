const courseHandler = require("./courseHandler.js");
const assignmentsHandler = require("./assignmentsHandler.js");
const API = require("./APICalls.js");
const announcementHandler = require("./announcementHandler.js");
const sendMessage = require("./sendMessageChannel.js");
const reminderController = require("./reminder.js");
require("dotenv").config();

async function pollAnnouncements(db, requestOptions, client) {
  //bool to check if still polling
  let isPolling = false;

  //if still polling, return
  if (isPolling) {
    console.log("still polling announcements...");
    return;
  }

  //set polling to true
  isPolling = true;

  try {

    //get currently enlisted courses from db
    const courses = await courseHandler.getAllCourses(db);

    //loop through each course and fetch announcements
    for (const course of courses) {

      //create course api url
      const courseApiUrl = `${process.env.CANVAS_BASE_URL}/announcements?context_codes[]=course_${course.course_id}`;

      //use this api url for fetching announcements
      const announcements = await API.axiosCanvasAPICall(courseApiUrl, requestOptions, client);

      //get the posted announcement IDs from the database
      const postedIds = await announcementHandler.getPostedAnnouncements(db, course.id);

      //get the discord channel id from the database for the course
      const discordChannelId = await courseHandler.getCourseDiscordChannel(course.course_id, db);

      //filter for new announcements, comparing them with db stored announcements
      const newAnnouncements = announcements.filter((ann) => !postedIds.includes(ann.id));

      //if new announcements are found, post them in channel and save to db
      if (newAnnouncements.length) {
        await sendMessage.postAnnouncementsAndSave(client, newAnnouncements, discordChannelId, db, course.course_id);
        console.log("new announcements found for course", course.course_id);
      } else {
        console.log(`no new announcements found for course ${course.course_id}.`);
      }
    }
  } catch (error) {
    console.log("error polling announcements:", error);
  } finally {
    //reset polling bool because function is done
    isPolling = false;
  }
}

async function pollAssignments(db, requestOptions, client) {
  //bool to check if still polling
  let isPolling = false;

  //if still polling, return
  if (isPolling) {
    console.log("still polling assignments...");
    return;
  }

  //set polling to true
  isPolling = true;

  var currentDate = new Date();

  try {
    //get currently enlisted courses from the database
    const courses = await courseHandler.getAllCourses(db);

    //loop through each course and fetch assignments
    for (const course of courses) {
      //create assignment API URL
      const assignmentApiUrl = `${process.env.CANVAS_BASE_URL}/courses/${course.course_id}/assignments`;

      //fetch assignments using the API
      const assignments = await API.axiosCanvasAPICall(assignmentApiUrl, requestOptions, client);

      //filter for upcoming assignments only = assignments with due date after current date
      const upcomingAssignments = assignments.filter(assignment => {
        const dueDate = new Date(assignment.due_at);
        return dueDate > currentDate;
      })

      //get the posted assignment IDs from the database
      const postedIds = await assignmentsHandler.getPostedAssignments(db);

      //filter for new assignments by comparing them with db stored assignments
      const newAssignments = upcomingAssignments.filter((assignment) => !postedIds.includes(assignment.id));

      //get the discord channel id from the database for the course
      const discordChannelId = await courseHandler.getCourseDiscordChannel(course.course_id, db);

      //get channel based on discord id
      const channel = await client.channels.fetch(discordChannelId);

      //if new assignments are found, post them in the channel and save to the database
      if (newAssignments.length) {
        await sendMessage.postAssignmentAndSave(client, newAssignments, discordChannelId, db, course.course_id);
        console.log("new assignment found for course", course.course_id);
      } else {
        console.log(`no new assignments found for course ${course.course_id}.`);
      }

      //for each new assignment, send a reminder if needed
      for (const assignment of upcomingAssignments) {
        var course_name = await assignmentsHandler.fetchCourseNameById(course.course_id, db);
        await reminderController.sendReminder(assignment, db, course_name, channel);
      }
    }
  } catch (error) {
    console.log("error polling assignments:", error);
  } finally {
    //reset polling bool because function is done
    isPolling = false;
  }
}




module.exports = {
  pollAnnouncements,
  pollAssignments,
};
