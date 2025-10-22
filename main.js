(function () {
  let translations = null;

  function applyTranslations(lang) {
    const dict = (translations && translations[lang]) || (translations && translations.es) || {};
    document.documentElement.setAttribute('lang', lang);
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const val = dict[key];
      if (typeof val === 'string') {
        el.innerHTML = val;
      }
    });
    const cvBtn = document.getElementById('cv-button');
    if (cvBtn) {
      if (lang === 'en') {
        cvBtn.setAttribute('href', 'CV_2025_ENG.pdf');
        cvBtn.innerHTML = dict['contact.cv_en'] || 'Download CV (EN)';
      } else {
        cvBtn.setAttribute('href', 'CV_2025_SPA.pdf');
        cvBtn.innerHTML = dict['contact.cv_es'] || 'Descargar CV (ES)';
      }
    }
    const select = document.getElementById('lang-select');
    if (select) {
      if (select.value !== lang) select.value = lang;
      select.setAttribute('aria-label', (dict['ui.lang_label'] || 'Idioma'));
    }
    try { localStorage.setItem('lang', lang); } catch (e) { }
  }

  function detectInitialLang() {
    try {
      const saved = localStorage.getItem('lang');
      if (saved) return saved;
    } catch (e) { }
    const nav = navigator.language || navigator.userLanguage || 'es';
    return nav.toLowerCase().startsWith('en') ? 'en' : 'es';
  }

  document.addEventListener('DOMContentLoaded', async () => {
    const select = document.getElementById('lang-select');
    const initial = detectInitialLang();
    try {
      const res = await fetch('translations.json', { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to load translations.json');
      translations = await res.json();
      applyTranslations(initial);
    } catch (err) {
      console.error('i18n load error:', err);
      document.documentElement.setAttribute('lang', initial);
      const cvBtn = document.getElementById('cv-button');
      if (cvBtn) {
        if (initial === 'en') {
          cvBtn.setAttribute('href', 'CV_2025_ENG.pdf');
          cvBtn.textContent = 'Download CV (EN)';
        } else {
          cvBtn.setAttribute('href', 'CV_2025_SPA.pdf');
          cvBtn.textContent = 'Descargar CV (ES)';
        }
      }
    }
    if (select) {
      select.addEventListener('change', () => applyTranslations(select.value));
    }
  });
})();
