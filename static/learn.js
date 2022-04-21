$(document).ready(function(){
    $("#nextbutton").click(function(){
        next()
    });

    let navid = "#" + content.id;

    $(navid).addClass("active");

    makeCheckpoint();
});

function next() {

    if (content.checkpoint) {

        let confirmdiv = $('<div id="dialog-confirm" title="">')
        let p = $("<p>")
        let spans = $('<span class="ui-icon ui-icon-alert" style="float:left; margin:12px 12px 20px 0;"></span>')
        $(p).append(spans)
        $(p).append("You haven't completed the checkpoint yet. Are you sure you want to continue?")
        $(confirmdiv).append(p)
        $("#confirm").append(confirmdiv)

        $( function() {
            $( "#dialog-confirm" ).dialog({
                resizable: false,
                height: "auto",
                width: 400,
                modal: true,
                buttons: {
                "Yes, continue": function() {
                    location.href = content.nextid;
                },
                Cancel: function() {
                    $( this ).dialog( "close" );

                }

                }

            });

        });

    } else {
        location.href = content.nextid;
    }

}

function makeCheckpoint() {

    if (content.checkpoint) {

        let buttondiv = $('<button class="alata greenBackground whiteText startQuiz smallPadding mediumText" id="checkpoint">Checkpoint</button>');
        $("#checkpoint").append(buttondiv);
        $("#checkpoint").click(function(){
            checkpoint()
        });

    }

}

function checkpoint() {

    location.href = "/checkpoint" + content.checkpointlink;

}