from flask import Flask
from flask import render_template
from flask import Response, request, jsonify
app = Flask(__name__)

# ROUTES

@app.route('/')
def homepage():
   return render_template('homepage.html') 

@app.route('/intro')
def intro():
    return render_template('intro.html')

@app.route('/setting')
def setting():
    return render_template('setting.html')

@app.route('/prep')
def prep():
    return render_template('prep.html')

@app.route('/chest')
def chest():
    return render_template('chest.html')

@app.route('/breaths')
def breaths():
    return render_template('breaths.html')

@app.route('/quiz')
def quiz():
    return render_template('quiz.html')

@app.route('/quiz/<questionID>')
def question(questionID=None):
    return render_template('question.html', questionID=questionID)

@app.route('/quizend')
def quizend():
    return render_template('quizend.html') 

if __name__ == '__main__':
   app.run(debug = True)