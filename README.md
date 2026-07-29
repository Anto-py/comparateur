# Le comparateur — combien pèse une intelligence artificielle ?

**En ligne : https://anto-py.github.io/comparateur/**

Activité web pour la classe. En deux temps :

1. **Ranger les chiffres.** Treize cartes portant un chiffre réel de consommation électrique liée à l'IA, à ranger sur une frise de cinq paliers, du wattheure au térawattheure. D'un palier à l'autre, on multiplie par mille. Chaque carte affiche sa source, sa date et son statut : mesuré et relu par des scientifiques, déclaré par l'entreprise concernée, ou estimé par un tiers.
2. **Estimer sa semaine.** Chacun compte ses usages, l'application calcule avec les deux chiffres à la fois, celui des entreprises et celui des chercheurs indépendants. L'écart entre les deux ne se referme jamais, et c'est le sujet.

Une requête à une IA pèse l'équivalent de deux minutes d'ampoule LED. L'activité n'enseigne pas la culpabilité, elle enseigne l'échelle.

## Utilisation

Aucune installation. Ouvrir `index.html`, ou servir le dossier :

```bash
python3 -m http.server 8777
```

Fonctionne au clic comme au doigt, sur ordinateur, tablette et téléphone.

## Sources

Tous les chiffres sont sourcés dans l'application elle-même et rassemblés en pied de page. Ils ont été vérifiés en juillet 2026 et bougent vite : à revérifier chaque rentrée. Un seul fichier à modifier pour cela, `data.js`.
