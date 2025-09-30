// Teensy 4.0 — pure byte echo over USB CDC
// Any byte received is immediately written back.

void setup() {
  Serial.begin(115200);
  pinMode(LED_BUILTIN, OUTPUT); 
  digitalWrite(LED_BUILTIN, LOW);
}

void loop() {
  while (Serial.available() > 0) {
    int b = Serial.read();          
    if (b >= 0) {
      Serial.write((uint8_t)b);      
      digitalWrite(LED_BUILTIN, HIGH);
      delayMicroseconds(200);
      digitalWrite(LED_BUILTIN, LOW);
    }
  }
}
