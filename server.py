import numpy as np
import random
from flask import Flask
from flask import render_template
from flask import Response, request, jsonify
app = Flask(__name__)

learnMaterial = {
    "1": {
        "id" : "1",
        "checkpoint": False,
        "title" : "What is CPR?",
        "explanatoryText" : ["Cardiopulmonary resuscitation (CPR) is a multi-step procedure performed on a patient whose heart stops beating.", "According to the American Heart Association, immediate CPR can triple chances of survival after cardiac arrest."],
        "images": ["/static/cpr-header.png"],
        "nextid" : "/learn/2"
    },
    "2": {
        "id": "2",
        "checkpoint": False,
        "title" : "Should you perform CPR?",
        "explanatoryText":[""],
        "images": ["/static/setting1.png", "/static/setting2.png"],
        "nextid" : "/learn/3"
    },
    "3": {
        "id" : "3",
        "checkpoint": True,
        "title" : "Preparatory steps",
        "explanatoryText":["Step 1: Try to find an AED (automated external defibrillator).", "Step 2: Call 911. Use an AED if accessible.", "Otherwise, begin manual CPR."],
        "images": ["/static/prep1.png", "/static/perp2.png"],
        "nextid" : "/learn/4",
        "checkpointlink" : "/prep"

    },
    "4": {
        "id": "4",
        "checkpoint": True,
        "title": "Chest compressions",
        "explanatoryText" : ["Center your hands on the chest.", "Rhythm deaf? Just use the beat of Stayin' Alive by the Bee Gees.", "Allow the chest to return to a normal position after each compression."],
        "images" : ["/static/compressions.gif"],
        "nextid" : "/learn/5",
        "checkpointlink" : "/chest"
    },
    "5": {
        "id": "5",
        "checkpoint": True,
        "title": "Breaths",
         "explanatoryText": ["Open the airways.", "Tilt their head back.", "Lift their chin.", "Administer 2 rescue breaths.", "Duration = approx 1 second.", "The chest should rise."],
        "images": ["/static/breath1.gif", "/static/breath2.gif", "/static/breath3.gif"],
        "nextid" : "/quiz",
        "checkpointlink" : "/breaths"
    }
}

quizQuestions = {
    "1": {
            "id": "1",
            "questionText": "You’re in a restaurant and see someone fall to the ground suddenly. No one else seems to notice, so you run over and tap them on the shoulder, asking if they’re OK. They don’t respond, and you can see that they’re not breathing. Someone tells you they’re calling 911. What should you do?",
            "textEntry": False,
            "mc": True,
            "categories": ["Administer two breaths", "Try to find an AED", "Begin chest compressions", "Wait for paramedics"],
            "img": "",
            "topic": "3",
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
            "topic": "4",
            "correctAnswer": "30",
            "correctText": "Yep! There are 30 chest compression in each set.",
            "incorrectText": "Incorrect."
         },

    "3": {
            "id": "3",
            "questionText": "There’s no AED available. You send someone to find one, but you decide to start chest compressions in the meantime. Click the start button, then tap the chest at the proper rate of chest compressions.",
            "textEntry": False,
            "mc": False,
            "categories": [],
            "img": "https://cdn2.iconfinder.com/data/icons/anatomy-malibu-vol-1/128/Chest-512.png",
            "topic": "4",
            "correctAnswer": 30,
            "correctText": "Way to go! You kept the perfect rate throughout the set.",
            "incorrectText": "Incorrect." 
         },

    "4": {
            "id": "4",
            "questionText": "You’ve just administered chest compressions. You now move on to give the person rescue breaths. What is the appropriate duration of each rescue breath?",
            "textEntry": False,
            "mc": True,
            "categories": ["1 second", "2 seconds", "4 seconds", "6 seconds"],
            "img": "",
            "topic": "5",
            "correctAnswer": "1 second",
            "correctText": "Correct! Each rescue breath should last for approximately 1 second.",
            "incorrectText": "Incorrect."
         }
}

currentID = 1
quizData = {}

topicConversionDic = {"5": "Breaths", "4": "Chest compressions", "3": "Preparatory steps"}

# ROUTES

@app.route('/')
def homepage():
   return render_template('home.html') 

@app.route('/tutorial')
def tutorial():
    return render_template('tutorial.html')

@app.route('/prep')
def prep():
    return render_template('prep.html')

@app.route('/chest')
def chest():
    return render_template('chest.html')

@app.route('/breaths')
def breaths():
    return render_template('breaths.html')

@app.route('/learn/<id>')
def learn(id = None):
    
    content = learnMaterial[id]
    if content == None:
        return render_template('notfound.html')

    return render_template('learn.html', content = content)

@app.route('/checkpoint/<topic>')
def checkpt(topic = None):

    if topic == "prep":
        return render_template('prep.html')
    elif topic == "chest":
        return render_template('chest.html')
    elif topic == "breaths":
        return render_template('breaths.html')

    return render_template('notfound.html')

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

    return jsonify(userID = currentID)

#------------------------------------------------

@app.route('/add_mc', methods=['PUT'])
def add_mc():
    global currentID
    global quizData

    json_data = request.get_json()
    questionID = json_data["questionID"]
    answer = json_data["answer"]
    answerID = json_data["answerID"]
    topic = json_data["topic"]

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

    return jsonify(userCorrect = userAnswerCorrect, answerText = answerText, answerID = answerID)

#----------------------------------------------------------

@app.route('/add_text', methods=['PUT'])
def add_text():
    global currentID
    global quizData

    json_data = request.get_json()
    questionID = json_data["questionID"]
    answer = json_data["answer"]
    topic = json_data["topic"]

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

    return jsonify(userCorrect = userAnswerCorrect, answerText = answerText)

#-----------------------------------------------------------------

@app.route('/add_img', methods=['PUT'])
def add_img():
    global currentID
    global quizData

    json_data = request.get_json()
    questionID = json_data["questionID"]
    answer = json_data["answer"]
    topic = json_data["topic"]

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

    return jsonify(userCorrect = userAnswerCorrect, answerText = answerText)

#--------------------------------------------------------------------

@app.route('/get_results', methods=['GET'])
def get_results():
    global currentID
    global quizData

    currentUser = quizData[str(currentID)]

    userScore = currentUser["score"]
    userAreasToImprove = currentUser["areasImprove"]

    areasFull = []

    for area in userAreasToImprove:
        areasFull.append(topicConversionDic[area])


    currentID += 1

    return jsonify(quizScore = userScore, areas = userAreasToImprove, areaNames = areasFull)

#----------------------------------------------------------------------------

@app.route('/top_scorers', methods=['GET'])
def top_scorers():
    global quizData

    scores = []

    for elem in quizData:
        curUser = quizData[elem]
        scores.append((curUser["name"], curUser["score"]))

    withNames = list(filter(lambda x: len(x[0]) > 0, scores))
    withNames.sort(key = lambda x: x[1], reverse = True)

    if len(withNames) <= 5:
        result = withNames
    else:
        result = withNames[:5]

    names = [user[0] for user in result]
    scores = [user[1] for user in result]

    return jsonify(names = names, scores = scores)

#----------------------------------------------------------------------------
#SEARCH FUNCTIONALITY

@app.route('/search/<searched>', methods=['GET', 'POST'])
def search(searched=None):

    titles = []
    content = []
    num = 0

    str = searched.lower()
    length = len(str)

    for item in learnMaterial.values():
        if str in (item["title"]).lower():
            num = num + 1
        else:
            for text in item["explanatoryText"]:
                if str in text.lower():
                    num = num + 1

    for item in learnMaterial.values():
        start = 0
        idx = 0
        result = ""
        text = item["title"]
        while (idx <= len(text)):
            idx = (text.lower()).find(searched.lower(), idx)
            if (result == ""):
                if (idx == -1):
                    break
                result += "<a href='/learn/" + item["id"] + "'>"
            if (idx != -1):
                result += text[start:idx] + "<mark>" + text[idx:(idx+length)] + "</mark>"
                idx += length
                start = idx
            else:
                result += text[start:len(text)] + "</a><hr>"
                titles.append(result)
                break
        result = ""
        for word in item["explanatoryText"]:
            start = 0
            idx = 0
            text = word
            while (idx <= len(text)):
                idx = (text.lower()).find(searched.lower(), idx)
                if (result == ""):
                    if (idx == -1):
                        break
                    result += "<a href='/learn/" + item["id"] + "'><i>" + item["title"] + ",</i><br>..."
                if (idx != -1):
                    result += text[start:idx] + "<mark>" + text[idx:(idx+length)] + "</mark>"
                    idx += length
                    start = idx
                else:
                    result += text[start:len(text)] + ", "
                    break
        if (result != ""):
            result = result[0:len(result)-2]
            result += "...</a><hr>"
            content.append(result)
    return render_template('search.html', num=num, learnMaterial=learnMaterial, titles=titles, content=content, searched=searched)


if __name__ == '__main__':
   app.run(debug = True)