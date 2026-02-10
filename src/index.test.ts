import { expect, describe, it, expectTypeOf } from "vitest";
import { attempt, attemptPromise, AttemptReturnTuple } from "./";

const data = [
    { id: 1, name: "Pat", age: 43 },
    { id: 2, name: "Mick", age: 39 }
];

const wait = timeout => new Promise(resolve => setTimeout(resolve, timeout));
const findName = (x: string) => data.find(({ name }) => name === x);

describe("attempt", () => {
    it("should return Mick's age", () => {
        const [err, result] = attempt(() => findName("Mick")?.age);
        expect(result).toBe(data[1].age);
        expect(err).toBeUndefined();
    });

    it("should return an error for Will's age", () => {
        // @ts-expect-error
        const [err, result] = attempt(() => findName("Will")["age"]);
        expect(err).not.toBeUndefined();
        expect(result).toBeUndefined();
    });

    it("should return undefined for Pat's smell", () => {
        const [err, result] = attempt(() => findName("Pat")?.["smell"]);
        expect(result).toBeUndefined();
        expect(err).toBeUndefined();
    });

    it("should return an error when treating an value as a function", () => {
        const [err, result] = attempt(() => Function.apply(data[2].name));
        expect(err).not.toBeUndefined();
        expect(result).toBeUndefined();
    });
});

describe("attempt with custom error type", () => {
    class CustomError extends Error {
        code: number;
        constructor(message: string, code: number) {
            super(message);
            this.code = code;
        }
    }

    it("should type the error as the custom error type on failure", () => {
        const [err, result] = attempt<number, CustomError>(() => {
            throw new CustomError("bad", 42);
        });
        expect(err).toBeInstanceOf(CustomError);
        expect(err?.code).toBe(42);
        expect(err?.message).toBe("bad");
        expect(result).toBeUndefined();
    });

    it("should return undefined error on success with custom error type", () => {
        const [err, result] = attempt<string, CustomError>(() => "hello");
        expect(err).toBeUndefined();
        expect(result).toBe("hello");
    });

    it("should preserve the custom error type for the return tuple", () => {
        const tuple: AttemptReturnTuple<number, CustomError> = attempt<number, CustomError>(() => {
            throw new CustomError("typed", 99);
        });
        const [err] = tuple;
        if (err !== undefined) {
            expectTypeOf(err).toEqualTypeOf<CustomError>();
            expect(err.code).toBe(99);
        }
    });
});

describe("attemptPromise with custom error type", () => {
    class ApiError extends Error {
        status: number;
        constructor(message: string, status: number) {
            super(message);
            this.status = status;
        }
    }

    it("should type the error as the custom error type on rejection", async () => {
        const [err, result] = await attemptPromise<string, ApiError>(async () => {
            throw new ApiError("not found", 404);
        });
        expect(err).toBeInstanceOf(ApiError);
        expect(err?.status).toBe(404);
        expect(err?.message).toBe("not found");
        expect(result).toBeUndefined();
    });

    it("should return undefined error on success with custom error type", async () => {
        const [err, result] = await attemptPromise<string, ApiError>(async () => "ok");
        expect(err).toBeUndefined();
        expect(result).toBe("ok");
    });
});

describe("attemptPromise", () => {
    it("should return the expected result for an async call that works", async () => {
        const waitSecs = 2;
        const MS_PER_SEC = 1000;
        const [err, result] = await attemptPromise(async () => {
            const checkpoint = Date.now();
            await wait(waitSecs * MS_PER_SEC);
            return Math.floor(Date.now() / MS_PER_SEC) - Math.floor(checkpoint / MS_PER_SEC);
        });
        expect(err).toBeUndefined();
        expect(result).toBe(waitSecs);
    });

    it("should return an error for an async call that throws", async () => {
        const waitSecs = 2;
        const MS_PER_SEC = 1000;
        const [err, result] = await attemptPromise(async () => {
            await wait(waitSecs * MS_PER_SEC);
            throw "errrr";
        });
        expect(err).not.toBeUndefined();
        expect(result).toBeUndefined();
    });
});
