const helperFunctions = require("./helperFunctions.js");
const embedBuilder = require("./embedBuilder.js");

async function sendReminder(assignment, db, course_name, channel) {
    if (assignment === null) {
        return;
    }
    if (assignment === undefined) {
        return;
    }
    if (assignment.due_at === null) {
        return;
    }

    const date = assignment.due_at;
    const month = date.split(/[-T]/)[1];
    const year = date.split(/[-T]/)[0];

    const currentDate = new Date().toISOString();
    const currentDay = currentDate.split(/[-T]/)[2];
    const currentMonth = currentDate.split(/[-T]/)[1];
    const currentYear = currentDate.split(/[-T]/)[0];

    var assigmentDate = new Date(date);
    var dayBeforeAssingment = new Date();
    dayBeforeAssingment.setDate(assigmentDate.getDate() - 1);
    dayBeforeAssingment = dayBeforeAssingment.toISOString().split(/[-T]/)[2];

    var threeDaysBeforeAssingment = new Date();
    threeDaysBeforeAssingment.setDate(assigmentDate.getDate() - 3);
    threeDaysBeforeAssingment = threeDaysBeforeAssingment.toISOString().split(/[-T]/)[2];

    var weekBeforeAssignment = new Date();
    weekBeforeAssignment.setDate(assigmentDate.getDate() - 7);
    weekBeforeAssignment = weekBeforeAssignment.toISOString().split(/[-T]/)[2];



    if (year === currentYear && month === currentMonth && dayBeforeAssingment === currentDay) {

        //get reminder status from database
        const remindedBool = await checkReminder(db, 1, assignment.id)
        //if reminder has been sent, skip
        if (remindedBool === 1) {
            console.log(`Reminder already sent for ${assignment.id}`);
            return;
        }
        //update reminder value in database to not send again
        await updateReminder(db, 1, assignment.id);
        //send reminder in discord
        const assignmentHTMLtoText = helperFunctions.announcementHTMLtoTextONLY(assignment.description);
        const embed = embedBuilder.createAssignmentReminderEmbed(assignment, course_name, assignmentHTMLtoText, 1);
        // Send to channel
        channel.send({ embeds: [embed] });

    }
    else if (year === currentYear && month === currentMonth && threeDaysBeforeAssingment === currentDay) {

        //get reminder status from database
        const remindedBool = await checkReminder(db, 3, assignment.id)
        //if reminder has been sent, skip
        if (remindedBool === 1) {
            return;
        }
        //update reminder value in database to not send again
        await updateReminder(db, 3, assignment.id);
        //send reminder in discord
        const assignmentHTMLtoText = await helperFunctions.announcementHTMLtoTextONLY(assignment.description);
        const embed = embedBuilder.createAssignmentReminderEmbed(assignment, course_name, assignmentHTMLtoText, 3);
        // Send to channel
        channel.send({ embeds: [embed] });
        console.log(`reminder posted for ${assignment.id}`);

    }
    else if (year === currentYear && month === currentMonth && weekBeforeAssignment === currentDay) {

        //get reminder status from database
        const remindedBool = await checkReminder(db, 3, assignment.id)
        //if reminder has been sent, skip
        if (remindedBool === 1) {
            return;
        }
        //update reminder value in database to not send again
        await updateReminder(db, 7, assignment.id);
        //send reminder in discord
        const assignmentHTMLtoText = await helperFunctions.announcementHTMLtoTextONLY(assignment.description);
        const embed = embedBuilder.createAssignmentReminderEmbed(assignment, course_name, assignmentHTMLtoText, 7);
        // Send to channel
        channel.send({ embeds: [embed] });
        console.log(`reminder posted for ${assignment.id}`);

    }

    async function updateReminder(db, amount, assignment_id) {
        try {
            await db.query(`UPDATE assignments SET is_reminded_${amount}days = 1 WHERE assignment_id = ?`, [assignment_id]);
        } catch (error) {
            console.log(error);
        }
    }

    async function checkReminder(db, amount, assignment_id) {
        try {
            const [rows] = await db.query(`SELECT is_reminded_${amount}days FROM assignments WHERE assignment_id = ?`, [assignment_id]);
            return rows[0][`is_reminded_${amount}days`];

        } catch (error) {
            console.log(error);
        }
    }
}


module.exports = {
    sendReminder,
}