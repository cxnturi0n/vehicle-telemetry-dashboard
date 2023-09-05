import { writePayloadToInfluxDB } from '../data/influxdbHandler.js';

const messageProcessor = (message) => {

    try {
        const payload = JSON.parse(message.toString());
        if (payloadIsOk(payload)) {
            writePayloadToInfluxDB(payload);
        } else {
            console.log('Invalid payload');
        }
    } catch (err) {
        console.log(err);
    }

}


const payloadIsOk = (payload) => {
    return payload.battery >= 0 && payload.battery <= 100 && payload.licensePlate &&
        payload.speed > 0 && payload.humidity >= 0 && payload.humidity <= 100 && payload.acceleration &&
        payload.position.latitude >= -90 && payload.position.latitude <= 90 && payload.fuel >= -1 && payload.fuel <= 100 &&
        payload.position.longitude >= -180 && payload.position.longitude <= 180 && payload.timestamp
}

export { messageProcessor }
