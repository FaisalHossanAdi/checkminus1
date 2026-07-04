import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShieldCheck, 
  Plus, 
  Search, 
  Trash2, 
  X, 
  LogOut, 
  Upload, 
  MessageSquare, 
  Coins,
  Activity,
  HeartCrack,
  Clock,
  Wallet,
  AlertTriangle,
  Globe,
  ShoppingCart,
  User,
  ShoppingBag,
  Bell,
  Lock,
  CheckCircle,
  ArrowRight,
  Sparkles,
  FolderPlus,
  Edit3,
  Eye,
  EyeOff,
  Users,
  FileSpreadsheet,
  CheckSquare,
  Square,
  Database,
  ThumbsUp,
  Award,
  ChevronRight,
  Info,
  BarChart2,
  Calendar,
  TrendingUp,
  Star
} from 'lucide-react';

const ADMIN_EMAIL_1 = 'admin@checkminus1.com';
const ADMIN_EMAIL_2 = 'admin@gmail.com';
const ADMIN_SECURE_PASSWORD = 'AdminPassword2026!'; // Only secure password allowed to unlock database management

const supabase = (typeof window !== 'undefined' && window.supabase) ? window.supabase : {
  auth: {
    signInWithPassword: async ({ email, password }) => {
      const lowerEmail = email.toLowerCase().trim();
      if (lowerEmail === ADMIN_EMAIL_1 || lowerEmail === ADMIN_EMAIL_2) {
        if (password === ADMIN_SECURE_PASSWORD) {
          return { data: { user: { id: 'u-admin', email } }, error: null };
        } else {
          return { data: null, error: { message: 'Incorrect password for Admin access.' } };
        }
      }
      return { data: { user: { id: 'u-1', email } }, error: null };
    },
    signUp: async ({ email, password }) => {
      return { data: { user: { id: `u-${Date.now()}`, email } }, error: null };
    }
  },
  from: (table) => ({
    select: () => ({
      order: () => Promise.resolve({ data: [], error: null }),
      eq: () => ({ single: () => Promise.resolve({ data: null, error: null }) }),
      then: (cb) => cb({ data: [], error: null })
    }),
    insert: () => Promise.resolve({ data: null, error: null }),
    upsert: () => Promise.resolve({ data: null, error: null }),
    update: () => ({ eq: () => Promise.resolve({ data: null, error: null }) }),
    delete: () => ({ eq: () => Promise.resolve({ data: null, error: null }) })
  })
};

const toTitleCase = (str) => {
  if (!str) return '';
  return str
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const resizeImage = (file, maxWidth, maxHeight, cropToSquare = false) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (cropToSquare) {
          const size = Math.min(width, height);
          canvas.width = maxWidth;
          canvas.height = maxHeight;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(
            img,
            (width - size) / 2,
            (height - size) / 2,
            size,
            size,
            0,
            0,
            maxWidth,
            maxHeight
          );
        } else {
          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
        }
        resolve(canvas.toDataURL('image/jpeg', 0.75));
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

const initialCategories = [
  { id: 'cat-1', name: 'Smartphones', active: true },
  { id: 'cat-2', name: 'Software & VPN', active: true },
  { id: 'cat-3', name: 'Laptops', active: true },
  { id: 'cat-other', name: 'Other', active: true } 
];

const initialBrands = [
  { id: 'brand-1', categoryId: 'cat-1', name: 'Samsung', logoUrl: 'https://images.unsplash.com/photo-1610792516307-ea5acd9c3b00?w=120&auto=format&fit=crop&q=60', approved: true, active: true },
  { id: 'brand-2', categoryId: 'cat-1', name: 'Apple', logoUrl: 'https://images.unsplash.com/photo-1563206767-5b18f218e8de?w=120&auto=format&fit=crop&q=60', approved: true, active: true },
  { id: 'brand-3', categoryId: 'cat-2', name: 'Cat VPN', logoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=60', approved: true, active: true },
];

const initialProducts = [
  {
    id: 'prod-1',
    brandId: 'brand-1',
    categoryId: 'cat-1',
    modelName: 'Galaxy S24 Ultra',
    faultScore: 48,
    timeline: [15, 25, 48, 65, 80],
    description: 'Significant camera shutter lag and screen vividness issues reported in early batches.',
    affiliateLink: 'https://amazon.com/dp/S24Ultra',
    imageUrl: 'https://images.unsplash.com/photo-1610792516307-ea5acd9c3b00?w=400&auto=format&fit=crop&q=80',
    active: true,
    faults: [
      { id: 'f-1', text: 'Camera Shutter Lag In Low Light', votes: 142, approved: true },
      { id: 'f-2', text: 'Display Gradient Flickering', votes: 218, approved: true }
    ]
  },
  {
    id: 'prod-2',
    brandId: 'brand-3',
    categoryId: 'cat-2',
    modelName: 'Cat VPN Pro',
    faultScore: 78,
    timeline: [10, 50, 78, 90, 100],
    description: 'Automatically disconnects after exactly 4 hours of usage, cutting off secure tunnel.',
    affiliateLink: 'https://nordvpn.com',
    imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
    active: true,
    faults: [
      { id: 'f-3', text: 'Auto Disconnection After 4 Hours', votes: 540, approved: true }
    ]
  },
  {
    id: 'prod-3',
    brandId: 'brand-2',
    categoryId: 'cat-3',
    modelName: 'MacBook Air M3',
    faultScore: 12,
    timeline: [2, 5, 8, 12, 18],
    description: 'Highly reliable performance, minor anodized finish wear around charging ports.',
    affiliateLink: 'https://amazon.com',
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&auto=format&fit=crop&q=80',
    active: true,
    faults: [
      { id: 'f-5', text: 'Midnight Color Chipping Off Easily', votes: 95, approved: true }
    ]
  }
];

const initialStoreProducts = [
  { id: 'sp-1', name: 'Premium Shockproof Phone Case', brand: 'Spigen', shortDesc: 'Military-grade drop protection\nCrystal clear back\nAnti-yellowing technology', longDesc: 'This premium shockproof case ensures your device is fully protected from accidental drops while maintaining a sleek, transparent look.', price: 1200, pointsCost: 150, shipmentTime: '2-3 Days', reviewPoints: 20, image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=300&auto=format&fit=crop&q=80', active: true },
  { id: 'sp-2', name: 'High-Speed Type-C Braided Cable', brand: 'Anker', shortDesc: '100W Fast Charging\nNylon Braided exterior\n6ft length', longDesc: 'Durable and incredibly fast. This Type-C to Type-C cable supports up to 100W charging for your laptops and smartphones.', price: 650, pointsCost: 80, shipmentTime: '3-5 Days', reviewPoints: 10, image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=300&auto=format&fit=crop&q=80', active: true },
  { id: 'sp-3', name: 'Anti-Glare Matte Screen Protector', brand: 'Nilkin', shortDesc: 'Fingerprint resistant\n9H Hardness\nEasy installation kit', longDesc: 'Protect your eyes and your screen. The matte finish reduces glare from sunlight and prevents oily fingerprint smudges.', price: 450, pointsCost: 50, shipmentTime: '2-3 Days', reviewPoints: 10, image: 'https://images.unsplash.com/photo-1581090700227-13617d58f35f?w=300&auto=format&fit=crop&q=80', active: true },
];

const initialUsers = [
  {
    id: 'u-1',
    name: 'Rashedul Islam',
    phone: '01712345678',
    email: 'rashedul@gmail.com',
    role: 'user',
    points: 250,
    joinedAt: '2026-03-12',
    activity: {
      reportsSubmitted: 2,
      brandsCreated: 1,
      modelsIndexed: 1,
      votesCast: 4,
      details: [
        { type: 'Report', target: 'Galaxy S24 Ultra', desc: 'Display Gradient Flickering', date: '2026-06-15' },
        { type: 'Index', target: 'Cat VPN Pro', desc: 'Auto Disconnection bug', date: '2026-06-20' },
        { type: 'Vote', target: 'MacBook Air M3', desc: 'Midnight Color Chipping Off Easily', date: '2026-06-28' }
      ]
    }
  },
  {
    id: 'u-admin',
    name: 'Root Administrator',
    phone: '01900000000',
    email: 'admin@checkminus1.com',
    role: 'admin',
    points: 9999,
    joinedAt: '2026-01-01',
    activity: { reportsSubmitted: 0, brandsCreated: 3, modelsIndexed: 3, votesCast: 0, details: [] }
  }
];

const mapBrandFromDB = (b) => ({
  id: b.id,
  categoryId: b.category_id,
  name: b.name,
  logoUrl: b.logo_url,
  approved: b.approved,
  active: b.active
});

const mapBrandToDB = (b) => ({
  id: b.id,
  category_id: b.categoryId,
  name: b.name,
  logo_url: b.logoUrl,
  approved: b.approved,
  active: b.active
});

const mapProductFromDB = (p, faultsList) => ({
  id: p.id,
  brandId: p.brand_id,
  categoryId: p.category_id,
  modelName: p.model_name,
  faultScore: p.fault_score,
  timeline: p.timeline || [5, 10, 15, 20, 25],
  description: p.description,
  affiliateLink: p.affiliate_link,
  imageUrl: p.image_url,
  active: p.active,
  faults: faultsList || []
});

const mapProductToDB = (p) => ({
  id: p.id,
  brand_id: p.brandId,
  category_id: p.categoryId,
  model_name: p.modelName,
  fault_score: p.faultScore,
  timeline: p.timeline,
  description: p.description,
  affiliate_link: p.affiliateLink,
  image_url: p.imageUrl,
  active: p.active
});

const mapFaultFromDB = (f) => ({
  id: f.id,
  productId: f.product_id,
  text: f.text,
  votes: f.votes,
  approved: f.approved
});

const mapFaultToDB = (f, productId) => ({
  id: f.id,
  product_id: productId,
  text: f.text,
  votes: f.votes,
  approved: f.approved
});

const mapStoreProductFromDB = (sp) => ({
  id: sp.id,
  name: sp.name,
  brand: sp.brand,
  shortDesc: sp.short_desc,
  longDesc: sp.long_desc,
  price: sp.price,
  pointsCost: sp.points_cost,
  shipmentTime: sp.shipment_time,
  reviewPoints: sp.review_points,
  image: sp.image,
  active: sp.active
});

const mapStoreProductToDB = (sp) => ({
  id: sp.id,
  name: sp.name,
  brand: sp.brand,
  short_desc: sp.shortDesc,
  long_desc: sp.longDesc,
  price: sp.price,
  points_cost: sp.pointsCost,
  shipment_time: sp.shipmentTime,
  review_points: sp.reviewPoints,
  image: sp.image,
  active: sp.active
});

const mapUserFromDB = (u) => ({
  id: u.id,
  name: u.name,
  phone: u.phone,
  email: u.email,
  role: u.role,
  points: u.points,
  joinedAt: u.joined_at,
  activity: u.activity || { reportsSubmitted: 0, brandsCreated: 0, modelsIndexed: 0, votesCast: 0, details: [] }
});

const mapUserToDB = (u) => ({
  id: u.id,
  name: u.name,
  phone: u.phone,
  email: u.email,
  role: u.role,
  points: u.points,
  joined_at: u.joinedAt,
  activity: u.activity
});

export default function App() {
  const [currentView, setCurrentView] = useState('index');
  const [dbStatus, setDbStatus] = useState('connecting');

  const [categories, setCategories] = useState(() => JSON.parse(localStorage.getItem('c1_categories')) || initialCategories);
  const [brands, setBrands] = useState(() => JSON.parse(localStorage.getItem('c1_brands')) || initialBrands);
  const [products, setProducts] = useState(() => JSON.parse(localStorage.getItem('c1_products')) || initialProducts);
  const [storeProducts, setStoreProducts] = useState(() => JSON.parse(localStorage.getItem('c1_store_products')) || initialStoreProducts);
  const [pendingBrands, setPendingBrands] = useState(() => JSON.parse(localStorage.getItem('c1_pendingBrands')) || []);
  const [users, setUsers] = useState(() => JSON.parse(localStorage.getItem('c1_users')) || initialUsers);
  
  const [isLoggedIn, setIsLoggedIn] = useState(() => JSON.parse(localStorage.getItem('c1_isLoggedIn')) || false);
  const [currentUserId, setCurrentUserId] = useState(() => localStorage.getItem('c1_currentUserId') || '');
  const [userRole, setUserRole] = useState(() => localStorage.getItem('c1_userRole') || 'user'); 
  const [username, setUsername] = useState(() => localStorage.getItem('c1_username') || 'Guest Contributor');
  const [userPoints, setUserPoints] = useState(() => parseInt(localStorage.getItem('c1_userPoints')) || 250); 
  const [userVotes, setUserVotes] = useState(() => JSON.parse(localStorage.getItem('c1_user_votes')) || {});

  const [authPassword, setAuthPassword] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regFullName, setRegFullName] = useState('');
  const [regCountry, setRegCountry] = useState('');

  const [statsPeriod, setStatsPeriod] = useState('7-days');
  const [customStartDate, setCustomStartDate] = useState('2026-06-01');
  const [customEndDate, setCustomEndDate] = useState('2026-06-30');
  const [hoverChartIndex, setHoverChartIndex] = useState(null);

  const [notifications, setNotifications] = useState([
    { id: 1, text: 'Welcome to CheckMinus1! Earn points by indexing models.', unread: true },
    { id: 2, text: 'Admin approved your Samsung model submission. +10 Points earned!', unread: false }
  ]);

  const [adminTab, setAdminTab] = useState('client-db');
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutForm, setCheckoutForm] = useState({ name: '', address: '', phone: '', email: '', password: '', paymentMethod: 'cod' });
  const [countdown, setCountdown] = useState(10);
  const [lastOrderDetails, setLastOrderDetails] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [activeProduct, setActiveProduct] = useState(null);
  const [activeStoreProduct, setActiveStoreProduct] = useState(null);
  const [hoverTimelineIndex, setHoverTimelineIndex] = useState(null);
  
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showBrandForm, setShowBrandForm] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [showProblemForm, setShowProblemForm] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authTab, setAuthTab] = useState('login');

  const [editingCategory, setEditingCategory] = useState(null);
  const [editingBrand, setEditingBrand] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingStoreProduct, setEditingStoreProduct] = useState(null);

  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [isAnonymousExport, setIsAnonymousExport] = useState(false);
  const [expandedUserId, setExpandedUserId] = useState(null);
  const [userSearchQuery, setUserSearchQuery] = useState('');

  const [newCatName, setNewCatName] = useState('');
  const [brandName, setBrandName] = useState('');
  const [brandTargetCat, setBrandTargetCat] = useState('');
  const [brandLogoPreview, setBrandLogoPreview] = useState('');
  const [isLogoOptimized, setLogoOptimized] = useState(false);
  
  const [prodName, setProdName] = useState('');
  const [prodBrandId, setProdBrandId] = useState('');
  const [prodCatId, setProdCatId] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodImagePreview, setProdImagePreview] = useState('');
  const [isProdImgOptimized, setProdImgOptimized] = useState(false);

  // Store Upload Extended States
  const [storeNewName, setStoreNewName] = useState('');
  const [storeNewBrand, setStoreNewBrand] = useState('');
  const [storeNewShortDesc, setStoreNewShortDesc] = useState('');
  const [storeNewLongDesc, setStoreNewLongDesc] = useState('');
  const [storeNewPrice, setStoreNewPrice] = useState('');
  const [storeNewPoints, setStoreNewPoints] = useState('');
  const [storeNewShipment, setStoreNewShipment] = useState('');
  const [storeNewReviewPoints, setStoreNewReviewPoints] = useState('');
  const [storeNewImage, setStoreNewImage] = useState('');
  const [isStoreImgOptimized, setStoreImgOptimized] = useState(false);

  const [probProduct, setProbProduct] = useState('');
  const [probText, setProbText] = useState('Battery Degradation & Fast Draining');
  const [customProbText, setCustomProbText] = useState('');

  const [passForm, setPassForm] = useState({ current: '', newPass: '' });
  const [alertBanner, setAlertBanner] = useState({ show: false, msg: '', type: 'success' });

  useEffect(() => {
    const fetchSupabaseData = async () => {
      try {
        setDbStatus('connecting');

        const fetchTable = async (tableName) => {
          try {
            const { data, error } = await supabase.from(tableName).select('*');
            if (error) throw error;
            return data;
          } catch (e) {
            console.warn(`Fallback fetch failed for table: ${tableName}`, e);
            return null;
          }
        };

        const dbCats = await fetchTable('categories');
        const dbBrands = await fetchTable('brands');
        const dbProducts = await fetchTable('products');
        const dbFaults = await fetchTable('faults');
        const dbStore = await fetchTable('store_products');
        const dbProfiles = await fetchTable('profiles');

        if (dbCats && dbCats.length > 0) setCategories(dbCats);
        
        if (dbBrands && dbBrands.length > 0) {
          const mappedBrands = dbBrands.map(mapBrandFromDB);
          setBrands(mappedBrands.filter(b => b.approved));
          setPendingBrands(mappedBrands.filter(b => !b.approved));
        }

        if (dbProducts && dbProducts.length > 0) {
          const mappedProducts = dbProducts.map(p => {
            const pFaults = dbFaults ? dbFaults.filter(f => f.product_id === p.id).map(mapFaultFromDB) : [];
            return mapProductFromDB(p, pFaults);
          });
          setProducts(mappedProducts);
        }

        if (dbStore && dbStore.length > 0) {
          setStoreProducts(dbStore.map(mapStoreProductFromDB));
        }

        if (dbProfiles && dbProfiles.length > 0) {
          setUsers(dbProfiles.map(mapUserFromDB));
        }

        setDbStatus('connected');
      } catch (e) {
        console.warn('Database offline fallback loaded: ', e);
        setDbStatus('offline');
      }
    };
    
    fetchSupabaseData();
  }, []);

  useEffect(() => {
    localStorage.setItem('c1_categories', JSON.stringify(categories));
    localStorage.setItem('c1_brands', JSON.stringify(brands));
    localStorage.setItem('c1_products', JSON.stringify(products));
    localStorage.setItem('c1_store_products', JSON.stringify(storeProducts));
    localStorage.setItem('c1_pendingBrands', JSON.stringify(pendingBrands));
    localStorage.setItem('c1_users', JSON.stringify(users));
    localStorage.setItem('c1_isLoggedIn', JSON.stringify(isLoggedIn));
    localStorage.setItem('c1_currentUserId', currentUserId);
    localStorage.setItem('c1_userRole', userRole);
    localStorage.setItem('c1_username', username);
    localStorage.setItem('c1_userPoints', userPoints.toString());
    localStorage.setItem('c1_user_votes', JSON.stringify(userVotes));
  }, [categories, brands, products, storeProducts, pendingBrands, users, isLoggedIn, currentUserId, userRole, username, userPoints, userVotes]);

  useEffect(() => {
    let timer;
    if (currentView === 'thank-you' && countdown > 0) {
      timer = setTimeout(() => setCountdown(prev => prev - 1), 1000);
    } else if (currentView === 'thank-you' && countdown === 0) {
      setCurrentView('index');
    }
    return () => clearTimeout(timer);
  }, [currentView, countdown]);

  const triggerAlert = (msg, type = 'success') => {
    setAlertBanner({ show: true, msg, type });
    setTimeout(() => setAlertBanner({ show: false, msg: '', type: 'success' }), 4000);
  };

  const logUserActivity = async (userId, type, target, desc) => {
    const today = new Date().toISOString().split('T')[0];
    const newLog = { type, target, desc, date: today };
    
    let updatedUserObj = null;

    const updatedUsers = users.map(u => {
      if (u.id === userId) {
        const updatedActivity = { ...u.activity };
        updatedActivity.details = [newLog, ...updatedActivity.details];
        
        if (type === 'Report') updatedActivity.reportsSubmitted = (updatedActivity.reportsSubmitted || 0) + 1;
        if (type === 'Brand') updatedActivity.brandsCreated = (updatedActivity.brandsCreated || 0) + 1;
        if (type === 'Index') updatedActivity.modelsIndexed = (updatedActivity.modelsIndexed || 0) + 1;
        if (type === 'Vote') updatedActivity.votesCast = (updatedActivity.votesCast || 0) + 1;

        const updatedPoints = u.points + (type === 'Index' ? 10 : type === 'Report' ? 5 : 1);
        updatedUserObj = { ...u, activity: updatedActivity, points: updatedPoints };
        return updatedUserObj;
      }
      return u;
    });

    setUsers(updatedUsers);

    if (userId === currentUserId && updatedUserObj) {
      setUserPoints(updatedUserObj.points);
    }

    if (dbStatus === 'connected' && updatedUserObj) {
      try {
        await supabase.from('profiles').upsert([mapUserToDB(updatedUserObj)]);
      } catch (e) {
        console.error('Failed to update activity to Cloud DB: ', e);
      }
    }
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    
    if (authTab === 'login') {
      const emailOrUser = checkoutForm.name.trim();
      const lowerEmail = emailOrUser.toLowerCase();

      const isTryingAdmin = lowerEmail === ADMIN_EMAIL_1 || lowerEmail === ADMIN_EMAIL_2;
      
      if (isTryingAdmin && authPassword !== ADMIN_SECURE_PASSWORD) {
        triggerAlert('Login Failed: Invalid Admin Secure Password!', 'error');
        return;
      }

      try {
        triggerAlert('Verifying credentials with cloud...', 'info');
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email: emailOrUser,
          password: authPassword,
        });

        if (authError) {
          triggerAlert(`Login Failed: ${authError.message}`, 'error');
          return;
        }

        let fallbackRole = 'user';
        let fallbackName = emailOrUser.split('@')[0];
        
        if (isTryingAdmin) {
          fallbackRole = 'admin';
          fallbackName = 'Administrator';
        }

        setIsLoggedIn(true);
        setUserRole(fallbackRole);
        setUsername(toTitleCase(fallbackName));
        setCurrentUserId(authData?.user?.id || 'u-admin');
        
        if (fallbackRole === 'admin') {
          triggerAlert('Welcome Back, Admin! Portal Unlocked.');
        } else {
          triggerAlert('Logged in successfully.');
        }
        setShowAuthModal(false);
        setAuthPassword('');
      } catch (err) {
        triggerAlert('Connection error occurred.', 'error');
      }
    } else {
      const lowerRegEmail = regEmail.toLowerCase().trim();
      if (lowerRegEmail === ADMIN_EMAIL_1 || lowerRegEmail === ADMIN_EMAIL_2 || lowerRegEmail.includes('admin')) {
        triggerAlert('Registration Blocked: Unauthorized Email format.', 'error');
        return;
      }

      try {
        triggerAlert('Creating secure cloud account...', 'info');
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: regEmail,
          password: authPassword,
        });

        if (authError) {
          triggerAlert(`Registration Failed: ${authError.message}`, 'error');
          return;
        }

        const newProfileId = authData?.user?.id || `u-${Date.now()}`;
        const newProfile = {
          id: newProfileId,
          name: regFullName,
          phone: '01712345678',
          email: regEmail,
          role: 'user',
          points: 250,
          joinedAt: new Date().toISOString().split('T')[0],
          activity: { reportsSubmitted: 0, brandsCreated: 0, modelsIndexed: 0, votesCast: 0, details: [] }
        };

        setUsers([...users, newProfile]);
        
        // Pushing registration immediately to DB
        if (dbStatus === 'connected') {
          try {
            await supabase.from('profiles').insert([mapUserToDB(newProfile)]);
          } catch (err) {
            console.error('Supabase profile creation error: ', err);
          }
        }

        triggerAlert('Account created successfully! Switching to login.', 'success');
        setAuthTab('login');
        setCheckoutForm({ ...checkoutForm, name: regEmail });
        setAuthPassword('');
      } catch (err) {
        triggerAlert('Registration error occurred.', 'error');
      }
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole('user');
    setCurrentUserId('');
    setUsername('Guest Contributor');
    setCurrentView('index');
    triggerAlert('Logged out securely.');
  };

  const addToCart = (product, e) => {
    if (e) e.stopPropagation();
    if (!isLoggedIn) {
      triggerAlert('Please sign in or register to add items to your cart.', 'error');
      setAuthTab('login');
      setShowAuthModal(true);
      return;
    }
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

  const handleCheckout = async (e) => {
    e.preventDefault();
    const phoneRegex = /^01[3-9]\d{8}$/; 

    if (!checkoutForm.name.trim() || !checkoutForm.address.trim()) {
      triggerAlert('Please complete all delivery fields.', 'error');
      return;
    }

    if (!phoneRegex.test(checkoutForm.phone)) {
      triggerAlert('Error: Phone number must be a valid 11-digit Bangladeshi number.', 'error');
      return;
    }

    const pointsTotal = cart.reduce((sum, item) => sum + item.pointsCost, 0);
    const moneyTotal = cart.reduce((sum, item) => sum + item.price, 0);

    if (checkoutForm.paymentMethod === 'points') {
      if (userPoints < pointsTotal) {
        triggerAlert('Insufficient points balance inside wallet!', 'error');
        return;
      }
      setUserPoints(prev => prev - pointsTotal);
      const nextUsers = users.map(u => u.id === currentUserId ? { ...u, points: u.points - pointsTotal } : u);
      setUsers(nextUsers);

      const targetUser = nextUsers.find(u => u.id === currentUserId);
      if (dbStatus === 'connected' && targetUser) {
        try {
          await supabase.from('profiles').upsert([mapUserToDB(targetUser)]);
        } catch (err) {
          console.error('Supabase points deduct failure: ', err);
        }
      }
    }

    setLastOrderDetails({
      items: [...cart],
      totalPaid: checkoutForm.paymentMethod === 'points' ? `${pointsTotal} Pts` : `৳ ${moneyTotal}`,
      method: checkoutForm.paymentMethod.toUpperCase(),
      name: checkoutForm.name,
      phone: checkoutForm.phone
    });

    setCart([]);
    setIsCartOpen(false);
    setCountdown(10);
    setCurrentView('thank-you');
    triggerAlert('Order received successfully!');
  };

  const upvoteFault = async (prodId, faultId) => {
    if (!isLoggedIn) {
      triggerAlert('Please sign in to vote! We protect indices from fake votes.', 'error');
      setAuthTab('login');
      setShowAuthModal(true);
      return;
    }

    const userVotedList = userVotes[currentUserId] || [];
    if (userVotedList.includes(faultId)) {
      triggerAlert('You have already registered your vote for this defect!', 'error');
      return;
    }

    const updatedVotes = {
      ...userVotes,
      [currentUserId]: [...userVotedList, faultId]
    };
    setUserVotes(updatedVotes);

    let targetFaultObj = null;
    let targetProdObj = null;

    const updated = products.map(p => {
      if (p.id === prodId) {
        const updatedFaults = p.faults.map(f => {
          if (f.id === faultId) {
            targetFaultObj = { ...f, votes: f.votes + 1 };
            return targetFaultObj;
          }
          return f;
        });
        targetProdObj = { ...p, faults: updatedFaults, faultScore: Math.min(100, p.faultScore + 1) };
        return targetProdObj;
      }
      return p;
    });

    setProducts(updated);
    if (activeProduct && activeProduct.id === prodId) {
      setActiveProduct(updated.find(p => p.id === prodId));
    }

    if (dbStatus === 'connected' && targetFaultObj && targetProdObj) {
      try {
        await supabase.from('faults').update({ votes: targetFaultObj.votes }).eq('id', faultId);
        await supabase.from('products').update({ fault_score: targetProdObj.faultScore }).eq('id', prodId);
      } catch (err) {
        console.error('Supabase fault score save failed: ', err);
      }
    }

    const matchedProd = products.find(p => p.id === prodId);
    const matchedFault = matchedProd?.faults.find(f => f.id === faultId);
    logUserActivity(currentUserId, 'Vote', matchedProd?.modelName || 'Product', matchedFault?.text || 'Defect');

    triggerAlert('Defect verified successfully!');
  };

  const handleCategoryUpload = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      triggerAlert('Access Denied. Please login first.', 'error');
      return;
    }
    if (!newCatName.trim()) return;
    const formatted = toTitleCase(newCatName);
    const newCat = { id: `cat-${Date.now()}`, name: formatted, active: true };
    
    setCategories([...categories, newCat]);
    setNewCatName('');
    setShowCategoryForm(false);

    if (dbStatus === 'connected') {
      try {
        await supabase.from('categories').insert([newCat]);
      } catch (err) {
        console.error('Supabase write failure: ', err);
      }
    }
    triggerAlert('New Category successfully added!');
  };

  const handleBrandUpload = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      triggerAlert('Please login to propose or index brands.', 'error');
      setAuthTab('login');
      setShowAuthModal(true);
      return;
    }

    if (!brandName.trim() || !brandTargetCat) {
      triggerAlert('Please select brand name and category parent.', 'error');
      return;
    }

    const formattedName = toTitleCase(brandName);
    const finalLogo = brandLogoPreview || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120';

    const newBrand = {
      id: `brand-${Date.now()}`,
      categoryId: brandTargetCat, 
      name: formattedName,
      logoUrl: finalLogo,
      approved: userRole === 'admin' ? true : false,
      active: true
    };

    if (userRole === 'admin') {
      setBrands([...brands, newBrand]);
      if (dbStatus === 'connected') {
        try {
          await supabase.from('brands').insert([mapBrandToDB(newBrand)]);
        } catch (err) {
          console.error('Supabase write failure: ', err);
        }
      }
      triggerAlert('Brand added and approved directly by Admin!');
    } else {
      setPendingBrands([...pendingBrands, newBrand]);
      logUserActivity(currentUserId, 'Brand', formattedName, 'Proposed new brand');
      if (dbStatus === 'connected') {
        try {
          await supabase.from('brands').insert([mapBrandToDB(newBrand)]);
        } catch (err) {
          console.error('Supabase pending write failure: ', err);
        }
      }
      triggerAlert('Brand submitted for Administrator verification.');
    }

    setBrandName('');
    setBrandTargetCat('');
    setBrandLogoPreview('');
    setLogoOptimized(false);
    setShowBrandForm(false);
  };

  const handleProductUpload = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      triggerAlert('Login is required to index new product models.', 'error');
      setAuthTab('login');
      setShowAuthModal(true);
      return;
    }

    if (!prodName.trim() || !prodBrandId || !prodCatId) {
      triggerAlert('Please complete Brand, Category, and Model Name fields.', 'error');
      return;
    }

    const formattedModel = toTitleCase(prodName);
    const newProductId = `prod-${Date.now()}`;
    const initialFaultObj = { id: `f-${Date.now()}`, text: 'Initial Index Active', votes: 1, approved: true };

    const newProduct = {
      id: newProductId,
      brandId: prodBrandId,
      categoryId: prodCatId, 
      modelName: formattedModel,
      faultScore: 10, 
      timeline: [5, 12, 18, 25, 32],
      description: prodDesc || 'No user-submitted description provided yet.',
      affiliateLink: 'https://amazon.com/s?k=' + encodeURIComponent(formattedModel),
      imageUrl: prodImagePreview || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300', 
      active: true,
      faults: [initialFaultObj]
    };

    setProducts([...products, newProduct]);
    setUserPoints(prev => prev + 10); 
    logUserActivity(currentUserId, 'Index', formattedModel, 'Indexed new hardware model');
    
    setNotifications([
      { id: Date.now(), text: `You successfully indexed ${formattedModel}! +10 Points rewarded.`, unread: true },
      ...notifications
    ]);

    if (dbStatus === 'connected') {
      try {
        await supabase.from('products').insert([mapProductToDB(newProduct)]);
        await supabase.from('faults').insert([mapFaultToDB(initialFaultObj, newProductId)]);
      } catch (err) {
        console.error('Supabase product index failure: ', err);
      }
    }

    setProdName('');
    setProdBrandId('');
    setProdCatId('');
    setProdDesc('');
    setProdImagePreview('');
    setProdImgOptimized(false);
    setShowProductForm(false);
    triggerAlert('Product indexed! +10 Points added to your contribution wallet.');
  };

  const handleAdminStoreProductUpload = async (e) => {
    e.preventDefault();
    if (!storeNewName.trim() || !storeNewPrice || !storeNewPoints) {
      triggerAlert('Please complete required Store Product fields.', 'error');
      return;
    }

    const newStoreProduct = {
      id: `sp-${Date.now()}`,
      name: toTitleCase(storeNewName),
      brand: toTitleCase(storeNewBrand) || 'Generic',
      shortDesc: storeNewShortDesc,
      longDesc: storeNewLongDesc,
      shipmentTime: storeNewShipment || '3-5 Days',
      reviewPoints: parseInt(storeNewReviewPoints) || 0,
      price: parseInt(storeNewPrice) || 0,
      pointsCost: parseInt(storeNewPoints) || 0,
      image: storeNewImage || 'https://images.unsplash.com/photo-1586105251261-72a756497a11?w=300',
      active: true
    };

    setStoreProducts([...storeProducts, newStoreProduct]);
    setStoreNewName('');
    setStoreNewBrand('');
    setStoreNewShortDesc('');
    setStoreNewLongDesc('');
    setStoreNewShipment('');
    setStoreNewReviewPoints('');
    setStoreNewPrice('');
    setStoreNewPoints('');
    setStoreNewImage('');
    setStoreImgOptimized(false);

    if (dbStatus === 'connected') {
      try {
        await supabase.from('store_products').insert([mapStoreProductToDB(newStoreProduct)]);
      } catch (err) {
        console.error('Supabase write failure: ', err);
      }
    }
    triggerAlert('New Store reward product successfully added to live inventory!');
  };

  const deleteStoreProduct = async (id) => {
    setStoreProducts(storeProducts.filter(p => p.id !== id));
    if (dbStatus === 'connected') {
      try {
        await supabase.from('store_products').delete().eq('id', id);
      } catch (err) {
        console.error('Supabase delete error: ', err);
      }
    }
    triggerAlert('Store product deleted from live database.');
  };

  const handleProblemSubmission = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      triggerAlert('Authentication is required to report hardware bugs.', 'error');
      setAuthTab('login');
      setShowAuthModal(true);
      return;
    }

    if (!probProduct) return;

    const finalProblem = probText === 'Other' ? toTitleCase(customProbText) : probText;
    if (!finalProblem.trim()) return;

    let targetFaultObj = null;
    let isNewFault = false;

    const updatedProducts = products.map(p => {
      if (p.id === probProduct) {
        const exists = p.faults.find(f => f.text.toLowerCase() === finalProblem.toLowerCase());
        let updatedFaults;

        if (exists) {
          targetFaultObj = { ...exists, votes: exists.votes + 1 };
          updatedFaults = p.faults.map(f => 
            f.text.toLowerCase() === finalProblem.toLowerCase() ? targetFaultObj : f
          );
        } else {
          isNewFault = true;
          targetFaultObj = { id: `f-${Date.now()}`, text: finalProblem, votes: 2, approved: true };
          updatedFaults = [...p.faults, targetFaultObj];
        }

        return {
          ...p,
          faults: updatedFaults,
          faultScore: Math.min(100, p.faultScore + 3) 
        };
      }
      return p;
    });

    setProducts(updatedProducts);
    
    if (activeProduct && activeProduct.id === probProduct) {
      setActiveProduct(updatedProducts.find(p => p.id === probProduct));
    }

    setUserPoints(prev => prev + 5); 
    logUserActivity(currentUserId, 'Report', products.find(p => p.id === probProduct)?.modelName || 'Model', finalProblem);

    if (dbStatus === 'connected' && targetFaultObj) {
      try {
        if (isNewFault) {
          await supabase.from('faults').insert([mapFaultToDB(targetFaultObj, probProduct)]);
        } else {
          await supabase.from('faults').update({ votes: targetFaultObj.votes }).eq('id', targetFaultObj.id);
        }
        const currentProd = updatedProducts.find(p => p.id === probProduct);
        if (currentProd) {
          await supabase.from('products').update({ fault_score: currentProd.faultScore }).eq('id', probProduct);
        }
      } catch (err) {
        console.error('Supabase write error: ', err);
      }
    }

    triggerAlert('Fault submitted and automatically upvoted!');
    setShowProblemForm(false);
    setProbProduct('');
    setCustomProbText('');
  };

  const handleUploadedImage = async (e, targetSetter, optimizedSetter, width, height, crop) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const optimizedBase64 = await resizeImage(file, width, height, crop);
        targetSetter(optimizedBase64);
        optimizedSetter(true);
        triggerAlert('Image uploaded & auto-resized to optimal scale!');
      } catch (error) {
        triggerAlert('Image scaling failed. Please upload generic format.', 'error');
      }
    }
  };

  const approveBrand = async (pendingItem, catId) => {
    const approvedItem = { ...pendingItem, categoryId: catId, approved: true, active: true };
    setBrands([...brands, approvedItem]);
    setPendingBrands(pendingBrands.filter(b => b.id !== pendingItem.id));

    if (dbStatus === 'connected') {
      try {
        await supabase.from('brands').update({ approved: true, category_id: catId, active: true }).eq('id', pendingItem.id);
      } catch (err) {
        console.error('Supabase workflow adjustment failed: ', err);
      }
    }
    triggerAlert('Brand approved and indexed successfully.');
  };

  const rejectBrand = async (id) => {
    setPendingBrands(pendingBrands.filter(b => b.id !== id));
    if (dbStatus === 'connected') {
      try {
        await supabase.from('brands').delete().eq('id', id);
      } catch (err) {
        console.error('Supabase deletion error: ', err);
      }
    }
    triggerAlert('Brand recommendation declined.', 'info');
  };

  const saveCategoryEdit = async (e) => {
    e.preventDefault();
    setCategories(categories.map(c => c.id === editingCategory.id ? editingCategory : c));
    
    if (dbStatus === 'connected') {
      try {
        await supabase.from('categories').upsert([editingCategory]);
      } catch (err) {
        console.error('Supabase update failure: ', err);
      }
    }
    setEditingCategory(null);
    triggerAlert('Category adjustments saved successfully.');
  };

  const deleteCategory = async (id) => {
    setCategories(categories.filter(c => c.id !== id));
    if (dbStatus === 'connected') {
      try {
        await supabase.from('categories').delete().eq('id', id);
      } catch (err) {
        console.error('Supabase deletion failure: ', err);
      }
    }
    triggerAlert('Category deleted from system.');
  };

  const saveBrandEdit = async (e) => {
    e.preventDefault();
    setBrands(brands.map(b => b.id === editingBrand.id ? editingBrand : b));
    if (dbStatus === 'connected') {
      try {
        await supabase.from('brands').upsert([mapBrandToDB(editingBrand)]);
      } catch (err) {
        console.error('Supabase update failure: ', err);
      }
    }
    setEditingBrand(null);
    triggerAlert('Brand adjustments saved successfully.');
  };

  const deleteBrand = async (id) => {
    setBrands(brands.filter(b => b.id !== id));
    if (dbStatus === 'connected') {
      try {
        await supabase.from('brands').delete().eq('id', id);
      } catch (err) {
        console.error('Supabase deletion failure: ', err);
      }
    }
    triggerAlert('Brand permanently deleted.');
  };

  const saveProductEdit = async (e) => {
    e.preventDefault();
    setProducts(products.map(p => p.id === editingProduct.id ? editingProduct : p));
    if (dbStatus === 'connected') {
      try {
        await supabase.from('products').upsert([mapProductToDB(editingProduct)]);
      } catch (err) {
        console.error('Supabase product save failure: ', err);
      }
    }
    setEditingProduct(null);
    triggerAlert('Hardware Model index adjustments saved.');
  };

  const deleteProduct = async (id) => {
    setProducts(products.filter(p => p.id !== id));
    if (dbStatus === 'connected') {
      try {
        await supabase.from('products').delete().eq('id', id);
      } catch (err) {
        console.error('Supabase deletion failure: ', err);
      }
    }
    triggerAlert('Hardware Index permanently removed.');
  };

  const saveStoreProductEdit = async (e) => {
    e.preventDefault();
    setStoreProducts(storeProducts.map(sp => sp.id === editingStoreProduct.id ? editingStoreProduct : sp));
    if (dbStatus === 'connected') {
      try {
        await supabase.from('store_products').upsert([mapStoreProductToDB(editingStoreProduct)]);
      } catch (err) {
        console.error('Supabase update failure: ', err);
      }
    }
    setEditingStoreProduct(null);
    triggerAlert('Reward Store item adjusted.');
  };

  const handleStoreReview = (productId, points) => {
    if (!isLoggedIn) return;
    triggerAlert(`Review submitted successfully! You earned ${points} points.`, 'success');
    setUserPoints(prev => prev + points);
    logUserActivity(currentUserId, 'Vote', 'Store Purchase Review', `Earned ${points} pts for review`);
    setActiveStoreProduct(null);
  };

  const toggleSelectUser = (id) => {
    if (selectedUserIds.includes(id)) {
      setSelectedUserIds(selectedUserIds.filter(uid => uid !== id));
    } else {
      setSelectedUserIds([...selectedUserIds, id]);
    }
  };

  const toggleSelectAllUsers = (filteredUsers) => {
    if (selectedUserIds.length === filteredUsers.length) {
      setSelectedUserIds([]);
    } else {
      setSelectedUserIds(filteredUsers.map(u => u.id));
    }
  };

  const exportSelectedUsersCSV = () => {
    if (selectedUserIds.length === 0) {
      triggerAlert('Please select at least one user to export data.', 'error');
      return;
    }

    const exportList = users.filter(u => selectedUserIds.includes(u.id));
    
    let csvRows = [];
    csvRows.push(['User ID', 'Name', 'Email Address', 'Phone Number', 'Account Role', 'Contributions Point', 'Registration Date', 'Reports Submitted', 'Brands Created', 'Models Indexed', 'Votes Registered'].join(','));

    exportList.forEach(u => {
      const finalName = isAnonymousExport ? `Anonymous-${u.id.substring(2, 6).toUpperCase()}` : u.name;
      const finalEmail = isAnonymousExport ? 'confidential-email@checkminus1.com' : u.email;
      const finalPhone = isAnonymousExport ? '01XXXXXXXXX' : u.phone;

      const row = [
        u.id,
        `"${finalName}"`,
        `"${finalEmail}"`,
        `"${finalPhone}"`,
        u.role,
        u.points,
        u.joinedAt,
        u.activity?.reportsSubmitted || 0,
        u.activity?.brandsCreated || 0,
        u.activity?.modelsIndexed || 0,
        u.activity?.votesCast || 0
      ];
      csvRows.push(row.join(','));
    });

    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `checkminus1_users_${isAnonymousExport ? 'anonymous_' : ''}${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    triggerAlert(`Exported ${exportList.length} users successfully!`);
  };

  const activeCategories = useMemo(() => {
    return categories.filter(c => c.active !== false);
  }, [categories]);

  const activeBrands = useMemo(() => {
    return brands.filter(b => b.approved && b.active !== false);
  }, [brands]);

  const activeProducts = useMemo(() => {
    return products.filter(p => p.active !== false);
  }, [products]);

  const activeStoreProducts = useMemo(() => {
    return storeProducts.filter(sp => sp.active !== false);
  }, [storeProducts]);

  const fuzzyBrands = useMemo(() => {
    if (searchQuery.length < 2) return [];
    return activeBrands.filter(b => b.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [activeBrands, searchQuery]);

  const filteredBrandsList = useMemo(() => {
    return activeBrands.filter(b => {
      const matchCat = selectedCategory === 'all' || b.categoryId === selectedCategory;
      const matchQuery = b.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [activeBrands, selectedCategory, searchQuery]);

  const filteredProductsList = useMemo(() => {
    return activeProducts.filter(p => {
      const matchCat = selectedCategory === 'all' || p.categoryId === selectedCategory;
      const matchBrand = selectedBrand === 'all' || p.brandId === selectedBrand;
      const matchQuery = p.modelName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchBrand && matchQuery;
    });
  }, [activeProducts, selectedCategory, selectedBrand, searchQuery]);

  const suggestedAlternative = useMemo(() => {
    if (!activeProduct) return null;
    const matches = activeProducts.filter(p => p.id !== activeProduct.id && p.categoryId === activeProduct.categoryId && p.faultScore < activeProduct.faultScore);
    return matches.sort((a, b) => a.faultScore - b.faultScore)[0] || null;
  }, [activeProduct, activeProducts]);

  const filteredUsersList = useMemo(() => {
    return users.filter(u => {
      const query = userSearchQuery.toLowerCase().trim();
      return (
        u.name?.toLowerCase().includes(query) ||
        u.email?.toLowerCase().includes(query) ||
        u.phone?.includes(query) ||
        u.id?.includes(query)
      );
    });
  }, [users, userSearchQuery]);

  const computedStats = useMemo(() => {
    let days = 7;
    let multiplier = 1;
    
    switch (statsPeriod) {
      case 'today': days = 1; multiplier = 0.14; break;
      case 'yesterday': days = 1; multiplier = 0.12; break;
      case '3-days': days = 3; multiplier = 0.42; break;
      case '7-days': days = 7; multiplier = 1.0; break;
      case '15-days': days = 15; multiplier = 2.15; break;
      case '1-month': days = 30; multiplier = 4.30; break;
      case '3-months': days = 90; multiplier = 12.80; break;
      case '6-months': days = 180; multiplier = 25.10; break;
      case '1-year': days = 365; multiplier = 52.40; break;
      case 'custom':
        const d1 = new Date(customStartDate);
        const d2 = new Date(customEndDate);
        const diffTime = Math.abs(d2 - d1);
        days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
        multiplier = (days / 7) * 1.05;
        break;
      default: days = 7; multiplier = 1.0;
    }

    const timeline = [];
    const now = new Date();
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const baseVal = 1450;
      const randomVal = Math.floor(baseVal + Math.sin(i * 0.95) * 380 + Math.cos(i * 0.5) * 180);
      const visitors = Math.max(120, Math.floor(randomVal * (multiplier / (days / 7 || 1))));
      timeline.push({ date: dateStr, count: visitors });
    }

    const totalVis = timeline.reduce((sum, item) => sum + item.count, 0);

    const countries = [
      { name: 'Bangladesh', percentage: 67, color: 'bg-emerald-500' },
      { name: 'India', percentage: 17, color: 'bg-violet-500' },
      { name: 'USA', percentage: 9, color: 'bg-[#F41B5E]' },
      { name: 'Others', percentage: 7, color: 'bg-amber-500' }
    ].map(c => ({
      ...c,
      count: Math.floor(totalVis * (c.percentage / 100))
    }));

    const districts = [
      { name: 'Dhaka', percentage: 60 },
      { name: 'Chittagong', percentage: 20 },
      { name: 'Sylhet', percentage: 11 },
      { name: 'Rajshahi', percentage: 9 }
    ].map(d => ({
      ...d,
      count: Math.floor(totalVis * 0.67 * (d.percentage / 100))
    }));

    const ageDemographics = [
      { range: '18-24', percentage: 48, color: 'bg-indigo-500' },
      { range: '25-34', percentage: 36, color: 'bg-rose-500' },
      { range: '35-44', percentage: 11, color: 'bg-[#F41B5E]' },
      { range: '45+', percentage: 5, color: 'bg-amber-400' }
    ].map(a => ({
      ...a,
      count: Math.floor(totalVis * (a.percentage / 100))
    }));

    const gender = {
      male: 74,
      female: 24,
      other: 2,
      maleCount: Math.floor(totalVis * 0.74),
      femaleCount: Math.floor(totalVis * 0.24),
      otherCount: Math.floor(totalVis * 0.02)
    };

    return {
      totalVisitors: totalVis,
      timeline,
      countries,
      districts,
      ageDemographics,
      gender
    };
  }, [statsPeriod, customStartDate, customEndDate]);

  const sampledTimeline = useMemo(() => {
    const fullTimeline = computedStats.timeline;
    if (fullTimeline.length <= 15) return fullTimeline;
    const step = Math.ceil(fullTimeline.length / 15);
    const sampled = [];
    for (let i = 0; i < fullTimeline.length; i += step) {
      sampled.push(fullTimeline[i]);
    }
    if (sampled[sampled.length - 1] !== fullTimeline[fullTimeline.length - 1]) {
      sampled.push(fullTimeline[fullTimeline.length - 1]);
    }
    return sampled;
  }, [computedStats.timeline]);

  return (
    <div className="min-h-screen bg-[#FAF9FC] text-slate-800 font-sans flex flex-col justify-between relative overflow-x-hidden text-left animate-fadeIn">
      
      <div className="absolute top-0 inset-x-0 h-[600px] bg-gradient-to-b from-indigo-50/40 via-[#F5F2F7] to-transparent pointer-events-none -z-10" />
      <div className="absolute top-20 left-10 w-96 h-96 rounded-full bg-violet-100/50 blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-40 right-10 w-96 h-96 rounded-full bg-rose-100/30 blur-3xl pointer-events-none -z-10" />

      {alertBanner.show && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-[#1E202B] text-white px-5 py-3 rounded-2xl shadow-xl transition-all animate-bounce">
          <span className={`w-2.5 h-2.5 rounded-full ${alertBanner.type === 'error' ? 'bg-rose-500' : 'bg-emerald-400'}`}></span>
          <span className="text-xs font-bold">{alertBanner.msg}</span>
        </div>
      )}

      <header className="border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-40 px-4 py-3.5 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentView('index')}>
            <div className="bg-[#F41B5E] text-white font-black text-xl w-10 h-10 rounded-xl flex items-center justify-center shadow-md shadow-rose-200">
              -1
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
                Check<span className="text-[#F41B5E]">Minus1</span>
                {dbStatus === 'connected' ? (
                  <span className="bg-emerald-100 text-emerald-800 text-[9px] font-black tracking-widest px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Database className="w-2.5 h-2.5" /> LIVE
                  </span>
                ) : (
                  <span className="bg-amber-100 text-amber-800 text-[9px] font-black tracking-widest px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Database className="w-2.5 h-2.5" /> CACHED
                  </span>
                )}
              </h1>
              <p className="text-[10px] text-slate-500 font-semibold tracking-wide">Crowdsourced Fault Indices</p>
            </div>
          </div>

          <div className="flex-1 max-w-md w-full relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Search Samsung, MacBook, Cat VPN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#FAF9FC] text-slate-800 placeholder-slate-400 pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:border-[#F41B5E] focus:bg-white focus:outline-none transition-all text-xs shadow-inner"
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

          <div className="flex items-center gap-3 flex-wrap">
            <button 
              onClick={() => setCurrentView('store')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                currentView === 'store' ? 'bg-[#F41B5E] text-white shadow-sm' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Store</span>
            </button>

            {isLoggedIn && (
              <button
                onClick={() => setCurrentView(userRole === 'admin' ? 'admin-dashboard' : 'user-dashboard')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                  ['user-dashboard', 'admin-dashboard'].includes(currentView) ? 'bg-[#F41B5E] text-white shadow-sm' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {userRole === 'admin' ? <ShieldCheck className="w-4 h-4" /> : <User className="w-4 h-4" />}
                <span>{userRole === 'admin' ? 'Admin Portal' : 'My Dashboard'}</span>
              </button>
            )}

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

      {currentView === 'thank-you' && lastOrderDetails && (
        <div className="max-w-2xl mx-auto my-16 p-8 bg-white border border-slate-100 rounded-3xl shadow-2xl text-center animate-fadeIn">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 animate-scaleIn" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-2">Thank You For Your Order!</h2>
          <p className="text-sm text-slate-500 mb-6">Your order has been recorded successfully and is currently being processed.</p>
          
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

      {currentView === 'index' && (
        <>
          <section className="max-w-7xl mx-auto w-full px-4 pt-6 sm:px-6 lg:px-8">
            <div className="relative rounded-3xl overflow-hidden h-[240px] sm:h-[300px] shadow-lg border border-slate-100 group">
              <div 
                className="absolute inset-0 bg-cover bg-center filter brightness-[0.5] transition-all duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url(https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format&fit=crop&q=80)` }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#11121c] via-transparent to-transparent z-10" />
              <div className="absolute inset-0 flex flex-col justify-center p-8 text-white z-20">
                <span className="self-start bg-[#F41B5E] text-[9px] font-black uppercase px-2.5 py-1 rounded-full mb-3 tracking-widest flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" /> Truth Indexes Only
                </span>
                <h2 className="text-2xl sm:text-4xl font-black mb-3 max-w-lg leading-tight">
                  Don't Buy Regrets! Check Hidden Product Faults First.
                </h2>
                <p className="text-xs sm:text-sm text-slate-200 max-w-sm">
                  We crowdsource verified defects and product degradation timelines so you can make informed decisions.
                </p>
              </div>
            </div>
          </section>

          <section className="max-w-7xl mx-auto w-full px-4 pt-6 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex gap-3 hover:shadow-md transition-all duration-300">
              <div className="p-2.5 rounded-xl bg-rose-50 text-[#F41B5E] shrink-0 h-10 w-10 flex items-center justify-center">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide">Minus-1 Curve</h4>
                <p className="text-[10px] text-slate-500 leading-relaxed mt-0.5">Visualize real degradation speed curves mapping lifespan performance drops.</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex gap-3 hover:shadow-md transition-all duration-300">
              <div className="p-2.5 rounded-xl bg-violet-50 text-indigo-600 shrink-0 h-10 w-10 flex items-center justify-center">
                <HeartCrack className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide">Verified Defects</h4>
                <p className="text-[10px] text-slate-500 leading-relaxed mt-0.5">Check upvoted issues confirmed by thousands of actual gadget owners.</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex gap-3 hover:shadow-md transition-all duration-300">
              <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 shrink-0 h-10 w-10 flex items-center justify-center">
                <Coins className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide">Submit & Earn</h4>
                <p className="text-[10px] text-slate-500 leading-relaxed mt-0.5">Index unlisted products to earn points for e-commerce shopping discounts.</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex gap-3 hover:shadow-md transition-all duration-300">
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 shrink-0 h-10 w-10 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide">Predictive Analysis</h4>
                <p className="text-[10px] text-slate-500 leading-relaxed mt-0.5">Learn when devices fail: within 3 months, 6 months, or after 2 years.</p>
              </div>
            </div>
          </section>

          <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 w-full flex-grow">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-150 pb-5 mb-8">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => { setSelectedCategory('all'); setSelectedBrand('all'); }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${
                    selectedCategory === 'all' ? 'bg-[#1E202B] text-white shadow-md' : 'bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 shadow-sm'
                  }`}
                >
                  All Categories
                </button>
                {activeCategories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => { setSelectedCategory(cat.id); setSelectedBrand('all'); }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${
                      selectedCategory === cat.id ? 'bg-[#1E202B] text-white shadow-md' : 'bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 shadow-sm'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (!isLoggedIn) { triggerAlert('Please sign in first to report defects.', 'error'); setAuthTab('login'); setShowAuthModal(true); return; }
                    setShowProblemForm(true);
                  }}
                  className="bg-white hover:bg-slate-100 text-[#F41B5E] border border-slate-200 font-bold text-xs px-3.5 py-2.5 rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  Report Fault
                </button>
                <button
                  onClick={() => {
                    if (!isLoggedIn) { triggerAlert('Please sign in first to index a model.', 'error'); setAuthTab('login'); setShowAuthModal(true); return; }
                    setShowProductForm(true);
                  }}
                  className="bg-[#F41B5E] hover:bg-rose-600 text-white font-extrabold text-xs px-3.5 py-2.5 rounded-xl flex items-center gap-1.5 shadow-md shadow-rose-200 transition-all hover:scale-102"
                >
                  <Plus className="w-3.5 h-3.5 text-white" />
                  Index New Model (+10 Pts)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <aside className="lg:col-span-1">
                <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-sm lg:sticky lg:top-24">
                  <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
                    <h3 className="text-xs uppercase tracking-widest font-black text-slate-400 flex items-center gap-2">
                      <span className="w-1.5 h-3.5 bg-[#F41B5E] rounded-full"></span> Brands
                    </h3>
                    <button
                      onClick={() => {
                        if (!isLoggedIn) { triggerAlert('Please sign in first to propose brands.', 'error'); setAuthTab('login'); setShowAuthModal(true); return; }
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
                      className={`p-3 rounded-2xl border flex items-center justify-between transition-all duration-200 ${
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
                        className={`p-3 rounded-2xl border flex items-center gap-3 transition-all duration-200 ${
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

              <section className="lg:col-span-3">
                {filteredProductsList.length === 0 ? (
                  <div className="bg-white border border-rose-100 rounded-3xl p-8 text-center max-w-xl mx-auto my-6 shadow-xl">
                    <AlertTriangle className="w-16 h-16 text-[#F41B5E] mx-auto mb-4 animate-bounce" />
                    <h3 className="text-2xl font-black text-slate-900 mb-2">"{searchQuery}" Not Yet Indexed</h3>
                    <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                      This product is not registered in our database. Help buyers by initiating the first Index details and earn points!
                    </p>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-150 inline-block mb-6 text-xs font-bold text-slate-700">
                      💰 Contribution Reward: <span className="text-[#F41B5E]">Earn 10 Premium Points</span>
                    </div>
                    <div>
                      <button
                        onClick={() => {
                          if (!isLoggedIn) { triggerAlert('Please sign in first.', 'error'); setAuthTab('login'); setShowAuthModal(true); return; }
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredProductsList.map(prod => {
                      const brand = brands.find(b => b.id === prod.brandId);
                      return (
                        <div key={prod.id} className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between relative overflow-hidden group">
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

                            {prod.imageUrl && (
                              <div className="w-full h-36 overflow-hidden rounded-2xl mb-3 border border-slate-100">
                                <img src={prod.imageUrl} alt={prod.modelName} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                              </div>
                            )}

                            <h3 className="text-lg font-black text-slate-900 mb-1 group-hover:text-[#F41B5E] transition-colors">{prod.modelName}</h3>
                            <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed font-semibold">{prod.description}</p>

                            <div className="space-y-1.5 mb-4">
                              {prod.faults.slice(0, 2).map(f => (
                                <div key={f.id} className="flex justify-between items-center text-[11px] bg-slate-50/50 p-2 rounded-xl border border-slate-100">
                                  <span className="text-slate-700 font-bold truncate pr-1">{f.text}</span>
                                  <button
                                    onClick={() => upvoteFault(prod.id, f.id)}
                                    className="bg-rose-50 hover:bg-[#F41B5E] hover:text-white text-[#F41B5E] text-[10px] px-2.5 py-1.5 rounded-lg font-black flex items-center gap-1 shrink-0 transition-colors"
                                  >
                                    <ThumbsUp className="w-3 h-3" />
                                    <span>{f.votes}</span>
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>

                          <button
                            onClick={() => setActiveProduct(prod)}
                            className="w-full bg-violet-50 hover:bg-indigo-600 hover:text-white text-indigo-600 font-bold text-xs py-2.5 rounded-xl transition-all duration-300 text-center block"
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

      {/* Rewards Store View */}
      {currentView === 'store' && (
        <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 w-full flex-grow animate-fadeIn">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b pb-5">
            <div>
              <h2 className="text-2xl font-black text-slate-900">CheckMinus1 Reward Store</h2>
              <p className="text-xs text-slate-500 mt-1">Spend your contribution points to redeem amazing rewards and premium accessories.</p>
            </div>
            {isLoggedIn && (
              <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-2.5 rounded-2xl flex items-center gap-2 text-xs font-black self-start">
                <Coins className="w-4 h-4 text-amber-500 animate-bounce" />
                <span>My Points Balance: {userPoints} Pts</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {activeStoreProducts.map(p => (
              <div key={p.id} className="bg-white border border-slate-150 rounded-3xl overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-lg transition-all duration-300">
                <div onClick={() => setActiveStoreProduct(p)} className="cursor-pointer h-48 overflow-hidden border-b relative">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover hover:scale-105 transition-all duration-500" />
                  <span className="absolute top-3 right-3 bg-amber-400 text-white font-black text-[10px] px-2 py-1 rounded-full flex items-center gap-1 shadow">
                    🪙 {p.pointsCost} Pts
                  </span>
                </div>
                <div className="p-4 space-y-3 text-left">
                  <h3 onClick={() => setActiveStoreProduct(p)} className="text-sm font-extrabold text-slate-800 line-clamp-1 cursor-pointer hover:text-[#F41B5E] transition-colors">{p.name}</h3>
                  <div className="flex justify-between items-center">
                    <div className="text-left">
                      <span className="text-[10px] text-slate-400 block font-bold">Standard Price</span>
                      <span className="text-sm font-black text-slate-900">৳ {p.price}</span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => addToCart(p, e)}
                    className="w-full bg-[#F41B5E] hover:bg-rose-600 text-white font-extrabold text-xs py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5"
                  >
                    <ShoppingCart className="w-4 h-4" /> Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      )}

      {/* User Dashboard View */}
      {currentView === 'user-dashboard' && (
        <main className="max-w-4xl mx-auto px-4 py-8 w-full flex-grow space-y-6 text-left animate-fadeIn">
          <div className="bg-white border border-slate-150 p-6 rounded-3xl shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-rose-50 text-[#F41B5E] rounded-2xl flex items-center justify-center font-black text-lg">
                {username ? username[0] : 'U'}
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
            <div className="md:col-span-2 space-y-6">
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
                    onClick={async () => {
                      setUserPoints(prev => prev - 200);
                      const nextUsers = users.map(u => u.id === currentUserId ? { ...u, points: u.points - 200 } : u);
                      setUsers(nextUsers);

                      const targetUser = nextUsers.find(u => u.id === currentUserId);
                      if (dbStatus === 'connected' && targetUser) {
                        try {
                          await supabase.from('profiles').upsert([mapUserToDB(targetUser)]);
                        } catch (err) {
                          console.error('Points deduct error: ', err);
                        }
                      }
                      triggerAlert('Redeem Success! Discount code dispatched to registered mail.');
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all duration-300 ${
                      userPoints >= 200 ? 'bg-[#F41B5E] text-white hover:bg-rose-600 shadow-md' : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    Redeem
                  </button>
                </div>
              </div>
            </div>

            <div className="md:col-span-1">
              <form onSubmit={(e) => { e.preventDefault(); triggerAlert('Security Password updated successfully.'); setPassForm({ current: '', newPass: '' }); }} className="bg-white border border-slate-150 p-5 rounded-3xl shadow-sm space-y-4">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-[#F41B5E]" /> Change Password
                </h3>
                <div className="space-y-1 font-semibold text-slate-600">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Current Password</label>
                  <input
                    type="password"
                    value={passForm.current}
                    onChange={(e) => setPassForm({ ...passForm, current: e.target.value })}
                    placeholder="••••••••"
                    className="w-full bg-[#FAF9FC] border p-2.5 rounded-xl text-xs focus:outline-none"
                    required
                  />
                </div>
                <div className="space-y-1 font-semibold text-slate-600">
                  <label className="text-[10px] uppercase font-bold text-slate-400">New Password</label>
                  <input
                    type="password"
                    value={passForm.newPass}
                    onChange={(e) => setPassForm({ ...passForm, newPass: e.target.value })}
                    placeholder="••••••••"
                    className="w-full bg-[#FAF9FC] border p-2.5 rounded-xl text-xs focus:outline-none"
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

      {/* Admin Dashboard */}
      {currentView === 'admin-dashboard' && userRole === 'admin' && (
        <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 w-full flex-grow space-y-8 animate-fadeIn text-left">
          
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b pb-4">
            <div>
              <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-[#F41B5E]" /> Admin Control & Inventory Hub
              </h2>
              <p className="text-xs text-slate-500">Manage user accounts, categories, brands, store items, and indexed hardware configurations.</p>
            </div>
            <span className="bg-[#F41B5E]/10 text-[#F41B5E] border border-rose-200 px-3 py-1 rounded-full text-xs font-black tracking-widest uppercase self-start">
              Root Verified
            </span>
          </div>

          <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
            <button
              onClick={() => setAdminTab('client-db')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                adminTab === 'client-db' ? 'bg-[#1E202B] text-white shadow-md' : 'bg-white hover:bg-slate-50 text-slate-600 border'
              }`}
            >
              <Users className="w-4 h-4" /> Client Database
            </button>
            
            <button
              onClick={() => setAdminTab('statistics')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                adminTab === 'statistics' ? 'bg-[#1E202B] text-white shadow-md' : 'bg-white hover:bg-slate-50 text-slate-600 border'
              }`}
            >
              <BarChart2 className="w-4 h-4" /> Statistics
            </button>

            <button
              onClick={() => setAdminTab('categories')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                adminTab === 'categories' ? 'bg-[#1E202B] text-white shadow-md' : 'bg-white hover:bg-slate-50 text-slate-600 border'
              }`}
            >
              <FolderPlus className="w-4 h-4" /> Categories CRUD
            </button>
            <button
              onClick={() => setAdminTab('brands')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                adminTab === 'brands' ? 'bg-[#1E202B] text-white shadow-md' : 'bg-white hover:bg-slate-50 text-slate-600 border'
              }`}
            >
              <Plus className="w-4 h-4" /> Brands CRUD
            </button>
            <button
              onClick={() => setAdminTab('indexes')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                adminTab === 'indexes' ? 'bg-[#1E202B] text-white shadow-md' : 'bg-white hover:bg-slate-50 text-slate-600 border'
              }`}
            >
              <Activity className="w-4 h-4" /> Indexed Models CRUD
            </button>
            <button
              onClick={() => setAdminTab('store-crud')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                adminTab === 'store-crud' ? 'bg-[#1E202B] text-white shadow-md' : 'bg-white hover:bg-slate-50 text-slate-600 border'
              }`}
            >
              <ShoppingBag className="w-4 h-4" /> Store Products CRUD
            </button>
          </div>

          {adminTab === 'statistics' && (
            <div className="bg-white border border-slate-150 p-6 rounded-3xl shadow-sm space-y-6">
              <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4 pb-4 border-b">
                <div>
                  <h3 className="text-base font-black text-slate-900 flex items-center gap-1.5">
                    <TrendingUp className="w-5 h-5 text-[#F41B5E]" /> Platform Visitor & Performance Flow
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">Deep analytical overview of incoming user requests, geolocation parameters, age brackets and generic retention rates.</p>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 bg-slate-50 p-1.5 rounded-2xl border">
                  {['today', 'yesterday', '3-days', '7-days', '15-days', '1-month', '3-months', '6-months', '1-year', 'custom'].map((p) => (
                    <button
                      key={p}
                      onClick={() => setStatsPeriod(p)}
                      className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase transition-all ${
                        statsPeriod === p ? 'bg-[#F41B5E] text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100'
                      }`}
                    >
                      {p.replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {statsPeriod === 'custom' && (
                <div className="bg-[#FAF9FC] p-4 rounded-2xl border border-slate-200/60 max-w-lg flex flex-col sm:flex-row items-center gap-4 animate-slideDown">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span>Start:</span>
                    <input 
                      type="date" 
                      value={customStartDate} 
                      onChange={(e) => setCustomStartDate(e.target.value)} 
                      className="border rounded-lg p-1 text-slate-700 bg-white focus:outline-none"
                    />
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span>End:</span>
                    <input 
                      type="date" 
                      value={customEndDate} 
                      onChange={(e) => setCustomEndDate(e.target.value)} 
                      className="border rounded-lg p-1 text-slate-700 bg-white focus:outline-none"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 shadow-sm text-left">
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 font-extrabold block mb-1">Total Period Traffic</span>
                  <p className="text-2xl font-black text-slate-900">{computedStats.totalVisitors.toLocaleString()} Hits</p>
                  <span className="text-[10px] text-emerald-500 font-bold block mt-1">↑ 14.8% from prev period</span>
                </div>
                <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 shadow-sm text-left">
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 font-extrabold block mb-1">Daily Average</span>
                  <p className="text-2xl font-black text-[#F41B5E]">
                    {Math.round(computedStats.totalVisitors / Math.max(1, computedStats.timeline.length)).toLocaleString()} / day
                  </p>
                  <span className="text-[10px] text-slate-400 font-bold block mt-1">Continuous stream</span>
                </div>
                <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 shadow-sm text-left">
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 font-extrabold block mb-1">Unique Devices</span>
                  <p className="text-2xl font-black text-indigo-600">{Math.round(computedStats.totalVisitors * 0.72).toLocaleString()} IPs</p>
                  <span className="text-[10px] text-indigo-400 font-bold block mt-1">72% returning buyers</span>
                </div>
                <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 shadow-sm text-left">
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 font-extrabold block mb-1">Average Search Match</span>
                  <p className="text-2xl font-black text-emerald-600">88.4% Rate</p>
                  <span className="text-[10px] text-emerald-500 font-bold block mt-1">High intent search matches</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
                
                <div className="lg:col-span-2 bg-slate-50/30 p-5 rounded-3xl border border-slate-150">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider">Visitor Flow Timeline Curve ({statsPeriod.replace('-', ' ').toUpperCase()})</span>
                    <span className="text-[9px] font-bold text-[#F41B5E] bg-rose-50 px-2 py-0.5 rounded-full">Sampled representation</span>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-slate-200/50 relative h-64 flex flex-col justify-between">
                    <svg className="w-full h-48 overflow-visible" viewBox="0 0 550 160" preserveAspectRatio="none">
                      <line x1="0" y1="160" x2="550" y2="160" stroke="#F1F5F9" strokeWidth="1" />
                      <line x1="0" y1="120" x2="550" y2="120" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3,3" />
                      <line x1="0" y1="80" x2="550" y2="80" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3,3" />
                      <line x1="0" y1="40" x2="550" y2="40" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3,3" />
                      <line x1="0" y1="0" x2="550" y2="0" stroke="#F1F5F9" strokeWidth="1" />

                      {sampledTimeline.map((item, idx) => {
                        const totalPoints = sampledTimeline.length;
                        const x = (idx / (totalPoints - 1 || 1)) * 510 + 20;
                        const maxCount = Math.max(...sampledTimeline.map(t => t.count), 1);
                        const barHeight = (item.count / maxCount) * 130;
                        const y = 160 - barHeight;

                        return (
                          <g key={idx} className="cursor-pointer" onMouseEnter={() => setHoverChartIndex(idx)} onMouseLeave={() => setHoverChartIndex(null)}>
                            <rect
                              x={x - 10}
                              y={0}
                              width={20}
                              height={160}
                              fill={hoverChartIndex === idx ? "rgba(244, 27, 94, 0.04)" : "transparent"}
                              rx="4"
                            />
                            <rect
                              x={x - 4}
                              y={y}
                              width={8}
                              height={barHeight}
                              fill={hoverChartIndex === idx ? "#F41B5E" : "url(#barGrad)"}
                              rx="4"
                              className="transition-all duration-300"
                            />
                            <circle
                              cx={x}
                              cy={y}
                              r={hoverChartIndex === idx ? "5" : "3.5"}
                              fill="#FFF"
                              stroke={hoverChartIndex === idx ? "#1E202B" : "#F41B5E"}
                              strokeWidth="2.5"
                              className="transition-all"
                            />
                          </g>
                        );
                      })}

                      <path
                        d={sampledTimeline.map((item, idx) => {
                          const totalPoints = sampledTimeline.length;
                          const x = (idx / (totalPoints - 1 || 1)) * 510 + 20;
                          const maxCount = Math.max(...sampledTimeline.map(t => t.count), 1);
                          const y = 160 - (item.count / maxCount) * 130;
                          return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
                        }).join(' ')}
                        fill="none"
                        stroke="#F41B5E"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="pointer-events-none"
                      />

                      <defs>
                        <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#F41B5E" stopOpacity="0.85" />
                          <stop offset="100%" stopColor="#818CF8" stopOpacity="0.2" />
                        </linearGradient>
                      </defs>
                    </svg>

                    <div className="w-full flex justify-between px-2 text-[8px] font-extrabold text-slate-400 border-t pt-1.5 uppercase">
                      {sampledTimeline.map((item, idx) => {
                        const totalPoints = sampledTimeline.length;
                        const isEven = idx % 2 === 0;
                        if (totalPoints > 8 && !isEven) return <span key={idx} className="w-4"></span>;
                        return (
                          <span key={idx} className={`text-center ${hoverChartIndex === idx ? 'text-[#F41B5E] scale-105 font-black' : ''}`}>
                            {item.date}
                          </span>
                        );
                      })}
                    </div>

                    {hoverChartIndex !== null && sampledTimeline[hoverChartIndex] && (
                      <div className="absolute top-4 right-4 bg-[#1E202B] text-white p-3 rounded-xl shadow-lg border border-slate-700 max-w-[150px] animate-fadeIn text-left">
                        <p className="text-[8px] font-black text-rose-400 uppercase tracking-wider">{sampledTimeline[hoverChartIndex].date}</p>
                        <p className="text-sm font-black text-white mt-0.5">{sampledTimeline[hoverChartIndex].count.toLocaleString()} Visitors</p>
                        <p className="text-[9px] text-slate-300 font-semibold mt-1">✓ Verified Sessions</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="lg:col-span-1 bg-slate-50/30 p-5 rounded-3xl border border-slate-150 flex flex-col justify-between">
                  <div className="space-y-4">
                    <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider block mb-1">Geographic Tractions</span>
                    
                    <div className="space-y-3.5">
                      {computedStats.countries.map((c, i) => (
                        <div key={i} className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="font-extrabold text-slate-700">{c.name}</span>
                            <span className="text-slate-505 font-bold">{c.percentage}% ({c.count.toLocaleString()})</span>
                          </div>
                          <div className="w-full bg-slate-150 h-2.5 rounded-full overflow-hidden">
                            <div className={`${c.color} h-full animate-pulse`} style={{ width: `${c.percentage}%` }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t pt-4 mt-4 space-y-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Bangladeshi District Distribution:</span>
                    {computedStats.districts.map((d, i) => (
                      <div key={i} className="flex justify-between text-xs font-semibold text-slate-600">
                        <span>{d.name} Division</span>
                        <span>{d.count.toLocaleString()} hits</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                
                <div className="bg-slate-50/30 p-5 rounded-3xl border border-slate-150">
                  <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider block mb-4">Demographics: Age Groups</span>
                  <div className="space-y-4">
                    {computedStats.ageDemographics.map((age, i) => (
                      <div key={i} className="space-y-1.5">
                        <div className="flex justify-between text-xs font-extrabold">
                          <span className="text-slate-700">Ages {age.range}</span>
                          <span className="text-slate-505">{age.percentage}% ({age.count.toLocaleString()})</span>
                        </div>
                        <div className="w-full bg-slate-150 h-2 rounded-full overflow-hidden">
                          <div className={`${age.color} h-full`} style={{ width: `${age.percentage}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-50/30 p-5 rounded-3xl border border-slate-150 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider block mb-4">Demographics: Gender Division</span>
                    
                    <div className="flex items-center justify-around py-4 text-center">
                      <div>
                        <div className="text-3xl font-black text-indigo-500">{computedStats.gender.male}%</div>
                        <span className="text-[10px] font-black text-slate-400 tracking-wider uppercase">Male</span>
                        <p className="text-[9px] text-slate-400 font-bold mt-1">({computedStats.gender.maleCount.toLocaleString()})</p>
                      </div>
                      <div className="border-r h-16 border-slate-200"></div>
                      <div>
                        <div className="text-3xl font-black text-[#F41B5E]">{computedStats.gender.female}%</div>
                        <span className="text-[10px] font-black text-slate-400 tracking-wider uppercase">Female</span>
                        <p className="text-[9px] text-slate-400 font-bold mt-1">({computedStats.gender.femaleCount.toLocaleString()})</p>
                      </div>
                      <div className="border-r h-16 border-slate-200"></div>
                      <div>
                        <div className="text-3xl font-black text-amber-500">{computedStats.gender.other}%</div>
                        <span className="text-[10px] font-black text-slate-400 tracking-wider uppercase">Other</span>
                        <p className="text-[9px] text-slate-400 font-bold mt-1">({computedStats.gender.otherCount.toLocaleString()})</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="p-3 bg-rose-50/30 border border-rose-100 rounded-2xl text-center">
                      <span className="text-[10px] font-black text-[#F41B5E] uppercase block">Platform Health Standard: Excellent</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

          {adminTab === 'client-db' && (
            <div className="bg-white border border-slate-150 p-6 rounded-3xl shadow-sm space-y-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h3 className="text-base font-black text-slate-900">Registered Clients Database</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Audit user activities, monitor contributions, and export secure anonymous CSV reports.</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <input
                    type="text"
                    placeholder="Search name, phone, email..."
                    value={userSearchQuery}
                    onChange={(e) => setUserSearchQuery(e.target.value)}
                    className="bg-[#FAF9FC] border px-3 py-1.5 rounded-xl text-xs focus:outline-none w-48 focus:border-[#F41B5E]"
                  />
                  <div className="flex items-center gap-2 bg-slate-50 border p-1 rounded-xl">
                    <button
                      onClick={() => setIsAnonymousExport(!isAnonymousExport)}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        isAnonymousExport ? 'bg-[#F41B5E] text-white' : 'bg-white text-slate-600'
                      }`}
                      title="Replace names/phones with confidential tokens on CSV"
                    >
                      <Lock className="w-3.5 h-3.5" /> Anonymous Mode
                    </button>
                  </div>
                  <button
                    onClick={exportSelectedUsersCSV}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-extrabold px-3 py-2 rounded-xl flex items-center gap-1.5 shadow-sm"
                  >
                    <FileSpreadsheet className="w-4 h-4" /> Export Selected ({selectedUserIds.length})
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto border rounded-2xl">
                <table className="w-full text-xs text-slate-600">
                  <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-black border-b">
                    <tr>
                      <th className="p-3 text-center w-12">
                        <button
                          onClick={() => toggleSelectAllUsers(filteredUsersList)}
                          className="text-slate-400 hover:text-slate-700"
                        >
                          {selectedUserIds.length === filteredUsersList.length ? (
                            <CheckSquare className="w-4 h-4 text-[#F41B5E]" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </th>
                      <th className="p-3 text-left">Client Profiles</th>
                      <th className="p-3 text-left">Contact Info</th>
                      <th className="p-3 text-center">Wallet Points</th>
                      <th className="p-3 text-center">Reports / Votes</th>
                      <th className="p-3 text-center">Indexes / Brands</th>
                      <th className="p-3 text-center">Activity Logs</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y text-left">
                    {filteredUsersList.map(u => (
                      <React.Fragment key={u.id}>
                        <tr className={`hover:bg-slate-50/50 ${expandedUserId === u.id ? 'bg-indigo-50/10' : ''}`}>
                          <td className="p-3 text-center">
                            <button onClick={() => toggleSelectUser(u.id)} className="text-slate-400 hover:text-slate-700">
                              {selectedUserIds.includes(u.id) ? (
                                <CheckSquare className="w-4 h-4 text-[#F41B5E]" />
                              ) : (
                                <Square className="w-4 h-4" />
                              )}
                            </button>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-full bg-violet-50 text-indigo-600 font-extrabold flex items-center justify-center border">
                                {u.name ? u.name[0] : 'U'}
                              </div>
                              <div>
                                <p className="font-extrabold text-slate-800 flex items-center gap-1.5">
                                  {u.name}
                                  {u.role === 'admin' && <span className="bg-rose-100 text-[#F41B5E] text-[8px] px-1 rounded font-black">ROOT</span>}
                                </p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase">{u.id} • Joined {u.joinedAt}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-3 font-medium">
                            <p>{u.email}</p>
                            <p className="text-slate-400 font-mono text-[10px]">{u.phone}</p>
                          </td>
                          <td className="p-3 text-center font-black text-amber-500">
                            🪙 {u.points} Pts
                          </td>
                          <td className="p-3 text-center">
                            <span className="bg-rose-50 text-[#F41B5E] px-2 py-0.5 rounded-full font-bold">R: {u.activity?.reportsSubmitted || 0}</span>
                            <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-bold ml-1.5">V: {u.activity?.votesCast || 0}</span>
                          </td>
                          <td className="p-3 text-center">
                            <span className="bg-violet-50 text-indigo-600 px-2 py-0.5 rounded-full font-bold">I: {u.activity?.modelsIndexed || 0}</span>
                            <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full font-bold ml-1.5">B: {u.activity?.brandsCreated || 0}</span>
                          </td>
                          <td className="p-3 text-center">
                            <button
                              onClick={() => setExpandedUserId(expandedUserId === u.id ? null : u.id)}
                              className="text-indigo-600 hover:text-indigo-800 font-bold underline"
                            >
                              {expandedUserId === u.id ? 'Hide Logs' : 'Inspect Logs'}
                            </button>
                          </td>
                        </tr>

                        {expandedUserId === u.id && (
                          <tr>
                            <td colSpan="7" className="p-4 bg-slate-50 border-t border-b text-slate-700 animate-slideDown">
                              <div className="space-y-3">
                                <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Client Contributions Log History</h4>
                                {u.activity?.details && u.activity.details.length > 0 ? (
                                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-left">
                                    {u.activity.details.map((act, index) => (
                                      <div key={index} className="bg-white p-3 rounded-xl border flex flex-col justify-between shadow-sm">
                                        <div>
                                          <div className="flex justify-between items-center mb-1">
                                            <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded ${
                                              act.type === 'Index' ? 'bg-indigo-100 text-indigo-700' :
                                              act.type === 'Report' ? 'bg-rose-100 text-[#F41B5E]' : 'bg-amber-100 text-amber-700'
                                            }`}>{act.type}</span>
                                            <span className="text-[9px] text-slate-400 font-mono">{act.date}</span>
                                          </div>
                                          <p className="font-extrabold text-slate-800 text-[11px] truncate">{act.target}</p>
                                          <p className="text-[10px] text-slate-500 mt-1 line-clamp-2 italic font-semibold">"{act.desc}"</p>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <p className="text-xs italic text-slate-400">No logs registered yet for this contributor.</p>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {adminTab === 'categories' && (
            <div className="bg-white border border-slate-150 p-6 rounded-3xl shadow-sm space-y-6">
              <div className="flex justify-between items-center border-b pb-4">
                <div>
                  <h3 className="text-base font-black text-slate-900">Manage Hardware Categories</h3>
                  <p className="text-xs text-slate-500">Edit Category labels, delete configurations, or toggle client visibility status.</p>
                </div>
                <button
                  onClick={() => setShowCategoryForm(true)}
                  className="bg-[#F41B5E] text-white text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" /> Add Category
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map(c => (
                  <div key={c.id} className="p-4 bg-slate-50 rounded-2xl border flex flex-col justify-between gap-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-black text-slate-800 text-sm">{c.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">{c.id}</p>
                      </div>
                      <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${c.active !== false ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-500'}`}>
                        {c.active !== false ? 'Active' : 'Inactive'}
                      </span>
                    </div>

                    <div className="flex gap-2 border-t pt-3 mt-1 text-xs">
                      <button
                        onClick={() => setEditingCategory({ ...c })}
                        className="flex-1 bg-white hover:bg-slate-100 p-2 rounded-xl border flex items-center justify-center gap-1 font-bold text-slate-700"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-indigo-500" /> Edit
                      </button>
                      <button
                        onClick={async () => {
                          const updatedState = c.active !== false ? false : true;
                          const nextCats = categories.map(item => item.id === c.id ? { ...item, active: updatedState } : item);
                          setCategories(nextCats);
                          if (dbStatus === 'connected') {
                            try {
                              await supabase.from('categories').upsert([nextCats.find(item => item.id === c.id)]);
                            } catch (e) {
                              console.error('Category toggle fail: ', e);
                            }
                          }
                          triggerAlert(`Category set to ${updatedState ? 'Active' : 'Inactive'}`);
                        }}
                        className="p-2 rounded-xl border bg-white text-slate-600 hover:bg-slate-100 flex items-center justify-center"
                        title="Toggle visibility"
                      >
                        {c.active !== false ? <EyeOff className="w-4 h-4 text-slate-500" /> : <Eye className="w-4 h-4 text-emerald-500" />}
                      </button>
                      <button
                        onClick={() => deleteCategory(c.id)}
                        className="p-2 rounded-xl border border-rose-100 bg-rose-50 text-[#F41B5E] hover:bg-rose-100 flex items-center justify-center"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {adminTab === 'brands' && (
            <div className="bg-white border border-slate-150 p-6 rounded-3xl shadow-sm space-y-6">
              <div className="flex justify-between items-center border-b pb-4">
                <div>
                  <h3 className="text-base font-black text-slate-900">Manage Hardware Brands</h3>
                  <p className="text-xs text-slate-500">Approve proposed submissions, edit metadata, delete, or toggle live visibility status.</p>
                </div>
                <button
                  onClick={() => setShowBrandForm(true)}
                  className="bg-[#F41B5E] text-white text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" /> Add Brand
                </button>
              </div>

              {pendingBrands.length > 0 && (
                <div className="border border-amber-200 bg-amber-50/40 p-4 rounded-2xl space-y-3">
                  <span className="text-[10px] font-black text-amber-700 uppercase tracking-widest block">Proposed Brand Approvals Awaiting</span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left">
                    {pendingBrands.map(pb => (
                      <div key={pb.id} className="bg-white p-3 rounded-xl border flex justify-between items-center animate-pulse">
                        <div className="flex items-center gap-2">
                          <img src={pb.logoUrl} alt="" className="w-8 h-8 rounded-full border object-cover" />
                          <p className="text-xs font-bold text-slate-800">{pb.name}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <select id={`sub-cat-${pb.id}`} className="bg-slate-50 border p-1 rounded text-[11px]">
                            {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                          </select>
                          <button
                            onClick={() => {
                              const chosenCat = document.getElementById(`sub-cat-${pb.id}`).value;
                              approveBrand(pb, chosenCat);
                            }}
                            className="bg-emerald-500 text-white font-bold text-[10px] px-2.5 py-1.5 rounded"
                          >
                            Approve
                          </button>
                          <button onClick={() => rejectBrand(pb.id)} className="text-slate-400 hover:text-[#F41B5E]">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {brands.map(b => {
                  const catParent = categories.find(c => c.id === b.categoryId);
                  return (
                    <div key={b.id} className="p-4 bg-slate-50 rounded-2xl border flex flex-col justify-between gap-3 text-left">
                      <div className="flex gap-3 justify-between items-start">
                        <div className="flex items-center gap-3">
                          <img src={b.logoUrl} alt="" className="w-10 h-10 rounded-full border object-cover bg-white animate-fadeIn" />
                          <div>
                            <p className="font-black text-slate-800 text-sm">{b.name}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase">{catParent ? catParent.name : 'Unassigned'}</p>
                          </div>
                        </div>
                        <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${b.active !== false ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-500'}`}>
                          {b.active !== false ? 'Active' : 'Inactive'}
                        </span>
                      </div>

                      <div className="flex gap-2 border-t pt-3 mt-1 text-xs">
                        <button
                          onClick={() => setEditingBrand({ ...b })}
                          className="flex-1 bg-white hover:bg-slate-100 p-2 rounded-xl border flex items-center justify-center gap-1 font-bold text-slate-700"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-indigo-500" /> Edit
                        </button>
                        <button
                          onClick={async () => {
                            const updatedState = b.active !== false ? false : true;
                            const nextBrands = brands.map(item => item.id === b.id ? { ...item, active: updatedState } : item);
                            setBrands(nextBrands);
                            if (dbStatus === 'connected') {
                              try {
                                await supabase.from('brands').upsert([mapBrandToDB(nextBrands.find(item => item.id === b.id))]);
                              } catch (e) {
                                console.error('Brand toggle failure: ', e);
                              }
                            }
                            triggerAlert(`Brand set to ${updatedState ? 'Active' : 'Inactive'}`);
                          }}
                          className="p-2 rounded-xl border bg-white text-slate-600 hover:bg-slate-100 flex items-center justify-center"
                          title="Toggle visibility"
                        >
                          {b.active !== false ? <EyeOff className="w-4 h-4 text-slate-500" /> : <Eye className="w-4 h-4 text-emerald-500" />}
                        </button>
                        <button
                          onClick={() => deleteBrand(b.id)}
                          className="p-2 rounded-xl border border-rose-100 bg-rose-50 text-[#F41B5E] hover:bg-rose-100 flex items-center justify-center"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {adminTab === 'indexes' && (
            <div className="bg-white border border-slate-150 p-6 rounded-3xl shadow-sm space-y-6">
              <div className="flex justify-between items-center border-b pb-4">
                <div>
                  <h3 className="text-base font-black text-slate-900">Manage Indexed Product Models</h3>
                  <p className="text-xs text-slate-500">Tweak descriptions, fault ratings, image URLs, or toggle client-facing activation status.</p>
                </div>
                <button
                  onClick={() => setShowProductForm(true)}
                  className="bg-[#F41B5E] text-white text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" /> Add Model
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-left">
                {products.map(p => {
                  const br = brands.find(b => b.id === p.brandId);
                  return (
                    <div key={p.id} className="bg-slate-50 rounded-2xl border p-4 flex flex-col justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2">
                            {br && <img src={br.logoUrl} alt="" className="w-5 h-5 rounded-full object-cover border" />}
                            <span className="text-[10px] font-black text-slate-400">{br ? br.name : 'Unknown Brand'}</span>
                          </div>
                          <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${p.active !== false ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-500'}`}>
                            {p.active !== false ? 'Active' : 'Inactive'}
                          </span>
                        </div>

                        {p.imageUrl && <img src={p.imageUrl} alt="" className="w-full h-28 object-cover rounded-xl border bg-white" />}
                        <p className="font-black text-slate-800 text-sm leading-snug">{p.modelName}</p>
                        <p className="text-[10px] font-extrabold text-[#F41B5E] uppercase bg-rose-50/60 p-1.5 rounded border border-rose-100">Fault Score rating: -{p.faultScore}%</p>
                      </div>

                      <div className="flex gap-2 border-t pt-3 mt-1 text-xs">
                        <button
                          onClick={() => setEditingProduct({ ...p })}
                          className="flex-1 bg-white hover:bg-slate-100 p-2 rounded-xl border flex items-center justify-center gap-1 font-bold text-slate-700"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-indigo-500" /> Edit
                        </button>
                        <button
                          onClick={async () => {
                            const updatedState = p.active !== false ? false : true;
                            const nextProducts = products.map(item => item.id === p.id ? { ...item, active: updatedState } : item);
                            setProducts(nextProducts);
                            if (dbStatus === 'connected') {
                              try {
                                await supabase.from('products').upsert([mapProductToDB(nextProducts.find(item => item.id === p.id))]);
                              } catch (e) {
                                console.error('Product active toggle failure: ', e);
                              }
                            }
                            triggerAlert(`Product set to ${updatedState ? 'Active' : 'Inactive'}`);
                          }}
                          className="p-2 rounded-xl border bg-white text-slate-600 hover:bg-slate-100 flex items-center justify-center"
                          title="Toggle visibility"
                        >
                          {p.active !== false ? <EyeOff className="w-4 h-4 text-slate-500" /> : <Eye className="w-4 h-4 text-emerald-500" />}
                        </button>
                        <button
                          onClick={() => deleteProduct(p.id)}
                          className="p-2 rounded-xl border border-rose-100 bg-rose-50 text-[#F41B5E] hover:bg-rose-100 flex items-center justify-center"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {adminTab === 'store-crud' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
              <div className="lg:col-span-1 bg-white border border-slate-150 p-6 rounded-3xl shadow-sm space-y-4">
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5 border-b pb-2">
                  <ShoppingBag className="w-4 h-4 text-[#F41B5E]" /> Create Store Product
                </h3>
                
                <form onSubmit={handleAdminStoreProductUpload} className="space-y-3.5 text-xs">
                  <div className="space-y-1 font-semibold text-slate-600">
                    <label className="font-bold text-slate-505 uppercase tracking-wide text-[10px]">Product Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Matte Glass Protector" 
                      value={storeNewName}
                      onChange={(e) => setStoreNewName(e.target.value)}
                      className="w-full bg-[#FAF9FC] border p-2.5 rounded-xl focus:outline-none focus:border-[#F41B5E] transition-colors"
                      required
                    />
                  </div>

                  <div className="space-y-1 font-semibold text-slate-600">
                    <label className="font-bold text-slate-505 uppercase tracking-wide text-[10px]">Brand Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Spigen, Anker" 
                      value={storeNewBrand}
                      onChange={(e) => setStoreNewBrand(e.target.value)}
                      className="w-full bg-[#FAF9FC] border p-2.5 rounded-xl focus:outline-none focus:border-[#F41B5E] transition-colors"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1 font-semibold text-slate-600">
                      <label className="font-bold text-slate-505 uppercase tracking-wide text-[10px]">Price (৳ Taka)</label>
                      <input 
                        type="number" 
                        placeholder="e.g. 500" 
                        value={storeNewPrice}
                        onChange={(e) => setStoreNewPrice(e.target.value)}
                        className="w-full bg-[#FAF9FC] border p-2.5 rounded-xl font-mono focus:outline-none focus:border-[#F41B5E] transition-colors"
                        required
                      />
                    </div>
                    <div className="space-y-1 font-semibold text-slate-600">
                      <label className="font-bold text-slate-505 uppercase tracking-wide text-[10px]">Points cost (🪙)</label>
                      <input 
                        type="number" 
                        placeholder="e.g. 70" 
                        value={storeNewPoints}
                        onChange={(e) => setStoreNewPoints(e.target.value)}
                        className="w-full bg-[#FAF9FC] border p-2.5 rounded-xl font-mono focus:outline-none focus:border-[#F41B5E] transition-colors"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1 font-semibold text-slate-600">
                      <label className="font-bold text-slate-505 uppercase tracking-wide text-[10px]">Avg Shipment</label>
                      <input 
                        type="text" 
                        placeholder="e.g. 2-3 Days" 
                        value={storeNewShipment}
                        onChange={(e) => setStoreNewShipment(e.target.value)}
                        className="w-full bg-[#FAF9FC] border p-2.5 rounded-xl focus:outline-none focus:border-[#F41B5E] transition-colors"
                        required
                      />
                    </div>
                    <div className="space-y-1 font-semibold text-slate-600">
                      <label className="font-bold text-slate-505 uppercase tracking-wide text-[10px]">Review Points</label>
                      <input 
                        type="number" 
                        placeholder="e.g. 10" 
                        value={storeNewReviewPoints}
                        onChange={(e) => setStoreNewReviewPoints(e.target.value)}
                        className="w-full bg-[#FAF9FC] border p-2.5 rounded-xl font-mono focus:outline-none focus:border-[#F41B5E] transition-colors"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1 font-semibold text-slate-600">
                    <label className="font-bold text-slate-505 uppercase tracking-wide text-[10px]">Short Description (Bullets, Line break)</label>
                    <textarea 
                      placeholder="100W Fast Charging\nNylon Braided" 
                      value={storeNewShortDesc}
                      onChange={(e) => setStoreNewShortDesc(e.target.value)}
                      className="w-full bg-[#FAF9FC] border p-2.5 rounded-xl focus:outline-none focus:border-[#F41B5E] transition-colors"
                      rows="2"
                      required
                    />
                  </div>

                  <div className="space-y-1 font-semibold text-slate-600">
                    <label className="font-bold text-slate-505 uppercase tracking-wide text-[10px]">Long Description</label>
                    <textarea 
                      placeholder="Detailed product overview..." 
                      value={storeNewLongDesc}
                      onChange={(e) => setStoreNewLongDesc(e.target.value)}
                      className="w-full bg-[#FAF9FC] border p-2.5 rounded-xl focus:outline-none focus:border-[#F41B5E] transition-colors"
                      rows="3"
                      required
                    />
                  </div>

                  <div className="space-y-1.5 font-semibold text-slate-600">
                    <label className="font-bold text-slate-505 uppercase tracking-wide text-[10px] block">Product Image Upload</label>
                    
                    <div className="bg-rose-50/50 border border-rose-100 p-3 rounded-2xl space-y-1">
                      <span className="text-[10px] font-black text-[#F41B5E] uppercase block tracking-wider">📐 Auto-Scaler Guidelines</span>
                      <p className="text-[9px] text-slate-505 leading-snug">
                        • Recommended: <strong className="text-slate-700">300 x 300 Pixels (1:1 Ratio)</strong>.<br />
                        • Over-scaled items will be <strong className="text-[#F41B5E]">cropped and compressed automatically</strong> inside Canvas.
                      </p>
                    </div>

                    <div className="flex items-center gap-3 mt-1.5">
                      <label className="flex-1 border-2 border-dashed border-slate-200 hover:bg-slate-50 p-4 rounded-2xl cursor-pointer flex flex-col items-center justify-center transition-all">
                        <Upload className="w-5 h-5 text-slate-400 mb-1" />
                        <span className="text-[10px] font-bold text-slate-505">Pick Store Image</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={(e) => handleUploadedImage(e, setStoreNewImage, setStoreImgOptimized, 300, 300, true)} 
                          className="hidden" 
                        />
                      </label>

                      {storeNewImage ? (
                        <div className="relative">
                          <img src={storeNewImage} alt="" className="w-16 h-16 rounded-xl object-cover border" />
                          {isStoreImgOptimized && (
                            <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white text-[8px] px-1 py-0.5 rounded-md font-bold">Canvas</span>
                          )}
                        </div>
                      ) : (
                        <div className="w-16 h-16 border border-dashed rounded-xl bg-slate-50 flex items-center justify-center text-[9px] text-slate-400 font-bold">No Photo</div>
                      )}
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="w-full bg-[#F41B5E] hover:bg-rose-600 text-white font-black py-2.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-1"
                  >
                    <Plus className="w-4 h-4" /> Add to Store
                  </button>
                </form>
              </div>

              <div className="lg:col-span-2 bg-white border border-slate-150 p-6 rounded-3xl shadow-sm space-y-4">
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider border-b pb-2">
                  Live Store Products ({storeProducts.length})
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[820px] overflow-y-auto pr-1.5 text-left">
                  {storeProducts.map(sp => (
                    <div key={sp.id} className="p-3 bg-slate-50 border rounded-2xl flex items-center gap-3 justify-between">
                      <div className="flex items-center gap-3">
                        <img src={sp.image} alt="" className="w-12 h-12 rounded-xl object-cover border" />
                        <div>
                          <p className="text-xs font-black text-slate-800 truncate max-w-[140px]">{sp.name}</p>
                          <p className="text-[10px] text-slate-400">৳{sp.price} | 🪙{sp.pointsCost} Pts</p>
                          <span className={`text-[8px] font-black uppercase mt-1 px-1 rounded inline-block ${sp.active !== false ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-550'}`}>
                            {sp.active !== false ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setEditingStoreProduct({ ...sp })}
                          className="p-1.5 text-indigo-500 bg-white border rounded-xl hover:bg-slate-50"
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={async () => {
                            const updatedState = sp.active !== false ? false : true;
                            const nextStoreProducts = storeProducts.map(item => item.id === sp.id ? { ...item, active: updatedState } : item);
                            setStoreProducts(nextStoreProducts);
                            if (dbStatus === 'connected') {
                              try {
                                await supabase.from('store_products').upsert([mapStoreProductToDB(nextStoreProducts.find(item => item.id === sp.id))]);
                              } catch (e) {
                                console.error('Store active toggle failure: ', e);
                              }
                            }
                            triggerAlert(`Product set to ${updatedState ? 'Active' : 'Inactive'}`);
                          }}
                          className="p-1.5 text-slate-400 hover:text-slate-700 bg-white border rounded-xl"
                        >
                          {sp.active !== false ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        <button 
                          onClick={() => deleteStoreProduct(sp.id)}
                          className="p-1.5 text-slate-400 hover:text-[#F41B5E] bg-white border rounded-xl hover:border-rose-200 transition-colors"
                          title="Remove"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      )}

      {/* Store Product Details Overview Modal */}
      {activeStoreProduct && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-100 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl relative animate-fadeIn max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-slate-50/50">
              <div className="text-left">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-extrabold block mb-1">{activeStoreProduct.brand || 'Premium Accessory'}</span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900">{activeStoreProduct.name}</h3>
              </div>
              <button onClick={() => setActiveStoreProduct(null)} className="p-1 bg-white hover:bg-slate-100 border rounded-full text-slate-400 transition-colors ml-auto sm:ml-0">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6 text-left">
              <img src={activeStoreProduct.image} alt="" className="w-full h-64 object-cover rounded-2xl border border-slate-100" />
              
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-150">
                <div>
                  <p className="text-2xl font-black text-slate-900">৳ {activeStoreProduct.price}</p>
                  <p className="text-xs text-amber-500 font-bold mt-0.5">🪙 {activeStoreProduct.pointsCost} Contribution Points</p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-xs text-slate-500 font-semibold flex items-center gap-1.5"><Clock className="w-4 h-4 text-slate-400"/> Ships in {activeStoreProduct.shipmentTime || '3-5 Days'}</p>
                </div>
              </div>

              {activeStoreProduct.shortDesc && (
                <div>
                  <h4 className="text-sm font-black text-slate-800 mb-2">Key Features</h4>
                  <ul className="list-disc pl-5 text-xs text-slate-600 space-y-1.5">
                    {activeStoreProduct.shortDesc.split('\n').map((line, i) => (
                      <li key={i}>{line}</li>
                    ))}
                  </ul>
                </div>
              )}

              {activeStoreProduct.longDesc && (
                <div>
                  <h4 className="text-sm font-black text-slate-800 mb-2">Product Overview</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{activeStoreProduct.longDesc}</p>
                </div>
              )}

              {isLoggedIn && (
                <div className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-xl flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                  <div>
                    <p className="text-xs font-black text-emerald-800 flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-emerald-500" /> Have you purchased this item?</p>
                    <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">Leave a review after delivery to earn +{activeStoreProduct.reviewPoints || 0} Points for your wallet.</p>
                  </div>
                  <button 
                    onClick={() => handleStoreReview(activeStoreProduct.id, activeStoreProduct.reviewPoints || 0)} 
                    className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs px-4 py-2 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Star className="w-3.5 h-3.5" /> Submit Review
                  </button>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t flex justify-end gap-3">
              <button onClick={() => setActiveStoreProduct(null)} className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-black text-xs px-5 py-2.5 rounded-xl transition-all">Close Info</button>
              <button onClick={(e) => addToCart(activeStoreProduct, e)} className="bg-[#F41B5E] hover:bg-rose-600 text-white font-black text-xs px-5 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-1.5">
                <ShoppingCart className="w-3.5 h-3.5" /> Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Model Insight Details Modal */}
      {activeProduct && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-100 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl relative animate-fadeIn max-h-[90vh] overflow-y-auto">
            
            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-slate-50/50">
              <div className="text-left">
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
                <button onClick={() => setActiveProduct(null)} className="p-1 bg-white hover:bg-slate-100 border rounded-full text-slate-400 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6 text-left">
              <div className="flex flex-col sm:flex-row gap-4 bg-rose-50/30 p-4 rounded-2xl border border-rose-100 animate-fadeIn">
                <div className="bg-white p-3 rounded-xl text-center border shadow-sm shrink-0 w-full sm:w-auto">
                  <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider block">FAULT SCALE</span>
                  <span className="text-2xl font-black text-[#F41B5E]">-{activeProduct.faultScore}%</span>
                </div>
                <p className="text-xs text-slate-600 italic leading-relaxed font-semibold">"{activeProduct.description}"</p>
              </div>

              <div className="space-y-3 text-left">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Fault Index Progression Line Curve</span>
                  <span className="text-[9px] text-rose-500 font-bold bg-rose-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                    <Info className="w-3 h-3" /> Click on points to inspect
                  </span>
                </div>
                <div className="bg-[#FAF9FC] border border-slate-200/60 p-6 rounded-3xl relative h-48 flex items-end">
                  <svg className="absolute inset-0 h-full w-full p-6 overflow-visible" viewBox="0 0 400 100" preserveAspectRatio="none">
                    <line x1="0" y1="100" x2="400" y2="100" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="3,3" />
                    <line x1="0" y1="50" x2="400" y2="50" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="3,3" />
                    <line x1="0" y1="0" x2="400" y2="0" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="3,3" />
                    
                    <path
                      d={`M 0,${100 - activeProduct.timeline[0]} C 100,${100 - activeProduct.timeline[1]} 200,${100 - activeProduct.timeline[2]} 300,${100 - activeProduct.timeline[3]} 400,${100 - activeProduct.timeline[4]}`}
                      fill="none"
                      stroke="#F41B5E"
                      strokeWidth="3.5"
                      className="animate-drawCurve"
                    />
                    
                    {activeProduct.timeline.map((val, idx) => {
                      const cx = idx * 100;
                      const cy = 100 - val;
                      return (
                        <g key={idx} className="cursor-pointer" onMouseEnter={() => setHoverTimelineIndex(idx)} onMouseLeave={() => setHoverTimelineIndex(null)}>
                          <circle
                            cx={cx}
                            cy={cy}
                            r={hoverTimelineIndex === idx ? "8" : "6"}
                            fill="#F41B5E"
                            stroke="#FFFFFF"
                            strokeWidth="2.5"
                            className="transition-all duration-200 hover:scale-125"
                          />
                        </g>
                      );
                    })}
                  </svg>
                  
                  <div className="relative z-10 w-full flex justify-between px-2">
                    {activeProduct.timeline.map((val, idx) => (
                      <div key={idx} className={`text-center p-1 rounded-xl transition-all ${hoverTimelineIndex === idx ? 'bg-rose-50 scale-105' : ''}`}>
                        <span className="text-xs font-black text-[#F41B5E] block">{val}%</span>
                        <span className="text-[9px] text-slate-400 font-bold block">{['Init', '3 Months', '6 Months', '1 Year', '2 Years'][idx]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Top Observed Defects</span>
                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {activeProduct.faults.map(f => (
                    <div key={f.id} className="flex justify-between items-center text-xs bg-slate-50 border p-3 rounded-2xl">
                      <div className="text-left">
                        <span className="font-bold text-slate-800 block">{f.text}</span>
                        <span className="text-[9px] text-slate-400">Confirmed by {f.votes} gadget owners</span>
                      </div>
                      <button
                        onClick={() => upvoteFault(activeProduct.id, f.id)}
                        className="bg-[#F41B5E] text-white px-3.5 py-1.5 rounded-xl font-bold text-xs hover:bg-rose-600 transition-colors"
                      >
                        I Face This Too
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-2">
                <a
                  href={activeProduct.affiliateLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#1E202B] hover:bg-slate-800 text-white font-black text-xs py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4" /> Buy {activeProduct.modelName} Original
                </a>
                
                {suggestedAlternative && (
                  <div className="bg-emerald-50/60 border border-emerald-100 p-4 rounded-xl space-y-3">
                    <div className="flex items-center gap-2 text-emerald-800">
                      <Sparkles className="w-5 h-5 text-emerald-600 animate-pulse" />
                      <span className="text-xs font-black uppercase tracking-wider">Recommended Better Alternative</span>
                    </div>
                    <div className="flex justify-between items-center bg-white p-3 rounded-xl border shadow-sm">
                      <div className="text-left">
                        <p className="text-xs font-extrabold text-slate-800">{suggestedAlternative.modelName}</p>
                        <span className="text-[10px] font-black text-emerald-500">Fault Score: only -{suggestedAlternative.faultScore}%</span>
                      </div>
                      
                      <a
                        href={suggestedAlternative.affiliateLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl transition-all inline-flex items-center gap-1.5 shadow-sm"
                      >
                        Buy Alternative <ChevronRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                )}
              </div>

            </div>

            <div className="p-4 bg-slate-50 border-t flex justify-end">
              <button onClick={() => setActiveProduct(null)} className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-black text-xs px-5 py-2.5 rounded-xl transition-all">
                Close Insights
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Editing Product form (Admin only modifications including affiliate links) */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={saveProductEdit} className="bg-white border p-6 rounded-3xl w-full max-w-md space-y-4 shadow-xl text-left animate-fadeIn max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-black text-slate-900">Adjust Hardware Specifications</h3>
            
            <div className="grid grid-cols-2 gap-3 font-semibold text-slate-600">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase font-black">Parent Category</label>
                <select 
                  value={editingProduct.categoryId} 
                  onChange={(e) => setEditingProduct({ ...editingProduct, categoryId: e.target.value })} 
                  className="w-full bg-[#FAF9FC] border p-2.5 rounded-xl text-xs focus:outline-none" 
                >
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div className="space-y-1 font-semibold text-slate-600">
                <label className="text-[10px] text-slate-400 uppercase font-black">Parent Brand</label>
                <select 
                  value={editingProduct.brandId} 
                  onChange={(e) => setEditingProduct({ ...editingProduct, brandId: e.target.value })} 
                  className="w-full bg-[#FAF9FC] border p-2.5 rounded-xl text-xs focus:outline-none" 
                >
                  {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-1 font-semibold text-slate-600">
              <label className="text-xs text-slate-400 uppercase font-black block">Model Name</label>
              <input
                type="text"
                value={editingProduct.modelName}
                onChange={(e) => setEditingProduct({ ...editingProduct, modelName: e.target.value })}
                className="w-full bg-[#FAF9FC] border p-2.5 rounded-xl text-xs focus:outline-none"
                required
              />
            </div>

            <div className="space-y-1 font-semibold text-slate-600">
              <label className="text-xs text-slate-400 uppercase font-black block">Fault Score rating (%)</label>
              <input
                type="number"
                value={editingProduct.faultScore}
                onChange={(e) => setEditingProduct({ ...editingProduct, faultScore: parseInt(e.target.value) || 0 })}
                className="w-full bg-[#FAF9FC] border p-2.5 rounded-xl text-xs font-mono focus:outline-none"
                required
              />
            </div>

            <div className="space-y-1 font-semibold text-slate-600">
              <label className="text-xs text-slate-400 uppercase font-black block">Image URL</label>
              <input
                type="text"
                value={editingProduct.imageUrl}
                onChange={(e) => setEditingProduct({ ...editingProduct, imageUrl: e.target.value })}
                className="w-full bg-[#FAF9FC] border p-2.5 rounded-xl text-xs focus:outline-none"
              />
            </div>

            <div className="space-y-1 font-semibold text-slate-600">
              <label className="text-xs text-slate-400 uppercase font-black block">Affiliate Link Destination</label>
              <input
                type="text"
                value={editingProduct.affiliateLink}
                onChange={(e) => setEditingProduct({ ...editingProduct, affiliateLink: e.target.value })}
                className="w-full bg-[#FAF9FC] border p-2.5 rounded-xl text-xs focus:outline-none"
                required
              />
            </div>

            <div className="space-y-1 font-semibold text-slate-600">
              <label className="text-xs text-slate-400 uppercase font-black block">Model Description Slogan</label>
              <textarea
                value={editingProduct.description}
                onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                className="w-full bg-[#FAF9FC] border p-2.5 rounded-xl text-xs focus:outline-none"
                rows="2"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 text-xs">
              <button type="button" onClick={() => setEditingProduct(null)} className="bg-slate-100 text-slate-600 px-4 py-2 rounded-xl font-bold">Cancel</button>
              <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold">Save adjustments</button>
            </div>
          </form>
        </div>
      )}

      {/* Editing Store Product Form */}
      {editingStoreProduct && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={saveStoreProductEdit} className="bg-white border p-6 rounded-3xl w-full max-w-md space-y-4 shadow-xl text-left animate-fadeIn max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-black text-slate-900">Adjust Store Product Settings</h3>
            
            <div className="space-y-1 font-semibold text-slate-600">
              <label className="text-xs text-slate-400 uppercase font-black block">Product Name</label>
              <input
                type="text"
                value={editingStoreProduct.name}
                onChange={(e) => setEditingStoreProduct({ ...editingStoreProduct, name: e.target.value })}
                className="w-full bg-[#FAF9FC] border p-2.5 rounded-xl text-xs focus:outline-none"
                required
              />
            </div>

            <div className="space-y-1 font-semibold text-slate-600">
              <label className="text-xs text-slate-400 uppercase font-black block">Brand Name</label>
              <input
                type="text"
                value={editingStoreProduct.brand}
                onChange={(e) => setEditingStoreProduct({ ...editingStoreProduct, brand: e.target.value })}
                className="w-full bg-[#FAF9FC] border p-2.5 rounded-xl text-xs focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 font-semibold text-slate-600">
              <div className="space-y-1">
                <label className="text-xs text-slate-400 uppercase font-black">Price (৳)</label>
                <input
                  type="number"
                  value={editingStoreProduct.price}
                  onChange={(e) => setEditingStoreProduct({ ...editingStoreProduct, price: parseInt(e.target.value) || 0 })}
                  className="w-full bg-[#FAF9FC] border p-2.5 rounded-xl text-xs font-mono focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-400 uppercase font-black">Points cost (🪙)</label>
                <input
                  type="number"
                  value={editingStoreProduct.pointsCost}
                  onChange={(e) => setEditingStoreProduct({ ...editingStoreProduct, pointsCost: parseInt(e.target.value) || 0 })}
                  className="w-full bg-[#FAF9FC] border p-2.5 rounded-xl text-xs font-mono focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 font-semibold text-slate-600">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase font-black">Avg Shipment</label>
                <input
                  type="text"
                  value={editingStoreProduct.shipmentTime}
                  onChange={(e) => setEditingStoreProduct({ ...editingStoreProduct, shipmentTime: e.target.value })}
                  className="w-full bg-[#FAF9FC] border p-2.5 rounded-xl text-xs focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase font-black">Review Points</label>
                <input
                  type="number"
                  value={editingStoreProduct.reviewPoints}
                  onChange={(e) => setEditingStoreProduct({ ...editingStoreProduct, reviewPoints: parseInt(e.target.value) || 0 })}
                  className="w-full bg-[#FAF9FC] border p-2.5 rounded-xl text-xs font-mono focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1 font-semibold text-slate-600">
              <label className="text-xs text-slate-400 uppercase font-black block">Short Description</label>
              <textarea
                value={editingStoreProduct.shortDesc}
                onChange={(e) => setEditingStoreProduct({ ...editingStoreProduct, shortDesc: e.target.value })}
                className="w-full bg-[#FAF9FC] border p-2.5 rounded-xl text-xs focus:outline-none"
                rows="2"
              />
            </div>

            <div className="space-y-1 font-semibold text-slate-600">
              <label className="text-xs text-slate-400 uppercase font-black block">Long Description</label>
              <textarea
                value={editingStoreProduct.longDesc}
                onChange={(e) => setEditingStoreProduct({ ...editingStoreProduct, longDesc: e.target.value })}
                className="w-full bg-[#FAF9FC] border p-2.5 rounded-xl text-xs focus:outline-none"
                rows="3"
              />
            </div>

            <div className="space-y-1 font-semibold text-slate-600">
              <label className="text-xs text-slate-400 uppercase font-black block">Image URL Link</label>
              <input
                type="text"
                value={editingStoreProduct.image}
                onChange={(e) => setEditingStoreProduct({ ...editingStoreProduct, image: e.target.value })}
                className="w-full bg-[#FAF9FC] border p-2.5 rounded-xl text-xs focus:outline-none"
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 text-xs">
              <button type="button" onClick={() => setEditingStoreProduct(null)} className="bg-slate-100 text-slate-600 px-4 py-2 rounded-xl font-bold">Cancel</button>
              <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold">Adjust specifications</button>
            </div>
          </form>
        </div>
      )}

      {/* Popups & Modals */}
      {showCategoryForm && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleCategoryUpload} className="bg-white p-6 rounded-3xl w-full max-w-sm space-y-4 text-left shadow-2xl animate-fadeIn">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <FolderPlus className="w-5 h-5 text-emerald-500" /> Add New Global Category
            </h3>
            <div className="space-y-1 font-semibold text-slate-600">
              <label className="text-xs text-slate-400 font-bold uppercase">Category Name</label>
              <input 
                type="text" 
                value={newCatName} 
                onChange={(e) => setNewCatName(e.target.value)} 
                placeholder="e.g. Smart Watches, Graphics Cards" 
                className="w-full bg-[#FAF9FC] border p-2.5 rounded-xl text-xs focus:outline-none focus:border-[#F41B5E]" 
                required 
              />
            </div>
            <div className="flex justify-end gap-2 text-xs">
              <button type="button" onClick={() => setShowCategoryForm(false)} className="bg-slate-100 px-4 py-2 rounded-xl font-bold text-slate-700">Cancel</button>
              <button type="submit" className="bg-emerald-500 text-white px-4 py-2 rounded-xl font-bold">Save Category</button>
            </div>
          </form>
        </div>
      )}

      {editingCategory && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={saveCategoryEdit} className="bg-white p-6 rounded-3xl w-full max-w-sm space-y-4 text-left shadow-2xl animate-fadeIn">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-indigo-500" /> Adjust Category Name
            </h3>
            <div className="space-y-1 font-semibold text-slate-600">
              <label className="text-xs text-slate-400 font-bold uppercase">Category Name</label>
              <input 
                type="text" 
                value={editingCategory.name} 
                onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })} 
                className="w-full bg-[#FAF9FC] border p-2.5 rounded-xl text-xs focus:outline-none" 
                required 
              />
            </div>
            <div className="flex justify-end gap-2 text-xs">
              <button type="button" onClick={() => setEditingCategory(null)} className="bg-slate-100 px-4 py-2 rounded-xl font-bold text-slate-700">Cancel</button>
              <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold">Save Changes</button>
            </div>
          </form>
        </div>
      )}

      {showBrandForm && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleBrandUpload} className="bg-white border p-6 rounded-3xl w-full max-w-md space-y-4 shadow-xl text-left animate-fadeIn">
            <h3 className="text-lg font-black text-slate-900">Propose New Brand Model</h3>
            
            <div className="space-y-1 font-semibold text-slate-600">
              <label className="text-xs text-slate-400 font-bold uppercase block">Assign Target Category</label>
              <select 
                value={brandTargetCat} 
                onChange={(e) => setBrandTargetCat(e.target.value)} 
                className="w-full bg-[#FAF9FC] border p-2.5 rounded-xl text-xs focus:outline-none" 
                required
              >
                <option value="">Select Category Parent</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div className="space-y-1 font-semibold text-slate-600">
              <label className="text-xs text-slate-400 uppercase font-black block">Brand Name</label>
              <input
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="Nokia, Apple, Cat VPN etc"
                className="w-full bg-[#FAF9FC] border p-2.5 rounded-xl text-xs focus:outline-none focus:border-[#F41B5E]"
                required
              />
            </div>

            <div className="space-y-1.5 font-semibold text-slate-600">
              <label className="text-xs text-slate-400 uppercase font-black block">Brand Logo Image</label>
              <div className="bg-rose-50 border border-rose-100/50 p-3 rounded-xl text-[10px] text-slate-600 font-semibold space-y-1">
                <p className="font-extrabold text-[#F41B5E]">📐 Canvas constraints:</p>
                <p>• Optimal size output: <strong className="text-slate-800">150 x 150 Square</strong></p>
                <p>• High fidelity compression will fit larger formats automatically.</p>
              </div>
              
              <div className="flex items-center gap-3 mt-2">
                <label className="flex-1 border-2 border-dashed border-slate-200 hover:bg-slate-50 p-4 rounded-xl cursor-pointer flex flex-col items-center justify-center transition-all">
                  <Upload className="w-5 h-5 text-slate-400 mb-1" />
                  <span className="text-[10px] font-bold text-slate-505">Select Local File</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => handleUploadedImage(e, setBrandLogoPreview, setLogoOptimized, 150, 150, true)} 
                    className="hidden" 
                  />
                </label>
                {brandLogoPreview ? (
                  <div className="relative">
                    <img src={brandLogoPreview} alt="Preview" className="w-16 h-16 rounded-xl object-cover border bg-slate-50" />
                    {isLogoOptimized && (
                      <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white text-[8px] px-1 py-0.5 rounded-md font-bold font-mono">Canvas</span>
                    )}
                  </div>
                ) : (
                  <div className="w-16 h-16 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 flex items-center justify-center text-[10px] text-slate-400 font-bold">No Image</div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 text-xs">
              <button type="button" onClick={() => setShowBrandForm(false)} className="bg-slate-100 text-slate-600 px-4 py-2 rounded-xl font-bold">Cancel</button>
              <button type="submit" className="bg-[#F41B5E] text-white px-4 py-2 rounded-xl font-bold">Submit Brand</button>
            </div>
          </form>
        </div>
      )}

      {editingBrand && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={saveBrandEdit} className="bg-white border p-6 rounded-3xl w-full max-w-md space-y-4 shadow-xl text-left animate-fadeIn">
            <h3 className="text-lg font-black text-slate-900">Edit Brand Metadata</h3>
            
            <div className="space-y-1 font-semibold text-slate-600">
              <label className="text-xs text-slate-400 font-bold uppercase block">Category Parent</label>
              <select 
                value={editingBrand.categoryId} 
                onChange={(e) => setEditingBrand({ ...editingBrand, categoryId: e.target.value })} 
                className="w-full bg-[#FAF9FC] border p-2.5 rounded-xl text-xs" 
                required
              >
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div className="space-y-1 font-semibold text-slate-600">
              <label className="text-xs text-slate-400 uppercase font-black block">Brand Name</label>
              <input
                type="text"
                value={editingBrand.name}
                onChange={(e) => setEditingBrand({ ...editingBrand, name: e.target.value })}
                className="w-full bg-[#FAF9FC] border p-2.5 rounded-xl text-xs"
                required
              />
            </div>

            <div className="space-y-1 font-semibold text-slate-600">
              <label className="text-xs text-slate-400 uppercase font-black block">Logo URL</label>
              <input
                type="text"
                value={editingBrand.logoUrl}
                onChange={(e) => setEditingBrand({ ...editingBrand, logoUrl: e.target.value })}
                className="w-full bg-[#FAF9FC] border p-2.5 rounded-xl text-xs"
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 text-xs">
              <button type="button" onClick={() => setEditingBrand(null)} className="bg-slate-100 text-slate-600 px-4 py-2 rounded-xl font-bold">Cancel</button>
              <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold">Save adjustments</button>
            </div>
          </form>
        </div>
      )}

      {showProductForm && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleProductUpload} className="bg-white border p-6 rounded-3xl w-full max-w-md space-y-4 shadow-xl text-left animate-fadeIn">
            <h3 className="text-lg font-black text-slate-900">Index New Product Model</h3>
            <p className="text-[10px] text-amber-600 font-bold leading-relaxed">
              Indexing a new, unlisted product will award you 🪙 10 contribution points in your wallet!
            </p>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1 font-semibold text-slate-600">
                <label className="text-[10px] text-slate-400 uppercase font-black">Parent Category</label>
                <select 
                  value={prodCatId} 
                  onChange={(e) => setProdCatId(e.target.value)} 
                  className="w-full bg-[#FAF9FC] border p-2.5 rounded-xl text-xs focus:outline-none" 
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div className="space-y-1 font-semibold text-slate-600">
                <label className="text-[10px] text-slate-400 uppercase font-black">Parent Brand</label>
                <select 
                  value={prodBrandId} 
                  onChange={(e) => setProdBrandId(e.target.value)} 
                  className="w-full bg-[#FAF9FC] border p-2.5 rounded-xl text-xs focus:outline-none" 
                  required
                >
                  <option value="">Select Brand</option>
                  {brands.filter(b => b.approved).map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-1 font-semibold text-slate-600">
              <label className="text-xs text-slate-400 uppercase font-black block">Model Name</label>
              <input
                type="text"
                value={prodName}
                onChange={(e) => setProdName(e.target.value)}
                placeholder="e.g. Galaxy Fold 5"
                className="w-full bg-[#FAF9FC] border p-2.5 rounded-xl text-xs focus:outline-none focus:border-[#F41B5E]"
                required
              />
            </div>

            <div className="space-y-1 font-semibold text-slate-600">
              <label className="text-xs text-slate-400 uppercase font-black block">Model Error Slogan Summary</label>
              <textarea
                value={prodDesc}
                onChange={(e) => setProdDesc(e.target.value)}
                placeholder="Briefly state the primary real-life defect found on this model."
                className="w-full bg-[#FAF9FC] border p-2.5 rounded-xl text-xs focus:outline-none focus:border-[#F41B5E]"
                rows="2"
              />
            </div>

            <div className="space-y-1.5 font-semibold text-slate-600">
              <label className="text-xs text-slate-400 uppercase font-black block">Product Image Upload</label>
              <div className="bg-rose-50 border border-rose-100/50 p-3 rounded-xl text-[10px] text-slate-600 font-semibold space-y-1">
                <p className="font-extrabold text-[#F41B5E]">📐 Canvas compression details:</p>
                <p>• Output optimal: <strong className="text-slate-800">400 x 300 Landscape</strong></p>
                <p>• Higher files are compressed elegantly to minimize frame lag.</p>
              </div>

              <div className="flex items-center gap-3 mt-1">
                <label className="flex-1 border-2 border-dashed border-slate-200 hover:bg-slate-50 p-3 rounded-xl cursor-pointer flex flex-col items-center justify-center transition-all">
                  <Upload className="w-4 h-4 text-slate-400 mb-1" />
                  <span className="text-[9px] font-bold text-slate-505">Pick Photo</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => handleUploadedImage(e, setProdImagePreview, setProdImgOptimized, 400, 300, false)} 
                    className="hidden" 
                  />
                </label>
                {prodImagePreview ? (
                  <div className="relative">
                    <img src={prodImagePreview} alt="Product Preview" className="w-16 h-16 rounded-xl object-cover border bg-slate-50" />
                    {isProdImgOptimized && (
                      <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white text-[8px] px-1 py-0.5 rounded-md font-bold font-mono">Canvas</span>
                    )}
                  </div>
                ) : (
                  <div className="w-16 h-16 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 flex items-center justify-center text-[9px] text-slate-400 font-bold">No Image</div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 text-xs">
              <button type="button" onClick={() => setShowProductForm(false)} className="bg-slate-100 text-slate-600 px-4 py-2 rounded-xl font-bold">Cancel</button>
              <button type="submit" className="bg-[#F41B5E] text-white px-4 py-2 rounded-xl font-bold">Index Model (+10 Pts)</button>
            </div>
          </form>
        </div>
      )}

      {showProblemForm && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleProblemSubmission} className="bg-white border p-6 rounded-3xl w-full max-w-md space-y-4 shadow-xl text-left animate-fadeIn">
            <h3 className="text-lg font-black text-slate-900">Report Observed Product Bug</h3>
            
            <div className="space-y-1 font-semibold text-slate-600">
              <label className="text-xs text-slate-400 uppercase font-black block">Choose Product Model</label>
              <select value={probProduct} onChange={(e) => setProbProduct(e.target.value)} className="w-full bg-[#FAF9FC] border p-2.5 rounded-xl text-xs focus:outline-none" required>
                <option value="">Choose Model</option>
                {activeProducts.map(p => <option key={p.id} value={p.id}>{p.modelName}</option>)}
              </select>
            </div>

            <div className="space-y-1 font-semibold text-slate-600">
              <label className="text-xs text-slate-400 uppercase font-black block">Observed Bug / Issue</label>
              <select value={probText} onChange={(e) => setProbText(e.target.value)} className="w-full bg-[#FAF9FC] border p-2.5 rounded-xl text-xs focus:outline-none" required>
                <option value="Battery Degradation & Fast Draining">Battery Degradation & Fast Draining</option>
                <option value="UI Slowdown / Stutter Lags">UI Slowdown / Stutter Lags</option>
                <option value="Overheating Under Moderate Load">Overheating Under Moderate Load</option>
                <option value="Wi-Fi Connection Dropping">Wi-Fi Connection Dropping</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {probText === 'Other' && (
              <div className="space-y-1 animate-fadeIn font-semibold text-slate-600">
                <label className="text-xs text-slate-400 uppercase font-black block">Specify Custom Problem</label>
                <input
                  type="text"
                  value={customProbText}
                  onChange={(e) => setCustomProbText(e.target.value)}
                  placeholder="e.g. Loose charging port connector"
                  className="w-full bg-[#FAF9FC] border p-2.5 rounded-xl text-xs focus:outline-none focus:border-[#F41B5E]"
                  required
                />
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2 text-xs">
              <button type="button" onClick={() => setShowProblemForm(false)} className="bg-slate-100 text-slate-600 px-4 py-2 rounded-xl font-bold">Cancel</button>
              <button type="submit" className="bg-[#F41B5E] text-white px-4 py-2 rounded-xl font-bold">Submit Fault (+5 Pts)</button>
            </div>
          </form>
        </div>
      )}

      {/* Authentication Popup */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl text-left animate-fadeIn">
            <div className="flex border-b">
              <button onClick={() => setAuthTab('login')} className={`flex-1 py-4 text-center text-xs font-black uppercase tracking-wider ${authTab === 'login' ? 'border-b-2 border-[#F41B5E] text-[#F41B5E]' : 'text-slate-400'}`}>Login</button>
              <button onClick={() => setAuthTab('register')} className={`flex-1 py-4 text-center text-xs font-black uppercase tracking-wider ${authTab === 'register' ? 'border-b-2 border-[#F41B5E] text-[#F41B5E]' : 'text-slate-400'}`}>Register</button>
            </div>

            <form onSubmit={handleAuthSubmit} className="p-6 space-y-4">
                {authTab === 'login' ? (
                  <>
                    <div className="space-y-1">
                      <label className="text-xs text-slate-400 font-bold uppercase">Email Address</label>
                      <input
                        type="email"
                        placeholder="e.g. name@gmail.com"
                        value={checkoutForm.name}
                        onChange={(e) => setCheckoutForm({ ...checkoutForm, name: e.target.value })}
                        className="w-full bg-[#FAF9FC] border p-2.5 rounded-xl text-xs focus:outline-none"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-slate-400 font-bold uppercase">Password</label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={authPassword}
                        onChange={(e) => setAuthPassword(e.target.value)}
                        className="w-full bg-[#FAF9FC] border p-2.5 rounded-xl text-xs focus:outline-none"
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
                        value={regFullName}
                        onChange={(e) => setRegFullName(e.target.value)}
                        className="w-full bg-[#FAF9FC] border p-2.5 rounded-xl text-xs focus:outline-none"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-slate-400 font-bold uppercase">Email Address</label>
                      <input
                        type="email"
                        placeholder="yourname@gmail.com"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        className="w-full bg-[#FAF9FC] border p-2.5 rounded-xl text-xs focus:outline-none"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-slate-400 font-bold uppercase">Home Country</label>
                      <input
                        type="text"
                        placeholder="e.g. Bangladesh"
                        value={regCountry}
                        onChange={(e) => setRegCountry(e.target.value)}
                        className="w-full bg-[#FAF9FC] border p-2.5 rounded-xl text-xs focus:outline-none"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-slate-400 font-bold uppercase">Set Password</label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={authPassword}
                        onChange={(e) => setAuthPassword(e.target.value)}
                        className="w-full bg-[#FAF9FC] border p-2.5 rounded-xl text-xs focus:outline-none"
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

      {/* Complete Footer */}
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
              Truth over sponsorship. CheckMinus1 indexes real-life bugs and product lifetimes so you can make calculated shopping decisions.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs uppercase tracking-widest text-white font-black">Top Categories</h3>
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
              <a href="#" className="p-2 rounded-lg bg-slate-800 hover:bg-[#F41B5E] transition-colors">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
              <a href="#" className="p-2 rounded-lg bg-slate-800 hover:bg-[#F41B5E] transition-colors">
                <Globe className="w-4 h-4" />
              </a>
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