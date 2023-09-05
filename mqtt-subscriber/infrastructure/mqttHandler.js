import mqtt from "mqtt";
import * as mqttConfig from "../configuration/mqttConfiguration.js";
import { messageProcessor } from "../application/messageProcessor.js";
import {
  MQTT_BROKER_HOST,
  MQTT_BROKER_PORT,
  MQTT_PROTOCOL,
  MQTT_TOPIC,
} from "../properties.js";

const brokerUrl = `${MQTT_PROTOCOL}://${MQTT_BROKER_HOST}:${MQTT_BROKER_PORT}`;

const startMqttSubscriber = () => {
  const client = mqtt.connect(brokerUrl, mqttConfig.options);

  client.on("error", (error) => {
    console.log("Could not connect:", error);
  });

  client.on("connect", () => {
    console.log("✅ Connected to broker ✅");
    client.subscribe([MQTT_TOPIC], () => {
      console.log("🚘 Subscribed to topic:", MQTT_TOPIC, "🚘");
      client.on("message", (topic, message) => {
        messageProcessor(message);
      });
    });
  });
};

export default startMqttSubscriber;
