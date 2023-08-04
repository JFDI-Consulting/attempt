export type AttemptReturnTuple<T> = [Error | undefined, T | undefined];

const success = r => [undefined, r];
const fail = (e: Error): [Error, undefined] => [e, undefined];

const checkFn = (fn: () => any) => {
    if (typeof fn !== "function") throw new Error("fn should be a function!");
};

export const attemptPromise = <T>(fn: () => Promise<T>): [Error | undefined, T | undefined] => {
    checkFn(fn);

    return Promise.resolve().then(fn).then(success).catch(fail);
};
/**
 * Runs a Promise.all style attemptPromise, returning a Tuple
 * containing an array of Errors & the results of your promise in order.
 * @param {Promise<any>[]} promises - Raw Promises, don't try to handle them yourself
 * @returns {[(Error[] | undefined), (any[])]}
 * @see {attemptPromise}
 */
export const attemptAllPromise = <T>(promises: Promise<T>[]): [Error[] | undefined, T[]] => {
    const requests: [Error | undefined, T | undefined][] = attemptPromise(() => Promise.all(promises));
    const results: T[] = [];
    let errors = undefined;

    for (let idx = 0, length = requests.length; idx < length; idx++) {
        const [error, result] = requests[idx];
        if (error) errors = (errors || []).concat([error]);
        results.push(result);
    }
    return [errors, results];
};

/**
 * Functional try/catch
 * @param {() => any} fn
 * @returns {[(Error | undefined), (any | undefined)]}
 * @throws {Error} - Throws an error if the param is not a function
 */
export const attempt = (fn: () => any): [Error | undefined, any | undefined] => {
    checkFn(fn);

    try {
        return success(fn());
    } catch (e) {
        return fail(e);
    }
};
