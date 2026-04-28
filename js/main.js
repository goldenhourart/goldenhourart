    /* ---- CAROUSEL ---- */
    const SLIDE_DURATION = 6000; // ms entre chaque slide
    let currentSlide = 0;
    let carouselTimer = null;
    let progressTimer = null;
    let progressStart = null;

    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.carousel-dot');
    const progressBar = document.getElementById('carouselProgress');

    function goToSlide(index) {
      slides[currentSlide].classList.remove('active');
      dots[currentSlide].classList.remove('active');
      dots[currentSlide].setAttribute('aria-selected', 'false');
      currentSlide = (index + slides.length) % slides.length;
      slides[currentSlide].classList.add('active');
      dots[currentSlide].classList.add('active');
      dots[currentSlide].setAttribute('aria-selected', 'true');
      startAuto();
    }

    function carouselNext() { goToSlide(currentSlide + 1); }
    function carouselPrev() { goToSlide(currentSlide - 1); }

    function animateProgress(ts) {
      const elapsed = ts - progressStart;
      const pct = Math.min((elapsed / SLIDE_DURATION) * 100, 100);
      progressBar.style.width = pct + '%';
      if (pct < 100) progressTimer = requestAnimationFrame(animateProgress);
    }

    function startAuto() {
      clearTimeout(carouselTimer);
      cancelAnimationFrame(progressTimer);
      progressBar.style.width = '0%';
      progressStart = performance.now();
      progressTimer = requestAnimationFrame(animateProgress);
      carouselTimer = setTimeout(carouselNext, SLIDE_DURATION);
    }

    function stopAuto() {
      clearTimeout(carouselTimer);
      cancelAnimationFrame(progressTimer);
    }

    // Pause au survol
    document.getElementById('hero').addEventListener('mouseenter', stopAuto);
    document.getElementById('hero').addEventListener('mouseleave', startAuto);

    // Swipe tactile
    let touchStartX = 0;
    document.getElementById('hero').addEventListener('touchstart', e => {
      touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });
    document.getElementById('hero').addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 50) dx < 0 ? carouselNext() : carouselPrev();
    }, { passive: true });

    // Flèches clavier
    document.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') carouselNext();
      if (e.key === 'ArrowLeft') carouselPrev();
    });

    // Démarrage
    startAuto();

    /* ---- LANGUE ---- */
    let currentLang = 'fr';
    function setLang(lang) {
      currentLang = lang;
      document.querySelectorAll('.lang-btn').forEach(b => {
        b.classList.toggle('active', b.textContent.trim().toLowerCase() === lang);
      });
      document.querySelectorAll('[data-' + lang + ']').forEach(el => {
        const val = el.getAttribute('data-' + lang);
        if (val) el.innerHTML = val;
      });
      document.documentElement.setAttribute('lang', lang === 'ar' ? 'ar' : lang === 'en' ? 'en' : 'fr');
    }

    /* ---- NAV SCROLL ---- */
    window.addEventListener('scroll', () => {
      document.getElementById('nav').classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });

    /* ---- MOBILE MENU ---- */
    function openMobileMenu() {
      document.getElementById('mobileMenu').classList.add('open');
      document.body.style.overflow = 'hidden';
    }
    function closeMobileMenu() {
      document.getElementById('mobileMenu').classList.remove('open');
      document.body.style.overflow = '';
    }

    /* ---- GALLERY TABS ---- */
    function switchTab(btn, panelId) {
      document.querySelectorAll('.gallery-tab').forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      document.querySelectorAll('.gallery-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      document.getElementById(panelId).classList.add('active');
    }

    /* ---- VIDEO OPEN ---- */
    function openVideo(url) {
      if (url && url !== '#') window.open(url, '_blank', 'noopener,noreferrer');
    }

    /* ---- SANITIZE (anti-XSS) ---- */
    function sanitize(str) {
      if (!str) return '';
      return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;')
        .trim();
    }

    /* ---- WHATSAPP FORM ---- */
    function sendToWhatsapp(e) {
      e.preventDefault();

      // Vérification consentement RGPD
      if (!document.getElementById('consent').checked) {
        alert(currentLang === 'fr'
          ? 'Merci de cocher la case de consentement RGPD avant d\'envoyer votre demande.'
          : 'Please check the GDPR consent box before sending your request.');
        return;
      }

      // Récupération et sanitisation des champs
      const f = {
        nom:           sanitize(document.getElementById('f-nom').value),
        prenom:        sanitize(document.getElementById('f-prenom').value),
        age:           sanitize(document.getElementById('f-age').value),
        poids:         sanitize(document.getElementById('f-poids').value),
        profession:    sanitize(document.getElementById('f-profession').value),
        ville:         sanitize(document.getElementById('f-ville').value),
        tel:           sanitize(document.getElementById('f-tel').value),
        stress:        sanitize(document.getElementById('f-stress').value),
        angoisse:      sanitize(document.getElementById('f-angoisse').value),
        perso:         sanitize(document.getElementById('f-perso').value),
        pro:           sanitize(document.getElementById('f-pro').value),
        blocage_perso: sanitize(document.getElementById('f-blocage-perso').value),
        blocage_pro:   sanitize(document.getElementById('f-blocage-pro').value),
        trauma_ancien: sanitize(document.getElementById('f-trauma-ancien').value),
        trauma_recent: sanitize(document.getElementById('f-trauma-recent').value),
        tms:           sanitize(document.getElementById('f-tms').value),
        douleurs:      sanitize(document.getElementById('f-douleurs').value),
        patho:         sanitize(document.getElementById('f-patho').value),
        traitement:    sanitize(document.getElementById('f-traitement').value),
        prothese:      sanitize(document.getElementById('f-prothese').value),
        coag:          sanitize(document.getElementById('f-coag').value),
        message:       sanitize(document.getElementById('f-message').value),
      };

      // Validation champs requis
      if (!f.nom || !f.prenom || !f.age || !f.ville || !f.tel) {
        alert(currentLang === 'fr'
          ? 'Merci de remplir les champs obligatoires (Nom, Prénom, Âge, Ville, Téléphone).'
          : 'Please fill in the required fields (Last name, First name, Age, City, Phone).');
        return;
      }

      // Construction du message WhatsApp
      const sep = '%0A----%0A';
      const line = (label, val) => val ? `%0A*${label}:* ${encodeURIComponent(val)}` : '';
      const alwaysLine = (label, val) => `%0A*${label}:* ${encodeURIComponent(val || '—')}`;

      let msg = `*✦ DEMANDE DE RENDEZ-VOUS - GOLDEN HOUR ✦*%0A%0A`;
      msg += `*${f.prenom} ${f.nom}* — ${f.age} ans`;
      if (f.poids) msg += ` — ${f.poids} kg`;
      msg += `%0A*Ville:* ${f.ville}`;
      msg += `%0A*Tél:* ${f.tel}`;
      if (f.profession) msg += `%0A*Profession:* ${f.profession}`;

      msg += `${sep}*SITUATION ACTUELLE*`;
      msg += line('Stress', f.stress);
      msg += line('Angoisses', f.angoisse);
      msg += line('Situation perso', f.perso);
      msg += line('Situation pro', f.pro);
      msg += line('Blocages perso', f.blocage_perso);
      msg += line('Blocages pro', f.blocage_pro);

      msg += `${sep}*PSYCHOLOGIE*`;
      msg += line('Traumatismes anciens', f.trauma_ancien);
      msg += line('Traumatismes récents', f.trauma_recent);

      msg += `${sep}${encodeURIComponent('*CORPS & SANTÉ*')}`;
      msg += alwaysLine('TMS', f.tms);
      msg += alwaysLine('Douleurs / blessures', f.douleurs);
      msg += alwaysLine('Pathologies', f.patho);
      msg += alwaysLine('Traitements en cours', f.traitement);
      msg += alwaysLine('Prothèses', f.prothese);
      msg += alwaysLine('Coagulation', f.coag);

      msg += `${sep}${encodeURIComponent('*MESSAGE COMPLÉMENTAIRE*')}%0A${encodeURIComponent(f.message || '—')}`;

      msg += `${sep}_⚠️ Merci de joindre votre photo (sans maquillage, sans lunettes) à ce message._`;

      // ⚠️ REMPLACE TON_NUMERO par ton vrai numéro WhatsApp (ex: 33612345678)
      const WHATSAPP_NUMBER = '33644373195';
      const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`;

      window.open(waUrl, '_blank', 'noopener,noreferrer');
    }

    /* ---- MASTERCLASS WHATSAPP FORM ---- */
    function sendMasterclassToWhatsapp(e) {
      e.preventDefault();

      if (!document.getElementById('mc-consent').checked) {
        alert('Merci de cocher la case de consentement avant d\'envoyer votre candidature.');
        return;
      }

      const g = id => sanitize(document.getElementById(id).value);

      const nom          = g('mc-nom');
      const naissance    = g('mc-naissance');
      const nationalite  = g('mc-nationalite');
      const ville        = g('mc-ville');
      const tel          = g('mc-tel');
      const email        = g('mc-email');

      if (!nom || !naissance || !ville || !tel || !email) {
        alert('Merci de remplir les champs obligatoires (Nom, Date de naissance, Ville, Téléphone, Email).');
        return;
      }

      const sep  = '%0A----%0A';
      const line = (label, val) => val ? `%0A*${label}:* ${encodeURIComponent(val)}` : '';

      let msg = `*✦ CANDIDATURE MASTERCLASS GOLDEN HOUR ✦*%0A%0A`;
      msg += `*${encodeURIComponent(nom)}*`;
      if (naissance) msg += ` — né(e) le ${encodeURIComponent(naissance)}`;
      if (nationalite) msg += ` — ${encodeURIComponent(nationalite)}`;
      msg += `%0A*Ville:* ${encodeURIComponent(ville)}`;
      msg += `%0A*Tél:* ${encodeURIComponent(tel)}`;
      msg += `%0A*Email:* ${encodeURIComponent(email)}`;
      msg += line('Profession', g('mc-profession'));
      msg += line('Parcours professionnel', g('mc-parcours'));

      msg += `${sep}${encodeURIComponent('*PARCOURS CORPOREL & THÉRAPEUTIQUE*')}`;
      msg += line('Formation soin / bien-être', g('mc-formation-soin'));
      msg += line('Durée de pratique', g('mc-pratique-duree'));
      msg += line('Relation au toucher', g('mc-toucher'));
      msg += line('Accompagnement transformation', g('mc-accompagnement'));

      msg += `${sep}${encodeURIComponent('*DIMENSION ÉMOTIONNELLE*')}`;
      msg += line('Rapport aux émotions', g('mc-emotions'));
      msg += line('Événements marquants', g('mc-evenements'));
      msg += line('Transformation des expériences', g('mc-transformation-exp'));
      msg += line('Réaction émotions intenses', g('mc-reaction-emotion'));
      msg += line('Moment de transformation profonde', g('mc-moment-transfo'));

      msg += `${sep}${encodeURIComponent('*INTUITION & PERCEPTION*')}`;
      msg += line('Intuition', g('mc-intuitif'));
      msg += line('Empathie / Ressentir les autres', g('mc-empathie'));
      msg += line('Connexion sans paroles', g('mc-connexion'));
      msg += line('Vision du corps humain', g('mc-vision-corps'));

      msg += `${sep}*MOTIVATION*`;
      msg += line('Pourquoi la MasterClass', g('mc-pourquoi'));
      msg += line('Attrait pour cet Art', g('mc-attrait'));
      msg += line('Se transformer soi-même', g('mc-transformer-soi'));
      msg += line('Apport aux autres', g('mc-apport'));
      msg += line('Engagement plein', g('mc-engagement-plein'));

      msg += `${sep}*ENGAGEMENT*`;
      msg += line('Travail sur soi', g('mc-travail-soi'));
      msg += line('Charte éthique', g('mc-charte'));
      msg += line("Définition de l'humilité", g('mc-humilite'));

      msg += `${sep}${encodeURIComponent('*VISAGE & ESTHÉTIQUE*')}`;
      msg += line('Importance du visage', g('mc-visage-importance'));
      msg += line('Émotions et structure du visage', g('mc-emotions-visage'));
      msg += line('Transformations physiques observées', g('mc-transfo-physiques'));

      msg += `${sep}${encodeURIComponent('*EXPÉRIENCE GOLDEN HOUR*')}`;
      msg += line('Expérience vécue', g('mc-experience-gh'));
      msg += line('Vécu', g('mc-vecu-gh'));
      msg += line('Changements observés', g('mc-changements-gh'));

      msg += `${sep}${encodeURIComponent('*DISPONIBILITÉ*')}`;
      msg += line('Formation intensive', g('mc-dispo-intensive'));
      msg += line('Déplacement possible', g('mc-deplacement'));
      msg += line('Engagement dans la durée', g('mc-engagement-duree'));

      msg += `${sep}_⚠️ Merci de joindre votre photo (naturelle, sans filtre) et votre vidéo de présentation (1-2 min) à ce message._`;

      const WHATSAPP_NUMBER = '33644373195';
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank', 'noopener,noreferrer');
    }

    /* ---- SLIDER AVANT/APRÈS ---- */
    let baCurrentSlide = 0;
    const baSlides = document.querySelectorAll('.ba-slide');
    const baDots = document.querySelectorAll('.ba-dot');

    function baGoTo(index) {
      const total = baSlides.length;
      const next = (index + total) % total;
      baSlides[baCurrentSlide].classList.remove('active');
      baDots[baCurrentSlide].classList.remove('active');
      baDots[baCurrentSlide].setAttribute('aria-selected', 'false');
      baCurrentSlide = next;
      baSlides[baCurrentSlide].classList.add('active');
      baDots[baCurrentSlide].classList.add('active');
      baDots[baCurrentSlide].setAttribute('aria-selected', 'true');
    }
