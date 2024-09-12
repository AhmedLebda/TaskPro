export class PermissionError extends Error {
    statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.name = "PermissionError";
    }
}

export class AssociatedDataError extends Error {
    statusCode: number;

    constructor(message: string) {
        super(message);
        this.statusCode = 400;
        this.name = "AssociatedDataError";
    }
}
