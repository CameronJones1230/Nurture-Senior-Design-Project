//test using my mobile hotspot to see if the arduino can sign on to wifi network
//school network would need permissions or some fancy code I don't want to mess with

//omnissiah forgive me

#include <WiFiNINA.h>
#include <SPI.h>
#include <String.h>
#include <ArduinoLowPower.h>
#include "secrets.h"
//NOTE: when compiling, arduino combines all .ino files in the directory into one binary. dont need to worry about including other .ino files

//network information
char ssid[] = SECRET_SSID;    // your network SSID (name)
char pass[] = SECRET_PASS;    // your network password (use for WPA, or use as key for WEP)
int status = WL_IDLE_STATUS;  // the Wifi radio's status

//wifit client information
WiFiClient client;
int HTTP_PORT = 80;
char HOST_NAME[] = "nurture.glitch.me";  // hostname of web server:
String authString = "Authorization: Basic MTIzbnVydHVyZUBnbWFpbC5jb206IXNlbmRlc2lnbiE=";

String userID = "6738e621165545db89e0f2af";  //this is fine.
String plantID = "6738e632165545db89e0f2b3";

void setup() {
  //Initialize serial and wait for port to open:
  Serial.begin(9600);  //TODO might need to remove for production version, wont have something to plug into
  while (!Serial)
    ;

  // attempt to connect to Wifi network:
  while (status != WL_CONNECTED) {
    Serial.print("Attempting to connect to network: ");
    Serial.println(ssid);
    // Connect to WPA/WPA2 network:
    status = WiFi.begin(ssid, pass);

    if (client.connect(HOST_NAME, HTTP_PORT)) {
      // if connected:
      Serial.println("Connected to server");
      // make a HTTP request:
      // send HTTP header

      //test get request

      // client.println("GET /user/users HTTP/1.1");
      // client.println("Authorization: Basic MTIzbnVydHVyZUBnbWFpbC5jb206IXNlbmRlc2lnbiE=");   // Correct Authorization header
      // //glitch was checking for user agents, aka valid browsers. obviously an arduino can't do that so we simply steal firefox's.
      // client.println("User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36");
      // client.println("Accept: application/json");
      // client.println("Host: nurture.glitch.me");
      // client.println("Connection: close");
      // client.println();

      //important to initialize
      // makeDummyData();

      initModbus();
      readAllSensors();
      // ModbusRTUClient.end();

      String bodyString = makeJsonBody();

      client.println("POST /user/" + userID + "/plant/" + plantID + "/sensor-data/current HTTP/1.1");
      client.println("Content-Type: application/json");
      client.println("Authorization: Basic MTIzbnVydHVyZUBnbWFpbC5jb206IXNlbmRlc2lnbiE=");  // Correct Authorization header. Made manually because the lib nuked my IDE.
      //glitch was checking for user agents, aka valid browsers. obviously an arduino can't do that so we simply steal firefox's. or whateer tf this is that chat gpt gave me. just all of them ig
      //I love lying to computers and getting away with it
      client.println("User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36");
      client.println("Accept: application/json");
      client.println("Host: nurture.glitch.me");
      client.println("Connection: close");  //not telling the client to break the connection, just to close it if there's nothing happening. it does absolutely nothing at the moment
      client.println("Content-Length: " + String(bodyString.length()));
      client.println();  //empty line indicates the end of the header, and prepares for the body

      //request body
      client.println(bodyString);

      Serial.println();
      Serial.println(bodyString);
      Serial.println(bodyString.length());
      Serial.println();

      //if we dont have a serial connected then remove this for demo version
      while (client.connected()) {
        if (client.available()) {
          // read an incoming byte from the server and print it to serial monitor:
          char c = client.read();
          Serial.print(c);
        }
      }

      // client.stop();
      // Serial.println();
      // Serial.println("disconnected");
    } else {  // if not connected:
      Serial.println("connection to server failed");
    }

    // wait 10 seconds for connection:
    delay(10000);
  }
}

void loop() {

  //serial is already started
  //wifi is already started
  //modbus is initialized and started

  readAllSensors();

  String bodyString = makeJsonBody();

  client.println("POST /user/" + userID + "/plant/" + plantID + "/sensor-data/current HTTP/1.1");
  client.println("Content-Type: application/json");
  client.println("Authorization: Basic MTIzbnVydHVyZUBnbWFpbC5jb206IXNlbmRlc2lnbiE=");  // Correct Authorization header. Made manually because the lib nuked my IDE.
  //glitch was checking for user agents, aka valid browsers. obviously an arduino can't do that so we simply steal firefox's. or whateer tf this is that chat gpt gave me. just all of them ig
  //I love lying to computers and getting away with it
  client.println("User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36");
  client.println("Accept: application/json");
  client.println("Host: nurture.glitch.me");
  client.println("Connection: close");  //not telling the client to break the connection, just to close it if there's nothing happening. it does absolutely nothing at the moment
  client.println("Content-Length: " + String(bodyString.length()));
  client.println();  //empty line indicates the end of the header, and prepares for the body

  //request body
  client.println(bodyString);

  Serial.println();
  Serial.println(bodyString);
  Serial.println(bodyString.length());
  Serial.println();

  //if we don't use serial connection in prod then get rid of this stuff
  while (client.connected()) {
    if (client.available()) {
      // read an incoming byte from the server and print it to serial monitor:
      char c = client.read();
      Serial.print(c);
    }
  }

  delay(20000);  //wait 15 seconds before repeating
}
