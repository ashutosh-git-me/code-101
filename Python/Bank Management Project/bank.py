import json
import random
import string
from pathlib import Path


class Bank:

    def __init__(self):
        self.database = "data.json"
        self.data = self.load_data()

    # ==========================
    # Database Functions
    # ==========================

    def load_data(self):
        if Path(self.database).exists():
            try:
                with open(self.database, "r") as file:
                    return json.load(file)
            except json.JSONDecodeError:
                return []
        return []

    def save_data(self):
        with open(self.database, "w") as file:
            json.dump(self.data, file, indent=4)

    # ==========================
    # Helper Functions
    # ==========================

    def generate_account(self):
        while True:

            alpha = random.choices(string.ascii_uppercase, k=3)
            nums = random.choices(string.digits, k=3)
            special = random.choice("!@#$%^&*")

            account = alpha + nums + [special]
            random.shuffle(account)

            account = "".join(account)

            if not any(user["accountNo."] == account for user in self.data):
                return account

    def find_user(self, account, pin):

        for user in self.data:

            if user["accountNo."] == account and user["pin"] == int(pin):
                return user

        return None

    # ==========================
    # Create Account
    # ==========================

    def create_account(self, name, age, email, pin):

        if not name.strip():
            return False, "Name cannot be empty."

        if age < 18:
            return False, "Age must be at least 18."

        if len(str(pin)) != 4 or not str(pin).isdigit():
            return False, "PIN must contain exactly 4 digits."

        account = self.generate_account()

        user = {
            "name": name,
            "age": age,
            "email": email,
            "pin": int(pin),
            "accountNo.": account,
            "balance": 0
        }

        self.data.append(user)
        self.save_data()

        return True, account

    # ==========================
    # Deposit
    # ==========================

    def deposit(self, account, pin, amount):

        user = self.find_user(account, pin)

        if not user:
            return False, "Account Not Found."

        if amount <= 0:
            return False, "Invalid Deposit Amount."

        if amount > 100000:
            return False, "Deposit limit is ₹100000."

        user["balance"] += amount

        self.save_data()

        return True, user["balance"]

    # ==========================
    # Withdraw
    # ==========================

    def withdraw(self, account, pin, amount):

        user = self.find_user(account, pin)

        if not user:
            return False, "Account Not Found."

        if amount <= 0:
            return False, "Invalid Withdrawal Amount."

        if amount > 50000:
            return False, "Withdrawal limit is ₹50000."

        if amount > user["balance"]:
            return False, "Insufficient Balance."

        user["balance"] -= amount

        self.save_data()

        return True, user["balance"]

    # ==========================
    # Show Details
    # ==========================

    def show_details(self, account, pin):

        user = self.find_user(account, pin)

        if not user:
            return False, "Account Not Found."

        details = user.copy()

        details.pop("pin")

        return True, details

    # ==========================
    # Update Details
    # ==========================

    def update_details(self, account, pin, name="", email="", new_pin=""):

        user = self.find_user(account, pin)

        if not user:
            return False, "Account Not Found."

        if name.strip():
            user["name"] = name

        if email.strip():
            user["email"] = email

        if str(new_pin).strip():

            if len(str(new_pin)) != 4 or not str(new_pin).isdigit():
                return False, "PIN must be exactly 4 digits."

            user["pin"] = int(new_pin)

        self.save_data()

        return True, "Details Updated Successfully."

    # ==========================
    # Delete Account
    # ==========================

    def delete_account(self, account, pin):

        user = self.find_user(account, pin)

        if not user:
            return False, "Account Not Found."

        self.data.remove(user)

        self.save_data()

        return True, "Account Deleted Successfully."