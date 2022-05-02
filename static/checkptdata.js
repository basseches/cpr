let htmlbody = [
    '<div class="row antiPadding"><div class="col-md-4" id="table"></div><div class="col-md-8 miniPadding" id="steps"></div></div><div class="padding"></div>',
    '<div class="padding"></div><div id="activity"></div><div class="padding"></div>',
    '</div><div id="images"></div><div id="box"></div><div class="padding"></div><div class="padding"></div><div class="padding"></div><div class="padding"></div>'
];

// PREPARATORY STEPS CHECKPOINT VARIABLES 

let prepSteps = [
    "find an AED",
    "call 911",
    "use AED",
    "begin manual CPR"
]

let displayOrder = [3, 2, 0, 1];


// CHEST COMPRESSIONS CHECKPOINT VARIABLES

let started = false
let compressionCt = 0
let setCt = 0
let pace = ""

let timeoutIDs = [];

// BREATHS CHECKPOINT VARIABLES

let click1 = false;
let click2 = false;
let click3 = false;

let breathSteps = ["First, tilt the head back.", "Then, lift their chin.", "Finally, administer a one-second long breath."];


// array of function pointers (will initialize/refresh the right page given an index)
let typeInit = [generatePrep, generateChest, generateBreaths];
let refreshPage = [refreshPrep, refreshChest, refreshBreaths];

$(document).ready(function() {
    markCheckpoint();
    generateLayout();

    // initialize the page
    $("#htmlbody").append(htmlbody[content.id]);
    typeInit[content.id]();

    $("#nextbutton").click(function(){
        location.href = content.next;
    });

    $("#backbutton").click(function(){
        location.href = content.back;
    });

    $("#refresh").click(function(){
        refreshPage[content.id]();
    });

    let navid = "#" + content.learnid;

    $(navid).addClass("active");

});

function markCheckpoint(){
    console.log(user)
    user.checkpoint[content.id] = 1
} 

function generateLayout() {

    let cols = '<div class="col-md-6"></div><div class="col-md-2" id="backcol"></div><div class="col-md-2" id="refcol"></div><div class="col-md-2" id="nextcol"></div>';
    $("#buttondiv").append(cols);
    let backbutton = '<button class="alata greyBackground whiteText checkptbutton smallPadding mediumText" id="backbutton">Back</button>';
    $("#backcol").append(backbutton);
    let refbutton = '<button class="alata greyBackground whiteText checkptbutton smallPadding mediumText" id="refresh">Try again</button>';
    $("#refcol").append(refbutton);
    let nextbutton = '<button class="alata greyBackground whiteText checkptbutton smallPadding mediumText" id="nextbutton">Next</button>';
    $("#nextcol").append(nextbutton);

}


// PREPARATORY STEPS CHECKPOINT FUNCTIONS

function generatePrep() {

    shuffle(displayOrder);

    let tableContent = "<table class='alata tableDim2 smallFont nomargin'>";
    let stepDivs = "";
    let step;
    let name = "";

    for (i = 0; i < prepSteps.length; i++) {

        tableContent += "<tr><th>" + (i + 1) + "</th><th id=" + i + "drop></th></tr>";
        step = displayOrder[i];
        stepDivs += "<div class='draggable alata whiteText' id=" + step + ">" + prepSteps[step] + "</div>";

    }

    tableContent += "</table>";
    $("#table").append(tableContent);
    $("#steps").append(stepDivs);
    $(".draggable").draggable({revert: "invalid"});

    for (i = 0; i < prepSteps.length; i++) {

        name = "#" + i + "drop";

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
                $( this ).html( "<div class='tableText'>" + prepSteps[itemID] + "</div>" );

            }
        });

    }

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

}

function refreshPrep() {
    $("#table").html("")
    $("#steps").html("")
    generatePrep()
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


// CHEST COMPRESSIONS CHECKPOINT FUNCTIONS

function generateChest() {

    let row = '<div class="row" id="startrow"></div>';
    let cols = '<div class="col-md-2"></div><div class="col-md-4" id="start"></div><div class="col-md-6" id="chestimg"></div>';
    $("#activity").append(row);
    $("#startrow").append(cols);

    let buttonspan = '<span class="startButtonSpacing" id="buttonSpan"><button class="bebasNeue lightgreyBackground startButton padding" id="startChestBtn">Start</button></span>';
    $("#start").append(buttonspan);

    let image = '<img src="/static/chest.png" class="imageResize" alt="Picture of a chest"></div>';
    $("#chestimg").append(image);

    let audio = '<audio controls><source src="/static/stayinalive.mp3" type="audio/mpeg">Your browser does not support the audio element.</audio>';
    $("#audio").append(audio);

    $("#startChestBtn").click(function(){
        countdown();
        // logTime();
    });
    var prevTime;
    var difference;
    $("#chestimg").click(function(){
        if (started) {
            compressionCt++;
            $("#compressions").html(compressionCt);
            if (compressionCt % 30 == 0) {
                setCt++;
                $("#sets").html(setCt);
            }
            $("#pace").html(pace);
            var date = new Date();
            if (compressionCt >= 2) {
                currentTime = date.getTime()
                difference = currentTime - prevTime;
                console.log(difference);
                prevTime = currentTime
                if(difference >= 500 && difference <= 700) { 
                    pace = "great pace!"
                    $("#pace").html(pace)
                }
                else if (difference > 700){
                    pace = "speed up!"
                    $("#pace").html(pace)
                }
                else{
                    pace = "slow down!"
                    $("#pace").html(pace)
                }
            }
            else
                prevTime = date.getTime();
        }
    });

}

function countdown() {
    $("#buttonSpan").html("<div class='padding'><div class='chestNums'>Get ready!</div></div>");

    let id = setTimeout(function(){
        $("#buttonSpan").html("<div class='margin headerFont'>3</div>");
    }, 1000);

    timeoutIDs.unshift(id);

    id = setTimeout(function(){
        $("#buttonSpan").html("<div class='margin headerFont'>2</div>");
    }, 2000);

    timeoutIDs.unshift(id);

    id = setTimeout(function(){
        $("#buttonSpan").html("<div class='margin headerFont'>1</div>");
    }, 3000);

    timeoutIDs.unshift(id);

    id = setTimeout(function(){
        $("#buttonSpan").html("<div class='row margin subheaderFont'>Compressions:</div>"+
                              "<div class='row margin chestNums' id='compressions'>" + compressionCt +"</div>"+
                              "<div class='row margin subheaderFont'>Sets:</div>"+
                              "<div class='row margin chestNums' id='sets'>" + setCt + "</div>"+
                              "<div class='row margin subheaderFont'>Pace:</div>"+
                              "<div class='row margin chestNums' id='pace'>" + pace +"</div>");
        started = true
    }, 4000);

    timeoutIDs.unshift(id);

}

function refreshChest() {

    $("#activity").empty();
    $("#audio").empty();

    while (typeof (i = timeoutIDs.shift()) !== 'undefined') {
        clearTimeout(i);
    }

    compressionCt = 0;
    setCt = 0;

    generateChest();

}


// BREATHS CHECKPOINT FUNCTIONS

function generateBreaths() {

    console.log(user)
    user['checkpoint'][content.id] = 1

    let curr = '<div class="absolute" id="head"><img src="/static/head.png" class="imageResize"></div>';
    $("#images").append(curr);

    for (i = 1; i < 4; i++) {
        curr = '<div id="circ' + i + '"><img src="/static/greencircle.png" class="circle' + i + '" id="head"></div>';
        $("#images").append(curr);
    }

    $("#circ1").click(function(){
        if (click1) {return;}
        click1 = true;
        let newCirc = "<img src='/static/lightgreencircle.png' class='circle1 defCursor'>";
        $("#circ1").html(newCirc);
        let box = "<div class='greybox' id='greybox'><div class='alata'>" + breathSteps[0] + "</div></div>";
        $("#box").append(box);
        let tilt = '<img src="/static/tilted.png" class="imageResize">';
        $("#head").html(tilt);
    });

    $("#circ2").click(function(){
        if (click2) {return;}
        else if (click1) {
            click2 = true;
            let newCirc = "<img src='/static/lightgreencircle.png' class='circle2 defCursor'>";
            $("#circ2").html(newCirc);
            let text = "<div class='alata'>" + breathSteps[1] + "</div>";
            $("#greybox").append(text);
        } else {
            let newCirc = "<img src='/static/redcircle.png' class='circle2'>";
            $("#circ2").html(newCirc);
            setTimeout(function(){
                newCirc = "<div id='circ2'><img src='/static/greencircle.png' class='circle2'></div>";
                $("#circ2").html(newCirc);
            }, 500);
        }
    });

    $("#circ3").click(function(){
        if (click3) {return;}
        if (click1 && click2) {
            click3 = true;
            let newCirc = "<img src='/static/lightgreencircle.png' class='circle3 defCursor'>";
            $("#circ3").html(newCirc);
            let text = "<div class='alata'>" + breathSteps[2] + "</div>";
            $("#greybox").append(text);
        } else {
            let newCirc = "<img src='/static/redcircle.png' class='circle3'>";
            $("#circ3").html(newCirc);
            setTimeout(function(){
                newCirc = "<div id='circ2'><img src='/static/greencircle.png' class='circle3'></div>";
                $("#circ3").html(newCirc);
            }, 500);
        }
    });
}

function refreshBreaths() {

    $("#images").empty();
    $("#box").empty();
    click1 = false;
    click2 = false;
    click3 = false;
    generateBreaths();

}