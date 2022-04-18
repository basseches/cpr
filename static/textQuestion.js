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

            if (userCorrect === "Yes"){
            	$("#textResult").text(answerText)
            	$("#textResult").removeClass("redText")
            	$("#textResult").addClass("greenText")
            }else{
            	$("#textResult").text(answerText)
            	$("#textResult").addClass("redText")
            }

            $("#nextQuestion").removeClass("isDisabled")
            $("#userText").attr("disabled", true)
        },
        error: function(request, status, error){
            console.log("Error");
            console.log(request)
            console.log(status)
            console.log(error)
        }
    });
};

function verifyNumber(textEntry){
	let isNotNumber = isNaN(textEntry)

	if (isNotNumber){
		$("#textResult").text("ERROR: Please enter a number")
		$("#textResult").addClass("redText")
		$("#userText").focus()

		return false
	} else{
		return true
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
			}
			
		}

		event.stopPropagation();
	});
};

$(document).ready(function(){
	$("#dot" + curQuestion["id"]).addClass("currentQuestion")
	$("#textResult").text("")

	if (curQuestion["id"] != 4) {
			let nextQuestionNum = parseInt(curQuestion["id"]) + 1
			let nextQues = "/quiz/" + nextQuestionNum
			$("#nextQuestion").attr("href", nextQues)

			$("#nextText").text("Next question")
		} else{
			$("#nextQuestion").attr("href", "/")

			$("#nextText").text("Finish quiz")
	}

	if (curQuestion["id"] != 1) {
			let previousQuestionNum = parseInt(curQuestion["id"]) - 1
			$("#dot" + previousQuestionNum).removeClass("currentQuestion")
		} else{
	}

	$("#nextQuestion").addClass("isDisabled")
	$("#userText").focus()
	getAnswer()
});