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

async function saveAssignmentsToDB(client, requestOptions, db) {

  //get all courses currently in db
  var courses = await courseHandler.getAllCourses(db);

  //loop through all courses
  for (var course of courses) {

    //make api call to get all UPCOMING (see request option, using "getUpcomingAssignments") assignments for each course
    var assignment = await API.regularCanvasAPICall(`${process.env.CANVAS_BASE_URL}/courses/${course.course_id}/assignments/`, requestOptions, client);

    //are there assignments? post to db
    if (assignment.length > 0) {

      //loop through all assignments of one course and save them to db
      for (var assign of assignment) {
        //try this...
        try {
          await db.query('INSERT INTO assignments (assignment_id, name, description, due_at, course_id) VALUES (?, ?, ?, ?, ?)', [assign.id, assign.name, helperFunctions.announcementHTMLtoTextString(assign.description), assign.due_at, course.course_id]);
        }
        //if not working, catch error
        catch (error) {
          console.log("Error saving assignment to DB. Duplicate entry?");
        }
      }

    }

  }





}

module.exports = {
  generateCourses,
  saveAssignmentsToDB,
};
