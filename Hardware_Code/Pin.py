from machine import Pin
from time import sleep

WPump = Pin(15, mode = Pin.OUT)

WPump.on()
sleep(10)
WPump.off()