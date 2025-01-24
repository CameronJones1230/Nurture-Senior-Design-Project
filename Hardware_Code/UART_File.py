# from umodbus.serial import Serial
# import struct
from machine import UART, Pin
from time import sleep



from crc import Crc16, Calculator, Configuration

calculator0 = Calculator(Crc16.CCITT)
calculator1 = Calculator(Crc16.CCITT)

expected0 = calculator.checksum(b'\x01\x03\x00\x1E\x00\x03')

# m = Serial(uart_id = 1)
# print(m._uart)
# slave_addr = 0x01
# starting_address = 0x1E
# reg_quantity = 0x03
# signed = True



# Define UART pins
uart0 = UART(1, baudrate=9600, tx=Pin(4), rx=Pin(5))
uart0.init(bits=8, parity=None, stop=1)
#uart0 = UART(1, baudrate==9600, bits=8, parity=None, stop=1)  # UART1, GP0 (TX) and GP1 (RX)

print(uart0)

def send(d):
    if tim_ready == 1:
        
#         register_value = m.read_holding_registers(slave_addr, starting_address, register_quantity, signed)
#         print('Holding register value:' + ' '.join('{:d}' .format(x) for x in register_value))
#         time.sleep(1)
        
        
        #Data-read command
        txData = b'\x01\x03\x00\x1E\x00\x03\x34\x0D'
        
        #Transmission command
        uart0.write(txData)
        
        #Check transmitted command
        print("Sent data : " + str(txData))
        
        #Disable callback for a while
        tim_ready == 0
        
#Define timer trigger every 1 second and use send() as callback function
tim = machine.Timer()
tim.init(period = 1000, callback = send)


RxData = []
index = 0
max_index = 7
tim_ready = 0

#The main loop start here
while True:
    
    #Enable callback
    tim_ready = 1
    
    #Waiting for data to be received
    while(uart0.any() < 1):
        print("here")
        sleep(1)
    
        pass
    
    #Waiting for data to be received
    while(uart0.any() > 0):
          
          #Add received data to RxData list
          RxData.append(uart0.read(1))
          
          #Check if buffer is empty
          index += 1
          
          
          
    if index == 11:
          
          #Check received data
          print("Received data : " + str(RxData))
          
          #Convert received data into N, P, and K values
          N = ((int.from_bytes(RxData[3], 'big')) << 8) + (int.from_bytes(RxData[4], 'big'))
          P = ((int.from_bytes(RxData[5], 'big')) << 8) + (int.from_bytes(RxData[6], 'big'))
          K = ((int.from_bytes(RxData[7], 'big')) << 8) + (int.from_bytes(RxData[8], 'big'))
          
          #Display N, P, K values
          print("Nitrogen : " + str(N))
          print("Phosphorus : " + str(P))
          print("Potassium : " + str(K))
          
          #Clear buffer
          RxData = []
          
          #Clear index
          index = 0
          