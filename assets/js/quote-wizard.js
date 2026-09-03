/**
 * ByCan HVAC Engineering — Interactive 60-Second Service Request & Estimate Wizard
 */

document.addEventListener('DOMContentLoaded', () => {
  let currentStep = 1;
  const totalSteps = 4;

  const quoteData = {
    system: 'Boiler & Hydronics',
    service: 'Emergency Diagnostic & Repair',
    property: 'Single Family Home',
    location: 'Etobicoke / West Toronto',
    urgency: 'Emergency (Same-Day / Immediate)',
    name: '',
    phone: '',
    notes: ''
  };

  const stepNodes = document.querySelectorAll('.wizard-step-node');
  const stepContents = document.querySelectorAll('.wizard-step-content');
  const prevBtn = document.getElementById('wizardPrevBtn');
  const nextBtn = document.getElementById('wizardNextBtn');
  const submitBtn = document.getElementById('wizardSubmitBtn');
  const whatsappBtn = document.getElementById('wizardWhatsAppBtn');
  const summaryBox = document.getElementById('wizardSummary');

  // Option selection handlers
  document.querySelectorAll('.wizard-option-card').forEach(card => {
    card.addEventListener('click', () => {
      const field = card.getAttribute('data-field');
      const value = card.getAttribute('data-value');

      // Deselect siblings
      const siblings = card.parentElement.querySelectorAll(`.wizard-option-card[data-field="${field}"]`);
      siblings.forEach(s => s.classList.remove('selected'));

      // Select clicked
      card.classList.add('selected');
      quoteData[field] = value;
      updateSummary();
    });
  });

  function updateStepsUI() {
    stepNodes.forEach((node, index) => {
      const stepIndex = index + 1;
      node.classList.remove('active', 'completed');
      if (stepIndex === currentStep) {
        node.classList.add('active');
      } else if (stepIndex < currentStep) {
        node.classList.add('completed');
      }
    });

    stepContents.forEach((content, index) => {
      const stepIndex = index + 1;
      if (stepIndex === currentStep) {
        content.classList.add('active');
      } else {
        content.classList.remove('active');
      }
    });

    // Button state
    if (prevBtn) prevBtn.style.display = currentStep > 1 ? 'inline-flex' : 'none';
    if (nextBtn) nextBtn.style.display = currentStep < totalSteps ? 'inline-flex' : 'none';
    if (submitBtn) submitBtn.style.display = currentStep === totalSteps ? 'inline-flex' : 'none';
    if (whatsappBtn) whatsappBtn.style.display = currentStep === totalSteps ? 'inline-flex' : 'none';
  }

  function updateSummary() {
    if (!summaryBox) return;
    summaryBox.innerHTML = `
      <div style="background: rgba(11, 17, 30, 0.9); border: 1px solid var(--border-highlight); border-radius: var(--radius-md); padding: 16px; margin-top: 16px;">
        <h4 style="color: var(--color-flame); font-size: 0.9rem; margin-bottom: 8px;">Request Summary:</h4>
        <p style="font-size: 0.8rem; color: #cbd5e1; margin-bottom: 4px;"><strong>System:</strong> ${quoteData.system}</p>
        <p style="font-size: 0.8rem; color: #cbd5e1; margin-bottom: 4px;"><strong>Service:</strong> ${quoteData.service}</p>
        <p style="font-size: 0.8rem; color: #cbd5e1; margin-bottom: 4px;"><strong>Location:</strong> ${quoteData.location} (${quoteData.property})</p>
        <p style="font-size: 0.8rem; color: #cbd5e1;"><strong>Urgency:</strong> <span style="color: var(--color-flame-light);">${quoteData.urgency}</span></p>
      </div>
    `;
  }

  nextBtn?.addEventListener('click', () => {
    if (currentStep < totalSteps) {
      currentStep++;
      updateStepsUI();
      updateSummary();
    }
  });

  prevBtn?.addEventListener('click', () => {
    if (currentStep > 1) {
      currentStep--;
      updateStepsUI();
    }
  });

  // Direct WhatsApp dispatch with pre-filled details
  whatsappBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    const nameInput = document.getElementById('wizardName')?.value || 'Customer';
    const phoneInput = document.getElementById('wizardPhone')?.value || '';
    const notesInput = document.getElementById('wizardNotes')?.value || '';

    const text = encodeURIComponent(
      `Hello ByCan HVAC Engineering! I'd like to request service:\n\n` +
      `👤 Name: ${nameInput}\n` +
      `📞 Phone: ${phoneInput}\n` +
      `🔧 System: ${quoteData.system}\n` +
      `⚠️ Service Needed: ${quoteData.service}\n` +
      `📍 Location: ${quoteData.location} (${quoteData.property})\n` +
      `⚡ Urgency: ${quoteData.urgency}\n` +
      (notesInput ? `📝 Details: ${notesInput}\n` : '')
    );

    window.open(`https://wa.me/14375999215?text=${text}`, '_blank');
  });

  submitBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    const name = document.getElementById('wizardName')?.value;
    const phone = document.getElementById('wizardPhone')?.value;

    if (!name || !phone) {
      alert('Please provide your name and contact phone number so our technician can reach you.');
      return;
    }

    alert(`Thank you, ${name}! Your service request for ${quoteData.system} has been submitted to ByCan HVAC Engineering. A technician will contact you at ${phone} promptly.`);
  });

  // Initialize
  updateStepsUI();
});
