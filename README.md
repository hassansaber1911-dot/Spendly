# Spendly

**A mobile-first personal finance and budgeting app for understanding where your money goes — without turning budgeting into a spreadsheet.**

Spendly is a working product prototype designed around a simple monthly money model: record income, track expenses, separate savings, set category budgets, and immediately understand what is still available to spend.

> **Available Balance = Income − Expenses − Savings**

## Product Overview

Personal finance tools can become complicated quickly. For someone who mainly wants to answer _“How much did I earn, spend, save, and what is left?”_, that complexity creates friction.

Spendly focuses on that core job with a lightweight mobile-first experience. The product keeps savings separate from expenses, supports multiple income entries, and gives users both a high-level financial snapshot and category-level spending visibility.

## The Problem

People often track money across notes, banking apps, spreadsheets, or not at all. This makes a few basic questions surprisingly difficult:

- How much money is actually available after expenses and savings?
- Which categories are consuming the budget?
- Am I over budget in a specific category?
- What did I spend during a particular period?
- Can I keep savings visible without treating them as spending?

Spendly brings those questions into one focused flow.

## Core Experience

### Dashboard
- Income, expenses, savings, and remaining balance in one view
- Custom date ranges, including periods spanning multiple months
- Spending by category with budget progress and overspend visibility
- Recent transactions for quick review

### Income
- Multiple income entries
- Date and amount tracking
- Optional income source
- Edit and delete existing income records

### Expenses & Savings
- Add expenses by date
- Track savings separately from expenses
- Seven main spending categories: Fixed Fees, Transportation, Food, Family, Shopping, Entertainment, and Installments
- Optional reusable subcategories
- Optional transaction notes
- Edit or delete previous transactions

### Budgets
- Monthly category-level budgets
- Planned vs. actual spending
- Remaining budget or over-budget indication
- Explicit edit/save flow to reduce accidental changes

### Transaction History
- Filter by date range
- Expenses grouped by category
- Category totals at a glance
- Expand categories to inspect individual transactions

## Product Decisions

A few deliberate choices shape the current MVP:

**Savings are not expenses.** Saving money reduces the amount available to spend, but it should not inflate the user's expense total.

**Subcategories are created in context.** Users can type a subcategory while recording a transaction. New values are remembered for future use, avoiding a separate setup screen.

**The product is mobile-first.** The primary interaction model is designed for quick everyday entry from a phone, with bottom navigation and compact transaction flows.

**Date ranges are flexible.** Users can analyze one month or a custom period across multiple months instead of being locked into a monthly dashboard.

**Budgets are optional.** Spendly still works as a tracker when no category budget has been configured.

## User Flow

1. Complete the lightweight onboarding and enter a name.
2. Add one or more income entries.
3. Record expenses or savings as they happen.
4. Optionally define monthly budgets by category.
5. Use the dashboard to understand available balance and category performance.
6. Review, filter, edit, or delete historical transactions.

## Current MVP Scope

Spendly currently runs entirely in the browser and stores user data in **Local Storage**. Data therefore stays specific to that browser/device and there is currently no account sync or cloud backup.

This implementation is intentionally lightweight: it validates the core product experience before adding authentication, backend infrastructure, bank integrations, or other higher-cost capabilities.

## Analytics & Product Measurement

The prototype includes privacy-conscious GA4 event tracking for key product interactions, including:

- Onboarding completion
- Income added, edited, and deleted
- Expenses and savings added
- Transactions edited and deleted
- Budgets saved
- Date filters applied
- Category expansion

Free-text financial context such as the user's name, transaction notes, income source, and subcategory text is not included in analytics events.

## Tech Stack

- HTML
- CSS
- Vanilla JavaScript
- Browser Local Storage
- Google Analytics 4
- GitHub Pages-ready static architecture

The intentionally small stack keeps the prototype fast to iterate, easy to inspect, and inexpensive to host.

## Product Roadmap

Potential next steps after validating the MVP:

- User authentication and secure cloud sync
- Multi-device access and backup
- Recurring income and expenses
- Custom spending categories
- Goals and richer savings planning
- Monthly insights and spending trends
- Data export/import
- Arabic localization
- PWA installation and offline improvements
- Optional integrations with financial data sources

These are roadmap opportunities rather than claims about the current product.

## Status

**Working MVP / product prototype.**

The current version supports the complete core loop of adding income, recording expenses and savings, setting category budgets, reviewing transaction history, and understanding the remaining available balance.

## About This Project

Spendly was built as an end-to-end product exercise: identifying a focused personal-finance problem, defining an MVP, iterating on usability, implementing the working prototype, and adding product analytics to support future validation.

---

**Built by Hassan Mohamed Saber**
