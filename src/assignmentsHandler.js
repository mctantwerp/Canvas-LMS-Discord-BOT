async function getAllAssignments(db) {
    try {
        const [courses] = await db.query("SELECT * FROM assignments");
        return courses;
    } catch (error) {
        console.log("Error fetching the courses from database");
    }
}



async function getPostedAssignments(db) {
    const [rows] = await db.query('SELECT assignment_id FROM assignments');
    // return an array of IDs
    return rows.map(row => row.assignment_id);
}



async function saveAssignment(assignment, db, announcementHTMLtoText, course_id) {
    await db.query('INSERT INTO assignments (assignment_id, name, description, due_at, course_id) VALUES (?, ?, ?, ?, ?)', [assignment.id, assignment.name, announcementHTMLtoText, assignment.due_at, course_id]);
}

async function fetchCourseNameById(courseId, db) {
    try {
        var [rows] = await db.query(`
        SELECT courses.name AS course_name 
        FROM assignments 
        INNER JOIN courses ON courses.course_id = assignments.course_id 
        WHERE assignments.course_id = ?
      `, [courseId]);
        // Check if any rows were returned
        if (rows.length === 0) {
            return null;
        }
        // Return the course name
        return rows[0].course_name;
    }
    catch (error) {
        console.log(error);
    }
}

module.exports = {

    getAllAssignments,
    getPostedAssignments,
    saveAssignment,
    fetchCourseNameById
};