

# PIP 
package manger for python
- used to install, manage, uninstall packages from PyPI (Python Package Index)

We can install packages using a file called requirements.txt

- `requirements.txt` contains names of the packages/libs needed for your project

---

Example:
Started Project-1 Oct 2025
You build an API using flask, pandas, openai, langchain

- Create a virtual env called .venv
- activate the .venv
- Install all the required packages into that env

---
Started Project-2 Oct 2025
You build an API using fastapi, uvicorn, 

---

NOTES:
- Each venv is isolated!
- Always gitignore your venv


---

## Essential Commands

1. create virtual env

```sh
python -m venv nameOfVirtualEnv
python -m venv .venv

python -m venv .venv4fastapi

```
2. activate virtual env

```sh
./.venv/Scripts/activate

```


3. Install packages of your choice into the newly created env

```sh
pip install fastapi uvicorn
```

4. create a requirements.txt

```sh
pip freeze > requirements.txt
```

