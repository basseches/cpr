let steps = [
    "find an AED",
    "call 911",
    "use AED",
    "begin manual CPR"
]
let displayOrder = [3, 2, 0, 1];

$(document).ready(function() {

    initializePage();

    $("#nextbutton").click(function(){
        location.href = "/learn/4"
    });

    $("#refresh").click(function(){
        refresh();
    });

    $("#findAED").draggable({revert: "invalid"});
    $("#manualCPR").draggable({revert: "invalid"});
    $("#useAED").draggable({revert: "invalid"});
    $("#call911").draggable({revert: "invalid"});

    $("#findAEDdrop").droppable({
        accept: ".draggable",
        drop: function( event, ui ) {
            if (ui.draggable.attr('id') == "findAED") {
                $( this )
                .addClass( "greenBackground" );
            } else {
                $( this )
                .addClass( "redBackground" );
            }
        }
    });
    $("#manualCPRdrop").droppable({
        accept: ".draggable",
        drop: function( event, ui ) {
            if (ui.draggable.attr('id') == "manualCPR") {
                $( this )
                .addClass( "greenBackground" );
            } else {
                $( this )
                .addClass( "redBackground" );
            }
        }
    });
    $("#useAEDdrop").droppable({
        accept: ".draggable",
        drop: function( event, ui ) {
            if (ui.draggable.attr('id') == "useAED") {
                $( this )
                .addClass( "greenBackground" );
            } else {
                $( this )
                .addClass( "redBackground" );
            }
        }
    });
    $("#call911drop").droppable({
        accept: "#call911",
        accept: ".draggable",
        drop: function( event, ui ) {
            if (ui.draggable.attr('id') == "call911") {
                $( this )
                .addClass( "greenBackground" );
            } else {
                $( this )
                .addClass( "redBackground" );
            }
        }
    });
})

function initializePage() {

    shuffle(displayOrder);

    let tableContent = "<table class='alata tableDim2 smallFont'>";
    let stepDivs = "";
    let step;
    let name = "";

    for (i = 0; i < steps.length; i++) {

        tableContent += "<tr><th>" + (i + 1) + "</th><th id=" + i + "drop></th></tr>";
        step = displayOrder[i];
        stepDivs += "<div class='draggable alata whiteText' id=" + step + ">" + steps[step] + "</div>";

    }

    tableContent += "</table>";
    $("#table").append(tableContent);
    $("#steps").append(stepDivs);
    $(".draggable").draggable({revert: "invalid"});

    for (i = 0; i < steps.length; i++) {

        name = "#" + i + "drop";
        console.log(name);

        $(name).droppable({
            accept: ".draggable",
            drop: function( event, ui ) {

                let itemID = parseInt(ui.draggable.attr('id'));
                if (itemID == parseInt($(this).attr('id'))) {
                    $( this ).addClass( "greenBackground" );
                } else {
                    $( this ).addClass( "redBackground" );
                }

                ui.draggable.remove();
                $( this ).html( "<div class='tableText'>" + steps[itemID] + "</div>" );

            }
        });

    }

}

function refresh() {
    $("#table").html("")
    $("#steps").html("")
    initializePage()
}

function shuffle(array) {

    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;

}