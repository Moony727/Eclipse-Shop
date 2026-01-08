/**
 * TEMPLATE FOR ADDING DATA TO FIREBASE
 * 
 * You can use this script to add products and categories to your Firestore.
 * Requires: firebase-admin
 * Run with: node import-data.js
 */

const admin = require('firebase-admin');
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const categories = [
  {
    id: "music",
    name: { en: "Music", ru: "Музыка", az: "Musiqi" },
    subcategories: [
      { id: "streaming", name: { en: "Streaming", ru: "Стриминг", az: "Striminq" } }
    ]
  },
  {
    id: "tv",
    name: { en: "TV & Cinema", ru: "ТВ и Кино", az: "TV və Kino" },
    subcategories: [
      { id: "subscriptions", name: { en: "Subscriptions", ru: "Подписки", az: "Abunəliklər" } }
    ]
  },
  {
    id: "games",
    name: { en: "Games", ru: "Игры", az: "Oyunlar" },
    subcategories: [
      { id: "freefire", name: { en: "Free Fire", ru: "Free Fire", az: "Free Fire" } }
    ]
  }
];

const products = [
  {
    name: { en: "Spotify Premium", ru: "Spotify Premium", az: "Spotify Premium" },
    description: { 
      en: "Spotify Premium subscription for 1 month.", 
      ru: "Подписка Spotify Premium на 1 месяц.", 
      az: "1 aylıq Spotify Premium abunəliyi." 
    },
    price: 6.00,
    category: "music",
    subcategory: "streaming",
    imageUrl: "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/spotify.png",
    isActive: true,
    createdAt: admin.firestore.Timestamp.now()
  },
  {
    name: { en: "Netflix", ru: "Netflix", az: "Netflix" },
    description: { 
      en: "Netflix subscription (Currently Unavailable)", 
      ru: "Подписка Netflix (В данный момент недоступна)", 
      az: "Netflix abunəliyi (Hal-hazırda mövcud deyil)" 
    },
    price: 0.00,
    category: "tv",
    subcategory: "subscriptions",
    imageUrl: "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/netflix.png",
    isActive: false,
    createdAt: admin.firestore.Timestamp.now()
  },
  {
    name: { en: "FF Weekly Lite Membership", ru: "FF Еженедельная Lite подписка", az: "FF Həftəlik Lite Üzvlük" },
    description: { en: "Free Fire Weekly Lite Membership", ru: "Free Fire Еженедельная Lite подписка", az: "Free Fire Həftəlik Lite Üzvlük" },
    price: 2.50,
    category: "games",
    subcategory: "freefire",
    imageUrl: "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/ff_membership.png",
    isActive: true,
    createdAt: admin.firestore.Timestamp.now()
  },
  {
    name: { en: "FF Weekly Membership", ru: "FF Еженедельная подписка", az: "FF Həftəlik Üzvlük" },
    description: { en: "Free Fire Weekly Membership", ru: "Free Fire Еженедельная подписка", az: "Free Fire Həftəlik Üzvlük" },
    price: 5.00,
    category: "games",
    subcategory: "freefire",
    imageUrl: "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/ff_membership.png",
    isActive: true,
    createdAt: admin.firestore.Timestamp.now()
  },
  {
    name: { en: "FF Monthly Membership", ru: "FF Ежемесячная подписка", az: "FF Aylıq Üzvlük" },
    description: { en: "Free Fire Monthly Membership", ru: "Free Fire Ежемесячная подписка", az: "Free Fire Aylıq Üzvlük" },
    price: 20.00,
    category: "games",
    subcategory: "freefire",
    imageUrl: "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/ff_membership.png",
    isActive: true,
    createdAt: admin.firestore.Timestamp.now()
  },
  {
    name: { en: "Free Fire 100 Diamonds", ru: "Free Fire 100 Алмазов", az: "Free Fire 100 Brilyant" },
    description: { en: "100 Diamonds for Free Fire", ru: "100 Алмазов для Free Fire", az: "Free Fire üçün 100 Brilyant" },
    price: 2.00,
    category: "games",
    subcategory: "freefire",
    imageUrl: "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/ff_diamonds.png",
    isActive: true,
    createdAt: admin.firestore.Timestamp.now()
  }
];

async function importData() {
  console.log("Starting import...");

  // Import Categories
  for (const cat of categories) {
    await db.collection('categories').doc(cat.id).set(cat);
    console.log(`Imported category: ${cat.id}`);
  }

  // Import Products
  for (const prod of products) {
    const docRef = await db.collection('products').add(prod);
    console.log(`Imported product with ID: ${docRef.id}`);
  }

  console.log("Import completed!");
  process.exit();
}

importData().catch(console.error);
