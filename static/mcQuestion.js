$(document).ready(function(){

    $("#quiznav").addClass("active");

});

function add_mc(answer){
	$.ajax({
        type: "PUT",
        url: "/add_mc",                
        dataType : "json",
        contentType: "application/json; charset=utf-8",
        data : JSON.stringify(answer),
        success: function(result){
            let userCorrect = result["userCorrect"]
            let answerText = result["answerText"]
            let choiceID = result["answerID"]
            let buttonID = "#q" + curQuestion["id"] + "c" + choiceID

            if (userCorrect === "Yes"){
            	$(buttonID).removeClass("lightgreyBackground")
            	$(buttonID).addClass("greenBackground")
            	$("#mcResult").text(answerText)
            	$("#mcResult").addClass("greenText")
            }else{
            	$(buttonID).removeClass("lightgreyBackground")
            	$(buttonID).addClass("redBackground")
            	$("#mcResult").text(answerText)
            	$("#mcResult").addClass("redText")
            }


            $("#nextQuestion").removeClass("isDisabled")

            let choices = curQuestion["categories"]

			choices.forEach(function (item, index) {
				$("#q" + curQuestion["id"] + "c" + index).attr("disabled", true)
			});
        },
        error: function(request, status, error){
            console.log("Error");
            console.log(request)
            console.log(status)
            console.log(error)
        }
    });
}

function getAnswer(){
	let choices = curQuestion["categories"]

	choices.forEach(function (item, index) {
		$("#q" + curQuestion["id"] + "c" + index).click(function() {
			userAnswer = {
							"questionID": curQuestion["id"],
							"answer": item,
							"answerID": index,
							"topic": curQuestion["topic"]
						 }

			add_mc(userAnswer)
		});
	});
}

function displayChoices(){
	let choices = curQuestion["categories"]

	choices.forEach(function (item, index) {
		let choiceDiv = $("<div>")
		$(choiceDiv).addClass("col-md-6")
		$(choiceDiv).addClass("mcPadding")

		let choiceButton = $("<button>")
		$(choiceButton).text(item)
		$(choiceButton).attr("id", "q" + curQuestion["id"] + "c" + index)
		$(choiceButton).addClass("mcChoice")
		$(choiceButton).addClass("lightgreyBackground")
		$(choiceButton).addClass("smallPadding")
		
		$(choiceDiv).append(choiceButton)
		$("#mcChoices").append(choiceDiv)
	});
}

$(document).ready(function(){
	$("#dot" + curQuestion["id"]).addClass("currentQuestion")

	if (curQuestion["id"] != 4) {
			let nextQuestionNum = parseInt(curQuestion["id"]) + 1
			let nextQues = "/quiz/" + nextQuestionNum
			$("#nextQuestion").attr("href", nextQues)

			$("#nextText").text("Next question")
		} else{
			$("#nextQuestion").attr("href", "/quizend")

			$("#nextText").text("Finish quiz")
	}

	if (curQuestion["id"] != 1) {
			let previousQuestionNum = parseInt(curQuestion["id"]) - 1
			$("#dot" + previousQuestionNum).removeClass("currentQuestion")
		} else{
	}

	displayChoices()
	$("#nextQuestion").addClass("isDisabled")
	$("#reviewMaterialQuiz").attr("href", "/learn/" + curQuestion["topic"])

	getAnswer()
})