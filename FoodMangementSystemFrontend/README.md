Food Management System – Frontend (React + Pure CSS)

Sleek, mobile-first UI for managing restaurant orders, tables, chefs, and kitchen workflows. Integrated seamlessly with the Node.js backend.


Project Structure

FoodManagementSystem/
├── frontend/
│   ├── public/                 # Static files and index.html
│   ├── src/
│   │   ├── components/         # Reusable UI components 
│   │   ├── Pages/              # App Pages (Dashboard, Orders, Tables, etc.)
│   │   ├── App.js              # Main app router
│   │   ├── index.js            # Entry point
│   └── package.json



TECH STACK

| Tech                   | Purpose                            |
| ---------------------- | ---------------------------------- |
| React.js               | UI library                         |
| React Router           | SPA routing                        |
| Axios                  | API requests                       |
| Pure CSS               | Clean, custom mobile-first styling |
| Context API (optional) | Global state mgmt                  |



Features
- Fully mobile-responsive UI

- Cart management with item selection & price calculation

-Order history and live kitchen updates

-Chef status and current workload view

-Table availability and status visualization

-Cooking instructions and order notes

-Checkout summary and order confirmation

-Light-weight, fast-loading pages

-Works on all screen sizes (built mobile-first)

UI Screens
- Menu Screen – tap to add/remove items

-Cart Summary – shows total + quantity

-Chef Dashboard – order assignment

-Table View – booked/free tables

-Admin Dashboard – analytics graph and other metrics


INSTALLATION AND SETUP

# Step 1: Clone the Fronted Repo
git clone https://github.com/TechExplorerSam/FoodMangementSystemFrontend.git

# Step 2: Navigate to frontend
cd FoodManagementSystem/frontend

# Step 3: Install dependencies
npm install

# Step 4: Run the app
npm run start


Sample Flow
User selects Dine-In or Takeaway

Adds items from Menu

Checkout shows cart summary + instructions

Order gets created and sent to backend

Chef sees assigned order in their dashboard

Admin monitors analytics in real-time





