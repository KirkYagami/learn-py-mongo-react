"""
module doc strings
"""

# basics, data strs, lambda, functions, exception handling

# file handling
    # open files, write/create files, read the content, delete
    # append info into the file


import os

# open(path, mode)




path = 'data\sample.txt'

file = open(path, 'r')
content = file.read()
file.close()
print(content)

print('='*60)


# context managers
with open(path, 'r') as f:
    print(f.read())

# get cwd
curr_dir = os.getcwd()
print("cwd: ", curr_dir)

# create a single dir
# os.mkdir('utils')
os.makedirs('utils', exist_ok=True)

os.makedirs('utils/transformations/google_places', exist_ok=True)
os.makedirs('utils/tf2/tripadvisor', exist_ok=True)

# shutil - file operations
import shutil

shutil.rmtree('utils')

# TASK - do some reading on shutil

# rename a file
os.rename("data\sample.txt", "data\sample-v2.txt")



