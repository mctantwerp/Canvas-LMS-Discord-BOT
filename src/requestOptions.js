const apiKey = process.env.CANVAS_API;
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
function getUpcomingAnnouncements(date) {

    const getLatestAnnouncementCall = {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${apiKey}`
        },
        params: {
            only_announcements: true,
            start_date: date,
        }
    };

    return getLatestAnnouncementCall;
}

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
        bucket: 'future',
    }
};

module.exports = {
    basic, getLatestAnnouncementCall, getEnrolledCourses, getUpcomingAssignments, getUpcomingAnnouncements
}