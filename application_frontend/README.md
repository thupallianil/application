# Invoice Management System (Frontend)

A modern, responsive, and robust React-based frontend application for managing clients, quotations, invoices, and payments. This application incorporates role-based layouts, robust routing structure, and sleek UI/UX powered by Tailwind CSS v4 and Lucide React icons.

## 🚀 Key Features

- **Dynamic Dashboards**: View intuitive metrics and analytics like profit and loss, sales reports, and expenses.
- **Client Management**: Add, view, edit, and keep track of your client data in an organized table with pagination.
- **Quotation & Invoicing System**: Create and manage detailed quotations and turn them into invoices quickly.
- **Payment Handling**: Log different modes of payments against invoices.
- **Application Settings**: Extensive configurations including Business Settings, Quotes, Taxes, Emails, Custom PDFs, Translations, and Dark Mode toggles.
- **Role-Based Layouts**: Separate secure layouts for public authentication pages vs private admin dashboard sections.

## 📁 Project Structure

The project has been scaled effectively into logical separations of components, layouts, and route definitions.

```text
src/
├── components/          # Reusable UI elements (Navbar, Sidebar, Pagination, Card, Searchbar, Tables)
├── layouts/             # Page Wrappers
│   ├── AdminLayout.jsx  # Primary wrapper containing the Sidebar and top Navbar
│   └── ClientLayout.jsx # Barebones wrapper for unauthenticated/public pages
├── pages/
│   ├── auth/            # Login, Forgot Password interactions
│   ├── dashboard/       # Main overview dashboard
│   ├── clients/         # Client management modules
│   ├── invoices/        # Invoice creation, details, list views
│   ├── payments/        # Payments tracking tables and creation forms
│   ├── quotations/      # Quotations generation forms
│   ├── reports/         # Dynamic metric tables (Sales, Tax, Expenses)
│   ├── settings/        # Complete admin settings for business profile, taxes, emails
│   ├── profile/         # Logged in User's profile configuration and password updates
│   └── errors/          # 404 Not Found, 403 Unauthorized, 500 Server Error pages
├── routes/
│   └── AppRoutes.jsx    # Complete React Router v6 DOM mappings (Unused, abstracted to App.jsx for rapid rendering)
├── App.jsx              # Main React Router definitions wrapping layouts and routes
└── main.jsx             # React DOM root entry point
```

## 🛠️ Tech Stack

- **React 19**
- **Vite** (Build Tool) 
- **React Router DOM 7** (Routing)
- **Tailwind CSS v4** (Styling engine)
- **Lucide React** (Modern standard icons)

## 💻 Running Locally

To run this frontend on your local development environment, follow these steps:

1. Step into the frontend repository:
   ```bash
   cd application_frontend
   ```

2. Install standard dependencies:
   ```bash
   npm install
   ```
   
3. Start the local development server utilizing Vite:
   ```bash
   npm run dev
   ```

4. You can see the application running completely live at `http://localhost:5173` (or the network port specified in the CLI).

## 🔒 Security & Scaling

The separation of layouts allows easy injection of JWT Token validators inside `<AdminLayout />` ensuring malicious entities cannot step into valid admin modules without authentication.
