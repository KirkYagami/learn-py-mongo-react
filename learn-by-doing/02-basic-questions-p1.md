---
# Part 1

## Functions

1. Write a function `greet(name)` that returns `"Hello, <name>!"`. Call it with your name.

2. Write a function `is_even(n)` that returns `True` if `n` is even, `False` otherwise.

3. Write a function `factorial(n)` that returns the factorial of `n` using recursion.

4. Write a function `max_of_three(a, b, c)` that returns the largest of three numbers without using `max()`.

5. Write a function `count_vowels(s)` that returns the number of vowels in a string.

6. Write a function with a default parameter: `power(base, exp=2)` that returns `base` raised to `exp`.

7. Write a function `summarize(*args)` that accepts any number of integers and returns their sum and average as a tuple.

8. Write a function that accepts `**kwargs` and prints each key-value pair on a new line.

---

## Lambda Expressions

9. Write a lambda that takes two numbers and returns their product. Assign it to a variable and call it.

10. Use a lambda with `sorted()` to sort this list of tuples by the second element:
```python
    pairs = [(1, 'banana'), (2, 'apple'), (3, 'cherry')]
```

11. Use `map()` with a lambda to square every number in `[1, 2, 3, 4, 5]`.

12. Use `filter()` with a lambda to keep only strings longer than 4 characters from:
```python
    words = ["hi", "hello", "hey", "howdy", "yo"]
```

13. Use `sorted()` with a lambda to sort this list of dicts by `"age"`:
```python
    people = [{"name": "Alice", "age": 30}, {"name": "Bob", "age": 25}, {"name": "Carol", "age": 35}]
```

---

## Comprehensions

14. Use a list comprehension to generate a list of squares for numbers 1 through 10.

15. Use a list comprehension with a condition to extract all odd numbers from `range(1, 21)`.

16. Use a list comprehension to flatten this nested list:
```python
    matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
```

17. Use a dictionary comprehension to create a dict mapping each word to its length from:
```python
    words = ["python", "is", "awesome"]
```

18. Use a set comprehension to get unique first letters from:
```python
    fruits = ["apple", "avocado", "banana", "blueberry", "cherry", "apricot"]
```

19. Use a generator expression inside `sum()` to compute the sum of squares of even numbers from 1 to 20.

20. **Challenge:** Combine a function and comprehension — write a function `transform(lst)` that uses a list comprehension to return a new list where each string is stripped of spaces and converted to uppercase.
```python
    transform(["  hello ", " world", "python  "])
    # Expected: ['HELLO', 'WORLD', 'PYTHON']
```