function add_quiz(){
    $.ajax({
        type: "PUT",
        url: "add_quiz",                
        dataType : "json",
        contentType: "application/json; charset=utf-8",
        success: function(result){
            console.log(result["quizID"])
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
    $("#quiznav").addClass("active");

    $("#startQuizBtn").click(function() {
        add_quiz()
    });
});