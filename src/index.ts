export type AttemptReturnTuple<T> = [Error | undefined, T | undefined];

const success = <T>(r: T): AttemptReturnTuple<T> => [undefined, r];
const fail = (e: Error): AttemptReturnTuple<undefined> => [e, undefined];

const checkFn = (fn: () => any) => {
    if (typeof fn !== "function") throw new Error("fn should be a function!");
};

export const attemptPromise = <T>(fn: () => Promise<T>): Promise<AttemptReturnTuple<T>> => {
    checkFn(fn);

    return Promise.resolve().then(fn).then(success).catch(fail);
};

/**
 * Functional try/catch
 */
export const attempt = <T>(fn: () => T): [Error | undefined, T | undefined] => {
    checkFn(fn);

    try {
        return success(fn());
    } catch (e) {
        return fail(e);
    }
};
