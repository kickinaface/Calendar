function Calendar(){
    this.monthName = "";
    this.numDaysInMonth = null;
    this.monthStructure = [];
    this.calendarWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    this.themes = ["#C41717","#ff8400","#ffd000","#09b200","#007bff","#7700ff","#ff00a6","#424242"];
    this.chosenTheme = null;
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() +1;
    const year = today.getFullYear();
    this.formattedDate = `${month}/${day}/${year}`;
    var isControlsShown = false;
    
    var isBlackButtonText = "white";
    //
    this.init = function(){
        // Take content from externalCalendar.js and build out the month
        generateMonth();
        // Get the held month data from backend and populate the calendar.
        if(isPast == true){// use the data stored in the externalCalendar.js file.
            setTimeout(function(){
                calendar.monthStructure = externalCalendar;
                document.querySelector("#calControlButton").style.display = "none";
                buildCalendar();
                console.log("calendar loaded...");
            },500);
            
        } else {
            superUtil.grabJSON("/api/getCal", function(status, response){
                if(status == 200){
                    // To reset the month, comment out: calendar.monthStructure = response;
                    // and refresh the page.
                    calendar.monthStructure = response;
                    console.log("calendar loaded...");
                    buildCalendar();
                    console.log("calendar loaded...");
                } else {
                    alert("Error, there is no calendar file loaded... "+
                        "You must create the file: 'js/exportedCalendar.json' and populate it with the calendar structure.");
                }
            
            });
        }
    }

    this.syncCal = function(){
        syncJSONwithExternalCalendar();
    }

    this.toggleSettingsControls = function(){
        var calendarControls = document.querySelector("#calendarControls");
        var calControlButton = document.querySelector("#calControlButton span");
        //
        if(isControlsShown == false){
            calendarControls.style.display = "block";
            calControlButton.innerHTML = "Hide Settings";
            isControlsShown = true;
        } else if(isControlsShown == true){
            calendarControls.style.display = "none";
            calControlButton.innerHTML = "Show Settings";
            isControlsShown = false;
        }
    }

    function syncJSONwithExternalCalendar(){
        // Grab the JSON structure from the input field
        // Then, save it to the externalCalendar variable to be kept for later.
        var calendarOutput = document.querySelector("#calendarOutput");
        var preparedJSON = JSON.parse(calendarOutput.value);
        externalCalendar = preparedJSON;
        //
        superUtil.sendJSON(externalCalendar, "/api/calBackup", function(status, response){
            // Rewrite stored calendar value
            if(status == 200){
                alert(response.message);
            } else {
                alert("There was a probleming syncing your calendar.")
            }
        }, "POST");
    }

    function generateMonth(){
        var weekIndex = calendar.calendarWeek.indexOf(Calendar_startWeekDay);
        //
        for(var i = 0; i<= calendar.numDaysInMonth-1; i++){
            if(weekIndex > calendar.calendarWeek.length-1){
                weekIndex = 0;
            }
            var dayStructure = {
                day: (i+1),
                events:[],
                tasks:[],
                weekDay: calendar.calendarWeek[weekIndex]
            }
            calendar.monthStructure.push(dayStructure);
            weekIndex++;
        }        
    }

    this.addEvent = function addEvent(name, day, time, notes){
        var preparedEvent = {
            name: name,
            day: day,
            time: time,
            notes: notes,
            isComplete: false
        }
        calendar.monthStructure[day-1].events.push(preparedEvent);
    }

    this.addTask = function addTask(name, day, time, notes){
        var preparedTask = {
            name: name,
            day, day,
            time, time,
            notes: notes,
            isComplete: false
        }
        calendar.monthStructure[day-1].tasks.push(preparedTask);
    }

    function animateDialogIn(){
        var fullScreenWrapper = document.querySelector(".fullScreenWrapper");
        var modalContentWrapper = document.querySelector(".modalContentWrapper");
        var buttonWrapper = document.querySelector(".buttonWrapper");
        var modalMessages = document.querySelector('.modalMessages');
        var inputWrapper = document.querySelector(".inputWrapper");
        var counter = 0;
        var counterEnd = 20;

        fullScreenWrapper.style.opacity = 1;
        modalContentWrapper.style.opacity = 0;
        modalContentWrapper.style.marginTop = "-4000px";
        buttonWrapper.style.opacity = 0;
        modalMessages.style.opacity = 0;
        inputWrapper.style.opacity = 0;

        setTimeout(function(){
            var aniLoop = setInterval(function(){
                if(counter != counterEnd){
                    counter++;
                    modalContentWrapper.style.opacity = (counter/100)+(counter/counterEnd);
                    buttonWrapper.style.opacity = (counter/100)+(counter/counterEnd);
                    modalMessages.style.opacity = (counter/100)+(counter/counterEnd);
                    inputWrapper.style.opacity = (counter/100)+(counter/counterEnd);
                    modalContentWrapper.style.marginTop = ((counter*(100 /counterEnd))/5+"px");
                } else {
                    //console.log("stop and clear");
                    modalContentWrapper.style.marginTop = "20px";
                    modalContentWrapper.style.opacity = 1;
                    buttonWrapper.style.opacity = 1;
                    modalMessages.style.opacity = 1;
                    inputWrapper.style.opacity = 1;
                    clearInterval(aniLoop);
                }
                
            },20);
        },500);
    }

    this.openDialog = function openDialog(dayElement, dialogTitle, dayIndex, isCalItem){
        var fullScreenWrapper = document.querySelector(".fullScreenWrapper");
        var title = fullScreenWrapper.querySelector("h2");
        var buttonWrapper = document.querySelector(".buttonWrapper");
        var modalMessages = document.querySelector('.modalMessages');
        var inputWrapper = document.querySelector(".inputWrapper");
        var dayIndexHidden = document.querySelector("#dayIndex");
        // Build up current dialog for picked date.
        title.textContent = dialogTitle;
        fullScreenWrapper.style.display = "block";
        buttonWrapper.style.display = "block";
        modalMessages.style.display = "block";
        inputWrapper.style.display = "block";
        if(!isCalItem){
            // 
        } else if(isCalItem == true){
            animateDialogIn();
        }
        
        dayIndexHidden.value = dayIndex+1;

        // Populate stored events.
        if(this.monthStructure[dayIndex].events.length!=0){
            inputWrapper.innerHTML +="<br><h3>Event List:</h3><br>";
            // Loop through events array and build the list
            for(var e=0; e<= this.monthStructure[dayIndex].events.length-1; e++){
                inputWrapper.innerHTML += "<div class='eventWrapper'><h3>Event: </h3><b>Name: </b>"+this.monthStructure[dayIndex].events[e].name+
                " <br><b>Time: </b>"+this.monthStructure[dayIndex].events[e].time+"<br>"+
                "<b>Event Completed: </b>"+this.monthStructure[dayIndex].events[e].isComplete+
                "<br><b>Notes: </b>"+this.monthStructure[dayIndex].events[e].notes+
                "<br><center><button onclick='calendar.editEvent(event, "+dayIndex+", "+e+");'>Edit Event</button>"+
                "<button onclick='calendar.deleteEvent(event, "+dayIndex+", "+e+");'>Delete Event</button>"+
                "<button onclick='calendar.completeEvent(event, "+dayIndex+", "+e+");'>Mark Completed</button>"+
                "<button onclick='calendar.moveUp(`Event`, "+dayIndex+", "+e+");'>&#x25B2;</button>"+
                "<button onclick='calendar.moveDown(`Event`, "+dayIndex+", "+e+");'>&#x25BC;</button></center></div><br>";
            }
            modalMessages.innerHTML = "";
        }
        // Populate stored tasks.
        if(this.monthStructure[dayIndex].tasks.length!=0){
            // Loop through events array and build the list
            inputWrapper.innerHTML +="<br><h3>Task List:</h3><br>";
            for(var e=0; e<= this.monthStructure[dayIndex].tasks.length-1; e++){
                inputWrapper.innerHTML += "<div class='taskWrapper'><h3>Task: </h3><b>Name: </b>"+this.monthStructure[dayIndex].tasks[e].name+
                " <br><b>Time: </b>"+this.monthStructure[dayIndex].tasks[e].time+"<br>"+
                "<b>Task Completed: </b>"+this.monthStructure[dayIndex].tasks[e].isComplete+
                "<br><b>Notes: </b>"+this.monthStructure[dayIndex].tasks[e].notes+
                "<br><center><button onclick='calendar.editTask(event, "+dayIndex+", "+e+");'>Edit Task</button>"+
                "<button onclick='calendar.deleteTask(event, "+dayIndex+", "+e+");'>Delete Task</button>"+
                "<button onclick='calendar.completeTask(event, "+dayIndex+", "+e+");'>Mark Completed</button>"+
                "<button onclick='calendar.moveUp(`Task`, "+dayIndex+", "+e+");'>&#x25B2;</button>"+
                "<button onclick='calendar.moveDown(`Task`, "+dayIndex+", "+e+");'>&#x25BC;</button></center></div><br>";
            }
            modalMessages.innerHTML = "";
        }
        // No events or tasks
        if(this.monthStructure[dayIndex].events.length==0 && this.monthStructure[dayIndex].tasks.length==0){
            modalMessages.innerHTML = "<i>There are no events or tasks here. </i>"
        }

        // theme buttons
        var dialogButtons = document.querySelectorAll(".inputWrapper button");
        for(var d = 0; d<= dialogButtons.length-1; d++){
            dialogButtons[d].style.background = calendar.chosenTheme;
            if(calendar.chosenTheme == calendar.themes[2]){
                dialogButtons[d].style.color = "black";
            }
        }
    }

    this.closeModal = function closeModal(isCloseBtn){
        var fullScreenWrapper = document.querySelector(".fullScreenWrapper");
        var inputWrapper = document.querySelector(".inputWrapper");
        if(!isCloseBtn){
            fullScreenWrapper.style.display = "none";
            inputWrapper.innerHTML = "";
        } else if(isCloseBtn == true){
            animateDialogOut();
        }
        
        
    }

    function animateDialogOut(){
        var fullScreenWrapper = document.querySelector(".fullScreenWrapper");
        var modalContentWrapper = document.querySelector(".modalContentWrapper");
        var buttonWrapper = document.querySelector(".buttonWrapper");
        var modalMessages = document.querySelector('.modalMessages');
        var inputWrapper = document.querySelector(".inputWrapper");
        var counter = 20;
        var counterEnd = 0;

        setTimeout(function(){
            var aniLoop = setInterval(function(){
                if(counter != counterEnd){
                    counter--;
                    modalContentWrapper.style.opacity = ((counter/100)*counter);
                    buttonWrapper.style.opacity = ((counter/100)*counter);
                    modalMessages.style.opacity = ((counter/100)*counter);
                    inputWrapper.style.opacity = ((counter/100)*counter);
                    modalContentWrapper.style.marginTop = (counter +"px");
                } else {
                    //console.log("stop and clear");
                    modalContentWrapper.style.opacity = 0;
                    buttonWrapper.style.opacity = 0;
                    modalMessages.style.opacity = 0;
                    inputWrapper.style.opacity = 0;
                    fullScreenWrapper.style.display = "none";
                    inputWrapper.innerHTML = "";
                    clearInterval(aniLoop);
                }
                
            },15);
        },5);
    }

    this.addEventDialog = function addEventDialog(){
        var buttonWrapper = document.querySelector(".buttonWrapper");
        var modalMessages = document.querySelector('.modalMessages');
        var inputWrapper = document.querySelector(".inputWrapper");
        var modalMessages = document.querySelector(".modalMessages");
        if(calendar.chosenTheme == calendar.themes[2]){
            isBlackButtonText = "black";
        } else {
            isBlackButtonText = "white";
        }
        // Hide default controls
        buttonWrapper.style.display = "none";
        modalMessages.style.display = "none";
        inputWrapper.style.display = "none";

        // Buld up dialog for adding events
        inputWrapper.innerHTML = "<center><br><b>Event Name: </b><br><input type='text' class='eventName' placeholder='Event Name'>" +
        "<br><br><b>Event Time: </b><br><input type='text' class='eventTime' placeholder='Event Time (3:00)'> <select id='timeCycle'><option value='am'>AM</option><option value='pm'>PM</option></select>"+
        "<br><br><b>Event Notes:</b><br><textarea class='eventNotes' placeholder='Event Notes'></textarea>"+
        "<p><button onclick='calendar.executeAddEvent();' style='background:"+calendar.chosenTheme+"; color:"+isBlackButtonText+";'>Add Event</button></p>"+
        "</center>";
        inputWrapper.style.display = "block";
    }

    this.executeAddEvent = function executeAddEvent(){
        //Get value of input fields. Throw errors if missing
        var eventName = document.querySelector(".eventName");
        var eventTime = document.querySelector(".eventTime");
        var eventNotes = document.querySelector(".eventNotes");
        var modalMessages = document.querySelector(".modalMessages");

        if(eventName.value == "" || eventTime.value == "" || eventNotes.value ==""){
            // Show error.
            modalMessages.style.display = "block";
            modalMessages.innerHTML ="<i style='color:red'>You must fill in all the input fields to continue.</i>"
        } else{
            modalMessages.innerHTML = "";
            modalMessages.style.display = "none";
            // Add the event.
             calendar.addEvent(eventName.value, 
                sanitize((document.querySelector("#dayIndex").value)),
                (eventTime.value+" "+document.querySelector("#timeCycle").value), 
                eventNotes.value
            );
            alert('Event added...');
            calendar.closeModal();
            buildCalendar();
        }
    }

    this.addTaskDialog = function addTaskDialog(){
        var buttonWrapper = document.querySelector(".buttonWrapper");
        var modalMessages = document.querySelector('.modalMessages');
        var inputWrapper = document.querySelector(".inputWrapper");
        if(calendar.chosenTheme == calendar.themes[2]){
            isBlackButtonText = "black";
        } else {
            isBlackButtonText = "white";
        }
        // Hide default controls
        buttonWrapper.style.display = "none";
        modalMessages.style.display = "none";
        inputWrapper.style.display = "none";

        // Buld up dialog for adding events
        inputWrapper.innerHTML = "<center><br><b>Task Name:</b><br><input type='text' class='taskName' placeholder='Task Name'>" +
        "<br><br><b>Task Time:</b><br><input type='text' class='taskTime' placeholder='Task Time (3:00)'> <select id='timeCycle'><option value='am'>AM</option><option value='pm'>PM</option></select>"+
        "<br><br><b>Task Notes</b><br><textarea class='taskNotes' placeholder='Task Notes'></textarea>"+
        "<p><button onclick='calendar.executeTaskEvent();' style='background:"+calendar.chosenTheme+"; color:"+isBlackButtonText+";'>Add Task</button></p>"+
        "</center>";
        inputWrapper.style.display = "block";
    }
    this.executeTaskEvent = function executeTaskEvent(){
        //Get value of input fields. Throw errors if missing
        var taskName = document.querySelector(".taskName");
        var taskTime = document.querySelector(".taskTime");
        var taskNotes = document.querySelector(".taskNotes");
        var modalMessages = document.querySelector(".modalMessages");

        if(taskName.value == "" || taskTime.value == "" || taskNotes.value ==""){
            // Show error.
            modalMessages.style.display = "block";
            modalMessages.innerHTML ="<i style='color:red'>You must fill in all the input fields to continue.</i>"
        } else{
            modalMessages.innerHTML = "";
            modalMessages.style.display = "none";
            // Add the task.
            calendar.addTask(taskName.value, 
                sanitize((document.querySelector("#dayIndex").value)),
                (taskTime.value+" "+document.querySelector("#timeCycle").value), 
                taskNotes.value
            );
            alert('Task added...');
            //console.log("Days: ", this.monthStructure);
            calendar.closeModal();
            buildCalendar();
        }
    }

    function buildCalendar(){
        var calendarOutput = document.querySelector("#calendarOutput");
        var calendarWrapper = document.querySelector(".calendarWrapper ul");
        // Post to backend to update JSON file
        // dont do it if you are loading old calendars
        if(isPast == false){
            superUtil.sendJSON(calendar.monthStructure, "/api/calSync", function(status, response){
                // Rewrite stored calendar value
                if(status == 200 && !response){
                    calendarOutput.value = JSON.stringify(response);
                } else {
                    // Pass: null in the value of externalCalendar.json to rebuild the calendar
                    calendarOutput.value = JSON.stringify(calendar.monthStructure);
                }
            }, "POST");
        }
        
        // Append html to build each day block
        calendarWrapper.innerHTML = "";
        for(var i = 0; i<= calendar.numDaysInMonth-1; i++){
            calendarWrapper.innerHTML+="<li><b class='dayTitle' style='float:left;'>"+(i+1)+". </b><b class='dayTitle'><div style='float:right;'>"+calendar.monthStructure[i].weekDay+"</div></b><br><br><div class='dayObjects'></div></li>";
        }

        setTimeout(function(){
            // Add click event listenter and populate calendar days
            var calendarDays = document.querySelectorAll(".calendarWrapper ul li");
            for(let c = 0; c<= calendarDays.length-1; c++){
                //click event
                calendarDays[c].addEventListener("click", function(e){
                    calendar.openDialog(e.target, (calendar.monthStructure[c].weekDay + ", "+ calendar.monthName + " "+ (c+1)+ ", "+ calendar.year), (c), true);
                });
            }

            // Populate Calendar events and tasks per day       
            for(let c = 0; c<= calendarDays.length-1; c++){
                //populate events
                for(var i = 0; i<=calendar.monthStructure[c].events.length-1; i++){
                    calendarDays[c].querySelector('.dayObjects').innerHTML += "<div>"+calendar.monthStructure[c].events[i].name.substring(0,25)+"</div>";
                }
                //populate tasks
                for(let i = 0; i<=calendar.monthStructure[c].tasks.length-1; i++){
                    calendarDays[c].querySelector('.dayObjects').innerHTML += "<div>"+calendar.monthStructure[c].tasks[i].name.substring(0,25)+"</div>";
                }

                // Apply theme
                if(calendar.chosenTheme != null){
                    calendarDays[c].style.background = calendar.chosenTheme;
                    calendarDays[c].style.borderColor = calendar.chosenTheme;
                    calendarDays[c].addEventListener("mouseover", function(e){
                        e.currentTarget.style.opacity = '.3';
                    });
                    calendarDays[c].addEventListener("mouseout", function(e){
                        e.currentTarget.style.opacity = '1';
                    });
                }
                // Style nav bar
                document.querySelector(".navBar").style.background = calendar.chosenTheme;
                // Style buttons
                var appButtons = document.querySelectorAll("button");
                for(var b = 0; b<=appButtons.length-1; b++){
                    appButtons[b].style.background = calendar.chosenTheme;
                    if(calendar.chosenTheme == calendar.themes[2]){
                        appButtons[b].style.color = "black";
                    } else{
                        appButtons[b].style.color = "white";
                    }
                }
                // select chosen theme if selected
                document.querySelector("#colorScheme").value = calendar.themes.indexOf(calendar.chosenTheme);

                // Highlight current date
                if(c == (day-1) && isPast != true){
                    calendarDays[c].style.background = "black";
                    calendarDays[c].style.border = "1px solid black";
                } else {
                    calendarDays[c].style.border = "1px solid"+calendar.chosenTheme;
                }

                // style title and numbers if on yellow theme cause its lighter and harder to see on white
                if(calendar.chosenTheme == calendar.themes[2] && c != (day-1)){
                    calendarDays[c].querySelector(".dayTitle").style.color = "black";
                    calendarDays[c].querySelector(".dayTitle div").style.color = "black";
                    document.querySelector(".logo").style.color = "black";
                } else {
                    document.querySelector(".logo").style.color = "white";
                }

                //if you are isPast looking at previous content & you have selected black text
                if(calendar.chosenTheme == calendar.themes[2] && c == (day-1) && isPast == true){
                    calendarDays[c].querySelector(".dayTitle").style.color = "black";
                    calendarDays[c].querySelector(".dayTitle div").style.color = "black";
                }
                // style seasons portion
                if(!isPast){
                    updateSeasonStyles(calendar.chosenTheme);
                }
            }
        },50);
    }

    this.importJSON = function importJSON(){
        var calendarOutput = document.querySelector("#calendarOutput");
        var preparedJSON = JSON.parse(calendarOutput.value);
        calendar.monthStructure = preparedJSON;
        buildCalendar();
        alert("Imported Calendar...");
    }

    this.editEvent = function editEvent(element, dayIndex, eventIndex){
        //Empty out inputWrapper
        var inputWrapper = document.querySelector(".inputWrapper");
        var buttonWrapper = document.querySelector(".buttonWrapper");
        if(calendar.chosenTheme == calendar.themes[2]){
            isBlackButtonText = "black";
        } else {
            isBlackButtonText = "white";
        }
        //
        var preparedName = JSON.stringify(calendar.monthStructure[dayIndex].events[eventIndex].name);
        inputWrapper.innerHTML = "<center><h2>Edit Event:<br><br></h2><b>Event Name: </b><br><input type='text' class='eventName' placeholder='Event Name' value="+preparedName+">" +
        "<br><br><b>Event Time:</b><br><input type='text' class='eventTime' placeholder='"+calendar.monthStructure[dayIndex].events[eventIndex].time+" (example: 3:00)'> <select id='timeCycle'><option value='am'>AM</option><option value='pm'>PM</option></select>"+
        "<br><br><b>Event Notes:</b><br><textarea class='eventNotes' placeholder='Event Notes'>"+calendar.monthStructure[dayIndex].events[eventIndex].notes+"</textarea>"+
        "<p><button onclick='calendar.executeEditEvent("+dayIndex+", "+eventIndex+");' style='background:"+calendar.chosenTheme+"; color:"+isBlackButtonText+";'>Save</button></p>"+
        "</center>";
        buttonWrapper.style.display = "none";

    }
        this.executeEditEvent = function executeEditEvent(dayIndex, eventIndex){
            var calendarListObjects = document.querySelectorAll(".calendarWrapper ul li");
            var eventName = document.querySelector(".eventName");
            var eventTime = document.querySelector(".eventTime");
            var timeCycle = document.querySelector("#timeCycle");
            var eventNotes = document.querySelector(".eventNotes");
            //
            calendar.monthStructure[dayIndex].events[eventIndex].name = sanitize(eventName.value);
            console.log(eventTime.value);
            if(!eventTime.value || eventTime.value ==""){
                // leave the original value
            } else {
                calendar.monthStructure[dayIndex].events[eventIndex].time = (eventTime.value+" "+timeCycle.value);
            }
            
            calendar.monthStructure[dayIndex].events[eventIndex].notes = eventNotes.value;
            alert("Edited Event Successfully...");
            calendar.closeModal();
            buildCalendar();
            calendarListObjects[dayIndex].click();
        }

    this.editTask = function editTask(element, dayIndex, taskIndex){
        //Empty out inputWrapper
        var inputWrapper = document.querySelector(".inputWrapper");
        var buttonWrapper = document.querySelector(".buttonWrapper");
        if(calendar.chosenTheme == calendar.themes[2]){
            isBlackButtonText = "black";
        } else {
            isBlackButtonText = "white";
        }
        //
        var preparedName = JSON.stringify(calendar.monthStructure[dayIndex].tasks[taskIndex].name);
        inputWrapper.innerHTML = "<center><br><h2>Edit Task:</h2><br><b>Task Name: </b><br><input type='text' class='taskName' placeholder='Task Name' value="+preparedName+">" +
        "<br><br><b>Task Time:</b><br><input type='text' class='taskTime' placeholder='"+calendar.monthStructure[dayIndex].tasks[taskIndex].time+" (example: 3:00)'> <select id='timeCycle'><option value='am'>AM</option><option value='pm'>PM</option></select>"+
        "<br><br><b>Task Notes:</b><textarea class='taskNotes' placeholder='Event Notes'>"+calendar.monthStructure[dayIndex].tasks[taskIndex].notes+"</textarea>"+
        "<p><button onclick='calendar.executeEditTask("+dayIndex+", "+taskIndex+");' style='background:"+calendar.chosenTheme+"; color:"+isBlackButtonText+"'>Save</button></p>"+
        "</center>";
        buttonWrapper.style.display = "none";
    }
        this.executeEditTask = function executeEditTask(dayIndex, taskIndex){
            var calendarListObjects = document.querySelectorAll(".calendarWrapper ul li");
            var taskName = document.querySelector(".taskName");
            var taskTime = document.querySelector(".taskTime");
            var timeCycle = document.querySelector("#timeCycle");
            var taskNotes = document.querySelector(".taskNotes");
            //
            calendar.monthStructure[dayIndex].tasks[taskIndex].name = sanitize(taskName.value);
            if(!taskTime.value || taskTime.value == ""){
                // leave it as it was originally
            } else {
                calendar.monthStructure[dayIndex].tasks[taskIndex].time = (taskTime.value+" "+timeCycle.value);
            }
            calendar.monthStructure[dayIndex].tasks[taskIndex].notes = taskNotes.value;
            alert("Edited Task Successfully...");
            calendar.closeModal();
            buildCalendar();
            calendarListObjects[dayIndex].click();
        }

    this.deleteEvent = function deleteEvent(element, dayIndex, eventIndex){
        var calendarListObjects = document.querySelectorAll(".calendarWrapper ul li");
        // Delete event
        if(confirm("Are you sure you wish to delete this event? This cannot be undone!")){
            calendar.monthStructure[dayIndex].events.splice(eventIndex, 1);
            alert("This event was successfully deleted...");
            calendar.closeModal();
            buildCalendar();
            calendarListObjects[dayIndex].click();
        }
    }
    this.deleteTask = function deleteTask(element, dayIndex, taskIndex){
        var calendarListObjects = document.querySelectorAll(".calendarWrapper ul li");
        // Delete event
        if(confirm("Are you sure you wish to delete this task? This cannot be undone!")){
            calendar.monthStructure[dayIndex].tasks.splice(taskIndex, 1);
            alert("This task was successfully deleted...");
            calendar.closeModal();
            buildCalendar();
            calendarListObjects[dayIndex].click();
        }
    }

    this.completeEvent = function completeEvent(element, dayIndex, eventIndex){
        var calendarListObjects = document.querySelectorAll(".calendarWrapper ul li");
        // Complete event
        if(confirm("Are you sure you wish to mark this event as completed?")){
            calendar.monthStructure[dayIndex].events[eventIndex].isComplete = true;
            alert("This event is marked completed!");
            calendar.closeModal();
            buildCalendar();
            calendarListObjects[dayIndex].click();
        }
    }

    this.completeTask = function completeTask(element, dayIndex, taskIndex){
        var calendarListObjects = document.querySelectorAll(".calendarWrapper ul li");
        // Complete task
        if(confirm("Are you sure you wish to mark this task as completed?")){
            calendar.monthStructure[dayIndex].tasks[taskIndex].isComplete = true;
            alert("This event is marked completed!");
            calendar.closeModal();
            buildCalendar();
            calendarListObjects[dayIndex].click();
        }
    }
    // Place events and tasks in desired position.
    function moveDateElement(array, initialIndex, newIndex){
        if (newIndex >= array.length) {
            newIndex = array.length - 1;
        }
        if (newIndex < 0) {
            newIndex = 0
        }
        const element = array.splice(initialIndex, 1)[0];
        array.splice(newIndex, 0, element);
        return array;
    }

    this.moveUp = function moveUp(type, dayIndex, eventIndex){
        var calendarListObjects = document.querySelectorAll(".calendarWrapper ul li");
        if(type == "Event"){
            moveDateElement(calendar.monthStructure[dayIndex].events, eventIndex, (eventIndex-1));
        } else if(type == "Task"){
            moveDateElement(calendar.monthStructure[dayIndex].tasks, eventIndex, (eventIndex-1));
        }
        calendar.closeModal();
        buildCalendar();
        calendarListObjects[dayIndex].click();
    }

    this.moveDown = function moveDown(type, dayIndex, eventIndex){
        var calendarListObjects = document.querySelectorAll(".calendarWrapper ul li");
        if(type == "Event"){
            moveDateElement(calendar.monthStructure[dayIndex].events, eventIndex, (eventIndex+1));
        } else if(type == "Task"){
            moveDateElement(calendar.monthStructure[dayIndex].tasks, eventIndex, (eventIndex+1));
        }
        calendar.closeModal();
        buildCalendar();
        calendarListObjects[dayIndex].click();
    }
    function sanitize(string) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#x27;',
            "/": '&#x2F;',
        };
        const reg = /[&<>"'/]/ig;
        return string.replace(reg, (match)=>(map[match]));
    }

    this.changeTheme = function changeTheme(){
        var colorScheme = document.querySelector("#colorScheme").value;
        var innerTextColor = document.querySelector("#innerTextColor").value;
        var customHexValue = document.querySelector("#customHexValue").value;
        var isBlackText;
        isBlackButtonText = innerTextColor;

        if(colorScheme == -1){
            alert("Selected custom hex value.");
            if(isBlackButtonText == "white"){
                isBlackText = false;
            } else {
                isBlackText = true;
            }
            applyCustomTheme(customHexValue, isBlackText);
            document.querySelector("#functionMessage").innerHTML = "<i style='font-size:10pt;'>applyCustomTheme('"+customHexValue+"', "+isBlackText+");</i>"
        } else{
            calendar.chosenTheme = calendar.themes[parseInt(colorScheme)];
            Calendar_theme = calendar.chosenTheme;
        }
        
        if(isBlackButtonText == "black"){
            calendar.themes[2] = calendar.chosenTheme;
        }
        buildCalendar();
    }
}
function applyCustomTheme(hexValue, isBlackText){
    
    // override themes, create custom theme.
    Calendar_theme = hexValue;
    calendar.chosenTheme= Calendar_theme;
    //Set black text as yellow theme
    if(isBlackText == true){
        calendar.themes[2] = Calendar_theme;
    }
    // set input field to hex value
    setTimeout(function(){
        document.querySelector("#customHexValue").value = hexValue;
    },1000);

    
}
function updateSeasonStyles(hex){
    var seasonList = document.querySelectorAll("#seasonList li");
    // style custom seasons (NTKJIDA)
    // style background border
    for(i=0;i<=seasonList.length-1;i++){
        seasonList[i].style.borderColor = hex;
    }
    // style custom seaon orbs
    document.querySelector("#seasonList li:nth-child(2)")
        .style.backgroundImage = "linear-gradient(white, "+hex+")";
    document.querySelector("#seasonList li:nth-child(3)")
        .style.backgroundColor = hex;
    document.querySelector("#seasonList li:nth-child(4)")
        .style.backgroundColor = hex;
    document.querySelector("#seasonList li:nth-child(5)")
        .style.backgroundImage = "linear-gradient("+hex+", white)";
}
var calendar = new Calendar();
