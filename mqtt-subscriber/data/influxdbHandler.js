import { InfluxDB, Point } from '@influxdata/influxdb-client';
import * as influxConfig from '../configuration/influxConfiguration.js';
import { INFLUX_API_TOKEN, INFLUX_BUCKET, INFLUX_ORG, INFLUX_URL } from '../properties.js';

const influxDB = new InfluxDB({
    url: INFLUX_URL,
    token: INFLUX_API_TOKEN,
    timeout: influxConfig.timeout,
    transportOptions: {
        agent: influxConfig.keepAliveAgent
    },
});

const writeApi = influxDB.getWriteApi(INFLUX_ORG, INFLUX_BUCKET, 'ns', influxConfig.writeOptions);

const writePayloadToInfluxDB = (payload) => {

    const vehicleMeasurementPoint = new Point('vehicle')
        .tag('licensePlate', payload.licensePlate)
        .floatField('latitude', payload.position.latitude)
        .floatField('longitude', payload.position.longitude)
        .floatField('battery', payload.battery)
        .floatField('fuel', payload.fuel)
        .floatField('speed', payload.speed)
        .floatField('acceleration', payload.acceleration)
        .floatField('humidity', payload.humidity)
        .floatField('temperature', payload.temperature)
        .timestamp(new Date(payload.timestamp).getTime() * 1000000, 'ns'); // Converting JS Date object (es. 2023-06-23T15:35:00+02:00) into nanoseconds

    writeApi.writePoint(vehicleMeasurementPoint);

};

const flushAndCloseConnection = () => {
    writeApi.close().then(() => {
        console.log('Connection closed');
    });
};

export { writePayloadToInfluxDB, flushAndCloseConnection };