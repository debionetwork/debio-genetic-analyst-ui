// Using Object.freeze for the constant means the object can't be changed. It's similar to enum on typescript

export default Object.freeze({
  REQUIRED: "This field is required",
  EMAIL: "Email is invalid. It should contain @ followed by a domain",
  INCORRECT_PASSWORD: "The password you entered is incorrect",
  INVALID_WEBSITE: "Website is invalid. It should contain protocol (https://) followed by a domain",

  /**
   *
   * @param {string} format
   * @returns {string}
   */
  FILE_FORMAT: (format) => {
    const message = "The files uploaded are not in the supported file formats"
    if (format) return message + ` (${format})`

    return message
  },

  /**
   * 
   * @param {number | string} size 
   * @returns {string}
   */
  FILE_SIZE: (size) => {
    const message = "The total file size uploaded exceeds the maximum file size allowed"
    if (size) return message + ` ${size}MB`
    
    return message
  },

  /**
   * 
   * @param {number | string} number 
   * @returns {string}
   */
  FILE_NUMBER: (number) => {
    const message = "The total number of files uploaded exceeds the maximum file size allowed"
    if (number) return message + ` (${number}) Files`
    
    return message
  },

  /**
   * 
   * @param {number | string} length 
   * @param {number | string} includeChars 
   * @returns {string}
   */
  PASSWORD: (length = 0, includeChars) => {
    const message = `Password must have at least ${length} character`
    if (includeChars) return message + `, that include at least ${includeChars}`

    return message
  },

  /**
   * 
   * @param { string } label 
   * @returns {string}
  */
  INVALID: (label) => {
    const message = `${label} is Invalid`
    return message
  },

  INPUT_CHARACTER: (type) => {
    const message = `This field can only contain ${type}`
    return message
  },
  /**
   * 
   * @param {number | string} number 
   * @returns {string}
   */
  MAX_CHARACTER: (number) => {
    const message = `This field only allows ${number} characters`
    return message
  }
})
