#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h> // Ensure you install the ArduinoJson library

const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// Use your Railway URL once hosted. 
// If testing locally alongside XAMPP, use your Computer's IPv4 address (e.g., http://192.168.1.5:8000/api/device/sync)
const char* serverName = "http://YOUR_SERVER_URL/api/device/sync";

// Variables for sensors
int ultrasonicDistance = 0; 
int calculatedFillLevel = 0;

void setup() {
  Serial.begin(115200);
  
  WiFi.begin(ssid, password);
  Serial.println("Connecting to WiFi");
  while(WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("Connected to WiFi network with IP Address: ");
  Serial.println(WiFi.localIP());
}

void loop() {
  if(WiFi.status() == WL_CONNECTED){
    HTTPClient http;
    
    // Your sensor logic goes here...
    // ultrasonicDistance = readDistance();
    // calculatedFillLevel = map(ultrasonicDistance, emptyDistance, fullDistance, 0, 100);
    
    // For testing, let's hardcode it to 65%
    calculatedFillLevel = 65; 

    // Setup the HTTP POST request mapping to the Laravel API
    http.begin(serverName);
    http.addHeader("Content-Type", "application/json");

    // Construct the JSON Payload
    String jsonPayload = "{\"fill_level\":" + String(calculatedFillLevel) + "}";

    // Send the POST request
    int httpResponseCode = http.POST(jsonPayload);
    
    if (httpResponseCode > 0) {
      String response = http.getString();
      Serial.println(httpResponseCode);
      Serial.println(response);

      // Parse JSON response to see if 'manual_open' was triggered
      StaticJsonDocument<200> doc;
      deserializeJson(doc, response);
      
      bool manualOpen = doc["manual_open"];

      if (manualOpen) {
          Serial.println("API COMMAND RECEIVED: Opening Lid via Servo!");
          // myServo.write(openAngle);
      } else {
          // Normal local mode logic (opens via hand sensor unless 100% full)
      }

    } else {
      Serial.print("Error code: ");
      Serial.println(httpResponseCode);
    }
    
    http.end();
  } else {
    Serial.println("WiFi Disconnected");
  }

  // Poll Laravel every 3 seconds
  delay(3000); 
}
