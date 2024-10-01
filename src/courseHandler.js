async function saveCoursesToDB(courses, db, courseURL) {
  try {
    await db.query("INSERT INTO courses (course_id, api_url) VALUES (?, ?)", [
      courses.id,
      courseURL,
    ]);
  } catch (error) {
    //console.log("Error saving courses to database. If courses are already in DB, ignore error.");
  }
}

async function getAllCourses(db) {
  try {
    const [courses] = await db.query("SELECT * FROM courses");
    return courses;
  } catch (error) {
    console.log("Error fetching the courses from database");
  }
}

module.exports = {
  saveCoursesToDB,
  getAllCourses,
};
