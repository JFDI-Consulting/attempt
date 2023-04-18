/**
 * @param {any} return
 * @returns {[undefined, any]}
 */
const success = r => [undefined, r];

/**
 * @param {Error | any} error
 * @returns {[Error, undefined]}
 */
const fail = e => [e, undefined];

/**
 * @param {() => any} fn
 * @throws {Error} - Throws an error if the param is not a function
 */
const checkFn = fn => {
    if (typeof fn !== "function") throw new Error("fn should be a function!");
};

/**
 * Runs a Promise for you and returns it as a Tuple
 * Containing an Error & Result
 * Which reduces your codebase size.
 * @param {() => Promise<any>} fn
 * @returns {[(Error | undefined), (any | undefined)]}
 * @throws {Error} - Throws an error if the param is not a function
 */
export const attemptPromise = fn => {
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
export const attemptAllPromise = promises => {
    const requests = attemptPromise(() => Promise.all(promises));
    const results = [];
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
export const attempt = fn => {
    checkFn(fn);

    try {
        return success(fn());
    } catch (e) {
        return fail(e);
    }
};
