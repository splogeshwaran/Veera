// =============================================================================
// VEERA - Master Application Logic & Role-Based Access Controller
// Features by Role:
//   FARMER: Home, Community (post+view), Marketplace (list+view), AI Agriculture,
//           Opportunities, Farmer Profile, Dashboard (farmer view)
//   BUYER:  Home, Community (view+comment), Marketplace (browse+enquire),
//           Find Farms (directory), My Cart & Procurement (RFQs), Dashboard (buyer view)
// =============================================================================

// Feature Access Matrix
const ROLE_ACCESS = {
  farmer: {
    sections: ['home', 'community', 'marketplace', 'ai', 'opportunities', 'profile', 'dashboard', 'login'],
    hidden: ['farms', 'cart']
  },
  buyer: {
    sections: ['home', 'community', 'marketplace', 'farms', 'cart', 'dashboard', 'profile', 'login'],
    hidden: ['ai', 'opportunities']
  },
  guest: {
    sections: ['home', 'community', 'marketplace', 'farms', 'login'],
    hidden: ['dashboard', 'cart', 'ai', 'opportunities', 'profile']
  }
};

// Application State Store
const AppState = {
  currentUser: null,
  products: [],
  posts: [],
  enquiries: [],
  cart: [],
  buyerRfqs: [],
  activeCategory: 'All',
  activeMarketSort: 'default',
  activeMarketLocation: 'all',
  marketSearchQuery: '',
  farmSearchQuery: '',
  farmCropFilter: 'all',
  activeAiTab: 'crop-rec',
  activeOppFilter: 'All',
  currentDiseaseSampleIndex: 0
};

// =============================================================================
// INITIALIZATION
// =============================================================================
document.addEventListener('DOMContentLoaded', () => {
  loadStoredData();
  initApplication();
});

function loadStoredData() {
  try {
    const storedUser = localStorage.getItem('veera_currentUser');
    AppState.currentUser = storedUser
      ? JSON.parse(storedUser)
      : null; // null = guest mode (not logged in)

    const storedProducts = localStorage.getItem('veera_products');
    AppState.products = storedProducts ? JSON.parse(storedProducts) : [...INITIAL_DATA.products];

    const storedPosts = localStorage.getItem('veera_posts');
    AppState.posts = storedPosts ? JSON.parse(storedPosts) : [...INITIAL_DATA.posts];

    const storedEnquiries = localStorage.getItem('veera_enquiries');
    AppState.enquiries = storedEnquiries ? JSON.parse(storedEnquiries) : [...INITIAL_DATA.enquiries];

    const storedCart = localStorage.getItem('veera_cart');
    AppState.cart = storedCart ? JSON.parse(storedCart) : [...INITIAL_DATA.initialCart];

    const storedRfqs = localStorage.getItem('veera_rfqs');
    AppState.buyerRfqs = storedRfqs ? JSON.parse(storedRfqs) : [...INITIAL_DATA.buyerRequests];
  } catch (e) {
    console.warn('LocalStorage error, using defaults:', e);
    AppState.currentUser = null; // guest mode fallback
    AppState.products = [...INITIAL_DATA.products];
    AppState.posts = [...INITIAL_DATA.posts];
    AppState.enquiries = [...INITIAL_DATA.enquiries];
    AppState.cart = [...INITIAL_DATA.initialCart];
    AppState.buyerRfqs = [...INITIAL_DATA.buyerRequests];
  }
}

function persistState() {
  try {
    localStorage.setItem('veera_currentUser', JSON.stringify(AppState.currentUser));
    localStorage.setItem('veera_products', JSON.stringify(AppState.products));
    localStorage.setItem('veera_posts', JSON.stringify(AppState.posts));
    localStorage.setItem('veera_enquiries', JSON.stringify(AppState.enquiries));
    localStorage.setItem('veera_cart', JSON.stringify(AppState.cart));
    localStorage.setItem('veera_rfqs', JSON.stringify(AppState.buyerRfqs));
  } catch (e) {
    console.warn('LocalStorage write failed:', e);
  }
}

function initApplication() {
  updateUserUI();
  updateLoginPageUI();
  renderHomePreviews();
  renderMarketplace();
  renderCommunityPosts();
  renderOpportunities();
  renderFarmerProfile();
  renderDashboard();
  renderFarmsDirectory();
  renderBuyerCart();
  updateMarketIntelligence();
  loadSampleDisease(0);
}

// =============================================================================
// ROLE-BASED UI GATING — the core of role differentiation
// =============================================================================
function applyRoleGating(role) {
  const isFarmer = (role === 'farmer');
  const isBuyer = (role === 'buyer');
  const isGuest = (role === 'guest');

  // 1. Desktop nav: show/hide farmer-only and buyer-only <li> items
  document.querySelectorAll('[data-nav-farmer]').forEach(el => {
    el.style.display = isFarmer ? '' : 'none';
  });
  document.querySelectorAll('[data-nav-buyer]').forEach(el => {
    el.style.display = isBuyer ? '' : 'none';
  });

  // 2. Mobile bottom nav: swap AI / Farms
  const mobileAi = document.getElementById('mobileNavAi');
  const mobileFarms = document.getElementById('mobileNavFarms');
  if (mobileAi) mobileAi.style.display = isFarmer ? '' : 'none';
  if (mobileFarms) mobileFarms.style.display = isBuyer ? '' : 'none';

  // 3. Hero CTA buttons
  const heroBtnFarmer = document.getElementById('heroBtnFarmer');
  const heroBtnBuyer = document.getElementById('heroBtnBuyer');
  const heroBtnGuest = document.getElementById('heroBtnGuest');
  if (heroBtnFarmer) heroBtnFarmer.style.display = isFarmer ? '' : 'none';
  if (heroBtnBuyer) heroBtnBuyer.style.display = isBuyer ? '' : 'none';
  if (heroBtnGuest) heroBtnGuest.style.display = isGuest ? '' : 'none';

  // 4. Home page pillars swap
  const pillarAiFarmer = document.getElementById('pillarAiFarmer');
  const pillarFindFarmsBuyer = document.getElementById('pillarFindFarmsBuyer');
  const pillarOppsFarmer = document.getElementById('pillarOppsFarmer');
  const pillarRfqBuyer = document.getElementById('pillarRfqBuyer');
  if (pillarAiFarmer) pillarAiFarmer.style.display = isFarmer ? '' : 'none';
  if (pillarFindFarmsBuyer) pillarFindFarmsBuyer.style.display = isFarmer ? 'none' : '';
  if (pillarOppsFarmer) pillarOppsFarmer.style.display = isFarmer ? '' : 'none';
  if (pillarRfqBuyer) pillarRfqBuyer.style.display = isFarmer ? 'none' : '';

  // 5. Community: hide "Create Post" box for buyers (they can still comment & like)
  const createPostBox = document.getElementById('communityCreatePostBox');
  if (createPostBox) createPostBox.style.display = isFarmer ? '' : 'none';

  // 6. Marketplace: hide "List Product" button strip for buyers
  const marketFarmerActions = document.getElementById('marketFarmerActions');
  if (marketFarmerActions) marketFarmerActions.style.display = isFarmer ? 'block' : 'none';

  // 7. If user is on a restricted page for their current role, redirect safely
  const currentSection = document.querySelector('.app-section.active');
  if (currentSection) {
    const sectionId = currentSection.id.replace('section-', '');
    const access = ROLE_ACCESS[role] || ROLE_ACCESS.guest;
    if (access && access.hidden.includes(sectionId)) {
      if (role === 'guest') {
        window.location.href = 'login.html';
      } else {
        navigateTo('marketplace');
      }
    }
  }
}

// =============================================================================
// ROLE SWITCHING & AUTHENTICATION
// =============================================================================
function switchUserRole(role) {
  AppState.currentUser = { ...INITIAL_DATA.demoProfiles[role] };
  persistState();
  updateUserUI();
  renderDashboard();
  renderMarketplace();
  renderBuyerCart();
  renderFarmsDirectory();
  showToast(
    role === 'farmer'
      ? 'Switched to Farmer Mode — Arun Kumar (Coimbatore)'
      : 'Switched to Buyer Mode — Priya Sharma (FreshBasket Organics)',
    'success'
  );
}


function signOutUser() {
  AppState.currentUser = null;
  localStorage.removeItem('veera_currentUser');
  updateUserUI();
  updateLoginPageUI();
  renderDashboard();
  renderMarketplace();
  renderCommunityPosts();
  navigateTo('home');
  showToast('You have been signed out. Viewing limited guest mode.', 'info');
}

function openUserProfile() {
  if (!AppState.currentUser) {
    window.location.href = 'login.html';
    return;
  }
  renderUserProfile();
  navigateTo('profile');
}

function updateUserUI() {
  const user = AppState.currentUser;
  const isLoggedIn = !!user;

  // 1. Hide "Sign In" in navigation when user is logged in; display if logged out
  document.querySelectorAll('[data-section="login"]').forEach(el => {
    const parentLi = el.closest('li');
    if (parentLi) parentLi.style.display = isLoggedIn ? 'none' : '';
    else el.style.display = isLoggedIn ? 'none' : '';
  });

  const navItemSignIn = document.getElementById('navItemSignIn');
  if (navItemSignIn) navItemSignIn.style.display = isLoggedIn ? 'none' : '';

  const navItemProfile = document.getElementById('navItemProfile');
  if (navItemProfile) navItemProfile.style.display = isLoggedIn ? '' : 'none';

  const mobileNavSignIn = document.getElementById('mobileNavSignIn');
  if (mobileNavSignIn) mobileNavSignIn.style.display = isLoggedIn ? 'none' : '';

  const mobileNavProfile = document.getElementById('mobileNavProfile');
  if (mobileNavProfile) mobileNavProfile.style.display = isLoggedIn ? '' : 'none';

  const heroSignInBtn = document.getElementById('heroSignInBtn');
  if (heroSignInBtn) heroSignInBtn.style.display = isLoggedIn ? 'none' : '';

  // 2. Handle Logged-Out / Guest State
  if (!isLoggedIn) {
    // Hide user-pill, show sign-in button in nav-actions area
    const navUserPill = document.getElementById('navUserPill');
    if (navUserPill) navUserPill.style.display = 'none';
    const navSignInBtn = document.getElementById('navSignInBtn');
    if (navSignInBtn) navSignInBtn.style.display = '';

    const topBadge = document.getElementById('topRoleBadge');
    if (topBadge) {
      topBadge.className = 'role-tag-badge guest';
      topBadge.textContent = 'Guest Mode (Not Signed In)';
    }
    const topSwitchContainer = document.querySelector('.top-role-quick-switches');
    if (topSwitchContainer) {
      topSwitchContainer.innerHTML = '<a class="role-switch-btn" href="login.html">Sign In</a>';
    }

    const navActionBtn = document.getElementById('navActionBtn');
    if (navActionBtn) {
      navActionBtn.textContent = 'Sign In';
      navActionBtn.className = 'btn btn-outline btn-sm';
      navActionBtn.setAttribute('onclick', 'window.location.href="login.html"');
    }

    applyRoleGating('guest');
    return;
  }

  // 3. Handle Logged-In State
  const isFarmer = (user.role === 'farmer');

  // Show user-pill, hide sign-in button
  const navUserPill = document.getElementById('navUserPill');
  if (navUserPill) navUserPill.style.display = '';
  const navSignInBtn = document.getElementById('navSignInBtn');
  if (navSignInBtn) navSignInBtn.style.display = 'none';

  // Top role badge & switch buttons
  const topBadge = document.getElementById('topRoleBadge');
  if (topBadge) {
    topBadge.className = `role-tag-badge ${user.role}`;
    topBadge.innerHTML = isFarmer
      ? `Farmer: ${user.name} (${user.location.split(',')[0]})`
      : `Buyer: ${user.name} — ${user.buyerType || 'Procurement'}`;
  }
  const topSwitchContainer = document.querySelector('.top-role-quick-switches');
  if (topSwitchContainer) {
    topSwitchContainer.innerHTML = `
      <button class="role-switch-btn" onclick="openUserProfile()">View Profile</button>
      <button class="role-switch-btn" onclick="signOutUser()">Sign Out</button>
    `;
  }

  // Nav user pill -> On click, displays Profile details!
  const navPill = document.getElementById('navUserPill');
  if (navPill) {
    navPill.setAttribute('onclick', 'openUserProfile()');
    navPill.setAttribute('title', 'Click to view profile details');
  }

  const navAvatar = document.getElementById('navUserAvatar');
  const navName = document.getElementById('navUserName');
  const navRole = document.getElementById('navUserRole');
  if (navAvatar) navAvatar.src = user.avatar;
  if (navName) navName.textContent = user.name;
  if (navRole) navRole.textContent = isFarmer ? 'Farmer' : 'Buyer';

  // Nav action button
  const navActionBtn = document.getElementById('navActionBtn');
  if (navActionBtn) {
    navActionBtn.textContent = isFarmer ? '+ List Product' : 'Browse Farms';
    navActionBtn.className = 'btn btn-primary btn-sm';
    navActionBtn.setAttribute('onclick', 'handleNavAction()');
  }

  // Feed avatar
  const feedAvatar = document.getElementById('feedUserAvatar');
  if (feedAvatar) feedAvatar.src = user.avatar;

  // Apply role gating
  applyRoleGating(user.role);
}

function handleNavAction() {
  if (AppState.currentUser.role === 'farmer') {
    openAddProductModal();
  } else {
    navigateTo('farms');
  }
}

function openLoginModal(preselectRole) {
  window.location.href = 'login.html';
}

function setAuthTab(role) {
  const tabFarmer = document.getElementById('tabAuthFarmer');
  const tabBuyer = document.getElementById('tabAuthBuyer');
  const contentFarmer = document.getElementById('authContentFarmer');
  const contentBuyer = document.getElementById('authContentBuyer');
  if (!tabFarmer) return;
  if (role === 'farmer') {
    tabFarmer.classList.add('active'); tabBuyer.classList.remove('active');
    contentFarmer.style.display = 'block'; contentBuyer.style.display = 'none';
  } else {
    tabBuyer.classList.add('active'); tabFarmer.classList.remove('active');
    contentBuyer.style.display = 'block'; contentFarmer.style.display = 'none';
  }
}

function quickLogin(role) {
  switchUserRole(role);
  closeModal('modalLogin');
}

function handleCustomLogin(event, role) {
  event.preventDefault();
  if (role === 'farmer') {
    const name = document.getElementById('custFarmerName').value.trim();
    const loc = document.getElementById('custFarmerLoc').value.trim();
    const size = document.getElementById('custFarmerSize').value.trim();
    const contact = document.getElementById('custFarmerContact').value.trim();
    AppState.currentUser = {
      role: 'farmer', id: 'cust-farmer-' + Date.now(), name,
      title: 'Registered Farmer',
      avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=250&q=80',
      location: loc, farmSize: size, experience: '5+ Years',
      phone: contact, email: name.toLowerCase().replace(/\s+/g, '') + '@veeramail.in',
      crops: ['Seasonal Produce'], bio: `Progressive farmer managing ${size} in ${loc}.`
    };
    showToast(`Welcome ${name}! Logged in as Farmer.`, 'success');
  } else {
    const name = document.getElementById('custBuyerName').value.trim();
    const type = document.getElementById('custBuyerType').value;
    const loc = document.getElementById('custBuyerLoc').value.trim();
    const contact = document.getElementById('custBuyerContact').value.trim();
    AppState.currentUser = {
      role: 'buyer', id: 'cust-buyer-' + Date.now(), name,
      title: type,
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80',
      location: loc, buyerType: type,
      phone: contact.includes('@') ? '+91 98000 00000' : contact,
      email: contact.includes('@') ? contact : name.toLowerCase().replace(/\s+/g, '') + '@buyer.in',
      interests: ['Vegetables', 'Fruits', 'Grains'],
      bio: `Sourcing quality farm produce for ${type} in ${loc}.`
    };
    showToast(`Welcome ${name}! Logged in as Buyer.`, 'success');
  }
  persistState();
  updateUserUI();
  renderDashboard();
  renderMarketplace();
  closeModal('modalLogin');
}

// =============================================================================

function quickPageLogin(role) {
  switchUserRole(role);
  updateLoginPageUI();
  navigateTo('dashboard');
}

function handlePageLogin(event, role) {
  event.preventDefault();
  if (role === 'farmer') {
    const name = document.getElementById('pageFarmerName').value.trim();
    const loc = document.getElementById('pageFarmerLoc').value.trim();
    const size = document.getElementById('pageFarmerSize').value.trim();
    const contact = document.getElementById('pageFarmerContact').value.trim();
    AppState.currentUser = {
      role: 'farmer', id: 'cust-farmer-' + Date.now(), name,
      title: 'Registered Farmer',
      avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=250&q=80',
      location: loc, farmSize: size, experience: '5+ Years',
      phone: contact, email: name.toLowerCase().replace(/\s+/g, '') + '@veeramail.in',
      crops: ['Seasonal Produce'], bio: `Progressive farmer managing ${size} in ${loc}.`
    };
    showToast(`Welcome ${name}! Logged in as Farmer.`, 'success');
  } else {
    const name = document.getElementById('pageBuyerName').value.trim();
    const type = document.getElementById('pageBuyerType').value;
    const loc = document.getElementById('pageBuyerLoc').value.trim();
    const contact = document.getElementById('pageBuyerContact').value.trim();
    AppState.currentUser = {
      role: 'buyer', id: 'cust-buyer-' + Date.now(), name,
      title: type,
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80',
      location: loc, buyerType: type,
      phone: contact.includes('@') ? '+91 98000 00000' : contact,
      email: contact.includes('@') ? contact : name.toLowerCase().replace(/\s+/g, '') + '@buyer.in',
      interests: ['Vegetables', 'Fruits', 'Grains'],
      bio: `Sourcing quality farm produce for ${type} in ${loc}.`
    };
    showToast(`Welcome ${name}! Logged in as Buyer.`, 'success');
  }
  persistState();
  updateUserUI();
  updateLoginPageUI();
  renderDashboard();
  renderMarketplace();
  navigateTo('dashboard');
}

function updateLoginPageUI() {
  const nameEl = document.getElementById('loginActiveUserName');
  const roleEl = document.getElementById('loginActiveUserRole');
  if (nameEl && AppState.currentUser) nameEl.textContent = AppState.currentUser.name;
  if (roleEl && AppState.currentUser) roleEl.textContent = AppState.currentUser.role === 'farmer' ? 'Farmer' : 'Buyer';
}

// NAVIGATION CONTROLLER — enforces role access on every navigation
// =============================================================================
function navigateTo(sectionId, optionalSubtab) {
  if (sectionId === 'login') {
    updateLoginPageUI();
  }
  if (sectionId === 'profile') {
    renderUserProfile();
  }
  // Guard: block forbidden sections for current role
  const role = AppState.currentUser ? AppState.currentUser.role : 'guest';
  const access = ROLE_ACCESS[role] || ROLE_ACCESS.guest;
  if (sectionId !== 'login' && access && access.hidden.includes(sectionId)) {
    if (!AppState.currentUser) {
      showToast('Please sign in to access this section.', 'info');
      window.location.href = 'login.html';
      return;
    }
    showToast(
      sectionId === 'ai' || sectionId === 'opportunities'
        ? 'This feature is available for Farmers only. Please log in as a Farmer.'
        : 'This section is for Buyers only. Please switch to Buyer mode.',
      'error'
    );
    return;
  }

  // Deactivate all sections
  document.querySelectorAll('.app-section').forEach(sec => sec.classList.remove('active'));
  const target = document.getElementById(`section-${sectionId}`);
  if (target) target.classList.add('active');

  // Update desktop nav active state
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.getAttribute('data-section') === sectionId);
  });

  // Update mobile nav active state
  document.querySelectorAll('.mobile-nav-item').forEach(item => {
    const txt = item.querySelector('span:last-child')?.textContent?.toLowerCase() || '';
    const sec = sectionId.toLowerCase();
    item.classList.toggle('active',
      txt.includes(sec) ||
      (sec === 'ai' && txt.includes('ai')) ||
      (sec === 'farms' && txt.includes('farm')) ||
      (sec === 'cart' && txt.includes('cart'))
    );
  });

  // Handle AI sub-tab deeplink
  if (sectionId === 'ai' && optionalSubtab === 'tab-market') {
    switchAiTab('market-intel');
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function toggleMobileNav() {
  const navMenu = document.querySelector('.nav-menu');
  if (!navMenu) return;
  const isVisible = navMenu.style.display === 'flex';
  navMenu.style.cssText = isVisible
    ? ''
    : 'display:flex; flex-direction:column; position:absolute; top:100%; left:0; right:0; background:#ffffff; padding:16px; box-shadow:var(--shadow-lg); z-index:999;';
}

// =============================================================================
// HOME PAGE PREVIEWS
// =============================================================================
function renderHomePreviews() {
  const homeProdsGrid = document.getElementById('homeFeaturedProductsGrid');
  if (homeProdsGrid) {
    homeProdsGrid.innerHTML = AppState.products.slice(0, 4).map(createProductCardHtml).join('');
  }
  const homeComm = document.getElementById('homeCommunityHighlights');
  if (homeComm) {
    homeComm.innerHTML = AppState.posts.slice(0, 2).map(p => createPostCardHtml(p, true)).join('');
  }
}

// =============================================================================
// MARKETPLACE (shared, but farmers can list, buyers can only browse & enquire)
// =============================================================================
function renderMarketplace() {
  const grid = document.getElementById('marketplaceProductsGrid');
  const emptyState = document.getElementById('marketEmptyState');
  if (!grid) return;

  let filtered = [...AppState.products];

  if (AppState.activeCategory !== 'All') {
    filtered = filtered.filter(p => p.category.toLowerCase() === AppState.activeCategory.toLowerCase());
  }
  if (AppState.marketSearchQuery) {
    const q = AppState.marketSearchQuery.toLowerCase();
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.farmerName.toLowerCase().includes(q) ||
      p.location.toLowerCase().includes(q)
    );
  }
  if (AppState.activeMarketLocation !== 'all') {
    filtered = filtered.filter(p => p.location.includes(AppState.activeMarketLocation));
  }
  if (AppState.activeMarketSort === 'price-low') filtered.sort((a, b) => a.price - b.price);
  if (AppState.activeMarketSort === 'price-high') filtered.sort((a, b) => b.price - a.price);
  if (AppState.activeMarketSort === 'organic') filtered = filtered.filter(p => p.isOrganic);

  if (filtered.length === 0) {
    grid.innerHTML = '';
    if (emptyState) emptyState.style.display = 'block';
  } else {
    if (emptyState) emptyState.style.display = 'none';
    grid.innerHTML = filtered.map(createProductCardHtml).join('');
  }
}

function createProductCardHtml(prod) {
  return `
    <div class="product-card" id="card-${prod.id}">
      <div class="product-image-wrap">
        <img src="${prod.image}" alt="${prod.name}" loading="lazy">
        ${prod.isOrganic ? '<span class="badge-organic">Verified Organic</span>' : ''}
        <span class="badge-availability">${prod.availability}</span>
      </div>
      <div class="product-info-wrap">
        <div class="product-category-tag">${prod.category}</div>
        <h3 class="product-title">${prod.name}</h3>
        <div class="product-farmer-meta">
          <img src="${prod.farmerAvatar}" alt="${prod.farmerName}" class="farmer-avatar-small">
          <span class="farmer-link-text" onclick="viewFarmerProfile('${prod.farmerId}')">
            ${prod.farmerName}
          </span>
        </div>
        <div class="product-details-row">
          <span>${prod.location.split(',')[0]}</span>
          <span>Qty: ${prod.quantity}</span>
        </div>
        <div class="product-footer-row">
          <div class="product-price-box">
            <span class="price-main">₹${prod.price}</span>
            <span class="price-unit">per ${prod.unit}</span>
          </div>
          <div style="display:flex;gap:6px;flex-wrap:wrap;">
            <button class="btn btn-primary btn-sm" onclick="openProductModal('${prod.id}')">View Product</button>
            <button class="btn btn-accent btn-sm" onclick="openBuyNowModal('${prod.id}')">⚡ Buy Now</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function filterMarketCategory(cat, btnEl) {
  AppState.activeCategory = cat;
  document.querySelectorAll('.category-pills-row .category-pill').forEach(b => b.classList.remove('active'));
  if (btnEl) btnEl.classList.add('active');
  renderMarketplace();
}
function handleMarketSearch() {
  AppState.marketSearchQuery = document.getElementById('marketSearchInput')?.value.trim() || '';
  renderMarketplace();
}
function handleMarketSort() {
  AppState.activeMarketSort = document.getElementById('marketSortSelect')?.value || 'default';
  renderMarketplace();
}
function handleMarketLocationFilter() {
  AppState.activeMarketLocation = document.getElementById('marketLocationFilter')?.value || 'all';
  renderMarketplace();
}
function resetMarketFilters() {
  AppState.activeCategory = 'All';
  AppState.marketSearchQuery = '';
  AppState.activeMarketSort = 'default';
  AppState.activeMarketLocation = 'all';
  const sInput = document.getElementById('marketSearchInput');
  if (sInput) sInput.value = '';
  const sSort = document.getElementById('marketSortSelect');
  if (sSort) sSort.value = 'default';
  const sLoc = document.getElementById('marketLocationFilter');
  if (sLoc) sLoc.value = 'all';
  const firstPill = document.querySelector('.category-pills-row .category-pill');
  if (firstPill) filterMarketCategory('All', firstPill);
}

// Product Details Modal
function openProductModal(productId) {
  const prod = AppState.products.find(p => p.id === productId);
  const modal = document.getElementById('modalProductDetails');
  if (!prod || !modal) return;

  document.getElementById('prodModalImg').src = prod.image;
  document.getElementById('prodModalCategory').textContent = prod.category;
  document.getElementById('prodModalName').textContent = prod.name;
  document.getElementById('prodModalLocation').textContent = prod.location;
  document.getElementById('prodModalPrice').textContent = `₹${prod.price}`;
  document.getElementById('prodModalUnit').textContent = `per ${prod.unit}`;
  document.getElementById('prodModalAvail').textContent = prod.availability;
  document.getElementById('prodModalQty').textContent = prod.quantity;
  document.getElementById('prodModalMinOrder').textContent = prod.minOrder || '20 kg';
  document.getElementById('prodModalDesc').textContent = prod.description;
  document.getElementById('prodModalFarmerAvatar').src = prod.farmerAvatar;
  document.getElementById('prodModalFarmerName').textContent = prod.farmerName;
  document.getElementById('enquiryProductId').value = prod.id;

  const buyerNameInput = document.getElementById('enquiryBuyerName');
  if (buyerNameInput) {
    buyerNameInput.value = AppState.currentUser
      ? AppState.currentUser.name + (AppState.currentUser.role === 'buyer' ? ' (Buyer)' : '')
      : 'Guest Buyer';
  }
  modal.setAttribute('data-current-farmer-id', prod.farmerId);
  modal.classList.add('open');
}

function triggerBuyNowFromProductModal() {
  const prodId = document.getElementById('enquiryProductId')?.value;
  closeModal('modalProductDetails');
  if (prodId) {
    openBuyNowModal(prodId);
  }
}

function viewFarmerFromProductModal() {
  const modal = document.getElementById('modalProductDetails');
  const farmerId = modal?.getAttribute('data-current-farmer-id') || 'farmer-1';
  closeModal('modalProductDetails');
  if (AppState.currentUser.role === 'farmer') {
    viewFarmerProfile(farmerId);
  } else {
    // Buyers see the farm in the farms directory
    navigateTo('farms');
  }
}

function handleSendEnquiry(event) {
  event.preventDefault();
  const prodId = document.getElementById('enquiryProductId').value;
  const prod = AppState.products.find(p => p.id === prodId);
  if (!prod) return;

  const newEnq = {
    id: 'enq-' + Date.now(),
    farmerId: prod.farmerId,
    farmerName: prod.farmerName,
    buyerName: document.getElementById('enquiryBuyerName').value.trim(),
    buyerRole: AppState.currentUser.buyerType || 'Buyer',
    buyerPhone: AppState.currentUser.phone || '+91 98000 12345',
    buyerEmail: AppState.currentUser.email || 'buyer@example.com',
    productId: prod.id,
    productName: prod.name,
    quantityRequested: document.getElementById('enquiryQuantity').value.trim(),
    message: document.getElementById('enquiryMessage').value.trim(),
    status: 'New Enquiry',
    date: 'Just now'
  };

  AppState.enquiries.unshift(newEnq);
  persistState();
  closeModal('modalProductDetails');
  showToast(`Enquiry for ${prod.name} sent to ${prod.farmerName}!`, 'success');
  renderDashboard();
}

// Add Product (FARMER ONLY)
function openAddProductModal() {
  if (AppState.currentUser.role !== 'farmer') {
    showToast('Only farmers can list products. Please switch to Farmer mode.', 'error');
    return;
  }
  document.getElementById('modalAddProduct')?.classList.add('open');
}

function handleAddProductSubmit(event) {
  event.preventDefault();
  const newProduct = {
    id: 'prod-' + Date.now(),
    name: document.getElementById('newProdName').value.trim(),
    category: document.getElementById('newProdCategory').value,
    farmerId: AppState.currentUser.id,
    farmerName: AppState.currentUser.name,
    farmerAvatar: AppState.currentUser.avatar,
    location: AppState.currentUser.location || 'Tamil Nadu',
    price: parseFloat(document.getElementById('newProdPrice').value),
    unit: document.getElementById('newProdUnit').value,
    quantity: document.getElementById('newProdQty').value.trim(),
    availability: document.getElementById('newProdAvail').value,
    isOrganic: true,
    image: document.getElementById('newProdImgPreset').value,
    description: document.getElementById('newProdDesc').value.trim(),
    minOrder: document.getElementById('newProdMinOrder').value.trim(),
    harvestDate: 'Oct 06, 2026'
  };
  AppState.products.unshift(newProduct);
  persistState();
  closeModal('modalAddProduct');
  showToast(`"${newProduct.name}" published to Marketplace!`, 'success');
  renderMarketplace();
  renderHomePreviews();
  renderFarmerProfile();
  renderDashboard();
  navigateTo('marketplace');
}

// =============================================================================
// BUY NOW — Direct Purchase Enquiry (replaces Add to Cart for buyers)
// =============================================================================
function openBuyNowModal(productId) {
  const prod = AppState.products.find(p => p.id === productId);
  if (!prod) return;

  // Populate modal
  document.getElementById('buyNowProductId').value = prod.id;
  document.getElementById('buyNowProdImg').src = prod.image;
  document.getElementById('buyNowProdName').textContent = prod.name;
  document.getElementById('buyNowProdFarmer').textContent = `by ${prod.farmerName} · ${prod.location.split(',')[0]}`;
  document.getElementById('buyNowProdPrice').textContent = `₹${prod.price}`;
  document.getElementById('buyNowProdUnit').textContent = `per ${prod.unit}`;
  document.getElementById('buyNowModalTitle').textContent = `Buy Now — ${prod.name}`;

  const user = AppState.currentUser;
  const buyerNameInput = document.getElementById('buyNowBuyerName');
  const deliveryInput = document.getElementById('buyNowDelivery');
  if (buyerNameInput) {
    buyerNameInput.value = user ? user.name : '';
    buyerNameInput.placeholder = user ? '' : 'Enter your name or business';
  }
  if (deliveryInput) {
    deliveryInput.value = user ? (user.location || '') : '';
    deliveryInput.placeholder = user ? '' : 'e.g. Bengaluru, Karnataka';
  }

  // Live estimate on qty change
  const qtyInput = document.getElementById('buyNowQty');
  const estEl = document.getElementById('buyNowEstValue');
  function calcEst() {
    const num = parseFloat(qtyInput.value) || 0;
    if (estEl) estEl.textContent = `₹${(num * prod.price).toLocaleString('en-IN')}`;
  }
  qtyInput.oninput = calcEst;
  calcEst();

  openModal('modalBuyNow');
}

function handleBuyNowSubmit(event) {
  event.preventDefault();
  const productId = document.getElementById('buyNowProductId').value;
  const prod = AppState.products.find(p => p.id === productId);
  if (!prod) return;

  const user = AppState.currentUser;
  const buyerName = document.getElementById('buyNowBuyerName').value.trim() || (user ? user.name : 'Direct Buyer');
  const delivery = document.getElementById('buyNowDelivery').value.trim();

  const enquiry = {
    id: 'enq-' + Date.now(),
    farmerId: prod.farmerId,
    farmerName: prod.farmerName,
    buyerName: buyerName,
    buyerRole: user ? (user.buyerType || user.role || 'Buyer') : 'Direct Buyer',
    buyerPhone: user ? (user.phone || '+91 98000 00000') : '+91 98000 00000',
    buyerEmail: user ? (user.email || 'buyer@veera.in') : 'buyer@veera.in',
    productId: prod.id,
    productName: prod.name,
    quantityRequested: document.getElementById('buyNowQty').value.trim(),
    deliveryAddress: delivery,
    message: document.getElementById('buyNowMessage').value.trim() || 'Direct buy enquiry via VEERA Buy Now.',
    status: 'New Enquiry',
    date: 'Just now'
  };

  AppState.enquiries.unshift(enquiry);
  persistState();
  renderDashboard();
  closeModal('modalBuyNow');
  showToast(`⚡ Buy Now order sent to ${prod.farmerName}! They will contact you for dispatch.`, 'success');
}

// =============================================================================
// CART & PROCUREMENT (BUYER ONLY — kept for legacy, cart nav removed)
// =============================================================================
function addToCart(productId) {
  if (AppState.currentUser.role !== 'buyer') {
    showToast('Buyers only: please switch to Buyer mode to add items to cart.', 'error');
    return;
  }
  const prod = AppState.products.find(p => p.id === productId);
  if (!prod) return;

  const existing = AppState.cart.find(c => c.productId === productId);
  if (existing) {
    existing.quantity += 10;
  } else {
    AppState.cart.push({
      productId: prod.id,
      name: prod.name,
      farmerName: prod.farmerName,
      farmerId: prod.farmerId,
      price: prod.price,
      unit: prod.unit,
      quantity: 10,
      image: prod.image
    });
  }
  persistState();
  renderBuyerCart();
  showToast(`${prod.name} added to your cart!`, 'success');
}

function renderBuyerCart() {
  const listEl = document.getElementById('cartItemsList');
  const totalEl = document.getElementById('cartTotalValue');
  if (!listEl) return;

  if (AppState.cart.length === 0) {
    listEl.innerHTML = `
      <div style="text-align:center; padding:40px; color:var(--text-light);">
        <div class="empty-icon-box"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg></div>
        <p style="margin-top:10px;">Your cart is empty. Browse the marketplace and add produce!</p>
        <button class="btn btn-outline" style="margin-top:12px;" onclick="navigateTo('marketplace')">Browse Marketplace</button>
      </div>`;
    if (totalEl) totalEl.textContent = '₹0';
    return;
  }

  let total = 0;
  listEl.innerHTML = AppState.cart.map(item => {
    const lineTotal = item.price * item.quantity;
    total += lineTotal;
    return `
      <div style="display:flex; gap:12px; align-items:center; padding:12px; border:1px solid var(--border-subtle); border-radius:8px; margin-bottom:10px; background:var(--bg-card-subtle);">
        <img src="${item.image}" style="width:60px; height:60px; border-radius:8px; object-fit:cover;" alt="${item.name}">
        <div style="flex:1;">
          <div style="font-weight:700; font-size:0.92rem; color:var(--primary-800);">${item.name}</div>
          <div style="font-size:0.78rem; color:var(--text-light);">from ${item.farmerName}</div>
          <div style="display:flex; align-items:center; gap:8px; margin-top:6px;">
            <button onclick="updateCartQty('${item.productId}', -5)" style="border:1px solid var(--border-subtle); background:#fff; width:24px; height:24px; border-radius:4px; cursor:pointer; font-weight:700;">−</button>
            <span style="font-weight:700; font-size:0.92rem;">${item.quantity} ${item.unit}</span>
            <button onclick="updateCartQty('${item.productId}', 5)" style="border:1px solid var(--secondary); background:var(--secondary-subtle); width:24px; height:24px; border-radius:4px; cursor:pointer; font-weight:700;">+</button>
          </div>
        </div>
        <div style="text-align:right;">
          <div style="font-weight:800; color:var(--primary-800);">₹${lineTotal.toLocaleString()}</div>
          <div style="font-size:0.72rem; color:var(--text-light);">₹${item.price}/${item.unit}</div>
          <button onclick="removeFromCart('${item.productId}')" style="border:none; background:none; color:#ef4444; cursor:pointer; font-size:0.8rem; margin-top:4px;">Remove</button>
        </div>
      </div>
    `;
  }).join('');

  if (totalEl) totalEl.textContent = `₹${total.toLocaleString()}`;
  renderRfqList();
}

function updateCartQty(productId, delta) {
  const item = AppState.cart.find(c => c.productId === productId);
  if (!item) return;
  item.quantity = Math.max(5, item.quantity + delta);
  persistState();
  renderBuyerCart();
}

function removeFromCart(productId) {
  AppState.cart = AppState.cart.filter(c => c.productId !== productId);
  persistState();
  renderBuyerCart();
  showToast('Item removed from cart.', 'info');
}

function handleCheckoutEnquiry() {
  if (AppState.cart.length === 0) {
    showToast('Your cart is empty!', 'error');
    return;
  }
  AppState.cart.forEach(item => {
    AppState.enquiries.unshift({
      id: 'enq-' + Date.now() + '-' + item.productId,
      farmerId: item.farmerId,
      farmerName: item.farmerName,
      buyerName: AppState.currentUser.name,
      buyerRole: AppState.currentUser.buyerType || 'Buyer',
      buyerPhone: AppState.currentUser.phone || '+91 00000 00000',
      buyerEmail: AppState.currentUser.email || 'buyer@veera.in',
      productId: item.productId,
      productName: item.name,
      quantityRequested: `${item.quantity} ${item.unit}`,
      message: 'Bulk procurement enquiry via VEERA Cart.',
      status: 'New Enquiry',
      date: 'Just now'
    });
  });
  persistState();
  AppState.cart = [];
  persistState();
  renderBuyerCart();
  renderDashboard();
  showToast('Bulk enquiry sent to all farmers! They will respond shortly.', 'success');
}

function handleAddRfq(event) {
  event.preventDefault();
  const newRfq = {
    id: 'rfq-' + Date.now(),
    buyerName: AppState.currentUser.name,
    buyerOrg: AppState.currentUser.buyerType || 'Independent Buyer',
    location: AppState.currentUser.location,
    cropNeeded: document.getElementById('rfqCrop').value.trim(),
    quantityNeeded: document.getElementById('rfqQty').value.trim(),
    targetPrice: document.getElementById('rfqPrice').value.trim(),
    frequency: document.getElementById('rfqFrequency').value,
    deliveryDate: 'As discussed',
    description: document.getElementById('rfqNotes').value.trim() || 'Open to negotiation.',
    status: 'Active Demand',
    responsesCount: 0,
    postedDate: 'Just now'
  };
  AppState.buyerRfqs.unshift(newRfq);
  persistState();
  renderRfqList();
  event.target.reset();
  showToast('Procurement request posted to farmer network!', 'success');
}

function renderRfqList() {
  const container = document.getElementById('rfqListContainer');
  if (!container) return;
  if (AppState.buyerRfqs.length === 0) {
    container.innerHTML = `<div style="text-align:center; padding:30px; color:var(--text-light);">No procurement requests yet. Post your first RFQ!</div>`;
    return;
  }
  container.innerHTML = AppState.buyerRfqs.map(rfq => `
    <div style="border:1px solid var(--border-subtle); border-radius:8px; padding:14px; margin-bottom:12px; background:var(--bg-card-subtle);">
      <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
        <strong style="color:var(--primary-800); font-size:0.92rem;">${rfq.cropNeeded}</strong>
        <span style="font-size:0.72rem; font-weight:700; background:var(--secondary-subtle); color:var(--primary-800); padding:2px 8px; border-radius:12px;">${rfq.status}</span>
      </div>
      <div style="font-size:0.82rem; color:var(--text-muted); margin-bottom:4px;">
        Qty: ${rfq.quantityNeeded} • Target: ${rfq.targetPrice} • Freq: ${rfq.frequency}
      </div>
      <div style="font-size:0.8rem; color:var(--text-light);">Posted: ${rfq.postedDate} • ${rfq.responsesCount} response(s)</div>
      <button style="margin-top:8px; border:none; background:none; color:#ef4444; cursor:pointer; font-size:0.78rem; font-weight:600;" 
        onclick="removeRfq('${rfq.id}')">× Cancel Request</button>
    </div>
  `).join('');
}

function removeRfq(rfqId) {
  AppState.buyerRfqs = AppState.buyerRfqs.filter(r => r.id !== rfqId);
  persistState();
  renderRfqList();
  showToast('Procurement request cancelled.', 'info');
}

// =============================================================================
// VERIFIED FARMS DIRECTORY (BUYER ONLY)
// =============================================================================
function renderFarmsDirectory(filter) {
  const grid = document.getElementById('farmsGrid');
  if (!grid) return;

  let farms = [...INITIAL_DATA.verifiedFarms];
  if (filter && filter !== 'all') {
    farms = farms.filter(f => f.crops.some(c => c.toLowerCase().includes(filter.toLowerCase())));
  }
  if (AppState.farmSearchQuery) {
    const q = AppState.farmSearchQuery.toLowerCase();
    farms = farms.filter(f =>
      f.name.toLowerCase().includes(q) ||
      f.location.toLowerCase().includes(q) ||
      f.crops.some(c => c.toLowerCase().includes(q))
    );
  }

  if (farms.length === 0) {
    grid.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding:50px; color:var(--text-light);">
      <div class="empty-icon-box"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M7 20h10"/><path d="M12 20v-8"/><path d="M12 12c-3 0-6-3-6-7 4 0 7 3 7 7z"/><path d="M12 10c3 0 6-3 6-7-4 0-7 3-7 7z"/></svg></div>
      <p>No farms matched your search. Try different keywords.</p>
    </div>`;
    return;
  }

  grid.innerHTML = farms.map(farm => `
    <div style="background:#fff; border:1px solid var(--border-subtle); border-radius:var(--radius-lg); padding:24px; box-shadow:var(--shadow-sm); transition:var(--transition);"
      onmouseover="this.style.boxShadow='var(--shadow-lg)'; this.style.transform='translateY(-4px)'"
      onmouseout="this.style.boxShadow='var(--shadow-sm)'; this.style.transform=''">
      <div style="display:flex; gap:14px; align-items:flex-start; margin-bottom:16px;">
        <img src="${farm.avatar}" alt="${farm.name}" style="width:60px; height:60px; border-radius:50%; object-fit:cover; border:3px solid var(--secondary-subtle);">
        <div>
          <h3 style="font-size:1.05rem; color:var(--primary-800); margin-bottom:2px;">${farm.name}</h3>
          <div style="font-size:0.8rem; font-weight:600; color:var(--earth-brown);">${farm.farmName}</div>
          <div style="font-size:0.75rem; color:var(--text-light);">${farm.location} • ${farm.rating}</div>
        </div>
      </div>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:14px; font-size:0.8rem;">
        <div style="background:var(--bg-card-subtle); padding:8px; border-radius:6px;">
          <span style="color:var(--text-light);">Farm Size</span>
          <div style="font-weight:700; color:var(--primary-800);">${farm.farmSize}</div>
        </div>
        <div style="background:var(--bg-card-subtle); padding:8px; border-radius:6px;">
          <span style="color:var(--text-light);">Experience</span>
          <div style="font-weight:700; color:var(--primary-800);">${farm.experience}</div>
        </div>
        <div style="background:var(--bg-card-subtle); padding:8px; border-radius:6px;">
          <span style="color:var(--text-light);">Min Dispatch</span>
          <div style="font-weight:700; color:var(--primary-800);">${farm.minDispatch}</div>
        </div>
        <div style="background:var(--bg-card-subtle); padding:8px; border-radius:6px;">
          <span style="color:var(--text-light);">Delivery</span>
          <div style="font-weight:700; color:var(--primary-800); font-size:0.72rem;">${farm.deliveryZones.split(',')[0]}...</div>
        </div>
      </div>

      <div style="margin-bottom:12px;">
        <div style="font-size:0.75rem; color:var(--text-light); margin-bottom:4px;">Key Crops:</div>
        <div style="display:flex; gap:5px; flex-wrap:wrap;">
          ${farm.crops.slice(0, 3).map(c => `<span style="background:var(--secondary-subtle); color:var(--primary-800); font-size:0.72rem; font-weight:600; padding:3px 9px; border-radius:12px;">${c}</span>`).join('')}
        </div>
      </div>

      <div style="display:flex; gap:5px; margin-bottom:14px; flex-wrap:wrap;">
        ${(farm.certifications || []).map(cert => `<span style="background:#fef3c7; color:#92400e; font-size:0.68rem; padding:2px 8px; border-radius:4px; font-weight:700;">✓ ${cert}</span>`).join('')}
      </div>

      <p style="font-size:0.82rem; color:var(--text-muted); line-height:1.45; margin-bottom:16px; border-top:1px solid var(--border-subtle); padding-top:12px;">${farm.bio}</p>

      <div style="display:flex; gap:8px;">
        <button class="btn btn-primary btn-sm" style="flex:1;" onclick="enquireFarm('${farm.id}', '${farm.name}', '${farm.phone}')">
          Contact Farmer
        </button>
        <button class="btn btn-outline btn-sm" onclick="navigateTo('marketplace')">
          Browse Products
        </button>
      </div>
    </div>
  `).join('');
}

function handleFarmSearch() {
  AppState.farmSearchQuery = document.getElementById('farmSearchInput')?.value.trim() || '';
  renderFarmsDirectory();
}

function handleFarmCropFilter() {
  const val = document.getElementById('farmCropFilter')?.value || 'all';
  renderFarmsDirectory(val === 'all' ? null : val);
}

function enquireFarm(farmId, farmerName, farmerPhone) {
  showToast(`Connecting you to ${farmerName} directly at ${farmerPhone}`, 'success');
}

// =============================================================================
// COMMUNITY FEED (both roles can view & comment; only farmers can post)
// =============================================================================
function renderCommunityPosts(filterCat) {
  const container = document.getElementById('communityPostsContainer');
  if (!container) return;

  // Insert role-based create-post box
  const isFarmer = AppState.currentUser.role === 'farmer';
  let createBoxHtml = '';
  if (isFarmer) {
    createBoxHtml = `
      <div id="communityCreatePostBox" class="feed-header-card">
        <img id="feedUserAvatar" src="${AppState.currentUser.avatar}" style="width:42px; height:42px; border-radius:50%; object-fit:cover;" alt="You">
        <button class="create-post-trigger" onclick="openCreatePostModal()">
          Share a farm harvest update, agronomy question, or field photo...
        </button>
        <button class="btn btn-primary btn-sm" onclick="openCreatePostModal()">Post</button>
      </div>`;
  } else {
    createBoxHtml = `
      <div style="background:#eff6ff; border:1px solid #bfdbfe; border-radius:var(--radius-md); padding:14px 18px; margin-bottom:18px; display:flex; align-items:center; gap:12px;">
        <span class="post-preview-tag">Preview</span>
        <div>
          <strong style="color:#1e40af; font-size:0.88rem;">Viewing as Buyer</strong>
          <p style="font-size:0.8rem; color:#3b82f6; margin-top:1px;">You can like, comment and share posts. Switch to Farmer mode to publish new posts.</p>
        </div>
        <button class="btn btn-sm" style="background:#1e40af; color:#fff; white-space:nowrap; margin-left:auto;" onclick="window.location.href='login.html'">Switch to Farmer</button>
      </div>`;
  }

  let posts = [...AppState.posts];
  if (filterCat && filterCat !== 'All') {
    posts = posts.filter(p => p.category.toLowerCase().includes(filterCat.toLowerCase()));
  }

  container.innerHTML = createBoxHtml + posts.map(post => createPostCardHtml(post)).join('');
}

function createPostCardHtml(post, isCompact) {
  const commentsHtml = (post.comments || []).map(c => `
    <div class="comment-item">
      <img src="${c.avatar}" alt="${c.author}" class="comment-avatar">
      <div class="comment-bubble">
        <div class="comment-header">
          <span class="comment-author">${c.author} <span style="font-size:0.7rem; font-weight:normal; opacity:0.8;">(${c.role})</span></span>
          <span class="comment-time">${c.time}</span>
        </div>
        <div>${c.text}</div>
      </div>
    </div>`).join('');

  return `
    <div class="post-card" id="post-${post.id}">
      <div class="post-header">
        <div class="post-author-block">
          <img src="${post.avatar}" alt="${post.author}" class="post-author-avatar">
          <div class="post-author-info">
            <h4>${post.author} <span class="author-role-badge">${post.badge || post.role}</span></h4>
            <div class="post-meta-sub">
              <span>${post.location}</span> • <span>${post.time}</span>
            </div>
          </div>
        </div>
        <span class="post-category-tag">${post.category}</span>
      </div>
      <div class="post-body"><p>${post.content}</p></div>
      ${post.image ? `<div class="post-image-container"><img src="${post.image}" alt="Field update" loading="lazy"></div>` : ''}
      <div class="post-actions-bar">
        <button class="post-action-btn ${post.likedByUser ? 'liked' : ''}" onclick="togglePostLike('${post.id}')">
          <span class="like-heart"></span> <span>${post.likes} Likes</span>
        </button>
        <button class="post-action-btn" onclick="togglePostComments('${post.id}')">
          ${post.comments ? post.comments.length : 0} Comments
        </button>
        <button class="post-action-btn" onclick="sharePost('${post.id}')">Share</button>
      </div>
      ${!isCompact ? `
        <div id="comments-${post.id}" class="comments-thread">
          <div id="commentList-${post.id}">${commentsHtml}</div>
          <form class="comment-input-row" onsubmit="handleAddComment(event, '${post.id}')">
            <input type="text" placeholder="Write a response..." required id="commentInput-${post.id}">
            <button type="submit" class="btn btn-secondary btn-sm">Send</button>
          </form>
        </div>` : ''}
    </div>`;
}

function filterCommunityPosts(cat) {
  renderCommunityPosts(cat);
}
function togglePostLike(postId) {
  const post = AppState.posts.find(p => p.id === postId);
  if (!post) return;
  post.likedByUser = !post.likedByUser;
  post.likes += post.likedByUser ? 1 : -1;
  persistState();
  const card = document.getElementById(`post-${postId}`);
  if (card) {
    const btn = card.querySelector('.post-action-btn');
    if (btn) btn.innerHTML = `<span class="like-heart"></span> <span>${post.likes} Likes</span>`;
    if (btn) btn.classList.toggle('liked', post.likedByUser);
  }
}
function togglePostComments(postId) {
  const thread = document.getElementById(`comments-${postId}`);
  if (thread) thread.style.display = thread.style.display === 'none' ? 'block' : 'none';
}
function handleAddComment(event, postId) {
  event.preventDefault();
  const input = document.getElementById(`commentInput-${postId}`);
  const text = input?.value.trim();
  if (!text) return;
  const post = AppState.posts.find(p => p.id === postId);
  if (!post) return;
  if (!post.comments) post.comments = [];
  const c = {
    id: 'c-' + Date.now(),
    author: AppState.currentUser.name,
    role: AppState.currentUser.role === 'farmer' ? 'Farmer' : 'Buyer',
    avatar: AppState.currentUser.avatar,
    text, time: 'Just now'
  };
  post.comments.push(c);
  persistState();
  input.value = '';
  const cl = document.getElementById(`commentList-${postId}`);
  if (cl) {
    const div = document.createElement('div');
    div.className = 'comment-item';
    div.innerHTML = `
      <img src="${c.avatar}" alt="${c.author}" class="comment-avatar">
      <div class="comment-bubble">
        <div class="comment-header">
          <span class="comment-author">${c.author} <span style="font-size:0.7rem;opacity:0.8;">(${c.role})</span></span>
          <span class="comment-time">Just now</span>
        </div>
        <div>${c.text}</div>
      </div>`;
    cl.appendChild(div);
  }
  showToast('Comment added!', 'success');
}
function sharePost(postId) {
  showToast('Post link copied to clipboard!', 'info');
}
function openCreatePostModal() {
  if (AppState.currentUser.role !== 'farmer') {
    showToast('Only farmers can publish posts. Switch to Farmer mode.', 'error');
    return;
  }
  document.getElementById('modalCreatePost')?.classList.add('open');
}
function handleCreatePostSubmit(event) {
  event.preventDefault();
  const newPost = {
    id: 'post-' + Date.now(),
    author: AppState.currentUser.name,
    role: 'Farmer',
    badge: 'Verified Grower',
    location: AppState.currentUser.location || 'Tamil Nadu',
    avatar: AppState.currentUser.avatar,
    time: 'Just now',
    category: document.getElementById('newPostCategory').value,
    content: document.getElementById('newPostContent').value.trim(),
    image: document.getElementById('newPostImgPreset').value,
    likes: 1, likedByUser: true, comments: []
  };
  AppState.posts.unshift(newPost);
  persistState();
  closeModal('modalCreatePost');
  showToast('Post published successfully!', 'success');
  renderCommunityPosts();
  renderHomePreviews();
  renderDashboard();
  navigateTo('community');
}

// =============================================================================
// AI AGRICULTURE TOOLS (FARMER ONLY — access already guarded by navigateTo)
// =============================================================================
function switchAiTab(tabKey, btnEl) {
  AppState.activeAiTab = tabKey;
  document.querySelectorAll('.ai-tab-btn').forEach(b => b.classList.remove('active'));
  if (btnEl) {
    btnEl.classList.add('active');
  } else {
    const btns = document.querySelectorAll('.ai-tab-btn');
    if (tabKey === 'crop-rec') btns[0]?.classList.add('active');
    if (tabKey === 'disease-scan') btns[1]?.classList.add('active');
    if (tabKey === 'market-intel') btns[2]?.classList.add('active');
  }
  document.getElementById('aiToolCropRec')?.classList.toggle('active', tabKey === 'crop-rec');
  document.getElementById('aiToolDiseaseScan')?.classList.toggle('active', tabKey === 'disease-scan');
  document.getElementById('aiToolMarketIntel')?.classList.toggle('active', tabKey === 'market-intel');
  if (tabKey === 'market-intel') updateMarketIntelligence();
}

function runCropRecommendation() {
  const soil = document.getElementById('cropRecSoil').value;
  const season = document.getElementById('cropRecSeason').value;
  const loc = document.getElementById('cropRecLocation').value;
  let crop = 'Shimla Hybrid Tomato', reason = '', yieldVal = '22-25 T/ac', waterSys = 'Drip Fertigation';

  if (soil.includes('Black Cotton')) {
    if (season === 'Kharif') {
      crop = 'Bt Hybrid Cotton'; reason = `Deep black cotton soil and monsoon rains in ${loc} are ideal for cotton vegetative growth.`; yieldVal = '12-14 Q/ac'; waterSys = 'Furrow / Rainfed';
    } else {
      crop = 'Desi Bengal Gram (Chickpea)'; reason = `Residual soil moisture in black soil during Rabi supports legume nodulation without heavy irrigation.`; yieldVal = '8-10 Q/ac'; waterSys = 'Minimal Sprinkler';
    }
  } else if (soil.includes('Loamy')) {
    if (season === 'Rabi') {
      crop = 'Premium Cauliflower & Cabbage'; reason = `Loamy soil balanced drainage enables cool-season Brassica curd formation with high market value.`; yieldVal = '18-20 T/ac'; waterSys = 'Micro-Sprinkler';
    } else {
      crop = 'Shimla Hybrid Tomato'; reason = `Loamy soil, Kharif humidity, and drip irrigation are optimal for indeterminate hybrid tomato in the ${loc} zone.`; yieldVal = '24-28 T/ac'; waterSys = 'Drip Fertigation';
    }
  } else if (soil.includes('Red')) {
    crop = 'TMV-7 Groundnut & Red Gram'; reason = `Porous red laterite soil enables peg penetration and reduces pod rot risk.`; yieldVal = '14-16 Q/ac'; waterSys = 'Rainfed + Life Irrigation';
  } else if (soil.includes('Alluvial')) {
    crop = 'Sharbati Durum Wheat'; reason = `Deep alluvial silt supports long panicle grain filling and high gluten formation.`; yieldVal = '20-22 Q/ac'; waterSys = 'Canal / Border Irrigation';
  } else {
    reason = `Sandy loam with good internal drainage supports quick-maturing horticultural crops.`; yieldVal = '18-20 T/ac'; waterSys = 'Drip Irrigation';
  }

  document.getElementById('recCropName').textContent = crop;
  document.getElementById('recCropReason').textContent = reason;
  document.getElementById('recCropYield').textContent = yieldVal;
  document.getElementById('recCropWater').textContent = waterSys;
  showToast(`AI Recommendation: ${crop}`, 'success');
}

function loadSampleDisease(index, el) {
  AppState.currentDiseaseSampleIndex = index;
  const sample = INITIAL_DATA.sampleDiseases[index];
  if (!sample) return;
  const preview = document.getElementById('diseasePreviewImg');
  if (preview) preview.src = sample.sampleThumb;
  document.querySelectorAll('.sample-thumb-item').forEach(i => i.classList.remove('selected'));
  if (el) el.classList.add('selected');
  populateDiseaseResult(sample);
}

function triggerDiseaseImageUpload() {
  document.getElementById('diseaseFileInput')?.click();
}
function handleDiseaseFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    const preview = document.getElementById('diseasePreviewImg');
    if (preview) preview.src = e.target.result;
    analyzeCropDisease();
  };
  reader.readAsDataURL(file);
}
function analyzeCropDisease() {
  const beam = document.getElementById('scanLaserBeam');
  const btn = document.getElementById('btnAnalyzeDisease');
  if (beam) beam.style.display = 'block';
  if (btn) { btn.disabled = true; btn.textContent = 'Analyzing crop image...'; }
  setTimeout(() => {
    if (beam) beam.style.display = 'none';
    if (btn) { btn.disabled = false; btn.textContent = 'Analyze Crop Image'; }
    const sample = INITIAL_DATA.sampleDiseases[AppState.currentDiseaseSampleIndex] || INITIAL_DATA.sampleDiseases[0];
    populateDiseaseResult(sample);
    showToast(`Diagnostic complete: ${sample.name} (${sample.confidence}% confidence)`, 'success');
  }, 1200);
}
function populateDiseaseResult(sample) {
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  set('diseaseName', sample.name);
  set('diseaseCropType', `Crop: ${sample.crop} • Vision Diagnostic`);
  set('diseaseConfidenceVal', `${sample.confidence}%`);
  const bar = document.getElementById('diseaseConfidenceBar');
  if (bar) bar.style.width = `${sample.confidence}%`;
  set('diseaseSymptoms', sample.symptoms);
  set('diseaseAction', sample.suggestedAction);
  set('diseaseBioRemedy', sample.bioRemedy);
}

function updateMarketIntelligence() {
  const crop = document.getElementById('mandiCropSelect')?.value || 'Tomato';
  const mandi = document.getElementById('mandiLocationSelect')?.value || 'Coimbatore Mandi';
  const cropGroup = INITIAL_DATA.marketData[crop] || INITIAL_DATA.marketData['Tomato'];
  const info = cropGroup[mandi] || Object.values(cropGroup)[0];

  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  set('mandiCurrentPrice', `₹${info.currentPrice} / kg`);
  set('mandiDemand', info.demand);
  set('mandiTrend', `${info.trend}`);
  set('mandiAdvisory', info.advisory);
  renderSvgPriceChart(info.history);
}

function renderSvgPriceChart(history) {
  const container = document.getElementById('mandiSvgChartContainer');
  if (!container || !history || history.length === 0) return;
  const W = 640, H = 200, P = 36;
  const prices = history.map(h => h.price);
  const minP = Math.min(...prices) - 2, maxP = Math.max(...prices) + 2;
  const pts = history.map((item, i) => ({
    x: P + (i / (history.length - 1)) * (W - P * 2),
    y: H - P - ((item.price - minP) / (maxP - minP)) * (H - P * 2),
    day: item.day, price: item.price
  }));
  const pathD = pts.reduce((acc, pt, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`, '');
  const areaD = `${pathD} L ${pts[pts.length - 1].x} ${H - P} L ${pts[0].x} ${H - P} Z`;
  const circlesHtml = pts.map(pt => `
    <g>
      <circle cx="${pt.x}" cy="${pt.y}" r="5" fill="#22C55E" stroke="#fff" stroke-width="2"/>
      <text x="${pt.x}" y="${H - 12}" font-size="11" fill="#6b7280" text-anchor="middle" font-weight="600">${pt.day}</text>
      <text x="${pt.x}" y="${pt.y - 10}" font-size="11" fill="#14532D" text-anchor="middle" font-weight="700">₹${pt.price}</text>
    </g>`).join('');
  container.innerHTML = `
    <svg viewBox="0 0 ${W} ${H}" style="width:100%;height:100%;overflow:visible;">
      <defs>
        <linearGradient id="chartGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#22C55E" stop-opacity="0.35"/>
          <stop offset="100%" stop-color="#22C55E" stop-opacity="0"/>
        </linearGradient>
      </defs>
      <line x1="${P}" y1="${H - P}" x2="${W - P}" y2="${H - P}" stroke="#e5e7eb" stroke-width="1.5"/>
      <path d="${areaD}" fill="url(#chartGrad)"/>
      <path d="${pathD}" fill="none" stroke="#166534" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
      ${circlesHtml}
    </svg>`;
}

// =============================================================================
// OPPORTUNITIES (FARMER ONLY — access guarded by navigateTo)
// =============================================================================
function renderOpportunities(filter) {
  const grid = document.getElementById('opportunitiesGrid');
  if (!grid) return;
  let opps = [...INITIAL_DATA.opportunities];
  if (filter && filter !== 'All') {
    opps = opps.filter(o => o.type.toLowerCase() === filter.toLowerCase());
  }
  grid.innerHTML = opps.map(opp => `
    <div class="opp-card">
      <span class="opp-type-badge">${opp.type}</span>
      <h3 class="opp-title">${opp.title}</h3>
      <div class="opp-org-line">${opp.organization} • ${opp.location}</div>
      <p class="opp-desc">${opp.description}</p>
      <div class="opp-tags-row">
        ${(opp.tags || []).map(t => `<span class="opp-tag">#${t}</span>`).join('')}
      </div>
      <div class="opp-footer-row">
        <span class="opp-stipend">${opp.stipend}</span>
        <button class="btn btn-primary btn-sm" onclick="openOpportunityModal('${opp.id}')">View & Apply</button>
      </div>
    </div>`).join('');
}

function filterOpportunities(cat, btnEl) {
  document.querySelectorAll('.opps-filter-bar .category-pill').forEach(b => b.classList.remove('active'));
  if (btnEl) btnEl.classList.add('active');
  renderOpportunities(cat);
}

function openOpportunityModal(oppId) {
  const opp = INITIAL_DATA.opportunities.find(o => o.id === oppId);
  if (!opp) return;
  document.getElementById('oppModalBadge').textContent = opp.type;
  document.getElementById('oppModalMainTitle').textContent = opp.title;
  document.getElementById('oppModalOrg').textContent = `${opp.organization} • ${opp.area}`;
  document.getElementById('oppModalLocation').textContent = opp.location;
  document.getElementById('oppModalStipend').textContent = opp.stipend;
  document.getElementById('oppModalDesc').textContent = opp.description;
  const nameEl = document.getElementById('oppApplyName');
  const emailEl = document.getElementById('oppApplyEmail');
  if (nameEl) nameEl.value = AppState.currentUser.name;
  if (emailEl) emailEl.value = AppState.currentUser.email || '';
  document.getElementById('modalOpportunity')?.classList.add('open');
}
function handleApplyOpportunity(event) {
  event.preventDefault();
  closeModal('modalOpportunity');
  showToast('Application submitted successfully! The organisation will contact you.', 'success');
}

// =============================================================================
// USER PROFILE CONTROLLER (Dynamic for both Farmer and Buyer)
// =============================================================================
function renderFarmerProfile(farmerId = 'farmer-1') {
  const farmerProds = AppState.products.filter(p => p.farmerId === farmerId);
  const container = document.getElementById('farmerProfileProductsContainer');
  if (container) container.innerHTML = farmerProds.map(createProductCardHtml).join('');

  const farmerPosts = AppState.posts.filter(p => p.author === 'Arun Kumar' || p.farmerId === farmerId);
  const postsContainer = document.getElementById('farmerProfilePostsContainer');
  if (postsContainer) postsContainer.innerHTML = farmerPosts.map(p => createPostCardHtml(p)).join('');
}

function viewFarmerProfile(farmerId) {
  if (AppState.currentUser && AppState.currentUser.role === 'buyer') {
    navigateTo('farms');
    showToast('Viewing farm directory. Click "Contact Farmer" to connect directly.', 'info');
    return;
  }
  renderFarmerProfile(farmerId);
  navigateTo('profile');
}

function renderUserProfile() {
  const user = AppState.currentUser;
  if (!user) {
    window.location.href = 'login.html';
    return;
  }
  const isFarmer = (user.role === 'farmer');

  // Cover image
  const coverImg = document.getElementById('profileCoverBannerImg');
  if (coverImg) {
    coverImg.src = isFarmer
      ? 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80'
      : 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80';
  }

  // Avatar & Header Details
  const avatarEl = document.getElementById('farmerProfileAvatar');
  const nameEl = document.getElementById('farmerProfileName');
  const badgeEl = document.getElementById('farmerProfileRoleBadge');
  const titleEl = document.getElementById('farmerProfileTitle');
  const bioEl = document.getElementById('farmerProfileBio');
  const contactEl = document.getElementById('profileUserContact');

  if (avatarEl) avatarEl.src = user.avatar;
  if (nameEl) nameEl.textContent = user.name;
  if (badgeEl) {
    badgeEl.className = `role-tag-badge ${user.role}`;
    badgeEl.textContent = isFarmer ? '✓ Verified Producer' : '✓ Verified Buyer & Procurement';
  }
  if (titleEl) {
    titleEl.textContent = user.title || (isFarmer ? 'Registered Farmer' : (user.buyerType || 'Procurement Lead'));
  }
  if (bioEl) {
    bioEl.textContent = user.bio || (isFarmer ? 'Third-generation farmer practicing sustainable precision drip agriculture.' : 'Commercial buyer sourcing chemical-free produce.');
  }
  if (contactEl) {
    const contactParts = [];
    if (user.phone) contactParts.push(user.phone);
    if (user.email) contactParts.push(user.email);
    contactEl.textContent = contactParts.join(' • ') || 'Contact available';
  }

  // Meta specs
  const locEl = document.getElementById('farmerProfileLocation');
  const sizeEl = document.getElementById('farmerProfileSize');
  const expEl = document.getElementById('farmerProfileExp');
  const labelSize = document.getElementById('specLabelSize');
  const labelExp = document.getElementById('specLabelExp');

  if (locEl) locEl.textContent = user.location || 'India';
  if (isFarmer) {
    if (labelSize) labelSize.textContent = 'Farm Size:';
    if (sizeEl) sizeEl.textContent = user.farmSize || '4.5 Acres';
    if (labelExp) labelExp.textContent = 'Experience:';
    if (expEl) expEl.textContent = user.experience || '5+ Years';
  } else {
    if (labelSize) labelSize.textContent = 'Category:';
    if (sizeEl) sizeEl.textContent = user.buyerType || 'Commercial Buyer';
    if (labelExp) labelExp.textContent = 'Interests:';
    if (expEl) expEl.textContent = (user.interests || ['Vegetables', 'Fruits']).slice(0, 2).join(', ');
  }

  // Tags list
  const tagsHeading = document.getElementById('profileTagsHeading');
  const tagsList = document.getElementById('farmerProfileCrops');
  if (tagsHeading) {
    tagsHeading.textContent = isFarmer ? 'Primary Crops Cultivated:' : 'Procurement Sourcing Categories:';
  }
  if (tagsList) {
    const items = isFarmer ? (user.crops || ['Seasonal Produce']) : (user.interests || ['Vegetables', 'Fruits', 'Grains']);
    tagsList.innerHTML = items.map(t => `<span class="crop-tag-chip">${t}</span>`).join('');
  }

  // Action buttons
  const actBtns = document.getElementById('profileActionButtons');
  if (actBtns) {
    actBtns.innerHTML = isFarmer
      ? `<button class="btn btn-outline" onclick="openCreatePostModal()">Share Update</button>
         <button class="btn btn-primary" onclick="openAddProductModal()">+ List Produce</button>`
      : `<button class="btn btn-outline" onclick="navigateTo('cart')">Post RFQ</button>
         <button class="btn btn-primary" onclick="navigateTo('marketplace')">Browse Marketplace</button>`;
  }

  // Tabs & Lower Content
  const tabBtn1 = document.getElementById('tabBtnFarmerProds');
  const tabBtn2 = document.getElementById('tabBtnFarmerPosts');
  const cProds = document.getElementById('farmerProfileProductsContainer');
  const cPosts = document.getElementById('farmerProfilePostsContainer');

  if (isFarmer) {
    if (tabBtn1) tabBtn1.textContent = 'Farm Products Listed';
    if (tabBtn2) tabBtn2.textContent = 'Community Updates & Field Notes';
    renderFarmerProfile(user.id);
  } else {
    if (tabBtn1) tabBtn1.textContent = 'My Procurement Requests (RFQs)';
    if (tabBtn2) tabBtn2.textContent = 'My Sent Enquiries';
    renderBuyerProfileContent(cProds, cPosts);
  }
}

function renderBuyerProfileContent(rfqContainer, enquiryContainer) {
  if (rfqContainer) {
    if (AppState.buyerRfqs.length === 0) {
      rfqContainer.innerHTML = '<div style="text-align:center; padding:30px; color:var(--text-light); grid-column:1/-1;">No procurement requests posted yet.</div>';
    } else {
      rfqContainer.innerHTML = AppState.buyerRfqs.map(rfq => `
        <div class="product-card" style="padding:16px;">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
            <strong style="color:var(--primary-800); font-size:1.05rem;">${rfq.cropNeeded}</strong>
            <span class="enquiry-status-pill status-responded">${rfq.status}</span>
          </div>
          <div style="font-size:0.85rem; color:var(--text-muted); margin-bottom:6px;">
            Requirement: <strong>${rfq.quantityNeeded}</strong> • Target: <strong>${rfq.targetPrice}</strong>
          </div>
          <div style="font-size:0.82rem; color:var(--text-light); margin-bottom:12px;">
            Frequency: ${rfq.frequency} • Location: ${rfq.location}
          </div>
          <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:12px; line-height:1.4;">${rfq.description}</p>
          <button class="btn btn-outline btn-sm" onclick="navigateTo('cart')">Manage RFQ</button>
        </div>
      `).join('');
    }
  }

  if (enquiryContainer) {
    if (AppState.enquiries.length === 0) {
      enquiryContainer.innerHTML = '<div style="text-align:center; padding:30px; color:var(--text-light);">No enquiries sent yet.</div>';
    } else {
      enquiryContainer.innerHTML = AppState.enquiries.map(enq => `
        <div class="enquiry-item-card" style="margin-bottom:12px;">
          <div class="enquiry-top-row">
            <div>
              <strong style="color:var(--primary-800);">Enquiry for ${enq.productName}</strong>
              <div style="font-size:0.75rem; color:var(--text-light);">To grower: ${enq.farmerName}</div>
            </div>
            <span class="enquiry-status-pill status-responded">${enq.status}</span>
          </div>
          <div style="font-size:0.85rem; margin:6px 0; color:var(--text-muted);">
            Quantity: <strong>${enq.quantityRequested}</strong> • Date: ${enq.date}
          </div>
          <div style="font-size:0.82rem; color:var(--text-light);">${enq.message}</div>
        </div>
      `).join('');
    }
  }
}

function switchFarmerProfileTab(tab) {
  const btnProds = document.getElementById('tabBtnFarmerProds');
  const btnPosts = document.getElementById('tabBtnFarmerPosts');
  const cProds = document.getElementById('farmerProfileProductsContainer');
  const cPosts = document.getElementById('farmerProfilePostsContainer');
  if (tab === 'products') {
    btnProds?.classList.add('active'); btnPosts?.classList.remove('active');
    if (cProds) cProds.style.display = 'grid';
    if (cPosts) cPosts.style.display = 'none';
  } else {
    btnPosts?.classList.add('active'); btnProds?.classList.remove('active');
    if (cProds) cProds.style.display = 'none';
    if (cPosts) cPosts.style.display = 'block';
  }
}

// =============================================================================
// ROLE-DIFFERENTIATED DASHBOARD (PRD Section 14)
// =============================================================================
function renderDashboard() {
  const isFarmer = AppState.currentUser.role === 'farmer';

  const titleEl = document.getElementById('dashWelcomeTitle');
  const subEl = document.getElementById('dashWelcomeSubtitle');
  if (titleEl) titleEl.textContent = `Welcome back, ${AppState.currentUser.name}`;
  if (subEl) subEl.textContent = isFarmer
    ? 'Farmer Command Center — Manage listed produce, buyer enquiries, and profile reach.'
    : 'Buyer Hub — Track your direct farm enquiries, cart, and procurement requests.';

  // Stats cards
  const statsGrid = document.getElementById('dashStatsGrid');
  if (statsGrid) {
    if (isFarmer) {
      const myProds = AppState.products.filter(p =>
        p.farmerId === AppState.currentUser.id || p.farmerId === 'farmer-1').length;
      const enqCount = AppState.enquiries.length;
      statsGrid.innerHTML = `
        <div class="dash-stat-card"><div class="dash-stat-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg></div><div>
          <div class="dash-stat-num">${myProds} Listed</div>
          <div class="dash-stat-label">Farm Products</div></div></div>
        <div class="dash-stat-card"><div class="dash-stat-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg></div><div>
          <div class="dash-stat-num">${enqCount} Received</div>
          <div class="dash-stat-label">Buyer Enquiries</div></div></div>
        <div class="dash-stat-card"><div class="dash-stat-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></div><div>
          <div class="dash-stat-num">124</div>
          <div class="dash-stat-label">Profile Views</div></div></div>
        <div class="dash-stat-card"><div class="dash-stat-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></div><div>
          <div class="dash-stat-num">${AppState.posts.length}</div>
          <div class="dash-stat-label">Community Posts</div></div></div>`;
    } else {
      statsGrid.innerHTML = `
        <div class="dash-stat-card"><div class="dash-stat-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg></div><div>
          <div class="dash-stat-num">${AppState.enquiries.length} Sent</div>
          <div class="dash-stat-label">Active Enquiries</div></div></div>
        <div class="dash-stat-card"><div class="dash-stat-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg></div><div>
          <div class="dash-stat-num">${AppState.cart.length} Items</div>
          <div class="dash-stat-label">In My Cart</div></div></div>
        <div class="dash-stat-card"><div class="dash-stat-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg></div><div>
          <div class="dash-stat-num">${AppState.buyerRfqs.length} Active</div>
          <div class="dash-stat-label">Procurement RFQs</div></div></div>
        <div class="dash-stat-card"><div class="dash-stat-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 20h10"/><path d="M12 20v-8"/><path d="M12 12c-3 0-6-3-6-7 4 0 7 3 7 7z"/><path d="M12 10c3 0 6-3 6-7-4 0-7 3-7 7z"/></svg></div><div>
          <div class="dash-stat-num">5 Connected</div>
          <div class="dash-stat-label">Verified Farms</div></div></div>`;
    }
  }

  // Toggle enquiry panels
  const farmerPanel = document.getElementById('dashFarmerEnquiriesPanel');
  const buyerPanel = document.getElementById('dashBuyerEnquiriesPanel');
  if (farmerPanel) farmerPanel.style.display = isFarmer ? 'block' : 'none';
  if (buyerPanel) buyerPanel.style.display = isFarmer ? 'none' : 'block';

  if (isFarmer) {
    const list = document.getElementById('dashEnquiriesList');
    if (list) {
      if (AppState.enquiries.length === 0) {
        list.innerHTML = `<div style="text-align:center; padding:30px; color:var(--text-light);">No enquiries yet. List your produce in the Marketplace!</div>`;
      } else {
        list.innerHTML = AppState.enquiries.map(enq => `
          <div class="enquiry-item-card">
            <div class="enquiry-top-row">
              <div>
                <strong style="color:var(--primary-800);">${enq.buyerName}</strong>
                <span style="font-size:0.75rem; color:var(--text-light); margin-left:6px;">(${enq.buyerRole})</span>
              </div>
              <span class="enquiry-status-pill ${enq.status.includes('New') ? 'status-new' : 'status-responded'}">${enq.status}</span>
            </div>
            <div style="font-size:0.85rem; margin-bottom:6px;">
              Wants: <strong style="color:var(--primary-800);">${enq.quantityRequested}</strong> of <em>${enq.productName}</em>
            </div>
            <p style="font-size:0.82rem; color:var(--text-muted); background:#fff; padding:8px 12px; border-radius:6px; border:1px solid var(--border-subtle); margin-bottom:10px;">
              "${enq.message}"
            </p>
            <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.78rem;">
              <span style="color:var(--text-light);">${enq.buyerPhone} • ${enq.date}</span>
              <button class="btn btn-secondary btn-sm" onclick="respondToEnquiry('${enq.id}')">Reply to Buyer</button>
            </div>
          </div>`).join('');
      }
    }

    // Farmer quick actions
    const qaGrid = document.querySelector('.quick-actions-grid');
    if (qaGrid) {
      qaGrid.innerHTML = `
        <div class="quick-action-tile" onclick="openAddProductModal()">
          <div class="quick-action-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></div>
          <div class="quick-action-title">List Produce</div>
        </div>
        <div class="quick-action-tile" onclick="openCreatePostModal()">
          <div class="quick-action-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></div>
          <div class="quick-action-title">Create Post</div>
        </div>
        <div class="quick-action-tile" onclick="navigateTo('ai')">
          <div class="quick-action-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="15" x2="23" y2="15"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="15" x2="4" y2="15"/></svg></div>
          <div class="quick-action-title">AI Tools</div>
        </div>
        <div class="quick-action-tile" onclick="navigateTo('opportunities')">
          <div class="quick-action-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/></svg></div>
          <div class="quick-action-title">Opportunities</div>
        </div>`;
    }
  } else {
    // Buyer enquiries sent
    const list = document.getElementById('dashBuyerEnquiriesList');
    if (list) {
      if (AppState.enquiries.length === 0) {
        list.innerHTML = `<div style="text-align:center; padding:30px; color:var(--text-light);">No enquiries sent yet. Browse the marketplace!</div>`;
      } else {
        list.innerHTML = AppState.enquiries.slice(0, 5).map(enq => `
          <div class="enquiry-item-card">
            <div class="enquiry-top-row">
              <div>
                <strong style="color:var(--primary-800);">Sent to ${enq.farmerName}</strong>
                <div style="font-size:0.75rem; color:var(--text-light);">${enq.productName}</div>
              </div>
              <span class="enquiry-status-pill status-responded">${enq.status}</span>
            </div>
            <div style="font-size:0.85rem; margin:6px 0; color:var(--text-muted);">
              Quantity: <strong>${enq.quantityRequested}</strong> • ${enq.date}
            </div>
            <div style="display:flex; gap:8px;">
              <button class="btn btn-outline btn-sm" onclick="navigateTo('farms')">View Farm</button>
              <button class="btn btn-primary btn-sm" onclick="navigateTo('marketplace')">Browse More</button>
            </div>
          </div>`).join('');
      }
    }

    // Buyer quick actions
    const qaGrid = document.querySelector('.quick-actions-grid');
    if (qaGrid) {
      qaGrid.innerHTML = `
        <div class="quick-action-tile" onclick="navigateTo('farms')">
          <div class="quick-action-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 20h10"/><path d="M12 20v-8"/><path d="M12 12c-3 0-6-3-6-7 4 0 7 3 7 7z"/><path d="M12 10c3 0 6-3 6-7-4 0-7 3-7 7z"/></svg></div>
          <div class="quick-action-title">Find Farms</div>
        </div>
        <div class="quick-action-tile" onclick="navigateTo('marketplace')">
          <div class="quick-action-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg></div>
          <div class="quick-action-title">Marketplace</div>
        </div>
        <div class="quick-action-tile" onclick="navigateTo('cart')">
          <div class="quick-action-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg></div>
          <div class="quick-action-title">My Cart</div>
        </div>
        <div class="quick-action-tile" onclick="navigateTo('community')">
          <div class="quick-action-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></div>
          <div class="quick-action-title">Community</div>
        </div>`;
    }
  }
}

function respondToEnquiry(enqId) {
  const enq = AppState.enquiries.find(e => e.id === enqId);
  if (!enq) return;
  enq.status = 'Responded';
  persistState();
  renderDashboard();
  showToast(`Marked enquiry from ${enq.buyerName} as Responded!`, 'success');
}

// =============================================================================
// MODALS & TOASTS
// =============================================================================
function openModal(modalId) {
  document.getElementById(modalId)?.classList.add('open');
}

function closeModal(modalId) {
  document.getElementById(modalId)?.classList.remove('open');
}

document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-backdrop')) e.target.classList.remove('open');
});

function showToast(message, type = 'success') {
  const shelf = document.getElementById('toastShelf');
  if (!shelf) return;
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  const toastIcon = type === 'success' ? '<span class="toast-badge-success">✓</span>' : type === 'error' ? '<span class="toast-badge-error">✕</span>' : '<span class="toast-badge-info">i</span>';
  toast.innerHTML = `${toastIcon}<div style="flex:1;">${message}</div>`;
  shelf.appendChild(toast);
  setTimeout(() => {
    toast.style.cssText = 'opacity:0; transform:translateX(50px); transition:all 0.3s ease;';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
