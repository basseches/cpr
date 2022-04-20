let click1 = false;
let click2 = false;
let click3 = false;

let steps = ["First, tilt the head back.", "Then, lift their chin.", "Finally, administer a one-second long breath."];

$(document).ready(function(){

    $("#nextbutton").click(function(){
        location.href = "/quiz";
    });

    $("#refresh").click(function(){
        refresh();
    });

    generateImages();

});

function generateImages() {

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
        let box = "<div class='greybox' id='greybox'><div class='alata'>" + steps[0] + "</div></div>";
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
            let text = "<div class='alata'>" + steps[1] + "</div>";
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
            let text = "<div class='alata'>" + steps[2] + "</div>";
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

function refresh() {

    $("#images").empty();
    $("#box").empty();
    click1 = false;
    click2 = false;
    click3 = false;
    generateImages();

}