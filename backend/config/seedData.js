// Detailed seed data for ShopEra
export const categoriesData = [
  {
    name: 'Electronics',
    slug: 'electronics',
    description: 'Sleek smart home gadgets, hubs, power gear, and connected essentials.',
    image: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&q=80&w=400'
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
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400'
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

  // Unique high-quality Unsplash image IDs (Primary + Secondary) for each product in 7 categories
  const electronicsImages = [
    ['photo-1558002038-1055907df827', 'photo-1544716278-ca5e3f4abd8c'], // Smart Plug
    ['photo-1528319725582-ddc096101511', 'photo-1557318041-1ce374d55ebf'], // Security Camera
    ['photo-1546054454-aa26e2b734c7', 'photo-1580870013141-3b13c9e1fc11'], // Smart Display Hub
    ['photo-1545454675-3531b543be5d', 'photo-1608248597279-f99d160bfcbc'], // TV Soundbar
    ['photo-1544244015-0df4b3ffc6b0', 'photo-1611186871348-b1ce696e52c9'], // Streaming Stick
    ['photo-1565814329452-e1efa11c5b89', 'photo-1550525261-267952e2be2a'], // Smart Bulb Pack
    ['photo-1506084868230-bb9d95c24759', 'photo-1512486130939-2c4f79935e4f'], // Motion Sensor
    ['photo-1621574539437-4b7cb63120b8', 'photo-1563770660941-20978e870e26'], // Thermostat Pro
    ['photo-1585338107529-13afc5f02586', 'photo-1522075469751-3a6694fb2f61'], // Air Purifier
    ['photo-1558002038-1055907df827', 'photo-1508962914676-134849a727f0'], // Video Doorbell
    ['photo-1574680096145-d05b474e2155', 'photo-1517838277536-f5f99be501cd'], // Smart Scale
    ['photo-1595950653106-6c9ebd614d3a', 'photo-1583863788434-e58a36330cf0'], // TV Remote Hub
    ['photo-1535016120720-40c646be5580', 'photo-1489599849927-2ee91cede3ba'], // Smart Projector
    ['photo-1508962914676-134849a727f0', 'photo-1563986768609-322da13575f3'], // Home Security Hub
    ['photo-1563986768609-322da13575f3', 'photo-1544197150-b99a580bb7a8']  // Wifi Range Extender
  ];

  const smartWatchImages = [
    ['photo-1508685096489-7aacd43bd3b1', 'photo-1517502884422-41eaaced0168'],
    ['photo-1523275335684-37898b6baf30', 'photo-1575311373937-040b8e1fd5b6'],
    ['photo-1434494878577-86c23bcb06b9', 'photo-1509198397868-475647b2a1e5'],
    ['photo-1511556532299-8f662fc26c06', 'photo-1539874754764-5a96559165b0'],
    ['photo-1509198397868-475647b2a1e5', 'photo-1434494878577-86c23bcb06b9'],
    ['photo-1579586337278-3befd40fd17a', 'photo-1508685096489-7aacd43bd3b1'],
    ['photo-1517502884422-41eaaced0168', 'photo-1523275335684-37898b6baf30'],
    ['photo-1539874754764-5a96559165b0', 'photo-1511556532299-8f662fc26c06'],
    ['photo-1542496658-e33a6d0d50f6', 'photo-1579586337278-3befd40fd17a'],
    ['photo-1510017808638-a59b7100885e', 'photo-1542496658-e33a6d0d50f6'],
    ['photo-1508685096489-7aacd43bd3b1', 'photo-1510017808638-a59b7100885e'],
    ['photo-1523275335684-37898b6baf30', 'photo-1509198397868-475647b2a1e5'],
    ['photo-1579586337278-3befd40fd17a', 'photo-1434494878577-86c23bcb06b9'],
    ['photo-1511556532299-8f662fc26c06', 'photo-1517502884422-41eaaced0168'],
    ['photo-1539874754764-5a96559165b0', 'photo-1542496658-e33a6d0d50f6']
  ];

  const headphoneImages = [
    ['photo-1505740420928-5e560c06d30e', 'photo-1484704849700-f032a568e944'],
    ['photo-1546435770-a3e426bf472b', 'photo-1583394838336-acd977736f90'],
    ['photo-1583394838336-acd977736f90', 'photo-1505740420928-5e560c06d30e'],
    ['photo-1484704849700-f032a568e944', 'photo-1546435770-a3e426bf472b'],
    ['photo-1590658268037-6bf12165a8df', 'photo-1577174881658-0f30ed549adc'],
    ['photo-1524678606370-a47ad25cb82a', 'photo-1590658268037-6bf12165a8df'],
    ['photo-1577174881658-0f30ed549adc', 'photo-1524678606370-a47ad25cb82a'],
    ['photo-1618384887929-16ec33fab9ef', 'photo-1505740420928-5e560c06d30e'],
    ['photo-1545454675-3531b543be5d', 'photo-1546435770-a3e426bf472b'],
    ['photo-1613040809024-b4ef7ba99bc3', 'photo-1583394838336-acd977736f90'],
    ['photo-1599669454699-248893623440', 'photo-1484704849700-f032a568e944'],
    ['photo-1606220588913-b3aacb4d2f46', 'photo-1590658268037-6bf12165a8df'],
    ['photo-1505740420928-5e560c06d30e', 'photo-1613040809024-b4ef7ba99bc3'],
    ['photo-1546435770-a3e426bf472b', 'photo-1599669454699-248893623440'],
    ['photo-1583394838336-acd977736f90', 'photo-1606220588913-b3aacb4d2f46']
  ];

  const accessoryImages = [
    ['photo-1527814050087-379526332c8e', 'photo-1583863788434-e58a36330cf0'],
    ['photo-1583863788434-e58a36330cf0', 'photo-1527814050087-379526332c8e'],
    ['photo-1603302576837-37561b2e2302', 'photo-1588872657578-7efd1f1555ed'],
    ['photo-1586495777744-4413f21062fa', 'photo-1527814050087-379526332c8e'],
    ['photo-1622445262465-2481c8573226', 'photo-1583863788434-e58a36330cf0'],
    ['photo-1595428774223-ef52624120d2', 'photo-1586495777744-4413f21062fa'],
    ['photo-1618424181497-157f25b6ddd5', 'photo-1603302576837-37561b2e2302'],
    ['photo-1527814050087-379526332c8e', 'photo-1595428774223-ef52624120d2'],
    ['photo-1583863788434-e58a36330cf0', 'photo-1622445262465-2481c8573226'],
    ['photo-1586495777744-4413f21062fa', 'photo-1618424181497-157f25b6ddd5'],
    ['photo-1622445262465-2481c8573226', 'photo-1527814050087-379526332c8e'],
    ['photo-1595428774223-ef52624120d2', 'photo-1583863788434-e58a36330cf0'],
    ['photo-1588872657578-7efd1f1555ed', 'photo-1586495777744-4413f21062fa'],
    ['photo-1603302576837-37561b2e2302', 'photo-1622445262465-2481c8573226'],
    ['photo-1527814050087-379526332c8e', 'photo-1618424181497-157f25b6ddd5']
  ];

  const gamingImages = [
    ['photo-1612287230202-1bf1d85d1bdf', 'photo-1615663245857-ac93bb7c39e7'],
    ['photo-1615663245857-ac93bb7c39e7', 'photo-1612287230202-1bf1d85d1bdf'],
    ['photo-1625600243103-1dc6824c6c8a', 'photo-1617096200743-a55b660a9f84'],
    ['photo-1617096200743-a55b660a9f84', 'photo-1625600243103-1dc6824c6c8a'],
    ['photo-1598550476439-6847785fce6e', 'photo-1612287230202-1bf1d85d1bdf'],
    ['photo-1600861195091-690c92f1d2cc', 'photo-1615663245857-ac93bb7c39e7'],
    ['photo-1607604276583-eef5d076aa5f', 'photo-1625600243103-1dc6824c6c8a'],
    ['photo-1614064641938-3bbee52942c7', 'photo-1617096200743-a55b660a9f84'],
    ['photo-1612287230202-1bf1d85d1bdf', 'photo-1600861195091-690c92f1d2cc'],
    ['photo-1615663245857-ac93bb7c39e7', 'photo-1607604276583-eef5d076aa5f'],
    ['photo-1625600243103-1dc6824c6c8a', 'photo-1614064641938-3bbee52942c7'],
    ['photo-1617096200743-a55b660a9f84', 'photo-1598550476439-6847785fce6e'],
    ['photo-1600861195091-690c92f1d2cc', 'photo-1612287230202-1bf1d85d1bdf'],
    ['photo-1607604276583-eef5d076aa5f', 'photo-1615663245857-ac93bb7c39e7'],
    ['photo-1614064641938-3bbee52942c7', 'photo-1625600243103-1dc6824c6c8a']
  ];

  const laptopImages = [
    ['photo-1496181130204-755241524eab', 'photo-1484788984921-03950022c9ef'],
    ['photo-1484788984921-03950022c9ef', 'photo-1496181130204-755241524eab'],
    ['photo-1588872657578-7efd1f1555ed', 'photo-1525547719571-a2d4ac8945e2'],
    ['photo-1525547719571-a2d4ac8945e2', 'photo-1588872657578-7efd1f1555ed'],
    ['photo-1531297484001-80022131f5a1', 'photo-1593642632823-8f785ba67e45'],
    ['photo-1593642632823-8f785ba67e45', 'photo-1531297484001-80022131f5a1'],
    ['photo-1603302576837-37561b2e2302', 'photo-1611186871348-b1ce696e52c9'],
    ['photo-1611186871348-b1ce696e52c9', 'photo-1603302576837-37561b2e2302'],
    ['photo-1541807084-5c52b6b3adef', 'photo-1504707748692-419802cf939d'],
    ['photo-1504707748692-419802cf939d', 'photo-1541807084-5c52b6b3adef'],
    ['photo-1544244015-0df4b3ffc6b0', 'photo-1593642702821-c8da6371f416'],
    ['photo-1593642702821-c8da6371f416', 'photo-1544244015-0df4b3ffc6b0'],
    ['photo-1618424181497-157f25b6ddd5', 'photo-1559163499-413811fb2344'],
    ['photo-1559163499-413811fb2344', 'photo-1618424181497-157f25b6ddd5'],
    ['photo-1527443224154-c4a3942d3acf', 'photo-1496181130204-755241524eab']
  ];

  const smartphoneImages = [
    ['photo-1511707171634-5f897ff02aa9', 'photo-1598327105666-5b89351aff97'],
    ['photo-1598327105666-5b89351aff97', 'photo-1511707171634-5f897ff02aa9'],
    ['photo-1580910051074-3eb694886505', 'photo-1565849906660-afb4d45552b0'],
    ['photo-1565849906660-afb4d45552b0', 'photo-1580910051074-3eb694886505'],
    ['photo-1573148195900-7845dcb9b127', 'photo-1616348436168-de43ad0db179'],
    ['photo-1616348436168-de43ad0db179', 'photo-1573148195900-7845dcb9b127'],
    ['photo-1585060544812-6b45742d762f', 'photo-1592899677977-9c10ca588bbd'],
    ['photo-1592899677977-9c10ca588bbd', 'photo-1585060544812-6b45742d762f'],
    ['photo-1533228892584-219c7a52cd0c', 'photo-1548036328-c9fa89d128fa'],
    ['photo-1548036328-c9fa89d128fa', 'photo-1533228892584-219c7a52cd0c'],
    ['photo-1601784551446-20c9e09cd90f', 'photo-1551645121-d1034da75057'],
    ['photo-1551645121-d1034da75057', 'photo-1601784551446-20c9e09cd90f'],
    ['photo-1583573636246-18cb2246697f', 'photo-1528795259021-d8c86e14354c'],
    ['photo-1528795259021-d8c86e14354c', 'photo-1583573636246-18cb2246697f'],
    ['photo-1512941937669-90a1b58e7e9c', 'photo-1511707171634-5f897ff02aa9']
  ];

  const buildImageUrl = (photoId) => `https://images.unsplash.com/${photoId}?auto=format&fit=crop&q=80&w=600`;

  // --- 1. ELECTRONICS (15 products) ---
  const catElectronics = categoryMap['electronics'];
  const electronicsNames = [
    'SmartPlug Pro Wi-Fi Outlet',
    'Sentinel Voice Security Camera',
    'Aura Hub Smart Display Screen',
    'SoundWave TV Surround Bar',
    'StreamFly 4K Media Stick',
    'Lumen Ambient Smart Bulbs',
    'Pulse Passive Motion Sensor',
    'ThermaGlow Intelligent Thermostat',
    'PureAir Pro HEPA Purifier',
    'GuardBell Smart Video Doorbell',
    'AeroScale Digital Fitness Tracker',
    'SyncRemote Universal Smart Hub',
    'CineMax Pocket Laser Projector',
    'HomeSafe Cellular Backup Gateway',
    'OrbitRange Wi-Fi Mesh Extender'
  ];

  for (let i = 1; i <= 15; i++) {
    const images = electronicsImages[i - 1].map(buildImageUrl);
    products.push({
      name: `ShopEra ${electronicsNames[i - 1]}`,
      slug: `shopera-${electronicsNames[i - 1].toLowerCase().replace(/[^a-z0-9]+/g, '-')}-v${i}`,
      description: `A premium electronic home device designed to optimize comfort, connectivity, and automation. ShopEra ${electronicsNames[i - 1]} incorporates intelligent chipsets and native smart features.`,
      price: 1499 + (i * 100),
      compareAtPrice: 2499 + (i * 150),
      images: images,
      category: catElectronics,
      inventory: 50 + i,
      ratings: { average: 4.2 + (i % 8) * 0.1, count: 12 + i * 3 },
      features: ['Real-time smart monitoring', 'Voice assistant capability', 'Premium durable chassis', 'Seamless integration'],
      tags: ['electronics', 'smart-home', 'power', 'device'],
      specifications: {
        ...specsCommon,
        'Power Rating': '10A - 16A Support',
        'Wireless Integration': 'Wi-Fi 2.4GHz & Bluetooth 5.2'
      }
    });
  }

  // --- 2. SMART WATCHES (15 products) ---
  const catWatches = categoryMap['smart-watches'];
  const watchNames = [
    'Chronos Active Pro Edition',
    'Titan Sport Tough GPS Tracker',
    'Helix Elite Elegant Chrono',
    'Nova Minimalist Smartband',
    'Apex Trail Rugged Explorer',
    'Aegis Steel Executive Smartwatch',
    'Aura Diamond Premium Wristlet',
    'Horizon Hybrid Leather Console',
    'Aero Fitness Lite band',
    'Zephyr Outdoor Navigation Watch',
    'Orion Classic Smart Chronograph',
    'Polaris Swim-Proof Vitals Tracker',
    'Eclipse Stealth Black Wearable',
    'Solaris Continuous Solar Band',
    'Vanguard Elite Premium Titanium'
  ];

  for (let i = 1; i <= 15; i++) {
    const images = smartWatchImages[i - 1].map(buildImageUrl);
    products.push({
      name: watchNames[i - 1],
      slug: `${watchNames[i - 1].toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${i}`,
      description: `Track vitals, receive notifications, and schedule routines in high fidelity. Features state-of-the-art AMOLED glass display and lightweight, strong alloys.`,
      price: 12999 + (i * 500),
      compareAtPrice: 19999 + (i * 700),
      images: images,
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
  const headphoneNames = [
    'AeroPro Studio ANC Headset',
    'Pulse Pro Wireless Earbuds',
    'Sonic Bass Deep-OverEar',
    'Elite Monitor Wired Headphones',
    'Echo Wireless Pods Mini',
    'Muse Noise Cancelling Studio Pro',
    'Rhythm Sports Wrap Earbuds',
    'Harmony Studio Audiophile Headset',
    'Breeze Open-Back Acoustic Monitor',
    'Wave Waterproof Swim Pods',
    'Lyric Gold Spatial Audio Wireless',
    'Tune Everyday Lightweight Buds',
    'Symphony Premium Copper Headset',
    'Zenith Carbon Fiber Professional',
    'Aura Mini Air Buds Pack'
  ];

  for (let i = 1; i <= 15; i++) {
    const images = headphoneImages[i - 1].map(buildImageUrl);
    products.push({
      name: headphoneNames[i - 1],
      slug: `${headphoneNames[i - 1].toLowerCase().replace(/[^a-z0-9]+/g, '-')}-v${i}`,
      description: `Immersive acoustical feedback meets premium soft cushion build. Custom hybrid noise isolation lets you focus on coding, designing, or relaxing.`,
      price: 9999 + (i * 300),
      compareAtPrice: 14999 + (i * 500),
      images: images,
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
  const accessoryNames = [
    'Premium Italian Leather Desk Pad',
    'MagSafe Aluminium Smartphone Stand',
    'Multi-Device GaN Fast Charging Dock',
    'Sleek Travel Tech Organizer Pouch',
    'Brushed Metal Minimalist Phone Stand',
    'Type-C 65W Pocket GaN Adapter',
    'Slim Magnetic Card Wallet Shield',
    'Self-Adhesive Rubber Cable Manager',
    'Soft Wool Felt Keyboard Mat',
    'Premium Textured Silicone Watch Strap',
    'Water-Repellent Canvas Laptop Sleeve',
    'Full-Grain Leather Secure Keyring',
    'Ergonomic Wood Monitor Riser Stand',
    'Dual-Port Fast Charging Car Charger',
    'AirTag Leather Loop Case Protect'
  ];

  for (let i = 1; i <= 15; i++) {
    const images = accessoryImages[i - 1].map(buildImageUrl);
    products.push({
      name: `ShopEra ${accessoryNames[i - 1]}`,
      slug: `shopera-${accessoryNames[i - 1].toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${i}`,
      description: `Crafted from premium components to streamline your modern workstation setup. Perfect utility design for everyday comfort and durability.`,
      price: 2499 + (i * 150),
      compareAtPrice: 3999 + (i * 250),
      images: images,
      category: catAccessories,
      inventory: 15 + i,
      ratings: { average: 4.1 + (i % 9) * 0.1, count: 8 + i * 4 },
      features: ['Genuine materials', 'Anti-slip robust base layout', 'Compact, travel-ready structure', 'Water-resistant outer coat'],
      tags: ['office', 'accessories', 'leather', 'desk-setup'],
      specifications: {
        ...specsCommon,
        'Primary Material': 'Premium grade metals / full-grain leather',
        'Utility Class': 'Workstation Desk Accessories'
      }
    });
  }

  // --- 5. GAMING (15 products) ---
  const catGaming = categoryMap['gaming'];
  const gamingNames = [
    'Apex Mechanical Blue-Switch Keyboard',
    'Apex Wireless Optical Gaming Mouse',
    'FireFly RGB Stitched Edge Mousepad',
    'Horizon Spatial Audio Gaming Headset',
    'Strike Custom Zero-Latency Gamepad',
    'Nebula Studio Podcaster Microphone',
    'Titan Ergonomic Lumbar Gaming Chair',
    'Volt Double-Shot PBT Keycap Set',
    'Helix Memory Foam Ergonomic Wrist Rest',
    'Eclipse LED Desktop Gaming Soundbar',
    'Prism USB Dynamic Smart Ambient Lights',
    'Storm Pro Turbo Custom Controller',
    'Stealth Tri-Band Gigabit Gaming Router',
    'Aero Silent Fan Notebook Cooler Pad',
    'Sentinel Heavy Weight VR Display Stand'
  ];

  for (let i = 1; i <= 15; i++) {
    const images = gamingImages[i - 1].map(buildImageUrl);
    products.push({
      name: gamingNames[i - 1],
      slug: `${gamingNames[i - 1].toLowerCase().replace(/[^a-z0-9]+/g, '-')}-m${i}`,
      description: `Enhance your immersion and precision performance. Featuring ultra-fast optical response times, dynamic RGB customizable zones, and zero-latency wireless connectivity.`,
      price: 3499 + (i * 200),
      compareAtPrice: 5499 + (i * 300),
      images: images,
      category: catGaming,
      inventory: 40 + i,
      ratings: { average: 4.5 + (i % 5) * 0.1, count: 30 + i * 6 },
      features: ['Ultra-lightweight chassis design', 'Zero latency high refresh performance', 'Premium switches and sensors', 'Full-spectrum RGB integration'],
      tags: ['gaming', 'mouse', 'wireless', 'rgb'],
      specifications: {
        ...specsCommon,
        'Device Type': 'High-performance Gaming Gear',
        'Response Rate': 'Up to 1ms latency limits'
      }
    });
  }

  // --- 6. LAPTOPS (15 products) ---
  const catLaptops = categoryMap['laptops'];
  const laptopNames = [
    'ZenBook Creator L14 OLED',
    'ZenBook Creator L15 OLED',
    'ProBook Developer D13 Studio',
    'ProBook Developer D16 Workstation',
    'Blade Gaming G15 High-FPS',
    'Blade Gaming G17 Ultimate FPS',
    'Air Ultra Thin 13 Portable',
    'Book Studio 15 Creative Design',
    'Nomad TravelBook 12 Mini',
    'Titan Power Workstation T18',
    'Zenith Touch Convertible 14',
    'Carbon Business X14 Secure',
    'Vector Design Book 15 Pro',
    'Eclipse Fold DualScreen 16',
    'Nova Budget Book 14 Student'
  ];

  for (let i = 1; i <= 15; i++) {
    const images = laptopImages[i - 1].map(buildImageUrl);
    products.push({
      name: `ShopEra ${laptopNames[i - 1]}`,
      slug: `shopera-${laptopNames[i - 1].toLowerCase().replace(/[^a-z0-9]+/g, '-')}-l${i}`,
      description: `High-fidelity workstation laptop designed for developers, digital designers, and creators. Delivers outstanding thermal performance, high-speed RAM grids, and bright, vivid displays.`,
      price: 74999 + (i * 2500),
      compareAtPrice: 99999 + (i * 3500),
      images: images,
      category: catLaptops,
      inventory: 10 + i,
      ratings: { average: 4.6 + (i % 4) * 0.1, count: 15 + i * 2 },
      features: ['High-contrast AMOLED display', 'Vapor chamber luxury cooling', 'Premium aluminum alloy finish', 'Long-lasting 99Wh cell'],
      tags: ['laptops', 'workstation', 'development', 'creator'],
      specifications: {
        ...specsCommon,
        'Processor': `Intel Core Ultra / AMD Ryzen AI Config`,
        'Memory': `${16 + (i % 3) * 16}GB DDR5 6400MHz`,
        'Display Matrix': 'LTPO High-Refresh OLED'
      }
    });
  }

  // --- 7. SMARTPHONES (15 products) ---
  const catSmartphones = categoryMap['smartphones'];
  const phoneNames = [
    'Nexa Pro Flagship One',
    'Nexa Pro Flagship Two',
    'Nexa Fold Z1 Dual Display',
    'Nexa Flip V1 Compact Pocket',
    'Nexa Lite Budget Edition One',
    'Nexa Lite Budget Edition Two',
    'Nexa Ultra Max Elite Flagship',
    'Nexa Ultra Max Zoom Edition',
    'Nexa Zero Carbon Eco Phone',
    'Nexa Play Esports Gaming Rig',
    'Nexa Cam Studio Director Phone',
    'Nexa Focus Mini Lightweight',
    'Nexa Beam Projection Smartphone',
    'Nexa Wave Curved Screen Concept',
    'Nexa Classic SE Pocket Smart'
  ];

  for (let i = 1; i <= 15; i++) {
    const images = smartphoneImages[i - 1].map(buildImageUrl);
    products.push({
      name: phoneNames[i - 1],
      slug: `${phoneNames[i - 1].toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${i}`,
      description: `Premium handheld smartphone featuring high refresh LTPO OLED screen, advanced AI photography lens array, and quick smart-charging battery cell.`,
      price: 45999 + (i * 1500),
      compareAtPrice: 59999 + (i * 2000),
      images: images,
      category: catSmartphones,
      inventory: 18 + i,
      ratings: { average: 4.4 + (i % 6) * 0.1, count: 22 + i * 3 },
      features: ['Fluid 144Hz screen support', 'Dual-circuit battery charging', 'Ultra-wide premium lens stack', 'Security secure enclave chip'],
      tags: ['smartphones', 'mobile', 'android', 'camera'],
      specifications: {
        ...specsCommon,
        'Screen Type': '6.7-inch Super AMOLED LTPO',
        'Camera Grid': '50MP Main + 48MP Ultrawide + 12MP Telephoto',
        'Processor Type': 'Snapdragon 8 Gen Series Chipset'
      }
    });
  }

  return products;
};
