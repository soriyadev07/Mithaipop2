import { Review, FaqItem, CustomPopIngredient } from '../types';

export const REVIEWS: Review[] = [
  {
    id: 'rev-1',
    author: 'Aarav Malhotra',
    city: 'South Delhi',
    rating: 5,
    comment: '“Didn’t know gulab jamun and ice cream could go this hard. The temperature contrast inside the can is pure wizardry. And my girlfriend immediately took the can to plant a baby jade succulent.”',
    favoritePop: 'Delhi Pop',
    verified: true,
    avatarBg: '#7A0F29',
    upcycledUse: 'Succulent Planter'
  },
  {
    id: 'rev-2',
    author: 'Riya Sengupta',
    city: 'Ballygunge, Kolkata',
    rating: 5,
    comment: '“As someone fiercely protective of Bengal sweets, I was skeptical. But the baked mishti doi layer with the soft rasgulla was absolute poetry. It tastes nostalgic and completely new at the same time.”',
    favoritePop: 'Kolkata Pop',
    verified: true,
    avatarBg: '#52091B',
    upcycledUse: 'Desk Pen Holder'
  },
  {
    id: 'rev-3',
    author: 'Meera Chordia',
    city: 'Indiranagar, Bengaluru',
    rating: 5,
    comment: '“The packaging is so good I kept all 4 cans. They sit on my workstation as organizers. Best dessert unboxing experience in India by far. Ordering the 6-pack for Diwali gifting.”',
    favoritePop: 'Lucknow Pop',
    verified: true,
    avatarBg: '#F5A623',
    upcycledUse: 'Paintbrush & Art Caddy'
  },
  {
    id: 'rev-4',
    author: 'Kabir Varma',
    city: 'Bandra West, Mumbai',
    rating: 5,
    comment: '“The Jalebi Rabri Pop solves the greatest tragedy of takeout jalebi: it stays crisp! The pop tab seal keeps everything in dual-layer suspension until you crack it open. Mind blown.”',
    favoritePop: 'Jalebi Rabri Pop',
    verified: true,
    avatarBg: '#7A0F29',
    upcycledUse: 'Coffee Table Tealight'
  },
  {
    id: 'rev-5',
    author: 'Ananya Deshmukh',
    city: 'Pune',
    rating: 5,
    comment: '“Brought a crate of Mithai Pops to an office party instead of standard cupcakes. Within 10 minutes everyone was taking photos and trading cans. 10/10 flavor execution!”',
    favoritePop: 'Delhi Pop',
    verified: true,
    avatarBg: '#F58FA3',
    upcycledUse: 'Makeup Brush Stand'
  }
];

export const SOCIAL_POSTS = [
  {
    id: 'ig-1',
    user: '@ananyabakes',
    handle: 'Ananya B.',
    caption: 'When midnight sweet tooth meets the ultimate Delhi Pop can ✨ #MithaiPop #DesiFusion #SnackAesthetic',
    likes: '4.2k',
    tag: 'Delhi Pop',
    time: '2h ago'
  },
  {
    id: 'ig-2',
    user: '@ronnie.design',
    handle: 'Ronnie S.',
    caption: 'Turning my Lucknow Pop can into an architectural pencil holder. Don’t throw the can away 🔥',
    likes: '6.8k',
    tag: 'Upcycled Can',
    time: '5h ago'
  },
  {
    id: 'ig-3',
    user: '@foodiesofmumbai',
    handle: 'Mumbai Eats',
    caption: 'That snap sound when you open a chilled Jalebi Rabri Pop! Crunch is unreal 🤤',
    likes: '12.4k',
    tag: 'Jalebi Rabri',
    time: '1d ago'
  },
  {
    id: 'ig-4',
    user: '@tanya_aesthetic',
    handle: 'Tanya K.',
    caption: 'The graphic design on these cans is museum tier. Also, Rasgulla + Mishti Doi is my new Roman Empire.',
    likes: '8.9k',
    tag: 'Kolkata Pop',
    time: '2d ago'
  }
];

export const FAQS: FaqItem[] = [
  {
    id: 'faq-1',
    category: 'general',
    question: 'What is Mithai Pop?',
    answer: 'Mithai Pop is a modern Indian dessert brand that reimagines beloved traditional sweets (like Gulab Jamun, Jalebi, Rasgulla, and Malpua) into unexpected cold-and-crunch pairings packed inside collectible, food-grade aluminum cans.'
  },
  {
    id: 'faq-2',
    category: 'general',
    question: 'What makes Mithai Pop different from traditional mithai?',
    answer: 'Traditional mithai is often confined to festive boxes, prone to drying out, and bound by strict traditional formats. Mithai Pop introduces temperature contrast (warm spice cores inside ice-cold clotted creams), textural layering (crunchy mini jalebis that don’t get soggy), and collectible packaging you can reuse as home decor.'
  },
  {
    id: 'faq-3',
    category: 'shipping',
    question: 'How do you ship cold desserts safely?',
    answer: 'We use proprietary insulated cryogenic cold-packs with biodegradable mycelium padding. Your cans arrive guaranteed ice-cold (between 2°C to 6°C) within 24 to 48 hours anywhere in major Indian metros.'
  },
  {
    id: 'faq-4',
    category: 'packaging',
    question: 'Are the cans really reusable and eco-friendly?',
    answer: 'Yes! Our cans are 100% infinitely recyclable food-grade aluminum, sealed with food-safe plant lacquers. Because the artwork is UV-cured directly onto the metal, you can wash them and use them as plant pots, desk pen stands, cutlery holders, or collectible shelf art.'
  },
  {
    id: 'faq-5',
    category: 'ingredients',
    question: 'What ingredients do you use? Are there artificial preservatives?',
    answer: 'Zero chemical preservatives or synthetic coloring. We use 100% pure cow & buffalo milk dairy, artisanal khoya, grade-A Kashmiri mongra saffron, organic date palm jaggery (nolen gur), and natural vanilla beans.'
  },
  {
    id: 'faq-6',
    category: 'general',
    question: 'Can I create my own custom Pop or order gift boxes?',
    answer: 'Yes! You can use our interactive “Build Your Own Pop” studio to customize your base, cream, twist, and crunch. We also provide bespoke luxury gift tins for weddings, corporate gifting, and festive celebrations.'
  },
  {
    id: 'faq-7',
    category: 'shipping',
    question: 'How long do the cans stay fresh once received?',
    answer: 'Unopened cans stay fresh in your home refrigerator for 10 to 14 days from delivery (check the bottom stamp). Once popped open, we recommend enjoying immediately with the included bamboo tasting spoon!'
  }
];

export const INGREDIENT_OPTIONS: CustomPopIngredient[] = [
  // 1. Base Desserts
  { id: 'b-gulab', name: 'Gulab Jamun', category: 'base', description: 'Ghee-fried milk solid sphere soaked in cardamom syrup', color: '#7A0F29', calories: 140 },
  { id: 'b-jalebi', name: 'Crispy Saffron Jalebi', category: 'base', description: 'Spiral pretzel crunch steeped in saffron elixir', color: '#F5A623', calories: 125 },
  { id: 'b-rasgulla', name: 'Chena Rasgulla Cloud', category: 'base', description: 'Feather-light spongy cottage cheese in rose mist', color: '#FFF7E8', calories: 95 },
  { id: 'b-malpua', name: 'Awadhi Malpua Dumpling', category: 'base', description: 'Lace-edged pancake with fennel and rabri glaze', color: '#F2C76E', calories: 160 },
  { id: 'b-puli', name: 'Nolen Gur Doodh Puli', category: 'base', description: 'Hand-pinched rice dumpling stuffed with jaggery coconut', color: '#52091B', calories: 110 },

  // 2. Creams
  { id: 'c-vanilla', name: 'Vanilla Ice Cream', category: 'cream', description: 'Slow-churned Madagascar velvet cream with whole vanilla pods', color: '#FFF7E8', calories: 110 },
  { id: 'c-rabri', name: 'Lachha Saffron Rabri', category: 'cream', description: 'Thick clotted milk ribbons with Kashmiri saffron', color: '#F2C76E', calories: 135 },
  { id: 'c-doi', name: 'Baked Earthen Mishti Doi', category: 'cream', description: 'Caramelized cultured sweet yogurt baked in terracotta', color: '#FFD6B8', calories: 90 },
  { id: 'c-kulfi', name: 'Caramelized Pista Gelato', category: 'cream', description: 'Dense condensed milk gelato with emerald pistachios', color: '#A3D9A5', calories: 130 },
  { id: 'c-mango', name: 'Alphonso Mawa Custard', category: 'cream', description: 'Ratnagiri king mango blended into rich mawa custard', color: '#F5A623', calories: 115 },

  // 3. Toppings
  { id: 'top-pista', name: 'Pistachio', category: 'topping', description: 'Vibrant green roasted Afghan pistachio slivers', color: '#93C572', calories: 35 },
  { id: 'top-gold', name: '24K Edible Gold & Silver Leaf', category: 'topping', description: 'Royal shahi shimmer that melts on the tongue', color: '#E5E4E2', calories: 0 },
  { id: 'top-caviar', name: 'Rose Falooda Popping Pearls', category: 'topping', description: 'Bite-sized pearls bursting with floral sweetness', color: '#F58FA3', calories: 20 },
  { id: 'top-cashew', name: 'Toasted Cashew Crumble', category: 'topping', description: 'Golden caramelized buttery cashew flakes', color: '#F2C76E', calories: 40 },

  // 4. Crunch
  { id: 'cr-almond', name: 'Almond', category: 'crunch', description: 'Mamra almond praline brittle roasted in desi ghee', color: '#D2B48C', calories: 45 },
  { id: 'cr-boondi', name: 'Honey-Glazed Boondi', category: 'crunch', description: 'Crisp micro pearls tossed in wildflower honey', color: '#F5A623', calories: 50 },
  { id: 'cr-makhana', name: 'Cardamom Makhana Nibs', category: 'crunch', description: 'Puffed water lily seeds toasted with green cardamom', color: '#FFF7E8', calories: 30 },
  { id: 'cr-hazelnut', name: 'Spiced Hazelnut Brittle', category: 'crunch', description: 'Crunchy crushed hazelnuts dusted with cinnamon', color: '#C49A6C', calories: 48 },

  // 5. Flavour Twists
  { id: 't-saffron', name: 'Saffron', category: 'twist', description: 'Deep floral amber notes and crimson Kashmiri saffron threads', color: '#F2C76E', calories: 10 },
  { id: 't-rose', name: 'Damascus Rose Mist', category: 'twist', description: 'Subtle fragrant floral dew with pink gulkand', color: '#F58FA3', calories: 15 },
  { id: 't-cardamom', name: 'Smoked Green Cardamom', category: 'twist', description: 'Warming aromatic spice from Idukki hills', color: '#88B04B', calories: 5 },
  { id: 't-sandalwood', name: 'Royal Sandalwood Essence', category: 'twist', description: 'Aromatic subtle temple wood soothing infusion', color: '#E8D3A2', calories: 5 }
];
