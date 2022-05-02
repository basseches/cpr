import numpy as np
import random
from flask import Flask
from flask import render_template
from flask import Response, request, jsonify, redirect, url_for
app = Flask(__name__)

learnMaterial = {
    "1": {
        "id" : "1",
        "checkpoint": 0,
        "title" : "What is CPR?",
        "explanatoryText" : ["Cardiopulmonary resuscitation (CPR) is a multi-step procedure performed on a patient whose heart stops beating.", "According to the American Heart Association, immediate CPR can triple chances of survival after cardiac arrest."],
        "template": "step1.html", 
        "images": ["/static/cpr-header.png"],
        "imageSizes": ["300px"],
        "nextid" : "/learn/2",
        "backid" : "/",
    },
    "2": {
        "id": "2",
        "checkpoint": 0,
        "title" : "Should you perform CPR?",
        "explanatoryText":[""],
        "template": "step2.html",
        "images": ["/static/setting1.png", "/static/setting2.png"],
        "imageSizes": ["500px", "300px"],
        "nextid" : "/learn/3",
        "backid" : "/learn/1",
    },
    "3": {
        "id" : "3",
        "checkpoint": 1,
        "title" : "Preparatory steps",
        "explanatoryText":["Step 1: Try to find an AED (automated external defibrillator).", "Step 2: Call 911. Use an AED if accessible.", "Otherwise, begin manual CPR."],
        "template":"step3.html",
        "images": ["/static/prep1.png", "/static/perp2.png"],
        "imageSizes": ["300px", "200px"],
        "nextid" : "/learn/4",
        "backid" : "/learn/2",
        "checkpointlink" : "/prep"

    },
    "4": {
        "id": "4",
        "checkpoint": 1,
        "title": "Chest compressions",
        "explanatoryText" : ["Center your hands on the chest.", "Allow the chest to return to a normal position after each compression.", "Rhythm deaf? Just use the beat of Stayin' Alive by the Bee Gees."],
        "template":"step4.html",
        "images" : ["/static/compressionguide.png", "/static/compressions.gif"],
        "imageSizes": ["150px", "150px"],
        "nextid" : "/learn/5",
        "backid" : "/learn/3",
        "checkpointlink" : "/chest"
    },
    "5": {
        "id": "5",
        "checkpoint": 1,
        "title": "Breaths",
        "explanatoryText": ["Step 1: Open the airways.", "Step 2: Tilt their head back.", "Step 3: Lift their chin.", "Step 4: Administer 2 rescue breaths.", "The breaths should be approx 1 second in length.", "The chest should rise."],
        "template" : "step5.html",
        "images": ["/static/breath1.gif", "/static/breath2.gif", "/static/breath3.gif"],
        "imageSizes": ["200px", "200px", "200px"],
        "nextid" : "/quiz",
        "backid" : "/learn/4",
        "checkpointlink" : "/breaths"
    }
}

checkpoints = {

    "prep": {
        "id": 0,
        "title": "Preparatory steps",
        "text": "Order the following items by precedence (drag and drop):",
        "learnid": 3,
        "next": "/learn/4",
        "back": "/learn/3"
    },

    "chest": {
        "id": 1,
        "title": "Chest compressions",
        "text": "Click the audio button, then click the start button to practice chest compressions to the beat of \"Stayin' Alive.\"",
        "learnid": 4,
        "next": "/learn/5",
        "back": "/learn/4"
    },

    "breaths": {
        "id": 2,
        "title": "Breaths",
        "text": "Click the dots in the right order to perform a rescue breath.",
        "learnid": 5,
        "next": "/quiz",
        "back": "/learn/5"
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

currentID = 0
userData = {}
topicConversionDic = {"5": "Breaths", "4": "Chest compressions", "3": "Preparatory steps"}

# ROUTES

@app.route('/')
def homepage():
   return render_template('home.html') 

@app.route('/tutorial')
def tutorial():
    return render_template('tutorial.html')

@app.route('/learn/<id>')
def learn(id = None):

    content = learnMaterial[id]
    if content == None:
        return render_template('notfound.html')
    user = userData[str(currentID)]

    return render_template('learn.html', content=content, user=user)

@app.route('/checkpoint/<topic>')
def checkpt(topic = None):

    user = userData[str(currentID)]
    user['checkpoint'][checkpoints[topic]['id']] = 1
    content = checkpoints[topic]
    if content == None:
        return render_template('notfound.html')

    return render_template('checkpoint.html', content=content, user=user)

@app.route('/quiz')
def quizHome():
   return render_template('quiz.html')

@app.route('/quiz/<questionID>')
def quizQuestion(questionID = None):
    global quizQuestions

    curUser = userData[str(currentID)]
    curQuizAttempt = curUser["quizAttempt"]
    quizName = "quiz" + str(curQuizAttempt)

    if (int(questionID) == 4) and (len(curUser[quizName]["history"]) == 2):
        print("inside if")
        numGood = curUser[quizName]["q3"]["numGood"]
        if numGood >= 25:
            userAnswerCorrect = "Yes"
            answerText = quizQuestions[questionID]["correctText"]
            userData[str(currentID)][quizName]["score"] += 2
            userData[str(currentID)][quizName]["history"].append("greenBackground")
        else:
            userAnswerCorrect = "No"
            answerText = quizQuestions[questionID]["incorrectText"]
            userData[str(currentID)][quizName]["areasImprove"].append("4")
            userData[str(currentID)][quizName]["areasImprove"] = list(set(userData[str(currentID)][quizName]["areasImprove"]))
            userData[str(currentID)][quizName]["history"].append("redBackground")
        
    
    curUser["takingQuiz"] = questionID
    question = quizQuestions[questionID]

    key = "q" + questionID
    if key in curUser[quizName]:
        redir = ""
        if int(questionID) != 4:
            nextID = int(questionID) + 1
            return redirect(url_for("quizQuestion",questionID=nextID))
        else:
            return redirect(url_for("quizEnd"))

    if question["mc"]:
        return render_template('mcQuestion.html', question = question)
    elif question["textEntry"]:
        return render_template('textQuestion.html', question = question)
    else:
        return render_template('imgQuestion.html', question = question)

@app.route('/quizend')
def quizEnd():
    userData[str(currentID)]["takingQuiz"] = -1
    return render_template('quizend.html')

# AJAX FUNCTIONS

@app.route('/add_user', methods=['POST'])
def add_user():
    global currentID
    global userData

    currentID += 1

    json_data = request.get_json()
    newName = json_data["name"].strip()

    newUser = {
                "id": currentID,
                "name": newName,
                "takingQuiz": -1,
                "quizAttempt": 1,
                "bestScore": -1, 
                "checkpoint": [0, 0, 0],
              }

    userData[str(currentID)] = newUser
    return jsonify(userID = currentID)

@app.route('/add_quiz', methods=['PUT'])
def add_quiz():

    curUser = userData[str(currentID)]
    curUser["takingQuiz"] = 0
    curQuizAttempt = curUser["quizAttempt"]
    quizName = "quiz" + str(curQuizAttempt)

    newQuizAttempt = {
                    "score": 0,
                    "areasImprove": [],
                    "history": []
                    }

    curUser[quizName] = newQuizAttempt

    return jsonify(quizID = curQuizAttempt)

#------------------------------------------------

@app.route('/add_mc', methods=['PUT'])
def add_mc():

    global userData

    curUser = userData[str(currentID)]
    curQuizAttempt = curUser["quizAttempt"]
    quizName = "quiz" + str(curQuizAttempt)

    json_data = request.get_json()
    questionID = json_data["questionID"]
    answer = json_data["answer"]
    answerID = json_data["answerID"]
    topic = json_data["topic"]

    curUser[quizName]["q" + questionID] = answer

    correctAnswer = quizQuestions[questionID]["correctAnswer"]

    if correctAnswer == answer:
        userAnswerCorrect = "Yes"
        answerText = quizQuestions[questionID]["correctText"]
        curUser[quizName]["score"] += 2
        curUser[quizName]["history"].append("greenBackground")
    else:
        userAnswerCorrect = "No"
        answerText = quizQuestions[questionID]["incorrectText"]
        curUser[quizName]["areasImprove"].append(topic)
        curUser[quizName]["areasImprove"] = list(set(userData[str(currentID)][quizName]["areasImprove"]))
        curUser[quizName]["history"].append("redBackground")

    return jsonify(userCorrect = userAnswerCorrect, answerText = answerText, answerID = answerID)

#----------------------------------------------------------

@app.route('/add_text', methods=['PUT'])
def add_text():

    global userData

    curUser = userData[str(currentID)]
    curQuizAttempt = curUser["quizAttempt"]
    quizName = "quiz" + str(curQuizAttempt)

    json_data = request.get_json()
    questionID = json_data["questionID"]
    answer = json_data["answer"]
    topic = json_data["topic"]

    curUser[quizName]["q" + questionID] = answer

    correctAnswer = quizQuestions[questionID]["correctAnswer"]

    if correctAnswer == answer:
        userAnswerCorrect = "Yes"
        answerText = quizQuestions[questionID]["correctText"]
        curUser[quizName]["score"] += 2
        curUser[quizName]["history"].append("greenBackground")
    else:
        userAnswerCorrect = "No"
        answerText = quizQuestions[questionID]["incorrectText"]
        curUser[quizName]["areasImprove"].append(topic)
        curUser[quizName]["areasImprove"] = list(set(userData[str(currentID)][quizName]["areasImprove"]))
        curUser[quizName]["history"].append("redBackground")

    return jsonify(userCorrect = userAnswerCorrect, answerText = answerText)

#--------------------------------------------------------------------

@app.route('/get_results', methods=['GET'])
def get_results():
    global currentID
    global userData

    curQuizAttempt = userData[str(currentID)]["quizAttempt"]
    quizName = "quiz" + str(curQuizAttempt)

    currentUser = userData[str(currentID)][quizName]

    userScore = currentUser["score"]
    userAreasToImprove = currentUser["areasImprove"]

    areasFull = []

    for area in userAreasToImprove:
        areasFull.append(topicConversionDic[area])

    userData[str(currentID)]["quizAttempt"] += 1

    curBestScore = userData[str(currentID)]["bestScore"]

    if userScore > curBestScore:
        userData[str(currentID)]["bestScore"] = userScore

    if userScore == 8:
        perfectScore = "Yes"
    else:
        perfectScore = "No"

    return jsonify(quizScore = userScore, areas = userAreasToImprove, areaNames = areasFull, perfect = perfectScore)

#----------------------------------------------------------------------------

@app.route('/top_scorers', methods=['GET'])
def top_scorers():
    global userData

    scores = []

    for elem in userData:
        curUser = userData[elem]
        # This happens when a user is added but never starts a quiz, then uses another name
        if curUser["bestScore"] != -1:
            scores.append((curUser["name"], curUser["bestScore"]))

    withNames = list(filter(lambda x: len(x[0]) > 0, scores))
    withNames.sort(key = lambda x: x[1], reverse = True)

    if len(withNames) <= 5:
        result = withNames
    else:
        result = withNames[:5]

    names = [user[0] for user in result]
    scores = [user[1] for user in result]

    print(userData)

    return jsonify(names = names, scores = scores)

#-----------------------------------------------------------------------------

@app.route('/get_circles', methods=['GET'])
def get_circles():
    global userData

    curQuizAttempt = userData[str(currentID)]["quizAttempt"]
    quizName = "quiz" + str(curQuizAttempt)
    circleHistory = userData[str(currentID)][quizName]["history"]

    return jsonify(history = circleHistory)

#----------------------------------------------------------------------------

@app.route('/start_chest', methods=['PUT'])
def start_chest():
    global currentID
    global userData

    curQuizAttempt = userData[str(currentID)]["quizAttempt"]
    quizName = "quiz" + str(curQuizAttempt)

    json_data = request.get_json()
    questionID = json_data["questionID"]

    userData[str(currentID)][quizName]["q" + questionID] = {
                                                                "times": [],
                                                                "curReps": 0,
                                                                "numGood": 0
                                                            }

    return jsonify(repNum = userData[str(currentID)][quizName]["q" + questionID]["curReps"])

#-------------------------------------------------------------------------------

@app.route('/start_reps', methods=['PUT'])
def start_reps():
    global currentID
    global userData

    curQuizAttempt = userData[str(currentID)]["quizAttempt"]
    quizName = "quiz" + str(curQuizAttempt)

    json_data = request.get_json()
    questionID = json_data["questionID"]
    startTime = json_data["startTime"]

    userData[str(currentID)][quizName]["q" + questionID]["times"].append(startTime)

    return jsonify(repNum = userData[str(currentID)][quizName]["q" + questionID]["curReps"])

#-------------------------------------------------------------------------------

@app.route('/click_chest', methods=['PUT'])
def click_chest():
    global currentID
    global userData

    curQuizAttempt = userData[str(currentID)]["quizAttempt"]
    quizName = "quiz" + str(curQuizAttempt)

    json_data = request.get_json()
    questionID = json_data["questionID"]
    clickTime = json_data["clickTime"]

    lastClick = userData[str(currentID)][quizName]["q" + questionID]["times"][-1]
    userData[str(currentID)][quizName]["q" + questionID]["times"].append(clickTime)

    diffClickTime = clickTime - lastClick

    result = ""

    # Ideal rate is 600ms between compressions
    if diffClickTime >= 500 and diffClickTime <= 700:
        result = "Good"
        userData[str(currentID)][quizName]["q" + questionID]["numGood"] += 1
    elif diffClickTime < 500:
        result = "Slower"
    else:
        result = "Faster"

    userData[str(currentID)][quizName]["q" + questionID]["curReps"] += 1

    repNum = userData[str(currentID)][quizName]["q" + questionID]["curReps"]

    if repNum == 30:
        done = "Yes"
    else:
        done = "No"

    return jsonify(repNum = repNum, clickResult = result, finished = done)

#---------------------------------------------------------------------------

@app.route('/verify_chest', methods=['PUT'])
def verify_chest():
    global currentID
    global userData

    curQuizAttempt = userData[str(currentID)]["quizAttempt"]
    quizName = "quiz" + str(curQuizAttempt)

    json_data = request.get_json()
    questionID = json_data["questionID"]
    topic = json_data["topic"]
    
    numGood = userData[str(currentID)][quizName]["q" + questionID]["numGood"]
    if numGood >= 25:
        userAnswerCorrect = "Yes"
        answerText = quizQuestions[questionID]["correctText"]
        userData[str(currentID)][quizName]["score"] += 2
        userData[str(currentID)][quizName]["history"].append("greenBackground")
    else:
        userAnswerCorrect = "No"
        answerText = quizQuestions[questionID]["incorrectText"]
        userData[str(currentID)][quizName]["areasImprove"].append(topic)
        userData[str(currentID)][quizName]["areasImprove"] = list(set(userData[str(currentID)][quizName]["areasImprove"]))
        userData[str(currentID)][quizName]["history"].append("redBackground")

    return jsonify(userCorrect = userAnswerCorrect, answerText = answerText, numCorrect = numGood)

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
                    result += text[start:len(text)] + " "
                    break
        if (result != ""):
            result = result[0:len(result)-2]
            result += "...</a><hr>"
            content.append(result)
    return render_template('search.html', num=num, learnMaterial=learnMaterial, titles=titles, content=content, searched=searched)


if __name__ == '__main__':
   app.run(debug = True)