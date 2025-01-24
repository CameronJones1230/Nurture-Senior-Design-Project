#include <ArduinoRS485.h>
#include <ArduinoModbus.h>

static unsigned int const MODBUS_BAUDRATE = 9600;  //or 4800
static float const MODBUS_BIT_DURATION = 1.f / MODBUS_BAUDRATE;
static float const MODBUS_PRE_DELAY_BR = MODBUS_BIT_DURATION * 9.6f * 3.5f * 1e6;
static float const MODBUS_POST_DELAY_BR = MODBUS_BIT_DURATION * 9.6f * 3.5f * 1e6;

//NPK1
// short nitro1, phos1, pot1;

//NPK2
short nitro2, phos2, pot2, moist, temp, ph, salt, conduct;

//PAR3
short light;

void makeDummyData(){
  // nitro1 = 1;
  nitro2 = 2;
  // phos1 = 3;
  phos2 = 4;
  // pot1 = 5;
  pot2 = 6;
  moist = 7;
  temp = 8;
  ph = 9;
  salt = 10;
  conduct = 11;
  light = 12;
} 

String makeJsonBody(){

  //build responseBody
  String bodyString ="";
  bodyString += "{";
  bodyString += "\"nitrogen\": " + String((nitro2)) + ",";
  bodyString += "\"phosphorus\": " + String((phos2)) + ",";
  bodyString += "\"potassium\": " + String((pot2)) + ",";
  bodyString += "\"moisture\": " + String(moist) + ",";
  bodyString += "\"temperature\": " + String(temp) + ",";
  bodyString += "\"ph\": " + String(ph) + ",";
  bodyString += "\"salt\": " + String(salt) + ",";
  bodyString += "\"par\": " + String(light) + ",";
  bodyString += "\"ec\": " + String(conduct);
  bodyString += "}";

  return bodyString;
}

void initModbus() {

  Serial.begin(9600);  //serial bus, not the

  while (!Serial)
    ;

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

void readAllSensors() {

  // //NPK 1
  // if (!ModbusRTUClient.requestFrom(1, HOLDING_REGISTERS, 0x001E, 3)) {

  //   Serial.print("failed to read\n");

  // } else {

  //   nitro1 = ModbusRTUClient.read();
  //   phos1 = ModbusRTUClient.read();
  //   pot1 = ModbusRTUClient.read();

  //   Serial.println(nitro1);
  //   Serial.println(phos1);
  //   Serial.println(pot1);
  //   Serial.print("\n");
  // }

  // delay(500);

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

  delay(100);

  //PAR 3
  if (!ModbusRTUClient.requestFrom(3, HOLDING_REGISTERS, 0x0000, 1)) {

    Serial.print("failed to read\n");

  } else {

    light = ModbusRTUClient.read();
    
    Serial.println(light);
    Serial.print("\n");
  }

  delay(100);
}