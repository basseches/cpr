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
            let questionDone = result["questionDone"]
            let secondTry = result["secondTry"]

            if (userCorrect === "Yes"){
            	if (secondTry === "No"){
            		$(buttonID).removeClass("lightgreyBackground")
		        	$(buttonID).addClass("greenBackground")
		        	$("#mcResult").text(answerText)
		        	$("#mcResult").addClass("greenText")

		        	$("#dot"+curQuestion["id"]).addClass("greenBackground")
            	} else{
            		$(buttonID).removeClass("lightgreyBackground")
		        	$(buttonID).addClass("greenBackground")
		        	$("#mcResult").text(answerText)
		        	$("#mcResult").removeClass("redText")
		        	$("#mcResult").addClass("yellowText")

		        	$("#dot"+curQuestion["id"]).removeClass("redBackground")
	            	$("#dot"+curQuestion["id"]).addClass("yellowBackground")
            	}

            } else{
            	$(buttonID).removeClass("lightgreyBackground")
            	$(buttonID).addClass("redBackground")
            	$(buttonID).attr("disabled", true)
            	$("#mcResult").text(answerText)
            	$("#mcResult").addClass("redText")

            	$("#dot"+curQuestion["id"]).addClass("redBackground")
            }

            if (questionDone === "Yes"){
            	$("#nextQuestion").removeClass("isDisabled");

            	let choices = curQuestion["categories"];

            	choices.forEach(function (item, index) {
					$("#q" + curQuestion["id"] + "c" + index).attr("disabled", true)
				});

            };       
        },
        error: function(request, status, error){
            console.log("Error");
            console.log(request)
            console.log(status)
            console.log(error)
        }
    });
}

function get_circles(){
	$.ajax({
        type: "GET",
        url: "/get_circles",                
        dataType : "json",
        contentType: "application/json; charset=utf-8",
        success: function(result){
            let circleColors = result["history"]

            circleColors.forEach(function (item, index) {
				let circleNum = index + 1
				$("#dot"+circleNum).addClass(item)
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

function start_question(question){
	$.ajax({
        type: "PUT",
        url: "/start_question",                
        dataType : "json",
        contentType: "application/json; charset=utf-8",
        data : JSON.stringify(question),
        success: function(result){
            let attemptNumber = result["attemptNumber"]
            let firstGuessIndex = result["firstGuess"]
            
            if (attemptNumber >= 2){
            	$("#dot"+curQuestion["id"]).addClass("redBackground")

            	let firstGuessButton = "#q" + curQuestion["id"] + "c" + firstGuessIndex
            	$(firstGuessButton).removeClass("lightgreyBackground")
            	$(firstGuessButton).addClass("redBackground")

            	$(firstGuessButton).attr("disabled", true)
            } else{

            }
        },
        error: function(request, status, error){
            console.log("Error");
            console.log(request)
            console.log(status)
            console.log(error)
        }
    });
};

// -------------------------------------------------------------------------------------

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
};

function startMC(){
	let questionInfo = {
							"questionID": curQuestion["id"]
					   };

	start_question(questionInfo);
};

$(document).ready(function(){
	$("#quiznav").addClass("active");

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

	get_circles()
	startMC()
	getAnswer()
})