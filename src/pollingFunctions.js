const courseHandler = require("./courseHandler.js");
const API = require("./APICalls.js");
const announcementHandler = require("./announcementHandler.js");
const sendMessage = require("./sendMessageChannel.js");

async function pollAnnouncements(db, apiUrl, requestOptions, client) {
  //bool to check if still polling
  var isPolling = false;

  const pollData = async function () {
    //if still polling, return nothing
    if (isPolling) {
      console.log("Still polling..");
      return;
    }

    //get currently enlisted courses from db
    const courses = await courseHandler.getAllCourses(db);
    //get announcements from specific course
    var announcements = await API.regularCanvasAPICall(apiUrl, requestOptions, client);

    //get the posted announcements from the database
    var postedIds = await announcementHandler.getPostedAnnouncements(db);

    //filter for new announcements, comparing it with db stored announcements
    var newAnnouncements = announcements.filter((ann) => !postedIds.includes(ann.id));

    //if new announcements are found, post them in channel and save to db
    if (newAnnouncements.length) {
      await sendMessage.postAnnouncementsAndSave(
        client,
        newAnnouncements,
        "1285960043761766512",
        db
      );
    } else {
      console.log("No new announcements found.");
    }
    //reset polling bool because function is done
    isPolling = false;
  };
  setInterval(pollData, 3000);
}
module.exports = {
  pollAnnouncements,
};
