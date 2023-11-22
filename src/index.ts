export type AttemptSuccessReturnTuple<T> = [error: undefined, result: T];
export type AttemptFailReturnTuple<T> = [error: Error, result: undefined] 
export type AttemptReturnTuple<T> = AttemptSuccessReturnTuple<T> | AttemptFailReturnTuple<T>;

const success = <T>(r: T): AttemptSuccessReturnTuple<T> => [undefined, r];
const fail = (e: Error): AttemptFailReturnTuple<undefined> => [e, undefined];

const checkFn = (fn: () => any) => {
    if (typeof fn !== "function") throw new Error("fn should be a function!");
};

/**
 * Functional try/catch for promises
 */
export const attemptPromise = <T>(fn: () => Promise<T>): Promise<AttemptReturnTuple<T>> => {
    checkFn(fn);

    return Promise.resolve().then(fn).then(success).catch(fail) as Promise<AttemptReturnTuple<T>>;
};

/**
 * Functional try/catch
 */
export const attempt = <T>(fn: () => T): [Error | undefined, T | undefined] => {
    checkFn(fn);

    try {
        return success(fn());
    } catch (e) {
        return fail(e as Error);
    }
};
