# Site du studio

Site vitrine responsive en français, sans dépendance à installer.

## Démarrage

Depuis `/workspace/test` :

```sh
python3 -m http.server 3000 --bind 0.0.0.0
```

Ouvrir le site via un hébergement web ou le navigateur de votre environnement de développement.

## Personnalisation nécessaire avant publication

- Modifier `config.js` : nom, adresse complète, lien public de prise de rendez-vous Google Agenda, lien PayPal.me du studio. Aucune clé secrète ne doit y figurer.
- Créer une page de prise de rendez-vous dans Google Agenda et copier son lien public. Les disponibilités et confirmations sont gérées sur Google. Aucune synchronisation OAuth ni vérification côté serveur n'est implémentée.
- Renseigner le vrai lien PayPal du studio. Le client confirme le montant convenu sur PayPal. Le retour de paiement n'est pas vérifié par le site et le paiement ne bloque pas automatiquement un créneau. Une réservation conditionnée au paiement nécessitera un backend, l'API PayPal et des webhooks vérifiés.
- Remplacer le nom, les textes, photos d'illustration, l'inventaire et les informations légales dans `index.html`. Les tarifs sont sur devis ; le format et le type sélectionnés aident à préparer le rendez-vous mais ne sont pas transmis automatiquement à Google ou PayPal.
- La carte Google est chargée après configuration de l'adresse. Au clic sur l'itinéraire, ipapi.co reçoit l'IP pour estimer la ville. Cette estimation peut être fausse (VPN, réseau mobile). En cas d'échec, le visiteur saisit son départ dans Google Maps. Aucune localisation n'est stockée par ce site.
- Adapter les informations de confidentialité, conditions de vente/annulation et obligations locales avec les coordonnées réelles de l'éditeur.

## Services externes

Les photos d'illustration utilisent images.unsplash.com, les polices fonts.googleapis.com et fonts.gstatic.com, la carte maps.google.com. Les itinéraires utilisent www.google.com et ipapi.co. Sans liens configurés, réservation et paiement affichent une information explicite sans ouvrir de compte de démonstration.

## Déploiement

Publier `index.html`, `style.css`, `app.js` et `config.js` sur un hébergement statique HTTPS. Aucun processus serveur applicatif ou secret n'est requis.

## Vérification

`node --check app.js` et `node --check config.js`, puis contrôle navigateur sur mobile et ordinateur : menu, navigation, boutons de réservation/paiement non configurés, absence de débordement horizontal. Tester ensuite les liens réels, le bénéficiaire PayPal et le calendrier avant ouverture au public.
