$(document).ready(function () {

    let navid = "#" + content.id;

    $(navid).addClass("active");

    backtoQuiz();
    makeCheckpoint();

    $("#nextbutton").click(function () {
        next()
    });

    $("#backbutton").click(function () {
        back()
    });

});

function next() {

    // Warn the user if there's a checkpoint they haven't completed.
    if (content.checkpoint) {
        if (user.checkpoint[content.id - 3] == 0) {
            let confirmdiv = $('<div id="dialog-confirm" title="">')
            let p = $("<p>")
            let spans = $('<span class="ui-icon ui-icon-alert" style="float:left; margin:12px 12px 20px 0;"></span>')
            $(p).append(spans)
            $(p).append("You haven't completed the checkpoint yet. Are you sure you want to continue?")
            $(confirmdiv).append(p)
            $("#confirm").append(confirmdiv)

            $(function () {
                $("#dialog-confirm").dialog({
                    resizable: false,
                    height: "auto",
                    width: 400,
                    modal: true,
                    buttons: {
                        "Yes, continue": function () {
                            location.href = content.nextid;
                        },
                        Cancel: function () {
                            $(this).dialog("close");

                        }

                    }

                });

            });
        } else {
            location.href = content.nextid;
        }
    } else {
        location.href = content.nextid;
    }
}

function back() {
    location.href = content.backid;
}

function backtoQuiz() {

    if (user.takingQuiz > 0) {

        let backcol = $('<div class="col-md-2"></div>');
        let backbtndiv = $('<button class="alata greyBackground whiteText checkptbutton smallPadding mediumText" id="backtoquiz">Back to quiz</button>');
        $(backcol).append(backbtndiv);
        $("#btnrow").append(backcol);
        let coldiv = $('<div class="col-md-4"></div>');
        $("#btnrow").append(coldiv);

        $("#backtoquiz").click(function () {
            location.href = "/quiz/" + user.takingQuiz;
        });

    } else {

        let coldiv = $('<div class="col-md-6"></div>');
        $("#btnrow").append(coldiv);

    }

}

function makeCheckpoint() {

    if (content.id == 1) {

        // append back button
        let backcol = $('<div class="col-md-4"></div>');
        $("#btnrow").append(backcol);

    } else if (content.checkpoint) {

        // append back button
        let backcol = $('<div class="col-md-2"></div>');
        let backbtndiv = $('<button class="alata greyBackground whiteText checkptbutton smallPadding mediumText" id="backbutton">Back</button>');
        $(backcol).append(backbtndiv);
        $("#btnrow").append(backcol);

        // append checkpoint button
        let checkcol = $('<div class="col-md-2"></div>');
        let checkbtndiv = $('<button class="alata greenBackground whiteText checkptbutton smallPadding mediumText" id="checkpoint">Checkpoint</button>');
        $(checkcol).append(checkbtndiv);
        $("#btnrow").append(checkcol);

        $("#checkpoint").click(function () {
            checkpoint();
        });

    } else {

        // append empty column if no checkpoint
        let coldiv = $('<div class="col-md-2"></div>');
        $("#btnrow").append(coldiv);

        // append back button
        let backcol = $('<div class="col-md-2"></div>');
        let backbtndiv = $('<button class="alata greyBackground whiteText checkptbutton smallPadding mediumText" id="backbutton">Back</button>');
        $(backcol).append(backbtndiv);
        $("#btnrow").append(backcol);
    }

    // append next button
    let nextbtn = $('<div class="col-md-2"><button class="alata greyBackground whiteText checkptbutton smallPadding mediumText" id="nextbutton">Next</button></div>');
    $("#btnrow").append(nextbtn);

}

function checkpoint() {

    location.href = "/checkpoint" + content.checkpointlink;

}