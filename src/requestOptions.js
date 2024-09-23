const apiKey = process.env.CANVAS_API;
const samApiKey = process.env.SAM_API_KEY;


const basic = {
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${samApiKey}`
    }
};

const getLatestAnnouncementCall = {
    method: 'GET',
    headers: {  
        'Authorization': `Bearer ${samApiKey}`
    },
    params: {
        only_announcements: true,
        per_page: 1, // fetch only the latest announcement
    }
};

const getEnrolledCourses = {
    method: 'GET',
    headers: {  
        'Authorization': `Bearer ${samApiKey}`
    },
    params: {
        enrollment_state: 'active',
    }
};

module.exports = {
    basic, getLatestAnnouncementCall, getEnrolledCourses
}