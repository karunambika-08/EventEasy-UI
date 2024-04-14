// Setting session Duration
function setSessionDuration(duration) {
    let durationInput = Number(duration);
    let sessionDuration;
    switch (durationInput) {
        case 30:
            sessionDuration = "30 mins";
            break;
        case 60:
            sessionDuration = "1 hour";
            break;
        case 90:
            sessionDuration = "1 hour 30 mins";
            break;
        case 120:
            sessionDuration = "2 hours";
            break;
        case 150:
            sessionDuration = "2 hour 30 mins";
            break;
        default:
            sessionDuration = "30 mins";
            break;
    }
    return sessionDuration;
}


// -----> Date Formatting  Function for Display <-----
function formatDate(date) {
    let dateInput = date;
    let dateObj = new Date(dateInput);
    if (!isNaN(dateObj)) {
        let day = dateObj.getDate();
        const month = dateObj.toLocaleString('default', { month: 'short' });
        let year = dateObj.getUTCFullYear();
        let date = `${month} ${day} ${year}`;
        return date;
    }
}

/* --> Format Date function for Date Mapping <--- 
*/
function formatForSpecificDate(date) {
    let dateInput = date;
    let dateObj = new Date(dateInput);
    if (!isNaN(dateObj)) {
        let day = dateObj.getDate();
        let month = dateObj.getMonth() + 1;
        let year = dateObj.getUTCFullYear();
        if (day < 10) {
            day = `0${day}`
        }
        if (month < 10) {
            month = `0${month}`
        }
        let date = `${year}-${month}-${day}`;
        return date;
    }
}


// -----> Funtion to merge the date and time and return the epoch time
function mergeDateAndTimeInput(dateInput, timeInput) {
    const date = new Date(dateInput)
    const [hours, mins] = timeInput.split(':');
    const dateTime = date.setHours(parseInt(hours, 10), parseInt(mins, 10), 0, 0);
    return dateTime;
  }
export { formatForSpecificDate , formatDate , setSessionDuration, mergeDateAndTimeInput}