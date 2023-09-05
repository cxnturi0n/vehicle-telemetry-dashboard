import { Agent } from 'http'

// These parameters need to be fine tuned

const timeout = 5000
const flushBatchSize = 1
const keepAliveAgent = new Agent({
    keepAlive: true, // reuse existing connections
    keepAliveMsecs: 20 * 1000, // 20 seconds keep alive,
})

// advanced write options
const writeOptions = {
    /* the maximum points/lines to send in a single batch to InfluxDB server */
    batchSize: flushBatchSize,
    /* maximum time in millis to keep points in an unflushed batch, 0 means don't periodically flush */
    flushInterval: 0,
    /* maximum size of the retry buffer - it contains items that could not be sent for the first time */
    maxBufferLines: 20,
    /* the count of internally-scheduled retries upon write failure, the delays between write attempts follow an exponential backoff strategy if there is no Retry-After HTTP header */
    maxRetries: 1,
}

export { timeout, keepAliveAgent, writeOptions, flushBatchSize }