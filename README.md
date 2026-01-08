# Eclipse Shop

A modern, full-stack e-commerce platform for digital products built with Next.js, Firebase, and Stripe. Features multi-language support (English, Russian, Azerbaijani), user authentication, admin panel, and responsive design.

## 🚀 Features

- **Product Catalog**: Browse digital products with categories and subcategories
- **Multi-language Support**: English, Russian, and Azerbaijani translations
- **User Authentication**: Firebase Auth with secure login/logout
- **Admin Panel**: Manage products, categories, and orders
- **Payment Processing**: Stripe integration for secure payments
- **Responsive Design**: Mobile-first design with dark/light theme support
- **Real-time Updates**: Live product updates and order management
- **SEO Optimized**: Meta tags, Open Graph, and Twitter cards

## 🛠 Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI components
- **Backend**: Firebase (Firestore, Auth, Storage)
- **Payments**: Stripe
- **State Management**: React Context
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Notifications**: Sonner toasts

## 📋 Prerequisites

- Node.js 18+
- npm or yarn
- Firebase project
- Stripe account (for payments)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd eclipse-shop
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
STRIPE_SECRET_KEY=sk_test_your_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Image Upload Configuration (Cloudinary API - 25GB Free)
CLOUDINARY_URL=cloudinary://your_api_key:your_api_secret@your_cloud_name

# Admin Configuration
ADMIN_EMAILS=admin@example.com,another-admin@example.com
```

### 4. Firebase Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication, Firestore, and Storage
3. Copy your Firebase config to `.env.local`
4. Deploy Firestore rules and indexes:

```bash
firebase deploy --only firestore:rules,firestore:indexes
```

### 5. Image Upload Setup (Cloudinary API)

1. Sign up for a free account at [Cloudinary](https://cloudinary.com/)
2. After signing up, go to your **Dashboard**
3. Find your **Cloud Name** (displayed prominently)
4. Go to **Account Details > API Keys** to get your:
   - **API Key**
   - **API Secret**
5. Add these to your `.env.local`:
   ```
   CLOUDINARY_CLOUD_NAME=your_actual_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

### 6. Stripe Setup (Optional for payments)

1. Create a Stripe account at [Stripe Dashboard](https://dashboard.stripe.com/)
2. Get your publishable and secret keys
3. Configure webhooks for payment events

### 7. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📁 Project Structure

```
eclipse-shop/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── admin/             # Admin panel pages
│   │   ├── actions/           # Server actions
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page
│   ├── components/            # React components
│   │   ├── admin/            # Admin components
│   │   ├── auth/             # Authentication components
│   │   ├── navigation/       # Navigation components
│   │   ├── products/         # Product components
│   │   └── ui/               # UI components (Radix)
│   ├── contexts/             # React contexts
│   ├── hooks/                # Custom hooks
│   ├── lib/                  # Utilities and configurations
│   │   ├── firebase/         # Firebase setup
│   │   ├── i18n/            # Internationalization
│   │   └── utils/           # Helper functions
│   └── types/                # TypeScript types
├── public/                   # Static assets
├── firebase.json             # Firebase configuration
├── firestore.rules          # Firestore security rules
└── package.json
```

## 🎯 Usage Guide

### For Users

1. **Browse Products**: Use the product grid to explore available digital products
2. **Filter & Search**: Filter by category, subcategory, or search by name
3. **Authentication**: Sign up or log in to make purchases
4. **Purchase**: Click "Buy Now" on any product to complete purchase with Stripe
5. **Profile**: View your order history and account information

### For Admins

1. **Access Admin Panel**: Navigate to `/admin` (requires admin email)
2. **Manage Products**: Add, edit, or deactivate products
3. **Manage Categories**: Create and organize product categories
4. **View Orders**: Monitor all customer orders and their status

## 📊 Data Management

### Adding Products

Use the admin panel or the `import-data.js` script to add products. See `ADD_DATA_TEMPLATE.md` for data structure templates.

### Categories & Subcategories

Categories are managed through the admin panel. Each category can have multiple subcategories.

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push

### Other Platforms

The app can be deployed to any platform supporting Next.js:
- Netlify
- Railway
- DigitalOcean App Platform

## 🔒 Security

- Firebase security rules prevent unauthorized data access
- Client-side validation with Zod schemas
- Secure payment processing with Stripe
- Admin-only access to management features

## 🌐 Internationalization

The app supports three languages:
- English (en)
- Russian (ru)
- Azerbaijani (az)

Language switching is available in the navigation bar.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is private and proprietary.

## 📞 Support

For support or questions, please contact the development team.

---

Built with ❤️ using Next.js and Firebase
