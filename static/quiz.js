function add_quiz(new_user){
    $.ajax({
        type: "POST",
        url: "add_quiz",                
        dataType : "json",
        contentType: "application/json; charset=utf-8",
        data : JSON.stringify(new_user),
        success: function(result){
            console.log(result["userID"])
        },
        error: function(request, status, error){
            console.log("Error");
            console.log(request)
            console.log(status)
            console.log(error)
        }
    });
}

$(document).ready(function(){
    $("#userName").focus()

    $("#startQuizBtn").click(function() {
        let quiztaker = {
            "name": userName.value
        }

        add_quiz(quiztaker)
    });

    $("#userName").keyup(function(event){
        let keycode = (event.keyCode ? event.keyCode : event.which);

        if(keycode == '13'){
            let quiztaker = {
                "name": userName.value
            }

            add_quiz(quiztaker)
            window.location.href = "/quiz/1"
        };

        event.stopPropagation();
    });
});