# MAST-Part-3

Duncan Khoza
ST105309345

This application provides restaurant chefs with a centralized dark-themed workspace dashboard to dynamically capture, manage, search, filter, and monitor live metrics of an active culinary menu directory.

Features & Assignment Rubric Mapping

1.  Manage Menu Items

*   Create: Dynamic form fields collect structured data (Dish Name, Description, Course Category, and Price) for new menu items.
*   Read: Custom directory cards output item names, prices in South African Rand (ZAR), category tags, and descriptions.
*   Update: Selecting the Edit trigger shifts the form context to edit-mode, populating initial input states and enabling real-time attribute modifications on existing items without duplicate array entries.
*   Delete: Destructive dismissal prompts verify active removal workflows, permanently stripping objects from state maps on confirmation.

2.  Search and Filter Menu Items

*   Dynamic Search: A text search algorithm filters entries dynamically by dish name in real time as the chef types.
*   Category Filtration: Custom course buttons filter visible rows down exclusively to Starter, Main Course, or Dessert.
*   State Reset: A unified clear mechanism instantly drops query states to restore full list views cleanly.

3.  Display Menu Statistics

*   Item Count: Monitors master repository sizing values in real time to show total available items.
*   Average Costing: Dynamically recalculates global menu cost averages across changing directories.
*   Categorical Totals: Real-time item count distributions displayed distinctly across all three course groups (Starters, Mains, and Desserts).

4.  UI/UX Optimization

*   Input Validation: Strict data verification rules block empty text fields or invalid/negative price types, preventing application errors.
*   Alert Framework: Explicit confirmation popups and native alert dialogs ensure reliable user workflows and successful action tracking.
*   Theming & Layout: Styled with a sleek, high-contrast dark theme matching the original application wireframes. Wrapped in responsive container configurations to prevent layout breaking when soft-keyboards activate.

Architecture & Tech Stack

*   Framework: React Native (Core UI Architecture Components)
*   Language: JavaScript (ES6+)
*   State Containers: React Hooks (useState, useMemo) for performant data computing and instant layout updates without manual re-renders.

Getting Started

Prerequisites
Ensure you have Node.js installed alongside the Expo CLI (or standard React Native developer workspace configurations).

Installation & Run Steps

1.  Clone or extract the project codebase to your local directory.
2.  Open your terminal inside the project root path and install dependency packages:
npm install
3.  Initialize the development server:
npx expo start
4.  Open the application using Expo Go on a physical Android/iOS smartphone, or run it via an established emulator setup.

