# Calendar
## A Manual Front-End Calendar Written in JavaScript.


Calendar is a NodeJS web application that is used to create and store calendar data as JSON.
NodeJS & JavaScript-powered calendar.

- Add tasks and events
- View tasks and events on the calendar
- Customize each month and save the structure in JSON.
- Change theme and custom color of calendar.

## Tech
- [JavaScript] - HTML enhanced for web apps!
- [node.js] - evented I/O for the backend
- [Express] - fast node.js network app framework

## Installation

Calendar requires [node.js](https://nodejs.org/) v10+ to run.
Install the dependencies and devDependencies and start the server.

```sh
cd Calendar
npm install
npm start
```

## index.html
In order to build out the calendar month you must create and modify a JS file and then link them into the index.html file in order for program to build properly.

`index.html`

```code
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="css/main.css">
    <link rel="stylesheet" href="css/calendar.css">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="js/superUtil.js"></script>
    <script src="js/calendar.js"></script>
    <script src="Years/2025/June/externalCalendar.js"></script>
    <title>Christopher's Digital Solutions: Calendar</title>
</head>
```
Observe how `externalCalendar.js` is included in the header of `index.html`
You must include the proper source of your externalCalendar to load it in properly.

## externalCalendar.js
```code
var isPast = false;
var Calendar_monthName = "July";
var Calendar_year = 2025;
var Calendar_numDaysInMonth = 31;
var Calendar_startWeekDay = calendar.calendarWeek[2];
var Calendar_theme = calendar.themes[4]; // 0-red, 1-orange, 2-yellow, 3-green, 4-blue, 5-purple, 6-pink, 7-charcoal;
// Custom theme function overide;
//applyCustomTheme("#3E6BBB", false);
var externalCalendar =
```
###### isPast
Keep `isPast` to `false` for the current month observed.
Set `isPast` to `true` to ensure the proper calendar title is set for past months.
###### Calendar_monthName
The current month as a `String`
###### Calendar_year
The current year as a `Number`
###### Calendar_numDaysInMonth
The amount of days in the whole month total. `Number`
###### Calendar_startWeekDay
The day in the week which the month starts. In the example: 2 is Tuesday. `Array`
###### Calendar_theme
Pick through held color themes 0-7 (0-red, 1-orange, 2-yellow, 3-green, 4-blue, 5-purple, 6-pink, 7-charcoal) `Array`
###### applyCustomTheme(String, Boolean);
Insert the color hex value as a string and then false for white, true for black. `Function`
###### externalCalendar
This is the JSON output of the current calendar being viewed. You can populate the values here when you have followed the steps to generating it.


```code
var externalCalendar =
[{"day":1,"events":[],"tasks":[],"weekDay":"Tuesday"},{"day":2,"events":[],"tasks":[],"weekDay":"Wednesday"},{"day":3,"events":[],"tasks":[],"weekDay":"Thursday"},{"day":4,"events":[],"tasks":[],"weekDay":"Friday"},{"day":5,"events":[],"tasks":[],"weekDay":"Saturday"},{"day":6,"events":[],"tasks":[],"weekDay":"Sunday"},{"day":7,"events":[],"tasks":[],"weekDay":"Monday"},{"day":8,"events":[],"tasks":[],"weekDay":"Tuesday"},{"day":9,"events":[],"tasks":[],"weekDay":"Wednesday"},{"day":10,"events":[],"tasks":[],"weekDay":"Thursday"},{"day":11,"events":[],"tasks":[],"weekDay":"Friday"},{"day":12,"events":[],"tasks":[],"weekDay":"Saturday"},{"day":13,"events":[],"tasks":[],"weekDay":"Sunday"},{"day":14,"events":[],"tasks":[],"weekDay":"Monday"},{"day":15,"events":[],"tasks":[],"weekDay":"Tuesday"},{"day":16,"events":[],"tasks":[],"weekDay":"Wednesday"},{"day":17,"events":[],"tasks":[],"weekDay":"Thursday"},{"day":18,"events":[],"tasks":[],"weekDay":"Friday"},{"day":19,"events":[],"tasks":[],"weekDay":"Saturday"},{"day":20,"events":[],"tasks":[],"weekDay":"Sunday"},{"day":21,"events":[],"tasks":[],"weekDay":"Monday"},{"day":22,"events":[],"tasks":[],"weekDay":"Tuesday"},{"day":23,"events":[],"tasks":[],"weekDay":"Wednesday"},{"day":24,"events":[],"tasks":[],"weekDay":"Thursday"},{"day":25,"events":[],"tasks":[],"weekDay":"Friday"},{"day":26,"events":[],"tasks":[],"weekDay":"Saturday"},{"day":27,"events":[],"tasks":[],"weekDay":"Sunday"},{"day":28,"events":[],"tasks":[],"weekDay":"Monday"},{"day":29,"events":[],"tasks":[],"weekDay":"Tuesday"},{"day":30,"events":[],"tasks":[],"weekDay":"Wednesday"},{"day":31,"events":[],"tasks":[],"weekDay":"Thursday"}];
```


   [node.js]: <http://nodejs.org>
   [express]: <http://expressjs.com>
   [JavaScript]: <https://www.javascript.com>


