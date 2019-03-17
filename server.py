from model.collector import *
from flask import Flask
from flask import render_template, request, Response
app = Flask(__name__)


@app.route('/')
def hello_world():
    collectors = count_requests()

    print(collectors)

    return render_template("index.html", collectors=collectors)


@app.route('/collector', methods=['POST'])
def log_collector():
    json = request.get_json()
    collector_name = json.get('collector_name')
    request_location = json.get('request_location')

    collector = Collector(collector_name, request_location)
    collector.save()

    return Response(status=200)
