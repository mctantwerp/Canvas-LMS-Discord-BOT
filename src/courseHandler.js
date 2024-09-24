async function saveCoursesToDB(courses, db, courseURL) {
  try {
    await db.query("INSERT INTO courses (course_id, api_url) VALUES (?, ?)", [
      courses.id,
      courseURL,
    ]);
  } catch (error) {
    console.log("Error saving courses to database");
  }
}

async function getAllCourses(db) {
  try {
    const [courses] = await db.query("SELECT * FROM courses");
    return courses;
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  saveCoursesToDB,
  getAllCourses,
};
