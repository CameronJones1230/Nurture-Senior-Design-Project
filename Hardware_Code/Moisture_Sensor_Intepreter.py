# This is a sample Python script.

# Press Shift+F10 to execute it or replace it with your code.
# Press Double Shift to search everywhere for classes, files, tool windows, actions, and settings.


import time
from struct import unpack

import machine
sdaPIN=machine.Pin(0)
sclPIN=machine.Pin(1)
i2c=machine.I2C(0,sda=sdaPIN, scl=sclPIN, freq=100000)


while True:
    # read moisture level through capacitive touch pad
    i2c.writeto_mem(0x36,0,b'\x04')
    time.sleep(.005)
    data = bytearray(2)
    moisture = i2c.readfrom_mem_into(0x36,0x0F,data)
    time.sleep(1)
    #print(moisture[0], moisture[1],moisture[2],moisture[3])
    temp = unpack(">H",data)[0]
    print("temperature =", temp)
    i2c.writeto_mem(0x36,0x0F,b'\x10')
    time.sleep(.005)
    data = bytearray(2)
    i2c.readfrom_mem_into(0x36,0x0F,data)
    moisture = unpack(">H",data)[0]
    print("moisture = ", moisture)

