/*  
    const apiUrlAssig = "https://canvas.kdg.be/api/v1/courses/49719/assignments";
    const apiData = await API.regularCanvasAPICall(apiUrlAssig, requestOptions.basic, client);
    reminderController.test(apiData)
  */

async function sendReminder(apiData){
    const date = apiData.due_at;
    const day = date.split(/[-T]/)[2];
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

    if(year === currentYear && month === currentMonth && dayBeforeAssingment === currentDay){
        return "Title: " + apiData.name + "\ndescription: " + apiData.description;
    }
    else if(year === currentYear && month === currentMonth && threeDaysBeforeAssingment === currentDay){
        return "Title: " + apiData.name + "\ndescription: " + apiData.description;
    }
    else if(year === currentYear && month === currentMonth && weekBeforeAssignment === currentDay){
        return "Title: " + apiData.name + "\ndescription: " + apiData.description;
    }

}


module.exports = {
    sendReminder,
}