export interface Review {
  id: string;
  vendorId: string;
  authorName: string;
  rating: number;
  text: string;
  date: string;
  response?: {
    text: string;
    date: string;
  };
}

export const reviews: Review[] = [
  // Sunnyside Family Farms
  {
    id: "r1",
    vendorId: "sunnyside-farms",
    authorName: "Maria G.",
    rating: 5,
    text: "The heirloom tomatoes are incredible — best I've ever had. Aisha is so passionate about what she does and you can taste it in every bite. Saturday mornings at their market stand are a highlight of my week.",
    date: "2025-08-15",
    response: {
      text: "Thank you so much, Maria! We love seeing you every Saturday. The Cherokee Purples should be ready next week — save you a basket!",
      date: "2025-08-16",
    },
  },
  {
    id: "r2",
    vendorId: "sunnyside-farms",
    authorName: "David R.",
    rating: 4,
    text: "Great produce and wonderful people. Only reason for 4 stars is they sometimes sell out early on Saturdays. Get there by 8am if you want the good stuff.",
    date: "2025-07-22",
  },
  {
    id: "r3",
    vendorId: "sunnyside-farms",
    authorName: "Keisha W.",
    rating: 5,
    text: "Three generations of love in every vegetable. The collard greens bundle is a staple in our house. Supporting Black-owned farms matters.",
    date: "2025-06-10",
  },

  // Heritage Honey Co.
  {
    id: "r4",
    vendorId: "heritage-honey",
    authorName: "James T.",
    rating: 5,
    text: "The hot honey is addictive! I put it on everything now. Marcus really knows his stuff — he gave me a 20-minute lesson on bees when I visited. This is what local business is all about.",
    date: "2025-08-01",
    response: {
      text: "James, that means the world to us! Come by the East Atlanta market next Saturday — we're debuting a new jalapeño-infused batch.",
      date: "2025-08-02",
    },
  },
  {
    id: "r5",
    vendorId: "heritage-honey",
    authorName: "Sarah L.",
    rating: 4,
    text: "Beautiful honey, great story. The packaging is lovely too — makes a perfect gift. Only wish they had weekend hours that started earlier.",
    date: "2025-07-15",
  },

  // Clay & Soul Ceramics
  {
    id: "r6",
    vendorId: "clay-and-soul",
    authorName: "Jennifer M.",
    rating: 5,
    text: "Maria's pottery is stunning. I bought the Georgia Red Clay Bowl Set and they're now my everyday dishes. You can feel the craftsmanship in every piece. Her story is so inspiring too.",
    date: "2025-08-10",
    response: {
      text: "Jennifer, I'm so honored that my bowls are part of your daily rituals! That's exactly what I hope for when I create each piece. Thank you for supporting handmade.",
      date: "2025-08-11",
    },
  },
  {
    id: "r7",
    vendorId: "clay-and-soul",
    authorName: "Alex K.",
    rating: 5,
    text: "Took a pottery class here and it changed my life. Maria is patient, talented, and genuinely cares about her students. The studio is beautiful too.",
    date: "2025-07-20",
  },

  // Sweet Magnolia Bakehouse
  {
    id: "r8",
    vendorId: "sweet-magnolia-bakery",
    authorName: "Tanya B.",
    rating: 5,
    text: "This banana pudding is EXACTLY like my grandmother used to make. I literally cried the first time I tried it. Denise is a treasure to this community.",
    date: "2025-08-05",
    response: {
      text: "Tanya, this is why I do what I do. Your grandmother sounds like she was an amazing woman. Thank you for sharing this with me. 💛",
      date: "2025-08-06",
    },
  },
  {
    id: "r9",
    vendorId: "sweet-magnolia-bakery",
    authorName: "Chris P.",
    rating: 4,
    text: "The Mississippi Mud Pie is unreal. I ordered a whole one for my office birthday party and everyone was asking where it came from. Slightly pricey but worth every penny.",
    date: "2025-07-30",
  },

  // River City Vintage
  {
    id: "r10",
    vendorId: "river-city-vintage",
    authorName: "Patricia N.",
    rating: 5,
    text: "Jordan has the best eye for vintage finds. I found a 1960s Danish sideboard here for a fraction of what it would cost elsewhere. The whole shop feels curated, not cluttered.",
    date: "2025-08-12",
  },
  {
    id: "r11",
    vendorId: "river-city-vintage",
    authorName: "Marcus W.",
    rating: 4,
    text: "Great selection of vintage clothing. The western wear section is particularly good. Prices are fair for the quality. Would love to see more home goods.",
    date: "2025-07-25",
  },

  // Bayou Herbs & Remedies
  {
    id: "r12",
    vendorId: "bayou-herbs",
    authorName: "Catherine D.",
    rating: 5,
    text: "The elderberry syrup has become a staple in our house during cold season. Knowing it's made with traditional Creole recipes and organic herbs gives me total confidence. The Thibodaux family is wonderful.",
    date: "2025-08-08",
    response: {
      text: "Catherine, we're so glad the syrup helps your family! Our grandmother's recipe has been protecting Gulf Coast families for generations. Stay well!",
      date: "2025-08-09",
    },
  },
  {
    id: "r13",
    vendorId: "bayou-herbs",
    authorName: "Robert J.",
    rating: 5,
    text: "The Bayou Calm Tea Blend is genuinely calming. I drink it every night before bed. The quality difference compared to store-bought herbal tea is night and day.",
    date: "2025-07-18",
  },

  // Queen City Milling Co.
  {
    id: "r14",
    vendorId: "queen-city-milling",
    authorName: "Laura S.",
    rating: 5,
    text: "As a bread baker, switching to their stone-ground flour changed everything. The texture, the flavor, the rise — all better. Tomás is doing incredible work reviving heritage grains.",
    date: "2025-08-14",
  },
  {
    id: "r15",
    vendorId: "queen-city-milling",
    authorName: "Mike T.",
    rating: 4,
    text: "Great flour, love the cooperative model. The milling workshop was fascinating — learned so much about grain. Wish they had more distribution points around Charlotte.",
    date: "2025-07-28",
  },

  // Forge & Flora
  {
    id: "r16",
    vendorId: "forge-and-flora",
    authorName: "Diana K.",
    rating: 5,
    text: "Sarah's copper planters are works of art. I bought two for my garden and they've developed the most beautiful patina over the months. Each piece is truly one-of-a-kind.",
    date: "2025-08-03",
  },
  {
    id: "r17",
    vendorId: "forge-and-flora",
    authorName: "Tom H.",
    rating: 5,
    text: "The botanical earrings are my wife's favorite jewelry. The craftsmanship is exceptional — you can see the Japanese metalwork influence. Birmingham is lucky to have Sarah.",
    date: "2025-07-20",
  },

  // Delta Cotton Collective
  {
    id: "r18",
    vendorId: "delta-cotton-collective",
    authorName: "Angela R.",
    rating: 5,
    text: "The throw blanket is the softest, most beautiful thing I own. Knowing it was grown, spun, and woven entirely by this cooperative makes it even more special. This is ethical shopping done right.",
    date: "2025-08-11",
    response: {
      text: "Angela, thank you for supporting our cooperative! Every blanket supports 12 families in the Delta. We're so glad you love it.",
      date: "2025-08-12",
    },
  },
  {
    id: "r19",
    vendorId: "delta-cotton-collective",
    authorName: "Patricia M.",
    rating: 4,
    text: "Beautiful textiles with an incredible story. The napkin sets make wonderful wedding gifts. Shipping was a bit slow but the quality is worth the wait.",
    date: "2025-07-15",
  },

  // Peachtree Clean Co.
  {
    id: "r20",
    vendorId: "peachtree-cleans",
    authorName: "Michelle L.",
    rating: 5,
    text: "Finally a cleaning product that doesn't trigger my allergies! Keisha's lavender spray smells amazing and actually works. The starter kit is a great way to try everything.",
    date: "2025-08-07",
  },
  {
    id: "r21",
    vendorId: "peachtree-cleans",
    authorName: "Derek W.",
    rating: 4,
    text: "Good plant-based cleaning products. The all-purpose spray handles most things well. The laundry detergent is gentle but effective. Would love a dish soap option too.",
    date: "2025-07-22",
  },

  // Savannah Tide Provisions
  {
    id: "r22",
    vendorId: "savannah-tide",
    authorName: "Laura C.",
    rating: 5,
    text: "The shrimp pickle is unlike anything I've ever tasted. Samir's blend of Indian spices with lowcountry ingredients is genius. I buy 6 jars at a time to stock up.",
    date: "2025-08-09",
    response: {
      text: "Laura, you're our most loyal customer! We're working on a new shrimp pickle with Carolina Reaper — want to be our taste tester?",
      date: "2025-08-10",
    },
  },
  {
    id: "r23",
    vendorId: "savannah-tide",
    authorName: "Robert A.",
    rating: 5,
    text: "The chow chow relish brought me back to my grandmother's kitchen. Samir has captured something truly special here. Every jar tells a story of the lowcountry.",
    date: "2025-07-30",
  },

  // Bull City Threads
  {
    id: "r24",
    vendorId: "bull-city-threads",
    authorName: "Jamal P.",
    rating: 5,
    text: "The Knowledge Tee is my go-to conversation starter. People always ask about it. The quality of the screen printing is top-notch and the fact that it's made from deadstock fabric makes it even better.",
    date: "2025-08-13",
  },
  {
    id: "r25",
    vendorId: "bull-city-threads",
    authorName: "Ashley M.",
    rating: 4,
    text: "Love the concept and the clothes. The hand-dyed hoodie is gorgeous. Marcus and Deja are doing amazing things for the Durham community with their apprenticeship program.",
    date: "2025-07-28",
  },
];

export function getReviewsForVendor(vendorId: string): Review[] {
  return reviews.filter((r) => r.vendorId === vendorId);
}

export function getAverageRating(vendorId: string): number {
  const vendorReviews = getReviewsForVendor(vendorId);
  if (vendorReviews.length === 0) return 0;
  return vendorReviews.reduce((sum, r) => sum + r.rating, 0) / vendorReviews.length;
}

export function getReviewCount(vendorId: string): number {
  return getReviewsForVendor(vendorId).length;
}
