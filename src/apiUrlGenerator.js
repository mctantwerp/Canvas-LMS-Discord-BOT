const API = require("./APICalls.js");
const courseHandler = require("./courseHandler.js");
const helperFunctions = require("./helperFunctions.js");

async function generateCourses(client, requestOptions, db) {
  //get urls
  const allCoursesURL = process.env.CANVAS_COURSES_URL;
  const baseURL = process.env.CANVAS_BASE_URL;

  //make array to put all courses in
  let coursesURLs = [];

  //get all courses
  var courses = await API.regularCanvasAPICall(allCoursesURL, requestOptions, client);

  //foreach loop to loop through all courses and save their ids
  courses.forEach((course, index) => {
    coursesURLs[index] = "courses/" + course.id;
    courseHandler.saveCoursesToDB(course, db, coursesURLs[index]);
  });
}

module.exports = {
  generateCourses,
};
