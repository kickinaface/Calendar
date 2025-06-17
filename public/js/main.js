// Build visual calendar
var title = document.querySelector(".calendarWrapper h1");
var superUtil = new SuperUtil();

// Build out the month
calendar.monthName = Calendar_monthName;
calendar.year = Calendar_year;
calendar.numDaysInMonth = Calendar_numDaysInMonth;

// Apply themes
calendar.chosenTheme = Calendar_theme;

// Add title
if(isPast == false){
    title.innerHTML = calendar.monthName +" "+(calendar.formattedDate);
} else if(isPast == true) {
    title.innerHTML = calendar.monthName +" "+(calendar.year);
}

calendar.init();


