import smbus
import time
from gpiozero import TonalBuzzer, Button
from time import sleep
from LCD import LCD
import songLibrary

# --- Initialization ---
display = LCD(2, 0x27, True)
tb = TonalBuzzer(21)
button = Button(17)
bus = smbus.SMBus(1)
address = 0x48

startSong = False
stopSong = False

songs = songLibrary.songs

currentSong = 0

def update_display():
    display.clear()
    display.message("^v:sel <>:on/off", 1)
    message = songs[currentSong].get("name")
    display.message(message, 2)

def playSelection():
    global stopSong
    tune = songs[currentSong].get("notes")
    for note, duration in tune:
        if note:
            tb.play(note)
        else:
            tb.stop()
        handleInput()
        if stopSong == True:
            stopSong = False
            break
        
        sleep(float(duration))
    tb.stop()

def read_analog(channel):
    # PCF8591: 0x40 + channel (0=X, 1=Y)
    bus.write_byte(address, 0x40 + channel)
    bus.read_byte(address) # Dummy read
    return bus.read_byte(address)

def handleInput():
    global currentSong
    global startSong
    global stopSong
    
    y = read_analog(1)
    x = read_analog(0)
    changed = False

    # Joystick Up/Down logic
    if y > 230:
        currentSong = (currentSong + 1) % len(songs)
        changed = True
        sleep(0.15) # Debounce movement
    elif y < 170:
        currentSong = (currentSong - 1) % len(songs)
        changed = True
        sleep(0.15) # Debounce movement
        
    if x > 230:
        startSong = True
        sleep(0.15) # Debounce movement
    elif x < 170:
        stopSong = True
        sleep(0.15) # Debounce movement
        
    if changed:
        update_display()

# Initialize display first
update_display()

def updateSongState():
    global startSong
    global stopSong

    if startSong == True:
        
        playSelection()
        startSong = False
    
try:
    while True:
        handleInput()
        updateSongState()
        
        time.sleep(0.1)
        
except KeyboardInterrupt:
    print("\nStopping...")
    tb.stop()
    display.clear()
