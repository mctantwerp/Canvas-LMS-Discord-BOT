const apiKey = process.env.CANVAS_API;
const samApiKey = process.env.SAM_API_KEY;


const basic = {
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${apiKey}`
    }
};

const getLatestAnnouncementCall = {
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${apiKey}`
    },
    params: {
        only_announcements: true,
        per_page: 1, // fetch only the latest announcement
    }
};

const getEnrolledCourses = {
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${apiKey}`
    },
    params: {
        enrollment_state: 'active',
    }
};
const getUpcomingAssignments = {
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${apiKey}`
    },
    params: {
        bucket: 'upcoming',
    }
};

module.exports = {
    basic, getLatestAnnouncementCall, getEnrolledCourses, getUpcomingAssignments
}