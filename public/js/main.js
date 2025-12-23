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
    var tick = false;
    setInterval(function(){
        const now = new Date();
        var formattedTime = new Intl.DateTimeFormat('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        }).format(now);
        // add tick
        if(tick == false){
            formattedTime = formattedTime.replace(":"," ");
            tick = true;
        } else if(tick == true) {
            // do nothing
            tick = false;
        }
        title.innerHTML = calendar.monthName +" "+(calendar.formattedDate) + "<br><span style='font-size:14pt'>"+ formattedTime+"</span>";
    },1000);
} else if(isPast == true) {
    title.innerHTML = calendar.monthName +" "+(calendar.year);
}

calendar.init();

function reloadCalendarPage(){
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
    setTimeout(function(){
        window.location.reload();
    },1000);
}

function scrollToTop(){
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}


