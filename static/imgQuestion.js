function add_img(answer){
	$.ajax({
        type: "PUT",
        url: "/add_img",                
        dataType : "json",
        contentType: "application/json; charset=utf-8",
        data : JSON.stringify(answer),
        success: function(result){
            let userCorrect = result["userCorrect"]
            let answerText = result["answerText"]

            if (userCorrect === "Yes"){
            	$("#imgResult").text(answerText)
            	$("#imgResult").removeClass("redText")
            	$("#imgResult").addClass("greenText")

                $("#dot"+curQuestion["id"]).addClass("greenBackground")
            }else{
            	$("#imgResult").text(answerText)
            	$("#imgResult").addClass("redText")

                $("#dot"+curQuestion["id"]).addClass("redBackground")
            }

            $("#nextQuestion").removeClass("isDisabled")
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

            console.log(circleColors)

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

function getAnswer(){
	$("#startChestBtn").click(function() {
		userAnswer = {
						"questionID": curQuestion["id"],
						"answer": 30,
						"topic": curQuestion["topic"]
					 }

		add_img(userAnswer)
	});
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

	$("#nextQuestion").addClass("isDisabled")
	$("#reviewMaterialQuiz").attr("href", "/learn/" + curQuestion["topic"])


	get_circles()
	getAnswer()
})