"""
1. Account Creation
2. Money Deposit
3. Money Withdrawal
4. Details
5. Update Details
6. Delete Account
"""
import json
import random
import string
from pathlib import Path

class Bank():

    database = 'data.json'
    data = []

    try:
        if Path(database).exists():
            with open(database,'r') as fs:
                data = json.loads(fs.read())
        else:
            print("No Such File Exists")

    except Exception as err:
        print(f"An ERROR occured as {err}")

    @staticmethod
    def __update():
        with open(Bank.database,'w') as fs:
            fs.write(json.dumps(Bank.data))

    """Alternatively
    @classmethod
        def update(cls):
            with open(cls.database,'w') as fs:
                fs.write(json.dumps(cls.data))
    """

    @classmethod
    def __accountGenerate(cls):
        alpha = random.choices(string.ascii_letters, k = 3)
        num = random.choices(string.digits, k = 3)
        spchar = random.choices("!@#$%^&*", k = 1)
        id = alpha + num + spchar
        random.shuffle(id)
        return "".join(id)



    
    def createAccount(self):
        info = {
            "name":input("Name: "),
            "age":int(input("Age: ")),
            "email":input("E-Mail: "),
            "pin":int(input("Pin(4 Digits): ")),
            "accountNo.": Bank.__accountGenerate(),
            "balance": 0
        }

        if info['age'] < 18 or len(str(info['pin'])) != 4:
            print("Sorry you can't create an account.")
        else:
            print("Account Created Succesfully.")
            for i in info:
                print(f"{i}:{info[i]}")
            print("Note Your Account No.")

            Bank.data.append(info)

            Bank.__update()

    def deposit(self):
        ac = input("Enter Your Account Number: ")
        pn = int(input("Enter Pin: "))

        userdata = [i for i in Bank.data if i['accountNo.'] == ac and i['pin'] == pn]

        if userdata == False:
            print("Account Not Found.")

        else:
            amount = int(input("Enter Deposit Amount: "))

            if amount>100000 or amount <0:
                print("Large Deposit(>1Lkhs) and Sub Zero Deposit(<0) not Allowed")

            else:
                userdata[0]['balance'] += amount
                Bank.__update()
                print(f"{amount}Rs. Deposited Succesfully.")

    def withdraw(self):
        ac = input("Enter Your Account Number: ")
        pn = int(input("Enter Pin: "))

        userdata = [i for i in Bank.data if i['accountNo.'] == ac and i['pin'] == pn]

        if userdata == False:
            print("Account Not Found.")

        else:
            amount = int(input("Enter Withdraw Amount: "))

            if amount>userdata[0]['balance']:
                print("Not Enough Balance.")
        
            elif amount>50000 or amount <0:
                print("Large Withdrawal(>50K) and Sub Zero Withdrawal(<0) not Allowed")
        
            else:
                userdata[0]['balance'] -= amount
                Bank.__update()
                print(f"{amount}Rs. Withdrawn Succesfully.")
                print(f"Remaining Balance: {userdata[0]['balance']}Rs.")

    def showDetail(self):
        ac = input("Enter Your Account Number: ")
        pn = int(input("Enter Pin: "))
        
        userdata = [i for i in Bank.data if i['accountNo.'] == ac and i['pin'] == pn]

        if not userdata:
            print("Account Not Found.")
        
        else:
            print("Your Account Details:\n\n")
            for i in userdata[0]:
                print(f"{i}:{userdata[0][i]}")

    def updateDetail(self):
        ac = input("Enter Your Account Number: ")
        pn = int(input("Enter Pin: "))
                
        userdata = [i for i in Bank.data if i['accountNo.'] == ac and i['pin'] == pn]

        if not userdata:
            print("Account Not Found.")

        else: 
            print("NOT ALLOWED TO CHANGE" \
            "Account No." \
            "Age" \
            "Account Balance\n\n")

            print("Fill the Details & Leave other fields Empty.")
            newdata = {
                "name":input("Enter New Name (Enter to skip): "),
                "email":input("New Email (Enter to skip): "),
                "pin":input("New Pin (Enter to skip): ")
            }

            if newdata["name"] == "":
                newdata["name"] == userdata[0]["name"] 

            if newdata["email"] == "":
                newdata["email"] == userdata[0]["email"] 

            if newdata["pin"] == "":
                newdata["pin"] == userdata[0]["pin"] 

            newdata["age"] = userdata[0]["age"]
            newdata["accountNo."] = userdata[0]["accountNo."]
            newdata["balance"] = userdata[0]["balance"]

            if type(newdata["pin"]) == str:
                newdata["pin"] = int(newdata["pin"])

            for i in newdata:
                if newdata[i] == userdata[0][i]:
                    continue
                else:
                    userdata[0][i] = newdata[i]

            Bank.__update()
            print("Details updated succesfully.")

    def delete(self):
        ac = input("Enter Your Account Number: ")
        pn = int(input("Enter Pin: "))
                        
        userdata = [i for i in Bank.data if i['accountNo.'] == ac and i['pin'] == pn]

        if not userdata:
            print("Account Not Found.")

        else:
            check = input("Type Y to confirm else press any other key to abort: ")
            if check == "Y" or check == "y":
                index = Bank.data.index(userdata[0])
                Bank.data.pop(index)
                print("Account Deleted Succesfully.")
                Bank.__update()

            else : 
                print("Process Aborted.")





user = Bank()

print("Press 1 for Account Creation:")
print("Press 2 for Money Deposit:")
print("Press 3 for Money Withdrawal:")
print("Press 4 for Account Details:")
print("Press 5 for Account Update:")
print("Press 6 for Account Deletion:")

check = int(input("Submit Your Response: "))
if check == 1:
    user.createAccount()

if check == 2:
    user.deposit()

if check == 3:
    user.withdraw()

if check == 4:
    user.showDetail()

if check == 5:
    user.updateDetail()

if check == 6:
    user.delete()
