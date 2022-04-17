from flask import Flask
from flask import render_template
from flask import Response, request, jsonify
app = Flask(__name__)

# ROUTES

@app.route('/')
def homepage():
   return render_template('homepage.html')   

@app.route('/learn/<id>', methods=['GET', 'POST'])
def view(id=None):
    return render_template('learn.html', id=id)

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