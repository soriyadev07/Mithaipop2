import { Product } from '../types';

// Import generated images
import heroCansImg from '../assets/images/mithai_pop_hero_1787725600147.jpg';
import mithaiBannerImg from '../assets/images/mithai_pop_banner_1787726808985.jpg';
import tapestryRedBg from '../assets/images/tapestry_red_bg_1787727446967.jpg';
import tapestryArchBg from '../assets/images/tapestry_arch_bg_1787727470462.jpg';
import tapestryGoldBg from '../assets/images/tapestry_gold_bg_1787727486701.jpg';
import delhiPopImg from '../assets/images/delhi_pop_product_1787725619709.jpg';
import kolkataPopImg from '../assets/images/kolkata_pop_product_1787725638895.jpg';
import lucknowPopImg from '../assets/images/lucknow_pop_product_1787725658715.jpg';
import planterCanImg from '../assets/images/mithai_pop_planter_1787725679576.jpg';

export {
  heroCansImg,
  mithaiBannerImg,
  tapestryRedBg,
  tapestryArchBg,
  tapestryGoldBg,
  delhiPopImg,
  kolkataPopImg,
  lucknowPopImg,
  planterCanImg
};

export const PRODUCTS: Product[] = [
  {
    id: 'delhi-pop',
    name: 'Delhi Pop',
    hindiName: 'दिल्ली पॉप',
    flavorCombination: 'Gulab Jamun × Vanilla Bean Ice Cream',
    tagline: 'Warm syrup core meets slow-churned Madagascar cold cream.',
    description: 'Inspired by Delhi’s legendary late-night street food culture. Warm, cardamom-spiced gulab jamun sphere suspended in rich, silky Madagascar vanilla bean cream with crushed Afghan pistachios.',
    cityInspiration: 'Old Delhi & Chandni Chowk',
    price: 249,
    originalPrice: 299,
    rating: 4.95,
    reviewCount: 342,
    image: delhiPopImg,
    accentColor: '#F5A623',
    bgColor: '#7A0F29',
    badge: 'Bestseller',
    ingredients: [
      'Pure Khoya Gulab Jamun',
      'Whole Milk Madagascar Vanilla Cream',
      'Crushed Iranian Pistachios',
      'Green Cardamom Infusion',
      'Wild Honey Rose Syrup'
    ],
    pairingNotes: 'Best enjoyed chilled right out of the can with an espresso or after spicy street chaat.',
    temperature: 'Best at 4°C (Chilled)',
    shelfLife: '14 Days Refrigerated',
    canArtworkDescription: 'Retro Chandni Chowk neon street sign art with mughal arches and gold foil accents.',
    nutrition: {
      calories: 285,
      protein: '6.8g',
      carbs: '34g',
      fat: '13.5g'
    },
    tags: ['Bestseller', 'Creamy', 'Warm Spices', 'Street Remix']
  },
  {
    id: 'kolkata-pop',
    name: 'Kolkata Pop',
    hindiName: 'कोलकाता पॉप',
    flavorCombination: 'Rasgulla × Baked Mishti Doi',
    tagline: 'Delicate airy sponge encased in caramelized baked sweet yogurt.',
    description: 'A tribute to Bengal’s revered sweetmasters. A tender, spongy chena rasgulla soaked in light rose essence, layered inside slow-baked, caramelized mishti doi with toasted almond slivers.',
    cityInspiration: 'Kolkata (College Street & Shyambazar)',
    price: 269,
    originalPrice: 320,
    rating: 4.91,
    reviewCount: 288,
    image: kolkataPopImg,
    accentColor: '#F58FA3',
    bgColor: '#52091B',
    badge: 'Cult Classic',
    ingredients: [
      'Fresh Cow Milk Chena Rasgulla',
      'Slow-Baked Earthen Mishti Doi',
      'Kashmir Rose Water Droplets',
      'Gulkand Petal Reduction',
      'Toasted Mamra Almonds'
    ],
    pairingNotes: 'A sublime summer palate cleanser with velvety contrast and subtle tang.',
    temperature: 'Best at 2°C - 4°C (Ice Cold)',
    shelfLife: '10 Days Refrigerated',
    canArtworkDescription: 'Howrah Bridge art deco silhouette blended with vintage yellow taxi and terracotta motifs.',
    nutrition: {
      calories: 240,
      protein: '8.2g',
      carbs: '29g',
      fat: '9.8g'
    },
    tags: ['Cult Classic', 'Tangy Sweet', 'Light', 'Royal Heritage']
  },
  {
    id: 'lucknow-pop',
    name: 'Lucknow Pop',
    hindiName: 'लखनऊ पॉप',
    flavorCombination: 'Malpua × Silky Saffron Rabri',
    tagline: 'Ghee-crisped golden malpua bites swirled in saffron clotted cream.',
    description: 'The grandeur of the Awadhi courts in a collectible soda can. Delicate crisp-edged malpua dumplings immersed in slow-simmered Kashmiri saffron rabri with edible silver leaf flakes.',
    cityInspiration: 'Lucknow (Chowk & Hazratganj)',
    price: 289,
    originalPrice: 349,
    rating: 4.98,
    reviewCount: 410,
    image: lucknowPopImg,
    accentColor: '#F2C76E',
    bgColor: '#7A0F29',
    badge: 'Chef Choice',
    ingredients: [
      'Desi Ghee Crisp Malpua Dumplings',
      'Slow-Simmered Malai Rabri (Lachha)',
      'Grade-A Mongra Kashmiri Saffron',
      'Chironji & Golden Raisins',
      'Pure Edible Silver Vark'
    ],
    pairingNotes: 'Rich, opulent and deeply nostalgic. Ideal for gifting and royal celebrations.',
    temperature: 'Slightly cool or room temp',
    shelfLife: '12 Days Refrigerated',
    canArtworkDescription: 'Intricate Rumi Darwaza filigree with Royal Awadhi gold brocade patterns.',
    nutrition: {
      calories: 320,
      protein: '7.5g',
      carbs: '38g',
      fat: '16.2g'
    },
    tags: ['Chef Choice', 'Ultra Rich', 'Saffron', 'Royal Heritage']
  },
  {
    id: 'jalebi-rabri-pop',
    name: 'Jalebi Rabri Pop',
    hindiName: 'जलेबी रबड़ी पॉप',
    flavorCombination: 'Crispy Saffron Jalebi × Silky Rabri',
    tagline: 'The timeless north-Indian wedding pairing, remastered for the modern era.',
    description: 'Mini saffron pretzel jalebis that retain their golden crunch inside thick, cardamom-infused malai rabri cream. Crack open the seal and hear the pop.',
    cityInspiration: 'Varanasi & Old Delhi',
    price: 259,
    originalPrice: 310,
    rating: 4.93,
    reviewCount: 367,
    image: delhiPopImg,
    accentColor: '#F5A623',
    bgColor: '#52091B',
    badge: 'Crunch & Cream',
    ingredients: [
      'Desi Ghee Fried Mini Jalebis',
      'Lachhadar Buffalo Milk Rabri',
      'Cardamom & Nutmeg Essence',
      'Pistachio Nib Slivers',
      'Saffron Sugar Glaze'
    ],
    pairingNotes: 'Contrasting textures: snappy sugar crunch meets velvet cream.',
    temperature: 'Best at 4°C',
    shelfLife: '10 Days Refrigerated',
    canArtworkDescription: 'Vibrant truck-art lettering and psychedelic spiral jalebi sunburst.',
    nutrition: {
      calories: 305,
      protein: '6.2g',
      carbs: '39g',
      fat: '14.8g'
    },
    tags: ['Crunch & Cream', 'Bestseller', 'Street Remix']
  },
  {
    id: 'mumbai-kulfi-pop',
    name: 'Mumbai Pop',
    hindiName: 'मुंबई पॉप',
    flavorCombination: 'Malai Pista Kulfi × Rose Falooda Caviar',
    tagline: 'Chowpatty sunset in a can: dense caramelized kulfi & sparkling rose pearls.',
    description: 'Slow-condensed whole milk kulfi with emerald pistachio ribbons, accented by popping rose water falooda pearls and sabja seeds.',
    cityInspiration: 'Girgaon Chowpatty & Marine Drive',
    price: 279,
    originalPrice: 330,
    rating: 4.89,
    reviewCount: 195,
    image: kolkataPopImg,
    accentColor: '#F58FA3',
    bgColor: '#7A0F29',
    badge: 'Limited Drop',
    ingredients: [
      'Caramelized Clotted Milk Kulfi',
      'Alphonso Mango Essence Caviar',
      'Damascus Rose Water Pearls',
      'Toasted Cashew Kernels',
      'Sweet Basil (Sabja) Seeds'
    ],
    pairingNotes: 'A refreshing late-night beachside chill reimagined in contemporary packaging.',
    temperature: 'Deep Chilled (-2°C to 2°C)',
    shelfLife: '14 Days Frozen/Refrigerated',
    canArtworkDescription: 'Marine Drive Queen’s Necklace curve with retro Bollywood typography.',
    nutrition: {
      calories: 270,
      protein: '7.1g',
      carbs: '31g',
      fat: '12.4g'
    },
    tags: ['Limited Drop', 'Chilled', 'Street Remix']
  },
  {
    id: 'amritsar-pop',
    name: 'Amritsar Pop',
    hindiName: 'अमृतसर पॉप',
    flavorCombination: 'Doodh Puli × Roasted Almond Cream',
    tagline: 'Silky rice dumplings filled with sweet coconut-jaggery in thickened saffron milk.',
    description: 'Winter nostalgia canned for all seasons. Delicate handmade crescent dumplings stuffed with shredded coconut and date palm jaggery, bathed in creamy roasted almond milk.',
    cityInspiration: 'Amritsar & Bengal Winters',
    price: 299,
    originalPrice: 350,
    rating: 4.96,
    reviewCount: 164,
    image: lucknowPopImg,
    accentColor: '#F2C76E',
    bgColor: '#52091B',
    badge: 'Winter Special',
    ingredients: [
      'Hand-Pinched Rice Flour Puli',
      'Organic Nolen Gur (Palm Jaggery)',
      'Fresh Grated Coastal Coconut',
      'California Roasted Almond Custard',
      'Green Cardamom Spicing'
    ],
    pairingNotes: 'Warm or chilled comfort with earthy molasses notes and gentle chew.',
    temperature: 'Best at room temp or warm',
    shelfLife: '10 Days Refrigerated',
    canArtworkDescription: 'Golden Temple pond reflections and Phulkari embroidery geometric patterns.',
    nutrition: {
      calories: 290,
      protein: '5.9g',
      carbs: '37g',
      fat: '11.8g'
    },
    tags: ['Winter Special', 'Jaggery Sweet', 'Comfort']
  }
];

export const BUNDLE_PACKS = [
  {
    id: 'quad-sampler',
    name: 'The Four-City Pop Box (Pack of 4)',
    tagline: '1× Delhi Pop, 1× Kolkata Pop, 1× Lucknow Pop, 1× Jalebi Rabri Pop',
    price: 999,
    originalPrice: 1199,
    badge: 'Most Popular',
    description: 'The quintessential introduction to Mithai Pop. Experience the best of Delhi, Kolkata, Lucknow and Varanasi in our signature collectible gift tin.',
    image: heroCansImg
  },
  {
    id: 'collector-vault',
    name: 'The Grand India Vault (Pack of 6 + 2 Upcycling Planter Kits)',
    tagline: 'Full national collection + 2 wooden drainage stands & soil pods',
    price: 1499,
    originalPrice: 1850,
    badge: 'Best Value',
    description: 'Complete 6-can collector set with specialized plant starter seeds and brass drainage coaster to give every can a lush second life on your desk.',
    image: planterCanImg
  }
];
