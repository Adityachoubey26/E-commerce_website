// Detailed seed data for ShopEra
export const categoriesData = [
  {
    name: 'Electronics',
    slug: 'electronics',
    description: 'Sleek smart home gadgets, hubs, power gear, and connected essentials.',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400'
  },
  {
    name: 'Smart Watches',
    slug: 'smart-watches',
    description: 'Elite wearable micro-consoles, fitness trackers, and premium chronographs.',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=400'
  },
  {
    name: 'Headphones',
    slug: 'headphones',
    description: 'Noise-cancelling headphones, high-fidelity earbuds, and studio monitors.',
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&q=80&w=400'
  },
  {
    name: 'Accessories',
    slug: 'accessories',
    description: 'Sleek leather organizers, magnetic stands, and desk accessories.',
    image: 'https://images.unsplash.com/photo-1527814050087-379526332c8e?auto=format&fit=crop&q=80&w=400'
  },
  {
    name: 'Gaming',
    slug: 'gaming',
    description: 'Mechanical keyboards, custom mice, immersive lighting, and controllers.',
    image: 'https://images.unsplash.com/photo-1612287230202-1bf1d85d1bdf?auto=format&fit=crop&q=80&w=400'
  },
  {
    name: 'Laptops',
    slug: 'laptops',
    description: 'High-performance ultra-portables, developer workhorses, and creative laptops.',
    image: 'https://images.unsplash.com/photo-1496181130204-755241524eab?auto=format&fit=crop&q=80&w=400'
  },
  {
    name: 'Smartphones',
    slug: 'smartphones',
    description: 'Flagship mobile devices with advanced camera grids and high-refresh screens.',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=400'
  }
];

export const generateProducts = (categoryMap) => {
  const products = [];

  const specsCommon = {
    'Warranty': '1 Year ShopEra Secure Warranty',
    'Origin': 'Designed in California, assembled globally',
    'Eco-Rating': '92% Recycled Packaging'
  };

  // --- 1. ELECTRONICS (15 products) ---
  const catElectronics = categoryMap['electronics'];
  for (let i = 1; i <= 15; i++) {
    products.push({
      name: `ShopEra SmartPlug Pro v${i}`,
      slug: `shopera-smartplug-pro-v${i}`,
      description: `A smart power outlet with automated schedules, power consumption tracking, and voice support for Alexa/Google Home. Version ${i} offers enhanced surge protection.`,
      price: 1499 + (i * 100),
      compareAtPrice: 2499 + (i * 150),
      images: [
        'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&q=80&w=600',
        'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600'
      ],
      category: catElectronics,
      inventory: 50 + i,
      ratings: { average: 4.2 + (i % 8) * 0.1, count: 12 + i * 3 },
      features: ['Real-time power monitoring', 'Schedule automation', 'Flame retardant shell', 'Compact single-outlet fit'],
      tags: ['electronics', 'smart-home', 'power', 'plug'],
      specifications: {
        ...specsCommon,
        'Max Load': '16A / 3600W',
        'Wireless Type': 'Wi-Fi 2.4GHz & Bluetooth 5.0',
        'Surge Protection': 'Up to 450 Joules'
      }
    });
  }

  // --- 2. SMART WATCHES (15 products) ---
  const catWatches = categoryMap['smart-watches'];
  for (let i = 1; i <= 15; i++) {
    products.push({
      name: `Chronos Active Edition ${i}`,
      slug: `chronos-active-edition-${i}`,
      description: `An elite multi-sport smartwatch tracking heart rate, oxygenation levels, and advanced sleep profiles. Feature tier ${i} introduces a sapphire screen and ultra-durable titanium casing.`,
      price: 12999 + (i * 500),
      compareAtPrice: 19999 + (i * 700),
      images: [
        'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&q=80&w=600',
        'https://images.unsplash.com/photo-1517502884422-41eaaced0168?auto=format&fit=crop&q=80&w=600'
      ],
      category: catWatches,
      inventory: 20 + i,
      ratings: { average: 4.4 + (i % 6) * 0.1, count: 25 + i * 5 },
      features: ['Always-On AMOLED Screen', 'GPS, GLONASS & Galileo trackers', 'Waterproof up to 50 meters', 'Over 120 sports tracking profiles'],
      tags: ['wearables', 'watch', 'fitness', 'smart-watches'],
      specifications: {
        ...specsCommon,
        'Display Size': '1.91-inch LTPO Glass',
        'Sensors': 'PPG Heart Rate, SpO2, Accelerometer, Gyro',
        'Battery Life': 'Up to 14 days in standby'
      }
    });
  }

  // --- 3. HEADPHONES (15 products) ---
  const catHeadphones = categoryMap['headphones'];
  for (let i = 1; i <= 15; i++) {
    products.push({
      name: `AeroPro Studio ANC v${i}`,
      slug: `aeropro-studio-anc-v${i}`,
      description: `Premium studio-grade sound meets custom hybrid ANC. Features high-res transducers, active noise isolation, and leatherette memory cushions. Edition ${i} delivers customized spatial sound.`,
      price: 9999 + (i * 300),
      compareAtPrice: 14999 + (i * 500),
      images: [
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600',
        'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&q=80&w=600'
      ],
      category: catHeadphones,
      inventory: 30 + i,
      ratings: { average: 4.3 + (i % 7) * 0.1, count: 40 + i * 2 },
      features: ['Hybrid Active Noise Cancelling (45dB)', 'Transparency mode feedback', 'Hi-Res Audio Gold certification', 'Multi-point Bluetooth linking'],
      tags: ['audio', 'headphones', 'anc', 'wireless'],
      specifications: {
        ...specsCommon,
        'Driver Size': '42mm Premium Drivers',
        'Bluetooth Version': 'V5.3 LE Audio',
        'Battery Capacity': '750mAh (Up to 50h play)'
      }
    });
  }

  // --- 4. ACCESSORIES (15 products) ---
  const catAccessories = categoryMap['accessories'];
  for (let i = 1; i <= 15; i++) {
    products.push({
      name: `ShopEra Premium Leather Pad ${i}`,
      slug: `shopera-premium-leather-pad-${i}`,
      description: `Crafted from premium full-grain Italian leather, this desk organizer pad features a magnetic accessory strip and cable routing slots. Style ${i} features high-contrast stitching.`,
      price: 2499 + (i * 150),
      compareAtPrice: 3999 + (i * 250),
      images: [
        'https://images.unsplash.com/photo-1527814050087-379526332c8e?auto=format&fit=crop&q=80&w=600',
        'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&q=80&w=600'
      ],
      category: catAccessories,
      inventory: 15 + i,
      ratings: { average: 4.1 + (i % 9) * 0.1, count: 8 + i * 4 },
      features: ['Genuine full-grain leather surface', 'Micro-suction anti-slip base', 'Magnetic cable organizer', 'Water-resistant coating'],
      tags: ['office', 'accessories', 'leather', 'desk-setup'],
      specifications: {
        ...specsCommon,
        'Dimensions': '900mm x 400mm x 4mm',
        'Material': 'Italian Cowhide & Cork Core',
        'Stitch Style': 'Hand-stitched perimeter thread'
      }
    });
  }

  // --- 5. GAMING (15 products) ---
  const catGaming = categoryMap['gaming'];
  for (let i = 1; i <= 15; i++) {
    products.push({
      name: `ShopEra Apex Gaming Mouse M${i}`,
      slug: `shopera-apex-gaming-mouse-m${i}`,
      description: `Ultra-lightweight gaming mouse featuring a zero-latency optical sensor, custom RGB configurations, and long-life mechanical switches. Iteration M${i} optimizes weight distribution.`,
      price: 3499 + (i * 200),
      compareAtPrice: 5499 + (i * 300),
      images: [
        'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&q=80&w=600',
        'https://images.unsplash.com/photo-1625600243103-1dc6824c6c8a?auto=format&fit=crop&q=80&w=600'
      ],
      category: catGaming,
      inventory: 40 + i,
      ratings: { average: 4.5 + (i % 5) * 0.1, count: 30 + i * 6 },
      features: ['Ultra-lightweight chassis (59g)', '26,000 DPI Optical Sensor Grid', 'Lag-free wireless tech', 'PTFE premium glide feet'],
      tags: ['gaming', 'mouse', 'wireless', 'rgb'],
      specifications: {
        ...specsCommon,
        'Max DPI': '26,000 DPI Custom Sensor',
        'Switch Lifespan': '80 Million clicks',
        'Polling Rate': 'Up to 4,000Hz support'
      }
    });
  }

  // --- 6. LAPTOPS (15 products) ---
  const catLaptops = categoryMap['laptops'];
  for (let i = 1; i <= 15; i++) {
    products.push({
      name: `ShopEra ZenBook Creator L${i}`,
      slug: `shopera-zenbook-creator-l${i}`,
      description: `The developer and creator powerhouse laptop. Features brilliant OLED displays, high performance chips, and premium cooling. Configuration L${i} features high-capacity RAM arrays.`,
      price: 74999 + (i * 2500),
      compareAtPrice: 99999 + (i * 3500),
      images: [
        'https://images.unsplash.com/photo-1496181130204-755241524eab?auto=format&fit=crop&q=80&w=600',
        'https://images.unsplash.com/photo-1484788984921-03950022c9ef?auto=format&fit=crop&q=80&w=600'
      ],
      category: catLaptops,
      inventory: 10 + i,
      ratings: { average: 4.6 + (i % 4) * 0.1, count: 15 + i * 2 },
      features: ['High-contrast AMOLED display', 'Vapor chamber luxury cooling', 'Premium aluminum alloy finish', 'Long-lasting 99Wh cell'],
      tags: ['laptops', 'workstation', 'development', 'creator'],
      specifications: {
        ...specsCommon,
        'Processor': `Intel Core Ultra 7 / AMD Ryzen AI ${9 - (i % 3)}`,
        'Memory': `${16 + (i % 3) * 16}GB DDR5 6400MHz`,
        'Display Matrix': '14.5-inch 120Hz 3K OLED'
      }
    });
  }

  // --- 7. SMARTPHONES (15 products) ---
  const catSmartphones = categoryMap['smartphones'];
  for (let i = 1; i <= 15; i++) {
    products.push({
      name: `Nexa Pro Flagship ${i}`,
      slug: `nexa-pro-flagship-${i}`,
      description: `A stellar smartphone featuring high-refresh screens, smart AI lens adjustments, and all-day supercharging capability. Version ${i} provides updated camera sensors.`,
      price: 45999 + (i * 1500),
      compareAtPrice: 59999 + (i * 2000),
      images: [
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=600',
        'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&q=80&w=600'
      ],
      category: catSmartphones,
      inventory: 18 + i,
      ratings: { average: 4.4 + (i % 6) * 0.1, count: 22 + i * 3 },
      features: ['Fluid 144Hz screen support', 'Dual-circuit battery charging', 'Ultra-wide premium lens stack', 'Security secure enclave chip'],
      tags: ['smartphones', 'mobile', 'android', 'camera'],
      specifications: {
        ...specsCommon,
        'Screen Type': '6.7-inch Super AMOLED LTPO',
        'Camera Grid': '50MP Main + 48MP Ultrawide + 12MP Telephoto',
        'Processor Type': 'Snapdragon 8 Gen 3 / Gen 4'
      }
    });
  }

  return products;
};
