# attempt

## The sane way to do error handling in a Functional Programming inspired way

### Banish the ungainly, scope-bound `try/catch/finally` forever!

This is a very simple, lightweight library to implement functional try/catch everywhere. I found myself copying the code into every single project I wrote, so I decided to make it a proper library.

### Installation

`npm i @jfdi/attempt`

You'll need some sort of access to the `@jfdi` private scoped repository at `npmjs.com`.

### Usage

#### For synchronous code...

```javascript
const [error, result] = attempt(fn);
// insert handling codde here
```

#### For async code...

```javascript
const [error, result] = await attemptPromise(fn);
// insert handling codde here
```

#### or for old style promise handling...

```javascript
attemptPromise(fn).then(([error, result]) => {
    // insert handling code here
});
```

### Examples?

I've included [some examples](https://github.com/JFDI-Consulting/attempt/blob/master/example/index.js) in the form of a suite of tests and a simple demo.

### Why?

**Because I've always hated the ugliness of the `try/catch/finally` construct ever since I first encountered it in C++.**

It's not just an aesthetic thing, although it does make code ugly.

It's mostly this:

```javascript
try {
    // Here's one lexical scope...
    // The code to attempt
} catch (e) {
    // Here's another lexical scope...
    // The code to handle the error
} finally {
    // and just because we love all these isolated lexical scopes...
    // Here's the code to run after the whole sorry mess above
}
```

... and ne'er the three lexical scopes shall meet. Any variable created in the `try` scope won't be available in the `catch` scope, and so on, leading to scoping compromises (like declaring variables before the `try` and mutating them in later scopes) and nasty, messy, hard-to-follow code with masses of boilerplate that goes on and on for pages whilst actually doing very little. Yuk. The solution is `attempt` or `attemptPromise`. Voila. You're welcome.
