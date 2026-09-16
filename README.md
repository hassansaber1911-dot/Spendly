# Spendly

A simple mobile-first personal finance prototype for tracking monthly income, expenses, savings and category budgets.

## V1
- First-time name onboarding and quick tutorial
- Monthly income
- Expenses by date
- Savings kept separate from expenses
- Main categories: Fixed Fees, Transportation, Food, Family, Shopping, Entertainment, Installments
- User-created subcategories saved for future dropdown selection
- Monthly category budgets
- Dashboard: Income, Expenses, Savings, Remaining
- Spending by category
- Date-range transaction history
- Edit and delete old transactions
- Mobile-first responsive UI

**Available Balance = Income - Expenses - Savings**

V1 stores data in browser Local Storage, so data is device/browser-specific.


## V1.1 improvements
- Larger bottom navigation action icons
- One searchable/typeable Subcategory field; newly entered values are saved for future use
- Transactions grouped by main category with expandable category rows
- Home dashboard supports custom date ranges across multiple months
- Budgets now use explicit Edit and Save actions

## V1.2 fixes
- Subcategory is optional for expenses
- One typeable Subcategory field with saved suggestions
- Multiple income entries supported
- Income source is optional
- Income entries can be edited or deleted and changes persist
- Transaction screen shows total expenses for the selected date range
- Category expense totals are more prominent

## V1.3 validation fixes
- Date filters now reject a From date later than the To date
- Date inputs dynamically constrain each other with min/max values
- This Month explicitly resets the Home filter to the first and last calendar day of the selected month
- The same date-range validation is applied to Transactions


## V1.4 visual update
- Replaced black primary actions with a consistent indigo/blue brand color
- Automatic Light/Dark Mode based on the phone or browser setting
- Separate semantic colors for income/savings, expenses, and warnings
- Improved active navigation, input focus, button, card, and progress-bar contrast


## V1.5 visual update
- Lighter fresh-green primary color
- Warm off-white / ivory background instead of dark styling
- Soft green hero treatment
- Light cards, navigation, inputs, and subtle shadows for clearer mobile contrast
