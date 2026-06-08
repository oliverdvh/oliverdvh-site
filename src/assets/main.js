// Substack feed loader
// Fetches the latest posts from changingstories.substack.com and injects
// them into any .writing-list element with data-substack-feed="true".
// data-limit on the list element controls how many to show (default 5).
// If the fetch fails, the hard-coded fallback markup already in the page stays in place.
(function loadSubstackFeed() {
  const lists = document.querySelectorAll('.writing-list[data-substack-feed="true"]');
  if (!lists.length) return;

  const feedUrl  = 'https://changingstories.substack.com/feed';
  const apiUrl   = 'https://api.rss2json.com/v1/api.json?rss_url=' + encodeURIComponent(feedUrl);

  fetch(apiUrl, { cache: 'no-store' })
    .then(r => r.ok ? r.json() : Promise.reject(new Error('rss2json ' + r.status)))
    .then(data => {
      if (!data || data.status !== 'ok' || !Array.isArray(data.items) || !data.items.length) {
        return; // leave fallback in place
      }
      const monthShort = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      lists.forEach(list => {
        const limit = parseInt(list.getAttribute('data-limit') || '5', 10);
        const items = data.items.slice(0, limit);
        const html = items.map(item => {
          const url   = item.link || 'https://changingstories.substack.com';
          const title = item.title || 'Untitled essay';
          let dateLabel = '';
          if (item.pubDate) {
            const d = new Date(item.pubDate);
            if (!isNaN(d)) dateLabel = monthShort[d.getMonth()] + ' ' + d.getFullYear();
          }
          // Build safely with textContent to avoid HTML injection
          const a = document.createElement('a');
          a.className = 'writing-item';
          a.href = url;
          a.target = '_blank';
          a.rel = 'noopener';
          const dateSpan = document.createElement('span');
          dateSpan.className = 'writing-date';
          dateSpan.textContent = dateLabel;
          const titleSpan = document.createElement('span');
          titleSpan.className = 'writing-title';
          titleSpan.textContent = title;
          const metaSpan = document.createElement('span');
          metaSpan.className = 'writing-meta';
          metaSpan.textContent = 'Substack';
          a.appendChild(dateSpan);
          a.appendChild(titleSpan);
          a.appendChild(metaSpan);
          return a;
        });
        list.innerHTML = '';
        html.forEach(node => list.appendChild(node));
      });
    })
    .catch(err => {
      // Silent — fallback markup stays visible
      // console.warn('Substack feed unavailable, using fallback list', err);
    });
})();

// Mobile nav
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open);
    });
    links.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => links.classList.remove('is-open')));
  }

  // Contact form — client-side mailto fallback so the site works
  // before a backend is wired up. Replace with Formspree / Wix Forms / etc.
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const name    = encodeURIComponent(data.get('name') || '');
      const subject = encodeURIComponent(`Website enquiry: ${data.get('topic') || 'general'}`);
      const body    = encodeURIComponent(
        `Name: ${data.get('name') || ''}\n` +
        `Organisation: ${data.get('org') || ''}\n` +
        `Topic: ${data.get('topic') || ''}\n\n` +
        `${data.get('message') || ''}`
      );
      const to = 'oliverdvh@posteo.net';
      window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
      const status = document.getElementById('form-status');
      if (status) status.textContent = 'Opening your email client to send the message…';
    });
  }
});
