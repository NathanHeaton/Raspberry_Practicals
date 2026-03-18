import max30102 
import hrcalc 
from mpu6050 import mpu6050

from flask import Flask, render_template
from flask_socketio import SocketIO
from collections import deque
import time
import threading 

HRS = max30102.MAX30102() 
sensor = mpu6050(0x68)

app = Flask(__name__)
socketio = SocketIO(app, async_mode='threading')

lock = threading.Lock()

@app.route("/")
def index():
    return render_template("index.html")  # p5.js frontend
    
def read_Heart_Rate():
	while True:
		red, ir = HRS.read_sequential()
		bpm = hrcalc.calc_hr_and_spo2(ir, red)
		print(bpm[2])
		with lock:
			socketio.emit("heart_data", bpm[2])		
	
def read_gyro_accel_temp():
	while True:	
		accel_data = sensor.get_accel_data()
		gyro_data = sensor.get_gyro_data()
		temp = sensor.get_temp()	
		print(temp)
		time.sleep(0.01)
		with lock:
			socketio.emit("temp_data", temp);
			socketio.emit("gyro_data", gyro_data);
			socketio.emit("accel_data", accel_data);
		
		

		
threads = [ threading.Thread(target=read_Heart_Rate, daemon=True),
			threading.Thread(target=read_gyro_accel_temp, daemon=True)]
	
def program():
			
	for thread in threads:
		thread.start()

	for thread in threads:
		thread.join()	

if __name__ == "__main__":
    socketio.start_background_task(program)
    socketio.run(app, host="0.0.0.0", port=5000)


