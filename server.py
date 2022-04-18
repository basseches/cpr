import numpy as np
import random
from flask import Flask
from flask import render_template
from flask import Response, request, jsonify
app = Flask(__name__)

# Quiz Data

quizQuestions = {
    "1": {
            "id": "1",
            "questionText": "You’re in a restaurant and see someone fall to the ground suddenly. No one else seems to notice, so you run over and tap them on the shoulder, asking if they’re OK. They don’t respond, and you can see that they’re not breathing. Someone tells you they’re calling 911. What should you do?",
            "textEntry": False,
            "mc": True,
            "categories": ["Administer two breaths", "Try to find an AED", "Begin chest compressions", "Wait for paramedics"],
            "img": "",
            "topic": "prep",
            "correctAnswer": "Try to find an AED",
            "correctText": "You got it! The first thing you want to do is try to find an AED.",
            "incorrectText": "Incorrect."
         },

    "2": {
            "id": "2",
            "questionText": "There’s no AED available. You send someone to find one, but you decide to start chest compressions in the meantime. What is the correct number of chest compressions per set?",
            "textEntry": True,
            "mc": False,
            "categories": [],
            "img": "",
            "topic": "chest",
            "correctAnswer": 30
         },

    "3": {
            "id": "3",
            "questionText": "There’s no AED available. You send someone to find one, but you decide to start chest compressions in the meantime. Click the start button, then tap the chest at the proper rate of chest compressions.",
            "textEntry": False,
            "mc": False,
            "categories": [],
            "img": "",
            "topic": "chest",
            "correctAnswer": 30
         },

    "4": {
            "id": "4",
            "questionText": "You’ve just administered chest compressions. You now move on to give the person rescue breaths. What is the appropriate duration of each rescue breath?",
            "textEntry": False,
            "mc": True,
            "categories": ["1 second", "2 seconds", "4 seconds", "6 seconds"],
            "img": "",
            "topic": "breaths",
            "correctAnswer": "1 second",
            "correctText": "Correct! Each rescue breath should last for approximately 1 second.",
            "incorrectText": "Incorrect."
         }
}

currentID = 1
quizData = {}

topicConversion = {'prep': "Preparatory steps", "chest": "Chest compressions", "breaths": "Breaths"}

# ROUTES

@app.route('/')
def welcome():
   return render_template('home.html')

@app.route('/quiz')
def quizHome():
   return render_template('quiz.html')

@app.route('/quiz/<questionID>')
def quizQuestion(questionID = None):
    global quizQuestions

    question = quizQuestions[questionID]

    if question["mc"]:
        return render_template('mcQuestion.html', question = question)
    elif question["textEntry"]:
        return render_template('textQuestion.html', question = question)
    else:
        return render_template('imgQuestion.html', question = question)

@app.route('/quizend')
def quizEnd():
    return render_template('quizend.html')

# AJAX FUNCTIONS

@app.route('/add_quiz', methods=['POST'])
def add_quiz():
    global currentID
    global quizData

    json_data = request.get_json()
    newName = json_data["name"].strip()

    newQuizTaker = {
                    "id": currentID,
                    "name": newName,
                    "score": 0,
                    "areasImprove": []
                    }

    quizData[str(currentID)] = newQuizTaker

    print(quizData)

    return jsonify(userID = quizData)

#------------------------------------------------
@app.route('/add_mc', methods=['PUT'])
def add_mc():
    global currentID
    global quizData

    json_data = request.get_json()
    questionID = json_data["questionID"]
    answer = json_data["answer"]
    answerID = json_data["answerID"]
    topic = topicConversion[json_data["topic"]]

    print("hi")
    print(quizData)
    quizData[str(currentID)]["q" + questionID] = answer

    correctAnswer = quizQuestions[questionID]["correctAnswer"]

    if correctAnswer == answer:
        userAnswerCorrect = "Yes"
        answerText = quizQuestions[questionID]["correctText"]
        quizData[str(currentID)]["score"] += 2
    else:
        userAnswerCorrect = "No"
        answerText = quizQuestions[questionID]["incorrectText"]
        quizData[str(currentID)]["areasImprove"].append(topic)
        quizData[str(currentID)]["areasImprove"] = list(set(quizData[str(currentID)]["areasImprove"]))

    return jsonify(userCorrect = userAnswerCorrect, answerText = answerText, answerID = answerID, test=quizData)

if __name__ == '__main__':
   app.run(debug = True)