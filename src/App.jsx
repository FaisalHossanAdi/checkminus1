import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShieldCheck, 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  LogOut, 
  Upload, 
  MessageSquare, 
  TrendingDown, 
  Info, 
  Coins, 
  ChevronLeft, 
  ChevronRight, 
  Activity, 
  HeartCrack, 
  Clock, 
  ArrowRight, 
  Wallet, 
  AlertTriangle, 
  Globe, 
  ShoppingCart, 
  User, 
  ShoppingBag, 
  Bell, 
  Lock, 
  MapPin, 
  Phone, 
  CreditCard, 
  CheckCircle, 
  Sparkles 
} from "lucide-react";

// Word First Character Caps Lock Helper (Title Case)
const toTitleCase = (str) => {
  if (!str) return '';
  return str
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Initial Mock Data
const initialCategories = [
  { id: 'cat-1', name: 'Smartphones' },
  { id: 'cat-2', name: 'Software & VPN' },
  { id: 'cat-3', name: 'Laptops' },
  { id: 'cat-other', name: 'Other' } 
];

const initialBrands = [
  { id: 'brand-1', categoryId: 'cat-1', name: 'Samsung', logoUrl: 'https://images.unsplash.com/photo-1610792516307-ea5acd9c3b00?w=120&auto=format&fit=crop&q=60', approved: true },
  { id: 'brand-2', categoryId: 'cat-1', name: 'Apple', logoUrl: 'https://images.unsplash.com/photo-1563206767-5b18f218e8de?w=120&auto=format&fit=crop&q=60', approved: true },
  { id: 'brand-3', categoryId: 'cat-2', name: 'Cat VPN', logoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=60', approved: true },
];

const initialProducts = [
  {
    id: 'prod-1',
    brandId: 'brand-1',
    modelName: 'Galaxy S24 Ultra',
    faultScore: 48,
    timeline: [15, 25, 48, 65, 80],
    description: 'Significant camera shutter lag and screen vividness issues reported in early batches.',
    affiliateLink: 'https://amazon.com/dp/S24Ultra-affiliate-id',
    faults: [
      { id: 'f-1', text: 'Camera Shutter Lag In Low Light', votes: 142, approved: true },
      { id: 'f-2', text: 'Display Gradient Flickering', votes: 218, approved: true }
    ]
  },
  {
    id: 'prod-2',
    brandId: 'brand-3',
    modelName: 'Cat VPN Pro',
    faultScore: 78,
    timeline: [10, 50, 78, 90, 100],
    description: 'Automatically disconnects after exactly 4 hours of usage, cutting off secure tunnel.',
    affiliateLink: 'https://nordvpn.com/partner-affiliate-id',
    faults: [
      { id: 'f-3', text: 'Auto Disconnection After 4 Hours', votes: 540, approved: true }
    ]
  },
  {
    id: 'prod-3',
    brandId: 'brand-2',
    modelName: 'MacBook Air M3',
    faultScore: 12,
    timeline: [2, 5, 8, 12, 18],
    description: 'Highly reliable performance, minor anodized finish wear around charging ports.',
    affiliateLink: 'https://amazon.com/dp/MacBookM3-affiliate-id',
    faults: [
      { id: 'f-5', text: 'Midnight Color Chipping Off Easily', votes: 95, approved: true }
    ]
  }
];

// E-commerce Store Mock Inventory
const storeProducts = [
  { id: 'sp-1', name: 'Premium Shockproof Phone Case', price: 1200, pointsCost: 150, image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=300&auto=format&fit=crop&q=80' },
  { id: 'sp-2', name: 'High-Speed Type-C Braided Cable', price: 650, pointsCost: 80, image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=300&auto=format&fit=crop&q=80' },
  { id: 'sp-3', name: 'Anti-Glare Matte Screen Protector', price: 450, pointsCost: 50, image: 'https://images.unsplash.com/photo-1581090700227-13617d58f35f?w=300&auto=format&fit=crop&q=80' },
  { id: 'sp-4', name: 'Universal Magnetic Car Mount', price: 1800, pointsCost: 200, image: 'https://images.unsplash.com/photo-1586105251261-72a756497a11?w=300&auto=format&fit=crop&q=80' },
];

// Rich Mock Visitor Analytics for Admin Dashboard
const analyticsData = {
  totalVisitors: 14850,
  countries: [
    { name: 'Bangladesh', count: 9800, percentage: 66 },
    { name: 'India', count: 2450, percentage: 16 },
    { name: 'USA', count: 1500, percentage: 10 },
    { name: 'Others', count: 1100, percentage: 8 }
  ],
  districts: [
    { name: 'Dhaka', count: 5400 },
    { name: 'Chittagong', count: 1800 },
    { name: 'Sylhet', count: 950 },
    { name: 'Rajshahi', count: 850 },
    { name: 'Khulna', count: 800 }
  ],
  ageDemographics: [
    { range: '18-24', percentage: 45 },
    { range: '25-34', percentage: 38 },
    { range: '35-44', percentage: 12 },
    { range: '45+', percentage: 5 }
  ],
  gender: { male: 72, female: 26, other: 2 }
};

export default function App() {
  // Navigation: 'index' | 'store' | 'user-dashboard' | 'admin-dashboard' | 'thank-you'
  const [currentView, setCurrentView] = useState('index');

  // Core App States (Synced with LocalStorage to prevent reset during prototyping)
  const [categories, setCategories] = useState(() => JSON.parse(localStorage.getItem('c1_categories')) || initialCategories);
  const [brands, setBrands] = useState(() => JSON.parse(localStorage.getItem('c1_brands')) || initialBrands);
  const [products, setProducts] = useState(() => JSON.parse(localStorage.getItem('c1_products')) || initialProducts);
  const [pendingBrands, setPendingBrands] = useState(() => JSON.parse(localStorage.getItem('c1_pendingBrands')) || []);
  
  // Auth States
  const [isLoggedIn, setIsLoggedIn] = useState(() => JSON.parse(localStorage.getItem('c1_isLoggedIn')) || false);
  const [userRole, setUserRole] = useState(() => localStorage.getItem('c1_userRole') || 'user'); // 'user' or 'admin'
  const [username, setUsername] = useState(() => localStorage.getItem('c1_username') || 'Guest Contributor');
  const [userPoints, setUserPoints] = useState(() => parseInt(localStorage.getItem('c1_userPoints')) || 250); // Seeded with 250 points
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'Welcome to CheckMinus1! Earn points by indexing models.', unread: true },
    { id: 2, text: 'Admin approved your Samsung model submission. +10 Points earned!', unread: false }
  ]);

  // E-commerce Cart States
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutForm, setCheckoutForm] = useState({ name: '', address: '', phone: '', paymentMethod: 'cod' });
  const [countdown, setCountdown] = useState(10);
  const [lastOrderDetails, setLastOrderDetails] = useState(null);

  // Search, Selection & UI States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [activeProduct, setActiveProduct] = useState(null);
  
  // Form Popups
  const [showBrandForm, setShowBrandForm] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [showProblemForm, setShowProblemForm] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authTab, setAuthTab] = useState('login');

  // Specific Form inputs
  const [brandName, setBrandName] = useState('');
  const [brandLogoPreview, setBrandLogoPreview] = useState('');
  const [prodName, setProdName] = useState('');
  const [prodBrandId, setProdBrandId] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [probProduct, setProbProduct] = useState('');
  const [probText, setProbText] = useState('Battery Degradation & Fast Draining');
  const [customProbText, setCustomProbText] = useState('');

  // Password Reset simulation
  const [passForm, setPassForm] = useState({ current: '', newPass: '' });

  // Status/Alert Banner
  const [alertBanner, setAlertBanner] = useState({ show: false, msg: '', type: 'success' });

  // Inject CSS Keyframes once component mounts
  useEffect(() => {
    const styleId = 'checkminus1-styles';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.innerHTML = `
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.97); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.25s ease-out forwards; }
        .animate-slideIn { animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `;
      document.head.appendChild(style);
    }
  }, []);

  // Synced Storage hooks
  useEffect(() => {
    localStorage.setItem('c1_categories', JSON.stringify(categories));
    localStorage.setItem('c1_brands', JSON.stringify(brands));
    localStorage.setItem('c1_products', JSON.stringify(products));
    localStorage.setItem('c1_pendingBrands', JSON.stringify(pendingBrands));
    localStorage.setItem('c1_isLoggedIn', JSON.stringify(isLoggedIn));
    localStorage.setItem('c1_userRole', userRole);
    localStorage.setItem('c1_username', username);
    localStorage.setItem('c1_userPoints', userPoints.toString());
  }, [categories, brands, products, pendingBrands, isLoggedIn, userRole, username, userPoints]);

  const triggerAlert = (msg, type = 'success') => {
    setAlertBanner({ show: true, msg, type });
    setTimeout(() => setAlertBanner({ show: false, msg: '', type: 'success' }), 4000);
  };

  // Automated Count-down timer for Order Redirect
  useEffect(() => {
    let timer;
    if (currentView === 'thank-you' && countdown > 0) {
      timer = setInterval(() => setCountdown(prev => prev - 1), 1000);
    } else if (currentView === 'thank-you' && countdown === 0) {
      setCurrentView('index');
      setCountdown(10);
    }
    return () => clearInterval(timer);
  }, [currentView, countdown]);

  // Auth Operations
  const handleAuthSubmit = (e) => {
    e.preventDefault();
    if (authTab === 'login') {
      setIsLoggedIn(true);
      // Hardcoded login rules for demonstration/testing
      if (checkoutForm.name.toLowerCase().includes('admin') || checkoutForm.address.toLowerCase().includes('admin')) {
        setUserRole('admin');
        setUsername('Root Administrator');
        triggerAlert('Logged in securely as Admin.');
      } else {
        setUserRole('user');
        setUsername('Rashedul Islam');
        triggerAlert('Logged in successfully.');
      }
    } else {
      setIsLoggedIn(true);
      setUserRole('user');
      setUsername(toTitleCase(checkoutForm.name) || 'New Contributor');
      triggerAlert('Registration Successful! Checked from ' + (checkoutForm.address || 'Bangladesh'));
    }
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole('user');
    setUsername('Guest Contributor');
    setCurrentView('index');
    triggerAlert('Logged out securely.');
  };

  // E-commerce Cart Actions
  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      triggerAlert('Item already in your cart!');
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
      triggerAlert('Added to your shopping cart!');
    }
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  // Validate and Submit E-commerce Order
  const handleCheckout = (e) => {
    e.preventDefault();
    const phoneRegex = /^01[3-9]\d{8}$/; // Bangladeshi standard 11 digits validation

    if (!checkoutForm.name.trim() || !checkoutForm.address.trim()) {
      triggerAlert('Please complete all delivery fields.', 'error');
      return;
    }

    if (!phoneRegex.test(checkoutForm.phone)) {
      triggerAlert('Error: Phone number must be a valid 11-digit Bangladeshi number.', 'error');
      return;
    }

    // Calculate totals
    const pointsTotal = cart.reduce((sum, item) => sum + item.pointsCost, 0);
    const moneyTotal = cart.reduce((sum, item) => sum + item.price, 0);

    if (checkoutForm.paymentMethod === 'points') {
      if (userPoints < pointsTotal) {
        triggerAlert('Insufficient points balance inside wallet!', 'error');
        return;
      }
      setUserPoints(prev => prev - pointsTotal);
    }

    setLastOrderDetails({
      items: [...cart],
      totalPaid: checkoutForm.paymentMethod === 'points' ? `${pointsTotal} Pts` : `৳ ${moneyTotal}`,
      method: checkoutForm.paymentMethod.toUpperCase(),
      name: checkoutForm.name,
      phone: checkoutForm.phone
    });

    // Success transition
    setCart([]);
    setIsCartOpen(false);
    setCountdown(10);
    setCurrentView('thank-you');
    triggerAlert('Order received successfully!');
  };

  // Dynamic Content Submission with Autocapitalization
  const handleBrandUpload = (e) => {
    e.preventDefault();
    if (!brandName.trim()) return;

    const formattedName = toTitleCase(brandName);
    const finalLogo = brandLogoPreview || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=60';

    const newBrand = {
      id: `brand-${Date.now()}`,
      categoryId: 'cat-other', // Standard users fallback to "Other" category
      name: formattedName,
      logoUrl: finalLogo,
      approved: userRole === 'admin' ? true : false
    };

    if (userRole === 'admin') {
      setBrands([...brands, newBrand]);
      triggerAlert('Brand added and approved directly by Admin!');
    } else {
      setPendingBrands([...pendingBrands, newBrand]);
      triggerAlert('Brand submitted for Admin review. Placed under "Other" category.');
    }

    setBrandName('');
    setBrandLogoPreview('');
    setShowBrandForm(false);
  };

  // Index new Model (+10 points)
  const handleProductUpload = (e) => {
    e.preventDefault();
    if (!prodName.trim() || !prodBrandId) return;

    const formattedModel = toTitleCase(prodName);
    const newProduct = {
      id: `prod-${Date.now()}`,
      brandId: prodBrandId,
      modelName: formattedModel,
      faultScore: 10, // Starting minimal fault score
      timeline: [5, 10, 15, 20, 25],
      description: prodDesc || 'No user-submitted description provided yet.',
      affiliateLink: 'https://amazon.com/s?k=' + encodeURIComponent(formattedModel),
      faults: [{ id: `f-${Date.now()}`, text: 'Initial Index Active', votes: 1, approved: true }]
    };

    setProducts([...products, newProduct]);
    setUserPoints(prev => prev + 10); // Reward 10 pts
    
    // Auto add notification
    setNotifications([
      { id: Date.now(), text: `You successfully indexed ${formattedModel}! +10 Points rewarded.`, unread: true },
      ...notifications
    ]);

    setProdName('');
    setProdDesc('');
    setProdBrandId('');
    setShowProductForm(false);
    triggerAlert('Product indexed! +10 Points added to your wallet.');
  };

  // Report observed bug / fault (Auto verification for existing)
  const handleProblemSubmission = (e) => {
    e.preventDefault();
    if (!probProduct) return;

    const finalProblem = probText === 'Other' ? toTitleCase(customProbText) : probText;
    if (!finalProblem.trim()) return;

    // Direct injection into existing product model
    const updatedProducts = products.map(p => {
      if (p.id === probProduct) {
        // Check if exact fault exists
        const exists = p.faults.some(f => f.text.toLowerCase() === finalProblem.toLowerCase());
        let updatedFaults;

        if (exists) {
          updatedFaults = p.faults.map(f => 
            f.text.toLowerCase() === finalProblem.toLowerCase() ? { ...f, votes: f.votes + 1 } : f
          );
        } else {
          updatedFaults = [...p.faults, { id: `f-${Date.now()}`, text: finalProblem, votes: 2, approved: true }];
        }

        return {
          ...p,
          faults: updatedFaults,
          faultScore: Math.min(100, p.faultScore + 3) // Increase fault score due to user report
        };
      }
      return p;
    });

    setProducts(updatedProducts);
    
    // Auto update popup state if visible
    if (activeProduct && activeProduct.id === probProduct) {
      const activeRef = updatedProducts.find(p => p.id === probProduct);
      setActiveProduct(activeRef);
    }

    setUserPoints(prev => prev + 5); // Submit points award
    triggerAlert('Fault submitted and automatically upvoted! +5 Points.');
    setShowProblemForm(false);
    setProbProduct('');
    setCustomProbText('');
  };

  // Upvote fault
  const upvoteFault = (prodId, faultId) => {
    const updated = products.map(p => {
      if (p.id === prodId) {
        const updatedFaults = p.faults.map(f => f.id === faultId ? { ...f, votes: f.votes + 1 } : f);
        return { ...p, faults: updatedFaults, faultScore: Math.min(100, p.faultScore + 1) };
      }
      return p;
    });
    setProducts(updated);
    if (activeProduct && activeProduct.id === prodId) {
      setActiveProduct(updated.find(p => p.id === prodId));
    }
    triggerAlert('I Face This Too (-1) vote registered.');
  };

  // Simulated image upload converter
  const handleImgUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 200 * 1024) {
        triggerAlert('Image upload limit: Max file size is 200 KB.', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => setBrandLogoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Admin routing panel actions
  const approveBrand = (pendingItem, catId, newCatName) => {
    let finalCatId = catId;
    if (newCatName && newCatName.trim()) {
      const formatted = toTitleCase(newCatName);
      const newCatObj = { id: `cat-${Date.now()}`, name: formatted };
      setCategories([...categories, newCatObj]);
      finalCatId = newCatObj.id;
    }

    const approvedItem = { ...pendingItem, categoryId: finalCatId, approved: true };
    setBrands([...brands, approvedItem]);
    setPendingBrands(pendingBrands.filter(b => b.id !== pendingItem.id));
    triggerAlert('Brand approved and indexed successfully.');
  };

  const rejectBrand = (id) => {
    setPendingBrands(pendingBrands.filter(b => b.id !== id));
    triggerAlert('Brand recommendation declined.', 'info');
  };

  // Fuzzy search filters
  const fuzzyBrands = useMemo(() => {
    if (searchQuery.length < 2) return [];
    return brands.filter(b => b.approved && b.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [brands, searchQuery]);

  const filteredBrandsList = useMemo(() => {
    return brands.filter(b => {
      if (!b.approved) return false;
      const matchCat = selectedCategory === 'all' || b.categoryId === selectedCategory;
      const matchQuery = b.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [brands, selectedCategory, searchQuery]);

  const filteredProductsList = useMemo(() => {
    return products.filter(p => {
      const brand = brands.find(b => b.id === p.brandId);
      if (!brand) return false;
      const matchCat = selectedCategory === 'all' || brand.categoryId === selectedCategory;
      const matchBrand = selectedBrand === 'all' || p.brandId === selectedBrand;
      const matchQuery = p.modelName.toLowerCase().includes(searchQuery.toLowerCase()) || brand.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchBrand && matchQuery;
    });
  }, [products, brands, selectedCategory, selectedBrand, searchQuery]);

  // E-commerce alternatives recommender
  const suggestedAlternative = useMemo(() => {
    if (!activeProduct) return null;
    const currentBrand = brands.find(b => b.id === activeProduct.brandId);
    if (!currentBrand) return null;

    // Filter products within same category that have better (lower) fault score
    const matches = products.filter(p => {
      if (p.id === activeProduct.id) return false;
      const b = brands.find(brand => brand.id === p.brandId);
      return b && b.categoryId === currentBrand.categoryId && p.faultScore < activeProduct.faultScore;
    });

    // Sort by lowest fault score
    return matches.sort((a, b) => a.faultScore - b.faultScore)[0] || null;
  }, [activeProduct, products, brands]);

  return (
    <div className="min-h-screen bg-[#FAF9FC] text-slate-800 font-sans flex flex-col justify-between relative overflow-x-hidden">
      
      {/* Visual Background Glower (Matching image_09a3d2.jpg) */}
      <div className="absolute top-0 inset-x-0 h-[600px] bg-gradient-to-b from-indigo-50/40 via-[#F5F2F7] to-transparent pointer-events-none -z-10" />
      <div className="absolute top-20 left-10 w-96 h-96 rounded-full bg-violet-100/50 blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-40 right-10 w-96 h-96 rounded-full bg-rose-100/30 blur-3xl pointer-events-none -z-10" />

      {/* Floating Alerts Container */}
      {alertBanner.show && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-[#1E202B] text-white px-5 py-3 rounded-2xl shadow-xl transition-all animate-bounce">
          <span className={`w-2.5 h-2.5 rounded-full ${alertBanner.type === 'error' ? 'bg-rose-500' : 'bg-emerald-400'}`}></span>
          <span className="text-xs font-bold">{alertBanner.msg}</span>
        </div>
      )}

      {/* Primary Header Navbar */}
      <header className="border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-40 px-4 py-3.5 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Brand Identity Logos */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentView('index')}>
            <div className="bg-[#F41B5E] text-white font-black text-xl w-10 h-10 rounded-xl flex items-center justify-center shadow-md shadow-rose-200">
              -1
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900">
                Check<span className="text-[#F41B5E]">Minus1</span>
              </h1>
              <p className="text-[10px] text-slate-500 font-semibold tracking-wide">Crowdsourced Fault Indices</p>
            </div>
          </div>

          {/* Autocomplete Search Bar */}
          <div className="flex-1 max-w-md w-full relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Search Samsung, MacBook, Cat VPN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#FAF9FC] text-slate-800 placeholder-slate-400 pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:border-[#F41B5E] focus:bg-white focus:outline-none transition-all text-xs"
            />
            {fuzzyBrands.length > 0 && (
              <div className="absolute top-11 left-0 right-0 bg-white border border-slate-100 rounded-xl shadow-xl z-50 p-2 text-xs">
                <p className="text-[9px] text-slate-400 font-bold px-2 py-1 uppercase tracking-wider">Matching Brands:</p>
                {fuzzyBrands.map(b => (
                  <button
                    key={b.id}
                    onClick={() => { setSelectedBrand(b.id); setSearchQuery(''); }}
                    className="w-full text-left px-3 py-1.5 hover:bg-slate-50 rounded-lg flex items-center gap-2"
                  >
                    <img src={b.logoUrl} alt="" className="w-5 h-5 rounded-full object-cover border" />
                    <span className="font-semibold text-slate-700">{b.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Portal Controls */}
          <div className="flex items-center gap-3 flex-wrap">
            <button 
              onClick={() => setCurrentView('store')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                currentView === 'store' ? 'bg-[#F41B5E] text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Store</span>
            </button>

            {isLoggedIn && (
              <button
                onClick={() => setCurrentView(userRole === 'admin' ? 'admin-dashboard' : 'user-dashboard')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                  ['user-dashboard', 'admin-dashboard'].includes(currentView) ? 'bg-[#F41B5E] text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {userRole === 'admin' ? <ShieldCheck className="w-4 h-4" /> : <User className="w-4 h-4" />}
                <span>{userRole === 'admin' ? 'Admin Portal' : 'My Dashboard'}</span>
              </button>
            )}

            {/* Cart Controller */}
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 bg-slate-50 hover:bg-slate-100 rounded-xl text-slate-700 transition-colors"
            >
              <ShoppingCart className="w-4 h-4" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#F41B5E] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                  {cart.length}
                </span>
              )}
            </button>

            {/* Authorization Actions */}
            {isLoggedIn ? (
              <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-100">
                <div className="w-7 h-7 rounded-lg bg-[#F41B5E]/10 text-[#F41B5E] font-bold flex items-center justify-center text-xs">
                  {username[0]}
                </div>
                <button onClick={handleLogout} className="p-1.5 hover:text-[#F41B5E] transition-colors" title="Logout">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => { setAuthTab('login'); setShowAuthModal(true); }}
                className="bg-[#F41B5E] hover:bg-rose-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md shadow-rose-200 transition-all"
              >
                Sign In
              </button>
            )}
          </div>

        </div>
      </header>

      {/* 10 Seconds Countdown Order Screen (Thank You View) */}
      {currentView === 'thank-you' && lastOrderDetails && (
        <div className="max-w-2xl mx-auto my-16 p-8 bg-white border border-slate-100 rounded-3xl shadow-2xl text-center animate-fadeIn">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-2">Thank You For Your Order!</h2>
          <p className="text-sm text-slate-500 mb-6">Your order has been recorded successfully and is currently being processed.</p>
          
          {/* Order Summary Metadata */}
          <div className="bg-[#FAF9FC] p-4 rounded-2xl border border-slate-100 text-left text-xs space-y-2 max-w-md mx-auto mb-8">
            <p className="font-extrabold text-slate-700 border-b pb-1.5 uppercase tracking-wider text-[10px]">Order Specifications</p>
            <div className="flex justify-between">
              <span className="text-slate-400 font-semibold">Recipient Name:</span>
              <span className="text-slate-800 font-bold">{lastOrderDetails.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-semibold">Phone Contact:</span>
              <span className="text-slate-800 font-bold">{lastOrderDetails.phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-semibold">Paid Via:</span>
              <span className="text-slate-800 font-bold">{lastOrderDetails.method}</span>
            </div>
            <div className="flex justify-between border-t pt-2 mt-2">
              <span className="text-slate-500 font-extrabold">Grand Total Paid:</span>
              <span className="text-[#F41B5E] font-black">{lastOrderDetails.totalPaid}</span>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 bg-rose-50 text-[#F41B5E] px-4 py-2 rounded-full font-bold text-xs">
            <Clock className="w-4 h-4 animate-spin" />
            <span>Redirecting back to home page in <strong className="text-lg">{countdown}s</strong>...</span>
          </div>
        </div>
      )}

      {/* Main Container Views */}
      {currentView === 'index' && (
        <>
          {/* Sliding Carousel Section */}
          <section className="max-w-7xl mx-auto w-full px-4 pt-6 sm:px-6 lg:px-8">
            <div className="relative rounded-3xl overflow-hidden h-[240px] sm:h-[300px] shadow-lg border border-slate-100 group">
              <div 
                className="absolute inset-0 bg-cover bg-center filter brightness-[0.5] transition-all"
                style={{ backgroundImage: `url(https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format&fit=crop&q=80)` }}
              />
              <div className="absolute inset-0 flex flex-col justify-center p-8 text-white z-10">
                <span className="self-start bg-[#F41B5E] text-[9px] font-black uppercase px-2.5 py-1 rounded-full mb-2 tracking-widest">
                  Truth Indexes Only
                </span>
                <h2 className="text-2xl sm:text-3xl font-black mb-2 max-w-lg leading-tight">
                  Don't Buy Regrets! Check Hidden Product Faults First.
                </h2>
                <p className="text-xs text-slate-200 max-w-sm">
                  We crowdsource verified defects and product degradation timelines so you can make informed decisions.
                </p>
              </div>
            </div>
          </section>

          {/* Key Feature Cards section */}
          <section className="max-w-7xl mx-auto w-full px-4 pt-6 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex gap-3">
              <div className="p-2.5 rounded-xl bg-rose-50 text-[#F41B5E] shrink-0 h-10 w-10 flex items-center justify-center">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide">Minus-1 Curve</h4>
                <p className="text-[10px] text-slate-500 leading-relaxed mt-0.5">Visualize real degradation speed curves mapping lifespan performance drops.</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex gap-3">
              <div className="p-2.5 rounded-xl bg-violet-50 text-indigo-600 shrink-0 h-10 w-10 flex items-center justify-center">
                <HeartCrack className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide">Verified Defects</h4>
                <p className="text-[10px] text-slate-500 leading-relaxed mt-0.5">Check upvoted issues confirmed by thousands of actual gadget owners.</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex gap-3">
              <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 shrink-0 h-10 w-10 flex items-center justify-center">
                <Coins className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide">Submit & Earn</h4>
                <p className="text-[10px] text-slate-500 leading-relaxed mt-0.5">Index unlisted products to earn points for e-commerce shopping discounts.</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 shrink-0 h-10 w-10 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide">Predictive Analysis</h4>
                <p className="text-[10px] text-slate-500 leading-relaxed mt-0.5">Learn when devices fail: within 3 months, 6 months, or after 2 years.</p>
              </div>
            </div>
          </section>

          {/* Index Work area */}
          <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 w-full flex-grow">
            
            {/* Category selection bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-150 pb-5 mb-8">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => { setSelectedCategory('all'); setSelectedBrand('all'); }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    selectedCategory === 'all' ? 'bg-[#1E202B] text-white shadow-md' : 'bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 shadow-sm'
                  }`}
                >
                  All Categories
                </button>
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => { setSelectedCategory(cat.id); setSelectedBrand('all'); }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      selectedCategory === cat.id ? 'bg-[#1E202B] text-white shadow-md' : 'bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 shadow-sm'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>

              {/* Interaction triggers */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (!isLoggedIn) { triggerAlert('Please sign in first.', 'error'); return; }
                    setShowProblemForm(true);
                  }}
                  className="bg-white hover:bg-slate-50 text-[#F41B5E] border border-slate-200 font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  Report Fault
                </button>
                <button
                  onClick={() => {
                    if (!isLoggedIn) { triggerAlert('Please sign in first.', 'error'); return; }
                    setShowProductForm(true);
                  }}
                  className="bg-[#F41B5E] hover:bg-rose-600 text-white font-extrabold text-xs px-3.5 py-2.5 rounded-xl flex items-center gap-1.5 shadow-md shadow-rose-200 transition-all hover:scale-102"
                >
                  <Plus className="w-3.5 h-3.5 text-white" />
                  Index New Model (+10 Pts)
                </button>
              </div>
            </div>

            {/* Layout Grid: Left brand sidebar, right products view */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              
              {/* Brands Column */}
              <aside className="lg:col-span-1">
                <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-sm lg:sticky lg:top-24">
                  <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
                    <h3 className="text-xs uppercase tracking-widest font-black text-slate-400 flex items-center gap-2">
                      <span className="w-1.5 h-3.5 bg-[#F41B5E] rounded-full"></span> Brands
                    </h3>
                    <button
                      onClick={() => {
                        if (!isLoggedIn) { triggerAlert('Please sign in first.', 'error'); return; }
                        setShowBrandForm(true);
                      }}
                      className="bg-rose-50 hover:bg-rose-100 text-[#F41B5E] font-black text-[10px] px-2 py-1.5 rounded-lg transition-all flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> Add Brand
                    </button>
                  </div>

                  <div className="flex flex-col gap-2 max-h-[500px] overflow-y-auto pr-1">
                    <button
                      onClick={() => setSelectedBrand('all')}
                      className={`p-3 rounded-2xl border flex items-center justify-between transition-all ${
                        selectedBrand === 'all' ? 'border-[#F41B5E] bg-rose-50/20 text-slate-800 font-extrabold' : 'border-slate-200/60 bg-white text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <span className="text-xs">All Brands</span>
                      <span className="text-[10px] text-slate-400 font-black">ALL</span>
                    </button>
                    {filteredBrandsList.map(b => (
                      <button
                        key={b.id}
                        onClick={() => setSelectedBrand(b.id)}
                        className={`p-3 rounded-2xl border flex items-center gap-3 transition-all ${
                          selectedBrand === b.id ? 'border-[#F41B5E] bg-rose-50/20 text-slate-800 font-extrabold' : 'border-slate-200/60 bg-white text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <img src={b.logoUrl} alt="" className="w-6 h-6 rounded-full object-cover border" />
                        <span className="text-xs">{b.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </aside>

              {/* Products Directory view */}
              <section className="lg:col-span-3">
                {filteredProductsList.length === 0 ? (
                  
                  // Product Not Available fallback page
                  <div className="bg-white border border-rose-100 rounded-3xl p-8 text-center max-w-xl mx-auto my-6 shadow-xl">
                    <AlertTriangle className="w-16 h-16 text-[#F41B5E] mx-auto mb-4 animate-bounce" />
                    <h3 className="text-2xl font-black text-slate-900 mb-2">"{searchQuery}" Not Yet Indexed</h3>
                    <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                      This product isn't registered in our database. Help fellow buyers by initiating the first Index details and earn points!
                    </p>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-150 inline-block mb-6 text-xs font-bold text-slate-700">
                      💰 Reward Option Active: <span className="text-[#F41B5E]">Earn 10 Contribution Points</span>
                    </div>
                    <div>
                      <button
                        onClick={() => {
                          if (!isLoggedIn) { triggerAlert('Please sign in first.', 'error'); return; }
                          setProdName(toTitleCase(searchQuery));
                          setShowProductForm(true);
                        }}
                        className="bg-[#F41B5E] hover:bg-rose-600 text-white font-black text-xs px-6 py-3 rounded-xl transition-all shadow-md inline-flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Index Product Model Now
                      </button>
                    </div>
                  </div>

                ) : (
                  
                  // Main list
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredProductsList.map(prod => {
                      const brand = brands.find(b => b.id === prod.brandId);
                      return (
                        <div key={prod.id} className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden">
                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                {brand && <img src={brand.logoUrl} alt="" className="w-5 h-5 rounded-full object-cover border" />}
                                <span className="text-[10px] font-black text-slate-400">{brand ? brand.name : 'Unknown Brand'}</span>
                              </div>
                              <div className="text-right">
                                <span className="text-[8px] text-slate-400 block font-bold uppercase">Fault Index</span>
                                <span className={`text-sm font-black ${prod.faultScore > 40 ? 'text-[#F41B5E]' : 'text-emerald-500'}`}>
                                  -{prod.faultScore}%
                                </span>
                              </div>
                            </div>

                            <h3 className="text-lg font-black text-slate-900 mb-1">{prod.modelName}</h3>
                            <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed font-semibold">{prod.description}</p>

                            {/* Specific Bugs list preview */}
                            <div className="space-y-1.5 mb-4">
                              {prod.faults.slice(0, 2).map(f => (
                                <div key={f.id} className="flex justify-between items-center text-[11px] bg-slate-50/50 p-2 rounded-xl border border-slate-100">
                                  <span className="text-slate-700 font-bold truncate pr-1">{f.text}</span>
                                  <button
                                    onClick={() => upvoteFault(prod.id, f.id)}
                                    className="bg-rose-50 hover:bg-rose-100 text-[#F41B5E] text-[10px] px-2 py-0.5 rounded-lg font-black flex items-center gap-1 shrink-0 transition-colors"
                                  >
                                    <span>-1</span>
                                    <span className="text-slate-400">{f.votes}</span>
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>

                          <button
                            onClick={() => setActiveProduct(prod)}
                            className="w-full bg-violet-50 hover:bg-violet-100 text-indigo-600 font-bold text-xs py-2 rounded-xl transition-colors text-center block"
                          >
                            Inspect Timeline Details
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>

            </div>

          </main>
        </>
      )}

      {/* Store Front Panel */}
      {currentView === 'store' && (
        <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 w-full flex-grow">
          <div className="flex justify-between items-center mb-8 border-b pb-4">
            <div>
              <h2 className="text-2xl font-black text-slate-900">CheckMinus1 Reward Store</h2>
              <p className="text-xs text-slate-500">Spend your hard-earned points or purchase premium gadget protections.</p>
            </div>
            {isLoggedIn && (
              <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-2 rounded-2xl flex items-center gap-1.5 text-xs font-black">
                <Coins className="w-4 h-4 text-amber-500 animate-spin" />
                <span>My Balance: {userPoints} Points</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {storeProducts.map(p => (
              <div key={p.id} className="bg-white border border-slate-150 rounded-3xl overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
                <img src={p.image} alt={p.name} className="w-full h-48 object-cover border-b" />
                <div className="p-4 space-y-3">
                  <h3 className="text-xs font-extrabold text-slate-800 line-clamp-1">{p.name}</h3>
                  <div className="flex justify-between items-center">
                    <div className="text-left">
                      <span className="text-[10px] text-slate-400 block font-bold">Standard Price</span>
                      <span className="text-sm font-black text-slate-900">৳ {p.price}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-amber-600 block font-bold">Point Buy</span>
                      <span className="text-xs font-black text-amber-500">🪙 {p.pointsCost} Pts</span>
                    </div>
                  </div>
                  <button
                    onClick={() => addToCart(p)}
                    className="w-full bg-[#F41B5E] hover:bg-rose-600 text-white font-extrabold text-xs py-2 rounded-xl transition-all flex items-center justify-center gap-1.5"
                  >
                    <ShoppingCart className="w-4 h-4" /> Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      )}

      {/* Visitor User Personal Dashboard */}
      {currentView === 'user-dashboard' && (
        <main className="max-w-4xl mx-auto px-4 py-8 w-full flex-grow space-y-6">
          <div className="bg-white border border-slate-150 p-6 rounded-3xl shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-rose-50 text-[#F41B5E] rounded-2xl flex items-center justify-center font-black text-lg">
                {username[0]}
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900">{username}</h2>
                <p className="text-xs text-slate-400 font-bold uppercase">Member Account Dashboard</p>
              </div>
            </div>
            <div className="bg-gradient-to-r from-amber-400 to-amber-500 text-white p-4 rounded-2xl text-center shadow-md shrink-0 w-full sm:w-auto">
              <span className="text-[10px] uppercase font-bold text-amber-50 block leading-none mb-1">Redeemable Points Balance</span>
              <span className="text-2xl font-black">🪙 {userPoints} Points</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Action sidebar: activity list & Notifications */}
            <div className="md:col-span-2 space-y-6">
              
              {/* Notification hub */}
              <div className="bg-white border border-slate-150 p-5 rounded-3xl shadow-sm">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-1.5">
                  <Bell className="w-4 h-4 text-[#F41B5E]" /> Live Notification Alerts
                </h3>
                <div className="space-y-3">
                  {notifications.map(n => (
                    <div key={n.id} className={`p-3 rounded-2xl text-xs border ${n.unread ? 'bg-rose-50/20 border-rose-100 text-slate-800 font-extrabold' : 'bg-slate-50/50 border-slate-100 text-slate-500'}`}>
                      <p>{n.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Point Redeem limits helper */}
              <div className="bg-white border border-slate-150 p-5 rounded-3xl shadow-sm space-y-4">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Wallet className="w-4 h-4 text-amber-500" /> Reward Redemption Rules
                </h3>
                <div className="p-4 bg-slate-50 rounded-2xl border flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-700 block">৳200 Cash Value Discount Voucher</span>
                    <span className="text-[10px] text-[#F41B5E] font-black">Requires 200 points minimum</span>
                  </div>
                  <button
                    disabled={userPoints < 200}
                    onClick={() => {
                      setUserPoints(prev => prev - 200);
                      triggerAlert('Redeem Success! Discount code dispatched to registered mail.');
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
                      userPoints >= 200 ? 'bg-[#F41B5E] text-white hover:bg-rose-600 shadow-md' : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    Redeem
                  </button>
                </div>
              </div>

            </div>

            {/* Password Change Simulator */}
            <div className="md:col-span-1">
              <form onSubmit={(e) => { e.preventDefault(); triggerAlert('Security Password updated successfully.'); setPassForm({ current: '', newPass: '' }); }} className="bg-white border border-slate-150 p-5 rounded-3xl shadow-sm space-y-4">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-[#F41B5E]" /> Change Password
                </h3>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Current Password</label>
                  <input
                    type="password"
                    value={passForm.current}
                    onChange={(e) => setPassForm({ ...passForm, current: e.target.value })}
                    placeholder="••••••••"
                    className="w-full bg-[#FAF9FC] border p-2.5 rounded-xl text-xs"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">New Password</label>
                  <input
                    type="password"
                    value={passForm.newPass}
                    onChange={(e) => setPassForm({ ...passForm, newPass: e.target.value })}
                    placeholder="••••••••"
                    className="w-full bg-[#FAF9FC] border p-2.5 rounded-xl text-xs"
                    required
                  />
                </div>
                <button type="submit" className="w-full bg-[#F41B5E] hover:bg-rose-600 text-white font-extrabold text-xs py-2 rounded-xl transition-colors shadow-sm">
                  Update Password
                </button>
              </form>
            </div>

          </div>
        </main>
      )}

      {/* Admin Dashboard statistics panel (ONLY ACCESSIBLE BY AUTHENTICATED ADMINISTRATOR ROLE) */}
      {currentView === 'admin-dashboard' && userRole === 'admin' && (
        <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 w-full flex-grow space-y-8 animate-fadeIn">
          
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b pb-4">
            <div>
              <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-[#F41B5E]" /> Admin Statistics & Moderation Control Panel
              </h2>
              <p className="text-xs text-slate-500">Restricted secure admin-only insights, pending moderation cues, and metrics graphs.</p>
            </div>
            <span className="bg-[#F41B5E]/10 text-[#F41B5E] border border-rose-200 px-3 py-1 rounded-full text-xs font-black tracking-widest uppercase">
              Root Active
            </span>
          </div>

          {/* Pending Approval Moderation Table Queue */}
          <div className="bg-white border-2 border-dashed border-[#F41B5E]/30 p-6 rounded-3xl shadow-sm space-y-4">
            <h3 className="text-xs uppercase font-black text-slate-500 tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#F41B5E]" /> Pending Brand Approvals Queue ({pendingBrands.length})
            </h3>
            {pendingBrands.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No user brand indexes awaiting moderation queue approval.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pendingBrands.map(pb => (
                  <div key={pb.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-150 flex flex-col justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img src={pb.logoUrl} alt="" className="w-10 h-10 rounded-full object-cover border" />
                      <div>
                        <p className="text-xs font-bold text-slate-800">{pb.name}</p>
                        <span className="text-[10px] text-slate-400 font-bold block">Proposed default: Other</span>
                      </div>
                    </div>
                    
                    {/* Choose route and submit */}
                    <div className="flex items-center gap-2 mt-2">
                      <select id={`catSelect-${pb.id}`} className="bg-white border p-1.5 rounded-lg text-xs flex-1">
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                      <button
                        onClick={() => {
                          const val = document.getElementById(`catSelect-${pb.id}`).value;
                          approveBrand(pb, val, '');
                        }}
                        className="bg-[#F41B5E] text-white font-bold text-xs px-3 py-1.5 rounded-lg"
                      >
                        Approve
                      </button>
                      <button onClick={() => rejectBrand(pb.id)} className="text-slate-400 hover:text-rose-500">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Real Statistics Charts visual mapping with pure Tailwind */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Country District Demographic Mapping list */}
            <div className="bg-white border border-slate-150 p-5 rounded-3xl shadow-sm space-y-4">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Traffic Geographic Locations</h3>
              <div className="space-y-3.5">
                {analyticsData.countries.map((c, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-bold text-slate-700">{c.name}</span>
                      <span className="text-slate-500 font-bold">{c.percentage}% ({c.count})</span>
                    </div>
                    <div className="w-full bg-slate-150 h-2 rounded-full overflow-hidden">
                      <div className="bg-[#F41B5E] h-full" style={{ width: `${c.percentage}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Top Bangladeshi Districts:</span>
                {analyticsData.districts.map((d, i) => (
                  <div key={i} className="flex justify-between text-xs font-semibold text-slate-600">
                    <span>{d.name} District</span>
                    <span>{d.count} hits</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Age demographies */}
            <div className="bg-white border border-slate-150 p-5 rounded-3xl shadow-sm space-y-4">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Age Group Distributions</h3>
              <div className="space-y-3.5">
                {analyticsData.ageDemographics.map((age, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-700">Ages {age.range}</span>
                      <span className="text-slate-500">{age.percentage}%</span>
                    </div>
                    <div className="w-full bg-slate-150 h-2 rounded-full overflow-hidden">
                      <div className="bg-indigo-600 h-full" style={{ width: `${age.percentage}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Gender demographics & general performance overview chart */}
            <div className="bg-white border border-slate-150 p-5 rounded-3xl shadow-sm space-y-4">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Gender Breakdown Ratio</h3>
              <div className="flex items-center justify-around h-32 pt-2 text-center">
                <div>
                  <div className="text-3xl font-black text-indigo-500">{analyticsData.gender.male}%</div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Male</span>
                </div>
                <div className="border-r h-16 border-slate-150"></div>
                <div>
                  <div className="text-3xl font-black text-pink-500">{analyticsData.gender.female}%</div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Female</span>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="p-3.5 bg-rose-50/20 border border-rose-100 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="text-xs font-black text-slate-800">Global Tractions</span>
                    <span className="text-[10px] font-bold text-slate-400 block mt-0.5">Updated every 5 minutes</span>
                  </div>
                  <span className="text-xs font-black text-[#F41B5E]">+{analyticsData.totalVisitors} Hits</span>
                </div>
              </div>
            </div>

          </div>
        </main>
      )}

      {/* Slide-over Sliding Cart Sidepanel */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex justify-end">
          <div className="bg-white w-full max-w-md h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto animate-slideIn">
            
            <div>
              <div className="flex justify-between items-center border-b pb-4 mb-4">
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-1.5">
                  <ShoppingCart className="w-5 h-5 text-[#F41B5E]" /> My Rewards Cart
                </h3>
                <button onClick={() => setIsCartOpen(false)} className="p-1 text-slate-400 hover:text-slate-800">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-16 space-y-2">
                  <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
                  <p className="text-xs text-slate-400 font-bold">Your shopping cart is currently empty.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map(item => (
                    <div key={item.id} className="flex gap-3 items-center border-b pb-3 border-slate-100">
                      <img src={item.image} alt="" className="w-12 h-12 rounded-xl object-cover border" />
                      <div className="flex-1 text-left min-w-0">
                        <p className="text-xs font-bold text-slate-800 truncate leading-snug">{item.name}</p>
                        <span className="text-[10px] text-slate-400 block mt-0.5">৳ {item.price} / 🪙 {item.pointsCost} Pts</span>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="text-slate-400 hover:text-[#F41B5E]">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  {/* Payment totals summary metadata */}
                  <div className="bg-slate-50 p-4 rounded-2xl border space-y-2 text-xs">
                    <div className="flex justify-between font-bold text-slate-600">
                      <span>Store Subtotal:</span>
                      <span>৳ {cart.reduce((sum, item) => sum + item.price, 0)}</span>
                    </div>
                    <div className="flex justify-between font-black text-[#F41B5E]">
                      <span>Points Redeeming Cost:</span>
                      <span>🪙 {cart.reduce((sum, item) => sum + item.pointsCost, 0)} Points</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <form onSubmit={handleCheckout} className="border-t pt-4 mt-6 space-y-3 text-left">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest block">Checkout Specifications</span>
                
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-500">Recipient Name</label>
                  <input
                    type="text"
                    value={checkoutForm.name}
                    onChange={(e) => setCheckoutForm({ ...checkoutForm, name: e.target.value })}
                    placeholder="Recipient's Name"
                    className="w-full bg-[#FAF9FC] border p-2 rounded-xl text-xs"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-500">Delivery Address</label>
                  <input
                    type="text"
                    value={checkoutForm.address}
                    onChange={(e) => setCheckoutForm({ ...checkoutForm, address: e.target.value })}
                    placeholder="Full Home Address"
                    className="w-full bg-[#FAF9FC] border p-2 rounded-xl text-xs"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-500">Phone Number (Bangladeshi 11 Digits)</label>
                  <input
                    type="text"
                    value={checkoutForm.phone}
                    onChange={(e) => setCheckoutForm({ ...checkoutForm, phone: e.target.value })}
                    placeholder="01XXXXXXXXX"
                    className="w-full bg-[#FAF9FC] border p-2 rounded-xl text-xs font-mono"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-500 block">Payment Option</label>
                  <div className="grid grid-cols-3 gap-2">
                    <label className="flex flex-col items-center justify-center p-2 border rounded-xl cursor-pointer text-[10px] font-bold text-center bg-white hover:bg-slate-50">
                      <input 
                        type="radio" 
                        name="payment" 
                        value="cod" 
                        checked={checkoutForm.paymentMethod === 'cod'} 
                        onChange={() => setCheckoutForm({ ...checkoutForm, paymentMethod: 'cod' })} 
                        className="mb-1 accent-[#F41B5E]" 
                      />
                      COD
                    </label>
                    <label className="flex flex-col items-center justify-center p-2 border rounded-xl cursor-pointer text-[10px] font-bold text-center bg-white hover:bg-slate-50">
                      <input 
                        type="radio" 
                        name="payment" 
                        value="points" 
                        checked={checkoutForm.paymentMethod === 'points'} 
                        onChange={() => setCheckoutForm({ ...checkoutForm, paymentMethod: 'points' })} 
                        className="mb-1 accent-[#F41B5E]" 
                      />
                      Points
                    </label>
                    <label className="flex flex-col items-center justify-center p-2 border rounded-xl cursor-pointer text-[10px] font-bold text-center bg-white hover:bg-slate-50">
                      <input 
                        type="radio" 
                        name="payment" 
                        value="online" 
                        checked={checkoutForm.paymentMethod === 'online'} 
                        onChange={() => setCheckoutForm({ ...checkoutForm, paymentMethod: 'online' })} 
                        className="mb-1 accent-[#F41B5E]" 
                      />
                      Online
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#F41B5E] hover:bg-rose-600 text-white font-black text-xs py-2.5 rounded-xl transition-all shadow-md shadow-rose-200 mt-2 text-center block"
                >
                  Place Order Now
                </button>
              </form>
            )}

          </div>
        </div>
      )}

      {/* Inspect product detail popup panel with Affiliate Recommendations Alternative */}
      {activeProduct && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-100 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl relative animate-fadeIn max-h-[90vh] overflow-y-auto">
            
            {/* Modal header alignment brand logo on Right side */}
            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-slate-50/50">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-extrabold block mb-1">Product Insight Timeline</span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900">{activeProduct.modelName}</h3>
              </div>
              <div className="flex items-center gap-4 ml-auto sm:ml-0">
                {brands.find(b => b.id === activeProduct.brandId) && (
                  <div className="flex items-center gap-2 bg-white border px-3 py-1.5 rounded-2xl shadow-sm">
                    <span className="text-xs font-black text-slate-700">{brands.find(b => b.id === activeProduct.brandId).name}</span>
                    <img src={brands.find(b => b.id === activeProduct.brandId).logoUrl} alt="" className="w-8 h-8 rounded-full object-cover border" />
                  </div>
                )}
                <button onClick={() => setActiveProduct(null)} className="p-1 bg-white hover:bg-slate-100 border rounded-full text-slate-400">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body Contents */}
            <div className="p-6 space-y-6 text-left">
              <div className="flex flex-col sm:flex-row gap-4 bg-rose-50/30 p-4 rounded-2xl border border-rose-100">
                <div className="bg-white p-3 rounded-xl text-center border shadow-sm shrink-0 w-full sm:w-auto">
                  <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider block">FAULT SCALE</span>
                  <span className="text-2xl font-black text-[#F41B5E]">-{activeProduct.faultScore}%</span>
                </div>
                <p className="text-xs text-slate-600 italic leading-relaxed font-semibold">"{activeProduct.description}"</p>
              </div>

              {/* Dynamic SVG degradation curve */}
              <div className="space-y-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Fault Index Progression Line Curve</span>
                <div className="bg-[#FAF9FC] border p-4 rounded-3xl h-44 relative flex items-end">
                  <svg className="absolute inset-0 h-full w-full p-4" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path
                      d={`M 0,${100 - activeProduct.timeline[0]} L 25,${100 - activeProduct.timeline[1]} L 50,${100 - activeProduct.timeline[2]} L 75,${100 - activeProduct.timeline[3]} L 100,${100 - activeProduct.timeline[4]}`}
                      fill="none"
                      stroke="#F41B5E"
                      strokeWidth="3.5"
                    />
                  </svg>
                  <div className="relative z-10 w-full flex justify-between">
                    {activeProduct.timeline.map((val, idx) => (
                      <div key={idx} className="text-center">
                        <span className="text-xs font-black text-[#F41B5E] block">{val}%</span>
                        <span className="text-[9px] text-slate-400 font-bold block">{['Init', '3m', '6m', '12m', '24m'][idx]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Verified claim elements */}
              <div className="space-y-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Top Observed Defects</span>
                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {activeProduct.faults.map(f => (
                    <div key={f.id} className="flex justify-between items-center text-xs bg-slate-50 border p-3 rounded-2xl">
                      <div>
                        <span className="font-bold text-slate-800 block">{f.text}</span>
                        <span className="text-[9px] text-slate-400">Confirmed by {f.votes} gadget owners</span>
                      </div>
                      <button
                        onClick={() => upvoteFault(activeProduct.id, f.id)}
                        className="bg-[#F41B5E] text-white px-3 py-1.5 rounded-xl font-bold text-xs"
                      >
                        I Face This Too
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Smart Affiliate Recommendations Integration Module */}
              {suggestedAlternative ? (
                <div className="bg-emerald-50/60 border border-emerald-100 p-4 rounded-2xl space-y-3">
                  <div className="flex items-center gap-2 text-emerald-800">
                    <Sparkles className="w-5 h-5 text-emerald-600 animate-spin" />
                    <span className="text-xs font-black uppercase tracking-wider">Recommended Better Alternative</span>
                  </div>
                  <div className="flex justify-between items-center bg-white p-3 rounded-xl border shadow-sm">
                    <div>
                      <p className="text-xs font-extrabold text-slate-800">{suggestedAlternative.modelName}</p>
                      <span className="text-[10px] font-black text-emerald-500">Fault Score: only -{suggestedAlternative.faultScore}%</span>
                    </div>
                    
                    {/* Simulated affiliate link redirection */}
                    <a
                      href={suggestedAlternative.affiliateLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs px-3 py-2 rounded-xl transition-colors inline-flex items-center gap-1.5"
                    >
                      Buy Alternative <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50 border border-slate-150 p-4 rounded-2xl text-center">
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase">No Better Alternatives found within this Category.</span>
                </div>
              )}

            </div>

            <div className="p-4 bg-slate-50 border-t flex justify-end">
              <button onClick={() => setActiveProduct(null)} className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-black text-xs px-5 py-2 rounded-xl transition-all">
                Close Insights
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Brand submission popup form with specific sizes limit descriptions */}
      {showBrandForm && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleBrandUpload} className="bg-white border p-6 rounded-3xl w-full max-w-md space-y-4 shadow-xl text-left">
            <h3 className="text-lg font-black text-slate-900">Suggest New Brand Model</h3>
            
            <div className="space-y-1">
              <label className="text-xs text-slate-400 uppercase font-black block">Brand Name</label>
              <input
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="Nokia, Apple, Cat VPN etc"
                className="w-full bg-[#FAF9FC] border p-2.5 rounded-xl text-xs"
                required
              />
            </div>

            {/* Brand upload guidance limits details block */}
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 uppercase font-black block">Brand Logo Image</label>
              <div className="bg-rose-50 border border-rose-100/50 p-3 rounded-xl text-[10px] text-slate-600 font-semibold space-y-1">
                <p className="font-extrabold text-[#F41B5E]">📐 Layout Guidelines:</p>
                <p>• Recommended Square aspect ratio: <strong className="text-slate-800">Fixed 150x150 Pixels</strong></p>
                <p>• Size Constraint: Maximum allowed size <strong className="text-slate-800">200 KB</strong></p>
              </div>
              
              <div className="flex items-center gap-3 mt-2">
                <label className="flex-1 border-2 border-dashed border-slate-200 hover:bg-slate-50 p-4 rounded-xl cursor-pointer flex flex-col items-center justify-center">
                  <Upload className="w-5 h-5 text-slate-400 mb-1" />
                  <span className="text-[10px] font-bold text-slate-500">Select Local File</span>
                  <input type="file" accept="image/*" onChange={handleImgUpload} className="hidden" />
                </label>
                {brandLogoPreview ? (
                  <img src={brandLogoPreview} alt="Preview" className="w-16 h-16 rounded-xl object-cover border bg-slate-50" />
                ) : (
                  <div className="w-16 h-16 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 flex items-center justify-center text-[10px] text-slate-400 font-bold">No Image</div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setShowBrandForm(false)} className="bg-slate-100 text-slate-600 px-4 py-2 rounded-xl text-xs font-bold">Cancel</button>
              <button type="submit" className="bg-[#F41B5E] text-white px-4 py-2 rounded-xl text-xs font-bold">Submit for Review</button>
            </div>
          </form>
        </div>
      )}

      {/* Product submission popup form */}
      {showProductForm && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleProductUpload} className="bg-white border p-6 rounded-3xl w-full max-w-md space-y-4 shadow-xl text-left">
            <h3 className="text-lg font-black text-slate-900">Index New Product Model</h3>
            <p className="text-[10px] text-amber-600 font-bold leading-relaxed">
              Indexing a new, unlisted product will award you 🪙 10 points which you can spend on accessories in our store!
            </p>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase font-black">Parent Brand</label>
                <select value={prodBrandId} onChange={(e) => setProdBrandId(e.target.value)} className="w-full bg-[#FAF9FC] border p-2.5 rounded-xl text-xs" required>
                  <option value="">Select Brand</option>
                  {brands.filter(b => b.approved).map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase font-black">Model Name</label>
                <input
                  type="text"
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  placeholder="e.g. Galaxy Fold 5"
                  className="w-full bg-[#FAF9FC] border p-2.5 rounded-xl text-xs"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-400 uppercase font-black block">Model Error Slogan Summary</label>
              <textarea
                value={prodDesc}
                onChange={(e) => setProdDesc(e.target.value)}
                placeholder="Briefly state the primary real-life defect found on this model."
                className="w-full bg-[#FAF9FC] border p-2.5 rounded-xl text-xs"
                rows="2"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setShowProductForm(false)} className="bg-slate-100 text-slate-600 px-4 py-2 rounded-xl text-xs font-bold">Cancel</button>
              <button type="submit" className="bg-[#F41B5E] text-white px-4 py-2 rounded-xl text-xs font-bold">Index Model (+10 Pts)</button>
            </div>
          </form>
        </div>
      )}

      {/* Problem submission popup form */}
      {showProblemForm && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleProblemSubmission} className="bg-white border p-6 rounded-3xl w-full max-w-md space-y-4 shadow-xl text-left">
            <h3 className="text-lg font-black text-slate-900">Report Observed Product Bug</h3>
            
            <div className="space-y-1">
              <label className="text-xs text-slate-400 uppercase font-black block">Choose Product Model</label>
              <select value={probProduct} onChange={(e) => setProbProduct(e.target.value)} className="w-full bg-[#FAF9FC] border p-2.5 rounded-xl text-xs" required>
                <option value="">Choose Model</option>
                {products.map(p => <option key={p.id} value={p.id}>{p.modelName}</option>)}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-400 uppercase font-black block">Observed Bug / Issue</label>
              <select value={probText} onChange={(e) => setProbText(e.target.value)} className="w-full bg-[#FAF9FC] border p-2.5 rounded-xl text-xs" required>
                <option value="Battery Degradation & Fast Draining">Battery Degradation & Fast Draining</option>
                <option value="UI Slowdown / Stutter Lags">UI Slowdown / Stutter Lags</option>
                <option value="Overheating Under Moderate Load">Overheating Under Moderate Load</option>
                <option value="Wi-Fi Connection Dropping">Wi-Fi Connection Dropping</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {probText === 'Other' && (
              <div className="space-y-1 animate-fadeIn">
                <label className="text-xs text-slate-400 uppercase font-black block">Specify Custom Problem</label>
                <input
                  type="text"
                  value={customProbText}
                  onChange={(e) => setCustomProbText(e.target.value)}
                  placeholder="e.g. Loose charging port connector"
                  className="w-full bg-[#FAF9FC] border p-2.5 rounded-xl text-xs"
                  required
                />
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setShowProblemForm(false)} className="bg-slate-100 text-slate-600 px-4 py-2 rounded-xl text-xs font-bold">Cancel</button>
              <button type="submit" className="bg-[#F41B5E] text-white px-4 py-2 rounded-xl text-xs font-bold">Submit Fault (+5 Pts)</button>
            </div>
          </form>
        </div>
      )}

      {/* Registration and Login modal popup */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl text-left">
            <div className="flex border-b">
              <button onClick={() => setAuthTab('login')} className={`flex-1 py-4 text-center text-xs font-black uppercase tracking-wider ${authTab === 'login' ? 'border-b-2 border-[#F41B5E] text-[#F41B5E]' : 'text-slate-400'}`}>Login</button>
              <button onClick={() => setAuthTab('register')} className={`flex-1 py-4 text-center text-xs font-black uppercase tracking-wider ${authTab === 'register' ? 'border-b-2 border-[#F41B5E] text-[#F41B5E]' : 'text-slate-400'}`}>Register</button>
            </div>

            <form onSubmit={handleAuthSubmit} className="p-6 space-y-4">
              {authTab === 'login' ? (
                <>
                  <div className="space-y-1">
                    <label className="text-xs text-slate-400 font-bold uppercase">Email Address / Username</label>
                    <input
                      type="text"
                      placeholder="e.g. rashedul@gmail.com"
                      value={checkoutForm.name}
                      onChange={(e) => setCheckoutForm({ ...checkoutForm, name: e.target.value })}
                      className="w-full bg-[#FAF9FC] border p-2.5 rounded-xl text-xs"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-slate-400 font-bold uppercase">Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full bg-[#FAF9FC] border p-2.5 rounded-xl text-xs"
                      required
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-1">
                    <label className="text-xs text-slate-400 font-bold uppercase">Full Name</label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={checkoutForm.name}
                      onChange={(e) => setCheckoutForm({ ...checkoutForm, name: e.target.value })}
                      className="w-full bg-[#FAF9FC] border p-2.5 rounded-xl text-xs"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-slate-400 font-bold uppercase">Home Country Location</label>
                    <input
                      type="text"
                      placeholder="e.g. Bangladesh"
                      value={checkoutForm.address}
                      onChange={(e) => setCheckoutForm({ ...checkoutForm, address: e.target.value })}
                      className="w-full bg-[#FAF9FC] border p-2.5 rounded-xl text-xs"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-slate-400 font-bold uppercase">Phone Contact</label>
                    <input
                      type="text"
                      placeholder="01XXXXXXXXX"
                      value={checkoutForm.phone}
                      onChange={(e) => setCheckoutForm({ ...checkoutForm, phone: e.target.value })}
                      className="w-full bg-[#FAF9FC] border p-2.5 rounded-xl text-xs"
                      required
                    />
                  </div>
                </>
              )}

              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowAuthModal(false)} className="flex-1 bg-slate-100 text-slate-600 py-2.5 rounded-xl text-xs font-bold text-center">Cancel</button>
                <button type="submit" className="flex-1 bg-[#F41B5E] text-white py-2.5 rounded-xl text-xs font-bold text-center shadow-md shadow-rose-200">{authTab === 'login' ? 'Sign In' : 'Register'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Complete Site Footer */}
      <footer className="bg-[#1E202B] text-slate-400 pt-16 pb-8 border-t border-slate-800 mt-16 text-xs text-left w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-[#F41B5E] text-white font-black text-lg w-8 h-8 rounded-lg flex items-center justify-center shadow-lg">
                -1
              </div>
              <h2 className="text-white text-xl font-black tracking-tight">
                Check<span className="text-[#F41B5E]">Minus1</span>
              </h2>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-semibold">
              Truth over sponsorship. CheckMinus1 indexes real-life bugs and product lifetimes so you can make calculated shopping decision.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs uppercase tracking-widest text-white font-black">Top Products</h3>
            <ul className="space-y-2 text-xs font-bold">
              <li><button onClick={() => { setSelectedCategory('cat-1'); setCurrentView('index'); }} className="hover:text-white transition-colors">Smartphones</button></li>
              <li><button onClick={() => { setSelectedCategory('cat-2'); setCurrentView('index'); }} className="hover:text-white transition-colors">Software & VPN Lag</button></li>
              <li><button onClick={() => { setSelectedCategory('cat-3'); setCurrentView('index'); }} className="hover:text-white transition-colors">Laptop Thermals</button></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs uppercase tracking-widest text-white font-black">Platform Statistics</h3>
            <ul className="space-y-2 text-xs font-bold">
              <li className="flex justify-between border-b border-slate-800 pb-1">
                <span>Indexed Models:</span>
                <span className="text-white">500+ Live</span>
              </li>
              <li className="flex justify-between border-b border-slate-800 pb-1">
                <span>Verified Claims:</span>
                <span className="text-white">10k+ Registered</span>
              </li>
              <li className="flex justify-between">
                <span>User Trust Level:</span>
                <span className="text-emerald-400">99.2% Accuracy</span>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs uppercase tracking-widest text-white font-black">Connect With Us</h3>
            <p className="text-xs text-slate-400 font-semibold">Join developers and consumer safety advocates globally.</p>
            <div className="flex gap-3 text-white">
              <a href="#" className="p-2 rounded-lg bg-slate-800 hover:bg-[#F41B5E] transition-colors"><X className="w-4 h-4" /></a>
              <a href="#" className="p-2 rounded-lg bg-slate-800 hover:bg-[#F41B5E] transition-colors">
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
</a>
              <a href="#" className="p-2 rounded-lg bg-slate-800 hover:bg-[#F41B5E] transition-colors"><Globe className="w-4 h-4" /></a>
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-800 mt-10 pt-6 text-center text-[11px] text-slate-500 font-bold space-y-1">
          <p>© 2026 CheckMinus1. All rights reserved. Crowdsourced with ultimate community integrity.</p>
          <p className="text-slate-600">Making device insights transparent, one verified fault index at a time.</p>
        </div>
      </footer>

    </div>
  );
}