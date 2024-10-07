const { EmbedBuilder } = require("discord.js");


function createAssignmentReminderEmbed(assignment, course_name, assignmentHTMLtoText, days = 7) {
    return new EmbedBuilder()
        .setColor('e63f3b')
        .setTitle(`📝 ${days} DAY REMINDER -- ${assignment.name}`)
        .setDescription(`${assignmentHTMLtoText ? assignmentHTMLtoText : "No description available for this assignment."}`)
        .addFields(
            { name: "Course Name", value: course_name, inline: true },
            { name: 'Due Date (US)', value: assignment.due_at ? Intl.DateTimeFormat('en-US').format(new Date(assignment.due_at)) : "No deadline given", inline: true },
            { name: 'Points Possible', value: assignment.points_possible !== undefined ? assignment.points_possible.toString() : "No points possible", inline: true },
            { name: 'Link', value: assignment.html_url }
        )
        .setFooter({ text: 'The unofficial Canvas Bot!', iconURL: 'https://i.imgur.com/645X62y.png' });
}

function createAssignmentEmbed(assignment, course_name, assignmentHTMLtoText) {
    if (!assignment || assignment.length === 0) {
        return new EmbedBuilder()
            .setColor('e63f3b')
            .setTitle(`📝 -- No upcoming assignments found! `)
            .setDescription(`There have been no upcoming assignments found. Please keep in kind that the bot only filters on upcoming assignments, these are in a range of maximum 7 days.`)
            .addFields(
                { name: "Course Name", value: course_name, inline: true },
            )
            .setFooter({ text: 'The unofficial Canvas Bot!', iconURL: 'https://i.imgur.com/645X62y.png' }); // Correct usage
    }
    return new EmbedBuilder()
        .setColor('e63f3b')
        .setTitle(`📝 -- ${assignment.name}`)
        .setDescription(`${assignmentHTMLtoText ? assignmentHTMLtoText : "No description available for this assignment."}`)
        .addFields(
            { name: "Course Name", value: course_name, inline: true },
            { name: 'Due Date (US)', value: assignment.due_at ? Intl.DateTimeFormat('en-US').format(new Date(assignment.due_at)) : "No deadline given", inline: true },
            { name: 'Points Possible', value: assignment.points_possible !== undefined ? assignment.points_possible.toString() : "No points possible", inline: true },
            { name: 'Link', value: assignment.html_url, }
        )
        .setFooter({ text: 'The unofficial Canvas Bot!', iconURL: 'https://i.imgur.com/645X62y.png' });

}
function createAnnouncementEmbed(announcement, course_name, announcementHTMLtoText) {
    if (!announcement || announcement.length === 0) {
        return new EmbedBuilder()
            .setColor('e63f3b')
            .setTitle(`📢 -- No new announcements found! `)
            .setDescription(`Sadly, there have been no announcements found for this course.`)
            .addFields(
                { name: "Course Name", value: course_name, inline: true },
            )
            .setFooter({ text: 'The unofficial Canvas Bot!', iconURL: 'https://i.imgur.com/645X62y.png' }); // Correct usage
    }
    return new EmbedBuilder()
        .setColor('e63f3b')
        .setTitle(`📢 -- ${announcement.title} `)
        .setDescription(`${announcementHTMLtoText}`)
        .addFields(
            { name: "Course Name", value: course_name, inline: true },
            { name: "Posted by", value: announcement.user_name, inline: true },
            { name: 'Link', value: announcement.html_url }
        )
        .setFooter({ text: 'The unofficial Canvas Bot!', iconURL: 'https://i.imgur.com/645X62y.png' }); // Correct usage
}

function createAllCoursesCommandEmbed(courses) {
    return new EmbedBuilder()
        .setColor('e63f3b')
        .setTitle(`👨‍🏫 -- All the courses! `)
        .addFields(
            { name: "Courses: ", value: courses.map(course => course.name).join('\n'), inline: true },
        )
        .setFooter({ text: 'The unofficial Canvas Bot!', iconURL: 'https://i.imgur.com/645X62y.png' }); // Correct usage
}


module.exports = {
    createAssignmentReminderEmbed,
    createAssignmentEmbed,
    createAnnouncementEmbed,
    createAllCoursesCommandEmbed
}