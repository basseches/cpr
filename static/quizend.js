function get_results(){
	$.ajax({
        type: "GET",
        url: "/get_results",                
        dataType : "json",
        contentType: "application/json; charset=utf-8",
        success: function(result){
            let quizScore = result["quizScore"]
            let areaIDs = result["areas"]
            let areaNames = result["areaNames"]

            $("#userScore").text(quizScore + "/8")

            if (quizScore >= 6){
            	$("#resultsIntro").text("Congrats!")
            } else{
            	if (quizScore >= 3){
            		$("#resultsIntro").text("Nice try!")
            	} else {
            		$("#resultsIntro").text("Yikes.")
            	}
            }


            areaIDs.forEach(function (item, index) {
            	let areaName = areaNames[index]

            	let areaRow = $("<div>")
            	$(areaRow).addClass("row")

            	let areaNameCol = $("<div>")
            	$(areaNameCol).addClass("col-md-6")
            	$(areaNameCol).addClass("alata")
            	$(areaNameCol).addClass("mediumText")
            	$(areaNameCol).text(areaName)

            	let areaLearnCol = $("<div>")
            	$(areaLearnCol).addClass("col-md-6")

            	let areaLink = $("<a>")
            	$(areaLink).attr("href", "/learn/" + item)

            	let areaButton = $("<button>")
            	$(areaButton).text("Review this material")
            	$(areaButton).addClass("alata")
            	$(areaButton).addClass("greyBackground")
            	$(areaButton).addClass("whiteText")
            	$(areaButton).addClass("quizEndReview")

            	$(areaLink).append(areaButton)
            	$(areaLearnCol).append(areaLink)
            	$(areaRow).append(areaNameCol)
            	$(areaRow).append(areaLearnCol)
            	$("#areasOfImprovement").append(areaRow)
            	$("#areasOfImprovement").append("<br>")
			});
        },
        error: function(request, status, error){
            console.log("Error");
            console.log(request)
            console.log(status)
            console.log(error)
        }
    });
};

function top_scorers(){
	$.ajax({
        type: "GET",
        url: "/top_scorers",                
        dataType : "json",
        contentType: "application/json; charset=utf-8",
        success: function(result){
            let names = result["names"]
            let scores = result["scores"]

            names.forEach(function (item, index) {
            	let userScore = scores[index]

            	let newRow = $("<tr>")
            	let entry1 = $("<td>")
            	$(entry1).text(item)
            	let entry2 = $("<td>")
            	$(entry2).text(userScore + "/8")

            	$(newRow).append(entry1)
            	$(newRow).append(entry2)
            	$("#scoreTable").append(newRow)
			});

        },
        error: function(request, status, error){
            console.log("Error");
            console.log(request)
            console.log(status)
            console.log(error)
        }
    });
};

function getResults(){
	get_results()
	top_scorers()
}

$(document).ready(function(){
	getResults()
});