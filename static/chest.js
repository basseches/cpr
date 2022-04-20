let startTime = 0
let started = false
let compressionCt = 0
let setCt = 0

$(document).ready(function(){
    $("#nextbutton").click(function(){
        location.href = "/learn/5"
    });

    $("#startChestBtn").click(function(){
        countdown();
        // logTime();
    });

    $("#chestimg").click(function(){
        if (started) {
            compressionCt++;
            $("#compressions").html(compressionCt);
            if (compressionCt % 30 == 0) {
                setCt++;
                $("#sets").html(setCt);
            }
        }
    });

})

function countdown() {
    $("#buttonSpan").html("<div class='padding'><div class='chestNums'>Get ready!</div></div>");

    setTimeout(function(){
        $("#buttonSpan").html("<div class='margin headerFont'>3</div>");
    }, 1000);

    setTimeout(function(){
        $("#buttonSpan").html("<div class='margin headerFont'>2</div>");
    }, 2000);

    setTimeout(function(){
        $("#buttonSpan").html("<div class='margin headerFont'>1</div>");
    }, 3000);

    setTimeout(function(){
        $("#buttonSpan").html("<div class='row margin subheaderFont'>Compressions:</div><div class='row margin chestNums' id='compressions'>" + compressionCt +"</div><div class='row margin subheaderFont'>Sets:</div><div class='row margin chestNums' id='sets'>" + setCt + "</div>");
        started = true
    }, 4000);
}