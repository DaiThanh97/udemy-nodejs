class CustomError extends Error {
    constructor(status, message, errors = {}) {
        super(message);
        this.status = status;
        this.errors = errors;
    }
}

class Response {
    constructor(message, data = {}) {
        this.message = message;
        this.data = data;
    }
}

module.exports = {
    CustomError,
    Response
};