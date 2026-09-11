/**
 * Ce qui est commun à toutes les pages : coordonnées, pied de page,
 * bandeau cookies. Une seule définition, quinze pages servies.
 *
 * C'est ce fichier qui règle le problème relevé en phase 0 : le pied de
 * page et le bandeau de consentement étaient écrits à la main sur
 * l'accueil, régénérés pour les pages prestations, et absents des neuf
 * pages projet — qui chargeaient pourtant Umami.
 */

export const studio = {
  nom: 'Studio Skøne',
  email: 'contact@studioskone.com',
  telephone: '07 68 08 47 52',
  telephoneLien: '+33768084752',
  instagram: 'https://www.instagram.com/studio.skone/',
  ficheGoogle: 'https://maps.google.com/?cid=17161741996888223031',
  annee: '2026',
}

export const pied = {
  cta: {
    mention: 'Réponse sous 24h',
    statut: 'Disponible pour de nouveaux projets.',
    lien: { libelle: 'Parlons-en', href: '#contact' },
  },
  tagline:
    'Studio Skøne — création de sites internet, boutiques en ligne et applications, à Nantes et dans toute la France. ' +
    'Conçus et développés par la même personne, du croquis à la mise en ligne.',
  zone:
    'Basé à Nantes · J\'interviens à Carquefou, La Chapelle-sur-Erdre, Sucé-sur-Erdre, Nort-sur-Erdre, Treillières, Ancenis — et partout en France en visio.',
  colonnes: [
    {
      titre: 'Le studio',
      aria: 'Navigation secondaire',
      liens: [
        { libelle: 'À propos', href: '/#approach' },
        { libelle: 'Projets',  href: '/#work' },
        { libelle: 'Tarifs',   href: '/#tarifs' },
        { libelle: 'Contact',  href: '/#contact' },
      ],
    },
    {
      titre: 'Prestations',
      aria: 'Prestations',
      liens: [
        { libelle: 'Création de site internet', href: '/creation-site-internet-nantes' },
        { libelle: 'Site e-commerce',           href: '/creation-site-ecommerce-nantes' },
        { libelle: 'Application mobile',        href: '/creation-application-mobile' },
        { libelle: 'Refonte de site',           href: '/refonte-site-internet' },
        { libelle: 'Site internet pour artisan', href: '/creation-site-internet-artisan' },
      ],
    },
  ],
  ficheGoogleLibelle: 'Voir la fiche Google',
  copyright: '&copy; 2026 Studio Skøne. Tous droits réservés.',
  legal: [
    { libelle: 'Mentions légales',             href: '/mentions-legales' },
    { libelle: 'Politique de confidentialité', href: '/politique-de-confidentialite' },
    { libelle: 'CGU',                          href: '/cgu' },
    { libelle: 'CGV',                          href: '/cgv' },
  ],
}

export const cookies = {
  titre: 'Cookies',
  texte: 'Deux cookies de mesure d\'audience, rien de plus. Vous pouvez refuser, le site fonctionne pareil.',
  refuser: 'Refuser',
  accepter: 'Accepter',
}
