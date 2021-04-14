const success = r => [null, r];
const fail = e => [e, null];

const checkFn = fn => {
    if (typeof fn !== "function") throw Error("fn should be a function!");
};

const attemptPromise = fn => {
    checkFn(fn);

    return Promise.resolve().then(fn).then(success).catch(fail);
};

// Functional try/catch
const attempt = fn => {
    try {
        return success(fn());
    } catch (e) {
        return fail(e);
    }
};

module.exports = { attempt, attemptPromise, success, fail };
