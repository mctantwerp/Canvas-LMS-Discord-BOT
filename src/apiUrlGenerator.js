
const API = require('./APICalls.js');

async function generateCourseUrls(client, requestOptions) {
    //get urls
    const allCoursesURL = process.env.CANVAS_COURSES_URL;
    const baseURL = process.env.CANVAS_BASE_URL;

    //make array to put all courses in
    let coursesURLs = [];

    //get all courses
    var courses = await API.regularCanvasAPICall(allCoursesURL, requestOptions, client);
    console.log(courses);

    //foreach loop to loop through all courses and save their ids
    courses.forEach((course, index) => {
        coursesURLs[index] = "courses/" + course.id + "/announcements";
    });
    console.log(coursesURLs);
}

module.exports = {

    generateCourseUrls
};