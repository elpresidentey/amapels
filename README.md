# AMAPELS - Luxury Jewelry E-commerce

A modern, elegant e-commerce platform for artisan jewelry, built with Next.js 14, TypeScript, and MongoDB.

## 🌟 Features

### Customer Features
- **Product Catalog** - Browse curated collections of earrings, necklaces, bracelets, and jewelry sets
- **Shopping Cart** - Add items, update quantities, and manage selections
- **Secure Checkout** - Integrated with Paystack for Nigerian payments (₦)
- **Order Tracking** - Track order status from processing to delivery
- **Mobile Responsive** - Optimized experience on all devices

### Admin Features
- **Dashboard** - Real-time statistics and recent orders overview
- **Product Management** - Full CRUD operations for products
- **Order Management** - View, filter, and update order statuses
- **Featured Products** - Mark products to appear on homepage
- **Mobile Admin** - Manage your store from any device

## 🚀 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: MongoDB
- **Payments**: Paystack
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Deployment**: Vercel

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- MongoDB database
- Paystack account

## 🔧 Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/AMAPELS.git
cd AMAPELS
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
MONGODB_URI=your_mongodb_connection_string
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=your_paystack_public_key
PAYSTACK_SECRET_KEY=your_paystack_secret_key
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD=your_admin_password
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## 📦 Building for Production

```bash
npm run build
npm run start
```

## 🌐 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

See [docs/DEPLOYMENT_GUIDE.md](docs/DEPLOYMENT_GUIDE.md) for detailed instructions.

## 📚 Documentation

- [Admin Guide](docs/QUICK_START_ADMIN.md) - Quick start guide for site owners
- [Mobile Responsiveness](docs/MOBILE_RESPONSIVENESS_COMPLETE.md) - Mobile optimization details
- [Admin Features](docs/ADMIN_IMPROVEMENTS_COMPLETE.md) - Complete admin documentation
- [Checkout System](docs/CHECKOUT_SYSTEM.md) - Payment integration details
- [Deployment Guide](docs/DEPLOYMENT_GUIDE.md) - Production deployment instructions

## 🎨 Project Structure

```
AMAPELS/
├── src/
│   ├── app/                 # Next.js app router pages
│   │   ├── admin/          # Admin dashboard pages
│   │   ├── api/            # API routes
│   │   ├── shop/           # Shop pages
│   │   └── ...
│   ├── components/         # Reusable React components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions
│   ├── store/              # Zustand state management
│   └── types/              # TypeScript type definitions
├── public/                 # Static assets
├── docs/                   # Documentation
└── ...
```

## 🔐 Admin Access

Default admin route: `/admin/login`

**Important**: Change default admin credentials in production!

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🎯 Key Features Breakdown

### Product Management
- Add, edit, delete products
- Multiple images per product
- Product options (sizes, colors)
- Category management
- Featured product toggle

### Order Management
- View all orders
- Filter by status
- Update order status
- View customer details
- Track shipments

### Payment Integration
- Paystack payment gateway
- Secure checkout flow
- Payment verification
- Order confirmation

### Mobile Optimization
- Responsive design at all breakpoints
- Touch-friendly interfaces
- Mobile admin dashboard
- Optimized images and layouts

## 🌍 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome)

## 📱 Responsive Breakpoints

- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: 1024px+
- Large Desktop: 1280px+

## 🔒 Security Features

- Environment variable protection
- Admin authentication
- Secure payment processing
- Input validation
- HTTPS recommended for production

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is proprietary and confidential.

## 💬 Support

For issues or questions:
- Check the [documentation](docs/)
- Open an issue on GitHub
- Contact: support@amapels.com

## 🎉 Acknowledgments

- Next.js team for the amazing framework
- Paystack for payment integration
- All contributors and supporters

---

**Built with ❤️ for AMAPELS**

**Version**: 2.0.0  
**Last Updated**: July 6, 2026
