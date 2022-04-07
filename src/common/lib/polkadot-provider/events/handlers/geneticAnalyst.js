const defaultHandler = {
  get: function (target, name) {
    return Object.prototype.hasOwnProperty.call(target, name) ? target[name] : (dataEvent, value, valueMessage) => {
      const data = dataEvent[0]
      const id = data[value]
      const params = { number: id }
      const wording = "for (" + data[valueMessage].substr(0, 4) + "..." + data[valueMessage].substr(data[valueMessage].length - 4) + ")"
      return { data, id, params, wording }
    }
  }
}

const handler = {
  geneticAnalysts: async (dataEvent, value, valueMessage) => {
    const data = dataEvent
    const id = data[0][value]
    const params = { page: 1 }
    let wording = valueMessage

    if (value === "verificationStatus") wording = `${valueMessage} ${data[0][value].toLowerCase()}`

    return { data, id, params, wording }
  },
  geneticAnalystServices: async (dataEvent, value, valueMessage) => {
    const data = dataEvent
    const id = data[0][value]
    const params = { page: 1 }
    const formatedHash = `${id.substr(0, 4)}...${id.substr(id.length - 4)}`
    const wording = `${valueMessage} ${formatedHash}`
    
    return { data, id, params, wording }
  },
  geneticAnalysisOrders: async (dataEvent, value, valueMessage) => {
    const data = dataEvent
    const id = data[0][value]
    const params = { page: 1 }
    const formatedHash = `${id.substr(0, 4)}...${id.substr(id.length - 4)}`
    const wording = `${valueMessage} ${formatedHash} is awaiting process`

    return { data, id, params, wording }
  }
}

// If property not found, return defaultHandler
export const geneticAnalysisHandler = new Proxy(handler, defaultHandler)
