# Refactoring

You've been asked to refactor the function `deterministicPartitionKey` in [`dpk.js`](dpk.js) to make it easier to read and understand without changing its functionality. For this task, you should:

1. Write unit tests to cover the existing functionality and ensure that your refactor doesn't break it. We typically use `jest`, but if you have another library you prefer, feel free to use it.
2. Refactor the function to be as "clean" and "readable" as possible. There are many valid ways to define those words - use your own personal definitions, but be prepared to defend them. Note that we do like to use the latest JS language features when applicable.
3. Write up a brief (~1 paragraph) explanation of why you made the choices you did and why specifically your version is more "readable" than the original.

You will be graded on the exhaustiveness and quality of your unit tests, the depth of your refactor, and the level of insight into your thought process provided by the written explanation.

## Your Explanation Here
- First of all, I replaced the CommonJS "require" clause with the ECMAScript "import" sentence, because it's clearer and we don't need to import the whole crypto library, just the create hash algorithm.
- Then, I created the unit tests for the parts without test coverage.
- Then, I realized that the code is checking `if (candidate)`, and candidate is only set at that time when event is provided. Also, if candidate is not set, then it's setting the trivial value.
- Then, I realized that if `event` is not provided, then trivial key is returned.
- Then, I realized that if `event` and `event.partitionKey` is provided, then that's the one being used. If it's not a string, then first it's transformed to string. And then, if it's too big, then it's re-hashed.
- If `event` is provided but `partitionKey` is NOT provided, then the event is stringified as JSON and then hashed. So I simplified the code to have only 3 returns.
- Also, abstracted the logic to create the hash into a single function called `hashData()` to re-use it.
