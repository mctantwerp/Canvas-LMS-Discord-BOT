const bot = require("./initBot.js");
const client = bot.initBot();
const API = require("./APICalls.js");
const sendMessage = require("./sendMessageChannel.js");

//we use env file for secret tokens
require("dotenv").config();



const helperFunctions = require("./helperFunctions.js");
const announcementHandler = require("./announcementHandler.js");
const requestOptions = require("./requestOptions.js");
const pusherFunctions = require("./pusherFunctions.js");


//Api urls
const apiUrl = "https://canvas.kdg.be/api/v1/announcements?context_codes[]=course_49719";
const apiUrl2 = "https://canvas.kdg.be/api/v1/announcements?context_codes[]=course_9656&per_page=1";
const apiUrl3 = "https://canvas.kdg.be/api/v1/announcements?context_codes[]=course_49715";

//when the bot is ready, execute the following code
client.on("ready", async () => {
  console.log(`Bot is online.`);

  //make connection to database
  const db = await require("./initDB.js").createDbConnection();

  const apiData = await API.regularCanvasAPICall(apiUrl, requestOptions.basic, process.env.CANVAS_API);
  await console.log(helperFunctions.announcementHTMLtoText(apiData, client));

  //calls the sendDataToPi function with data gathererd from api
  await pusherFunctions.sendDataToPi(apiData[0].message);

//   //poll for announcements
//   async function pollAnnouncements() {

//     //bool to check if still polling
//     var isPolling = false;

//     const pollData = async function () {

//       //if still polling, return nothing
//       if (isPolling) {
//         console.log("Still polling..");
//         return
//       };


//       //get announcements from specific course
//       var announcements = await API.regularCanvasAPICall(apiUrl2, requestOptions.basic, client);

//       //get the posted announcements from the database
//       var postedIds = await announcementHandler.getPostedAnnouncements(db);

//       //filter for new announcements, comparing it with db stored announcements
//       var newAnnouncements = announcements.filter(ann => !postedIds.includes(ann.id));

//       //if new announcements are found, post them in channel and save to db
//       if (newAnnouncements.length) {
//         await sendMessage.postAnnouncementsAndSave(client, newAnnouncements, "1285960043761766512", db);
//       }
//       else{
//         console.log("No new announcements found.");
//       }
//       //reset polling bool because function is done
//       isPolling = false;
//     }
//     setInterval(pollData, 5000);
//   }
//   pollAnnouncements();

// });
});





//when the bot receives a message, it will respond with "pong"
client.on("messageCreate", (message) => {
  //console.log(message.content);
  if (message.content === "ping") {
    message.reply("pong");
  } else if (message.content === "salam") {
    message.reply("aleikum ");
  } else if (message.content === "marco") {
    message.reply("polo");
  } else if (message.content === "lepel") {
    message.reply("tepel");
  }
});


module.exports = {
  client,
}
