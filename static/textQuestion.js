function add_text(answer){
	$.ajax({
        type: "PUT",
        url: "/add_text",                
        dataType : "json",
        contentType: "application/json; charset=utf-8",
        data : JSON.stringify(answer),
        success: function(result){
            let userCorrect = result["userCorrect"]
            let answerText = result["answerText"]
            let questionDone = result["questionDone"]
            let secondTry = result["secondTry"]

            if (userCorrect === "Yes"){
            	if (secondTry === "No"){
            		$("#textResult").text(answerText)
	            	$("#textResult").removeClass("redText")
	            	$("#textResult").removeClass("yellowText")
	            	$("#textResult").addClass("greenText")

	            	$("#dot"+curQuestion["id"]).addClass("greenBackground")

            	} else{
            		$("#textResult").text(answerText)
	            	$("#textResult").removeClass("redText")
	            	$("#textResult").removeClass("greenText")
	            	$("#textResult").addClass("yellowText")

	            	$("#dot"+curQuestion["id"]).removeClass("redBackground")
	            	$("#dot"+curQuestion["id"]).addClass("yellowBackground")
            	}
            	
            }else{
            	$("#textResult").text(answerText)
            	$("#textResult").addClass("redText")
            	$("#dot"+curQuestion["id"]).addClass("redBackground")
            }

            if (questionDone === "Yes"){
            	$("#nextQuestion").removeClass("isDisabled")
            	$("#userText").attr("disabled", true)
            	$("#textSubmitBtn").addClass("isDisabled")
            } else{
            	$("#userText").focus()
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


function start_text(question){
	$.ajax({
        type: "PUT",
        url: "/start_text",                
        dataType : "json",
        contentType: "application/json; charset=utf-8",
        data : JSON.stringify(question),
        success: function(result){
            let attemptNumber = result["attemptNumber"]
            
            if (attemptNumber >= 2){
            	$("#dot"+curQuestion["id"]).addClass("redBackground")
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

// ----------------------------------------------

function verifyNumber(textEntry){
	let isNotNumber = isNaN(textEntry)

	if (isNotNumber){
		$("#textResult").text("ERROR: Please enter a number")
		$("#textResult").addClass("redText")
		$("#userText").focus()

		return false;
	} else{
		return true;
	}
}

function getAnswer(){
	$("#userText").keydown(function(event){
		let keycode = (event.keyCode ? event.keyCode : event.which);
		let userAnswer = {
							"questionID": curQuestion["id"],
							"answer": userText.value,
							"topic": curQuestion["topic"]
					 	 };

		if(keycode == '13'){
			if (verifyNumber(userText.value)){
				add_text(userAnswer)	
			};
			
		};

		event.stopPropagation();
	});

	$("#textSubmitBtn").click(function () {
		let userAnswer = {
							"questionID": curQuestion["id"],
							"answer": userText.value,
							"topic": curQuestion["topic"]
					 	 };

        if (verifyNumber(userText.value)){
			add_text(userAnswer)	
		};
    });
};

function startText(){
	let questionInfo = {
							"questionID": curQuestion["id"]
					   };

	start_text(questionInfo)
}

$(document).ready(function(){
	$("#quiznav").addClass("active");

	$("#dot" + curQuestion["id"]).addClass("currentQuestion")
	$("#textResult").text("")

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

	$("#nextQuestion").addClass("isDisabled")
	$("#reviewMaterialQuiz").attr("href", "/learn/" + curQuestion["topic"])
	$("#userText").focus()
	get_circles()
	startText()
	getAnswer()
});