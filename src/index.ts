export type AttemptSuccessReturnTuple<T, E = Error> = [error: undefined, result: T];
export type AttemptFailReturnTuple<T, E = Error> = [error: E, result: undefined];
export type AttemptReturnTuple<T, E = Error> = AttemptSuccessReturnTuple<T, E> | AttemptFailReturnTuple<T, E>;

const success = <T, E = Error>(r: T): AttemptSuccessReturnTuple<T, E> => [undefined, r];
const fail = <E = Error>(e: E): AttemptFailReturnTuple<undefined, E> => [e, undefined];

const checkFn = (fn: () => any) => {
    if (typeof fn !== "function") throw new Error("fn should be a function!");
};

/**
 * Functional try/catch for promises
 */
export const attemptPromise = <T, E = Error>(fn: () => Promise<T>): Promise<AttemptReturnTuple<T, E>> => {
    checkFn(fn);

    return Promise.resolve().then(fn).then(success).catch(fail) as Promise<AttemptReturnTuple<T, E>>;
};

/**
 * Functional try/catch
 */
export const attempt = <T, E = Error>(fn: () => T): AttemptReturnTuple<T, E> => {
    checkFn(fn);

    try {
        return success(fn());
    } catch (e) {
        return fail(e as E);
    }
};
