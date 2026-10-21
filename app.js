'use strict';
const config = window.STUDIO_CONFIG || {};
const $ = (selector) => document.querySelector(selector);
function safeUrl(value, hostCheck) {
  try { const u = new URL(value); return u.protocol === 'https:' && !u.username && !u.password && hostCheck(u.hostname) ? u : null; } catch { return null; }
}
function openExternal(url) { window.open(url.toString(), '_blank', 'noopener,noreferrer'); }
$('.menu-toggle').addEventListener('click', () => {
  const open = $('nav').classList.toggle('open');
  $('.menu-toggle').setAttribute('aria-expanded', String(open));
  $('.menu-toggle').setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
});
document.querySelectorAll('nav a').forEach(a => a.addEventListener('click', () => { $('nav').classList.remove('open'); $('.menu-toggle').setAttribute('aria-expanded', 'false'); }));
const engineerNotes = {
  'creative-room': 'Avec notre ingénieur du son ou avec le vôtre.',
  'dubbing': 'Accompagnement adapté aux productions professionnelles comme aux sessions de formation.',
  'live-rec': 'Disponible exclusivement avec notre ingénieur du son interne.'
};
$('#session').addEventListener('change', event => { $('#engineer-note').textContent = engineerNotes[event.target.value]; });
$('#year').textContent = new Date().getFullYear();
if (config.name) {
  document.title = `${config.name} — Faites place à votre son.`;
  document.querySelectorAll('.brand').forEach(el => { el.firstChild.textContent = config.name.replace(/^Studio\s+/i, '').toLowerCase(); });
  $('footer>span:last-child').replaceChildren(document.createTextNode(`© ${new Date().getFullYear()} ${config.name}`));
}
$('#booking-form').addEventListener('submit', e => {
  e.preventDefault();
  const url = safeUrl(config.bookingUrl, h => ['calendar.google.com', 'calendar.app.google'].includes(h));
  if (!url) { $('#booking-status').textContent = 'Le calendrier du studio n’est pas encore connecté. La réservation sera disponible après configuration.'; return; }
  $('#booking-status').textContent = 'Choisissez votre créneau sur la page Google Agenda qui vient de s’ouvrir.';
  openExternal(url);
});
$('#paypal').addEventListener('click', () => {
  const url = safeUrl(config.paypalUrl, h => ['paypal.me','www.paypal.me','www.paypal.com','paypal.com'].includes(h));
  if (!url) { $('#booking-status').textContent = 'Le compte PayPal du studio n’est pas encore connecté. Aucun paiement ne sera demandé.'; return; }
  $('#booking-status').textContent = 'Vérifiez le bénéficiaire et le montant convenu sur PayPal avant de payer.';
  openExternal(url);
});
if (config.address?.trim()) {
  $('#studio-address').textContent = config.address;
  const mapUrl = new URL('https://maps.google.com/maps');
  mapUrl.search = new URLSearchParams({q:config.address,output:'embed'}).toString();
  $('#map').src = mapUrl.toString(); $('#map').hidden = false; $('#map-placeholder').hidden = true;
}
$('#locate').addEventListener('click', async () => {
  if (!config.address?.trim()) { $('#map-status').textContent = 'L’adresse du studio doit être renseignée avant de calculer un itinéraire.'; return; }
  const url = new URL('https://www.google.com/maps/dir/');
  url.search = new URLSearchParams({api:'1',destination:config.address}).toString();
  // Open during the user gesture to avoid popup blockers after the asynchronous lookup.
  const tab = window.open('about:blank','_blank');
  if (tab) tab.opener = null;
  $('#locate').disabled = true; $('#map-status').textContent = 'Recherche de votre ville de départ…';
  try {
    const response = await fetch('https://ipapi.co/json/', {signal:AbortSignal.timeout(6000),credentials:'omit',referrerPolicy:'no-referrer'});
    if (!response.ok) throw new Error('IP lookup unavailable');
    const data = await response.json();
    if (!Number.isFinite(data.latitude) || !Number.isFinite(data.longitude) || Math.abs(data.latitude)>90 || Math.abs(data.longitude)>180) throw new Error('No location');
    url.searchParams.set('origin', `${data.latitude},${data.longitude}`);
    $('#map-status').textContent = `Départ estimé${data.city ? ` : ${data.city}` : ''}. Vous pouvez le corriger dans Google Maps.`;
  } catch { $('#map-status').textContent = 'Localisation indisponible. Indiquez votre départ dans Google Maps.'; }
  finally { $('#locate').disabled = false; }
  if (tab) tab.location.replace(url.toString());
  else { const a = document.createElement('a'); a.href = url; a.target='_blank'; a.rel='noopener noreferrer'; a.textContent='Ouvrir mon itinéraire dans Google Maps ↗'; $('#map-status').append(document.createElement('br'),a); }
});
$('#legal-toggle').addEventListener('click', () => { $('#legal').hidden = !$('#legal').hidden; $('#legal-toggle').setAttribute('aria-expanded', String(!$('#legal').hidden)); });
