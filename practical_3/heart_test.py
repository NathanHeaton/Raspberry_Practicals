import max30102 
import hrcalc 

from flask import Flask, render_template
from flask_socketio import SocketIO
from collections import deque
import time

m = max30102.MAX30102() 

app = Flask(__name__)
socketio = SocketIO(app, async_mode='threading')

@app.route("/")
def index():
    return render_template("index.html")  # p5.js frontend
def read_sensors():
	while True:
		red, ir = m.read_sequential()
		print(hrcalc.calc_hr_and_spo2(ir, red))
		
		socketio.emit("sensor_data", red)
		time.sleep(1)

if __name__ == "__main__":
    socketio.start_background_task(read_sensors)
    socketio.run(app, host="0.0.0.0", port=5000)


