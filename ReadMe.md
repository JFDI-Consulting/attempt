# attempt

## The sane way to do error handling in a Functional Programming inspired way

### Banish the ungainly, scope-bound `try/catch/finally` forever!

This is a very simple, lightweight library to implement functional try/catch everywhere. I found myself copying the code into every single project I wrote, so I decided to make it a proper library. It has no dependencies. It's built for both browser and nodeJs use.

### Breaking Changes since v1.2.x

Removed `attemptAllPromise` because it always caused confusion. I might replace it in future with something better.

### Installation

`npm i @jfdi/attempt`

### Usage

#### For synchronous code...

```javascript
const [error, result] = attempt(fn);
// insert handling code here
```

#### For async code...

```javascript
const [error, result] = await attemptPromise(fn);
// insert handling code here
```

#### or for old style promise handling...

```javascript
attemptPromise(fn).then(([error, result]) => {
    // insert handling code here
});
```

### TypeScript Support

As of v1.4.0, you can now type both the result **and** the error with custom types:

#### Basic TypeScript usage

```typescript
import { attempt, attemptPromise } from '@jfdi/attempt';

// Type just the result (error defaults to Error)
const [error, result] = attempt<string>(() => "success");

// Type both result and error
class ValidationError extends Error {
    code: number;
}

const [error, result] = attempt<User, ValidationError>(() => {
    // your code here
});

// Now TypeScript knows:
// - error is ValidationError | undefined
// - result is User | undefined
```

#### Async with custom error types

```typescript
const [error, data] = await attemptPromise<ApiResponse, ApiError>(
    async () => await fetchData()
);

if (error) {
    // error is typed as ApiError
    console.error(error.statusCode, error.message);
} else {
    // data is typed as ApiResponse
    console.log(data.results);
}
```

#### Backward compatibility

The error type parameter defaults to `Error`, so existing code continues to work without changes:

```typescript
// These are equivalent:
const [err, res] = attempt<string>(() => "hello");
const [err, res] = attempt<string, Error>(() => "hello");
```

### Examples?

See the tests. They're pretty comprehensive.

### Why?

**Because I've always hated the ugliness of the `try/catch/finally` construct ever since I first encountered it in C++.**

It's not just an aesthetic thing, although it does make code ugly.

It's mostly this:

```javascript
let success; // a variable ripe for mutation... can't define this inside any scope below or it'll be unavailable in the others

try {
    // Here's one lexical scope...
    // The code to attempt
    success = true; // mutation
} catch (e) {
    // Here's another lexical scope...
    // The code to handle the error
    success = false; // mutation
} finally {
    // and just because we love all these isolated lexical scopes...
    // Here's the code to run after the whole sorry mess above
    if (success) console.log("Yay!");
}
```

... and ne'er the three lexical scopes shall meet. Any variable created in the `try` scope won't be available in the `catch` scope, and so on, leading to scoping compromises (like declaring variables using `let` before the `try` and mutating them in later scopes) and nasty, messy, hard-to-follow code with masses of boilerplate that goes on and on for pages whilst actually doing very little. Yuk. The solution is `attempt` or `attemptPromise`. Voila. You're welcome.
