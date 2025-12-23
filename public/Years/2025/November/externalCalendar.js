var isPast = true;
var Calendar_monthName = "November";
var Calendar_year = 2025;
var Calendar_numDaysInMonth = 30;
var Calendar_startWeekDay = calendar.calendarWeek[6];
var Calendar_theme = calendar.themes[7]; // 0-red, 1-orange, 2-yellow, 3-green, 4-blue, 5-purple, 6-pink, 7-charcoal;
// .::Custom theme function overide::.
//applyCustomTheme("#3E6BBB", false);
// .::Generate blank month for building out new months based on above criteria parameters::.
//calendar.generateMonth();
// .::Hardcoded backup value of stored month::.
var externalCalendar = [];