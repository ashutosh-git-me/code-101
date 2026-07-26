import streamlit as st
from bank import Bank

# ---------------------------------------
# Streamlit Page Configuration
# ---------------------------------------

st.set_page_config(
    page_title="Bank Management System",
    page_icon="🏦",
    layout="centered"
)

bank = Bank()

st.title("🏦 Bank Management System")

st.markdown("---")

menu = st.sidebar.selectbox(
    "Select Operation",
    (
        "Create Account",
        "Deposit Money",
        "Withdraw Money",
        "Account Details",
        "Update Details",
        "Delete Account"
    )
)

# ====================================================
# CREATE ACCOUNT
# ====================================================

if menu == "Create Account":

    st.header("Create New Account")

    name = st.text_input("Full Name")

    age = st.number_input(
        "Age",
        min_value=18,
        max_value=100,
        step=1
    )

    email = st.text_input("Email")

    pin = st.text_input(
        "4 Digit PIN",
        type="password",
        max_chars=4
    )

    if st.button("Create Account"):

        success, result = bank.create_account(
            name,
            age,
            email,
            pin
        )

        if success:
            st.success("Account Created Successfully.")
            st.info(f"Your Account Number: **{result}**")

        else:
            st.error(result)

# ====================================================
# DEPOSIT
# ====================================================

elif menu == "Deposit Money":

    st.header("Deposit Money")

    account = st.text_input("Account Number")

    pin = st.text_input(
        "PIN",
        type="password"
    )

    amount = st.number_input(
        "Deposit Amount",
        min_value=1
    )

    if st.button("Deposit"):

        success, result = bank.deposit(
            account,
            pin,
            amount
        )

        if success:

            st.success("Deposit Successful")

            st.metric(
                "Updated Balance",
                f"₹ {result}"
            )

        else:
            st.error(result)

# ====================================================
# WITHDRAW
# ====================================================

elif menu == "Withdraw Money":

    st.header("Withdraw Money")

    account = st.text_input("Account Number")

    pin = st.text_input(
        "PIN",
        type="password"
    )

    amount = st.number_input(
        "Withdrawal Amount",
        min_value=1
    )

    if st.button("Withdraw"):

        success, result = bank.withdraw(
            account,
            pin,
            amount
        )

        if success:

            st.success("Withdrawal Successful")

            st.metric(
                "Remaining Balance",
                f"₹ {result}"
            )

        else:
            st.error(result)

# ====================================================
# ACCOUNT DETAILS
# ====================================================

elif menu == "Account Details":

    st.header("View Account")

    account = st.text_input("Account Number")

    pin = st.text_input(
        "PIN",
        type="password"
    )

    if st.button("Show Details"):

        success, result = bank.show_details(
            account,
            pin
        )

        if success:

            st.success("Account Found")

            st.json(result)

        else:

            st.error(result)

# ====================================================
# UPDATE DETAILS
# ====================================================

elif menu == "Update Details":

    st.header("Update Details")

    account = st.text_input("Account Number")

    pin = st.text_input(
        "Current PIN",
        type="password"
    )

    st.write("Leave any field blank if you don't want to update it.")

    new_name = st.text_input("New Name")

    new_email = st.text_input("New Email")

    new_pin = st.text_input(
        "New PIN",
        type="password",
        max_chars=4
    )

    if st.button("Update"):

        success, result = bank.update_details(
            account,
            pin,
            new_name,
            new_email,
            new_pin
        )

        if success:

            st.success(result)

        else:

            st.error(result)

# ====================================================
# DELETE ACCOUNT
# ====================================================

elif menu == "Delete Account":

    st.header("Delete Account")

    st.warning("This operation cannot be undone.")

    account = st.text_input("Account Number")

    pin = st.text_input(
        "PIN",
        type="password"
    )

    confirm = st.checkbox(
        "I understand that this will permanently delete my account."
    )

    if st.button("Delete Account"):

        if not confirm:

            st.warning("Please confirm deletion first.")

        else:

            success, result = bank.delete_account(
                account,
                pin
            )

            if success:

                st.success(result)

            else:

                st.error(result)