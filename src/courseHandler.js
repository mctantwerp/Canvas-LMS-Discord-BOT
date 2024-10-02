async function saveCoursesToDB(courses, db, courseURL) {
  try {
    await db.query("INSERT INTO courses (course_id, api_url, name) VALUES (?, ?, ?)", [
      courses.id,
      courseURL,
      courses.name,
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

async function getCourseIds(db) {
  try {
    const [ids] = await db.query("SELECT course_id FROM courses");
    return ids;
  } catch (error) {
    console.log("Error fetching the courses from database");
  }
}


module.exports = {
  saveCoursesToDB,
  getAllCourses,
  getCourseIds,
};
