from machine import Pin, UART
from utime import sleep, sleep_ms

slaveAddr = bytes([0x01]) #id of probe, can change if necessary
funcCode = bytes([0x03]) #read single register
Nreg = bytes([0x001E])
Preg = bytes([0x001F])
Kreg = bytes([0x0020])

regLen = bytes([0x0003]) #length of each data register is 1, we want to read all 3

#modbus uses CRC-16-ANSI standard
#initial value of 65535 or 0xFFFF? I thought it only had 2 bytes?
# crcBytes = bytes([0x340D]) #TODO this is from one of the examples in the instruction book

crcLow = bytes([0x34])
crcHigh = bytes([0x0D])

pauseBytes = bytes([0x0000]) #4 character pause. this might not be necessary idk
#read out array yte by byte over UART

uart0 = UART(0, baudrate=9600, bits=8, tx=Pin(0), rx=Pin(1))

rxData = bytes() #holds response bytes

while True:


    uart0.write(slaveAddr + funcCode + Nreg + regLen + crcLow + crcHigh) #all NPK regs should be adjacent, so can get them in one write

    #hold, expect a response
    sleep_ms(100)


    #hopefully this is good enough.
    #Timeing doesn't seem very strict but apparently there's a fucking scheduler in this thing so who who knows how it will react
    #hopefully good enough, not like there's anything else going on
    while uart0.any() > 0:
        rxData += uart0.read(1)

        #idc about checking CRC on this end as long as I get a response
        #the data we actually want should be the from byte 3 to 8

    print(rxData) #maybe this will work?
    sleep(10)