import { CLIENT_ID } from "../properties.js"

const clientId = `${CLIENT_ID}_${Math.random().toString(16).slice(3)}`
const options = {
  clientId,
  clean: true,
  connectTimeout: 20000,
  reconnectPeriod: 3000
}

export { clientId, options } 