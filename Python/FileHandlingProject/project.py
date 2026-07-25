from pathlib import Path
import os
def readFileAndFolder():
    path = Path('') #current folder path
    items = list(path.rglob('*')) #all files in current directory
    for i, items in enumerate(items):
        print(f"{i+1} : {items}")


def createfile():
    try:
        readFileAndFolder()
        name = input("Enter file Name: ")
        p = Path(name)
        if not p.exists():
            with open(p,"w") as fs:
                    data = input("Enter the file Content: ")
                    fs.write(data)
                    
            print("File Created Succesfully.")

        else: 
            print("File already Exists.")
            
    except Exception as err:
        print(f"An exception occured as {err}")

def readfile():
    try:
        readFileAndFolder()
        name = input("Enter file name: ")
        p = Path(name)
        if p.exists() and p.is_file():
            with open(p,"r") as fs:
                data = fs.read()
                print(data)
            print("Read Scuccesfully.")
        else: 
            print("File does NOT Exists.")
    except Exception as err:
        print(f"An exception occured as {err}")

def updatefile():
    readFileAndFolder()
    name = input("Enter file name: ")
    p = Path(name)
    if p.exists() and p.is_file():
        print("press n to change NAME:")
        print("press o for OVERWRITING:")
        print("press a for APPENDING")

        res = input("Submit response: ")

        if res == 'n':
            new = input("Enter new Name: ")
            p2 = Path(new)
            p.rename(p2)

        if res == 'o':
            with open(p, 'w') as fs:
                data = input("Enter new content: ")
                fs.write(data)

        if res == 'a':
            with open(p,'a') as fs:
                data = input("Enter extra content: ")
                fs.write(" "+data)

def deletefile():
    readFileAndFolder()
    name = input("Enter file name to DELETE: ")
    p = Path(name)
    if p.exists() and p.is_file():
        os.remove(p)
        print("File Deleted Succesfully.")

    else:
        print("File does NOT Exists.")

        

print("press c for creating a file")
print("press r for reading a file")
print("press u for updating a file")
print("press d for deleting a file")

check = input("Submit response: ")
if check == 'c':
    createfile()

if check == 'r':
    readfile()

if check == 'u':
    updatefile()

if check == 'd':
    deletefile()