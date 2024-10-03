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

async function saveCoursesWithNameAndDiscord(course_id, course_name, course_discordid, db) {
  try {
    const [courses] = await db.query('INSERT INTO courses (course_id, name, channeldiscord_id, api_url) VALUES (?, ?, ?, ?)', [
      course_id,
      course_name,
      course_discordid,
      `courses/${course_id}`
    ]);
    return courses;
  } catch (error) {
    console.log(error);
  }
}


module.exports = {
  saveCoursesToDB,
  getAllCourses,
  getCourseIds,
  saveCoursesWithNameAndDiscord
};
