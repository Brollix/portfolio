// Cargar traducciones
let translations = {};
let currentLanguage = 'es';

// Cargar las traducciones
async function loadTranslations() {
  try {
    const response = await fetch('translations.json');
    translations = await response.json();
    updateContent();
  } catch (error) {
    console.error('Error loading translations:', error);
  }
}

// Actualizar el contenido según el idioma seleccionado
function updateContent() {
  // Actualizar elementos con data-i18n
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const keys = element.getAttribute('data-i18n').split('.');
    let value = translations[currentLanguage];
    
    for (const key of keys) {
      if (value && value[key] !== undefined) {
        value = value[key];
      } else {
        console.warn(`Translation key not found: ${keys.join('.')}`);
        value = '';
        break;
      }
    }
    
    if (element.tagName === 'INPUT' && element.type === 'text') {
      element.placeholder = value;
    } else if (element.tagName === 'IMG' && element.alt) {
      element.alt = value;
    } else {
      element.textContent = value;
    }
  });
  
  // Actualizar el atributo lang del HTML
  document.documentElement.lang = currentLanguage;
  
  // Actualizar el título de la página
  document.title = translations[currentLanguage].title;
  
  // Actualizar contenido dinámico
  updateDynamicContent();
}

// Actualizar contenido dinámico como listas y arrays
function updateDynamicContent() {
  // Actualizar lista de experiencia
  updateExperienceSection();
  
  // Actualizar lista de proyectos
  updateProjectsSection();
  
  // Actualizar sección de habilidades
  updateSkillsSection();
}

function updateExperienceSection() {
  const experienceData = translations[currentLanguage];
  const experienceHTML = `
    <h2>${experienceData.experience_title}</h2>
    
    <div class="experience-block">
      <h3>${experienceData.experience_it_specialist}</h3>
      <p><em>${experienceData.experience_it_role}</em></p>
      <ul>
        ${experienceData.experience_it_points.map(point => `<li>${point}</li>`).join('')}
      </ul>
    </div>
    
    <div class="experience-block">
      <h3>${experienceData.experience_freelance}</h3>
      <p><em>${experienceData.experience_freelance_role}</em></p>
      <ul>
        ${experienceData.experience_freelance_points.map(point => `<li>${point}</li>`).join('')}
      </ul>
    </div>
  `;
  
  document.getElementById('experience').innerHTML = experienceHTML;
}

function updateProjectsSection() {
  const projects = translations[currentLanguage].projects;
  const projectsHTML = `
    <h2>${translations[currentLanguage].projects_title}</h2>
    ${projects.map(project => `
      <div class="proyecto">
        <h3><a href="${project.link}" target="_blank">${project.title}</a></h3>
        <p>${project.description}</p>
      </div>
    `).join('')}
  `;
  
  document.getElementById('projects').innerHTML = projectsHTML;
}

function updateSkillsSection() {
  const skills = translations[currentLanguage].skills;
  const skillsHTML = `
    <h2>${translations[currentLanguage].skills_title}</h2>
    ${skills.map(skillGroup => `
      <div class="skills-block">
        <h3>${skillGroup.title}</h3>
        <ul>
          ${skillGroup.items.map(item => `<li>${item}</li>`).join('')}
        </ul>
      </div>
    `).join('')}
  `;
  
  document.getElementById('skills').innerHTML = skillsHTML;
}

// Cambiar idioma
function changeLanguage(lang) {
  if (translations[lang]) {
    currentLanguage = lang;
    localStorage.setItem('preferredLanguage', lang);
    updateContent();
  }
}

// Inicializar
function init() {
  // Cargar traducciones
  loadTranslations();
  
  // Configurar el selector de idioma
  const languageToggle = document.getElementById('language-toggle');
  if (languageToggle) {
    languageToggle.addEventListener('click', (e) => {
      e.preventDefault();
      const newLang = currentLanguage === 'es' ? 'en' : 'es';
      changeLanguage(newLang);
      // Actualizar el texto del botón
      languageToggle.textContent = newLang === 'es' ? 'EN' : 'ES';
    });
  }
  
  // Configurar navegación suave
  document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      if (href.startsWith('#')) {
        e.preventDefault();
        const section = document.querySelector(href);
        section.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
  
  // Cargar el idioma guardado o detectar el del navegador
  const savedLanguage = localStorage.getItem('preferredLanguage');
  const browserLanguage = navigator.language.split('-')[0];
  
  if (savedLanguage && translations[savedLanguage]) {
    currentLanguage = savedLanguage;
  } else if (translations[browserLanguage]) {
    currentLanguage = browserLanguage;
  }
  
  // Actualizar el contenido con el idioma seleccionado
  if (translations[currentLanguage]) {
    updateContent();
  }
}

// Iniciar la aplicación cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
