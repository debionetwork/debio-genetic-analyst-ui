import errorMessages from "./error-messages"

export default Object.freeze({
  FIELD_REQUIRED: val => !!val || errorMessages.REQUIRED,
  ENGLISH_ALPHABET: val => (!!val && /^[A-Za-z0-9!@#$%^&*\\(\\)\-_=+:;"',.\\/? \n]+$/.test(val)) || errorMessages.INPUT_CHARACTER("English alphabet"),
  MAX_CHARACTER: (max) => {
    return val => (!!val && val.length <= max) || errorMessages.MAX_CHARACTER(max)
  },
  FILE_SIZE: (size) => {
    return val => (!!val && val.size <= size) || errorMessages.FILE_SIZE(size / 1000000)
  },
  DEFAULT_ACCEPT_DOCUMENTS: val => (!!val && (val.type === "application/pdf" || val.type === "application/msword" || val.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document")) || errorMessages.FILE_FORMAT("PDF/DOC/DOCX"),
  EMAIL: val => /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/.test(val) || errorMessages.EMAIL,
  DEFAULT_IMAGE: (val) => (val && (val.type === "image/png" || val.type === "image/jpg")) || errorMessages.FILE_FORMAT("PNG/JPG")
})
