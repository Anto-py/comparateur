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

const etat = { file: [], justes: 0, rates: 0, essais: 0, anime: false, vientDeGlisser: false };

function melanger(tableau) {
  const t = tableau.slice();
  for (let i = t.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [t[i], t[j]] = [t[j], t[i]];
  }
  return t;
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
        <ul class="col-reperes">${p.reperes.map((r) => `<li>${r}</li>`).join('')}</ul>
      </div>
      ${i > 0 ? '<div class="col-facteur">× 1 000</div>' : ''}
      <div class="col-contenu"></div>`;
    // Un glisser-déposer est suivi d'un clic synthétique : sans ce garde-fou,
    // le même geste compterait deux dépôts.
    col.addEventListener('click', () => {
      if (etat.vientDeGlisser) return;
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
  // Filet : aucun clone de glissé ne doit survivre à un redessin.
  document.querySelectorAll('.carte.is-dragging').forEach((c) => c.remove());
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
  if (!carte || etat.anime) return;

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
  const carteEl = document.querySelector('#pioche .carte');
  const sobre = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (carteEl && !sobre) {
    etat.anime = true;
    carteEl.classList.add('is-retour');
    const fin = () => {
      carteEl.classList.remove('is-retour');
      etat.anime = false;
      carteEl.removeEventListener('animationend', fin);
    };
    carteEl.addEventListener('animationend', fin);
    setTimeout(fin, 900);              // filet si l'animation est désactivée
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
    <p class="placee-src">Source : ${carte.source}</p>
    <p class="placee-reserve">${carte.reserve}</p>`;

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
  box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/* Glisser-déposer au pointeur : marche à la souris comme au doigt.
   Un déplacement de moins de 8 px est traité comme un simple clic. */
function activerGlisser(el) {
  let fantome = null;
  let depart = null;

  el.addEventListener('pointerdown', (ev) => {
    depart = { x: ev.clientX, y: ev.clientY };
    el.setPointerCapture(ev.pointerId);
  });

  el.addEventListener('pointermove', (ev) => {
    if (!depart) return;
    const dist = Math.hypot(ev.clientX - depart.x, ev.clientY - depart.y);
    if (dist < 8) return;

    if (!fantome) {
      const r = el.getBoundingClientRect();
      fantome = el.cloneNode(true);
      fantome.classList.add('is-dragging');
      fantome.style.width = r.width + 'px';
      document.body.appendChild(fantome);
      el.style.opacity = '0.35';
    }
    fantome.style.left = (ev.clientX - 60) + 'px';
    fantome.style.top = (ev.clientY - 30) + 'px';

    document.querySelectorAll('.colonne').forEach((c) => c.classList.remove('is-target'));
    const cible = colonneSous(ev.clientX, ev.clientY);
    if (cible) cible.classList.add('is-target');
  });

  el.addEventListener('pointerup', (ev) => {
    document.querySelectorAll('.colonne').forEach((c) => c.classList.remove('is-target'));
    if (fantome) {
      fantome.remove();
      fantome = null;
      el.style.opacity = '';
      etat.vientDeGlisser = true;
      setTimeout(() => { etat.vientDeGlisser = false; }, 0);
      const cible = colonneSous(ev.clientX, ev.clientY);
      if (cible) deposer(cible.dataset.palier);
    }
    depart = null;
  });

  el.addEventListener('pointercancel', () => {
    if (fantome) { fantome.remove(); fantome = null; el.style.opacity = ''; }
    depart = null;
  });
}

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
    li.innerHTML = `<strong>${c.titre}</strong> — ${c.source}`;
    ul.appendChild(li);
  });
}

/* ============ Démarrage ============ */

reset();
construireCurseurs();
construireGroupes();
calculer();
listerSources();
