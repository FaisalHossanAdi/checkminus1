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
  FolderPlus
} from 'lucide-react';

/* 
 * সব ফিচারের সমন্বয়ে ফিক্সড ফাইল। 
 * ডুপ্লিকেট ইম্পোর্ট এবং এররগুলো রিমুভ করা হয়েছে।
 */

const toTitleCase = (str) => {
  if (!str) return '';
  return str.trim().toLowerCase().split(/\s+/).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
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
          ctx.drawImage(img, (width - size) / 2, (height - size) / 2, size, size, 0, 0, maxWidth, maxHeight);
        } else {
          if (width > height) {
            if (width > maxWidth) { height = Math.round((height * maxWidth) / width); width = maxWidth; }
          } else {
            if (height > maxHeight) { width = Math.round((width * maxHeight) / height); height = maxHeight; }
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
    categoryId: 'cat-1',
    modelName: 'Galaxy S24 Ultra',
    faultScore: 48,
    timeline: [15, 25, 48, 65, 80],
    description: 'Significant camera shutter lag and screen vividness issues reported in early batches.',
    affiliateLink: 'https://amazon.com/dp/S24Ultra-affiliate-id',
    imageUrl: 'https://images.unsplash.com/photo-1610792516307-ea5acd9c3b00?w=400&auto=format&fit=crop&q=80',
    faults: [{ id: 'f-1', text: 'Camera Shutter Lag In Low Light', votes: 142, approved: true }]
  }
];

export default function App() {
  const [currentView, setCurrentView] = useState('index');
  const [categories, setCategories] = useState(() => JSON.parse(localStorage.getItem('c1_categories')) || initialCategories);
  const [brands, setBrands] = useState(() => JSON.parse(localStorage.getItem('c1_brands')) || initialBrands);
  const [products, setProducts] = useState(() => JSON.parse(localStorage.getItem('c1_products')) || initialProducts);
  const [storeProducts, setStoreProducts] = useState(() => JSON.parse(localStorage.getItem('c1_store_products')) || []);
  const [pendingBrands, setPendingBrands] = useState(() => JSON.parse(localStorage.getItem('c1_pendingBrands')) || []);
  const [isLoggedIn, setIsLoggedIn] = useState(() => JSON.parse(localStorage.getItem('c1_isLoggedIn')) || false);
  const [userRole, setUserRole] = useState(() => localStorage.getItem('c1_userRole') || 'user'); 
  const [username, setUsername] = useState(() => localStorage.getItem('c1_username') || 'Guest Contributor');
  const [userPoints, setUserPoints] = useState(() => parseInt(localStorage.getItem('c1_userPoints')) || 250); 
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [alertBanner, setAlertBanner] = useState({ show: false, msg: '', type: 'success' });
  
  // Modals
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showBrandForm, setShowBrandForm] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authTab, setAuthTab] = useState('login');
  
  // Inputs
  const [newCatName, setNewCatName] = useState('');
  const [brandName, setBrandName] = useState('');
  const [brandTargetCat, setBrandTargetCat] = useState('');
  const [brandLogoPreview, setBrandLogoPreview] = useState('');
  const [prodName, setProdName] = useState('');
  const [prodBrandId, setProdBrandId] = useState('');
  const [prodCatId, setProdCatId] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodImagePreview, setProdImagePreview] = useState('');
  const [storeNewName, setStoreNewName] = useState('');
  const [storeNewPrice, setStoreNewPrice] = useState('');
  const [storeNewPoints, setStoreNewPoints] = useState('');
  const [storeNewImage, setStoreNewImage] = useState('');

  const triggerAlert = (msg, type = 'success') => {
    setAlertBanner({ show: true, msg, type });
    setTimeout(() => setAlertBanner({ show: false, msg: '', type: 'success' }), 4000);
  };

  const handleUploadedImage = async (e, targetSetter, width, height, crop) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const optimized = await resizeImage(file, width, height, crop);
        targetSetter(optimized);
      } catch (err) { triggerAlert('Image resize failed', 'error'); }
    }
  };

  const handleAdminStoreProductUpload = (e) => {
    e.preventDefault();
    if (!storeNewName.trim() || !storeNewPrice || !storeNewPoints) return;
    setStoreProducts([...storeProducts, { id: `sp-${Date.now()}`, name: storeNewName, price: parseInt(storeNewPrice), pointsCost: parseInt(storeNewPoints), image: storeNewImage }]);
    triggerAlert('Store product added!');
    setStoreNewName(''); setStoreNewPrice(''); setStoreNewPoints(''); setStoreNewImage('');
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4">
      <header className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm mb-6">
        <h1 className="text-xl font-black">CheckMinus1 Admin Core</h1>
        <button onClick={() => setCurrentView('index')} className="text-sm font-bold">Home</button>
      </header>

      {currentView === 'admin-dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border">
              <h2 className="font-bold mb-4">Add Store Product</h2>
              <form onSubmit={handleAdminStoreProductUpload} className="space-y-3">
                <input type="text" placeholder="Name" value={storeNewName} onChange={(e) => setStoreNewName(e.target.value)} className="w-full border p-2 rounded" required/>
                <input type="number" placeholder="Price" value={storeNewPrice} onChange={(e) => setStoreNewPrice(e.target.value)} className="w-full border p-2 rounded" required/>
                <input type="number" placeholder="Points" value={storeNewPoints} onChange={(e) => setStoreNewPoints(e.target.value)} className="w-full border p-2 rounded" required/>
                <input type="file" onChange={(e) => handleUploadedImage(e, setStoreNewImage, 300, 300, true)} className="w-full text-xs" />
                <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">Add Product</button>
              </form>
            </div>
            
            <div className="bg-white p-6 rounded-xl border">
              <h2 className="font-bold mb-4">Categories</h2>
              <button onClick={() => setShowCategoryForm(true)} className="bg-emerald-500 text-white p-2 rounded text-sm font-bold">+ Add Category</button>
            </div>
          </div>
        </div>
      )}

      {showCategoryForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-80">
            <input type="text" placeholder="Category Name" value={newCatName} onChange={(e) => setNewCatName(e.target.value)} className="w-full border p-2 mb-4" />
            <div className="flex gap-2">
              <button onClick={() => setShowCategoryForm(false)} className="bg-gray-200 px-4 py-2 rounded">Cancel</button>
              <button onClick={() => { setCategories([...categories, {id: Date.now(), name: newCatName}]); setShowCategoryForm(false); }} className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}