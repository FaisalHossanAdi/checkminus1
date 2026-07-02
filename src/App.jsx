import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'আপনার_SUPABASE_URL';
const supabaseKey = 'আপনার_SUPABASE_ANON_KEY';
const supabase = createClient(supabaseUrl, supabaseKey);


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
  Github,
  Twitter,
  Globe
} from 'lucide-react';

// Helper to convert any string to Word First Character Caps Lock (Title Case)
const toTitleCase = (str) => {
  if (!str) return '';
  return str
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const [categories, setCategories] = useState([]);
const [brands, setBrands] = useState([]);
const [products, setProducts] = useState([]);

const commonPredefinedProblems = [
  'Battery Degradation & Fast Draining',
  'UI Slowdown / Stutter Lags',
  'Overheating Under Moderate Load',
  'Wi-Fi Connection Dropping',
  'Screen Burn-in / Color Flickering',
  'Charging Port Failures',
  'Other'
];

const sliderSlides = [
  {
    id: 1,
    title: "Don't Buy Regrets!",
    subtitle: "Check the real-world defects before purchasing your next device.",
    image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1200&auto=format&fit=crop&q=80",
    badge: "Community Driven"
  },
  {
    id: 2,
    title: "Fault Timeline Trackers",
    subtitle: "See exactly when performance drops. 1 month, 6 months or 2 years?",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format&fit=crop&q=80",
    badge: "Visual Insights"
  },
  {
    id: 3,
    title: "Join & Earn Points",
    subtitle: "Report issues, index new models, and claim reward vouchers.",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&auto=format&fit=crop&q=80",
    badge: "Rewarding Truths"
  }
];

export default function App() {
  const [categories, setCategories] = useState(initialCategories);
  const [brands, setBrands] = useState(initialBrands);
  const [products, setProducts] = useState(initialProducts);

  const [pendingBrands, setPendingBrands] = useState([]);
  const [pendingFaults, setPendingFaults] = useState([
    { id: 'pf-1', productId: 'prod-1', text: 'Screen Tint Discoloration', votes: 1, approved: false, modelName: 'Galaxy S24 Ultra' }
  ]);

  // Points State
  const [userPoints, setUserPoints] = useState(50);
  const [showWalletModal, setShowWalletModal] = useState(false);

  // Auth States
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [userRole, setUserRole] = useState('user'); // 'admin' or 'user'
  const [username, setUsername] = useState('Guest Contributor');
  const [authModal, setAuthModal] = useState({ isOpen: false, tab: 'login' });
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerCountry, setRegisterCountry] = useState('Bangladesh');

  // Slider State
  const [currentSlide, setCurrentSlide] = useState(0);

  // Active Search / Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');

  // Modal Open states
  const [showCatForm, setShowCatForm] = useState(false);
  const [showBrandForm, setShowBrandForm] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [showUserProblemForm, setShowUserProblemForm] = useState(false);

  // Selected Active Product for Detailed Timeline Modal
  const [activeProduct, setActiveProduct] = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  
  // Category Form Input
  const [catName, setCatName] = useState('');
  
  // Brand Form Inputs
  const [brandName, setBrandName] = useState('');
  const [brandCatId, setBrandCatId] = useState('cat-other'); // Default "Other" category
  const [brandLogoFile, setBrandLogoFile] = useState(null);
  const [brandLogoPreview, setBrandLogoPreview] = useState('');

  // Brand Approval Action State
  const [adminBrandCategories, setAdminBrandCategories] = useState({});
  const [adminBrandNewCat, setAdminBrandNewCat] = useState({});

  // Product Form Inputs
  const [prodName, setProdName] = useState('');
  const [prodBrandId, setProdBrandId] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodFaultScore, setProdFaultScore] = useState(20);
  const [timelineVal, setTimelineVal] = useState([10, 20, 30, 40, 50]);
  const [prodFaults, setProdFaults] = useState('');

  // User Problem Post Form Inputs
  const [postProbBrandId, setPostProbBrandId] = useState('');
  const [postProbProductId, setPostProbProductId] = useState('');
  const [postProbDropdownValue, setPostProbDropdownValue] = useState(commonPredefinedProblems[0]);
  const [postProbCustomValue, setPostProbCustomValue] = useState('');

  // Success Notification
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  // Auto advance slide every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const triggerNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'success' });
    }, 4000);
  };

  // Fuzzy autocomplete brand matches
  const autocompleteBrands = useMemo(() => {
    if (searchQuery.trim().length < 2) return [];
    return brands.filter(b => 
      b.approved && b.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [brands, searchQuery]);

  // Reads local file and returns Data URL for client side preview
  const handleImageUploadChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 200 * 1024) {
        triggerNotification('File size exceeds 200 KB limit', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setBrandLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
      setBrandLogoFile(file);
    }
  };

  const handleCategorySubmit = (e) => {
    e.preventDefault();
    if (userRole !== 'admin') {
      triggerNotification('Users cannot create categories. Only Admin can assign them.', 'error');
      return;
    }
    if (!catName.trim()) return;

    const formattedName = toTitleCase(catName);

    if (editTarget && editTarget.type === 'category') {
      setCategories(categories.map(c => c.id === editTarget.data.id ? { ...c, name: formattedName } : c));
      triggerNotification('Category updated successfully');
    } else {
      const newCat = {
        id: `cat-${Date.now()}`,
        name: formattedName
      };
      setCategories([...categories, newCat]);
      triggerNotification('Category created successfully');
    }
    setCatName('');
    setEditTarget(null);
    setShowCatForm(false);
  };

  const handleBrandSubmit = (e) => {
    e.preventDefault();
    if (!brandName.trim()) return;

    const formattedBrandName = toTitleCase(brandName);
    const finalLogo = brandLogoPreview || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=60';

    if (editTarget && editTarget.type === 'brand') {
      setBrands(brands.map(b => b.id === editTarget.data.id ? { 
        ...b, 
        name: formattedBrandName, 
        categoryId: brandCatId, 
        logoUrl: finalLogo 
      } : b));
      triggerNotification('Brand updated successfully');
    } else {
      const targetCatId = userRole === 'admin' ? brandCatId : 'cat-other';
      const newBrand = {
        id: `brand-${Date.now()}`,
        categoryId: targetCatId,
        name: formattedBrandName,
        logoUrl: finalLogo,
        approved: userRole === 'admin' ? true : false
      };

      if (userRole === 'admin') {
        setBrands([...brands, newBrand]);
        triggerNotification('Brand added to active index');
      } else {
        setPendingBrands([...pendingBrands, newBrand]);
        triggerNotification('Brand submitted for Admin Verification under "Other"', 'info');
      }
    }
    setBrandName('');
    setBrandCatId('cat-other');
    setBrandLogoFile(null);
    setBrandLogoPreview('');
    setEditTarget(null);
    setShowBrandForm(false);
  };

  const handleProductSubmit = (e) => {
    e.preventDefault();
    if (!prodName.trim() || !prodBrandId) return;

    const formattedProdName = toTitleCase(prodName);

    const faultsArray = prodFaults.split(',')
      .map(f => f.trim())
      .filter(f => f.length > 0)
      .map((f, index) => ({
        id: `f-${Date.now()}-${index}`,
        text: toTitleCase(f),
        votes: Math.floor(Math.random() * 20) + 1,
        approved: true
      }));

    const newProduct = {
      id: `prod-${Date.now()}`,
      brandId: prodBrandId,
      modelName: formattedProdName,
      faultScore: parseInt(prodFaultScore),
      timeline: timelineVal,
      description: prodDesc || 'No summary registered yet. Help community by listing faults.',
      faults: faultsArray.length > 0 ? faultsArray : [{ id: 'f-new', text: 'Ready For User Verified Claims', votes: 1, approved: true }]
    };

    setProducts([...products, newProduct]);
    
    // Reward points for indexing a new product
    setUserPoints(prev => prev + 10);
    triggerNotification('New product model indexed successfully! +10 Points earned 🪙');

    setProdName('');
    setProdBrandId('');
    setProdDesc('');
    setProdFaults('');
    setProdFaultScore(20);
    setTimelineVal([10, 20, 30, 40, 50]);
    setEditTarget(null);
    setShowProductForm(false);
  };

  const handleUserProblemSubmit = (e) => {
    e.preventDefault();
    if (!postProbProductId) {
      triggerNotification('Please select a product model', 'error');
      return;
    }

    let finalProblemText = postProbDropdownValue;
    if (postProbDropdownValue === 'Other') {
      if (!postProbCustomValue.trim()) {
        triggerNotification('Please enter the custom problem', 'error');
        return;
      }
      finalProblemText = postProbCustomValue;
    }

    const formattedProblem = toTitleCase(finalProblemText);
    const targetProduct = products.find(p => p.id === postProbProductId);

    if (targetProduct) {
      const isExist = targetProduct.faults.some(f => f.text.toLowerCase() === formattedProblem.toLowerCase());
      
      let updatedFaults;
      if (isExist) {
        updatedFaults = targetProduct.faults.map(f => 
          f.text.toLowerCase() === formattedProblem.toLowerCase() ? { ...f, votes: f.votes + 1 } : f
        );
      } else {
        updatedFaults = [
          ...targetProduct.faults, 
          { id: `f-${Date.now()}`, text: formattedProblem, votes: 2, approved: true }
        ];
      }

      setProducts(products.map(p => p.id === postProbProductId ? {
        ...p,
        faults: updatedFaults,
        faultScore: Math.min(100, p.faultScore + 2)
      } : p));

      // Award bonus points for helpful reports
      setUserPoints(prev => prev + 5);
      triggerNotification('Report auto-validated & attached to index live! +5 Points 🪙');
    }

    // reset fields
    setPostProbBrandId('');
    setPostProbProductId('');
    setPostProbDropdownValue(commonPredefinedProblems[0]);
    setPostProbCustomValue('');
    setShowUserProblemForm(false);
  };

  const approvePendingBrand = (id) => {
    const brandToApprove = pendingBrands.find(b => b.id === id);
    if (brandToApprove) {
      let finalCatId = adminBrandCategories[id] || 'cat-other';
      const newCatInput = adminBrandNewCat[id];

      if (newCatInput && newCatInput.trim()) {
        const formattedNewCat = toTitleCase(newCatInput);
        const newCatId = `cat-${Date.now()}`;
        const newCatObj = { id: newCatId, name: formattedNewCat };
        
        setCategories(prev => [...prev, newCatObj]);
        finalCatId = newCatId;
      }

      const approved = { ...brandToApprove, categoryId: finalCatId, approved: true };
      setBrands([...brands, approved]);
      setPendingBrands(pendingBrands.filter(b => b.id !== id));
      triggerNotification('Brand approved and indexed into category');
    }
  };

  const rejectPendingBrand = (id) => {
    setPendingBrands(pendingBrands.filter(b => b.id !== id));
    triggerNotification('Brand submission declined', 'info');
  };

  const approvePendingFault = (id) => {
    const faultToApprove = pendingFaults.find(f => f.id === id);
    if (faultToApprove) {
      setProducts(products.map(p => {
        if (p.id === faultToApprove.productId) {
          const isExist = p.faults.some(f => f.text.toLowerCase() === faultToApprove.text.toLowerCase());
          if (isExist) {
            return {
              ...p,
              faults: p.faults.map(f => f.text.toLowerCase() === faultToApprove.text.toLowerCase() ? { ...f, votes: f.votes + 1 } : f)
            };
          } else {
            return {
              ...p,
              faults: [...p.faults, { id: `f-${Date.now()}`, text: faultToApprove.text, votes: 1, approved: true }]
            };
          }
        }
        return p;
      }));
      setPendingFaults(pendingFaults.filter(f => f.id !== id));
      triggerNotification('Problem approved and added to live index');
    }
  };

  const rejectPendingFault = (id) => {
    setPendingFaults(pendingFaults.filter(f => f.id !== id));
    triggerNotification('Problem report declined', 'info');
  };

  const triggerEditCategory = (cat) => {
    if (userRole !== 'admin') {
      triggerNotification('Access Denied', 'error');
      return;
    }
    setEditTarget({ type: 'category', data: cat });
    setCatName(cat.name);
    setShowCatForm(true);
  };

  const triggerDeleteCategory = (id) => {
    if (userRole !== 'admin') return;
    setCategories(categories.filter(c => c.id !== id));
    triggerNotification('Category deleted');
  };

  const triggerEditBrand = (brand) => {
    setEditTarget({ type: 'brand', data: brand });
    setBrandName(brand.name);
    setBrandCatId(brand.categoryId);
    setBrandLogoPreview(brand.logoUrl);
    setShowBrandForm(true);
  };

  const triggerDeleteBrand = (id) => {
    setBrands(brands.filter(b => b.id !== id));
    setProducts(products.filter(p => p.brandId !== id));
    triggerNotification('Brand deleted');
  };

  const triggerEditProduct = (prod) => {
    setEditTarget({ type: 'product', data: prod });
    setProdName(prod.modelName);
    setProdBrandId(prod.brandId);
    setProdDesc(prod.description);
    setProdFaultScore(prod.faultScore);
    setTimelineVal(prod.timeline);
    setProdFaults(prod.faults.map(f => f.text).join(', '));
    setShowProductForm(true);
  };

  const triggerDeleteProduct = (id) => {
    setProducts(products.filter(p => p.id !== id));
    if (activeProduct && activeProduct.id === id) setActiveProduct(null);
    triggerNotification('Product deleted');
  };

  const upvoteFault = (productId, faultId) => {
    setProducts(products.map(p => {
      if (p.id === productId) {
        const updatedFaults = p.faults.map(f => f.id === faultId ? { ...f, votes: f.votes + 1 } : f);
        const newScore = Math.min(100, p.faultScore + 1);
        return { ...p, faults: updatedFaults, faultScore: newScore };
      }
      return p;
    }));
    
    if (activeProduct && activeProduct.id === productId) {
      setActiveProduct(prev => ({
        ...prev,
        faults: prev.faults.map(f => f.id === faultId ? { ...f, votes: f.votes + 1 } : f),
        faultScore: Math.min(100, prev.faultScore + 1)
      }));
    }
    triggerNotification('Claim validated with community agreement (-1)');
  };

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    if (authModal.tab === 'login') {
      if (!loginEmail || !loginPassword) return;
      setIsLoggedIn(true);
      const isAdmin = loginEmail.includes('admin');
      setUserRole(isAdmin ? 'admin' : 'user');
      setUsername(isAdmin ? 'Root Admin' : loginEmail.split('@')[0]);
      triggerNotification(`Logged in as ${isAdmin ? 'Root Admin' : 'Verified Contributor'}`);
    } else {
      if (!registerUsername || !registerEmail || !registerCountry) return;
      setIsLoggedIn(true);
      setUserRole('user');
      setUsername(toTitleCase(registerUsername));
      triggerNotification(`Registered from ${toTitleCase(registerCountry)} & Logged In!`);
    }
    setAuthModal({ isOpen: false, tab: 'login' });
    setLoginEmail('');
    setLoginPassword('');
    setRegisterUsername('');
    setRegisterEmail('');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole('user');
    setUsername('Guest User');
    triggerNotification('Logged out successfully');
  };

  const switchRole = () => {
    const nextRole = userRole === 'admin' ? 'user' : 'admin';
    setUserRole(nextRole);
    triggerNotification(`Switched perspective to ${nextRole.toUpperCase()}`);
  };

  const filteredBrands = useMemo(() => {
    return brands.filter(b => {
      if (!b.approved) return false;
      const matchCat = selectedCategory === 'all' || b.categoryId === selectedCategory;
      const matchSearch = b.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [brands, selectedCategory, searchQuery]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const brand = brands.find(b => b.id === p.brandId);
      if (!brand) return false;
      const matchCat = selectedCategory === 'all' || brand.categoryId === selectedCategory;
      const matchBrand = selectedBrand === 'all' || p.brandId === selectedBrand;
      const matchSearch = p.modelName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          brand.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchBrand && matchSearch;
    });
  }, [products, brands, selectedCategory, selectedBrand, searchQuery]);

  const activeProductBrand = activeProduct ? brands.find(b => b.id === activeProduct.brandId) : null;

  return (
    <div className="min-h-screen bg-[#FAF9FC] text-[#1E202B] font-sans relative overflow-x-hidden selection:bg-rose-100 selection:text-[#F41B5E] flex flex-col justify-between">
      
      {/* Background Soft Glow - Matching image_09a3d2.jpg */}
      <div className="absolute top-0 inset-x-0 h-[640px] bg-gradient-to-b from-[#FAF9FC] via-[#F4F2F7] to-transparent pointer-events-none -z-10" />
      <div className="absolute top-10 -left-48 w-96 h-96 rounded-full bg-indigo-100/60 blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-40 -right-48 w-96 h-96 rounded-full bg-rose-100/50 blur-3xl pointer-events-none -z-10" />

      {/* Grid Pattern Background Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e2eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e2eb_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none -z-10" />

      {/* Interactive Floating Status Bar */}
      {notification.show && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-[#1E202B] text-white px-5 py-3 rounded-full shadow-2xl transition-all animate-bounce">
          <span className={`w-2.5 h-2.5 rounded-full ${notification.type === 'error' ? 'bg-red-500' : notification.type === 'info' ? 'bg-indigo-400' : 'bg-emerald-400'}`}></span>
          <span className="text-xs font-semibold">{notification.message}</span>
        </div>
      )}

      {/* Main Header */}
      <header className="border-b border-slate-100 bg-white/70 backdrop-blur-md sticky top-0 z-40 px-4 py-4 sm:px-6 lg:px-8 transition-all">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-3">
            <div className="bg-[#F41B5E] text-white font-black text-xl w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-rose-200">
              -1
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900 flex items-center">
                Check<span className="text-[#F41B5E]">Minus1</span>
                <span className="text-xs text-slate-400 ml-1 font-mono font-medium">.com</span>
              </h1>
              <p className="text-[11px] text-slate-500 font-medium">Real-life product faults before you buy.</p>
            </div>
          </div>

          {/* Search Controls with brand autocomplete suggestion pop-up */}
          <div className="flex-1 max-w-md w-full relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Search Samsung, MacBook, Cat VPN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#FAF9FC] text-slate-800 placeholder-slate-400 pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#F41B5E] focus:bg-white focus:ring-4 focus:ring-rose-100 focus:outline-none transition-all text-sm shadow-sm"
            />
            
            {/* Auto-complete dropdown */}
            {autocompleteBrands.length > 0 && (
              <div className="absolute top-12 left-0 right-0 bg-white border border-slate-150 rounded-xl shadow-xl z-50 p-2 text-xs">
                <p className="text-[10px] text-slate-400 font-bold px-2 py-1 uppercase tracking-wider">Related Brands Found:</p>
                {autocompleteBrands.map(b => (
                  <button
                    key={b.id}
                    onClick={() => {
                      setSelectedBrand(b.id);
                      setSearchQuery('');
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded-lg flex items-center gap-2 transition-all"
                  >
                    <img src={b.logoUrl} alt="" className="w-5 h-5 rounded-full object-cover border" />
                    <span className="font-semibold text-slate-700">{b.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Auths & Admin toggle controllers */}
          <div className="flex items-center gap-3">
            {/* Wallet points badge */}
            <button 
              onClick={() => setShowWalletModal(true)}
              className="flex items-center gap-2 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-3 py-1.5 rounded-xl text-xs font-bold text-amber-700 transition-all"
            >
              <Coins className="w-4 h-4 text-amber-600 animate-spin" />
              <span>🪙 {userPoints} Points</span>
            </button>

            {isLoggedIn ? (
              <div className="flex items-center gap-2 bg-slate-50 p-1.5 pr-3 rounded-xl border border-slate-100">
                <div className="w-7 h-7 rounded-lg bg-[#F41B5E]/10 text-[#F41B5E] font-bold flex items-center justify-center text-xs">
                  {username[0]}
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-[11px] font-black leading-none text-slate-800">{username}</p>
                  <p className="text-[9px] text-slate-400 font-bold uppercase">{userRole}</p>
                </div>
                <button 
                  onClick={handleLogout}
                  title="Logout"
                  className="p-1 hover:text-[#F41B5E] transition-colors ml-1"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setAuthModal({ isOpen: true, tab: 'login' })}
                  className="px-3.5 py-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all"
                >
                  Sign In
                </button>
                <button
                  onClick={() => setAuthModal({ isOpen: true, tab: 'register' })}
                  className="bg-[#F41B5E] text-white px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-md shadow-rose-200 hover:bg-rose-600 transition-all"
                >
                  Join Us
                </button>
              </div>
            )}

            {/* Quick perspective switcher */}
            <button
              onClick={switchRole}
              className={`p-2 rounded-xl border text-xs font-bold transition-all ${
                userRole === 'admin' 
                  ? 'bg-rose-50 text-[#F41B5E] border-rose-100' 
                  : 'bg-white text-slate-400 border-slate-200 hover:text-slate-800'
              }`}
              title="Toggle admin perspective mode"
            >
              <ShieldCheck className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Admin Quick Alert strip */}
      {userRole === 'admin' && (
        <div className="bg-[#1E202B] text-slate-300 py-3 px-4 sm:px-6 lg:px-8 border-b border-slate-800 transition-all animate-fadeIn">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="bg-rose-500/20 text-[#F41B5E] border border-rose-500/30 px-2 py-0.5 rounded text-[10px] font-black tracking-widest uppercase">Admin Active</span>
              <p className="font-semibold text-slate-400">Manage Categories, Approve User claims and Brand indexes.</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-slate-800 text-slate-300 px-2 py-1 rounded font-bold">
                Pending Brands: {pendingBrands.length}
              </span>
              <span className="bg-slate-800 text-slate-300 px-2 py-1 rounded font-bold">
                Pending Claims: {pendingFaults.length}
              </span>
            </div>
          </div>
        </div>
      )}

      {}
      {/* Dynamic Top Slider Carousel (Max Height 350px) */}
      <section className="max-w-7xl mx-auto w-full px-4 pt-6 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden h-[220px] sm:h-[280px] md:h-[350px] shadow-lg border border-slate-100 group">
          {/* Active slide background image */}
          <div 
            className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out scale-102 filter brightness-[0.45]"
            style={{ backgroundImage: `url(${sliderSlides[currentSlide].image})` }}
          />

          {/* Text/CTA overlay container */}
          <div className="absolute inset-0 flex flex-col justify-center p-6 sm:p-10 md:p-12 text-white z-10 select-none">
            <span className="inline-block self-start bg-[#F41B5E] text-white text-[10px] sm:text-xs font-black uppercase px-3 py-1 rounded-full mb-3 tracking-widest">
              {sliderSlides[currentSlide].badge}
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-2 leading-tight max-w-lg transition-transform duration-500">
              {sliderSlides[currentSlide].title}
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-slate-200 max-w-md font-medium">
              {sliderSlides[currentSlide].subtitle}
            </p>
          </div>

          {/* Backwards Button */}
          <button 
            onClick={() => setCurrentSlide((prev) => (prev - 1 + sliderSlides.length) % sliderSlides.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full backdrop-blur-md transition-all opacity-0 group-hover:opacity-100"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Forwards Button */}
          <button 
            onClick={() => setCurrentSlide((prev) => (prev + 1) % sliderSlides.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full backdrop-blur-md transition-all opacity-0 group-hover:opacity-100"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Bullet navigation dot indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
            {sliderSlides.map((_, idx) => (
              <button 
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  idx === currentSlide ? 'bg-[#F41B5E] w-6' : 'bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {}
      {/* 4 Key Features Row under Slider */}
      <section className="max-w-7xl mx-auto w-full px-4 pt-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-3 hover:shadow-md transition-all">
            <div className="p-2.5 rounded-xl bg-rose-50 text-[#F41B5E] shrink-0">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-wide">Minus-1 Curve</h3>
              <p className="text-[11px] text-slate-500 font-medium leading-relaxed mt-0.5">
                Observe dynamic degradation curves charting product lifespan performance drops.
              </p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-3 hover:shadow-md transition-all">
            <div className="p-2.5 rounded-xl bg-[#F41B5E]/10 text-[#F41B5E] shrink-0">
              <HeartCrack className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-wide">Verified Defects</h3>
              <p className="text-[11px] text-slate-500 font-medium leading-relaxed mt-0.5">
                Vote and check crowd-sourced faults confirmed by thousands of actual gadget owners.
              </p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-3 hover:shadow-md transition-all">
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 shrink-0">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-wide">Contribution Rewards</h3>
              <p className="text-[11px] text-slate-500 font-medium leading-relaxed mt-0.5">
                Submit raw unindexed products and earn 10 points redeemable for premium cash vouchers.
              </p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-3 hover:shadow-md transition-all">
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-wide">Predictive Timelines</h3>
              <p className="text-[11px] text-slate-500 font-medium leading-relaxed mt-0.5">
                Analyze if a device fails within 3 months, 6 months, or functions beautifully past 2 years.
              </p>
            </div>
          </div>

        </div>
      </section>

      {}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 w-full flex-grow">
        
        {/* Admin Verification Queue (Only Shows when items need approval) */}
        {userRole === 'admin' && (pendingBrands.length > 0 || pendingFaults.length > 0) && (
          <div className="mb-10 bg-white border-2 border-[#F41B5E]/20 p-6 rounded-3xl shadow-xl shadow-rose-50/40 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-[#F41B5E] text-white text-[10px] font-black px-3 py-1 rounded-bl-xl tracking-wider uppercase">
              Action Required
            </div>
            
            <h2 className="text-base font-black text-slate-900 mb-4 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#F41B5E]" />
              Moderation Control Queue
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Brand Approvals with category routing */}
              <div className="bg-slate-50/60 p-4 rounded-2xl border border-slate-100">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Pending User Brands ({pendingBrands.length})</h3>
                {pendingBrands.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No brand submissions awaiting approval.</p>
                ) : (
                  <div className="space-y-4">
                    {pendingBrands.map(pb => (
                      <div key={pb.id} className="p-3 bg-white rounded-xl border border-slate-100 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <img src={pb.logoUrl} alt="" className="w-8 h-8 rounded-full object-cover border" />
                            <div>
                              <p className="text-xs font-bold text-slate-800">{pb.name}</p>
                              <span className="text-[10px] text-slate-400 font-bold">Assigned default: Other</span>
                            </div>
                          </div>
                          <div className="flex gap-1.5">
                            <button 
                              onClick={() => approvePendingBrand(pb.id)}
                              className="bg-emerald-500 text-white hover:bg-emerald-600 p-1.5 rounded-lg transition-colors flex items-center gap-1 text-xs font-bold"
                              title="Approve & Save"
                            >
                              <Check className="w-4 h-4" /> Approve
                            </button>
                            <button 
                              onClick={() => rejectPendingBrand(pb.id)}
                              className="bg-rose-100 text-[#F41B5E] hover:bg-rose-200 p-1.5 rounded-lg transition-colors"
                              title="Decline"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Admin Inline Category Routing Selector */}
                        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-xs space-y-2">
                          <p className="font-bold text-[10px] text-slate-500 uppercase tracking-wider">Change Indexed Category during Approval:</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <select
                              value={adminBrandCategories[pb.id] || 'cat-other'}
                              onChange={(e) => setAdminBrandCategories({
                                ...adminBrandCategories,
                                [pb.id]: e.target.value
                              })}
                              className="bg-white border border-slate-200 p-1.5 rounded-md focus:outline-none"
                            >
                              {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                              ))}
                            </select>
                            
                            <input
                              type="text"
                              placeholder="Create New Category..."
                              value={adminBrandNewCat[pb.id] || ''}
                              onChange={(e) => setAdminBrandNewCat({
                                ...adminBrandNewCat,
                                [pb.id]: e.target.value
                              })}
                              className="bg-white border border-slate-200 p-1.5 rounded-md focus:outline-none text-xs"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Fault Claim Approvals */}
              <div className="bg-slate-50/60 p-4 rounded-2xl border border-slate-100">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Pending Fault Reports ({pendingFaults.length})</h3>
                {pendingFaults.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No claim submissions awaiting validation.</p>
                ) : (
                  <div className="space-y-3">
                    {pendingFaults.map(pf => (
                      <div key={pf.id} className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-100">
                        <div className="pr-4">
                          <p className="text-xs font-bold text-slate-800">"{pf.text}"</p>
                          <span className="text-[9px] text-[#F41B5E] font-bold bg-rose-50 px-1.5 py-0.5 rounded mt-1 inline-block">
                            Model: {pf.modelName}
                          </span>
                        </div>
                        <div className="flex gap-1.5 shrink-0">
                          <button 
                            onClick={() => approvePendingFault(pf.id)}
                            className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 p-1.5 rounded-lg transition-colors"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => rejectPendingFault(pf.id)}
                            className="bg-rose-100 text-[#F41B5E] hover:bg-rose-200 p-1.5 rounded-lg transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* Category Filter Pills Grid */}
        <div className="flex flex-wrap items-center gap-2 mb-8 border-b border-slate-100 pb-5">
          <button
            onClick={() => { setSelectedCategory('all'); setSelectedBrand('all'); }}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold tracking-tight transition-all ${
              selectedCategory === 'all' 
                ? 'bg-[#1E202B] text-white shadow-md' 
                : 'bg-white hover:bg-slate-50 text-slate-600 border border-slate-200/60 shadow-sm'
            }`}
          >
            All Categories
          </button>
          
          {categories.map(cat => (
            <div key={cat.id} className="relative group flex items-center">
              <button
                onClick={() => { setSelectedCategory(cat.id); setSelectedBrand('all'); }}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold tracking-tight transition-all ${
                  selectedCategory === cat.id 
                    ? 'bg-[#1E202B] text-white shadow-md' 
                    : 'bg-white hover:bg-slate-50 text-slate-600 border border-slate-200/60 shadow-sm'
                }`}
              >
                {cat.name}
              </button>
              
              {userRole === 'admin' && (
                <div className="ml-1.5 flex gap-1 bg-white border border-slate-200 p-1 rounded-lg shadow-sm">
                  <button 
                    onClick={() => triggerEditCategory(cat)} 
                    className="text-slate-500 hover:text-slate-900 font-bold text-[10px] px-1 py-0.5 rounded hover:bg-slate-50"
                  >
                    <Edit3 className="w-3 h-3" />
                  </button>
                  <button 
                    onClick={() => triggerDeleteCategory(cat.id)} 
                    className="text-[#F41B5E] hover:text-rose-800 font-bold text-[10px] px-1 py-0.5 rounded hover:bg-slate-50"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          ))}

          {/* User Action trigger & Admin fast Category trigger */}
          <div className="ml-auto flex items-center gap-2 mt-4 sm:mt-0 w-full sm:w-auto justify-end">
            <button
              onClick={() => setShowUserProblemForm(true)}
              className="bg-white hover:bg-slate-50 text-[#F41B5E] border border-slate-200 font-bold text-xs px-3.5 py-2.5 rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#F41B5E]" />
              Report Fault
            </button>

            {userRole === 'admin' && (
              <button
                onClick={() => {
                  setEditTarget(null);
                  setCatName('');
                  setShowCatForm(true);
                }}
                className="bg-[#F41B5E] hover:bg-rose-600 text-white font-extrabold text-xs px-3.5 py-2.5 rounded-xl flex items-center gap-1.5 shadow-md shadow-rose-200 transition-all hover:scale-102"
              >
                <Plus className="w-3.5 h-3.5 text-white" />
                Add Category
              </button>
            )}
          </div>
        </div>

        {}
        {/* Main Workspace Layout: Brand Sidebar on the left, Products list on the right */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Vertical Brand Sidebar selector */}
          <aside className="lg:col-span-1">
            <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-sm lg:sticky lg:top-28">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                <h2 className="text-xs uppercase tracking-widest font-black text-slate-400 flex items-center gap-2">
                  <span className="w-1.5 h-3.5 bg-[#F41B5E] rounded-full"></span> Brands
                </h2>
                <button
                  onClick={() => { setEditTarget(null); setBrandName(''); setBrandLogoPreview(''); setBrandCatId('cat-other'); setShowBrandForm(true); }}
                  className="bg-rose-50 hover:bg-rose-100 text-[#F41B5E] font-extrabold text-[11px] px-2 py-1.5 rounded-lg transition-all flex items-center gap-1"
                >
                  <Plus className="w-3 h-3 text-[#F41B5E]" /> Add
                </button>
              </div>

              {/* Stacked Vertical Brand Cards Column - Horizontal scrollable strip on mobile, column on desktop */}
              <div className="flex flex-row lg:flex-col gap-2.5 overflow-x-auto lg:overflow-y-auto pb-3 lg:pb-0 max-h-[300px] lg:max-h-[550px] pr-1 scrollbar-thin scrollbar-thumb-slate-200">
                
                {/* "All Brands" Button */}
                <button
                  onClick={() => setSelectedBrand('all')}
                  className={`p-3 rounded-2xl border flex items-center justify-between transition-all shrink-0 min-w-[120px] lg:w-full ${
                    selectedBrand === 'all' 
                      ? 'border-[#F41B5E] bg-rose-50/20 shadow-sm text-slate-800 font-extrabold scale-101' 
                      : 'border-slate-200/60 bg-white hover:border-slate-300 text-slate-700 shadow-sm'
                  }`}
                >
                  <span className="text-xs font-extrabold text-slate-800">All Brands</span>
                  <span className="text-[10px] font-black text-[#F41B5E] tracking-widest hidden lg:inline">ALL</span>
                </button>

                {filteredBrands.map(brand => (
                  <div 
                    key={brand.id}
                    className={`group relative p-3 rounded-2xl border flex items-center justify-between gap-3 transition-all shrink-0 min-w-[130px] lg:w-full ${
                      selectedBrand === brand.id 
                        ? 'border-[#F41B5E] bg-rose-50/20 shadow-md scale-101' 
                        : 'border-slate-200/60 bg-white hover:border-slate-300 shadow-sm'
                    }`}
                  >
                    <div onClick={() => setSelectedBrand(brand.id)} className="flex items-center gap-2.5 cursor-pointer w-full overflow-hidden">
                      <img 
                        src={brand.logoUrl} 
                        alt={brand.name} 
                        className="w-7 h-7 rounded-full object-cover border border-slate-100 shadow-sm shrink-0"
                      />
                      <span className="text-xs font-extrabold text-slate-800 truncate">{brand.name}</span>
                    </div>

                    {/* Quick moderation controls within vertical stack (Desktop only) */}
                    {userRole === 'admin' && (
                      <div className="absolute inset-y-0 right-0 bg-white/95 rounded-r-2xl opacity-0 group-hover:opacity-100 hidden lg:flex items-center justify-center gap-1 px-2 transition-opacity duration-150">
                        <button 
                          onClick={() => triggerEditBrand(brand)} 
                          className="bg-indigo-50 text-indigo-600 border border-indigo-100 text-[10px] font-bold p-1 rounded-md hover:bg-indigo-100 transition-all"
                          title="Edit Brand"
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>
                        <button 
                          onClick={() => triggerDeleteBrand(brand.id)} 
                          className="bg-rose-50 text-[#F41B5E] border border-rose-100 text-[10px] font-bold p-1 rounded-md hover:bg-rose-100 transition-all"
                          title="Delete Brand"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Workspace section with Search Result listings */}
          <section className="lg:col-span-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
              <h2 className="text-xs uppercase tracking-widest font-black text-slate-400 flex items-center gap-2">
                <span className="w-1.5 h-3.5 bg-[#F41B5E] rounded-full"></span> Insights & Fault Indices
              </h2>
              
              <button
                onClick={() => {
                  setEditTarget(null);
                  setProdName('');
                  setProdDesc('');
                  setProdFaults('');
                  setShowProductForm(true);
                }}
                className="bg-[#F41B5E] hover:bg-rose-600 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2 scale-102"
              >
                <Plus className="w-4 h-4 text-white" />
                Index New Model (+10 Pts)
              </button>
            </div>

            {filteredProducts.length === 0 ? (
              /* Custom NOT AVAILABLE Page fallback with 10 Points reward mechanism */
              <div className="bg-white border border-rose-100 rounded-3xl p-6 sm:p-10 text-center max-w-2xl mx-auto my-6 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-1.5 bg-[#F41B5E]"></div>
                <AlertTriangle className="w-16 h-16 text-[#F41B5E] mx-auto mb-4 animate-bounce" />
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-2">"{searchQuery}" Is Not Indexed Yet</h3>
                <p className="text-xs sm:text-sm text-slate-500 mb-6 max-w-md mx-auto leading-relaxed">
                  Our community has not reported any faults for this model yet. Be the first to start the index and earn premium points!
                </p>
                
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 inline-block mb-6">
                  <span className="text-xs font-black text-[#F41B5E] uppercase tracking-wider block">Reward Pool Active</span>
                  <span className="text-base sm:text-lg font-bold text-slate-800">✨ Earn 🪙 10 points instantly</span>
                </div>

                <div>
                  <button
                    onClick={() => {
                      setProdName(toTitleCase(searchQuery));
                      setProdDesc(`Community reported and indexed overview for ${searchQuery}.`);
                      setProdFaultScore(25);
                      setTimelineVal([5, 12, 20, 35, 50]);
                      setProdFaults('');
                      setShowProductForm(true);
                    }}
                    className="bg-[#F41B5E] hover:bg-rose-600 text-white font-black text-xs sm:text-sm px-6 py-3 rounded-xl transition-all shadow-lg shadow-rose-200 inline-flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4 text-white" />
                    Index New Product (+10 Points)
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredProducts.map(prod => {
                  const brand = brands.find(b => b.id === prod.brandId);
                  return (
                    <div 
                      key={prod.id}
                      className="bg-white border border-slate-200/80 rounded-3xl p-5 sm:p-6 relative overflow-hidden hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col justify-between"
                    >
                      {/* Score Indicator Badge */}
                      <div className="absolute top-5 right-5 flex items-center gap-2">
                        <div className="text-right">
                          <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">FAULT SCORE</div>
                          <div className={`text-lg font-black ${
                            prod.faultScore > 60 ? 'text-[#F41B5E]' : prod.faultScore > 30 ? 'text-amber-500' : 'text-emerald-500'
                          }`}>
                            -{prod.faultScore}%
                          </div>
                        </div>
                      </div>

                      <div>
                        {/* Brand Identifier */}
                        <div className="flex items-center gap-2 mb-3">
                          {brand && (
                            <img 
                              src={brand.logoUrl} 
                              alt={brand.name} 
                              className="w-5 h-5 rounded-full object-cover border border-slate-100 shadow-sm" 
                            />
                          )}
                          <span className="text-xs font-extrabold text-slate-400">{brand ? brand.name : 'Unknown Brand'}</span>
                        </div>

                        {/* Model Details */}
                        <h3 className="text-lg font-black text-slate-900 mb-2 pr-14">{prod.modelName}</h3>
                        <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed font-medium">{prod.description}</p>

                        {/* Timeline curve simulation block */}
                        <div className="mb-4 bg-[#FAF9FC] p-3.5 rounded-2xl border border-slate-100">
                          <div className="text-[10px] text-slate-400 font-bold mb-2 flex justify-between">
                            <span className="flex items-center gap-1"><TrendingDown className="w-3 h-3 text-indigo-500" /> Curve Fault Index</span>
                            <span className="text-indigo-600 font-black">1m → 24m</span>
                          </div>
                          <div className="h-12 flex items-end gap-1.5 px-1">
                            {prod.timeline.map((val, idx) => (
                              <div key={idx} className="flex-1 flex flex-col items-center">
                                <div 
                                  style={{ height: `${Math.max(15, val)}%` }} 
                                  className={`w-full rounded-t-md transition-all duration-500 ${
                                    val > 70 ? 'bg-[#F41B5E]' : val > 40 ? 'bg-amber-400' : 'bg-indigo-500'
                                  }`}
                                ></div>
                                <span className="text-[9px] text-slate-400 font-bold mt-1">
                                  {idx === 0 ? '1m' : idx === 1 ? '3m' : idx === 2 ? '6m' : idx === 3 ? '12m' : '24m'}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Actionable Problem Items */}
                        <div className="space-y-2 mb-4">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Top Verified Claims:</span>
                          {prod.faults.slice(0, 3).map(fault => (
                            <div key={fault.id} className="flex items-center justify-between text-xs bg-slate-50/60 px-3 py-2 rounded-xl border border-slate-100">
                              <span className="text-slate-700 truncate pr-2 font-bold text-xs">{fault.text}</span>
                              <button
                                onClick={() => upvoteFault(prod.id, fault.id)}
                                className="bg-rose-50 hover:bg-rose-100 text-[#F41B5E] font-extrabold px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all text-[11px] border border-rose-100/50 shrink-0"
                              >
                                <span>-1</span>
                                <span className="text-slate-400 font-bold text-[10px]">{fault.votes}</span>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Inspector timeline detailed toggle controls */}
                      <div className="border-t border-slate-100 pt-4 mt-2 flex flex-wrap items-center justify-between gap-2">
                        <button 
                          onClick={() => setActiveProduct(prod)}
                          className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-xs font-bold px-4 py-2.5 rounded-xl transition-all border border-indigo-100/30 flex-grow sm:flex-grow-0 text-center"
                        >
                          Inspect Timeline Details
                        </button>

                        {userRole === 'admin' && (
                          <div className="flex gap-1.5 ml-auto">
                            <button 
                              onClick={() => triggerEditProduct(prod)}
                              className="bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 text-xs px-3 py-2 rounded-lg transition-all font-bold"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button 
                              onClick={() => triggerDeleteProduct(prod.id)}
                              className="bg-rose-50 hover:bg-rose-100 text-[#F41B5E] border border-rose-100 text-xs px-3 py-2 rounded-lg transition-all font-bold"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

        </div>

      </main>

      {}
      {/* SVG Detailed progression curve modal container */}
      {activeProduct && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-100 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl relative my-8">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-slate-50/50">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-extrabold block mb-1">Product Insight Timeline</span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900">{activeProduct.modelName}</h3>
              </div>
              <div className="flex items-center gap-4 ml-auto sm:ml-0">
                
                {/* Brand logo on the right-hand side */}
                {activeProductBrand && (
                  <div className="text-right flex items-center gap-2 bg-white px-3 py-1 rounded-xl border shadow-sm">
                    <span className="text-xs font-black text-slate-700">{activeProductBrand.name}</span>
                    <img src={activeProductBrand.logoUrl} alt="" className="w-8 h-8 rounded-full object-cover border" />
                  </div>
                )}

                <button 
                  onClick={() => setActiveProduct(null)}
                  className="bg-white hover:bg-slate-50 border border-slate-200 p-2 rounded-full text-slate-500 transition-all shadow-sm"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-6 space-y-6">
              
              {/* Fault index banner and summary */}
              <div className="flex flex-col sm:flex-row items-center gap-6 bg-rose-50/40 p-4 rounded-2xl border border-rose-100/30">
                <div className="text-center bg-white px-4 py-3 rounded-2xl border border-rose-200/50 shadow-sm w-full sm:w-auto shrink-0">
                  <div className="text-[9px] text-[#F41B5E] font-black tracking-wider">MINUS-1 SCORE</div>
                  <div className="text-3xl font-black text-[#F41B5E]">-{activeProduct.faultScore}%</div>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-slate-600 italic font-medium">"{activeProduct.description}"</p>
                </div>
              </div>

              {/* Curve chart progression container */}
              <div>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Fault Progression Index Curve</h4>
                <div className="bg-[#FAF9FC] rounded-2xl p-4 border border-slate-100 relative h-48 flex items-end overflow-hidden">
                  
                  {/* Grid Lines */}
                  <div className="absolute inset-x-0 top-0 h-full flex flex-col justify-between pointer-events-none p-4 opacity-10">
                    <div className="border-b border-dashed border-slate-400 w-full"></div>
                    <div className="border-b border-dashed border-slate-400 w-full"></div>
                    <div className="border-b border-dashed border-slate-400 w-full"></div>
                  </div>

                  {/* Graphical Plot Lines */}
                  <svg className="absolute inset-0 h-full w-full p-6" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#6366F1" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="#6366F1" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <path 
                      d={`M 0,100 L 0,${100 - activeProduct.timeline[0]} L 25,${100 - activeProduct.timeline[1]} L 50,${100 - activeProduct.timeline[2]} L 75,${100 - activeProduct.timeline[3]} L 100,${100 - activeProduct.timeline[4]} L 100,100 Z`}
                      fill="url(#curveGradient)"
                    />
                    <path 
                      d={`M 0,${100 - activeProduct.timeline[0]} L 25,${100 - activeProduct.timeline[1]} L 50,${100 - activeProduct.timeline[2]} L 75,${100 - activeProduct.timeline[3]} L 100,${100 - activeProduct.timeline[4]}`}
                      fill="none"
                      stroke="#4F46E5"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />
                  </svg>

                  {/* Bottom Labels and percentage overlays */}
                  <div className="relative z-10 w-full flex justify-between px-2">
                    {activeProduct.timeline.map((val, idx) => (
                      <div key={idx} className="text-center">
                        <div className="bg-white shadow-sm border border-slate-100 px-2 py-1 rounded-lg text-[10px] sm:text-xs text-indigo-600 font-extrabold mb-1">
                          {val}%
                        </div>
                        <div className="text-[9px] sm:text-[10px] text-slate-400 font-extrabold">
                          {idx === 0 ? 'Immediate' : idx === 1 ? '3 Months' : idx === 2 ? '6 Months' : idx === 3 ? '1 Year' : '2 Years'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Live Claims list inside inspector */}
              <div>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Community Validation Hub</h4>
                <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
                  {activeProduct.faults.map(fault => (
                    <div key={fault.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                      <div>
                        <p className="text-xs sm:text-sm text-slate-900 font-extrabold">{fault.text}</p>
                        <span className="text-[10px] text-slate-400 font-bold">Verified by {fault.votes} owners</span>
                      </div>
                      <button 
                        onClick={() => upvoteFault(activeProduct.id, fault.id)}
                        className="bg-[#F41B5E] hover:bg-rose-600 text-white font-extrabold px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all active:scale-95 text-xs shadow-md shadow-rose-100 w-full sm:w-auto justify-center"
                      >
                        <span>I Face This Too (-1)</span>
                        <span className="bg-rose-900 text-rose-100 text-[10px] px-1.5 py-0.5 rounded-md font-bold">{fault.votes}</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Modal Footer Controls */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
              <button 
                onClick={() => setActiveProduct(null)}
                className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-extrabold text-xs px-6 py-2.5 rounded-xl transition-all"
              >
                Close Insights
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 1. Category Submission Modal (Only Accessible by Admin) */}
      {showCatForm && userRole === 'admin' && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleCategorySubmit} className="bg-white border border-slate-100 p-6 rounded-3xl w-full max-w-md space-y-4 shadow-2xl">
            <h3 className="text-lg font-black text-slate-900">
              {editTarget ? 'Edit Category' : 'Add New Category'}
            </h3>
            
            <div className="space-y-1">
              <label className="text-xs text-slate-400 uppercase font-black">Category Name</label>
              <input
                type="text"
                placeholder="e.g. Smartphones, Laptops, Software"
                value={catName}
                onChange={(e) => setCatName(e.target.value)}
                className="w-full bg-[#FAF9FC] text-slate-900 p-3 rounded-xl border border-slate-200 focus:bg-white focus:border-[#F41B5E] focus:outline-none text-sm"
                required
              />
              <p className="text-[10px] text-[#F41B5E] font-bold">Words automatically capitalize.</p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button 
                type="button" 
                onClick={() => { setShowCatForm(false); setEditTarget(null); setCatName(''); }}
                className="bg-slate-100 text-slate-600 px-4 py-2.5 rounded-xl text-xs font-bold"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="bg-[#F41B5E] text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-rose-600"
              >
                {editTarget ? 'Save Changes' : 'Index Category'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 2. Brand Submission Modal with upload requirements constraints */}
      {showBrandForm && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <form onSubmit={handleBrandSubmit} className="bg-white border border-slate-100 p-6 rounded-3xl w-full max-w-md space-y-4 shadow-2xl my-8">
            <h3 className="text-lg font-black text-slate-900">
              {editTarget ? 'Edit Brand' : 'Suggest New Brand'}
            </h3>
            
            {/* If user, auto-routed to "Other" default Category */}
            {userRole === 'admin' ? (
              <div className="space-y-1">
                <label className="text-xs text-slate-400 uppercase font-black">Parent Category</label>
                <select
                  value={brandCatId}
                  onChange={(e) => setBrandCatId(e.target.value)}
                  className="w-full bg-[#FAF9FC] text-slate-900 p-3 rounded-xl border border-slate-200 focus:bg-white focus:border-[#F41B5E] focus:outline-none text-sm"
                  required
                >
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60 text-xs text-slate-500">
                <p className="font-bold text-slate-700">Category Assigner:</p>
                As a standard user, your brand suggestion will default to the <strong className="text-[#F41B5E]">Other</strong> category. Admin will index it into the correct category during approval!
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs text-slate-400 uppercase font-black">Brand Name</label>
              <input
                type="text"
                placeholder="e.g. nokia, apple, cat vpn"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                className="w-full bg-[#FAF9FC] text-slate-900 p-3 rounded-xl border border-slate-200 focus:bg-white focus:border-[#F41B5E] focus:outline-none text-sm"
                required
              />
            </div>

            {/* Brand Logo simulated image upload with sizing rules */}
            <div className="space-y-1">
              <label className="text-xs text-slate-400 uppercase font-black block">Brand Logo Image Upload</label>
              <div className="bg-slate-50 border border-slate-150 p-2.5 rounded-xl text-[10px] text-slate-500 font-semibold mb-2 leading-tight">
                📐 Recommended Layout: <strong className="text-slate-700">Fixed 150x150 px</strong><br />
                📦 File size limitation: Max <strong className="text-slate-700">200 KB</strong>
              </div>
              <div className="flex items-center gap-3">
                <label className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 p-4 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                  <Upload className="w-5 h-5 text-slate-400 mb-1" />
                  <span className="text-[11px] text-slate-500 font-bold">Select Local File</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageUploadChange} 
                    className="hidden" 
                  />
                </label>
                {brandLogoPreview ? (
                  <div className="w-16 h-16 rounded-xl border overflow-hidden shrink-0 bg-slate-50 flex items-center justify-center">
                    <img src={brandLogoPreview} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center text-[10px] text-slate-400 font-bold">
                    No logo
                  </div>
                )}
              </div>
            </div>

            {userRole !== 'admin' && (
              <div className="bg-rose-50 text-[#F41B5E] p-3 rounded-xl text-[10px] font-bold flex items-center gap-2">
                <Info className="w-4 h-4 shrink-0" />
                <span>Your Brand suggestion will be queued for Admin verification before publishing live.</span>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button 
                type="button" 
                onClick={() => { setShowBrandForm(false); setEditTarget(null); setBrandName(''); setBrandLogoPreview(''); }}
                className="bg-slate-100 text-slate-600 px-4 py-2.5 rounded-xl text-xs font-bold"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="bg-[#F41B5E] text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-rose-600"
              >
                {editTarget ? 'Save Changes' : userRole === 'admin' ? 'Index Brand' : 'Submit for Verification'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 3. Product Model Addition Modal (Admins or Not Available indexers) */}
      {showProductForm && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleProductSubmit} className="bg-white border border-slate-100 p-6 rounded-3xl w-full max-w-lg space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl">
            <h3 className="text-lg font-black text-slate-900">
              {editTarget ? 'Edit Product Model' : 'Index New Product Model'}
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-slate-400 uppercase font-black">Select Brand</label>
                <select
                  value={prodBrandId}
                  onChange={(e) => setProdBrandId(e.target.value)}
                  className="w-full bg-[#FAF9FC] text-slate-900 p-3 rounded-xl border border-slate-200 focus:bg-white focus:border-[#F41B5E] focus:outline-none text-sm"
                  required
                >
                  <option value="">Select Brand</option>
                  {brands.map(b => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-400 uppercase font-black">Model Name</label>
                <input
                  type="text"
                  placeholder="e.g. nokia 1120 model, galaxy fold"
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  className="w-full bg-[#FAF9FC] text-slate-900 p-3 rounded-xl border border-slate-200 focus:bg-white focus:border-[#F41B5E] focus:outline-none text-sm"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-400 uppercase font-black">Core Slogan / Error Summary</label>
              <textarea
                rows="2"
                placeholder="Briefly state the primary real-life problem found on this model."
                value={prodDesc}
                onChange={(e) => setProdDesc(e.target.value)}
                className="w-full bg-[#FAF9FC] text-slate-900 p-3 rounded-xl border border-slate-200 focus:bg-white focus:border-[#F41B5E] focus:outline-none text-sm"
              />
            </div>

            {/* Custom progression curve editor */}
            <div className="space-y-2 p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <label className="text-xs text-slate-500 uppercase font-black block">Progression curve (Performance Drop %)</label>
              <div className="grid grid-cols-5 gap-2">
                {timelineVal.map((v, i) => (
                  <div key={i} className="text-center">
                    <span className="text-[9px] text-slate-400 font-extrabold block mb-1">
                      {i === 0 ? 'Immediate' : i === 1 ? '3m' : i === 2 ? '6m' : i === 3 ? '12m' : '24m'}
                    </span>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={v}
                      onChange={(e) => {
                        const nextTimeline = [...timelineVal];
                        nextTimeline[i] = Math.max(0, Math.min(100, parseInt(e.target.value) || 0));
                        setTimelineVal(nextTimeline);
                      }}
                      className="w-full bg-white text-[#F41B5E] text-center p-2 rounded-xl border border-slate-200 text-xs font-black focus:outline-none focus:border-[#F41B5E]"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-slate-400 uppercase font-black">General Fault Score (0 - 100%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={prodFaultScore}
                  onChange={(e) => setProdFaultScore(e.target.value)}
                  className="w-full bg-[#FAF9FC] text-slate-900 p-3 rounded-xl border border-slate-200 focus:bg-white focus:border-[#F41B5E] focus:outline-none text-sm"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-400 uppercase font-black">Specific Faults (Comma Separated)</label>
                <input
                  type="text"
                  placeholder="Battery draining, Screen flickering, Wi-Fi dropping"
                  value={prodFaults}
                  onChange={(e) => setProdFaults(e.target.value)}
                  className="w-full bg-[#FAF9FC] text-slate-900 p-3 rounded-xl border border-slate-200 focus:bg-white focus:border-[#F41B5E] focus:outline-none text-sm"
                />
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-[11px] text-amber-800 font-bold flex items-center gap-2">
              <Coins className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Indexing this model will instantly award you 🪙 10 community contribution points!</span>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button 
                type="button" 
                onClick={() => { setShowProductForm(false); setEditTarget(null); }}
                className="bg-slate-100 text-slate-600 px-4 py-2.5 rounded-xl text-xs font-bold"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="bg-[#F41B5E] text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-rose-600"
              >
                {editTarget ? 'Save Changes' : 'Index Product Model (+10 Pts)'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 4. User Problem Report Modal with automated verification on existing products */}
      {showUserProblemForm && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleUserProblemSubmit} className="bg-white border border-slate-100 p-6 rounded-3xl w-full max-w-md space-y-4 shadow-2xl">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-[#F41B5E]" />
              Submit Product Fault Report
            </h3>

            {/* Step 1: Select Brand */}
            <div className="space-y-1">
              <label className="text-xs text-slate-400 uppercase font-black block">Product Brand</label>
              <select
                value={postProbBrandId}
                onChange={(e) => {
                  setPostProbBrandId(e.target.value);
                  setPostProbProductId('');
                }}
                className="w-full bg-[#FAF9FC] text-slate-900 p-3 rounded-xl border border-slate-200 focus:bg-white focus:border-[#F41B5E] focus:outline-none text-sm"
                required
              >
                <option value="">Choose Brand</option>
                {brands.filter(b => b.approved).map(b => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>

            {/* Step 2: Select Model */}
            <div className="space-y-1">
              <label className="text-xs text-slate-400 uppercase font-black block">Model Name</label>
              <select
                value={postProbProductId}
                onChange={(e) => setPostProbProductId(e.target.value)}
                className="w-full bg-[#FAF9FC] text-slate-900 p-3 rounded-xl border border-slate-200 focus:bg-white focus:border-[#F41B5E] focus:outline-none text-sm"
                required
                disabled={!postProbBrandId}
              >
                <option value="">Select Indexed Model</option>
                {products
                  .filter(p => p.brandId === postProbBrandId)
                  .map(p => (
                    <option key={p.id} value={p.id}>{p.modelName}</option>
                  ))}
              </select>
            </div>

            {/* Step 3: Select Common Problem or Choose Other */}
            <div className="space-y-1">
              <label className="text-xs text-slate-400 uppercase font-black block">Select Observed Defect/Issue</label>
              <select
                value={postProbDropdownValue}
                onChange={(e) => setPostProbDropdownValue(e.target.value)}
                className="w-full bg-[#FAF9FC] text-slate-900 p-3 rounded-xl border border-slate-200 focus:bg-white focus:border-[#F41B5E] focus:outline-none text-sm"
                required
              >
                {commonPredefinedProblems.map((prob, idx) => (
                  <option key={idx} value={prob}>{prob}</option>
                ))}
              </select>
            </div>

            {/* If Other, custom type input (auto-formatted on submit) */}
            {postProbDropdownValue === 'Other' && (
              <div className="space-y-1 animate-fadeIn">
                <label className="text-xs text-slate-400 uppercase font-black block">Specify Custom Problem</label>
                <input
                  type="text"
                  placeholder="e.g. charging port loose, headphone jack crackle"
                  value={postProbCustomValue}
                  onChange={(e) => setPostProbCustomValue(e.target.value)}
                  className="w-full bg-[#FAF9FC] text-slate-900 p-3 rounded-xl border border-slate-200 focus:bg-white focus:border-[#F41B5E] focus:outline-none text-sm"
                  required
                />
                <p className="text-[9px] text-[#F41B5E] font-bold">Auto capitalization applies on submit.</p>
              </div>
            )}

            <div className="bg-rose-50 text-[#F41B5E] p-3 rounded-xl text-[10px] font-bold flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 shrink-0 text-[#F41B5E]" />
              <span>Reporting a fault instantly updates our database and submits your auto-verification (-1)!</span>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button 
                type="button" 
                onClick={() => { setShowUserProblemForm(false); }}
                className="bg-slate-100 text-slate-600 px-4 py-2.5 rounded-xl text-xs font-bold"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="bg-[#F41B5E] text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-rose-600"
              >
                Submit Claim Report (+5 Pts)
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 5. User Registration & Login Auth Modal */}
      {authModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-100 rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl">
            
            {/* Tab switch control header */}
            <div className="flex border-b">
              <button
                type="button"
                onClick={() => setAuthModal({ ...authModal, tab: 'login' })}
                className={`flex-1 py-4 text-center text-xs font-black uppercase tracking-wider ${
                  authModal.tab === 'login' ? 'border-b-2 border-[#F41B5E] text-[#F41B5E]' : 'text-slate-400'
                }`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => setAuthModal({ ...authModal, tab: 'register' })}
                className={`flex-1 py-4 text-center text-xs font-black uppercase tracking-wider ${
                  authModal.tab === 'register' ? 'border-b-2 border-[#F41B5E] text-[#F41B5E]' : 'text-slate-400'
                }`}
              >
                Register
              </button>
            </div>

            <form onSubmit={handleAuthSubmit} className="p-6 space-y-4">
              {authModal.tab === 'login' ? (
                <>
                  <div className="space-y-1">
                    <label className="text-xs text-slate-400 font-bold uppercase">Email Address / Username</label>
                    <input
                      type="text"
                      placeholder="e.g. contributor@gmail.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="w-full bg-[#FAF9FC] text-slate-900 p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F41B5E] text-sm"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <label className="text-xs text-slate-400 font-bold uppercase">Password</label>
                      <span className="text-[10px] text-slate-400">Optional for demo</span>
                    </div>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full bg-[#FAF9FC] text-slate-900 p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F41B5E] text-sm"
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
                      value={registerUsername}
                      onChange={(e) => setRegisterUsername(e.target.value)}
                      className="w-full bg-[#FAF9FC] text-slate-900 p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F41B5E] text-sm"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-slate-400 font-bold uppercase">Email Address</label>
                    <input
                      type="email"
                      placeholder="john@example.com"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      className="w-full bg-[#FAF9FC] text-slate-900 p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F41B5E] text-sm"
                      required
                    />
                  </div>
                  {/* Dynamic Country Selector addition */}
                  <div className="space-y-1">
                    <label className="text-xs text-slate-400 font-bold uppercase">Country</label>
                    <input
                      type="text"
                      placeholder="e.g. Bangladesh"
                      value={registerCountry}
                      onChange={(e) => setRegisterCountry(e.target.value)}
                      className="w-full bg-[#FAF9FC] text-slate-900 p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F41B5E] text-sm"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-slate-400 font-bold uppercase">Choose Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full bg-[#FAF9FC] text-slate-900 p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F41B5E] text-sm"
                      required
                    />
                  </div>
                </>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAuthModal({ isOpen: false, tab: 'login' })}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-xl text-xs font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#F41B5E] hover:bg-rose-600 text-white py-2.5 rounded-xl text-xs font-bold transition-all shadow-md shadow-rose-200"
                >
                  {authModal.tab === 'login' ? 'Confirm Login' : 'Register Account'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* 6. Points Wallet & Redeem Modal */}
      {showWalletModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-100 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-amber-500" />
                <h3 className="text-lg font-black text-slate-900">Your Rewards Wallet</h3>
              </div>
              <button 
                onClick={() => setShowWalletModal(false)}
                className="bg-white hover:bg-slate-50 border border-slate-200 p-1.5 rounded-full text-slate-500 transition-all shadow-sm"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Wallet Contents */}
            <div className="p-6 space-y-6">
              
              {/* Balance Box */}
              <div className="bg-gradient-to-br from-amber-500 to-amber-600 text-white p-5 rounded-2xl shadow-md text-center">
                <span className="text-xs font-extrabold uppercase tracking-widest text-amber-100 block mb-1">Total Redeemable Points</span>
                <span className="text-4xl font-black">🪙 {userPoints} Pts</span>
                <p className="text-[10px] text-amber-100 mt-2">Earn 10 points for indexing products, 5 points for verified bug reports.</p>
              </div>

              {/* Reward Options */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Available Redemptions</h4>
                
                {/* Reward Option 1 with 200 points locked restriction */}
                <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">Upcoming Product Discount Voucher</span>
                    <span className="text-[10px] text-[#F41B5E] font-black">Requires 200 points</span>
                  </div>
                  <button
                    disabled={userPoints < 200}
                    onClick={() => {
                      setUserPoints(p => p - 200);
                      triggerNotification('Discount voucher generated successfully! Check your email.', 'success');
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      userPoints >= 200 
                        ? 'bg-[#F41B5E] hover:bg-rose-600 text-white shadow-md' 
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    Redeem
                  </button>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button 
                onClick={() => setShowWalletModal(false)}
                className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-extrabold text-xs px-5 py-2 rounded-xl transition-all"
              >
                Close Wallet
              </button>
            </div>

          </div>
        </div>
      )}

      {}
      {/* Comprehensive Premium Footer */}
      <footer className="bg-[#1E202B] text-slate-400 pt-16 pb-8 border-t border-slate-800 w-full mt-16 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Logo & Philosophy Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-[#F41B5E] text-white font-black text-lg w-8 h-8 rounded-lg flex items-center justify-center shadow-lg">
                -1
              </div>
              <h2 className="text-white text-xl font-black tracking-tight">
                Check<span className="text-[#F41B5E]">Minus1</span>
              </h2>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              We believe in truth over sponsorship. CheckMinus1 indexes real-life bugs, slowdown timelines, and battery drops so you make calculated decisions.
            </p>
          </div>

          {/* Quick Links Column */}
          <div className="space-y-3">
            <h3 className="text-xs uppercase tracking-widest text-white font-black">Top Categories</h3>
            <ul className="space-y-2 text-xs font-bold text-slate-400">
              <li><button onClick={() => setSelectedCategory('cat-1')} className="hover:text-white transition-colors">Smartphones Index</button></li>
              <li><button onClick={() => setSelectedCategory('cat-2')} className="hover:text-white transition-colors">Software & VPN Lag</button></li>
              <li><button onClick={() => setSelectedCategory('cat-3')} className="hover:text-white transition-colors">Laptop Thermal Reports</button></li>
              <li><button onClick={() => setSelectedCategory('cat-4')} className="hover:text-white transition-colors">Smart Watches Drain</button></li>
            </ul>
          </div>

          {/* Platform Statics Column */}
          <div className="space-y-3">
            <h3 className="text-xs uppercase tracking-widest text-white font-black">Community Trust</h3>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex justify-between border-b border-slate-800 pb-1.5 font-bold">
                <span>Indexed Models:</span>
                <span className="text-white">500+ Active</span>
              </li>
              <li className="flex justify-between border-b border-slate-800 pb-1.5 font-bold">
                <span>Verified Claims:</span>
                <span className="text-white">10k+ Voted</span>
              </li>
              <li className="flex justify-between pb-1 text-slate-400 font-bold">
                <span>Accuracy Rating:</span>
                <span className="text-emerald-400">99.2% Approved</span>
              </li>
            </ul>
          </div>

          {/* Socials & Contact Column */}
          <div className="space-y-3">
            <h3 className="text-xs uppercase tracking-widest text-white font-black">Follow The Truth</h3>
            <p className="text-xs text-slate-400">Connect with fellow developers and consumer safety advocates.</p>
            <div className="flex gap-3 text-white">
              <a href="#" className="p-2 rounded-lg bg-slate-800 hover:bg-[#F41B5E] hover:scale-105 transition-all text-slate-300" aria-label="Twitter">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-slate-800 hover:bg-[#F41B5E] hover:scale-105 transition-all text-slate-300" aria-label="GitHub">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-slate-800 hover:bg-[#F41B5E] hover:scale-105 transition-all text-slate-300" aria-label="Website">
                <Globe className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>

        {/* Lower footer copyright info */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-800 mt-10 pt-6 text-center text-xs text-slate-500 font-bold">
          <p>© 2026 CheckMinus1. All rights reserved. Crowd-sourced with ultimate community integrity.</p>
          <p className="mt-1 text-slate-600">Making product insights transparent, one verified fault index at a time.</p>
        </div>
      </footer>

    </div>
  );
}

useEffect(() => {
  const loadData = async () => {
    const { data: cats } = await supabase.from('categories').select('*');
    if (cats) setCategories(cats);

    const { data: brnds } = await supabase.from('brands').select('*');
    if (brnds) setBrands(brnds);

    const { data: prods } = await supabase.from('products').select('*');
    if (prods) setProducts(prods);
  };
  loadData();
}, []);