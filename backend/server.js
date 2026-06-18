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
    const categoryCount = await Category.countDocuments({});
    if (categoryCount === 0) {
      console.log('Seeding initial categories, products, coupons and default admin...');

      // 1. Create Default Categories
      const catAudio = await Category.create({
        name: 'Premium Audio',
        slug: 'premium-audio',
        description: 'Noise-cancelling headphones and immersive acoustic gear.',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400'
      });

      const catWatches = await Category.create({
        name: 'Smart Watches',
        slug: 'smart-watches',
        description: 'Elite wearable micro-consoles and chronographs.',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=400'
      });

      const catGear = await Category.create({
        name: 'Minimalist Accessories',
        slug: 'minimalist-accessories',
        description: 'Sleek items designed for modern productivity.',
        image: 'https://images.unsplash.com/photo-1527814050087-379526332c8e?auto=format&fit=crop&q=80&w=400'
      });

      // 2. Create Default Admin
      const hashedAdminPassword = await bcrypt.hash('admin123', 10);
      await User.create({
        name: 'Admin Portfolio User',
        email: 'admin@glassshop.com',
        password: hashedAdminPassword,
        role: 'admin',
        isVerified: true
      });
      console.log('Created Default Admin: admin@glassshop.com / admin123');

      // 3. Create Default Products
      const specsAudio = {
        'Driver Size': '40mm Dynamic Drivers',
        'Battery Life': 'Up to 45 hours',
        'Bluetooth': 'V5.3 (Ultra low latency)',
        'ANC Depth': '48dB Active Cancellation',
        'Warranty': '1 Year Domestic Warranty'
      };

      const specsWatch = {
        'Display': '1.85-inch AMOLED Ambient Screen',
        'Water Resistance': 'IP68 Certified Protection',
        'Sensor Grid': 'Optical HR, SpO2, Sleep Tracker',
        'Charge Method': 'Magnetic Induction Cradle',
        'Battery Duration': '7 Days Active Use'
      };

      const specsCharger = {
        'Material': 'Frosted Acrylic & Anodized Steel',
        'USB Ports': '2 x Type-C (Power Delivery 3.0)',
        'Output capacity': '140W Hyper-charging support',
        'Indicator': 'Ice-blue LED status light'
      };

      await Product.create([
        {
          name: 'AeroPro Max ANC Headphones',
          slug: 'aeropro-max-anc-headphones',
          description: 'Experience pure acoustic brilliance with advanced active noise cancellation, custom audio profiles, and cloud-soft memory cushions for long listening sessions.',
          price: 12999,
          compareAtPrice: 19999,
          images: [
            'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&q=80&w=600',
            'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&q=80&w=600'
          ],
          category: catAudio._id,
          inventory: 24,
          ratings: { average: 4.8, count: 18 },
          features: ['Hybrid Active Noise Cancellation', 'Ambient transparency feedback', 'Hi-Res Audio Gold certification', 'Voice assistant integrations'],
          tags: ['audio', 'headphones', 'anc', 'wireless'],
          specifications: specsAudio
        },
        {
          name: 'Chronos Lux Smart Chronograph',
          slug: 'chronos-lux-smart-chronograph',
          description: 'A masterpiece blending luxury styling with cutting-edge vitals monitoring. Features a sleek metallic chassis, customizable dial arrays, and long battery life.',
          price: 18499,
          compareAtPrice: 24999,
          images: [
            'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&q=80&w=600',
            'https://images.unsplash.com/photo-1517502884422-41eaaced0168?auto=format&fit=crop&q=80&w=600'
          ],
          category: catWatches._id,
          inventory: 12,
          ratings: { average: 4.6, count: 9 },
          features: ['Always-On AMOLED Console', 'Real-time heart rate and oxygenation sensors', 'Custom aluminum structure', 'Waterproof build'],
          tags: ['watch', 'wearables', 'smart', 'luxury'],
          specifications: specsWatch
        },
        {
          name: 'HyperDrive 140W Charging Dock',
          slug: 'hyperdrive-140w-charging-dock',
          description: 'Power up to four accessories simultaneously using our crystal-cased hyper-charging hub. Delivers smart power allocation and premium heat management.',
          price: 4999,
          compareAtPrice: 7999,
          images: [
            'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&q=80&w=600',
            'https://images.unsplash.com/photo-1622445262465-2481c4574875?auto=format&fit=crop&q=80&w=600'
          ],
          category: catGear._id,
          inventory: 2, // Low stock on purpose for testing low-stock alerts
          ratings: { average: 4.3, count: 5 },
          features: ['Dual GaN Fast charging circuits', 'Intelligent thermal controls', 'Luminescent status indicator line'],
          tags: ['charger', 'desk', 'power', 'minimalist'],
          specifications: specsCharger
        }
      ]);

      // 4. Create Coupons
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
      console.log('Sample data seeding complete.');
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
