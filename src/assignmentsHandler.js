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

module.exports = {

    getAllAssignments,
    getPostedAssignments,
    saveAssignment
};