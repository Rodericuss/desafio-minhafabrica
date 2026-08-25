const ERROR_CODES = Object.freeze({
  validation: "VALIDATION_ERROR",
  notFound: "NOT_FOUND",
  conflict: "CONFLICT",
});

class ApplicationError extends Error {
  constructor(code, message) {
    super(message);
    this.name = "ApplicationError";
    this.code = code;
  }
}

export { ApplicationError, ERROR_CODES };
