from time import sleep
from machine import Pin
import time
from struct import unpack
import machine

led = Pin("LED", Pin.OUT, value=1)

led.on()

from struct import unpack
import machine
sdaPIN=machine.Pin(0)
sclPIN=machine.Pin(1)
i2c=machine.I2C(0,sda=sdaPIN, scl=sclPIN, freq=100000)

filename = "data.txt"
file = open(filename, "w")

def writefiledata(x, y):
    value = str(round(x, 2))
    value2 = str(round(y, 4))
    file.write(value + "\t" + value2)
    file.write("\n")
    file.flush()
    

def gettemp():
    i2c.writeto_mem(0x36,0,b'\x04')
    sleep(.005)
    data = bytearray(2)
    i2c.readfrom_mem_into(0x36,0x0F,data)
    sleep(1)
    temp = unpack(">H",data)[0]
    print("temperature = ", temp)
    return temp

def getmoist():
    i2c.writeto_mem(0x36,0x0F,b'\x10')
    sleep(.005)
    data = bytearray(2)
    i2c.readfrom_mem_into(0x36,0x0F,data)
    moisture = unpack(">H",data)[0]
    print("moisture = ", moisture)
    return moisture

k = 0
Ts = 300
degC = 0
moisture = 0

while True:
    while k < 6:
        sleep(Ts)
        degC = degC + gettemp()
        moisture = moisture + getmoist()
        k = k + 1
    degC = degC/6
    moisture = moisture/6
    writefiledata(degC, moisture)
    print("Average Temperature = ", degC)
    print("Average Moisture = ", moisture)
    k = 0
    degC = 0
    moisture = 0
    
    