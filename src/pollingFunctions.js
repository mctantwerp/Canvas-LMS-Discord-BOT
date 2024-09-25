const courseHandler = require("./courseHandler.js");
const API = require("./APICalls.js");
const announcementHandler = require("./announcementHandler.js");
const sendMessage = require("./sendMessageChannel.js");
require("dotenv").config();

async function pollAnnouncements(db, apiUrl, requestOptions, client) {
  // Bool to check if still polling
  let isPolling = false;

  const pollData = async function () {
    // If still polling, return nothing
    if (isPolling) {
      console.log("Still polling..");
      return;
    }

    // Set polling to true
    isPolling = true;

    try {
      // Get currently enlisted courses from DB
      const courses = await courseHandler.getAllCourses(db);
      console.log(courses);

      // Loop through each course and fetch announcements
      for (const course of courses) {
        const courseApiUrl = `${process.env.CANVAS_BASE_URL}/courses/${course.course_id}/announcements`; // Adjust as needed
        const announcements = await API.regularCanvasAPICall(courseApiUrl, requestOptions, client);
        
        // Get the posted announcement IDs from the database
        const postedIds = await announcementHandler.getPostedAnnouncements(db, course.id);

        // Filter for new announcements, comparing them with DB stored announcements
        const newAnnouncements = announcements.filter((ann) => !postedIds.includes(ann.id));

        // If new announcements are found, post them in channel and save to DB
        if (newAnnouncements.length) {
          // await sendMessage.postAnnouncementsAndSave(
          //   client,
          //   newAnnouncements,
          //   "1285960043761766512", // Replace with your channel ID
          //   db
          // );
          console.log("New announcements found for course", course.id);
        } else {
          console.log(`No new announcements found for course ${course.id}.`);
        }
      }
    } catch (error) {
      console.error("Error polling announcements:", error);
    } finally {
      // Reset polling bool because function is done
      isPolling = false;
    }
  };

  // Poll every minute (60000 ms)
  setInterval(pollData, 20000);
}
module.exports = {
  pollAnnouncements,
};
