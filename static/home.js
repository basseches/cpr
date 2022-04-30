function add_user(new_user){
    $.ajax({
        type: "POST",
        url: "add_user",                
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
    
    $("#homenav").addClass("active");
    $("#userName").focus()

    $("#startCPRBtn").click(function() {
        let user = {
            "name": userName.value
        }

        add_user(user)
    });

    $("#userName").keyup(function(event){
        let keycode = (event.keyCode ? event.keyCode : event.which);

        if(keycode == '13'){
            let user = {
                "name": userName.value
            }

            add_user(user)
            window.location.href = "/learn/1"
        };

        event.stopPropagation();
    });

})