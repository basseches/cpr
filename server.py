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

@app.route('/quiz/<id>')
def edit(id=None):
    return render_template('quiz.html', id=id)

@app.route('/quizend')
def add():
    return render_template('quizend.html') 

if __name__ == '__main__':
   app.run(debug = True)