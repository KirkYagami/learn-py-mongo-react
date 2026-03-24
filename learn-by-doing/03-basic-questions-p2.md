# Part 2
## Functions

1. Write a function `memoize(fn)` that takes a function and returns a memoized version of it using a dictionary to cache results. Test it with a fibonacci function.

2. Write a function `flatten(lst)` that recursively flattens an arbitrarily nested list:
```python
flatten([1, [2, [3, [4]], 5], 6])
# Expected: [1, 2, 3, 4, 5, 6]
```

3. Write a decorator `timer` that measures and prints how long a function takes to execute. Apply it to a function that computes the sum of `range(1_000_000)`.

4. Write a closure: a function `make_multiplier(n)` that returns a function which multiplies its argument by `n`.
```python
triple = make_multiplier(3)
triple(7)  # Expected: 21
```

5. Write a function `compose(*fns)` that takes multiple functions and returns a new function that applies them right-to-left (like mathematical composition).
```python
double = lambda x: x * 2
add_one = lambda x: x + 1
f = compose(double, add_one)
f(4)  # Expected: 10  →  double(add_one(4))
```

6. Write a generator function `running_average()` that yields the cumulative average as numbers are sent into it using `send()`.

---

## Lambda Expressions

7. Use `reduce()` from `functools` with a lambda to find the product of all elements in a list.
```python
nums = [1, 2, 3, 4, 5]  # Expected: 120
```

8. Sort the following list of strings by the number of unique characters they contain, using a lambda:
```python
words = ["apple", "banana", "kiwi", "cherry", "fig"]
```

9. Use nested `map()` and `filter()` with lambdas to:
- Keep only lists that have more than 2 elements
- Then square the last element of each remaining list
```python
data = [[1, 2], [3, 4, 5], [6], [7, 8, 9]]
```

10. Use a lambda with `sorted()` to sort a list of version strings numerically:
```python
versions = ["1.10.0", "1.9.1", "2.0.0", "1.9.2"]
# Expected: ["1.9.1", "1.9.2", "1.10.0", "2.0.0"]
```

---

## Comprehensions

11. Use a dict comprehension to invert a dictionary (swap keys and values). Handle the case where values may not be unique by mapping each value to a list of keys.
```python
d = {"a": 1, "b": 2, "c": 1, "d": 3}
# Expected: {1: ["a", "c"], 2: ["b"], 3: ["d"]}
```

12. Use a nested list comprehension to generate all Pythagorean triplets `(a, b, c)` where `a`, `b`, `c` are all ≤ 20.

13. Use a comprehension to build a dict of `{word: count}` for words that appear more than once in this list:
```python
words = ["the", "cat", "sat", "on", "the", "mat", "the", "cat"]
# Expected: {"the": 3, "cat": 2}
```

14. Use a list comprehension to transpose a matrix (without using `zip`):
```python
matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
# Expected: [[1, 4, 7], [2, 5, 8], [3, 6, 9]]
```

15. **Challenge:** Write a function `group_by(lst, key_fn)` that uses a dict comprehension (or equivalent) to group elements of `lst` by the result of applying `key_fn` to each element.
```python
group_by(["one", "two", "three", "four", "five"], len)
# Expected: {3: ["one", "two"], 5: ["three", "four"], 4: ["five"]}  ← order may vary
```