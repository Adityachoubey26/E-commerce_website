import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import connectDB from './config/db.js';
import apiRoutes from './routes/api.js';
import { Category, Product, Coupon, User } from './models/Schemas.js';
import bcrypt from 'bcryptjs';
import { categoriesData, generateProducts } from './config/seedData.js';

dotenv.config();

const app = express();

// --- Middlewares ---
app.use(helmet({
  crossOriginResourcePolicy: false // Allow loading images/PDFs from static routes
}));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Static Assets Router ---
const publicDir = path.join(process.cwd(), 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}
app.use(express.static(publicDir));

// --- API Route Mount ---
app.use('/api', apiRoutes);

// --- Global Error Handler ---
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
});

// --- Auto-Database Seeding ---
const seedDatabase = async () => {
  try {
    const productCount = await Product.countDocuments({});
    if (productCount < 100) {
      console.log('Seeding initial categories, products, coupons and default admin for ShopEra...');

      // Clear existing to avoid duplicates when database schema changes
      await Product.deleteMany({});
      await Category.deleteMany({});
      await Coupon.deleteMany({});
      
      // Keep admin if exists, or create if not
      const adminExists = await User.findOne({ role: 'admin' });
      if (!adminExists) {
        const hashedAdminPassword = await bcrypt.hash('admin123', 10);
        await User.create({
          name: 'Admin Portfolio User',
          email: 'admin@glassshop.com',
          password: hashedAdminPassword,
          role: 'admin',
          isVerified: true,
          walletBalance: 5000,
          tokensAvailable: 100,
          tokensLifetime: 100
        });
        console.log('Created Default Admin: admin@glassshop.com / admin123');
      }

      // Also create a default user demo account if not exists
      const userExists = await User.findOne({ email: 'user@glassshop.com' });
      if (!userExists) {
        const hashedUserPassword = await bcrypt.hash('user123', 10);
        await User.create({
          name: 'Demo ShopEra User',
          email: 'user@glassshop.com',
          password: hashedUserPassword,
          role: 'user',
          isVerified: true,
          walletBalance: 5000,
          tokensAvailable: 100,
          tokensLifetime: 100
        });
        console.log('Created Default User: user@glassshop.com / user123');
      }

      // 1. Create Categories
      const categoryMap = {};
      for (const cat of categoriesData) {
        const createdCat = await Category.create(cat);
        categoryMap[cat.slug] = createdCat._id;
      }
      console.log('Categories seeded successfully.');

      // 2. Generate and Insert 105+ Products
      const productsList = generateProducts(categoryMap);
      await Product.insertMany(productsList);
      console.log(`Successfully seeded ${productsList.length} products!`);

      // 3. Create Coupons
      await Coupon.create([
        {
          code: 'FIRST10',
          discountType: 'percentage',
          discountValue: 10,
          maxDiscountAmount: 1500,
          minPurchaseAmount: 2000,
          startDate: new Date('2026-01-01'),
          endDate: new Date('2027-12-31'),
          isActive: true
        },
        {
          code: 'FLAT500',
          discountType: 'fixed',
          discountValue: 500,
          minPurchaseAmount: 4000,
          startDate: new Date('2026-01-01'),
          endDate: new Date('2027-12-31'),
          isActive: true
        }
      ]);
      console.log('Sample coupons seeded complete.');
    }
  } catch (error) {
    console.error('Seeding database failed:', error);
  }
};

const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  seedDatabase().then(() => {
    app.listen(PORT, () => {
      console.log(`Server running in development mode on port ${PORT}`);
    });
  });
});
