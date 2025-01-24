#include <ArduinoRS485.h>
#include <ArduinoModbus.h>

#define MOISTURE_THRESHOLD 400
#define N_THRESHOLD 400
#define P_THRESHOLD 400
#define K_THRESHOLD 400

#define PUMP_EN_PIN 1
#define SOLVALVE_EN_PIN 0

static unsigned int const MODBUS_BAUDRATE = 9600;  //or 4800
static float const MODBUS_BIT_DURATION = 1.f / MODBUS_BAUDRATE;
static float const MODBUS_PRE_DELAY_BR = MODBUS_BIT_DURATION * 9.6f * 3.5f * 1e6;
static float const MODBUS_POST_DELAY_BR = MODBUS_BIT_DURATION * 9.6f * 3.5f * 1e6;

//NPK1
short nitro1 = 0, phos1 = 0, pot1 = 0;

//NPK2
short nitro2 = 0, phos2 = 0, pot2 = 0, moist = 0, temp = 0, ph = 0, salt = 0, conduct = 0;

//PAR3
short light = 0;



void setup() {
  // put your setup code here, to run once:

  Serial.begin(9600);  //serial bus, not the


  pinMode(PUMP_EN_PIN, OUTPUT);
  pinMode(SOLVALVE_EN_PIN, OUTPUT);

  RS485.setDelays(MODBUS_PRE_DELAY_BR, MODBUS_POST_DELAY_BR);

  if (!ModbusRTUClient.begin(MODBUS_BAUDRATE, SERIAL_8N1)) {
    Serial.println("Failed to start Modbus RTU Client!");
    for (;;) {}
  }

  //for changing probe settings
  // ModbusRTUClient.holdingRegisterWrite(1,0x07D1,2);
  // ModbusRTUClient.holdingRegisterWrite(1,0x07D1,2);

  ModbusRTUClient.setTimeout(2 * 1000UL); /* 2 seconds. */
}

void loop() {
  // put your main code here, to run repeatedly:


  //NPK 1
  if (!ModbusRTUClient.requestFrom(1, HOLDING_REGISTERS, 0x001E, 3)) {

    Serial.print("failed to read\n");

  } else {

    nitro1 = ModbusRTUClient.read();
    phos1 = ModbusRTUClient.read();
    pot1 = ModbusRTUClient.read();

    Serial.println(nitro1);
    Serial.println(phos1);
    Serial.println(pot1);
    Serial.print("\n");
  }

  //NPKTM 2
  if (!ModbusRTUClient.requestFrom(2, HOLDING_REGISTERS, 0x0000, 8)) {

    Serial.print("failed to read\n");

  } else {

    moist = ModbusRTUClient.read();
    temp = ModbusRTUClient.read();
    conduct = ModbusRTUClient.read();
    ph = ModbusRTUClient.read();
    nitro2 = ModbusRTUClient.read();
    phos2 = ModbusRTUClient.read();
    pot2 = ModbusRTUClient.read();
    salt = ModbusRTUClient.read();

    Serial.println(moist);
    Serial.println(temp);
    Serial.println(conduct);
    Serial.println(ph);
    Serial.println(nitro2);
    Serial.println(phos2);
    Serial.println(pot2);
    Serial.println(salt);

    Serial.print("\n");
  }

  //PAR 3
  if (!ModbusRTUClient.requestFrom(3, HOLDING_REGISTERS, 0x0000, 1)) {

    Serial.print("failed to read\n");

  } else {

    light = ModbusRTUClient.read();
    
    Serial.println(light);
    Serial.print("\n");
  }


  //Need to implement the watering threshold thing here
  //0-100%RH
  //Resolution: 0.1%RH

  if(moist < MOISTURE_THRESHOLD) {

    Serial.println("Watering!");
    
    digitalWrite(PUMP_EN_PIN, HIGH);

    delay(10000); //10 seconds of dispensing water

    digitalWrite(PUMP_EN_PIN, LOW);
    
  }

//  if(nitro2 < N_THRESHOLD || phos2 < P_THRESHOLD || pot2 < K_THRESHOLD) {
//
//    Serial.println("Fertilizer!");
//
//    digitalWrite(SOLVALVE_EN_PIN, HIGH);
//
//    digitalWrite(PUMP_EN_PIN, HIGH);
//    delay(10000); //10 seconds of dispensing fertilizer
//    digitalWrite(SOLVALVE_EN_PIN, LOW);
//
//    delay(2000); //2 seconds of dispensing water to flush out pipes
//
//    digitalWrite(PUMP_EN_PIN, LOW);
//  }

  

  //TODO: Have MOISTURE_THRESHOLD and FERTILIZER_THRESHOLD be values read in from the app based on selected plant type.


  

  

  delay(3000);
}
