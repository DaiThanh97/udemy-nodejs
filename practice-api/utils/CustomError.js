class CustomError extends Error {
    constructor(message, status, data) {
        super(message);
        this.status = status;
        this.data = data;
    }

    static badRequest(msg, data) {
        return new CustomError(msg, 400, data);
    }

    static notAuthenticated(msg, data) {
        return new CustomError(msg, 401, data);
    }

    static notAuthorized(msg, data) {
        return new CustomError(msg, 403, data);
    }

    static notFound(msg, data) {
        return new CustomError(msg, 404, data);
    }
}

module.exports = CustomError;