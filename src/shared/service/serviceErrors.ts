class ServiceError extends Error {
    constructor(message: string) {
        super(message);

        // Set the prototype explicitly.
        // @see: https://github.com/Microsoft/TypeScript-wiki/blob/main/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
        // @see: https://teratail.com/questions/114258
        // Object.setPrototypeOf(this, ServiceError.prototype);
        Object.setPrototypeOf(this, new.target.prototype);
    }
}