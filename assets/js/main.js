/**
 * ByCan HVAC Engineering — Main Client JavaScript & Interactive Animation Engine
 */

document.addEventListener('DOMContentLoaded', () => {

  // --- 0. Initial Branded Preloader Experience ---
  const preloader = document.getElementById('sitePreloader');
  const preloaderBar = document.getElementById('preloaderProgressBar');

  if (preloader) {
    const startTime = performance.now();
    const minDisplayDuration = 800; // ms for subtle, confident brand registration
    const maxTimeoutDuration = 1500; // max safety timeout so user is never blocked

    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let progress = 0;
    const progressInterval = setInterval(() => {
      if (progress < 85) {
        progress += Math.random() * 15 + 10;
        if (progress > 85) progress = 85;
        if (preloaderBar) preloaderBar.style.width = `${progress}%`;
      }
    }, 90);

    const dismissPreloader = () => {
      clearInterval(progressInterval);
      if (preloaderBar) preloaderBar.style.width = '100%';

      if (prefersReducedMotion) {
        preloader.classList.add('preloader-hidden');
        document.body.classList.add('site-ready');
        setTimeout(() => { preloader.style.display = 'none'; }, 50);
        return;
      }

      const elapsed = performance.now() - startTime;
      const remaining = Math.max(0, minDisplayDuration - elapsed);

      setTimeout(() => {
        preloader.classList.add('preloader-hidden');
        document.body.classList.add('site-ready');
        setTimeout(() => {
          preloader.style.display = 'none';
        }, 500);
      }, remaining + 60);
    };

    if (document.readyState === 'complete') {
      dismissPreloader();
    } else {
      window.addEventListener('load', dismissPreloader);
      setTimeout(dismissPreloader, maxTimeoutDuration);
    }
  } else {
    document.body.classList.add('site-ready');
  }

  // --- 1. Top Scroll Progress Indicator, Sticky Shrink Header & Back to Top ---
  const header = document.querySelector('.site-header');
  const progressBar = document.getElementById('scrollProgressBar');
  
  // Inject Back to Top Button if not already in DOM
  let backToTopBtn = document.getElementById('backToTopBtn');
  if (!backToTopBtn) {
    backToTopBtn = document.createElement('button');
    backToTopBtn.id = 'backToTopBtn';
    backToTopBtn.className = 'back-to-top-btn';
    backToTopBtn.setAttribute('aria-label', 'Scroll back to top');
    backToTopBtn.innerHTML = `
      <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
        <path d="M18 15l-6-6-6 6"/>
      </svg>
    `;
    document.body.appendChild(backToTopBtn);
  }

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    
    if (progressBar && docHeight > 0) {
      const scrollPercent = (scrollY / docHeight) * 100;
      progressBar.style.width = `${scrollPercent}%`;
    }

    if (scrollY > 20) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }

    // Shrink header past hero fold
    if (scrollY > 80) {
      header?.classList.add('scrolled-header');
    } else {
      header?.classList.remove('scrolled-header');
    }

    // Back to top visibility
    if (scrollY > 350) {
      backToTopBtn?.classList.add('visible');
    } else {
      backToTopBtn?.classList.remove('visible');
    }
  }, { passive: true });

  backToTopBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Highlight active navigation link across pages
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link, .dropdown-item, .drawer-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href && (href === currentPath || (currentPath === '' && href === 'index.html'))) {
      link.classList.add('active');
    }
  });

  // --- 2. Enhanced IntersectionObserver Scroll Reveal Engine ---
  const revealElements = document.querySelectorAll(
    '.reveal, .reveal-up, .reveal-left, .reveal-right, .reveal-scale, .stagger-grid'
  );

  // Immediately reveal hero elements above the fold
  document.querySelectorAll('#hero .reveal, #hero .reveal-left, #hero .reveal-right, #hero .reveal-up').forEach(el => {
    setTimeout(() => el.classList.add('revealed'), 100);
  });

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.08,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('revealed'));
  }

  // --- 2b. Technical Metric Highlight Counter ---
  const metricElements = document.querySelectorAll('.spec-tag');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const metricObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const originalText = el.textContent.trim();
          const match = originalText.match(/^(\d+)(%.*)$/);
          if (match) {
            const targetNum = parseInt(match[1], 10);
            const suffix = match[2];
            const startTime = performance.now();
            const duration = 650;
            const animateCount = (now) => {
              const elapsed = now - startTime;
              const progress = Math.min(1, elapsed / duration);
              const ease = 1 - Math.pow(1 - progress, 3);
              const val = Math.round(ease * targetNum);
              el.textContent = `${val}${suffix}`;
              if (progress < 1) {
                requestAnimationFrame(animateCount);
              } else {
                el.textContent = originalText;
              }
            };
            requestAnimationFrame(animateCount);
          }
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.2 });
    metricElements.forEach(el => metricObserver.observe(el));
  }

  // --- 3. Mobile Drawer Navigation ---
  const drawerToggle = document.getElementById('mobileMenuToggle');
  const drawerClose = document.getElementById('drawerCloseBtn');
  const drawer = document.getElementById('mobileDrawer');
  const backdrop = document.getElementById('drawerBackdrop');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  function openDrawer() {
    drawer?.classList.add('active');
    backdrop?.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer?.classList.remove('active');
    backdrop?.classList.remove('active');
    document.body.style.overflow = '';
  }

  drawerToggle?.addEventListener('click', openDrawer);
  drawerClose?.addEventListener('click', closeDrawer);
  backdrop?.addEventListener('click', closeDrawer);
  drawerLinks.forEach(link => link.addEventListener('click', closeDrawer));

  // --- 4. Interactive Service Discovery Tabs ---
  const discoveryTabs = document.querySelectorAll('.discovery-tab-btn');
  const servicePanels = document.querySelectorAll('.editorial-service-card');

  discoveryTabs.forEach(btn => {
    btn.addEventListener('click', () => {
      discoveryTabs.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const targetCategory = btn.getAttribute('data-category');

      servicePanels.forEach(panel => {
        if (targetCategory === 'all' || panel.getAttribute('data-category') === targetCategory) {
          panel.style.display = 'grid';
          panel.style.opacity = '0';
          panel.style.transform = 'translateY(16px)';
          setTimeout(() => {
            panel.style.transition = 'all 0.35s ease-out';
            panel.style.opacity = '1';
            panel.style.transform = 'translateY(0)';
          }, 30);
        } else {
          panel.style.display = 'none';
        }
      });
    });
  });

  // --- 5. FAQ Accordion ---
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question?.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      faqItems.forEach(i => i.classList.remove('active'));
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // --- 6. Guided Technical Request Console Engine ---
  let consoleStep = 1;
  const totalConsoleSteps = 4;

  const defaultRequestData = {
    equipment: 'Hydronic Boiler',
    issue: 'No Heat / Cold Air',
    municipality: 'Etobicoke Hub',
    property: 'Detached Home',
    name: '',
    phone: '',
    notes: ''
  };

  let requestData = { ...defaultRequestData };

  const stepItems = document.querySelectorAll('.console-step-item');
  const progressLine = document.getElementById('consoleProgressLine');
  const stepPanes = document.querySelectorAll('.console-pane');
  const prevBtn = document.getElementById('consolePrevBtn');
  const nextBtn = document.getElementById('consoleNextBtn');
  const submitBtn = document.getElementById('consoleSubmitBtn');
  const whatsappBtn = document.getElementById('consoleWhatsAppBtn');
  const summaryBox = document.getElementById('consoleSummaryBox');
  const validationMsg = document.getElementById('consoleValidationMsg');
  const validationText = document.getElementById('consoleValidationText');
  const nameInput = document.getElementById('consoleName');
  const phoneInput = document.getElementById('consolePhone');
  const notesInput = document.getElementById('consoleNotes');

  // Confirmation Modal Elements
  const confirmModal = document.getElementById('consoleConfirmModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalDoneBtn = document.getElementById('modalDoneBtn');
  const modalCustomerName = document.getElementById('modalCustomerName');
  const modalSystemName = document.getElementById('modalSystemName');
  const modalValSystem = document.getElementById('modalValSystem');
  const modalValIssue = document.getElementById('modalValIssue');
  const modalValArea = document.getElementById('modalValArea');
  const modalValPhone = document.getElementById('modalValPhone');

  // Validation UI helpers
  function showValidationError(message, targetInput = null) {
    if (validationMsg && validationText) {
      validationText.textContent = message;
      validationMsg.style.display = 'flex';
      validationMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    if (targetInput) {
      targetInput.classList.add('input-error');
      targetInput.focus();
    }
  }

  function hideValidationError() {
    if (validationMsg) {
      validationMsg.style.display = 'none';
    }
    nameInput?.classList.remove('input-error');
    phoneInput?.classList.remove('input-error');
  }

  // Live Phone Auto-Formatting
  function formatPhoneNumber(value) {
    if (!value) return value;
    const digits = value.replace(/[^\d]/g, '');
    const len = digits.length;
    if (len < 4) return digits;
    if (len < 7) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    }
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  }

  phoneInput?.addEventListener('input', (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    e.target.value = formatted;
    hideValidationError();
  });

  nameInput?.addEventListener('input', () => {
    hideValidationError();
  });

  // Handle clickable & accessible selection chips
  document.querySelectorAll('.selection-chip').forEach(chip => {
    const handleSelect = () => {
      const field = chip.getAttribute('data-field');
      const value = chip.getAttribute('data-value');

      const parentGrid = chip.closest('.chip-grid');
      parentGrid?.querySelectorAll(`.selection-chip[data-field="${field}"]`).forEach(c => {
        c.classList.remove('selected');
        c.setAttribute('aria-checked', 'false');
      });

      chip.classList.add('selected');
      chip.setAttribute('aria-checked', 'true');
      if (field) {
        requestData[field] = value;
      }
      hideValidationError();
      renderConsoleSummary();
    };

    chip.addEventListener('click', handleSelect);
    chip.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleSelect();
      }
    });
  });

  function updateConsoleSteps() {
    // Update progress fill line
    if (progressLine) {
      const progressPercentages = [0, 33.33, 66.66, 100];
      progressLine.style.width = `${progressPercentages[consoleStep - 1]}%`;
    }

    // Update step indicator items
    stepItems.forEach((item, index) => {
      const stepIdx = index + 1;
      item.classList.remove('active', 'completed');
      if (stepIdx === consoleStep) {
        item.classList.add('active');
      } else if (stepIdx < consoleStep) {
        item.classList.add('completed');
      }
    });

    // Update pane visibility
    stepPanes.forEach((pane, index) => {
      const paneIdx = index + 1;
      if (paneIdx === consoleStep) {
        pane.classList.add('active');
      } else {
        pane.classList.remove('active');
      }
    });

    // Update control buttons
    if (prevBtn) prevBtn.style.display = consoleStep > 1 ? 'inline-flex' : 'none';
    if (nextBtn) nextBtn.style.display = consoleStep < totalConsoleSteps ? 'inline-flex' : 'none';
    if (submitBtn) submitBtn.style.display = consoleStep === totalConsoleSteps ? 'inline-flex' : 'none';
    if (whatsappBtn) whatsappBtn.style.display = consoleStep === totalConsoleSteps ? 'inline-flex' : 'none';

    hideValidationError();
  }

  function renderConsoleSummary() {
    if (!summaryBox) return;
    summaryBox.innerHTML = `
      <div class="console-summary-card">
        <div class="summary-card-head">
          <span class="summary-spec-badge">Intake Specification</span>
          <span style="font-family: var(--font-mono); font-size: 0.7rem; color: #64748b;">Step 4 of 4</span>
        </div>
        <div class="summary-card-grid">
          <div class="summary-card-item">
            <span class="summary-item-label">SYSTEM</span>
            <span class="summary-item-value">${requestData.equipment || '—'}</span>
          </div>
          <div class="summary-card-item">
            <span class="summary-item-label">ISSUE</span>
            <span class="summary-item-value">${requestData.issue || '—'}</span>
          </div>
          <div class="summary-card-item">
            <span class="summary-item-label">SERVICE AREA</span>
            <span class="summary-item-value">${requestData.municipality || '—'}</span>
          </div>
          <div class="summary-card-item">
            <span class="summary-item-label">PROPERTY TYPE</span>
            <span class="summary-item-value">${requestData.property || 'Detached Home'}</span>
          </div>
        </div>
        <div class="console-reassurance">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          <span>We’ll review your request and contact you to confirm service availability.</span>
        </div>
      </div>
    `;
  }

  function validateCurrentStep() {
    if (consoleStep === 1) {
      if (!requestData.equipment) {
        showValidationError('Please select your system to continue.');
        return false;
      }
    } else if (consoleStep === 2) {
      if (!requestData.issue) {
        showValidationError('Please select the issue you’re experiencing.');
        return false;
      }
    } else if (consoleStep === 3) {
      if (!requestData.municipality) {
        showValidationError('Please select your service area.');
        return false;
      }
    }
    return true;
  }

  nextBtn?.addEventListener('click', () => {
    if (!validateCurrentStep()) return;
    if (consoleStep < totalConsoleSteps) {
      consoleStep++;
      updateConsoleSteps();
      renderConsoleSummary();
    }
  });

  prevBtn?.addEventListener('click', () => {
    if (consoleStep > 1) {
      consoleStep--;
      updateConsoleSteps();
    }
  });

  // Direct WhatsApp Handoff Dispatch
  whatsappBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    const name = nameInput?.value.trim() || 'Homeowner';
    const phone = phoneInput?.value.trim() || '';
    const notes = notesInput?.value.trim() || '';

    const message = encodeURIComponent(
      `Hello ByCan HVAC Engineering! I would like to request technical service:\n\n` +
      `👤 Name: ${name}\n` +
      `📞 Phone: ${phone || 'Provided upon contact'}\n` +
      `🔧 Equipment: ${requestData.equipment}\n` +
      `⚠️ Symptom/Need: ${requestData.issue}\n` +
      `📍 Location: ${requestData.municipality} (${requestData.property})\n` +
      (notes ? `📝 Details: ${notes}\n` : '')
    );

    window.open(`https://wa.me/14375999215?text=${message}`, '_blank');
  });

  // Modal Open & Reset Logic
  function openConfirmationModal() {
    if (modalCustomerName) modalCustomerName.textContent = requestData.name;
    if (modalSystemName) modalSystemName.textContent = requestData.equipment;
    if (modalValSystem) modalValSystem.textContent = requestData.equipment;
    if (modalValIssue) modalValIssue.textContent = requestData.issue;
    if (modalValArea) modalValArea.textContent = requestData.municipality;
    if (modalValPhone) modalValPhone.textContent = requestData.phone;

    if (confirmModal) {
      confirmModal.style.display = 'flex';
      setTimeout(() => {
        confirmModal.classList.add('active');
        modalDoneBtn?.focus();
      }, 10);
    }
  }

  function resetFormToStepOne() {
    // Close Modal
    if (confirmModal) {
      confirmModal.classList.remove('active');
      setTimeout(() => {
        confirmModal.style.display = 'none';
      }, 250);
    }

    // Reset Form Fields
    if (nameInput) nameInput.value = '';
    if (phoneInput) phoneInput.value = '';
    if (notesInput) notesInput.value = '';

    // Reset Data
    requestData = { ...defaultRequestData };

    // Reset UI chips to match defaultRequestData
    document.querySelectorAll('.selection-chip').forEach(chip => {
      const field = chip.getAttribute('data-field');
      const val = chip.getAttribute('data-value');
      if (val === requestData[field]) {
        chip.classList.add('selected');
        chip.setAttribute('aria-checked', 'true');
      } else {
        chip.classList.remove('selected');
        chip.setAttribute('aria-checked', 'false');
      }
    });

    // Reset Step to 1
    consoleStep = 1;
    updateConsoleSteps();
    renderConsoleSummary();
    hideValidationError();

    // Scroll back to console smoothly
    const consoleElem = document.getElementById('requestConsole');
    if (consoleElem) {
      consoleElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // Submit Request Handler with full validation
  submitBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    const name = nameInput?.value.trim();
    const phone = phoneInput?.value.trim();
    const cleanPhone = phone?.replace(/[^\d]/g, '');

    if (!name || name.length < 2) {
      showValidationError('Please enter your full name.', nameInput);
      return;
    }

    if (!cleanPhone || cleanPhone.length < 10) {
      showValidationError('Please enter a valid 10-digit phone number.', phoneInput);
      return;
    }

    requestData.name = name;
    requestData.phone = phone;
    requestData.notes = notesInput?.value.trim() || '';

    // Open Custom Confirmation Modal (NO browser alert())
    openConfirmationModal();
  });

  // Modal Close / Done Handlers
  modalDoneBtn?.addEventListener('click', resetFormToStepOne);
  modalCloseBtn?.addEventListener('click', resetFormToStepOne);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && confirmModal?.classList.contains('active')) {
      resetFormToStepOne();
    }
  });

  // --- 7. General Contact Form Handler (contact.html) ---
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    const contactPhone = document.getElementById('contactPhone');
    contactPhone?.addEventListener('input', (e) => {
      e.target.value = formatPhoneNumber(e.target.value);
    });

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <svg class="spinner" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 0.8s linear infinite; display: inline-block; vertical-align: middle; margin-right: 8px;"><circle cx="12" cy="12" r="10" stroke-opacity="0.25"/><path d="M12 2a10 10 0 0 1 10 10"/></svg>
          Transmitting Request...
        `;
      }

      setTimeout(() => {
        contactForm.innerHTML = `
          <div style="text-align: center; padding: var(--space-xl) var(--space-md); background: rgba(34, 197, 94, 0.08); border: 1px solid rgba(34, 197, 94, 0.3); border-radius: var(--radius-md);">
            <div style="width: 52px; height: 52px; border-radius: 50%; background: #22c55e; color: #fff; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px;">
              <svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <h3 style="font-size: var(--text-xl); font-weight: 800; color: var(--text-on-light-primary); margin-bottom: 8px;">Service Request Received</h3>
            <p style="font-size: var(--text-sm); color: var(--text-on-light-secondary); max-width: 500px; margin: 0 auto 20px; line-height: 1.6;">
              Thank you! Our Etobicoke dispatch coordinator has logged your request. A technician will review your specifications and reach out promptly to confirm service availability.
            </p>
            <div style="display: flex; justify-content: center; gap: 12px; flex-wrap: wrap;">
              <a href="tel:+14375999215" class="btn btn-emergency btn-sm">Urgent? Call (437) 599-9215</a>
              <a href="https://wa.me/14375999215" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp btn-sm">WhatsApp Direct</a>
            </div>
          </div>
        `;
      }, 700);
    });
  }

  // --- 8. Phase 2: Seasonal Promo Banner Dismissal ---
  const seasonalBanner = document.getElementById('seasonalBanner');
  const seasonalCloseBtn = document.getElementById('seasonalCloseBtn');
  if (seasonalBanner && seasonalCloseBtn) {
    if (sessionStorage.getItem('bycan_seasonal_dismissed') === 'true') {
      seasonalBanner.style.display = 'none';
    }
    seasonalCloseBtn.addEventListener('click', () => {
      seasonalBanner.style.display = 'none';
      sessionStorage.setItem('bycan_seasonal_dismissed', 'true');
    });
  }

  // --- 9. Phase 2: GA4 Custom Conversion Event Engine ---
  window.dataLayer = window.dataLayer || [];
  function trackEvent(eventName, eventParams = {}) {
    window.dataLayer.push({
      event: eventName,
      ...eventParams,
      timestamp: new Date().toISOString()
    });
    if (typeof gtag === 'function') {
      gtag('event', eventName, eventParams);
    }
    console.log(`[GA4 Tracked]: ${eventName}`, eventParams);
  }

  // Track Phone Clicks
  document.querySelectorAll('a[href^="tel:"]').forEach(link => {
    link.addEventListener('click', () => {
      trackEvent('phone_call_click', {
        phone_number: link.getAttribute('href').replace('tel:', ''),
        page_location: window.location.pathname
      });
    });
  });

  // Track WhatsApp Clicks
  document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
    link.addEventListener('click', () => {
      trackEvent('whatsapp_chat_click', {
        channel: 'WhatsApp Direct',
        page_location: window.location.pathname
      });
    });
  });

  // Track Video Play Trigger
  const videoPlayBtn = document.getElementById('videoPlayTrigger');
  videoPlayBtn?.addEventListener('click', () => {
    trackEvent('video_walkthrough_play', {
      video_title: 'Toronto Hydronic Boiler Mechanical Room Walkthrough'
    });
    const videoWrap = document.getElementById('videoFrameWrap');
    if (videoWrap) {
      videoWrap.innerHTML = `
        <div style="position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #040a14; color: #fff; padding: 20px; text-align: center;">
          <div style="width: 48px; height: 48px; border-radius: 50%; background: rgba(255, 85, 0, 0.2); border: 2px solid var(--color-orange-main); display: flex; align-items: center; justify-content: center; margin-bottom: 12px; color: var(--color-orange-main);">
            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          </div>
          <span style="font-family: var(--font-heading); font-weight: 700; font-size: 1rem; margin-bottom: 6px;">30-60s Engineering Walkthrough Active</span>
          <span style="font-size: 0.8rem; color: #94a3b8; max-width: 320px;">Ready for MP4/YouTube video file embedding.</span>
        </div>
      `;
    }
  });

  // --- 10. Phase 2: Interactive Portfolio & Gallery Image Lightbox ---
  let lightboxModal = document.getElementById('imageLightboxModal');
  if (!lightboxModal) {
    lightboxModal = document.createElement('div');
    lightboxModal.id = 'imageLightboxModal';
    lightboxModal.className = 'image-lightbox';
    lightboxModal.setAttribute('role', 'dialog');
    lightboxModal.setAttribute('aria-modal', 'true');
    lightboxModal.innerHTML = `
      <div class="lightbox-content">
        <button class="lightbox-close-btn" id="lightboxCloseBtn" aria-label="Close Lightbox">&times;</button>
        <div class="lightbox-img-wrap">
          <img id="lightboxImg" src="" alt="Enlarged Job Site Photo">
        </div>
        <div class="lightbox-caption" id="lightboxCaption"></div>
      </div>
    `;
    document.body.appendChild(lightboxModal);

    const closeLightbox = () => {
      lightboxModal.classList.remove('active');
      document.body.style.overflow = '';
    };

    document.getElementById('lightboxCloseBtn')?.addEventListener('click', closeLightbox);
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightboxModal.classList.contains('active')) closeLightbox();
    });
  }

  // Bind zoom on click to portfolio, before/after, project logs and editorial images
  document.querySelectorAll('.gallery-item, .before-after-media, .project-log-card, .editorial-visual-frame, .hero-visual-card').forEach(container => {
    container.addEventListener('click', (e) => {
      // Don't trigger if clicked on an anchor link directly
      if (e.target.closest('a') && !e.target.closest('.gallery-item')) return;
      
      const img = container.querySelector('img');
      if (!img) return;
      
      const captionEl = container.querySelector('.gallery-item-title, .before-after-title, .project-log-title, .spec-title');
      const caption = captionEl ? captionEl.textContent.trim() : (img.getAttribute('alt') || 'ByCan HVAC Job Site Mechanical Photo');
      
      const lightboxImg = document.getElementById('lightboxImg');
      const lightboxCaption = document.getElementById('lightboxCaption');
      if (lightboxImg && lightboxCaption) {
        lightboxImg.src = img.src;
        lightboxImg.alt = caption;
        lightboxCaption.textContent = caption;
        lightboxModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  // Initialize
  updateConsoleSteps();
  renderConsoleSummary();
});
