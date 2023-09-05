import mqtt from "mqtt";
import {
  CLIENT_ID,
  MQTT_BROKER_HOST,
  MQTT_BROKER_PORT,
  MQTT_PROTOCOL,
  MQTT_TOPIC,
} from "./properties.js";

const options = {
  clientId: `${CLIENT_ID}_${Math.random().toString(16).slice(3)}`,
  clean: true,
  connectTimeout: 20000,
  reconnectPeriod: 3000,
};

const brokerUrl = `${MQTT_PROTOCOL}://${MQTT_BROKER_HOST}:${MQTT_BROKER_PORT}`;

const client = mqtt.connect(brokerUrl, options);

client.on("error", (error) => {
  console.log("Could not connect:", error);
});

client.on("connect", () => {
  console.log("✅ Connected to mqtt broker [mqtt-broker:1883] ✅");
  console.log(
    "🚘 Start generating vehicles syntetic data and publishing to topic",
    MQTT_TOPIC,
    "🚘"
  );
  simulate();
});

// Generate a random value within a given range
function generateRandomValue(min, max) {
  return Math.random() * (max - min) + min;
}

// Format the timestamp to the desired format
function formatTimestamp(date) {
  const year = date.getFullYear();
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const day = ("0" + date.getDate()).slice(-2);
  const hours = ("0" + date.getHours()).slice(-2);
  const minutes = ("0" + date.getMinutes()).slice(-2);
  const seconds = ("0" + date.getSeconds()).slice(-2);
  const timezoneOffset = -date.getTimezoneOffset() / 60;
  const timezone =
    (timezoneOffset >= 0 ? "+" : "-") +
    ("0" + Math.abs(timezoneOffset)).slice(-2) +
    ":00";

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${timezone}`;
}

// Generate a random license plate name
function generateRandomLicensePlate() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let licensePlate = "";

  for (let i = 0; i < 5; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    licensePlate += characters.charAt(randomIndex);
  }

  return licensePlate;
}

const simulate = () => {
  // Start the simulation
  let elapsedSeconds = 0;
  let speed = 0;
  let acceleration = 13;
  let temperature = generateRandomValue(25, 35);
  let humidity = generateRandomValue(40, 60);
  let fuel = generateRandomValue(30, 100);
  let battery = generateRandomValue(30, 100);
  let licensePlate = generateRandomLicensePlate();

  const interval = setInterval(() => {
    const timestamp = formatTimestamp(new Date());
    // Update speed and acceleration with random fluctuations
    const speedChange = generateRandomValue(0, 5);
    speed += speedChange;

    if (speedChange > 0) acceleration = generateRandomValue(0, 2);
    else if (speedChange == 0) acceleration = 0;
    else acceleration = generateRandomValue(0, -2);

    // Update latitude and longitude with small random oscillations
    const latitudeChange = generateRandomValue(0.001, 0.01);
    const longitudeChange = generateRandomValue(0.001, 0.01);
    const naplesLatitude = 40.8522;
    const naplesLongitude = 14.2681;
    const newLatitude = naplesLatitude + latitudeChange;
    const newLongitude = naplesLongitude + longitudeChange;

    // Update temperature and humidity with small random oscillations
    temperature += generateRandomValue(-0.1, 0.1);
    humidity += generateRandomValue(-0.1, 0.1);

    // Decrease fuel and battery levels every 5 seconds
    elapsedSeconds++;
    if (elapsedSeconds % 5 === 0) {
      // Decrease fuel and battery levels by a random value between 0 and -1
      const fuelDecrease = generateRandomValue(0, -1);
      const batteryDecrease = generateRandomValue(0, -1);
      fuel += fuelDecrease;
      battery += batteryDecrease;

      // Stop generating data if both fuel and battery reach 0
      if (fuel <= 0 && battery <= 0) {
        clearInterval(interval);
        console.log("Vehicle stopped generating data.");
        return;
      }
    }

    // Generate the payload
    const payload = {
      position: {
        latitude: newLatitude.toFixed(6),
        longitude: newLongitude.toFixed(6),
      },
      battery: battery.toFixed(2),
      fuel: fuel.toFixed(2),
      speed: speed.toFixed(2),
      acceleration: acceleration.toFixed(2),
      humidity: humidity.toFixed(2),
      temperature: temperature.toFixed(2),
      licensePlate: licensePlate,
      timestamp: timestamp,
    };

    // Write the payload to InfluxDB
    const s = JSON.stringify(payload);
    client.publish(MQTT_TOPIC, JSON.stringify(payload));

    // Alternate the license plate value every 30 data points
    if (elapsedSeconds % 30 === 0) {
      speed = 0;
      acceleration = 13;
      temperature = generateRandomValue(25, 35);
      humidity = generateRandomValue(40, 60);
      fuel = generateRandomValue(30, 100);
      battery = generateRandomValue(30, 100);
      licensePlate = generateRandomLicensePlate();
    }
  }, 1000);
};
