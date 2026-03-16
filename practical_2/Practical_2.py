import cv2
import numpy as np
from ai_edge_litert.interpreter import Interpreter
import keyboard

# 1. Setup Model
model_path = "model_unquant.tflite"
interpreter = Interpreter(model_path=model_path)
interpreter.allocate_tensors()

input_details = interpreter.get_input_details()
output_details = interpreter.get_output_details()

# 2. Load Labels
with open("labels.txt", "r") as f:
    class_names = [line.strip() for line in f.readlines()]

# 3. State Variables
camera = cv2.VideoCapture(0)
current_key = None
toggled = False
ticks = 0
tick_per_check = 10  # Reduced for better responsiveness

print("TFLite Model Loaded. Press SPACE to toggle control, ESC to quit.")

def handle_visual_input(label, confidence):
    global current_key
    
    # Threshold check
    if confidence > 0.9:
        new_key = None
        if "0 Up" in label: new_key = "w"
        elif "1 Down" in label: new_key = "s"
        elif "2 Left" in label: new_key = "a"
        elif "3 Right" in label: new_key = "d"

        # If the key changed, release the old one and press the new one
        if new_key != current_key:
            if current_key: 
                keyboard.release(current_key)
            if new_key:
                keyboard.press(new_key)
            current_key = new_key
    else:
        # If confidence is low, stop movement
        if current_key:
            keyboard.release(current_key)
            current_key = None

while True:
    ret, image = camera.read()
    if not ret: 
        break
    
    # Pre-processing
    input_img = cv2.resize(image, (224, 224), interpolation=cv2.INTER_AREA)
    input_img = np.expand_dims(input_img, axis=0).astype(np.float32)
    input_img = (input_img / 127.5) - 1 # Normalize to [-1, 1]
    
    # Inference
    interpreter.set_tensor(input_details[0]['index'], input_img)
    interpreter.invoke()
    output_data = interpreter.get_tensor(output_details[0]['index'])
    
    index = np.argmax(output_data[0])
    label = class_names[index]
    confidence = output_data[0][index]
    
    # Toggle Logic (using hotkey to avoid rapid-fire toggling)
    if keyboard.is_pressed("space"):
        toggled = not toggled
        print(f"Control Toggled: {toggled}")
        if not toggled and current_key:
            keyboard.release(current_key)
            current_key = None
        cv2.waitKey(300) # Debounce delay

    # Input Handling
    if toggled and (ticks % tick_per_check == 0):
        handle_visual_input(label, confidence)
    
    ticks += 1	
    
    # UI Overlay
    status_color = (0, 255, 0) if toggled else (0, 0, 255)
    status_text = "ACTIVE" if toggled else "PAUSED"
    cv2.putText(image, f"Status: {status_text}", (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, status_color, 2)
    cv2.putText(image, f"{label}: {round(confidence * 100, 1)}%", (10, 60), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 0, 0), 2)
    
    cv2.imshow("Pi Vision (TFLite)", image)
    
    if cv2.waitKey(1) == 27: # ESC
        break

# Cleanup
if current_key:
    keyboard.release(current_key)
camera.release()
cv2.destroyAllWindows()
