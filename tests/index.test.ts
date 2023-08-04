import { expect, test, describe, it } from "vitest";
const { attempt, attemptPromise } = require("../dist/attempt");

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
