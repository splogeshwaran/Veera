// VEERA Mock Data Store according to PRD Specifications

const INITIAL_DATA = {
  // Current user state
  currentUser: {
    role: 'farmer', // 'farmer' or 'buyer'
    id: 'farmer-1',
    name: 'Arun Kumar',
    title: 'Farmer & Agro-Ecologist',
    avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=250&q=80',
    location: 'Coimbatore, Tamil Nadu',
    farmSize: '4.5 Acres',
    experience: '12 Years',
    phone: '+91 98421 77320',
    email: 'arun.kumar@veeramail.in',
    crops: ['Tomato', 'Coconut', 'Banana', 'Moringa'],
    bio: 'Third-generation organic farmer practicing sustainable precision drip agriculture and soil rejuvenation in the foothills of Coimbatore.'
  },

  // Pre-configured demo profiles for quick 1-click login
  demoProfiles: {
    farmer: {
      role: 'farmer',
      id: 'farmer-1',
      name: 'Arun Kumar',
      title: 'Progressive Farmer',
      avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=250&q=80',
      location: 'Coimbatore, Tamil Nadu',
      farmSize: '4.5 Acres',
      experience: '12 Years',
      phone: '+91 98421 77320',
      email: 'arun.farm@veeramail.in',
      crops: ['Tomato', 'Coconut', 'Banana', 'Moringa'],
      bio: 'Cultivating native & hybrid tomato varieties and tender coconuts using natural manure and zero chemical residue practices.'
    },
    buyer: {
      role: 'buyer',
      id: 'buyer-1',
      name: 'Priya Sharma',
      title: 'Procurement Lead, FreshBasket Organics',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80',
      location: 'Bengaluru, Karnataka',
      buyerType: 'Retail & Restaurant Buyer',
      phone: '+91 97110 44291',
      email: 'priya.sharma@freshbasket.in',
      interests: ['Vegetables', 'Fruits', 'Organic Spices', 'Dairy'],
      bio: 'Sourcing direct-from-farm chemical-free fresh produce for 14 farm-to-table restaurants and organic grocery stores.'
    }
  },

  // Marketplace Products
  products: [
    {
      id: 'prod-1',
      name: 'Fresh Farm Tomatoes (Shimla Hybrid)',
      category: 'Vegetables',
      farmerId: 'farmer-1',
      farmerName: 'Arun Kumar',
      farmerAvatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=150&q=80',
      location: 'Coimbatore, Tamil Nadu',
      price: 35,
      unit: 'kg',
      quantity: '500 kg',
      availability: 'This week',
      isOrganic: true,
      image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80',
      description: 'Vine-ripened, high-brix farm fresh tomatoes harvested early morning. Grown using bio-compost and zero synthetic insecticides. Ideal for wholesale, culinary businesses, and fresh markets.',
      minOrder: '25 kg',
      harvestDate: 'Oct 04, 2026'
    },
    {
      id: 'prod-2',
      name: 'Pollachi Tender Coconuts (Sweet Water)',
      category: 'Fruits',
      farmerId: 'farmer-1',
      farmerName: 'Arun Kumar',
      farmerAvatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=150&q=80',
      location: 'Pollachi / Coimbatore, Tamil Nadu',
      price: 48,
      unit: 'nut',
      quantity: '1,200 pcs',
      availability: 'Ready to Ship',
      isOrganic: true,
      image: 'https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?auto=format&fit=crop&w=800&q=80',
      description: 'Authentic GI-region Pollachi coconuts known for extraordinarily sweet, mineral-rich water (450ml+ per nut) and thick kernel.',
      minOrder: '50 pcs',
      harvestDate: 'Oct 05, 2026'
    },
    {
      id: 'prod-3',
      name: 'Robusta Golden Bananas (Naturally Ripened)',
      category: 'Fruits',
      farmerId: 'farmer-1',
      farmerName: 'Arun Kumar',
      farmerAvatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=150&q=80',
      location: 'Coimbatore, Tamil Nadu',
      price: 40,
      unit: 'kg',
      quantity: '350 kg',
      availability: 'Fresh Harvest',
      isOrganic: true,
      image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=800&q=80',
      description: 'Naturally ethylene-free ripened sweet Robusta bananas grown along natural watershed boundaries.',
      minOrder: '30 kg',
      harvestDate: 'Oct 03, 2026'
    },
    {
      id: 'prod-4',
      name: 'Organic Sharbati Golden Wheat',
      category: 'Grains',
      farmerId: 'farmer-2',
      farmerName: 'Ramesh Patel',
      farmerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      location: 'Sehore, Madhya Pradesh',
      price: 46,
      unit: 'kg',
      quantity: '2,500 kg',
      availability: 'In Stock',
      isOrganic: true,
      image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80',
      description: 'Premium rainfed Sharbati wheat grains from the fertile Narmada basin. High protein, naturally sweet flour texture.',
      minOrder: '100 kg',
      harvestDate: 'Sep 28, 2026'
    },
    {
      id: 'prod-5',
      name: 'Unpolished Desi Toor Dal (Pigeon Peas)',
      category: 'Pulses',
      farmerId: 'farmer-3',
      farmerName: 'Sunita Patil',
      farmerAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80',
      location: 'Latur, Maharashtra',
      price: 135,
      unit: 'kg',
      quantity: '800 kg',
      availability: 'This week',
      isOrganic: true,
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
      description: 'Stone-milled, unpolished authentic yellow toor dal retains vital dietary fiber and natural aroma. Chemical-free sorting.',
      minOrder: '25 kg',
      harvestDate: 'Sep 25, 2026'
    },
    {
      id: 'prod-6',
      name: 'High-Curcumin Salem Turmeric Finger',
      category: 'Spices',
      farmerId: 'farmer-4',
      farmerName: 'Muruganandham S.',
      farmerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
      location: 'Erode, Tamil Nadu',
      price: 180,
      unit: 'kg',
      quantity: '400 kg',
      availability: 'Ready to Ship',
      isOrganic: true,
      image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80',
      description: 'Sun-dried Salem variety turmeric with lab-tested 4.8% curcumin content. Deep natural golden color and intense aroma.',
      minOrder: '20 kg',
      harvestDate: 'Sep 20, 2026'
    },
    {
      id: 'prod-7',
      name: 'A2 Gir Cow Bilona Cultured Ghee',
      category: 'Dairy',
      farmerId: 'farmer-5',
      farmerName: 'Devraj Yadav',
      farmerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
      location: 'Anand, Gujarat',
      price: 1450,
      unit: 'litre',
      quantity: '120 litres',
      availability: 'Fresh Batch',
      isOrganic: true,
      image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=800&q=80',
      description: 'Traditional Vedic wooden-churned Bilona ghee prepared from pure grass-fed Gir cow A2 curd. Distinct grainy texture and golden hue.',
      minOrder: '2 litres',
      harvestDate: 'Oct 02, 2026'
    },
    {
      id: 'prod-8',
      name: 'Farm-Fresh Green Crisp Bell Peppers',
      category: 'Vegetables',
      farmerId: 'farmer-1',
      farmerName: 'Arun Kumar',
      farmerAvatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=150&q=80',
      location: 'Coimbatore, Tamil Nadu',
      price: 55,
      unit: 'kg',
      quantity: '300 kg',
      availability: 'This week',
      isOrganic: true,
      image: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=800&q=80',
      description: 'Crispy, thick-walled polyhouse capsicums harvested with calyx intact. No chemical pesticides during flowering.',
      minOrder: '20 kg',
      harvestDate: 'Oct 05, 2026'
    }
  ],

  // Verified Farms Directory (Exclusively for Buyers to browse)
  verifiedFarms: [
    {
      id: 'farmer-1',
      name: 'Arun Kumar',
      farmName: 'Marutham Natural Farm',
      location: 'Coimbatore, Tamil Nadu',
      farmSize: '4.5 Acres',
      experience: '12 Years',
      rating: '4.9 / 5.0 (38 reviews)',
      avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=200&q=80',
      crops: ['Tomato', 'Tender Coconut', 'Robusta Banana', 'Bell Pepper'],
      certifications: ['PGS-India Organic', 'NPOP Certified'],
      minDispatch: '20 kg',
      phone: '+91 98421 77320',
      deliveryZones: 'Tamil Nadu, Bangalore, Kerala',
      bio: 'Practicing micro-drip fertigation with bio-inputs in the Siruvani foothills. Consistent supply partner for organic restaurants.'
    },
    {
      id: 'farmer-2',
      name: 'Ramesh Patel',
      farmName: 'Narmada Heritage Agro',
      location: 'Sehore, Madhya Pradesh',
      farmSize: '8.0 Acres',
      experience: '15 Years',
      rating: '4.8 / 5.0 (24 reviews)',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      crops: ['Sharbati Wheat', 'Desi Chana', 'Soybean'],
      certifications: ['Vedic Krishi Certified'],
      minDispatch: '100 kg',
      phone: '+91 98260 41100',
      deliveryZones: 'Pan-India Freight',
      bio: 'Heirloom seed conservationist growing sun-ripened Sharbati wheat with zero glyphosate and organic vermicompost.'
    },
    {
      id: 'farmer-3',
      name: 'Sunita Patil',
      farmName: 'Sahyadri Organic Fields',
      location: 'Latur, Maharashtra',
      farmSize: '6.2 Acres',
      experience: '9 Years',
      rating: '4.9 / 5.0 (19 reviews)',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
      crops: ['Toor Dal', 'Moong Dal', 'Cold-Pressed Safflower Oil'],
      certifications: ['Jaivik Bharat Certified'],
      minDispatch: '25 kg',
      phone: '+91 94220 88912',
      deliveryZones: 'Maharashtra, Goa, Karnataka',
      bio: 'Women-led organic cooperative specializing in stone-milled unpolished pulses and zero chemical preservative storage.'
    },
    {
      id: 'farmer-4',
      name: 'Muruganandham S.',
      farmName: 'Kaveri Golden Spices',
      location: 'Erode, Tamil Nadu',
      farmSize: '3.8 Acres',
      experience: '18 Years',
      rating: '5.0 / 5.0 (42 reviews)',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      crops: ['Salem Turmeric', 'Small Onions', 'Curry Leaf'],
      certifications: ['Lab Certified 4.8% Curcumin'],
      minDispatch: '15 kg',
      phone: '+91 94433 11890',
      deliveryZones: 'South India & Export Corridors',
      bio: 'Multi-award winning turmeric producer with guaranteed minimum 4.5% natural curcumin content.'
    },
    {
      id: 'farmer-5',
      name: 'Devraj Yadav',
      farmName: 'Gir Goshala & Natural Pastures',
      location: 'Anand, Gujarat',
      farmSize: '12.0 Acres',
      experience: '14 Years',
      rating: '4.9 / 5.0 (56 reviews)',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
      crops: ['A2 Gir Cow Bilona Ghee', 'Desi A2 Butter'],
      certifications: ['Pure Desi Gir Breed Certified'],
      minDispatch: '2 Litres',
      phone: '+91 98980 55321',
      deliveryZones: 'Pan-India Express Air Shipping',
      bio: 'Free-range grass grazed Gir cattle producing authentic Ayurvedic Vedic bilona cultured ghee.'
    }
  ],

  // Buyer Procurement Requests (RFQs - Exclusively for Buyers to create and track)
  buyerRequests: [
    {
      id: 'rfq-1',
      buyerName: 'Priya Sharma',
      buyerOrg: 'FreshBasket Organics',
      location: 'Bengaluru, Karnataka',
      cropNeeded: 'Vine-Ripened Organic Tomatoes',
      quantityNeeded: '300 kg / week',
      targetPrice: '₹32 - 36 / kg',
      frequency: 'Weekly Contract',
      deliveryDate: 'Every Friday morning',
      description: 'Looking for a reliable organic grower within 350km of Bangalore to supply consistent A-grade hybrid tomatoes for 14 farm-to-table bistro kitchens.',
      status: 'Active Demand',
      responsesCount: 2,
      postedDate: '2 days ago'
    },
    {
      id: 'rfq-2',
      buyerName: 'Priya Sharma',
      buyerOrg: 'FreshBasket Organics',
      location: 'Bengaluru, Karnataka',
      cropNeeded: 'Pollachi Sweet Tender Coconuts',
      quantityNeeded: '500 pcs',
      targetPrice: '₹45 - 48 / nut',
      frequency: 'Bi-Weekly',
      deliveryDate: 'Next Tuesday',
      description: 'Seeking tender coconuts with high water volume (>450ml). Direct farm truck loading requested.',
      status: 'Responses Received',
      responsesCount: 3,
      postedDate: '4 days ago'
    },
    {
      id: 'rfq-3',
      buyerName: 'Anand V.',
      buyerOrg: 'The Green Mill Organic Store',
      location: 'Chennai, Tamil Nadu',
      cropNeeded: 'Salem High-Curcumin Turmeric',
      quantityNeeded: '150 kg',
      targetPrice: '₹170 - 185 / kg',
      frequency: 'One-time Batch',
      deliveryDate: 'Oct 15, 2026',
      description: 'Need certified sun-dried Salem turmeric fingers with minimum 4.5% curcumin test report.',
      status: 'Active Demand',
      responsesCount: 1,
      postedDate: 'Yesterday'
    }
  ],

  // Shopping Cart items (Buyer only)
  initialCart: [
    {
      productId: 'prod-1',
      name: 'Fresh Farm Tomatoes (Shimla Hybrid)',
      farmerName: 'Arun Kumar',
      farmerId: 'farmer-1',
      price: 35,
      unit: 'kg',
      quantity: 50,
      image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=200&q=80'
    },
    {
      productId: 'prod-2',
      name: 'Pollachi Tender Coconuts (Sweet Water)',
      farmerName: 'Arun Kumar',
      farmerId: 'farmer-1',
      price: 48,
      unit: 'nut',
      quantity: 40,
      image: 'https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?auto=format&fit=crop&w=200&q=80'
    }
  ],

  // Community Feed Posts
  posts: [
    {
      id: 'post-1',
      author: 'Arun Kumar',
      role: 'Farmer',
      badge: 'Verified Grower',
      location: 'Coimbatore, Tamil Nadu',
      avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=150&q=80',
      time: '3 hours ago',
      category: 'Harvest Updates',
      content: 'Started harvesting fresh tomatoes from my farm this week! Loamy soil preparation combined with drip fertigation paid off with high brix sweetness and firm skins. Looking forward to supplying local restaurants and markets.',
      image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80',
      likes: 38,
      likedByUser: false,
      comments: [
        {
          id: 'c-1',
          author: 'Priya Sharma',
          role: 'Buyer',
          avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&q=80',
          text: 'These look phenomenal, Arun! Sending an enquiry for our weekend restaurant supply.',
          time: '2 hours ago'
        },
        {
          id: 'c-2',
          author: 'Karthik Raja',
          role: 'Agri Student',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80',
          text: 'What drip spacing and mulching sheet gauge did you use this season?',
          time: '1 hour ago'
        }
      ]
    },
    {
      id: 'post-2',
      author: 'Priya S.',
      role: 'Agriculture Professional',
      badge: 'Agronomist',
      location: 'Bengaluru, Karnataka',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      time: '6 hours ago',
      category: 'Agri-Tech',
      content: 'Testing an AI-based crop disease detection model using leaf images. We captured 500+ tomato field samples across Hosur and Coimbatore. Early blight detection accuracy reached 92% in preliminary tests. Simple smartphone cameras can genuinely empower smallholders to spot symptoms before fungal spores spread!',
      image: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=800&q=80',
      likes: 64,
      likedByUser: true,
      comments: [
        {
          id: 'c-3',
          author: 'Arun Kumar',
          role: 'Farmer',
          avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=100&q=80',
          text: 'This would save us huge losses during humid monsoon spells. Glad to see VEERA bringing AI right into the field!',
          time: '4 hours ago'
        }
      ]
    },
    {
      id: 'post-3',
      author: 'Ramesh Patel',
      role: 'Farmer',
      badge: 'Seed Conservationist',
      location: 'Sehore, MP',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      time: '1 day ago',
      category: 'Farming Tips',
      content: 'Natural bio-control alert: intercropping marigold with our tomato and brinjal plots reduced root-knot nematode damage by nearly 40% with zero chemical nematicides. Mother nature already has the algorithms built in!',
      image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80',
      likes: 92,
      likedByUser: false,
      comments: [
        {
          id: 'c-4',
          author: 'Dr. Swaminathan G.',
          role: 'Soil Scientist',
          avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&q=80',
          text: 'Classic alpha-terthienyl root exudation from Tagetes species. Great demonstration Ramesh ji!',
          time: '18 hours ago'
        }
      ]
    }
  ],

  // Opportunities (FARMER ONLY)
  opportunities: [
    {
      id: 'opp-1',
      title: 'AI Crop Disease Detection Project',
      type: 'Agri-tech Project',
      area: 'AI / Agriculture',
      organization: 'GreenVision Agri-Labs',
      location: 'Remote / Field Trials',
      stipend: '₹25,000 / month',
      deadline: 'Nov 15, 2026',
      description: 'Collaborate with machine learning engineers and field agronomists to benchmark computer vision leaf pathogen models on Indian crop varieties.',
      tags: ['Computer Vision', 'PyTorch', 'Field Agronomy', 'Mobile Edge AI'],
      contact: 'careers@greenvision.ai'
    },
    {
      id: 'opp-2',
      title: 'Precision Micro-Irrigation Field Pilot',
      type: 'Collaboration',
      area: 'IoT & Smart Sensors',
      organization: 'Tamil Nadu Agri Innovation Consortium',
      location: 'Coimbatore & Tiruppur',
      stipend: 'Grant Funded Pilot',
      deadline: 'Oct 30, 2026',
      description: 'Looking for 10 progressive horticultural farmers to trial solar LoRaWAN soil moisture probes and automated valve schedulers across 2-5 acre plots.',
      tags: ['Smart Irrigation', 'IoT Sensors', 'Water Conservation'],
      contact: 'pilots@tn-agri.org'
    },
    {
      id: 'opp-3',
      title: 'Junior Agri-Supply Chain Associate',
      type: 'Agriculture Jobs',
      area: 'Direct Farm Procurement',
      organization: 'KisanDirect Supply Chain',
      location: 'Bengaluru / Hybrid',
      stipend: '₹4.8 - 6.5 LPA',
      deadline: 'Rolling Basis',
      description: 'Coordinate fresh harvest pick-ups from farmer clusters, ensure APMC quality benchmarking, and build direct relations with organic growers.',
      tags: ['Procurement', 'Cold Chain', 'Logistics', 'Farmer Relations'],
      contact: 'talent@kisandirect.in'
    },
    {
      id: 'opp-4',
      title: 'GIS Remote Sensing Internship (Crop Health)',
      type: 'Professional Internships',
      area: 'Satellite Analytics',
      organization: 'GeoAgro Spatial Tech',
      location: 'Remote',
      stipend: '₹15,000 / month',
      deadline: 'Nov 05, 2026',
      description: 'Analyze Sentinel-2 NDVI spectral reflectance curves to map vegetative vigour indices and drought stress across southern peninsula districts.',
      tags: ['GIS', 'Sentinel-2', 'QGIS / Python', 'Remote Sensing'],
      contact: 'internships@geoagro.io'
    },
    {
      id: 'opp-5',
      title: 'Farm-to-Fork Organic Sourcing Partnership',
      type: 'Technology Opportunities',
      area: 'Market Linkage',
      organization: 'PureEarth Gourmet Kitchens',
      location: 'Chennai & Coimbatore',
      stipend: 'Long-term Supplier Contract',
      deadline: 'Open Intake',
      description: 'Exclusive 12-month procurement contract for certified natural farmers growing heirloom vegetables, cold-pressed oils, and millets.',
      tags: ['Bulk Buy', 'Assured MSP+', 'Direct Payment'],
      contact: 'partnerships@pureearth.com'
    }
  ],

  // Inquiries / Messages (connects Buyer and Farmer)
  enquiries: [
    {
      id: 'enq-1',
      farmerId: 'farmer-1',
      farmerName: 'Arun Kumar',
      buyerName: 'Priya Sharma',
      buyerRole: 'FreshBasket Organics',
      buyerPhone: '+91 97110 44291',
      buyerEmail: 'priya.sharma@freshbasket.in',
      productId: 'prod-1',
      productName: 'Fresh Farm Tomatoes (Shimla Hybrid)',
      quantityRequested: '200 kg',
      message: 'Hello Arun ji, we require 200 kg of your vine-ripened tomatoes delivered to our Indiranagar kitchen hub this Friday. Please confirm dispatch capability.',
      status: 'New Enquiry',
      date: 'Today, 04:15 PM'
    },
    {
      id: 'enq-2',
      farmerId: 'farmer-1',
      farmerName: 'Arun Kumar',
      buyerName: 'Vikram Mehta',
      buyerRole: 'The Green Fork Bistro',
      buyerPhone: '+91 98200 11984',
      buyerEmail: 'vikram@greenfork.com',
      productId: 'prod-2',
      productName: 'Pollachi Tender Coconuts (Sweet Water)',
      quantityRequested: '100 pcs',
      message: 'Need 100 sweet tender coconuts every Tuesday morning. Can you supply continuously for the next 2 months?',
      status: 'Responded',
      date: 'Yesterday, 11:30 AM'
    },
    {
      id: 'enq-3',
      farmerId: 'farmer-1',
      farmerName: 'Arun Kumar',
      buyerName: 'Anand Rao',
      buyerRole: 'Wholesale Agri Merchant',
      buyerPhone: '+91 94432 88123',
      buyerEmail: 'anand.rao@coimbatoremarket.com',
      productId: 'prod-8',
      productName: 'Farm-Fresh Green Crisp Bell Peppers',
      quantityRequested: '150 kg',
      message: 'Looking for uniform A-grade capsicums for supermarket packaging. Please share grading photos.',
      status: 'In Progress',
      date: 'Oct 04, 2026'
    }
  ],

  // Market Intelligence Data (FARMER ONLY)
  marketData: {
    'Tomato': {
      'Coimbatore Mandi': {
        currentPrice: 35,
        prevPrice: 31,
        demand: 'High',
        demandLevel: 85,
        supply: 'Moderate',
        supplyLevel: 55,
        trend: 'Increasing (+12.9%)',
        history: [
          { day: 'Mon', price: 29 },
          { day: 'Tue', price: 30 },
          { day: 'Wed', price: 32 },
          { day: 'Thu', price: 31 },
          { day: 'Fri', price: 33 },
          { day: 'Sat', price: 34 },
          { day: 'Sun', price: 35 }
        ],
        advisory: 'Harvest dispatch is favorable over next 3-5 days. Steady festive wholesale demand observed across south tier-1 markets.'
      },
      'Nashik APMC': {
        currentPrice: 28,
        prevPrice: 26,
        demand: 'Moderate',
        demandLevel: 65,
        supply: 'High',
        supplyLevel: 80,
        trend: 'Stable (+7.6%)',
        history: [
          { day: 'Mon', price: 25 },
          { day: 'Tue', price: 26 },
          { day: 'Wed', price: 25 },
          { day: 'Thu', price: 27 },
          { day: 'Fri', price: 26 },
          { day: 'Sat', price: 27 },
          { day: 'Sun', price: 28 }
        ],
        advisory: 'Steady supply arrivals from Pimpalgaon belt. High grade sorting earns 15% price premium.'
      },
      'Azadpur Mandi': {
        currentPrice: 42,
        prevPrice: 38,
        demand: 'Very High',
        demandLevel: 92,
        supply: 'Low',
        supplyLevel: 40,
        trend: 'Increasing (+10.5%)',
        history: [
          { day: 'Mon', price: 36 },
          { day: 'Tue', price: 37 },
          { day: 'Wed', price: 39 },
          { day: 'Thu', price: 40 },
          { day: 'Fri', price: 41 },
          { day: 'Sat', price: 41 },
          { day: 'Sun', price: 42 }
        ],
        advisory: 'Strong institutional and restaurant procurement driving prices upward.'
      }
    },
    'Onion': {
      'Coimbatore Mandi': {
        currentPrice: 48,
        prevPrice: 45,
        demand: 'High',
        demandLevel: 80,
        supply: 'Moderate',
        supplyLevel: 60,
        trend: 'Increasing (+6.6%)',
        history: [
          { day: 'Mon', price: 42 },
          { day: 'Tue', price: 43 },
          { day: 'Wed', price: 45 },
          { day: 'Thu', price: 46 },
          { day: 'Fri', price: 47 },
          { day: 'Sat', price: 47 },
          { day: 'Sun', price: 48 }
        ],
        advisory: 'Stock arrivals moderate from Lasalgaon. Storage quality onions holding solid support.'
      },
      'Nashik APMC': {
        currentPrice: 38,
        prevPrice: 36,
        demand: 'Very High',
        demandLevel: 90,
        supply: 'High',
        supplyLevel: 75,
        trend: 'Increasing (+5.5%)',
        history: [
          { day: 'Mon', price: 34 },
          { day: 'Tue', price: 35 },
          { day: 'Wed', price: 36 },
          { day: 'Thu', price: 36 },
          { day: 'Fri', price: 37 },
          { day: 'Sat', price: 37 },
          { day: 'Sun', price: 38 }
        ],
        advisory: 'Lasalgaon main yard volume active. Red onion varieties clearing rapidly.'
      }
    },
    'Banana': {
      'Coimbatore Mandi': {
        currentPrice: 40,
        prevPrice: 38,
        demand: 'High',
        demandLevel: 78,
        supply: 'Balanced',
        supplyLevel: 70,
        trend: 'Increasing (+5.2%)',
        history: [
          { day: 'Mon', price: 36 },
          { day: 'Tue', price: 37 },
          { day: 'Wed', price: 38 },
          { day: 'Thu', price: 38 },
          { day: 'Fri', price: 39 },
          { day: 'Sat', price: 40 },
          { day: 'Sun', price: 40 }
        ],
        advisory: 'Tiruchirappalli and Mettupalayam arrivals steady. Consistent institutional buyer demand.'
      }
    },
    'Wheat': {
      'Indore Mandi': {
        currentPrice: 45,
        prevPrice: 44,
        demand: 'Steady',
        demandLevel: 70,
        supply: 'Good',
        supplyLevel: 75,
        trend: 'Stable (+2.2%)',
        history: [
          { day: 'Mon', price: 43 },
          { day: 'Tue', price: 44 },
          { day: 'Wed', price: 44 },
          { day: 'Thu', price: 44 },
          { day: 'Fri', price: 45 },
          { day: 'Sat', price: 45 },
          { day: 'Sun', price: 45 }
        ],
        advisory: 'Sharbati varieties commanding premium of ₹4-7/kg above standard mill quality.'
      }
    }
  },

  // Disease Detection Sample Cases (FARMER ONLY)
  sampleDiseases: [
    {
      id: 'dis-1',
      name: 'Early Blight (Alternaria solani)',
      crop: 'Tomato',
      sampleThumb: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=300&q=80',
      sampleTitle: 'Tomato Leaf Sample A',
      confidence: 87,
      symptoms: 'Concentric brown target-like rings on mature leaves, surrounded by pale chlorotic yellow halos. Stem collar lesions visible.',
      suggestedAction: 'Isolate affected foliage immediately. Ensure morning drip irrigation to prevent evening leaf dampness. Consult your local Krishi Vigyan Kendra before chemical fungicide application.',
      bioRemedy: 'Neem seed kernel extract (NSKE 5%) or copper oxychloride spray at early notice.'
    },
    {
      id: 'dis-2',
      name: 'Powdery Mildew (Oidium neolycopersici)',
      crop: 'Bell Pepper / Capsicum',
      sampleThumb: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=300&q=80',
      sampleTitle: 'Capsicum Leaf Sample B',
      confidence: 93,
      symptoms: 'White powdery fungal patches on upper leaf surfaces. Curling of young leaves and premature defoliation.',
      suggestedAction: 'Prune overcrowded branches to improve sunlight penetration and air circulation across the polyhouse canopy.',
      bioRemedy: 'Diluted organic milk-water foliar spray (1:9 ratio) or potassium bicarbonate bio-solution.'
    },
    {
      id: 'dis-3',
      name: 'Rice Leaf Blast (Magnaporthe oryzae)',
      crop: 'Paddy / Rice',
      sampleThumb: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=300&q=80',
      sampleTitle: 'Paddy Leaf Sample C',
      confidence: 89,
      symptoms: 'Spindle-shaped diamond lesions with greyish center and reddish-brown borders along leaf blades.',
      suggestedAction: 'Regulate high nitrogen fertilizer application and maintain shallow standing water table.',
      bioRemedy: 'Pseudomonas fluorescens seed treatment and foliar application (2.5 kg/ha).'
    },
    {
      id: 'dis-4',
      name: 'Healthy Foliage — No Pathogen Detected',
      crop: 'Organic Maize / Corn',
      sampleThumb: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=300&q=80',
      sampleTitle: 'Healthy Leaf Sample D',
      confidence: 96,
      symptoms: 'Vibrant chlorophyll pigmentation, clean vascular venation, and zero fungal or bacterial spotting.',
      suggestedAction: 'Maintain current mulching, drip fertigation, and preventative neem prophylactic sprays.',
      bioRemedy: 'Routine Panchagavya or seaweed bio-stimulant foliar spray for nutrient density.'
    }
  ]
};