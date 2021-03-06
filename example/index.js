const { attempt, attemptPromise } = require("..");

const data = [
    { id: 1, name: "Pat", age: 43 },
    { id: 2, name: "Mick", age: 39 }
];

const wait = timeout => new Promise(resolve => setTimeout(resolve, timeout));
const findName = x => data.find(({ name }) => name === x);
const syncTests = [
    { name: "Mick's age", fn: () => findName("Mick").age, expected: data[1].age },
    { name: "Will's age", fn: () => findName("Will").age, expected: "error" },
    { name: "Smell of Pat", fn: () => findName("Pat").smell, expected: undefined },
    { name: "Treat an array as a function", fn: () => data(2), expected: "error" }
];

const syncResults = syncTests.map(({ name, fn, expected }) => {
    const [err, result] = attempt(fn);
    return {
        name,
        error: err?.message,
        result,
        expected,
        succeeded: (err && expected === "error") || result === expected
    };
});

console.table(syncResults);

const runAsyncTests = async () => {
    const waitSecs = 2,
        MS_PER_SEC = 1000;
    const asyncTests = [
        {
            name: "async call that works",
            fn: async () => {
                const checkpoint = Date.now();
                await wait(waitSecs * MS_PER_SEC);
                return Math.floor(Date.now() / MS_PER_SEC) - Math.floor(checkpoint / MS_PER_SEC);
            },
            expected: waitSecs
        },
        {
            name: "async call that throws",
            fn: async () => {
                await wait(waitSecs * MS_PER_SEC);
                throw "errrr";
            },
            expected: "error"
        }
    ];

    const asyncResults = Promise.all(
        asyncTests.map(async ({ name, fn, expected }) => {
            const [err, result] = await attemptPromise(fn);
            return {
                name,
                error: err?.message,
                result,
                expected,
                succeeded: (err && expected === "error") || result === expected
            };
        })
    );
    return asyncResults;
};

const functionThatErrors = async throwError => {
    await wait(2000);
    if (throwError) throw "errrr";
    else return "I waited";
};

const demo = async throwError => {
    // Essentially, error handling for async promises is this easy and compact...

    const [e, r] = await attemptPromise(() => functionThatErrors(throwError));
    if (e) console.error("Error");
    else console.log(r);
};

const runDemo = async () => {
    console.log("This should say 'I waited'");
    await demo(false);
    console.log("This should error");
    await demo(true);
};

runAsyncTests().then(async r => {
    console.table(r);
    await runDemo();
});
