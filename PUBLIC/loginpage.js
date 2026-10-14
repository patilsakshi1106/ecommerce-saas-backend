tailwind.config = {
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                sans: ['Plus Jakarta Sans', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
            colors: {
                alabaster: '#F7F5F0',
                espresso: '#161514',
                surfaceDark: '#211F1D',
                ink: '#1C1917',
                cream: '#F5F2EB',
                mutedLight: '#78716C',
                mutedDark: '#A8A29E',
                borderLight: '#E7E2DA',
                borderDark: '#33302C',
                terracotta: {
                    DEFAULT: '#B85D3B',
                     dark: '#D47553',
                },
                sage: '#2E5A44'
            }
        }
    }
}


    /* =================================================================== -->
    <!-- CONCISE MODULAR APPLICATION SCRIPT                                  -->
    <!-- =================================================================== */

const app = {
    role: 'merchant', // 'merchant' | 'customer'
    mode: 'signup',   // 'signup' | 'login'
    slideIdx: 0,
    autoScrollEnabled: true,
    autoScrollDir: 1,
    isUserInteractingLookbook: false,
    lastWindowScrollY: 0,

    photos: [
        {
            tag: '🏢 Verified B2B Supply',
            hub: 'Surat • Mumbai • Tiruppur',
            title: 'Direct Factory-to-Retail Sourcing',
            desc: 'Register your wholesale store with 15-digit GST verification or sign in as a retail customer.',
            url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1000&q=80'
        },
        {
            tag: '🧵 Apparel & Textiles',
            hub: 'Surat • Ahmedabad • Ludhiana',
            title: 'Mill-Direct Fabrics & Garment Lots',
            desc: 'Source woven cottons, knitwear, and finished apparel directly from GST-verified textile mills.',
            url: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1000&q=80'
        },
        {
            tag: '📦 Warehousing & Dispatch',
            hub: 'Pune • Delhi NCR • Bhiwandi',
            title: 'Pan-India B2B Corridor Fulfillment',
            desc: 'Streamlined factory dispatch and consolidated B2B cartons for emerging Indian retail brands.',
            url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1000&q=80'
        },
        {
            tag: '🏺 Home, Kitchen & Ceramics',
            hub: 'Jaipur • Moradabad • Khurja',
            title: 'Artisanal Home & Lifestyle Goods',
            desc: 'Handcrafted stoneware, brass kitchenware, and decor lots ready for independent retail storefronts.',
            url: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=1000&q=80'
        },
        {
            tag: '👞 Footwear & Leather Craft',
            hub: 'Agra • Kanpur • Kolkata',
            title: 'Genuine Leather & Retail Footwear Lots',
            desc: 'Factory-direct formal, casual, and artisanal leather goods crafted for high-margin retail.',
            url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1000&q=80'
        },
        {
            tag: '🌿 Eco Kraft Packaging',
            hub: 'Mumbai • Bengaluru • Chennai',
            title: 'Custom Biodegradable Brand Packaging',
            desc: 'Recyclable corrugated mailers, jute pouches, and custom-printed boxes for D2C startups.',
            url: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?auto=format&fit=crop&w=1000&q=80'
        },
        {
            tag: '🛍️ Modern Retail Storefronts',
            hub: 'Bengaluru • Hyderabad • Mumbai',
            title: 'Empowering Independent Shop Owners',
            desc: 'Launch and restock your retail business with transparent factory pricing and zero middlemen.',
            url: 'https://images.unsplash.com/photo-1556742049-0a67d553c2a5?auto=format&fit=crop&w=1000&q=80'
        }
    ],

    init() {
        // Theme setup
        if (localStorage.getItem('kb_theme') === 'dark') {
            document.documentElement.classList.add('dark');
            document.getElementById('theme-icon').className = 'fa-solid fa-sun';
        }

        // Render galleries & auth state
        this.renderSlide();
        this.renderLookbook();
        this.renderPhotoModal();
        this.updateAuthUI();
        this.initLookbookScroller();

        // Auto-rotate auth photo every 5.5s
        setInterval(() => this.stepSlide(1), 5500);

        // Restore session if present
        const saved = localStorage.getItem('kb_session');
        if (saved) {
            try { this.showSession(JSON.parse(saved)); } catch (e) {}
        }
    },

    initLookbookScroller() {
        const vp = document.getElementById('lookbook-viewport');
        if (!vp) return;

        // 1. Update progress bar whenever lookbook scrolls horizontally
        vp.addEventListener('scroll', () => this.updateLookbookProgress(), { passive: true });

        // 2. Mouse drag-to-scroll support
        let isDown = false;
        let startX = 0;
        let scrollStart = 0;

        vp.addEventListener('mousedown', (e) => {
            if (e.target.closest('button')) return;
            isDown = true;
            this.isUserInteractingLookbook = true;
            startX = e.pageX - vp.offsetLeft;
            scrollStart = vp.scrollLeft;
        });

        window.addEventListener('mouseup', () => {
            if (isDown) {
                isDown = false;
                setTimeout(() => { this.isUserInteractingLookbook = false; }, 1200);
            }
        });

        vp.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - vp.offsetLeft;
            const walk = (x - startX) * 1.6;
            vp.scrollLeft = scrollStart - walk;
        });

        // Pause auto-scroll while hovering or touching
        vp.addEventListener('mouseenter', () => { this.isUserInteractingLookbook = true; });
        vp.addEventListener('mouseleave', () => { if (!isDown) this.isUserInteractingLookbook = false; });
        vp.addEventListener('touchstart', () => { this.isUserInteractingLookbook = true; }, { passive: true });
        vp.addEventListener('touchend', () => {
            setTimeout(() => { this.isUserInteractingLookbook = false; }, 1200);
        }, { passive: true });

        // 3. Vertical page scroll -> horizontal scrub effect
        this.lastWindowScrollY = window.scrollY;
        window.addEventListener('scroll', () => {
            const sec = document.getElementById('lookbook-section');
            if (!sec) return;
            const rect = sec.getBoundingClientRect();
            const vh = window.innerHeight || document.documentElement.clientHeight;

            // When lookbook section is visible in viewport, gently scrub horizontally based on vertical scroll delta
            if (rect.top < vh && rect.bottom > 0) {
                const deltaY = window.scrollY - this.lastWindowScrollY;
                const maxScroll = vp.scrollWidth - vp.clientWidth;
                if (maxScroll > 0 && Math.abs(deltaY) > 0) {
                    vp.scrollLeft = Math.max(0, Math.min(maxScroll, vp.scrollLeft + deltaY * 0.65));
                }
            }
            this.lastWindowScrollY = window.scrollY;
        }, { passive: true });

        // 4. Smooth continuous auto-glide loop
        const stepAutoScroll = () => {
            if (this.autoScrollEnabled && !this.isUserInteractingLookbook) {
                const maxScroll = vp.scrollWidth - vp.clientWidth;
                if (maxScroll > 5) {
                    vp.scrollLeft += this.autoScrollDir * 0.75;
                    if (vp.scrollLeft >= maxScroll - 2) this.autoScrollDir = -1;
                    else if (vp.scrollLeft <= 2) this.autoScrollDir = 1;
                }
            }
            requestAnimationFrame(stepAutoScroll);
        };
        requestAnimationFrame(stepAutoScroll);
    },

    scrollLookbookBy(offset) {
        const vp = document.getElementById('lookbook-viewport');
        if (!vp) return;
        this.isUserInteractingLookbook = true;
        vp.scrollBy({ left: offset, behavior: 'smooth' });
        setTimeout(() => { this.isUserInteractingLookbook = false; }, 900);
    },

    toggleAutoScroll() {
        this.autoScrollEnabled = !this.autoScrollEnabled;
        const dot = document.getElementById('auto-scroll-dot');
        const label = document.getElementById('auto-scroll-label');
        if (this.autoScrollEnabled) {
            dot.className = 'w-2 h-2 rounded-full bg-sage animate-pulse';
            label.innerText = 'Auto-Scroll: On';
        } else {
            dot.className = 'w-2 h-2 rounded-full bg-mutedLight';
            label.innerText = 'Auto-Scroll: Paused';
        }
    },

    updateLookbookProgress() {
        const vp = document.getElementById('lookbook-viewport');
        const bar = document.getElementById('lookbook-progress');
        const status = document.getElementById('lookbook-status');
        if (!vp || !bar) return;
        const maxScroll = Math.max(1, vp.scrollWidth - vp.clientWidth);
        const pct = Math.min(100, Math.max(12, Math.round((vp.scrollLeft / maxScroll) * 100)));
        bar.style.width = `${pct}%`;
        if (status) {
            status.innerText = `${ Math.round((vp.scrollLeft / maxScroll) * 100) }% Scrolled`;
        }
    },

    toggleTheme() {
        const isDark = document.documentElement.classList.toggle('dark');
        localStorage.setItem('kb_theme', isDark ? 'dark' : 'light');
        document.getElementById('theme-icon').className = isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    },

    focusAuth(targetMode) {
        this.setMode(targetMode);
        document.getElementById('auth-section').scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => {
            const targetInput = targetMode === 'signup' ? 'in-name' : 'in-email';
            document.getElementById(targetInput)?.focus();
        }, 400);
    },

    setRole(role) {
        this.role = role;
        this.hideAlert();
        this.updateAuthUI();
    },

    setMode(mode) {
        this.mode = mode;
        this.hideAlert();
        this.updateAuthUI();
    },

    updateAuthUI() {
        const isMerchant = this.role === 'merchant';
        const isSignup = this.mode === 'signup';

        // Role tab classes
        const activeRoleCls = 'py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 bg-white dark:bg-surfaceDark shadow-sm';
        const idleRoleCls = 'py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 text-mutedLight dark:text-mutedDark';
        document.getElementById('tab-role-merchant').className = isMerchant ? activeRoleCls : idleRoleCls;
        document.getElementById('tab-role-customer').className = !isMerchant ? activeRoleCls : idleRoleCls;

        // Mode tab classes
        const activeModeCls = 'px-3 py-1.5 rounded-lg text-xs font-bold bg-white dark:bg-surfaceDark shadow-sm transition';
        const idleModeCls = 'px-3 py-1.5 rounded-lg text-xs font-bold text-mutedLight dark:text-mutedDark transition';
        document.getElementById('tab-mode-signup').className = isSignup ? activeModeCls : idleModeCls;
        document.getElementById('tab-mode-login').className = !isSignup ? activeModeCls : idleModeCls;

        // Toggle fields
        document.getElementById('field-name').classList.toggle('hidden', !isSignup);
        document.getElementById('field-merchant-group').classList.toggle('hidden', !(isMerchant && isSignup));

        // Labels
        document.getElementById('auth-title').innerText = `${isMerchant ? 'B2B Merchant' : 'B2C Customer'} ${isSignup ? 'Sign Up' : 'Log In'}`;
        document.getElementById('auth-subtitle').innerText = isMerchant
            ? (isSignup ? 'Onboard your wholesale store with mandatory 15-digit GST verification.' : 'Sign in to manage your B2B wholesale store and inventory.')
            : (isSignup ? 'Create a free customer account to source directly from verified suppliers.' : 'Sign in to your B2C Customer account.');
        document.getElementById('submit-label').innerText = isSignup
            ? `Register ${isMerchant ? 'Merchant' : 'Customer'} Account`
            : `Log In as ${isMerchant ? 'Merchant' : 'Customer'}`;
        document.getElementById('switch-prompt').innerText = isSignup ? 'Already have an account?' : 'Need a new account?';
        document.getElementById('switch-link').innerHTML = isSignup ? 'Log in here &rarr;' : 'Sign up for free &rarr;';
    },

    updateGstCounter(val) {
        const clean = val.toUpperCase().trim();
        document.getElementById('in-gst').value = clean;
        const counter = document.getElementById('gst-counter');
        counter.innerText = `${clean.length}/15`;
        counter.className = clean.length === 15
            ? 'text-[10px] font-mono px-1.5 py-0.5 rounded bg-sage/15 text-sage font-bold'
            : 'text-[10px] font-mono px-1.5 py-0.5 rounded bg-terracotta/15 text-terracotta dark:text-terracotta-dark font-bold';
    },

    fillSampleGst() {
        const sample = '27AABCU9603R1ZM';
        document.getElementById('in-gst').value = sample;
        this.updateGstCounter(sample);
    },

    // Connects to exact backend controller routes with seamless preview fallback
    async handleSubmit(e) {
        e.preventDefault();
        this.hideAlert();

        const name = document.getElementById('in-name').value.trim();
        const email = document.getElementById('in-email').value.trim();
        const password = document.getElementById('in-password').value;
        const storeName = document.getElementById('in-store').value.trim();
        const gstNumber = document.getElementById('in-gst').value.trim();

        const endpoint = this.role === 'merchant'
            ? (this.mode === 'signup' ? '/api/auth/signup' : '/api/auth/login')
            : (this.mode === 'signup' ? '/api/auth/customer/signup' : '/api/auth/customer/login');

        const payload = this.mode === 'login'
            ? { email, password }
            : (this.role === 'merchant' ? { name, email, password, storeName, gstNumber } : { name, email, password });

        let responseData;
        try {
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if ((res.headers.get('content-type') || '').includes('application/json')) {
                responseData = await res.json();
            } else {
                responseData = this.runControllerFallback(endpoint, payload);
            }
        } catch (err) {
            responseData = this.runControllerFallback(endpoint, payload);
        }

        if (!responseData.success) {
            this.showAlert(responseData.message || 'Authentication error', false);
            this.toast(responseData.message || 'Error', 'error');
            return;
        }

        this.showAlert(responseData.message, true);
        this.toast(responseData.message, 'success');

        const sessionPayload = {
            role: this.role,
            token: responseData.token || 'jwt_preview_token_30d',
            data: responseData.data
        };
        localStorage.setItem('kb_session', JSON.stringify(sessionPayload));
        this.showSession(sessionPayload);
    },

    // Mirrors the exact validation & response format of the Express controllers
    runControllerFallback(endpoint, body) {
        const merchants = JSON.parse(localStorage.getItem('kb_merchants') || '[]');
        const customers = JSON.parse(localStorage.getItem('kb_customers') || '[]');

        if (endpoint === '/api/auth/signup') {
            const { name, email, password, storeName, gstNumber } = body;
            if (!name || !email || !password || !storeName) {
                return { success: false, message: 'All business fields are required' };
            }
            if (merchants.some(m => m.email === email)) {
                return { success: false, message: 'Merchant with this email already exists' };
            }
            if (merchants.some(m => m.storeName === storeName)) {
                return { success: false, message: 'Store name is already taken' };
            }
            if (!gstNumber) {
                return { success: false, message: 'GST number is mandatory for business onboarding' };
            }
            if (gstNumber.trim().length !== 15) {
                return { success: false, message: 'Please enter a valid 15-digit GST number' };
            }
            const merchant = { _id: 'm_' + Date.now(), name, email, password, storeName, gstNumber };
            merchants.push(merchant);
            localStorage.setItem('kb_merchants', JSON.stringify(merchants));
            return {
                success: true,
                message: 'Merchant registered successfully!',
                data: { _id: merchant._id, name, email, storeName, gstNumber }
            };
        }

        if (endpoint === '/api/auth/login') {
            const { email, password } = body;
            const merchant = merchants.find(m => m.email === email && m.password === password);
            if (!merchant) return { success: false, message: 'Invalid email or password' };
            return {
                success: true,
                message: 'Merchant logged in successfully! Welcome back 👋',
                token: 'jwt_merchant_' + merchant._id,
                data: { _id: merchant._id, name: merchant.name, email: merchant.email, storeName: merchant.storeName }
            };
        }

        if (endpoint === '/api/auth/customer/signup') {
            const { name, email, password } = body;
            if (!name || !email || !password) return { success: false, message: 'Please fill in all fields' };
            if (customers.some(c => c.email === email)) {
                return { success: false, message: 'Customer with this email already exists' };
            }
            const customer = { _id: 'c_' + Date.now(), name, email, password };
            customers.push(customer);
            localStorage.setItem('kb_customers', JSON.stringify(customers));
            return {
                success: true,
                message: 'Customer registered successfully!',
                data: { _id: customer._id, name, email }
            };
        }

        if (endpoint === '/api/auth/customer/login') {
            const { email, password } = body;
            const customer = customers.find(c => c.email === email && c.password === password);
            if (!customer) return { success: false, message: 'Invalid email or password' };
            return {
                success: true,
                message: 'Customer logged in successfully! Welcome back 👋',
                token: 'jwt_customer_' + customer._id,
                data: { _id: customer._id, name: customer.name, email: customer.email }
            };
        }
    },

    showSession(session) {
        const { role, data } = session;
        document.getElementById('session-banner').classList.remove('hidden');
        document.getElementById('session-title').innerText = role === 'merchant'
            ? `${data.storeName || data.name} (${data.name})`
            : `Welcome, ${data.name}`;
        document.getElementById('session-role-badge').innerText = role === 'merchant' ? 'B2B Merchant' : 'B2C Customer';
        document.getElementById('session-meta').innerText = `${data.email}${data.gstNumber ? ' • GSTIN: ' + data.gstNumber : ''} • Active 30d JWT Session`;
        document.getElementById('nav-auth-btn').innerText = data.storeName || data.name;
    },

    logout() {
        localStorage.removeItem('kb_session');
        document.getElementById('session-banner').classList.add('hidden');
        document.getElementById('nav-auth-btn').innerText = 'Sign In';
        this.toast('Signed out successfully', 'info');
    },

    showAlert(msg, isSuccess) {
        const el = document.getElementById('form-alert');
        el.classList.remove('hidden');
        el.className = isSuccess
            ? 'p-3.5 rounded-xl border text-xs font-semibold bg-sage/10 border-sage/30 text-sage'
            : 'p-3.5 rounded-xl border text-xs font-semibold bg-terracotta/10 border-terracotta/30 text-terracotta dark:text-terracotta-dark';
        el.innerText = msg;
    },

    hideAlert() {
        document.getElementById('form-alert').classList.add('hidden');
    },

    // Slideshow & Lookbook helpers
    renderSlide() {
        const item = this.photos[this.slideIdx];
        document.getElementById('auth-slide-img').src = item.url;
        document.getElementById('auth-slide-tag').innerText = item.tag;
        document.getElementById('auth-slide-hub').innerText = item.hub;
        document.getElementById('auth-slide-heading').innerText = item.title;
        document.getElementById('auth-slide-caption').innerText = item.desc;
        document.getElementById('auth-slide-dots').innerHTML = this.photos.map((_, i) =>
            `<button type="button" onclick="app.slideIdx=${i};app.renderSlide()" class="${i === this.slideIdx ? 'w-5 bg-white' : 'w-1.5 bg-white/40'} h-1.5 rounded-full transition"></button>`
        ).join('');
    },

    stepSlide(dir) {
        this.slideIdx = (this.slideIdx + dir + this.photos.length) % this.photos.length;
        this.renderSlide();
    },

    copyCurrentSlideUrl() {
        this.copyUrl(this.photos[this.slideIdx].url);
    },

    renderLookbook() {
        const vp = document.getElementById('lookbook-viewport');
        if (!vp) return;
        vp.innerHTML = this.photos.map((p, index) => `
            <div class="w-72 sm:w-80 shrink-0 rounded-2xl bg-white dark:bg-surfaceDark border theme-border overflow-hidden shadow-sm hover:border-terracotta transition group flex flex-col justify-between">
                <div>
                    <div class="h-48 relative overflow-hidden bg-espresso">
                        <img src="${p.url}" alt="${p.title}" draggable="false" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
                        <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                        <span class="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/60 text-white text-[10px] font-semibold backdrop-blur-md">
                            0${index + 1} &bull; ${p.tag}
                        </span>
                        <button type="button" onclick="app.copyUrl('${p.url}')" class="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-black/70 hover:bg-black/90 text-white text-[10px] font-mono backdrop-blur-md transition">
                            <i class="fa-solid fa-link mr-1"></i>Copy Image Link
                        </button>
                    </div>
                    <div class="p-4">
                        <span class="text-[10px] font-mono uppercase text-terracotta dark:text-terracotta-dark font-semibold">${p.hub}</span>
                        <h4 class="text-sm font-bold mt-0.5">${p.title}</h4>
                        <p class="text-xs text-mutedLight dark:text-mutedDark mt-1 leading-relaxed">${p.desc}</p>
                    </div>
                </div>
            </div>
        `).join('');
    },

    renderPhotoModal() {
        document.getElementById('modal-links-list').innerHTML = this.photos.map(p => `
            <div class="p-3 rounded-xl bg-alabaster dark:bg-espresso border theme-border flex items-center justify-between gap-3">
                <div class="flex items-center gap-3 min-w-0">
                    <img src="${p.url}" alt="${p.title}" class="w-12 h-12 rounded-lg object-cover shrink-0">
                    <div class="truncate">
                        <p class="text-xs font-bold truncate">${p.title}</p>
                        <code class="text-[10px] font-mono text-mutedLight dark:text-mutedDark block truncate">${p.url}</code>
                    </div>
                </div>
                <button onclick="app.copyUrl('${p.url}')" class="px-3 py-1.5 rounded-lg bg-white dark:bg-surfaceDark border theme-border text-xs font-semibold shrink-0 hover:border-terracotta">
                    Copy
                </button>
            </div>
        `).join('');
    },

    toggleModal(show) {
        document.getElementById('photo-modal').classList.toggle('hidden', !show);
    },

    showHub(name, eff, desc) {
        document.getElementById('hub-name').innerText = name;
        document.getElementById('hub-efficiency').innerText = eff;
        document.getElementById('hub-desc').innerText = desc;
    },

    copyUrl(url) {
        const t = document.createElement('textarea');
        t.value = url;
        document.body.appendChild(t);
        t.select();
        document.execCommand('copy');
        document.body.removeChild(t);
        this.toast('Photo URL copied for your local project!', 'success');
    },

    toast(msg, type = 'info') {
        const box = document.getElementById('toast-box');
        const el = document.createElement('div');
        const color = type === 'success' ? 'text-sage' : type === 'error' ? 'text-terracotta' : 'text-mutedLight';
        el.className = 'pointer-events-auto px-4 py-3 rounded-2xl bg-white dark:bg-surfaceDark border theme-border shadow-lg text-xs font-semibold flex items-center gap-2';
        el.innerHTML = `<i class="fa-solid fa-circle-info ${color}"></i><span>${msg}</span>`;
        box.appendChild(el);
        setTimeout(() => el.remove(), 3000);
    }
};

window.onload = () => app.init();