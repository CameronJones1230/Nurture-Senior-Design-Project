from picozero import PUMP
from time import sleep

WPump = PUMP(15) #Corresponds to GPIO port 15, which is pin 20 on pico w
WPump.on()
sleep(19)
WPump.off()
