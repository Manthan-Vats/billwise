<div align="center">

# BILLWISE

*Simplify Sharing, Maximize Savings, Empower Group Finances*

![version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![typescript](https://img.shields.io/badge/typescript-5.0.0+-blue.svg)
![react](https://img.shields.io/badge/react-18.2.0-blue.svg)

Built with the tools and technologies:

![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat&logo=supabase&logoColor=white)

![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=flat&logo=framer&logoColor=white)
![Lucide React](https://img.shields.io/badge/Lucide_React-FFD43B?style=flat&logo=lucide&logoColor=black)
![date-fns](https://img.shields.io/badge/date--fns-000000?style=flat&logo=date-fns&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=flat&logo=react-router&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-FF6384?style=flat&logo=chart.js&logoColor=white)

![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=flat&logo=eslint&logoColor=white)
![Prettier](https://img.shields.io/badge/Prettier-F7B93E?style=flat&logo=prettier&logoColor=black)

</div>

## Table of Contents

- [Overview](#overview)
- [Getting Started](#getting-started)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Testing](#testing)

## Overview

BillWise is a modern, open-source web application designed to simplify group expense sharing and debt management. Built with React, Vite, and TypeScript, it offers a seamless experience for tracking, splitting, and settling expenses among multiple users.

![BillWise Dashboard](https://i.imgur.com/example-dashboard.png)

### Why BillWise?

This project provides a robust solution for managing group expenses with real-time updates. The core features include:

**🏗️ Modern Architecture**
- Built with React 18 and TypeScript for type safety
- Vite for lightning-fast development and builds
- Responsive design with Tailwind CSS

**⚡ Real-time Sync**
- Powered by Supabase for real-time data updates
- Secure authentication and database management
- Offline-first capabilities

**📊 Expense Management**
- Track and split expenses easily
- Multiple split options (equal, percentage, custom)
- Visualize spending with interactive charts

**👥 Group Features**
- Create and manage groups
- Invite members with unique codes
- Track who owes what

**💰 Settle Up**
- Smart debt simplification algorithm
- Multiple settlement methods
- Transaction history

## Getting Started

### Prerequisites

- Node.js 16.14.0 or later
- npm 8.0.0 or later
- Supabase account (for backend services)

### Installation

1. **Clone Repository**
   ```bash
   git clone https://github.com/Manthan-Vats/billwise.git
   cd billwise
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

5. **Open in Browser**
   The app will be available at `http://localhost:5173`

## Features

### Dashboard
- Overview of group expenses
- Visual spending breakdown
- Quick actions for common tasks

### Groups
- Create and manage groups
- Invite members with unique codes
- Set group budgets

### Expenses
- Add expenses with multiple split options
- Categorize expenses
- Add notes and receipts

### Settlements
- View who owes what
- Record payments
- Simplified debt resolution

<!-- ## Screenshots

![Expense Tracking](https://i.imgur.com/example-expenses.png)
*Track and manage group expenses*

![Settlement](https://i.imgur.com/example-settlement.png)
*Simplify group settlements* -->

<!-- ## Contributing

Contributions are welcome! Please read our [contributing guidelines](CONTRIBUTING.md) to get started. -->

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

🔄 **Return**
