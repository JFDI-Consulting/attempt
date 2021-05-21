const success = r => [undefined, r];
const fail = e => [e, undefined];

const checkFn = fn => {
    if (typeof fn !== "function") throw new Error("fn should be a function!");
};

const attemptPromise = fn => {
    checkFn(fn);

    return Promise.resolve().then(fn).then(success).catch(fail);
};

// Functional try/catch
const attempt = fn => {
    checkFn(fn);

    try {
        return success(fn());
    } catch (e) {
        return fail(e);
    }
};

module.exports = { attempt, attemptPromise };
