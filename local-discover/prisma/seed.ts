import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const seedVendors = [
  {
    id: "sunnyside-farms",
    name: "Sunnyside Family Farms",
    tagline: "Three generations of organic goodness",
    story: "Founded in 1978 by James and Mary Carter, Sunnyside Family Farms has been feeding the Atlanta community for over four decades. What started as a five-acre plot in South Fulton has grown into a 60-acre certified organic farm. Today, their granddaughter Aisha carries on the tradition, growing 40+ varieties of heirloom vegetables and raising free-range poultry.",
    category: "farmers-market",
    tags: ["black-owned", "family-farmers", "organic", "sustainable"],
    address: "2847 Cascade Rd SW", city: "Atlanta", state: "GA", zip: "30311",
    lat: 33.732, lng: -84.412,
    phone: "(404) 555-0127", email: "hello@sunnysidefarms.com",
    website: "https://sunnysidefarms.com", instagram: "@sunnysidefarms",
    featured: true, verified: true,
    hours: { Monday: { open: "8:00 AM", close: "2:00 PM" }, Tuesday: { open: "8:00 AM", close: "2:00 PM" }, Wednesday: { open: "8:00 AM", close: "2:00 PM" }, Thursday: { open: "8:00 AM", close: "2:00 PM" }, Friday: { open: "8:00 AM", close: "2:00 PM" }, Saturday: { open: "7:00 AM", close: "3:00 PM" }, Sunday: { closed: true, open: "", close: "" } },
    photos: [], products: [
      { id: "p1", name: "Heirloom Tomato Box", description: "A curated mix of 6+ heirloom varieties, picked fresh", price: "$12/bushel", imageUrl: "", category: "Produce" },
      { id: "p2", name: "Free-Range Eggs", description: "Pasture-raised, deep orange yolks", price: "$6/dozen", imageUrl: "", category: "Dairy & Eggs" },
      { id: "p3", name: "Seasonal Greens Bundle", description: "Collards, kale, and mustard greens", price: "$8/bundle", imageUrl: "", category: "Produce" },
    ],
  },
  {
    id: "heritage-honey",
    name: "Heritage Honey Co.",
    tagline: "Small-batch honey from Atlanta's backyard beekeepers",
    story: "Heritage Honey Co. was born from a simple backyard hobby that turned into a neighborhood movement. Marcus and Devonte started keeping bees on their East Atlanta porches in 2019, and now they coordinate a network of 15 urban beekeepers across Atlanta.",
    category: "food-producer",
    tags: ["black-owned", "sustainable", "handmade"],
    address: "1242 Hardee St NE", city: "Atlanta", state: "GA", zip: "30317",
    lat: 33.748, lng: -84.345,
    phone: "(404) 555-0289", email: "marcus@heritagehoney.co",
    website: "https://heritagehoney.co", instagram: "@heritagehoney",
    featured: false, verified: true,
    hours: { Monday: { open: "10:00 AM", close: "6:00 PM" }, Tuesday: { open: "10:00 AM", close: "6:00 PM" }, Wednesday: { open: "10:00 AM", close: "6:00 PM" }, Thursday: { open: "10:00 AM", close: "6:00 PM" }, Friday: { open: "10:00 AM", close: "7:00 PM" }, Saturday: { open: "9:00 AM", close: "5:00 PM" }, Sunday: { open: "11:00 AM", close: "4:00 PM" } },
    photos: [], products: [
      { id: "p5", name: "Grant Park Wildflower Honey", description: "Complex floral notes from native wildflowers", price: "$14/jar", imageUrl: "", category: "Honey" },
      { id: "p6", name: "Raw Comb Honey", description: "Unprocessed honeycomb, straight from the hive", price: "$18/box", imageUrl: "", category: "Honey" },
    ],
  },
  {
    id: "clay-and-soul",
    name: "Clay & Soul Ceramics",
    tagline: "Handcrafted pottery with a Southern soul",
    story: "Maria Gonzalez-Guerrero discovered pottery during a difficult season of grief and found it became her meditation and her joy. After apprenticing with master potters in Oaxaca and studying at SCAD, she opened Clay & Soul in 2022.",
    category: "artisan",
    tags: ["latine-owned", "women-owned", "handmade"],
    address: "688 Krog St NE", city: "Atlanta", state: "GA", zip: "30318",
    lat: 33.772, lng: -84.365,
    phone: "(404) 555-0412", email: "maria@clayandsoul.com",
    instagram: "@clayandsoul_atl",
    featured: true, verified: true,
    hours: { Monday: { closed: true, open: "", close: "" }, Tuesday: { open: "11:00 AM", close: "6:00 PM" }, Wednesday: { open: "11:00 AM", close: "6:00 PM" }, Thursday: { open: "11:00 AM", close: "7:00 PM" }, Friday: { open: "11:00 AM", close: "7:00 PM" }, Saturday: { open: "10:00 AM", close: "6:00 PM" }, Sunday: { open: "12:00 PM", close: "5:00 PM" } },
    photos: [], products: [
      { id: "p8", name: "Georgia Red Clay Bowl Set", description: "Set of 4 bowls in earthy tones", price: "$68/set", imageUrl: "", category: "Ceramics" },
      { id: "p9", name: "Wildflower Vase", description: "Tall vase with natural glaze", price: "$45/each", imageUrl: "", category: "Ceramics" },
    ],
  },
  {
    id: "sweet-magnolia-bakery",
    name: "Sweet Magnolia Bakehouse",
    tagline: "Soul-food desserts with a modern twist",
    story: "Denise Williams started baking her grandmother's recipes for neighborhood potlucks, and the demand got so big she turned her home kitchen into a licensed bakery in 2021.",
    category: "food-producer",
    tags: ["black-owned", "women-owned", "family-farmers"],
    address: "2156 Phm Rd NW", city: "Atlanta", state: "GA", zip: "30318",
    lat: 33.788, lng: -84.405,
    phone: "(404) 555-0356", email: "denise@sweetmagnolia.bakery",
    instagram: "@sweetmagnolia_atl",
    featured: false, verified: true,
    hours: { Monday: { open: "7:00 AM", close: "3:00 PM" }, Tuesday: { open: "7:00 AM", close: "3:00 PM" }, Wednesday: { open: "7:00 AM", close: "3:00 PM" }, Thursday: { open: "7:00 AM", close: "3:00 PM" }, Friday: { open: "7:00 AM", close: "5:00 PM" }, Saturday: { open: "8:00 AM", close: "4:00 PM" }, Sunday: { open: "9:00 AM", close: "2:00 PM" } },
    photos: [], products: [
      { id: "p11", name: "Mississippi Mud Pie", description: "Rich chocolate, toasted marshmallow, graham crust", price: "$8/slice", imageUrl: "", category: "Desserts" },
      { id: "p12", name: "Banana Pudding", description: "Nilla wafers, fresh bananas, vanilla custard", price: "$6/cup", imageUrl: "", category: "Desserts" },
    ],
  },
  {
    id: "river-city-vintage",
    name: "River City Vintage",
    tagline: "Curated vintage finds from the banks of the Cumberland",
    story: "What began as a weekend hobby of hunting for treasures at estate sales and flea markets became Jordan Kim's full-time passion. River City Vintage is a carefully curated collection of mid-century furniture, antique clothing, and one-of-a-kind home décor pieces.",
    category: "retail",
    tags: ["asian-owned", "sustainable", "vintage"],
    address: "1108 Gallatin Ave", city: "Nashville", state: "TN", zip: "37206",
    lat: 36.178, lng: -86.752,
    phone: "(615) 555-0198", email: "jordan@rivercityvintage.com",
    website: "https://rivercityvintage.com", instagram: "@rivercityvintage",
    featured: false, verified: true,
    hours: { Monday: { closed: true, open: "", close: "" }, Tuesday: { open: "11:00 AM", close: "6:00 PM" }, Wednesday: { open: "11:00 AM", close: "6:00 PM" }, Thursday: { open: "11:00 AM", close: "7:00 PM" }, Friday: { open: "11:00 AM", close: "7:00 PM" }, Saturday: { open: "10:00 AM", close: "6:00 PM" }, Sunday: { open: "12:00 PM", close: "5:00 PM" } },
    photos: [], products: [
      { id: "p14", name: "Mid-Century Teak Sideboard", description: "Danish modern, circa 1965, refinished", price: "$850", imageUrl: "", category: "Furniture" },
      { id: "p15", name: "Vintage Western Wear Bundle", description: "Curated selection of 70s-90s western shirts", price: "$45/each", imageUrl: "", category: "Clothing" },
    ],
  },
  {
    id: "bayou-herbs",
    name: "Bayou Herbs & Remedies",
    tagline: "Traditional herbal wellness from the bayou",
    story: "For three generations, the Thibodaux family has cultivated medicinal herbs in the rich Louisiana soil. Bayou Herbs & Remedies carries forward the Creole and Cajun herbal traditions that have sustained Gulf Coast communities for centuries.",
    category: "wellness",
    tags: ["indigenous-owned", "organic", "sustainable", "handmade"],
    address: "3200 Chartres St", city: "New Orleans", state: "LA", zip: "70117",
    lat: 29.968, lng: -90.058,
    phone: "(504) 555-0234", email: "info@bayouherbs.com",
    instagram: "@bayouherbsandremedies",
    featured: true, verified: true,
    hours: { Monday: { open: "9:00 AM", close: "5:00 PM" }, Tuesday: { open: "9:00 AM", close: "5:00 PM" }, Wednesday: { open: "9:00 AM", close: "5:00 PM" }, Thursday: { open: "9:00 AM", close: "5:00 PM" }, Friday: { open: "9:00 AM", close: "6:00 PM" }, Saturday: { open: "10:00 AM", close: "4:00 PM" }, Sunday: { closed: true, open: "", close: "" } },
    photos: [], products: [
      { id: "p17", name: "Elderberry Immunity Syrup", description: "Organic elderberry with local honey and spices", price: "$18/bottle", imageUrl: "", category: "Wellness" },
      { id: "p18", name: "Bayou Calm Tea Blend", description: "Chamomile, lemon balm, and passionflower", price: "$12/tin", imageUrl: "", category: "Tea" },
    ],
  },
  {
    id: "queen-city-milling",
    name: "Queen City Milling Co.",
    tagline: "Stone-ground flours from heritage grains",
    story: "Queen City Milling revives the nearly lost art of stone-milling. Founded by Tomás and Elena Reyes in Charlotte's historic South End, they source heritage grains from family farms across the Carolinas and mill them fresh weekly.",
    category: "food-producer",
    tags: ["latine-owned", "cooperative", "sustainable"],
    address: "1420 S Tryon St", city: "Charlotte", state: "NC", zip: "28203",
    lat: 35.215, lng: -80.857,
    phone: "(704) 555-0421", email: "tomas@queencitymilling.com",
    website: "https://queencitymilling.com", instagram: "@queencitymilling",
    featured: false, verified: true,
    hours: { Monday: { open: "8:00 AM", close: "4:00 PM" }, Tuesday: { open: "8:00 AM", close: "4:00 PM" }, Wednesday: { open: "8:00 AM", close: "4:00 PM" }, Thursday: { open: "8:00 AM", close: "4:00 PM" }, Friday: { open: "8:00 AM", close: "4:00 PM" }, Saturday: { open: "9:00 AM", close: "2:00 PM" }, Sunday: { closed: true, open: "", close: "" } },
    photos: [], products: [
      { id: "p20", name: "Heritage Wheat Flour", description: "Soft red winter wheat, stone-ground", price: "$9/2lb", imageUrl: "", category: "Flour" },
      { id: "p21", name: "Blue Cornmeal", description: "Ancestral blue corn, stone-ground", price: "$11/2lb", imageUrl: "", category: "Flour" },
    ],
  },
  {
    id: "forge-and-flora",
    name: "Forge & Flora",
    tagline: "Hand-forged botanicals — art meets nature",
    story: "Sarah Chen brings together two lifelong passions: metalwork and gardening. After studying metallurgy at Georgia Tech and apprenticing with a Japanese metalsmith, she returned to Birmingham to create Forge & Flora.",
    category: "maker",
    tags: ["women-owned", "asian-owned", "sustainable", "handmade"],
    address: "4310 2nd Ave N", city: "Birmingham", state: "AL", zip: "35222",
    lat: 33.519, lng: -86.805,
    phone: "(205) 555-0178", email: "sarah@forgeandflora.com",
    instagram: "@forgeandflora_bham",
    featured: false, verified: true,
    hours: { Monday: { closed: true, open: "", close: "" }, Tuesday: { open: "10:00 AM", close: "5:00 PM" }, Wednesday: { open: "10:00 AM", close: "5:00 PM" }, Thursday: { open: "10:00 AM", close: "6:00 PM" }, Friday: { open: "10:00 AM", close: "6:00 PM" }, Saturday: { open: "10:00 AM", close: "4:00 PM" }, Sunday: { closed: true, open: "", close: "" } },
    photos: [], products: [
      { id: "p23", name: "Copper Leaf Planter", description: "Hand-hammered with natural verdigris patina", price: "$95/each", imageUrl: "", category: "Garden" },
      { id: "p24", name: "Steel Botanical Earrings", description: "Forged leaf shapes with copper accents", price: "$48/pair", imageUrl: "", category: "Jewelry" },
    ],
  },
  {
    id: "delta-cotton-collective",
    name: "Delta Cotton Collective",
    tagline: "Community-grown textiles from the Mississippi Delta",
    story: "Delta Cotton Collective is a cooperative of three Black-owned cotton farms and a small textile studio in the heart of the Mississippi Delta. They grow organic cotton using traditional methods, then spin and weave it into blankets, scarves, and home textiles.",
    category: "maker",
    tags: ["black-owned", "cooperative", "sustainable", "handmade", "organic"],
    address: "415 Delta Ave", city: "Memphis", state: "TN", zip: "38106",
    lat: 35.128, lng: -90.035,
    phone: "(901) 555-0312", email: "collective@deltacotton.com",
    website: "https://deltacotton.com", instagram: "@deltacottoncollective",
    featured: true, verified: true,
    hours: { Monday: { open: "10:00 AM", close: "5:00 PM" }, Tuesday: { open: "10:00 AM", close: "5:00 PM" }, Wednesday: { open: "10:00 AM", close: "5:00 PM" }, Thursday: { open: "10:00 AM", close: "5:00 PM" }, Friday: { open: "10:00 AM", close: "5:00 PM" }, Saturday: { open: "10:00 AM", close: "4:00 PM" }, Sunday: { closed: true, open: "", close: "" } },
    photos: [], products: [
      { id: "p26", name: "Delta Cotton Throw Blanket", description: "Hand-woven, undyed organic cotton", price: "$145/each", imageUrl: "", category: "Textiles" },
      { id: "p27", name: "Cotton Scarf", description: "Lightweight hand-spun cotton, natural dyes", price: "$55/each", imageUrl: "", category: "Textiles" },
    ],
  },
  {
    id: "peachtree-cleans",
    name: "Peachtree Clean Co.",
    tagline: "Plant-based cleaning products, Atlanta-made",
    story: "After her daughter was diagnosed with asthma, Keisha Robinson started making her own cleaning products from simple, natural ingredients. Friends and neighbors couldn't stop asking for more.",
    category: "retail",
    tags: ["black-owned", "women-owned", "sustainable"],
    address: "1049 College St NW", city: "Atlanta", state: "GA", zip: "30314",
    lat: 33.755, lng: -84.414,
    phone: "(404) 555-0503", email: "keisha@peachtreecleanco.com",
    website: "https://peachtreecleanco.com", instagram: "@peachtreeclean",
    featured: false, verified: true,
    hours: { Monday: { open: "9:00 AM", close: "5:00 PM" }, Tuesday: { open: "9:00 AM", close: "5:00 PM" }, Wednesday: { open: "9:00 AM", close: "5:00 PM" }, Thursday: { open: "9:00 AM", close: "5:00 PM" }, Friday: { open: "9:00 AM", close: "5:00 PM" }, Saturday: { open: "10:00 AM", close: "3:00 PM" }, Sunday: { closed: true, open: "", close: "" } },
    photos: [], products: [
      { id: "p29", name: "All-Purpose Clean Spray", description: "Lavender and tea tree, 16oz", price: "$10/bottle", imageUrl: "", category: "Home" },
      { id: "p30", name: "Laundry Detergent", description: "Unscented, gentle on sensitive skin, 32oz", price: "$14/bottle", imageUrl: "", category: "Home" },
    ],
  },
  {
    id: "savannah-tide",
    name: "Savannah Tide Provisions",
    tagline: "Coastal pantry goods from the lowcountry",
    story: "Savannah Tide Provisions captures the flavors of the Georgia coast in a jar. Chef Samir Patel left a career in fine dining to focus on preserving and pickling — using family recipes that blend Indian spice traditions with lowcountry ingredients.",
    category: "food-producer",
    tags: ["asian-owned", "sustainable", "organic"],
    address: "309 Bull St", city: "Savannah", state: "GA", zip: "31401",
    lat: 32.074, lng: -81.095,
    phone: "(912) 555-0267", email: "samir@savannahtide.com",
    instagram: "@savannahtide",
    featured: false, verified: true,
    hours: { Monday: { open: "10:00 AM", close: "4:00 PM" }, Tuesday: { open: "10:00 AM", close: "4:00 PM" }, Wednesday: { open: "10:00 AM", close: "4:00 PM" }, Thursday: { open: "10:00 AM", close: "4:00 PM" }, Friday: { open: "10:00 AM", close: "5:00 PM" }, Saturday: { open: "9:00 AM", close: "3:00 PM" }, Sunday: { closed: true, open: "", close: "" } },
    photos: [], products: [
      { id: "p32", name: "Lowcountry Chow Chow", description: "Sweet and tangy green tomato relish", price: "$9/jar", imageUrl: "", category: "Preserves" },
      { id: "p33", name: "Shrimp Pickle", description: "Gulf shrimp in mustard-spice brine", price: "$14/jar", imageUrl: "", category: "Preserves" },
    ],
  },
  {
    id: "bull-city-threads",
    name: "Bull City Threads",
    tagline: "Sustainable streetwear with a Durham story",
    story: "Bull City Threads is what happens when a community comes together to create. Founded by Marcus and Deja Williams, this Durham-born streetwear brand uses deadstock and organic fabrics to produce limited-run collections.",
    category: "retail",
    tags: ["black-owned", "sustainable", "handmade"],
    address: "722 Rigsbee St", city: "Durham", state: "NC", zip: "27701",
    lat: 35.995, lng: -78.892,
    phone: "(919) 555-0189", email: "hello@bullcitythreads.com",
    website: "https://bullcitythreads.com", instagram: "@bullcitythreads",
    featured: false, verified: true,
    hours: { Monday: { closed: true, open: "", close: "" }, Tuesday: { open: "11:00 AM", close: "6:00 PM" }, Wednesday: { open: "11:00 AM", close: "6:00 PM" }, Thursday: { open: "11:00 AM", close: "7:00 PM" }, Friday: { open: "11:00 AM", close: "7:00 PM" }, Saturday: { open: "10:00 AM", close: "6:00 PM" }, Sunday: { open: "12:00 PM", close: "5:00 PM" } },
    photos: [], products: [
      { id: "p35", name: "Bull City Knowledge Tee", description: "Organic cotton, screen-printed locally", price: "$38/each", imageUrl: "", category: "Apparel" },
      { id: "p36", name: "Hand-Dyed Hoodie", description: "Indigo-dyed, deadstock fleece", price: "$75/each", imageUrl: "", category: "Apparel" },
    ],
  },
];

const seedReviews = [
  { id: "r1", vendorId: "sunnyside-farms", authorName: "Maria G.", rating: 5, text: "The heirloom tomatoes are incredible — best I've ever had.", response: { text: "Thank you so much, Maria!", date: "2025-08-16" } },
  { id: "r2", vendorId: "sunnyside-farms", authorName: "David R.", rating: 4, text: "Great produce and wonderful people.", response: null },
  { id: "r3", vendorId: "sunnyside-farms", authorName: "Keisha W.", rating: 5, text: "Three generations of love in every vegetable.", response: null },
  { id: "r4", vendorId: "heritage-honey", authorName: "James T.", rating: 5, text: "The hot honey is addictive!", response: { text: "James, that means the world to us!", date: "2025-08-02" } },
  { id: "r5", vendorId: "heritage-honey", authorName: "Sarah L.", rating: 4, text: "Beautiful honey, great story.", response: null },
  { id: "r6", vendorId: "clay-and-soul", authorName: "Jennifer M.", rating: 5, text: "Maria's pottery is stunning.", response: { text: "Thank you for supporting handmade.", date: "2025-08-11" } },
  { id: "r7", vendorId: "clay-and-soul", authorName: "Alex K.", rating: 5, text: "Took a pottery class here and it changed my life.", response: null },
  { id: "r8", vendorId: "sweet-magnolia-bakery", authorName: "Tanya B.", rating: 5, text: "This banana pudding is EXACTLY like my grandmother used to make.", response: { text: "This is why I do what I do.", date: "2025-08-06" } },
  { id: "r9", vendorId: "sweet-magnolia-bakery", authorName: "Chris P.", rating: 4, text: "The Mississippi Mud Pie is unreal.", response: null },
  { id: "r10", vendorId: "river-city-vintage", authorName: "Patricia N.", rating: 5, text: "Jordan has the best eye for vintage finds.", response: null },
  { id: "r11", vendorId: "river-city-vintage", authorName: "Marcus W.", rating: 4, text: "Great selection of vintage clothing.", response: null },
  { id: "r12", vendorId: "bayou-herbs", authorName: "Catherine D.", rating: 5, text: "The elderberry syrup has become a staple in our house.", response: { text: "We're so glad the syrup helps your family!", date: "2025-08-09" } },
  { id: "r13", vendorId: "bayou-herbs", authorName: "Robert J.", rating: 5, text: "The Bayou Calm Tea Blend is genuinely calming.", response: null },
  { id: "r14", vendorId: "queen-city-milling", authorName: "Laura S.", rating: 5, text: "Switching to their stone-ground flour changed everything.", response: null },
  { id: "r15", vendorId: "queen-city-milling", authorName: "Mike T.", rating: 4, text: "Great flour, love the cooperative model.", response: null },
  { id: "r16", vendorId: "forge-and-flora", authorName: "Diana K.", rating: 5, text: "Sarah's copper planters are works of art.", response: null },
  { id: "r17", vendorId: "forge-and-flora", authorName: "Tom H.", rating: 5, text: "The botanical earrings are my wife's favorite jewelry.", response: null },
  { id: "r18", vendorId: "delta-cotton-collective", authorName: "Angela R.", rating: 5, text: "The throw blanket is the softest, most beautiful thing I own.", response: { text: "Thank you for supporting our cooperative!", date: "2025-08-12" } },
  { id: "r19", vendorId: "delta-cotton-collective", authorName: "Patricia M.", rating: 4, text: "Beautiful textiles with an incredible story.", response: null },
  { id: "r20", vendorId: "peachtree-cleans", authorName: "Michelle L.", rating: 5, text: "Finally a cleaning product that doesn't trigger my allergies!", response: null },
  { id: "r21", vendorId: "peachtree-cleans", authorName: "Derek W.", rating: 4, text: "Good plant-based cleaning products.", response: null },
  { id: "r22", vendorId: "savannah-tide", authorName: "Laura C.", rating: 5, text: "The shrimp pickle is unlike anything I've ever tasted.", response: { text: "You're our most loyal customer!", date: "2025-08-10" } },
  { id: "r23", vendorId: "savannah-tide", authorName: "Robert A.", rating: 5, text: "The chow chow relish brought me back to my grandmother's kitchen.", response: null },
  { id: "r24", vendorId: "bull-city-threads", authorName: "Jamal P.", rating: 5, text: "The Knowledge Tee is my go-to conversation starter.", response: null },
  { id: "r25", vendorId: "bull-city-threads", authorName: "Ashley M.", rating: 4, text: "Love the concept and the clothes.", response: null },
];

async function main() {
  console.log("Seeding database...");

  // Create demo user
  const hashed = await bcrypt.hash("demo123", 12);
  const demoUser = await prisma.user.upsert({
    where: { email: "demo@localdiscover.com" },
    update: {},
    create: {
      name: "Demo User",
      email: "demo@localdiscover.com",
      password: hashed,
      role: "BUSINESS",
    },
  });
  console.log(`  User: ${demoUser.name}`);

  // Seed vendors
  for (const v of seedVendors) {
    const vendorData = {
      name: v.name,
      tagline: v.tagline,
      story: v.story,
      category: v.category,
      tags: v.tags,
      address: v.address,
      city: v.city,
      state: v.state,
      zip: v.zip,
      lat: v.lat,
      lng: v.lng,
      phone: v.phone,
      email: v.email,
      website: v.website || null,
      instagram: v.instagram || null,
      hours: v.hours,
      photos: v.photos,
      products: v.products,
      featured: v.featured,
      verified: v.verified,
      ownerId: demoUser.id,
    };
    await prisma.vendor.upsert({
      where: { id: v.id },
      update: vendorData,
      create: { id: v.id, ...vendorData },
    });
    console.log(`  Vendor: ${v.name}`);
  }

  // Seed reviews
  for (const r of seedReviews) {
    await prisma.review.upsert({
      where: { id: r.id },
      update: {
        authorName: r.authorName,
        rating: r.rating,
        text: r.text,
        response: r.response as any,
      },
      create: {
        id: r.id,
        vendorId: r.vendorId,
        authorId: demoUser.id,
        authorName: r.authorName,
        rating: r.rating,
        text: r.text,
        response: r.response as any,
      },
    });
    console.log(`  Review: ${r.id}`);
  }

  console.log("Seed complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
