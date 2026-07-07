/* =========================================================================
   ClassTrack — Parent Portal V3 (Desktop)
   Shared helpers: i18n, toast, prototype switcher
   ========================================================================= */
(function(){
  'use strict';

  // ── i18n ────────────────────────────────────────────────────────────────
  function getLang() {
    var p = new URLSearchParams(window.location.search);
    return p.get('lang') === 'fr' ? 'fr' : 'en';
  }
  function setLang(lang) {
    var url = new URL(window.location.href);
    if (lang === 'fr') url.searchParams.set('lang', 'fr');
    else url.searchParams.delete('lang');
    window.location.href = url.toString();
  }
  function setLangUrl(href, lang) {
    if (!href || href.startsWith('http') || href.startsWith('#') || href.startsWith('javascript:')) return href;
    var hashIdx = href.indexOf('#');
    var hash = hashIdx >= 0 ? href.substring(hashIdx) : '';
    var base = href.split('?')[0].split('#')[0];
    if (!base.endsWith('.html')) return href;
    return base + (lang === 'fr' ? '?lang=fr' : '') + hash;
  }
  function applyLang() {
    var lang = getLang();
    document.documentElement.lang = lang;
    // text
    document.querySelectorAll('[data-en]').forEach(function(el){
      var v = el.getAttribute('data-' + lang) || el.getAttribute('data-en');
      if (el.hasAttribute('data-html')) el.innerHTML = v;
      else el.textContent = v;
    });
    // placeholders
    document.querySelectorAll('[data-placeholder-en]').forEach(function(el){
      var v = el.getAttribute('data-placeholder-' + lang) || el.getAttribute('data-placeholder-en');
      el.setAttribute('placeholder', v);
    });
    // aria-label
    document.querySelectorAll('[data-aria-en]').forEach(function(el){
      var v = el.getAttribute('data-aria-' + lang) || el.getAttribute('data-aria-en');
      el.setAttribute('aria-label', v);
    });
    // links — preserve lang query
    document.querySelectorAll('a[href]').forEach(function(a){
      var orig = a.getAttribute('data-orig-href') || a.getAttribute('href');
      a.setAttribute('data-orig-href', orig);
      a.setAttribute('href', setLangUrl(orig, lang));
    });
    // lang toggle buttons
    document.querySelectorAll('[data-lang-btn]').forEach(function(b){
      b.setAttribute('aria-pressed', String(b.getAttribute('data-lang-btn') === lang));
    });
    if (typeof window.__ct_page_rerender === 'function') window.__ct_page_rerender();
  }
  window.__ct_i18n = { getLang: getLang, setLang: setLang, applyLang: applyLang };

  // ── Toast ───────────────────────────────────────────────────────────────
  var toastTimer;
  function showToast(msg, kind) {
    var t = document.getElementById('toast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'toast';
      t.className = 'toast';
      document.body.appendChild(t);
    }
    t.className = 'toast' + (kind ? ' toast--' + kind : '');
    t.textContent = msg;
    requestAnimationFrame(function(){ t.classList.add('show'); });
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function(){ t.classList.remove('show'); }, 2800);
  }
  window.showToast = showToast;

  // ── Sidebar mounter ─────────────────────────────────────────────────────
  function mountSidebar(currentPage) {
    var el = document.getElementById('sidebar');
    if (!el) return;
    var isActive = function(name){ return currentPage === name ? ' is-active' : ''; };
    el.className = 'sidebar';
    el.setAttribute('aria-label', 'Primary navigation');
    el.innerHTML = ''
      // ── Brand + notification bell on same row ──────────────────────────
      + '<div class="sidebar__top">'
      +   '<a href="dashboard.html" class="sidebar__brand" style="padding:0;">'
      +     '<div class="sidebar__brand-mark">C</div>'
      +     '<span>ClassTrack</span>'
      +   '</a>'
      +   '<button id="notif-bell-btn" class="sidebar__bell sidebar__bell--active" aria-label="Alerts — 3 unread" aria-expanded="false" aria-haspopup="true">'
      +     '<i class="fa-solid fa-bell"></i>'
      +     '<span class="bell-badge">3</span>'
      +   '</button>'
      + '</div>'
      // ── Main nav ───────────────────────────────────────────────────────
      + '<nav class="sidebar__nav" aria-label="Main">'
      +   '<a href="dashboard.html" class="sidebar__item' + isActive('dashboard') + '">'
      +     '<i class="fa-solid fa-house"></i>'
      +     '<span data-en="Home" data-fr="Accueil">Home</span>'
      +   '</a>'
      +   '<a href="active-records.html" class="sidebar__item' + isActive('active-records') + '">'
      +     '<i class="fa-solid fa-circle-dot"></i>'
      +     '<span data-en="Active Records" data-fr="Dossiers actifs">Active Records</span>'
      +     (currentPage === 'active-records' ? '' : '<span class="badge-dot" style="background:var(--c-danger)">2</span>')
      +   '</a>'
      +   '<a href="attendance-history.html" class="sidebar__item' + isActive('attendance-history') + '">'
      +     '<i class="fa-solid fa-calendar-days"></i>'
      +     '<span data-en="Attendance History" data-fr="Historique de présence">Attendance History</span>'
      +   '</a>'
      +   '<a href="future-absences.html" class="sidebar__item' + (currentPage === 'future' || currentPage === 'declare' ? ' is-active' : '') + '">'
      +     '<i class="fa-solid fa-calendar-plus"></i>'
      +     '<span data-en="Future Absences" data-fr="Absences futures">Future Absences</span>'
      +   '</a>'
      + '</nav>'
      // ── Bottom: lang + user ────────────────────────────────────────────
      + '<div class="sidebar__bottom">'
      +   '<div class="sidebar__lang">'
      +     '<div class="lang-toggle">'
      +       '<button data-lang-btn="en" aria-pressed="true" onclick="window.__ct_i18n.setLang(\'en\')">EN</button>'
      +       '<button data-lang-btn="fr" aria-pressed="false" onclick="window.__ct_i18n.setLang(\'fr\')">FR</button>'
      +     '</div>'
      +   '</div>'
      +   '<a href="settings.html" class="sidebar__user' + isActive('settings') + '">'
      +     '<div class="avatar avatar--sm">MC</div>'
      +     '<div class="sidebar__user-meta">'
      +       '<div class="sidebar__user-name">Marcus</div>'
      +       '<div class="sidebar__user-role" data-en="Parent" data-fr="Parent">Parent</div>'
      +     '</div>'
      +   '</a>'
      + '</div>';
    // Reapply i18n for newly-injected content
    applyLang();

    // ── Wire notification bell ─────────────────────────────────────────
    var bellBtn  = el.querySelector('#notif-bell-btn');
    var notifPanel = document.getElementById('notif-panel');
    if (bellBtn) {
      if (notifPanel) {
        // Panel present on this page — open it on click
        var notifBkd = document.getElementById('notif-backdrop');
        var notifCls = document.getElementById('notif-close-btn');
        function _openNotif() {
          var r = bellBtn.getBoundingClientRect();
          notifPanel.style.top  = (r.bottom + 8) + 'px';
          notifPanel.style.left = (r.right  + 8) + 'px';
          notifPanel.hidden = false;
          if (notifBkd) notifBkd.hidden = false;
          bellBtn.setAttribute('aria-expanded', 'true');
        }
        function _closeNotif() {
          notifPanel.hidden = true;
          if (notifBkd) notifBkd.hidden = true;
          bellBtn.setAttribute('aria-expanded', 'false');
        }
        bellBtn.addEventListener('click', function(e) {
          e.stopPropagation();
          notifPanel.hidden ? _openNotif() : _closeNotif();
        });
        if (notifCls) notifCls.addEventListener('click', _closeNotif);
        if (notifBkd) notifBkd.addEventListener('click', _closeNotif);
        document.addEventListener('keydown', function(e) {
          if (e.key === 'Escape' && !notifPanel.hidden) _closeNotif();
        });
        notifPanel.querySelectorAll('.notif-tab').forEach(function(tab) {
          tab.addEventListener('click', function() {
            notifPanel.querySelectorAll('.notif-tab').forEach(function(t) {
              t.classList.remove('is-active');
              t.setAttribute('aria-selected', 'false');
            });
            notifPanel.querySelectorAll('.notif-tab-pane').forEach(function(p) {
              p.classList.remove('is-active');
            });
            tab.classList.add('is-active');
            tab.setAttribute('aria-selected', 'true');
            var pane = notifPanel.querySelector('[data-pane="' + tab.dataset.tab + '"]');
            if (pane) pane.classList.add('is-active');
          });
        });
      } else {
        // No panel — fall back to navigating to the notifications page
        bellBtn.addEventListener('click', function() {
          window.location.href = setLangUrl('notifications.html', getLang());
        });
      }
    }
  }
  window.__ct_mountSidebar = mountSidebar;

  // ── Prototype switcher injection ───────────────────────────────────────
  function mountProtoSwitcher(currentPage) {
    var lang = getLang();
    var ps = document.createElement('div');
    ps.className = 'proto-switcher';
    ps.innerHTML = ''
      + '<span class="proto-switcher__label">Prototype</span>'
      + '<a href="../index.html" data-en="Index" data-fr="Index">Index</a>'
      + '<a href="../admin-dashboard.html" data-en="Clerk" data-fr="Surveillant">Clerk</a>'
      + '<a href="../teacher-dashboard.html" data-en="Teacher" data-fr="Enseignant">Teacher</a>'
      + '<a href="dashboard.html" class="' + (currentPage === 'parent' || !currentPage ? 'is-active' : '') + '" data-en="Parent" data-fr="Parent">Parent</a>'
      + '<span class="proto-switcher__divider">|</span>'
      + '<a href="#" data-lang-btn="en" class="' + (lang === 'en' ? 'is-active' : '') + '">EN</a>'
      + '<a href="#" data-lang-btn="fr" class="' + (lang === 'fr' ? 'is-active' : '') + '">FR</a>';
    document.body.appendChild(ps);
    ps.querySelectorAll('[data-lang-btn]').forEach(function(b){
      b.addEventListener('click', function(e){
        e.preventDefault();
        setLang(b.getAttribute('data-lang-btn'));
      });
    });
  }
  window.__ct_mountProtoSwitcher = mountProtoSwitcher;

  // ── Sidebar toggle for mobile ───────────────────────────────────────────
  function toggleSidebar() {
    var sb = document.querySelector('.sidebar');
    if (sb) sb.classList.toggle('is-open');
  }
  window.__ct_toggleSidebar = toggleSidebar;

  // ── Dispute modal (shared) ──────────────────────────────────────────────
  // Usage: openDispute({ child: 'Aaliyah Carter', date: 'May 4, 2026', period: 'All day', status: 'Excused' })
  function openDispute(rec) {
    rec = rec || {};
    var lang = getLang();
    var T = function(en, fr){ return lang === 'fr' ? fr : en; };
    var backdrop = document.getElementById('disputeModal');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.id = 'disputeModal';
      backdrop.className = 'modal-backdrop';
      document.body.appendChild(backdrop);
    }
    backdrop.innerHTML = ''
      + '<div class="modal" role="dialog" aria-labelledby="dispute-h">'
      +   '<div class="modal__h">'
      +     '<div>'
      +       '<div class="modal__title" id="dispute-h">' + T('Dispute this record', 'Contester ce dossier') + '</div>'
      +       '<div class="modal__sub">' + T('Tell us what was wrong. The Attendance Clerk will review.', "Dites-nous ce qui n'allait pas. Le Surveillant examinera.") + '</div>'
      +     '</div>'
      +     '<button class="modal__close" onclick="closeDispute()" aria-label="Close"><i class="fa-solid fa-xmark"></i></button>'
      +   '</div>'
      +   '<div class="modal__b">'
      +     '<div class="card" style="background:var(--c-surface-2);border-color:var(--c-border-2);margin-bottom:var(--s-4)"><div class="card__b" style="padding:var(--s-3) var(--s-4)">'
      +       '<div style="display:grid;grid-template-columns:auto 1fr;gap:6px 12px;font-size:var(--fs-sm)">'
      +         '<span class="text-muted">' + T('Child','Enfant') + '</span><strong>' + (rec.child || 'Aaliyah Carter') + '</strong>'
      +         '<span class="text-muted">' + T('Date','Date') + '</span><span>' + (rec.date || 'May 4, 2026') + '</span>'
      +         '<span class="text-muted">' + T('Period','Période') + '</span><span>' + (rec.period || 'All day') + '</span>'
      +         '<span class="text-muted">' + T('Current status','Statut actuel') + '</span><span>' + (rec.statusHtml || '<span class="status status--absent">Absent</span>') + '</span>'
      +       '</div>'
      +     '</div></div>'

      +     '<div class="stack">'
      +       '<div class="field">'
      +         '<label class="field__label">' + T('What was wrong?','Quel était le problème ?') + '<span class="req">*</span></label>'
      +         '<select class="select" id="disputeReason">'
      +           '<option value="">' + T('Choose one…','Choisir…') + '</option>'
      +           '<option>' + T('My child was actually present','Mon enfant était présent') + '</option>'
      +           '<option>' + T('My child was here but in another room','Mon enfant était présent, mais dans une autre salle') + '</option>'
      +           '<option>' + T('The lateness duration is wrong','La durée du retard est incorrecte') + '</option>'
      +           '<option>' + T('Wrong period or class','Mauvaise période ou cours') + '</option>'
      +           '<option>' + T('Other','Autre') + '</option>'
      +         '</select>'
      +       '</div>'
      +       '<div class="field">'
      +         '<label class="field__label">' + T('Tell us a bit more','Quelques détails') + '<span class="req">*</span></label>'
      +         '<textarea class="textarea" rows="3" id="disputeText" placeholder="' + T('e.g. Aaliyah was actually in the library finishing a presentation.','p. ex. Aaliyah était à la bibliothèque pour terminer sa présentation.') + '"></textarea>'
      +       '</div>'
      +       '<div class="field">'
      +         '<label class="field__label">' + T('Anything to attach? (optional)','Pièce jointe ? (facultatif)') + '</label>'
      +         '<button class="attach-btn" type="button"><i class="fa-solid fa-paperclip"></i> ' + T('Add a photo or document','Joindre une photo ou un document') + '</button>'
      +       '</div>'
      +     '</div>'
      +   '</div>'
      +   '<div class="modal__footer">'
      +     '<button class="btn btn--ghost" onclick="closeDispute()">' + T('Cancel','Annuler') + '</button>'
      +     '<button class="btn btn--primary" onclick="submitDispute()"><i class="fa-solid fa-paper-plane"></i> ' + T('Send dispute','Envoyer le contestation') + '</button>'
      +   '</div>'
      + '</div>';
    backdrop.classList.add('is-open');
    backdrop.addEventListener('click', function(e){ if (e.target === backdrop) closeDispute(); });
  }
  function closeDispute() {
    var b = document.getElementById('disputeModal');
    if (b) b.classList.remove('is-open');
  }
  function submitDispute() {
    closeDispute();
    showToast(getLang() === 'fr' ? 'Contestation envoyée — le Surveillant l\'examinera bientôt' : 'Dispute sent — the Attendance Clerk will review it soon', 'success');
  }
  window.openDispute = openDispute;
  window.closeDispute = closeDispute;
  window.submitDispute = submitDispute;

  // ── Init ────────────────────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', function(){
    applyLang();
  });
})();
