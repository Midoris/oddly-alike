(() => {
  const form = document.querySelector('[data-support-form]');
  if (!form) return;
  const button = form.querySelector('button[type="submit"]');
  const status = document.querySelector('[data-support-status]');
  if (!button || !status || typeof crypto === 'undefined' || typeof crypto.randomUUID !== 'function'
      || typeof AbortSignal === 'undefined' || typeof AbortSignal.timeout !== 'function') {
    if (status) status.textContent = 'This browser cannot use the form. Please use Contact Support in the app’s Settings.';
    return;
  }
  const started = form.elements.startedAt;
  const fieldsToLock = [...form.querySelectorAll('input, select, textarea')];
  let id = crypto.randomUUID();
  let inFlight = false;
  let lastBody = '';
  started.value = String(Date.now());
  const local = ['localhost', '127.0.0.1', '[::1]'].includes(location.hostname);
  const endpoint = local ? '/api/support' : form.dataset.endpoint;
  const initialTopic = new URLSearchParams(location.search).get('topic');
  if (['support', 'privacy', 'deletion', 'purchase'].includes(initialTopic)) form.elements.topic.value = initialTopic;

  function setStatus(message, state) {
    status.textContent = message;
    status.dataset.state = state;
  }
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (inFlight || !form.reportValidity()) return;
    const fields = new FormData(form);
    const content = {
      name: String(fields.get('name') || '').trim(), email: String(fields.get('email') || '').trim(),
      topic: String(fields.get('topic') || ''), message: String(fields.get('message') || '').trim(),
    };
    const body = JSON.stringify(content);
    if (lastBody && body !== lastBody) id = crypto.randomUUID();
    lastBody = body;
    inFlight = true;
    const previousDisabled = fieldsToLock.map(field => field.disabled);
    fieldsToLock.forEach(field => { field.disabled = true; });
    button.disabled = true;
    button.textContent = 'Sending…';
    form.setAttribute('aria-busy', 'true');
    setStatus('Sending your message…', 'pending');
    try {
      const response = await fetch(endpoint, {
        method: 'POST', credentials: 'omit', redirect: 'error',
        headers: { 'Content-Type': 'application/json' }, signal: AbortSignal.timeout(20_000),
        body: JSON.stringify({ ...content, id, company: String(fields.get('company') || ''), startedAt: Number(started.value) }),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || result?.ok !== true) {
        const message = typeof result?.error === 'string' ? result.error : 'Your message could not be sent. Please try again later.';
        throw new Error(message);
      }
      form.reset();
      started.value = String(Date.now());
      id = crypto.randomUUID();
      lastBody = '';
      setStatus('Message sent. Thank you — we’ll reply to the email you provided.', 'success');
    } catch (error) {
      setStatus(error?.name === 'TimeoutError'
        ? 'The request timed out. Your text is still here. You can try again.'
        : error?.message || 'Your message could not be sent. Your text is still here. Please try again later.', 'error');
    } finally {
      inFlight = false;
      button.disabled = false;
      button.textContent = 'Send message';
      form.removeAttribute('aria-busy');
      fieldsToLock.forEach((field, index) => { field.disabled = previousDisabled[index]; });
    }
  });
  button.disabled = false;
})();
