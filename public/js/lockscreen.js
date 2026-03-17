var superUtil = new SuperUtil(); 
function unlockCalendar(){
    var passwordInput = document.querySelector("#passwordInput");
    var errorMessages = document.querySelector("#errorMessages");
    var preparedPasscode = {
        userEntry: passwordInput.value
    }
    superUtil.sendJSON(preparedPasscode, "/api/unlockCal", function(status, response){
        var response = JSON.parse(response);
        if(status == 200){            
            if(response.redirect == true){
                window.location.reload();
            }
        } else {
            errorMessages.innerHTML = response.message;
        }
    }, "POST");
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        unlockCalendar();
    } else {
        var passwordInput = document.querySelector("#passwordInput");
        passwordInput.focus();
    }
});