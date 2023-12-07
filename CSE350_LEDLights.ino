
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <FastLED.h>
 
//CONSTANTS
#define NUM_LEDS 29
#define DATA_PIN 16
#define TICKLENGTH 25
#define MIN_BRIGHTNESS 8
#define MAX_BRIGHTNESS 64
 
 
//FUNCTION PROTOTYPES
void SetColor(const char* r, const char* g, const char* b);
 
void SetWeather(void);
 
void snowy(void);
 
// void sunny(void);
 
// void cloudy(void);
 
void rainy(void);
 
void HTTPGET(void);
 
//WIFI CONSTANTS
const char *ssid = "Triangle House 2.4G";
const char *password = "pyramid1995";
const char *apiEndpoint = "https://iogqzpsi61.execute-api.us-east-1.amazonaws.com/dev/read";
 
//LED VARS
CRGB leds[NUM_LEDS];
int brightness = 0;
String rValue = "255";
String gValue = "255";
String bValue = "255";
String rflag = "0";
String gflag = "0";
String bflag = "0";
 
//WEATHER VARS
bool weather = true;
String weatherFunction = "rainy";
 
int httpCounter = 0;
 
//FUNCTION DEFINITIONS
void SetColor(const char* r, const char* g, const char* b) {
 
  Serial.println("Setting color...");
 
  for(int i=0; i < NUM_LEDS; i++) {
 
    leds[i].setRGB(atoi(r), atoi(g), atoi(b));
 
  }
  FastLED.show();
}
 
void snowy(void) {
  int ran = rand() % NUM_LEDS;
  int ran2 = rand() % NUM_LEDS;
  leds[ran] = CRGB(255,255,255);
  leds[ran2] = CRGB(100,100,255);
  delay(5);
  FastLED.show();
  float breath = (exp(sin(millis()/5000.0*PI)) - 0.36787944)*108.0;
  breath = map(breath, 0, 255, MIN_BRIGHTNESS, (MAX_BRIGHTNESS - 55));
 
  FastLED.setBrightness(breath);
}
 
// void sunny(void) {
 
// }
 
// void cloudy(void) {
 
// }
 
void rainy(void) {
  int ran = rand() % NUM_LEDS;
  int ran2 = rand() % NUM_LEDS;
  leds[ran] = CRGB(25,75,255);
  leds[ran2] = CRGB(0,0,255);
  FastLED.setBrightness(10);
  FastLED.show();
}
 
 
void HTTPGET(void) {
  // GET request
  HTTPClient http;
  http.begin(apiEndpoint);
  int httpCode = http.GET();
 
  Serial.println(httpCode);
 
  if (httpCode > 0) {
    String jsonString = http.getString();
 
    int rPosition = jsonString.indexOf("\\\"r\\\":") + 1; //"\r\:"
    int rCommaPosition = jsonString.indexOf(",", rPosition);
 
    int bPosition = jsonString.indexOf("\\\"b\\\":") + 1; //"b:"
    int bCommaPosition = jsonString.indexOf(",", bPosition);
 
    int gPosition = jsonString.indexOf("\\\"g\\\":") + 1; //"g:"
    int gCommaPosition = jsonString.indexOf(",", gPosition);
 
    int weatherPosition = jsonString.indexOf("main\\\":{\\\"S\\\":\\") + 16;
    int weatherEndPosition = jsonString.indexOf("\\\"", weatherPosition);
 
    int weatherquestion = jsonString.indexOf("useWeather\\") + 8;
    int weatherendquestion = jsonString.indexOf(",", weatherquestion);
   
    //Serial.println(jsonString);
 
 
    if (rCommaPosition != -1) {
      rValue = jsonString.substring(rPosition + 5, rCommaPosition);
     
      Serial.println("rValue: " + rValue);
    }
 
    if (bCommaPosition != -1) {
      bValue = jsonString.substring(bPosition + 5, bCommaPosition);
      Serial.println("bValue: " + bValue);
    }
 
    if (gCommaPosition != -1) {
      gValue = jsonString.substring(gPosition + 5, gCommaPosition);
      Serial.println("gValue: " + gValue);
    }
 
    if (weatherEndPosition != -1) {
      weatherFunction = jsonString.substring(weatherPosition, weatherEndPosition);
      Serial.println("Weather: " + weatherFunction);
    }
 
    if(weatherendquestion != -1) {
      String weatherquestionvalue = jsonString.substring(weatherquestion + 5, weatherendquestion);
      if (weatherquestionvalue == "true") {
        weather = true;
      }
      else {
        weather = false;
      }
      Serial.println("Weather?: " + weatherquestionvalue);
      Serial.println(weather);
    }
 
  http.end();
 
  }
}
 
void SetWeather(void) {
 
  if(weatherFunction == "Rain") {
    rainy();
  }
  else if(weatherFunction == "snowy") {
    snowy();
  }
  else {
    SetColor("255", "255", "255");
  }
 
}
 
void setup() {
 
  //SET BAUD RATE
  Serial.begin(115200);
  delay(1000);
 
  //LED INITIALIZATION
  FastLED.addLeds<WS2812, DATA_PIN, GRB>(leds, NUM_LEDS);
  FastLED.clear();
  SetColor(rValue.c_str(), gValue.c_str(), bValue.c_str());
 
  //WIFI SETUP
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
 
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
 
  Serial.println("Connected to WiFi");
  Serial.println(WiFi.localIP());
 
}
 
void loop() {
 
  //HTTP REQUEST
  httpCounter = (httpCounter + 1) % 10;
  if (httpCounter == 1) {
    HTTPGET();
  }

  //TURNING LED TO VARS
  if (weather == 1) {
    
    SetWeather();

  }
  if(weather == 0) {
    //IF UPDATED COLOR ON WEB
    if (rflag != rValue || gflag != gValue || bflag != bValue) {
 
      SetColor(rValue.c_str(), gValue.c_str(), bValue.c_str());
 
      rflag = rValue;
      bflag = bValue;
      gflag = gValue;
 
    }
  }
}