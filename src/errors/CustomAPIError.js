class CustomAPIError extends Error {
  constructor(message, statusCode) {
    console.log(message);
    console.log(statusCode);
    super(message)
    this.statusCode = statusCode
  }
}

module.exports = CustomAPIError