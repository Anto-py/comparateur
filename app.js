/* Le comparateur — logique de l'activité. Aucune dépendance externe.
   Les données vivent dans data.js ; ce fichier ne contient aucun chiffre. */

/* ============ Utilitaires ============ */

const $ = (sel) => document.querySelector(sel);
const nf = (n, dec = 0) => n.toLocaleString('fr-BE', { minimumFractionDigits: dec, maximumFractionDigits: dec });

/** Choisit l'unité lisible pour une quantité exprimée en wattheures. */
function formatWh(wh) {
  if (wh < 1000) return nf(wh, wh < 10 ? 2 : 0) + ' Wh';
  if (wh < 1e6) return nf(wh / 1e3, wh < 1e5 ? 1 : 0) + ' kWh';
  if (wh < 1e9) return nf(wh / 1e6, wh < 1e8 ? 1 : 0) + ' MWh';
  if (wh < 1e12) return nf(wh / 1e9, wh < 1e11 ? 1 : 0) + ' GWh';
  return nf(wh / 1e12, 1) + ' TWh';
}

const MENAGE_BELGE_WH = 3.5e6;   // 3 500 kWh par an
const CHARGE_TEL_WH   = 15;
const LESSIVE_WH      = 800;

/* ============ Les liens vers les sources ============ */

/** Neutralise ce qui, dans une donnée, serait lu comme du HTML. */
function echapper(texte) {
  const table = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  return String(texte).replace(/[&<>"']/g, (c) => table[c]);
}

/** Un lien de source : nouvel onglet, jamais nu, toujours signalé par sa flèche. */
function lienExterne(url, texte, titre) {
  const attrTitre = titre ? ` title="${echapper(titre)}"` : '';
  return `<a class="lien-src" href="${echapper(url)}" target="_blank" rel="noopener noreferrer"${attrTitre}>`
    + `${echapper(texte)}<span class="lien-fleche" aria-hidden="true">↗</span></a>`;
}

/** Les lignes de provenance d'une carte : la source, ce qu'on ne peut pas ouvrir, et l'approfondissement.
    Une carte sans source affiche pourquoi : le trou dans les chiffres fait partie de ce qui s'enseigne. */
function lignesSource(o) {
  let html = '';
  if (o.source) {
    html += o.lien
      ? `<p class="placee-src">Source : ${lienExterne(o.lien.url, o.source, 'Ouvrir ' + o.lien.quoi)}</p>`
      : `<p class="placee-src">Source : ${echapper(o.source)}</p>`;
  }
  if (o.sans_lien) html += `<p class="placee-sans-lien">${echapper(o.sans_lien)}</p>`;
  if (o.plus) html += `<p class="placee-plus">Pour aller plus loin : ${lienExterne(o.plus.url, o.plus.quoi)}</p>`;
  return html;
}

/* ============ Onglets ============ */

document.querySelectorAll('.tab').forEach((tab) => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach((t) => {
      t.classList.remove('is-active');
      t.setAttribute('aria-selected', 'false');
    });
    document.querySelectorAll('.panel').forEach((p) => {
      p.classList.remove('is-active');
      p.hidden = true;
    });
    tab.classList.add('is-active');
    tab.setAttribute('aria-selected', 'true');
    const panel = document.getElementById(tab.dataset.panel);
    panel.classList.add('is-active');
    panel.hidden = false;
  });
});

/* ============ Onglet 1 : la frise ============ */

const etat = { file: [], justes: 0, rates: 0, essais: 0, vientDeGlisser: false };

function melanger(tableau) {
  const t = tableau.slice();
  for (let i = t.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [t[i], t[j]] = [t[j], t[i]];
  }
  return t;
}

/** Un repère d'échelle en tête de colonne. Ceux qui viennent d'une source réelle
    la portent ; les autres sont des ordres de grandeur d'usage, et n'en inventent pas. */
function repere(r) {
  return r.lien
    ? `<li>${echapper(r.texte)} ${lienExterne(r.lien.url, 'source', 'Ouvrir ' + r.lien.quoi)}</li>`
    : `<li>${echapper(r.texte)}</li>`;
}

function construireFrise() {
  const frise = $('#frise');
  frise.innerHTML = '';
  PALIERS.forEach((p, i) => {
    const col = document.createElement('div');
    col.className = 'colonne';
    col.dataset.palier = p.id;
    col.innerHTML = `
      <div class="col-tete">
        <div class="col-symbole">${p.symbole}</div>
        <div class="col-intitule">${p.intitule}</div>
        <ul class="col-reperes">${p.reperes.map(repere).join('')}</ul>
      </div>
      ${i > 0 ? '<div class="col-facteur">× 1 000</div>' : ''}
      <div class="col-contenu"></div>`;
    // Un glisser-déposer est suivi d'un clic synthétique : sans ce garde-fou,
    // le même geste compterait deux dépôts.
    col.addEventListener('click', (ev) => {
      if (etat.vientDeGlisser) return;
      // Les cartes déjà rangées vivent dans la colonne : consulter leur source
      // est une lecture, pas un dépôt.
      if (ev.target.closest('a')) return;
      deposer(p.id);
    });
    frise.appendChild(col);
  });
}

function carteCourante() {
  return etat.file[0] || null;
}

function majScore() {
  $('#score-restantes').textContent = etat.file.length;
  $('#score-justes').textContent = etat.justes;
  $('#score-rates').textContent = etat.rates;
  const nb = document.querySelector('.paquet-nb');
  if (nb) nb.textContent = Math.max(0, etat.file.length - 1);
}

function afficherPioche() {
  const pioche = $('#pioche');
  // Un redessin annule tout geste en cours : la carte glissée n'existe plus.
  nettoyerGlisser();
  pioche.innerHTML = '';
  const carte = carteCourante();

  if (!carte) {
    majScore();
    pioche.innerHTML = '<p class="carte-restantes">Toutes les cartes sont placées.</p>';
    revelation();
    return;
  }

  const paquet = document.createElement('div');
  paquet.className = 'paquet';
  paquet.innerHTML = '<span class="paquet-nb">0</span><span class="paquet-lab">en réserve</span>';
  pioche.appendChild(paquet);

  // Le chiffre est nu : sans son unité, il ne trahit pas l'échelle.
  // C'est ce que la carte décrit qui doit guider l'élève, pas le nombre.
  const el = document.createElement('article');
  el.className = 'carte is-held';
  el.innerHTML = `
    <h3 class="carte-titre">${carte.titre}</h3>
    <p class="carte-valeur">${carte.nombre}<span class="carte-unite">?</span></p>
    <span class="statut ${LABELS_STATUT[carte.statut].classe}">${LABELS_STATUT[carte.statut].texte}</span>`;
  activerGlisser(el);
  pioche.appendChild(el);
  majScore();
}

function deposer(palierChoisi) {
  const carte = carteCourante();
  if (!carte) return;

  const iChoisi = PALIERS.findIndex((p) => p.id === palierChoisi);
  const iJuste = PALIERS.findIndex((p) => p.id === carte.palier);

  // Mauvaise colonne : la carte est refusée et retourne sur le paquet, avec le
  // seul indice du sens. On ne dit pas de combien : ce serait donner la réponse.
  if (iChoisi !== iJuste) {
    etat.rates++;
    etat.essais++;
    refuser(palierChoisi, iJuste > iChoisi);
    majScore();
    return;
  }

  if (etat.essais === 0) etat.justes++;
  etat.essais = 0;
  etat.file.shift();

  placerDansColonne(carte);
  afficherFeedback(carte);
  afficherPioche();
}

function refuser(palierChoisi, versLeHaut) {
  const col = document.querySelector(`.colonne[data-palier="${palierChoisi}"]`);
  if (col) {
    col.classList.remove('is-refus');
    void col.offsetWidth;              // force le redémarrage de l'animation
    col.classList.add('is-refus');
  }

  // La carte s'en retourne sur le paquet, puis en ressort : l'élève voit
  // qu'elle lui est rendue plutôt que de la retrouver posée quelque part.
  // L'animation n'est que du décor : elle ne verrouille jamais l'essai suivant.
  // Un élève qui réessaie aussitôt doit être entendu, pas ignoré.
  const carteEl = document.querySelector('#pioche .carte');
  const sobre = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (carteEl && !sobre) {
    carteEl.classList.remove('is-retour');
    void carteEl.offsetWidth;          // force le redémarrage de l'animation
    carteEl.classList.add('is-retour');
    carteEl.addEventListener('animationend', () => carteEl.classList.remove('is-retour'), { once: true });
  }

  const fb = $('#feedback');
  fb.className = 'feedback rate';
  fb.innerHTML = versLeHaut
    ? "<strong>Refusé, c'est plus.</strong> La carte retourne sur le paquet. Vise une échelle plus grande."
    : "<strong>Refusé, c'est moins.</strong> La carte retourne sur le paquet. Vise une échelle plus petite.";
}

function placerDansColonne(carte) {
  const contenu = document.querySelector(`.colonne[data-palier="${carte.palier}"] .col-contenu`);
  const el = document.createElement('div');
  el.className = 'placee';
  el.dataset.wh = carte.wh;
  el.innerHTML = `
    <div class="placee-titre">${carte.titre}</div>
    <div class="placee-valeur">${carte.valeur}</div>
    <p class="placee-trad">${carte.traduction}</p>
    <p class="placee-reserve">${carte.reserve}</p>
    ${lignesSource(carte)}`;

  // On insère au bon rang pour que la colonne reste ordonnée du plus petit au plus grand.
  const voisins = Array.from(contenu.children);
  const suivant = voisins.find((v) => Number(v.dataset.wh) > carte.wh);
  contenu.insertBefore(el, suivant || null);
}

function afficherFeedback(carte) {
  const symbole = PALIERS.find((p) => p.id === carte.palier).symbole;
  const fb = $('#feedback');
  fb.className = 'feedback ok';
  fb.innerHTML = `<strong>Bien vu, c'était des ${symbole}.</strong> ${carte.traduction}`;
}

function revelation() {
  const box = $('#revelation');
  if (!box.hidden) return;
  box.hidden = false;
  $('#rev-titre').textContent = CARTE_FINALE.titre;
  $('#rev-basse').textContent = CARTE_FINALE.basse;
  $('#rev-haute').textContent = CARTE_FINALE.haute;
  $('#rev-texte').textContent = CARTE_FINALE.texte;
  $('#rev-sources').innerHTML = lignesSource(CARTE_FINALE);
  box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/* Glisser-déposer au pointeur : marche à la souris comme au doigt.
   Un déplacement de moins de 8 px est traité comme un simple clic.

   L'état du geste vit ici, en un seul endroit, et non dans une closure par carte :
   un geste peut mourir sans jamais rendre la main à la carte qui l'a démarré
   (capture du pointeur perdue, geste système, fenêtre quittée). Le clone qui suit
   le doigt resterait alors figé en position fixed au milieu de la page. D'où la
   règle : la fin d'un geste se nettoie par le DOM, jamais par la seule référence. */
let glisse = null;

function activerGlisser(el) {
  el.addEventListener('pointerdown', (ev) => {
    if (ev.pointerType === 'mouse' && ev.button !== 0) return;   // bouton principal seulement
    nettoyerGlisser();
    el.classList.remove('is-retour');    // un nouveau geste prime sur l'animation en cours
    glisse = { el, id: ev.pointerId, x: ev.clientX, y: ev.clientY, fantome: null };
    // La capture garde les mouvements sur la carte quand le pointeur la quitte.
    // Elle peut être refusée ou reprise par le navigateur : les filets ci-dessous en tiennent lieu.
    try { el.setPointerCapture(ev.pointerId); } catch (_) { /* on suivra sans capture */ }
    ev.preventDefault();                 // pas de glisser natif ni de sélection parasite
  });
}

/** Termine proprement un geste, qu'il ait abouti ou non. */
function nettoyerGlisser() {
  document.querySelectorAll('.carte.is-dragging').forEach((c) => c.remove());
  document.querySelectorAll('.colonne.is-target').forEach((c) => c.classList.remove('is-target'));
  document.querySelectorAll('#pioche .carte').forEach((c) => { c.style.opacity = ''; });
  if (glisse && glisse.el.hasPointerCapture && glisse.el.hasPointerCapture(glisse.id)) {
    glisse.el.releasePointerCapture(glisse.id);
  }
  glisse = null;
}

window.addEventListener('pointermove', (ev) => {
  if (!glisse || ev.pointerId !== glisse.id) return;

  if (!glisse.fantome) {
    if (Math.hypot(ev.clientX - glisse.x, ev.clientY - glisse.y) < 8) return;
    const r = glisse.el.getBoundingClientRect();
    const f = glisse.el.cloneNode(true);
    f.classList.add('is-dragging');
    f.style.width = r.width + 'px';
    document.body.appendChild(f);
    glisse.el.style.opacity = '0.35';
    glisse.fantome = f;
  }
  glisse.fantome.style.left = (ev.clientX - 60) + 'px';
  glisse.fantome.style.top = (ev.clientY - 30) + 'px';

  document.querySelectorAll('.colonne').forEach((c) => c.classList.remove('is-target'));
  const cible = colonneSous(ev.clientX, ev.clientY);
  if (cible) cible.classList.add('is-target');
});

window.addEventListener('pointerup', (ev) => {
  if (!glisse || ev.pointerId !== glisse.id) return;
  const glisseEffectif = Boolean(glisse.fantome);
  nettoyerGlisser();                     // le fantôme part avant qu'on regarde ce qu'il y a dessous
  if (!glisseEffectif) return;           // simple clic : c'est la colonne qui s'en charge

  etat.vientDeGlisser = true;
  setTimeout(() => { etat.vientDeGlisser = false; }, 0);
  const cible = colonneSous(ev.clientX, ev.clientY);
  if (cible) deposer(cible.dataset.palier);
});

window.addEventListener('pointercancel', (ev) => {
  if (glisse && ev.pointerId === glisse.id) nettoyerGlisser();
});

// Derniers filets : un geste peut mourir sans pointerup du tout.
window.addEventListener('blur', nettoyerGlisser);
document.addEventListener('visibilitychange', () => { if (document.hidden) nettoyerGlisser(); });

function colonneSous(x, y) {
  const sous = document.elementFromPoint(x, y);
  return sous ? sous.closest('.colonne') : null;
}

function reset() {
  etat.file = melanger(CARTES);
  etat.justes = 0;
  etat.rates = 0;
  etat.essais = 0;
  $('#feedback').className = 'feedback';
  $('#feedback').innerHTML = '';
  $('#revelation').hidden = true;
  construireFrise();
  afficherPioche();
}

$('#btn-reset').addEventListener('click', reset);

/* ============ Onglet 2 : estime ta semaine ============ */

const SEMAINES_ANNEE = 40;
let groupeActif = 600;

function construireCurseurs() {
  const box = $('#curseurs');
  box.innerHTML = '';
  USAGES.forEach((u) => {
    const bloc = document.createElement('div');
    bloc.className = 'curseur-bloc';
    bloc.innerHTML = `
      <div class="curseur-tete">
        <div>
          <div class="curseur-label">${u.label}</div>
          <div class="curseur-unite">${u.unite}</div>
        </div>
        <div class="curseur-nb" id="nb-${u.id}">${u.defaut}</div>
      </div>
      <input type="range" id="sl-${u.id}" min="0" max="${u.max}" value="${u.defaut}">`;
    box.appendChild(bloc);
    bloc.querySelector('input').addEventListener('input', (ev) => {
      document.getElementById('nb-' + u.id).textContent = ev.target.value;
      calculer();
    });
  });
}

function construireGroupes() {
  const box = $('#groupes');
  box.innerHTML = '';
  GROUPES.forEach((g) => {
    const btn = document.createElement('button');
    btn.className = 'groupe-btn' + (g.n === groupeActif ? ' is-active' : '');
    btn.innerHTML = `${g.label}<span class="groupe-nb">${g.court}</span>`;
    btn.title = g.source ? `${g.detail} : ${g.source}` : '';
    btn.dataset.n = g.n;
    btn.dataset.label = g.detail ? `${g.label}, ${g.detail}` : g.label;
    btn.addEventListener('click', () => {
      groupeActif = g.n;
      $('#perso').value = g.n;
      construireGroupes();
      calculer();
    });
    box.appendChild(btn);
  });
}

$('#perso').addEventListener('input', (ev) => {
  const n = Math.max(1, Number(ev.target.value) || 1);
  groupeActif = n;
  document.querySelectorAll('.groupe-btn').forEach((b) => {
    b.classList.toggle('is-active', Number(b.dataset.n) === n);
  });
  calculer();
});

function calculer() {
  let basse = 0;
  let haute = 0;
  const parts = [];
  USAGES.forEach((u) => {
    const n = Number(document.getElementById('sl-' + u.id).value);
    basse += n * u.basse;
    haute += n * u.haute;
    parts.push({ label: u.label, poids: n * u.haute });
  });

  afficherDominant(parts, haute);

  const anBasse = basse * SEMAINES_ANNEE;
  const anHaute = haute * SEMAINES_ANNEE;

  $('#res-semaine').textContent = intervalle(basse, haute);
  $('#res-annee').textContent = intervalle(anBasse, anHaute);
  $('#trad-tel').textContent = intervalleNb(anBasse / CHARGE_TEL_WH, anHaute / CHARGE_TEL_WH);
  $('#trad-lessive').textContent = intervalleNb(anBasse / LESSIVE_WH, anHaute / LESSIVE_WH);

  const gBasse = anBasse * groupeActif;
  const gHaute = anHaute * groupeActif;
  const label = document.querySelector('.groupe-btn.is-active');
  $('#res-groupe-lab').textContent = (label ? label.dataset.label : `${nf(groupeActif)} personnes`) + ', sur une année';
  $('#res-groupe').textContent = intervalle(gBasse, gHaute);

  $('#res-compar').textContent = comparer(gBasse, gHaute);
}

/** Ramène un total à une échelle que l'élève a déjà rencontrée en onglet 1 :
    le ménage belge tant que c'est petit, la Belgique entière quand ça devient grand. */
function comparer(basse, haute) {
  if (haute / MENAGE_BELGE_WH < 1) {
    return "Soit moins que la consommation annuelle d'un seul ménage belge. "
      + "À votre échelle, l'usage reste petit : ce sont les 900 milliards de prompts par an du monde entier qui font la différence.";
  }
  if (haute >= 0.01 * BELGIQUE_AN_WH) {
    const rb = basse / BELGIQUE_AN_WH;
    const rh = haute / BELGIQUE_AN_WH;
    const pct = (r) => nf(r * 100, r < 0.1 ? 1 : 0) + ' %';
    const fois = (r) => nf(r, r < 10 ? 1 : 0);
    const belge = "toute l'électricité consommée en Belgique en un an";
    let phrase;
    if (rh < 1) phrase = `Soit ${pct(rb)} à ${pct(rh)} de ${belge}.`;
    else if (rb >= 1) phrase = `Soit ${fois(rb)} à ${fois(rh)} fois ${belge}.`;
    else phrase = `Soit entre ${pct(rb)} et ${fois(rh)} fois ${belge}.`;
    return phrase + " Le geste de chacun n'a pas changé : seul le nombre de personnes a changé.";
  }
  return `Soit l'électricité annuelle de ${intervalleNb(basse / MENAGE_BELGE_WH, haute / MENAGE_BELGE_WH)} ménages belges. `
    + "L'écart entre les deux bornes ne se referme pas : c'est le désaccord entre les entreprises et les chercheurs, reporté sur ton usage à toi.";
}

/** Le poste le plus lourd du total : c'est la hiérarchie qui s'apprend, pas le total. */
function afficherDominant(parts, total) {
  const el = $('#res-dominant');
  if (total <= 0) {
    el.textContent = 'Mets au moins un usage pour voir ce qui pèse le plus.';
    return;
  }
  const top = parts.reduce((a, b) => (b.poids > a.poids ? b : a));
  const pct = Math.round((top.poids / total) * 100);
  el.innerHTML = `Ce qui pèse le plus lourd chez toi : <strong>${top.label}</strong>, ${pct} % de ton total.`;
}

function intervalle(a, b) {
  return a === b ? formatWh(a) : `${formatWh(a)} à ${formatWh(b)}`;
}

function intervalleNb(a, b) {
  const arrondi = (x) => (x < 10 ? nf(x, 1) : nf(Math.round(x)));
  return a === b ? arrondi(a) : `${arrondi(a)} à ${arrondi(b)}`;
}

/* ============ Pied de page : les sources ============ */

function listerSources() {
  const ul = $('#liste-sources');
  const vues = new Set();
  CARTES.forEach((c) => {
    if (vues.has(c.source)) return;
    vues.add(c.source);
    const li = document.createElement('li');
    // Sans lien, on le dit : une ligne muette passerait pour un oubli du site.
    const provenance = c.lien
      ? lienExterne(c.lien.url, c.source, 'Ouvrir ' + c.lien.quoi)
      : `${echapper(c.source)} <em class="src-muette">(rien à ouvrir)</em>`;
    const suite = c.plus ? ` · ${lienExterne(c.plus.url, 'pour aller plus loin', 'Ouvrir ' + c.plus.quoi)}` : '';
    li.innerHTML = `<strong>${echapper(c.titre)}</strong> — ${provenance}${suite}`;
    ul.appendChild(li);
  });
}

/* ============ Démarrage ============ */

reset();
construireCurseurs();
construireGroupes();
calculer();
listerSources();
