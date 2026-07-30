# Sources des chiffres

Tous les chiffres affichés par l'application, avec leur source primaire et son adresse. Vérifié le **30 juillet 2026** par recherche des sources primaires, une par une.

Depuis le 30 juillet 2026, ces adresses sont **dans l'application elle-même** : chaque carte rangée affiche sa source en lien cliquable, plus un lien « pour aller plus loin » vers la publication complète. Les liens vivent dans `data.js` (champs `lien`, `plus`, `sans_lien`) ; ce fichier reste la trace de la vérification, pas la source d'affichage.

Trois statuts, ceux de l'application elle-même :

| Statut | Ce qu'il veut dire |
|---|---|
| **Mesuré** | Relu par des pairs, méthode publiée |
| **Déclaré** | Publié par l'entreprise qui vend le service |
| **Estimé** | Calculé par un tiers, sans accès aux installations |

## Les treize cartes

### Palier 1, le wattheure

| Carte | Chiffre | Source | Statut | Lien |
|---|---|---|---|---|
| Un prompt texte à Gemini | 0,24 Wh | Google, août 2025 | Déclaré | [blog.google (FR)](https://blog.google/intl/fr-fr/nouveautes-produits/dans-le-cloud/quelle-consommation-energetique-pour-lia-de-google-nous-avons-fait-le-calcul/) et le rapport technique [arXiv 2508.15734](https://arxiv.org/abs/2508.15734) |
| Une recherche Google | 0,3 Wh | Urs Hölzle, blog officiel de Google, 11 janvier 2009 | Déclaré | [googleblog.blogspot.com](https://googleblog.blogspot.com/2009/01/powering-google-search.html), miroir [publicpolicy.googleblog.com](https://publicpolicy.googleblog.com/2009/01/powering-google-search.html) |
| Un prompt texte à ChatGPT | 0,34 Wh | Sam Altman, *The Gentle Singularity*, 10 juin 2025 | Déclaré | [blog.samaltman.com](https://blog.samaltman.com/the-gentle-singularity) |
| Une requête à une IA générative | 2,9 Wh | EPRI, *Powering Intelligence*, mai 2024 | Estimé | [PDF du rapport](https://www.wpr.org/wp-content/uploads/2024/06/3002028905_Powering-Intelligence_-Analyzing-Artificial-Intelligence-and-Data-Center-Energy-Consumption.pdf), [fiche EPRI](https://www.epri.com/research/products/000000003002028905) |
| Une image générée par IA | 2,9 Wh en moyenne, jusqu'à 11,5 Wh | Luccioni, Jernite & Strubell, *Power Hungry Processing*, ACM FAccT 2024 | Mesuré | [arXiv 2311.16863](https://arxiv.org/abs/2311.16863), [ACM](https://dl.acm.org/doi/10.1145/3630106.3658542) |
| Une vidéo IA de 5 secondes | 944 Wh | Mesure Luccioni sur CogVideoX, MIT Technology Review, 20 mai 2025 | Mesuré | [technologyreview.com](https://www.technologyreview.com/2025/05/20/1116327/ai-energy-usage-climate-footprint-big-tech/), [méthodologie](https://www.technologyreview.com/2025/05/20/1116331/ai-energy-demand-methodology/) |

**Sur le 2,9 Wh.** L'EPRI ne l'a pas mesuré, il le relaie. Son rapport écrit « estimated » et renvoie à Alex de Vries, *The Growing Energy Footprint of Artificial Intelligence*, *Joule*, 2023 : [cell.com](https://www.cell.com/joule/fulltext/S2542-4351(23)00365-3), [ScienceDirect](https://www.sciencedirect.com/science/article/pii/S2542435123003653). C'est cette publication qui est la source réelle du chiffre, et du rapport de dix avec la recherche Google.

**Sur le 0,3 Wh de 2009.** Le billet n'a jamais été mis à jour. Sollicité par l'organisme de fact-checking britannique Full Fact, Google a confirmé n'avoir publié aucune donnée chiffrée depuis : [fullfact.org](https://fullfact.org/environment/google-search/).

Corps du billet lu dans un navigateur le 30 juillet 2026 (les outils automatisés n'en voient pas le texte, la page ancienne se peuple en JavaScript ; ouverte dans Chrome, elle s'affiche entière). Deux points relevés :

- Google écrit « **0.0003 kWh** of energy per search, or 1 kJ », jamais « 0,3 Wh ». C'est le même nombre dans une unité qui le rapetisse, le mécanisme que la carte GPT-3 pointe déjà. Signalé désormais dans la réserve de la carte.
- Les 0,2 g de CO₂ sont verbatim : « one Google search is equivalent to about 0.2 grams of CO2 ».
- Le billet est signé Urs Hölzle sur le miroir Public Policy ; la version du blog officiel ne porte pas de signature visible.

### Paliers 2 et 3, le kilowattheure et le mégawattheure

| Carte | Chiffre | Source | Statut | Lien |
|---|---|---|---|---|
| Une seconde de ChatGPT dans le monde | entre 7 et 84 kWh | Calcul | Estimé | Volume de requêtes : [TechCrunch, 21 juillet 2025](https://techcrunch.com/2025/07/21/chatgpt-users-send-2-5-billion-prompts-a-day/) |
| Une heure de ChatGPT dans le monde | entre 25 et 302 MWh | Calcul | Estimé | Même source |

Méthode des deux cartes : 2,5 milliards de prompts par jour, chiffre donné par OpenAI à Axios en juillet 2025, multipliés par 0,24 Wh (borne basse, chiffre de Google) puis par 2,9 Wh (borne haute, chiffre de l'EPRI). Les deux bornes restent dans le même palier, c'est le point de la carte.

Réserve de méthode : le volume est celui de ChatGPT, les coûts unitaires viennent l'un de Gemini, l'autre d'une requête générique. Le calcul croise deux produits différents, faute de coût unitaire publié pour ChatGPT par une source indépendante.

### Palier 4, le gigawattheure

| Carte | Chiffre | Source | Statut | Lien |
|---|---|---|---|---|
| Entraîner GPT-3, une seule fois | 1 287 MWh, soit 1,3 GWh, et 552 t de CO₂ | Patterson et al., 2021 | Mesuré | [arXiv 2104.10350](https://arxiv.org/abs/2104.10350) |
| Entraîner GPT-4 | environ 50 GWh | Estimations de tiers, 40 à 48 fois GPT-3 | Estimé | **Aucune source primaire.** OpenAI n'a rien publié |

**Sur les coûts d'entraînement.** Contrairement à ce que dit encore la réserve de la carte GPT-3 dans `data.js`, d'autres laboratoires publient ces chiffres : Meta donne les heures GPU et les 2 290 t de CO₂ de Llama 3 ([model card](https://github.com/meta-llama/llama3/blob/main/MODEL_CARD.md), 2024), BigScience donne les 433 196 kWh de BLOOM ([arXiv 2211.02001](https://arxiv.org/abs/2211.02001), 2022), l'Allen Institute documente OLMo 2. Le silence est celui d'OpenAI, pas celui de la recherche.

### Palier 5, le térawattheure

| Carte | Chiffre | Source | Statut | Lien |
|---|---|---|---|---|
| Google, toute l'entreprise, en un an | 43,6 TWh | Rapport environnemental de Google 2026, année 2025 | Déclaré | [l'annonce, qui donne les 37 %](https://blog.google/company-news/outreach-and-initiatives/sustainability/2026-environmental-report/), [le rapport complet](https://sustainability.google/reports/google-2026-environmental-report/) |
| Tous les data centers du monde, en 2024 | 415 TWh | AIE, *Energy and AI*, avril 2025 | Mesuré | [iea.org](https://www.iea.org/reports/energy-and-ai), [résumé](https://www.iea.org/reports/energy-and-ai/executive-summary) |
| Tous les data centers du monde, prévu pour 2030 | 945 TWh | AIE, *Energy and AI*, avril 2025 | Estimé | Même rapport |

**Sur les 415 TWh.** Périmètre : **tous** les data centers, streaming, cloud et courriels compris, pas seulement ceux de l'IA. Verbatim du rapport : « Data centres accounted for around 1.5% of the world's electricity consumption in 2024, or 415 terawatt-hours (TWh). »

**Sur les 43,6 TWh de Google.** Ambiguïté levée le 30 juillet 2026 : le couple 43,6 TWh et plus 37 % est celui de l'année 2025, publié dans le rapport de 2026. Le tableau du rapport affiche 43 586 600 MWh au total, dont 42 415 800 pour les data centers. L'étiquette de `data.js` porte désormais les deux millésimes.

## La carte finale, celle qu'on ne peut pas ranger

Une journée de ChatGPT dans le monde entier, entre **600 MWh** et **7 250 MWh**.

Même méthode que les cartes calculées : 2,5 milliards de prompts par jour ([TechCrunch, juillet 2025](https://techcrunch.com/2025/07/21/chatgpt-users-send-2-5-billion-prompts-a-day/)) multipliés par 0,24 Wh d'un côté, par 2,9 Wh de l'autre. Les deux calculs retombent exactement sur les bornes affichées. La carte est intriable parce que ses deux bornes tombent dans deux paliers différents, et c'est sa fonction pédagogique.

## Les repères d'échelle

| Repère | Valeur | Source | Lien |
|---|---|---|---|
| Toute la Belgique, 2024 | 80,5 TWh | Elia, communiqué du 2 janvier 2025 | [elia.be](https://www.elia.be/fr/presse/2025/01/20250102_electricity-mix), [PDF](https://www.elia.be/-/media/project/elia/shared/documents/press-releases/2025/20250102_press-release_electricity-mix-2024_fr.pdf), reprise [RTBF](https://www.rtbf.be/article/bilan-electricite-2024-en-belgique-plus-d-importations-et-plus-de-production-photovoltaique-11484197) |
| Un ménage belge, un an | 3,5 MWh | CREG, ménage-type belge (3 500 kWh par an), repris par Eurostat | [creg.be, CREG Scan](https://www.creg.be/fr/creg-scan-questions-frequemment-posees) |
| Charger un smartphone | 15 Wh | Ordre de grandeur d'usage | Convention du projet, pas une source |
| Une machine à laver | 800 Wh | Ordre de grandeur d'usage | Convention du projet, pas une source |
| Une ampoule LED | 8 W | Convention du projet, sert aux traductions en minutes | Convention du projet, pas une source |

## Les chiffres du simulateur

Les curseurs de l'onglet « Estime ta semaine » reprennent les coûts unitaires ci-dessus : 0,3 Wh la recherche Google, de 0,24 à 2,9 Wh la question à une IA, de 2,9 à 11,5 Wh l'image, 944 Wh la vidéo de 5 secondes.

Les multiplicateurs de population comptent les **plus de 13 ans**, âge minimum de la plupart des services d'IA. Méthode : population totale moins les 0-12 ans, ces derniers interpolés depuis la tranche 0-14 ans publiée. Estimation assumée, pas un recensement.

| Groupe | Population retenue | Source déclarée dans l'application |
|---|---|---|
| Belgique | 10,2 millions | 11 825 551 habitants au 1ᵉʳ janvier 2025 (Statbel), dont 16,1 % de 0-14 ans (Eurostat) |
| Union européenne | 387 millions | 450,4 millions d'habitants au 1ᵉʳ janvier 2025 (Eurostat) |
| Monde | 6,5 milliards | 8,3 milliards d'habitants en 2026 (ONU), dont 24,7 % de 0-14 ans (Banque mondiale) |

URL primaires non vérifiées dans cette passe pour ces trois lignes.

## Corrections appliquées le 30 juillet 2026

Les deux réserves fausses affichées aux élèves ont été réécrites dans `data.js` :

1. **Carte « Une requête à une IA générative »** : « C'est celui que reprend l'Agence internationale de l'énergie » était faux. Le 2,9 Wh n'apparaît dans aucun rapport de l'AIE de 2025 ni de 2026 ; celui de 2026 cite les chiffres de Google et d'OpenAI. La réserve dit désormais que l'EPRI relaie de Vries, *Joule*, 2023, et qu'il est financé par les compagnies d'électricité.
2. **Carte « Entraîner GPT-3 »** : « Depuis, plus aucun laboratoire n'en publie » était faux, voir Llama 3, BLOOM et OLMo 2 ci-dessus. La réserve restreint désormais le silence à OpenAI et donne Meta en contre-exemple, avec le lien vers la fiche de Llama 3.

Troisième correction, sur le millésime : le champ `source` de la carte Google disait « Rapport environnemental de Google, 2025 ». Il dit maintenant « Rapport environnemental de Google 2026, pour l'année 2025 ». Le chiffre est confirmé dans le tableau du rapport : **43 586 600 MWh** de consommation totale en 2025, dont 42 415 800 MWh pour les data centers, soit les 97 % de la réserve, et une hausse de 37 % (verbatim : « our total electricity consumption grew by 37% in 2025, up from 27% in 2024 »).

## Deux sources qui refusent les robots

Ces deux adresses répondent 403 à toute requête automatisée (protection anti-robot), sans que le contenu soit en cause. À ouvrir à la main pour les revérifier.

| Adresse | Contournement retenu |
|---|---|
| [elia.be, communiqué du 2 janvier 2025](https://www.elia.be/fr/presse/2025/01/20250102_electricity-mix) | Le repère « Belgique, 80,5 TWh » pointe vers la [reprise RTBF](https://www.rtbf.be/article/bilan-electricite-2024-en-belgique-plus-d-importations-et-plus-de-production-photovoltaique-11484197), en français, qui cite Elia et donne le chiffre au mot près |
| [dl.acm.org, Power Hungry Processing](https://dl.acm.org/doi/10.1145/3630106.3658542) | La carte pointe vers [arXiv 2311.16863](https://arxiv.org/abs/2311.16863), gratuit et sans blocage |
| [cell.com, de Vries dans Joule](https://www.cell.com/joule/fulltext/S2542-4351(23)00365-3) | La carte passe par le DOI, [doi.org/10.1016/j.joule.2023.09.004](https://doi.org/10.1016/j.joule.2023.09.004), qui répond |

## Le ménage belge à 3,5 MWh

URL primaire trouvée le 30 juillet 2026 : [CREG Scan, questions fréquemment posées](https://www.creg.be/fr/creg-scan-questions-frequemment-posees). Verbatim : « Le CREG Scan utilise des volumes de consommation annuelle standard pour les particuliers (électricité : 3.500 kWh, gaz naturel : 17.000 kWh) ». Le repère du palier MWh pointe vers cette page.

## Réactualisation

Les ordres de grandeur de l'IA bougent vite. À revérifier chaque rentrée, source par source, en modifiant `data.js` seul. Ce fichier se met à jour en même temps.
