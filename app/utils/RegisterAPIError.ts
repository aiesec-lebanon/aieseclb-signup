export default class RegisterAPIError extends Error {
    status?: number;
    details?: string;

    constructor(message?: string, status?: number, details?: string) {
        super(message);
        this.name = 'RegisterAPIError'
        this.status = status;
        this.details = details;
    }

    toString() {
        return `RegisterAPIError: ${this.message} (status: ${this.status}, details: ${this.details})`;
    }
}