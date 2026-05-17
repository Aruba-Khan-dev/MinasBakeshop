# Mina's Bakeshop

A modern, full-stack e-commerce web application built for a bakery. This application provides a beautiful frontend for customers to browse and purchase baked goods, as well as a secure admin dashboard for store owners to manage products, categories, and orders.

## ✨ Features

### Customer Experience
* **Dynamic Product Catalog:** Browse a wide variety of baked goods with high-quality images.
* **Search & Filter:** Easily find specific products using the built-in search functionality.
* **Custom Orders:** Request customized cakes and pastries tailored to specific needs.
* **Seamless Checkout:** A streamlined cart and checkout flow for a frictionless shopping experience.
* **Responsive Design:** Beautifully designed UI that looks great on desktop, tablet, and mobile devices.

### Admin Dashboard
* **Secure Authentication:** Admin routes protected via Supabase Auth.
* **Product Management:** Add, edit, and delete products, including image uploads to Supabase Storage.
* **Category Management:** Organize products into logical categories.
* **Order Tracking:** View customer orders and update fulfillment statuses in real-time.
* **Dashboard Analytics:** High-level overview of store performance.

## 🛠 Tech Stack

* **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/) & [Radix UI](https://www.radix-ui.com/)
* **Database & Auth:** [Supabase](https://supabase.com/)
* **Forms & Validation:** React Hook Form & Zod
* **Icons:** Lucide React

## 🚀 Getting Started

Follow these steps to run the project locally.

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) and [pnpm](https://pnpm.io/) (or npm/yarn) installed on your machine.

### Installation

1. **Clone the repository** (if applicable):
   ```bash
   git clone <your-repo-url>
   cd MinasBakeshop
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Set up Environment Variables:**
   Create a `.env.local` file in the root directory and add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

5. **Open the app:**
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser to see the customer frontend.
   Navigate to [http://localhost:3000/admin/login](http://localhost:3000/admin/login) to access the admin dashboard.

## 📁 Project Structure

* `/app` - Next.js App Router containing all pages and layouts.
  * `/admin` - Admin dashboard routes and management tools.
  * `/shop`, `/products`, `/checkout` - Customer-facing shopping routes.
* `/components` - Reusable React components (UI elements, forms, layouts).
* `/lib` - Utility functions and Supabase client configuration.
* `/public` - Static assets and global resources.

## 📝 License

This project is licensed under the MIT License.
