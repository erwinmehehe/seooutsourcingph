(() => {
  const menuButton = document.querySelector('[data-menu-button]');
  const mobileMenu = document.querySelector('[data-mobile-nav]');
  if (menuButton && mobileMenu) {
    menuButton.addEventListener('click', () => {
      const open = menuButton.getAttribute('aria-expanded') !== 'true';
      menuButton.setAttribute('aria-expanded', String(open));
      mobileMenu.classList.toggle('open', open);
      menuButton.textContent = open ? 'Close' : 'Menu';
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
        mobileMenu.classList.remove('open');
        menuButton.setAttribute('aria-expanded', 'false');
        menuButton.textContent = 'Menu';
        menuButton.focus();
      }
    });
    mobileMenu.addEventListener('click', (e) => {
      if (e.target.closest('a')) {
        mobileMenu.classList.remove('open');
        menuButton.setAttribute('aria-expanded', 'false');
        menuButton.textContent = 'Menu';
      }
    });
  }
  const filters = [...document.querySelectorAll('[data-filter]')];
  if (filters.length) {
    const cards = [...document.querySelectorAll('[data-topic]')];
    filters.forEach((button) => button.addEventListener('click', () => {
      filters.forEach((b) => b.setAttribute('aria-pressed', String(b === button)));
      const term = button.dataset.filter;
      cards.forEach((card) => card.classList.toggle('hide', term !== 'All' && card.dataset.topic !== term));
    }));
  }
  const contact = document.querySelector('#contact-form');
  if (contact && !window.SOP_WORDPRESS_FORM) {
    const status = document.querySelector('#contact-status');
    const params = new URLSearchParams(window.location.search);
    const audience = params.get('audience');
    const plan = params.get('plan');
    const service = params.get('service');
    if (audience && ['agency','business'].includes(audience)) contact.elements.audience.value = audience;
    if (plan) {
      const opt = [...contact.elements.plan.options].find(o => o.value.toLowerCase() === plan.toLowerCase());
      if (opt) contact.elements.plan.value = opt.value;
    }
    if (service) contact.elements.service.value = service.slice(0, 140);
    let token = '';
    const session = async () => {
      const response = await fetch('/api/session', { credentials:'same-origin', cache:'no-store' });
      if (!response.ok) throw new Error('Form service is not connected on this preview.');
      const data = await response.json();
      if (!data.csrf_token) throw new Error('Form session could not be started.');
      return data.csrf_token;
    };
    const show = (message, success) => {
      status.textContent = message;
      status.className = `alert visible ${success ? 'success' : 'error'}`;
      status.setAttribute('role', success ? 'status' : 'alert');
    };
    session().then(t => { token = t; }).catch(() => {
      show('Preview mode: this form needs the included server or your WordPress CRM integration before it can receive inquiries.', false);
    });
    contact.addEventListener('submit', async (event) => {
      event.preventDefault();
      const submit = contact.querySelector('[type="submit"]');
      if (!contact.reportValidity()) return;
      if (!token) { show('Form submission is not enabled in this static preview. Run the included server or connect your form provider.', false); return; }
      const fields = Object.fromEntries(new FormData(contact).entries());
      const context = fields.service ? `Service interest: ${fields.service}\n\n` : '';
      const payload = {
        csrf_token: token,
        audience: fields.audience,
        plan: fields.plan,
        name: fields.name,
        email: fields.email,
        company: fields.company || '',
        website: fields.website || '',
        details: context + fields.details,
        phone_confirm: fields.phone_confirm || '',
        consent: fields.consent === 'on'
      };
      submit.disabled = true;
      submit.textContent = 'Sending request...';
      try {
        const response = await fetch('/api/inquiry', {
          method:'POST', credentials:'same-origin',
          headers:{'Content-Type':'application/json'},
          body:JSON.stringify(payload)
        });
        const result = await response.json();
        if (!response.ok || !result.ok) throw new Error(result.error || 'Could not submit the request.');
        show(`Request received. Reference ${result.reference}. We have saved the details you supplied.`, true);
        contact.reset();
        token = await session();
      } catch (error) {
        show(error.message || 'The request could not be sent. Please email info@seooutsourcingphilippines.com.', false);
      } finally {
        submit.disabled = false;
        submit.textContent = 'Request a tailored scope';
      }
    });
  }
})();


/* V8 contribution calculator: on-device only. */
document.querySelectorAll('[data-margin-calculator]').forEach((calculator) => {
  const fmt = new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0});
  const inputs = Object.fromEntries([...calculator.querySelectorAll('[data-calc]')].map(el => [el.dataset.calc,el]));
  const o = k => calculator.querySelector(`[data-output="${k}"]`);
  const update = () => {
    const val = k => Math.max(0, Number(inputs[k]?.value||0));
    const r=val('revenue'),v=val('vendor'),i=val('internal'),t=val('other');
    const contribution=r-v-i-t;
    o('contribution').textContent=fmt.format(contribution);
    o('margin').textContent=r>0 ? `${(contribution/r*100).toFixed(1)}%` : '—';
    o('formula').textContent=`(${fmt.format(r)} − ${fmt.format(v)} − ${fmt.format(i)} − ${fmt.format(t)}) ÷ ${fmt.format(r)}`;
  };
  Object.values(inputs).forEach(x=>x.addEventListener('input',update));
  update();
});
