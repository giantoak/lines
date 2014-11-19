from app import app
import flask
from flask import request, render_template
import requests
import urllib

@app.route('/')
def lines_main():
    return render_template('bias.html')

@app.route('/R/<filename>', methods=['POST'])
def opencpu(filename):
    
    data = urllib.unquote(request.get_data())
    print data
    header = {"Content-Type": "application/x-www-form-urlencoded"}
    r = requests.post('http://localhost/ocpu/library/rlines/R/{}/json'
                        .format(filename),
            headers=header,
            data=data)
    
    print r.text
    assert r.ok
    return r.json()

