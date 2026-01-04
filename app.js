/**
 * NFC Smart Business Card - Dynamic Template Engine
 * Loads config.json and renders the card based on profile version
 */

let config = null;
let currentLang = 'zh-TW';
let currentProfile = 'default'; // 'default', 'vendor', 'client', 'friend', 'association'

// Load configuration
async function loadConfig() {
  try {
    const response = await fetch('config.json');
    if (!response.ok) {
      throw new Error('Failed to load config');
    }
    config = await response.json();
    return config;
  } catch (error) {
    console.error('Failed to load config:', error);
    return null;
  }
}

// Get profile version from URL parameter
function getProfileFromURL() {
  const params = new URLSearchParams(window.location.search);
  const version = params.get('v') || params.get('version');

  if (version && config.profiles && config.profiles[version]) {
    return version;
  }

  return 'default';
}

// Check if this is an NFC scan (for future implementation)
function isNFCScan() {
  return window.location.pathname.startsWith('/n/');
}

// Inject meta tags dynamically
function injectMetaTags() {
  document.title = config.meta.title;

  const metaTags = {
    'description': config.meta.description,
    'keywords': config.meta.keywords,
    'theme-color': '#0B0F1A'
  };

  Object.entries(metaTags).forEach(([name, content]) => {
    let meta = document.querySelector(`meta[name="${name}"]`);
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = name;
      document.head.appendChild(meta);
    }
    meta.content = content;
  });

  // Open Graph tags
  const ogTags = {
    'og:title': config.meta.title,
    'og:description': config.meta.description,
    'og:url': config.meta.ogUrl,
    'og:image': config.meta.ogImage
  };

  Object.entries(ogTags).forEach(([property, content]) => {
    let meta = document.querySelector(`meta[property="${property}"]`);
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('property', property);
      document.head.appendChild(meta);
    }
    meta.content = content;
  });

  // Update Google Analytics ID
  if (config.meta.gaTrackingId && config.meta.gaTrackingId !== 'G-XXXXXXXXXX') {
    const gaScript = document.querySelector('script[src*="googletagmanager"]');
    if (gaScript) {
      gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${config.meta.gaTrackingId}`;
    }

    if (typeof gtag === 'function') {
      gtag('config', config.meta.gaTrackingId);
    }
  }
}

// Render card content based on profile
function renderCard() {
  const profile = currentProfile === 'default' ? null : config.profiles[currentProfile];
  const showFields = profile ? profile.showFields : null;

  // Helper function to check if field should be shown
  const shouldShow = (field) => {
    if (!showFields) return true; // Default profile shows all
    return showFields[field] !== false;
  };

  // Render name
  const nameEl = document.querySelector('[data-field="name"]');
  if (nameEl) {
    nameEl.textContent = currentLang === 'zh-TW' ? config.personal.name : config.personal.nameEn;
  }

  // Render department
  const deptEl = document.querySelector('[data-field="department"]');
  if (deptEl) {
    if (shouldShow('department')) {
      deptEl.textContent = currentLang === 'zh-TW' ? config.personal.department : config.personal.departmentEn;
      deptEl.parentElement.style.display = '';
    } else {
      deptEl.parentElement.style.display = 'none';
    }
  }

  // Render title/position
  const titleEl = document.querySelector('[data-field="position"]');
  if (titleEl) {
    if (shouldShow('title')) {
      titleEl.textContent = currentLang === 'zh-TW' ? config.personal.title : config.personal.titleEn;
      titleEl.parentElement.style.display = '';
    } else {
      titleEl.parentElement.style.display = 'none';
    }
  }

  // Render company
  const companyEl = document.querySelector('[data-field="companyName"]');
  if (companyEl && shouldShow('company')) {
    companyEl.textContent = currentLang === 'zh-TW' ? config.company.name : config.company.nameEn;
  }

  // Render contact info
  const mobileEl = document.querySelector('[data-field="mobile"]');
  if (mobileEl) {
    mobileEl.textContent = config.personal.mobile;
    mobileEl.closest('.row').style.display = shouldShow('mobile') ? '' : 'none';
  }

  const phoneEl = document.querySelector('[data-field="phone"]');
  if (phoneEl) {
    phoneEl.textContent = config.personal.phone;
    phoneEl.closest('.row').style.display = shouldShow('phone') ? '' : 'none';
  }

  const emailEl = document.querySelector('[data-field="email"]');
  if (emailEl) {
    emailEl.textContent = config.personal.email;
    emailEl.closest('.row').style.display = shouldShow('email') ? '' : 'none';
  }

  const addressEl = document.querySelector('[data-field="addressValue"]');
  if (addressEl) {
    addressEl.textContent = currentLang === 'zh-TW' ? config.company.address : config.company.addressEn;
    addressEl.closest('.row').style.display = shouldShow('address') ? '' : 'none';
  }

  // Render tax ID (if in profile)
  const taxIdEl = document.querySelector('[data-field="taxId"]');
  if (taxIdEl) {
    taxIdEl.textContent = config.company.taxId;
    const taxIdRow = taxIdEl.closest('.meta .badge');
    if (taxIdRow) {
      taxIdRow.style.display = shouldShow('taxId') ? '' : 'none';
    }
  }

  // Render fax (if in profile)
  const faxEl = document.querySelector('[data-field="fax"]');
  if (faxEl) {
    faxEl.textContent = config.personal.fax;
    const faxRow = faxEl.closest('.meta .badge');
    if (faxRow) {
      faxRow.style.display = shouldShow('fax') ? '' : 'none';
    }
  }

  // Update action buttons
  updateActionButtons();

  // Show/hide sections
  const socialSection = document.querySelector('.social-links');
  if (socialSection) {
    socialSection.style.display = shouldShow('social') && config.features.showSocialLinks ? '' : 'none';
  }

  const bioSection = document.querySelector('.bio-section');
  if (bioSection) {
    bioSection.style.display = shouldShow('bio') && config.features.showBio ? '' : 'none';
  }

  const mapSection = document.querySelector('.map-section');
  if (mapSection) {
    mapSection.style.display = shouldShow('map') && config.features.showMap ? '' : 'none';
  }

  // Render social links
  if (shouldShow('social')) {
    renderSocialLinks();
  }

  // Render bio
  if (shouldShow('bio')) {
    renderBio();
  }

  // Update map embed URL
  if (shouldShow('map')) {
    const mapIframe = document.querySelector('.map-container iframe');
    if (mapIframe && config.features.mapEmbedUrl) {
      mapIframe.src = config.features.mapEmbedUrl;
    }
  }

  // Show custom message if exists
  if (profile && profile.customMessage) {
    showCustomMessage(profile.customMessage);
  }
}

// Update action buttons with config data
function updateActionButtons() {
  // Update tel links
  document.querySelectorAll('a[href^="tel:"]').forEach(link => {
    link.href = `tel:${config.personal.mobileFormatted}`;
  });

  // Update mailto links
  document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
    link.href = `mailto:${config.personal.email}`;
  });

  // Update vCard link
  document.querySelectorAll('a[download][href$=".vcf"]').forEach(link => {
    link.href = config.assets.vcard;
  });

  // Update map links
  const mapQuery = encodeURIComponent(config.company.address);
  document.querySelectorAll('a[href*="google.com/maps"]').forEach(link => {
    link.href = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;
  });
}

// Render social links
function renderSocialLinks() {
  const socialGrid = document.querySelector('.social-grid');
  if (!socialGrid) return;

  const socialLinks = [];

  if (config.social.line) {
    socialLinks.push({
      icon: '💬',
      name: 'LINE',
      url: `https://line.me/ti/p/~${config.social.line}`
    });
  }

  if (config.social.whatsapp) {
    socialLinks.push({
      icon: '📱',
      name: 'WhatsApp',
      url: `https://wa.me/${config.social.whatsapp}`
    });
  }

  if (config.social.linkedin) {
    socialLinks.push({
      icon: '💼',
      name: 'LinkedIn',
      url: config.social.linkedin
    });
  }

  if (config.social.facebook) {
    socialLinks.push({
      icon: '👤',
      name: 'Facebook',
      url: config.social.facebook
    });
  }

  // Only show social section if there are links
  if (socialLinks.length === 0) {
    document.querySelector('.social-links').style.display = 'none';
    return;
  }

  socialGrid.innerHTML = socialLinks.map(link => `
    <a class="social-btn" href="${link.url}" target="_blank" rel="noopener noreferrer" title="${link.name}">
      <span class="icon">${link.icon}</span>
      <span>${link.name}</span>
    </a>
  `).join('');
}

// Render bio content
function renderBio() {
  const bioIntro = document.querySelector('[data-i18n="bioIntro"]');
  const bioTitle = document.querySelector('[data-i18n="bioTitle"]');
  const bioList = document.querySelector('.bio-list');
  const bioContact = document.querySelector('[data-i18n="bioContact"]');

  const bioData = config.bio[currentLang === 'zh-TW' ? 'zh' : 'en'];

  if (bioIntro) bioIntro.textContent = bioData.intro;
  if (bioTitle) bioTitle.innerHTML = `<strong>${bioData.expertiseTitle}</strong>`;

  if (bioList && bioData.expertise) {
    bioList.innerHTML = bioData.expertise.map(item => `<li>${item}</li>`).join('');
  }

  if (bioContact) bioContact.textContent = bioData.contact;
}

// Show custom message (for different profiles)
function showCustomMessage(message) {
  // Create a custom message banner if doesn't exist
  let banner = document.querySelector('.custom-message-banner');
  if (!banner) {
    banner = document.createElement('div');
    banner.className = 'custom-message-banner';
    banner.style.cssText = `
      margin-top: 16px;
      padding: 14px 16px;
      border-radius: 12px;
      background: linear-gradient(135deg, rgba(42,167,255,0.12), rgba(230,69,58,0.12));
      border: 1px solid rgba(255,255,255,0.1);
      text-align: center;
      font-size: 14px;
      font-weight: 600;
      letter-spacing: 0.3px;
    `;

    const shareSection = document.querySelector('.share-section');
    if (shareSection) {
      shareSection.insertAdjacentElement('afterend', banner);
    }
  }

  banner.textContent = message;
  banner.style.display = 'block';
}

// Internationalization
const translations = {
  'zh-TW': {
    name: '張倚恩',
    department: '設備銷售部',
    position: '業務經理',
    taxId: '統編',
    company: '公司',
    companyName: '茂華實業股份有限公司',
    mobile: '手機',
    phone: '電話',
    email: '信箱',
    address: '地址',
    btnCall: '撥打',
    btnEmail: 'Email',
    btnSave: '存聯絡人',
    btnMap: '開地圖',
    qrContact: '掃描加入聯絡人',
    qrContactDesc: '一掃直接存到手機通訊錄（vCard）。',
    qrMap: '掃描開啟地圖',
    qrMapDesc: '導航到公司地址，現場拜訪更快。',
    contactUs: '聯絡我們',
    shareCard: '分享名片',
    btnShare: '分享名片',
    btnCopy: '複製連結',
    btnCopied: '已複製！',
    modeToggle: '切換淺色',
    modeToggleDark: '切換深色',
    langToggle: 'English',
    contactForm: '聯絡表單',
    formName: '姓名',
    formEmail: '電子郵件',
    formMessage: '訊息',
    btnSubmit: '送出訊息',
    formSuccess: '訊息已成功送出！我們會盡快回覆您。',
    formError: '送出失敗，請稍後再試或直接發送郵件。',
    formSending: '送出中...',
    aboutMe: '關於我',
    locationMap: '公司位置'
  },
  'en': {
    name: 'Ian Chang',
    department: 'Equipment Sales Dept.',
    position: 'Sales Manager',
    taxId: 'Tax ID',
    company: 'Company',
    companyName: 'Mao Hua Enterprise Co., Ltd',
    mobile: 'Mobile',
    phone: 'Phone',
    email: 'Email',
    address: 'Address',
    btnCall: 'Call',
    btnEmail: 'Email',
    btnSave: 'Save Contact',
    btnMap: 'Open Map',
    qrContact: 'Scan to Add Contact',
    qrContactDesc: 'Scan to save to your phone contacts (vCard).',
    qrMap: 'Scan to Open Map',
    qrMapDesc: 'Navigate to our office address easily.',
    contactUs: 'Contact Us',
    shareCard: 'Share Card',
    btnShare: 'Share Card',
    btnCopy: 'Copy Link',
    btnCopied: 'Copied!',
    modeToggle: 'Light Mode',
    modeToggleDark: 'Dark Mode',
    langToggle: '中文',
    contactForm: 'Contact Form',
    formName: 'Name',
    formEmail: 'Email',
    formMessage: 'Message',
    btnSubmit: 'Send Message',
    formSuccess: 'Message sent successfully! We will reply soon.',
    formError: 'Failed to send. Please try again later or email us directly.',
    formSending: 'Sending...',
    aboutMe: 'About Me',
    locationMap: 'Office Location'
  }
};

function setLanguage(lang) {
  currentLang = lang;
  document.documentElement.lang = lang === 'zh-TW' ? 'zh-Hant' : 'en';

  // Update all elements with data-i18n
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[lang] && translations[lang][key]) {
      el.textContent = translations[lang][key];
    }
  });

  // Update language toggle button
  const langLabel = document.getElementById('langLabel');
  if (langLabel) {
    langLabel.textContent = translations[lang].langToggle;
  }

  // Update mode toggle button text
  const modeLabel = document.getElementById('modeLabel');
  if (modeLabel && document.body.classList.contains('light')) {
    modeLabel.textContent = translations[lang].modeToggleDark;
  } else if (modeLabel) {
    modeLabel.textContent = translations[lang].modeToggle;
  }

  // Re-render card content with new language
  if (config) {
    renderCard();
  }

  // Save preference
  try { localStorage.setItem('mh_card_lang', lang); } catch (e) {}

  // Track language change
  if (typeof trackEvent === 'function') {
    trackEvent('language_change', { language: lang });
  }
}

// Google Analytics event tracking helper
function trackEvent(eventName, eventParams = {}) {
  if (typeof gtag === 'function') {
    gtag('event', eventName, eventParams);
  }
}

// Initialize the app
async function initApp() {
  // Load config
  const loadedConfig = await loadConfig();
  if (!loadedConfig) {
    console.error('Failed to load config, cannot initialize app');
    return;
  }

  // Inject meta tags
  injectMetaTags();

  // Determine profile version
  currentProfile = getProfileFromURL();

  // Initialize language
  let initLang = null;
  try { initLang = localStorage.getItem('mh_card_lang'); } catch (e) {}
  if (initLang && translations[initLang]) {
    currentLang = initLang;
  } else {
    // Detect browser language
    const browserLang = navigator.language || navigator.userLanguage;
    if (browserLang && browserLang.startsWith('zh')) {
      currentLang = 'zh-TW';
    } else {
      currentLang = 'en';
    }
  }

  setLanguage(currentLang);

  // Render card
  renderCard();

  // Show entrance animation
  requestAnimationFrame(() => document.body.classList.add('ready'));

  // Setup event listeners
  setupEventListeners();

  // Initialize theme
  initializeTheme();

  // Initialize PWA
  initializePWA();

  // Track page view
  trackEvent('page_view', {
    profile: currentProfile,
    language: currentLang
  });
}

// Setup all event listeners
function setupEventListeners() {
  const body = document.body;
  const modeToggle = document.getElementById('modeToggle');
  const modeLabel = document.getElementById('modeLabel');
  const langToggle = document.getElementById('langToggle');

  // Theme toggle
  function setMode(light) {
    if (light) {
      body.classList.add('light');
      modeLabel.textContent = translations[currentLang].modeToggleDark;
    } else {
      body.classList.remove('light');
      modeLabel.textContent = translations[currentLang].modeToggle;
    }
    try { localStorage.setItem('mh_card_mode', light ? 'light' : 'dark'); } catch (e) {}

    trackEvent('theme_change', { theme: light ? 'light' : 'dark' });
  }

  function toggleMode() {
    setMode(!body.classList.contains('light'));
  }

  if (modeToggle) {
    modeToggle.addEventListener('click', toggleMode);
    modeToggle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleMode(); }
    });
  }

  // Language toggle
  function toggleLanguage() {
    const newLang = currentLang === 'zh-TW' ? 'en' : 'zh-TW';
    setLanguage(newLang);
  }

  if (langToggle) {
    langToggle.addEventListener('click', toggleLanguage);
    langToggle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleLanguage(); }
    });
  }

  // 3D tilt effect
  setup3DTilt();

  // Share functionality
  setupShareButtons();

  // Bio toggle
  setupBioToggle();

  // Map toggle
  setupMapToggle();

  // Contact form
  setupContactForm();

  // Track all button clicks
  trackButtonClicks();
}

// Initialize theme
function initializeTheme() {
  const body = document.body;
  const modeLabel = document.getElementById('modeLabel');

  function setMode(light) {
    if (light) {
      body.classList.add('light');
      if (modeLabel) modeLabel.textContent = translations[currentLang].modeToggleDark;
    } else {
      body.classList.remove('light');
      if (modeLabel) modeLabel.textContent = translations[currentLang].modeToggle;
    }
  }

  let initMode = null;
  try { initMode = localStorage.getItem('mh_card_mode'); } catch (e) {}
  if (initMode === 'light') {
    setMode(true);
  } else if (initMode === 'dark') {
    setMode(false);
  } else {
    const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
    setMode(prefersLight);
  }
}

// Setup 3D tilt effect
function setup3DTilt() {
  const card = document.getElementById('tiltCard');
  if (!card) return;

  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = matchMedia('(pointer: coarse)').matches;

  if (!reduceMotion && !isTouch) {
    const maxRotate = 8;
    const maxTranslate = 6;

    function onMove(ev) {
      const r = card.getBoundingClientRect();
      const px = (ev.clientX - r.left) / r.width;
      const py = (ev.clientY - r.top) / r.height;

      const rotY = (px - 0.5) * (maxRotate * 2);
      const rotX = -(py - 0.5) * (maxRotate * 2);
      const tx = (px - 0.5) * (maxTranslate * 2);
      const ty = (py - 0.5) * (maxTranslate * 2);

      card.style.transform = `translate3d(${tx}px, ${ty}px, 0) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    }

    function reset() {
      card.style.transform = 'translate3d(0,0,0) rotateX(0deg) rotateY(0deg)';
    }

    card.addEventListener('mousemove', onMove);
    card.addEventListener('mouseleave', reset);
  }
}

// Setup share buttons
function setupShareButtons() {
  const shareBtn = document.getElementById('shareBtn');
  const copyBtn = document.getElementById('copyBtn');
  const copyBtnText = document.getElementById('copyBtnText');

  const shareData = {
    title: config.meta.title,
    text: config.meta.description,
    url: window.location.href
  };

  // Web Share API
  if (shareBtn) {
    shareBtn.addEventListener('click', async () => {
      if (navigator.share) {
        try {
          await navigator.share(shareData);
          trackEvent('share', {
            method: 'web_share_api',
            content_type: 'business_card'
          });
        } catch (err) {
          if (err.name !== 'AbortError') {
            console.error('Share failed:', err);
          }
        }
      } else {
        // Fallback: copy to clipboard
        try {
          await navigator.clipboard.writeText(window.location.href);
          shareBtn.classList.add('success');
          const originalHTML = shareBtn.innerHTML;
          shareBtn.innerHTML = '<span>✓</span><span>已複製</span>';
          trackEvent('share', {
            method: 'copy_fallback',
            content_type: 'business_card'
          });
          setTimeout(() => {
            shareBtn.innerHTML = originalHTML;
            shareBtn.classList.remove('success');
          }, 2000);
        } catch (err) {
          console.error('Copy failed:', err);
        }
      }
    });
  }

  // Copy link to clipboard
  if (copyBtn && copyBtnText) {
    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(window.location.href);
        copyBtn.classList.add('success');
        copyBtnText.textContent = translations[currentLang].btnCopied;
        trackEvent('copy_link', {
          method: 'clipboard',
          content_type: 'url'
        });
        setTimeout(() => {
          copyBtnText.textContent = translations[currentLang].btnCopy;
          copyBtn.classList.remove('success');
        }, 2000);
      } catch (err) {
        console.error('Copy failed:', err);
        copyBtnText.textContent = currentLang === 'zh-TW' ? '複製失敗' : 'Failed';
        setTimeout(() => {
          copyBtnText.textContent = translations[currentLang].btnCopy;
        }, 2000);
      }
    });
  }
}

// Setup bio toggle
function setupBioToggle() {
  const bioToggle = document.getElementById('bioToggle');
  const bioContent = document.getElementById('bioContent');
  const bioToggleIcon = document.getElementById('bioToggleIcon');
  let bioExpanded = false;

  function toggleBio() {
    bioExpanded = !bioExpanded;
    if (bioExpanded) {
      bioContent.classList.add('expanded');
      bioToggleIcon.textContent = '▲';
    } else {
      bioContent.classList.remove('expanded');
      bioToggleIcon.textContent = '▼';
    }

    trackEvent('bio_toggle', { expanded: bioExpanded });
  }

  if (bioToggle) {
    bioToggle.addEventListener('click', toggleBio);
    bioToggle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleBio();
      }
    });
  }
}

// Setup map toggle
function setupMapToggle() {
  const mapToggle = document.getElementById('mapToggle');
  const mapContainer = document.getElementById('mapContainer');
  const mapToggleIcon = document.getElementById('mapToggleIcon');
  let mapExpanded = false;

  function toggleMap() {
    mapExpanded = !mapExpanded;
    if (mapExpanded) {
      mapContainer.classList.add('expanded');
      mapToggleIcon.textContent = '▲';
    } else {
      mapContainer.classList.remove('expanded');
      mapToggleIcon.textContent = '▼';
    }

    trackEvent('map_toggle', { expanded: mapExpanded });
  }

  if (mapToggle) {
    mapToggle.addEventListener('click', toggleMap);
    mapToggle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleMap();
      }
    });
  }
}

// Setup contact form
function setupContactForm() {
  const contactForm = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const formStatus = document.getElementById('formStatus');

  if (!contactForm) return;

  // Update form action with config
  if (config.features.formspreeId && config.features.formspreeId !== 'YOUR_FORM_ID') {
    contactForm.action = `https://formspree.io/f/${config.features.formspreeId}`;
  }

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Show sending state
    submitBtn.disabled = true;
    submitBtn.querySelector('[data-i18n="btnSubmit"]').textContent = translations[currentLang].formSending;
    formStatus.style.display = 'none';

    try {
      const formData = new FormData(contactForm);
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        // Success
        formStatus.textContent = translations[currentLang].formSuccess;
        formStatus.className = 'form-status success';
        formStatus.style.display = 'block';
        contactForm.reset();
        submitBtn.classList.add('success');

        trackEvent('form_submit', {
          form_type: 'contact_form',
          status: 'success'
        });

        // Reset button after delay
        setTimeout(() => {
          submitBtn.querySelector('[data-i18n="btnSubmit"]').textContent = translations[currentLang].btnSubmit;
          submitBtn.classList.remove('success');
          formStatus.style.display = 'none';
        }, 5000);
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      // Error
      formStatus.textContent = translations[currentLang].formError;
      formStatus.className = 'form-status error';
      formStatus.style.display = 'block';

      trackEvent('form_submit', {
        form_type: 'contact_form',
        status: 'error'
      });

      submitBtn.querySelector('[data-i18n="btnSubmit"]').textContent = translations[currentLang].btnSubmit;
    } finally {
      submitBtn.disabled = false;
    }
  });
}

// Track all button clicks
function trackButtonClicks() {
  document.querySelectorAll('a.btn, a.social-btn, .fab a').forEach(link => {
    link.addEventListener('click', (e) => {
      const action = link.textContent.trim() || link.title || 'unknown';
      const category = link.classList.contains('social-btn') ? 'social_link' :
                      link.closest('.fab') ? 'fab_button' : 'action_button';
      trackEvent('button_click', {
        event_category: category,
        event_label: action,
        value: link.href
      });
    });
  });
}

// Initialize PWA
function initializePWA() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration.scope);
          trackEvent('pwa_registered', {
            scope: registration.scope
          });
        })
        .catch((error) => {
          console.log('Service Worker registration failed:', error);
        });
    });

    // Detect PWA installation
    window.addEventListener('appinstalled', () => {
      console.log('PWA installed');
      trackEvent('pwa_installed', {
        platform: navigator.platform
      });
    });
  }
}

// Start the app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
