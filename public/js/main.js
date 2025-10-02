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
    // Add clock to month title
    setInterval(function(){
        const now = new Date();
        const formattedTime = new Intl.DateTimeFormat('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        }).format(now);
        title.innerHTML = calendar.monthName +" "+(calendar.formattedDate) + "<br><span style='font-size:14pt'>"+ formattedTime+"</span>";
    },1000);
} else if(isPast == true) {
    title.innerHTML = calendar.monthName +" "+(calendar.year);
}

calendar.init();


