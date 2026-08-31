import { Vendor, City, BusinessCategory, BusinessTag } from "@/types";

export const cities: City[] = [
  { name: "Atlanta", state: "GA", lat: 33.749, lng: -84.388 },
  { name: "Nashville", state: "TN", lat: 36.1627, lng: -86.7816 },
  { name: "New Orleans", state: "LA", lat: 29.9511, lng: -90.0715 },
  { name: "Charlotte", state: "NC", lat: 35.2271, lng: -80.8431 },
  { name: "Memphis", state: "TN", lat: 35.1495, lng: -90.049 },
  { name: "Birmingham", state: "AL", lat: 33.5186, lng: -86.8104 },
  { name: "Savannah", state: "GA", lat: 32.0809, lng: -81.0912 },
  { name: "Durham", state: "NC", lat: 35.994, lng: -78.8986 },
];

export const categories: { value: BusinessCategory; label: string; icon: string }[] = [
  { value: "farmers-market", label: "Farmers & Growers", icon: "🌱" },
  { value: "food-producer", label: "Food & Beverage", icon: "🍳" },
  { value: "maker", label: "Makers & Crafters", icon: "🎨" },
  { value: "retail", label: "Independent Retail", icon: "🛍️" },
  { value: "services", label: "Local Services", icon: "🔧" },
  { value: "artisan", label: "Artisans", icon: "✨" },
  { value: "wellness", label: "Wellness", icon: "🧘" },
];

export const allTags: { value: BusinessTag; label: string }[] = [
  { value: "black-owned", label: "Black-Owned" },
  { value: "latine-owned", label: "Latine-Owned" },
  { value: "asian-owned", label: "Asian-Owned" },
  { value: "indigenous-owned", label: "Indigenous-Owned" },
  { value: "women-owned", label: "Women-Owned" },
  { value: "lgbtq-owned", label: "LGBTQ-Owned" },
  { value: "veteran-owned", label: "Veteran-Owned" },
  { value: "family-farmers", label: "Family Farmers" },
  { value: "organic", label: "Organic" },
  { value: "sustainable", label: "Sustainable" },
  { value: "handmade", label: "Handmade" },
  { value: "vintage", label: "Vintage" },
  { value: "cooperative", label: "Cooperative" },
];

export const vendors: Vendor[] = [
  {
    id: "sunnyside-farms",
    name: "Sunnyside Family Farms",
    tagline: "Three generations of organic goodness",
    story:
      "Founded in 1978 by James and Mary Carter, Sunnyside Family Farms has been feeding the Atlanta community for over four decades. What started as a five-acre plot in South Fulton has grown into a 60-acre certified organic farm. Today, their granddaughter Aisha carries on the tradition, growing 40+ varieties of heirloom vegetables and raising free-range poultry. Every Saturday morning, you'll find the Carter family at the Atlanta Farmers Market with crates of the freshest produce you've ever tasted.",
    category: "farmers-market",
    tags: ["black-owned", "family-farmers", "organic", "sustainable"],
    address: "2847 Cascade Rd SW",
    city: "Atlanta",
    state: "GA",
    zip: "30311",
    lat: 33.732,
    lng: -84.412,
    phone: "(404) 555-0127",
    email: "hello@sunnysidefarms.com",
    website: "https://sunnysidefarms.com",
    instagram: "@sunnysidefarms",
    hours: {
      Monday: { open: "8:00 AM", close: "2:00 PM" },
      Tuesday: { open: "8:00 AM", close: "2:00 PM" },
      Wednesday: { open: "8:00 AM", close: "2:00 PM" },
      Thursday: { open: "8:00 AM", close: "2:00 PM" },
      Friday: { open: "8:00 AM", close: "2:00 PM" },
      Saturday: { open: "7:00 AM", close: "3:00 PM" },
      Sunday: { closed: true, open: "", close: "" },
    },
    photos: [
      { url: "/placeholder-farm-1.jpg", alt: "Rows of organic vegetables", caption: "Our heirloom tomato rows in peak summer" },
      { url: "/placeholder-farm-2.jpg", alt: "Farmers market stand", caption: "Our Saturday market setup" },
      { url: "/placeholder-farm-3.jpg", alt: "Family portrait on the farm", caption: "The Carter family, three generations strong" },
    ],
    products: [
      { id: "p1", name: "Heirloom Tomato Box", description: "A curated mix of 6+ heirloom varieties, picked fresh", price: "$12/bushel", imageUrl: "/placeholder-product.jpg", category: "Produce" },
      { id: "p2", name: "Free-Range Eggs", description: "Pasture-raised, deep orange yolks", price: "$6/dozen", imageUrl: "/placeholder-product.jpg", category: "Dairy & Eggs" },
      { id: "p3", name: "Seasonal Greens Bundle", description: "Collards, kale, and mustard greens", price: "$8/bundle", imageUrl: "/placeholder-product.jpg", category: "Produce" },
      { id: "p4", name: "Fresh Herb Sampler", description: "Basil, thyme, rosemary, and mint", price: "$5/bundle", imageUrl: "/placeholder-product.jpg", category: "Produce" },
    ],
    featured: true,
    verified: true,
    joinedDate: "2024-03-15",
  },
  {
    id: "heritage-honey",
    name: "Heritage Honey Co.",
    tagline: "Small-batch honey from Atlanta's backyard beekeepers",
    story:
      "Heritage Honey Co. was born from a simple backyard hobby that turned into a neighborhood movement. Marcus and Devonte started keeping bees on their East Atlanta porches in 2019, and now they coordinate a network of 15 urban beekeepers across Atlanta. Each jar tells the story of the neighborhood where it was made — from the wildflower blends of Grant Park to the clover honey of East Lake. They're on a mission to make Atlanta the bee-friendliest city in the South.",
    category: "food-producer",
    tags: ["black-owned", "sustainable", "handmade"],
    address: "1242 Hardee St NE",
    city: "Atlanta",
    state: "GA",
    zip: "30317",
    lat: 33.748,
    lng: -84.345,
    phone: "(404) 555-0289",
    email: "marcus@heritagehoney.co",
    website: "https://heritagehoney.co",
    instagram: "@heritagehoney",
    hours: {
      Monday: { open: "10:00 AM", close: "6:00 PM" },
      Tuesday: { open: "10:00 AM", close: "6:00 PM" },
      Wednesday: { open: "10:00 AM", close: "6:00 PM" },
      Thursday: { open: "10:00 AM", close: "6:00 PM" },
      Friday: { open: "10:00 AM", close: "7:00 PM" },
      Saturday: { open: "9:00 AM", close: "5:00 PM" },
      Sunday: { open: "11:00 AM", close: "4:00 PM" },
    },
    photos: [
      { url: "/placeholder-honey-1.jpg", alt: "Honey jars on shelf", caption: "Our neighborhood collection" },
      { url: "/placeholder-honey-2.jpg", alt: "Urban beehive", caption: "One of our 15 urban apiaries" },
    ],
    products: [
      { id: "p5", name: "Grant Park Wildflower Honey", description: "Complex floral notes from native wildflowers", price: "$14/jar", imageUrl: "/placeholder-product.jpg", category: "Honey" },
      { id: "p6", name: "Raw Comb Honey", description: "Unprocessed honeycomb, straight from the hive", price: "$18/box", imageUrl: "/placeholder-product.jpg", category: "Honey" },
      { id: "p7", name: "Hot Honey", description: "Local honey infused with Georgia-grown peppers", price: "$16/jar", imageUrl: "/placeholder-product.jpg", category: "Specialty" },
    ],
    featured: false,
    verified: true,
    joinedDate: "2024-06-01",
  },
  {
    id: "clay-and-soul",
    name: "Clay & Soul Ceramics",
    tagline: "Handcrafted pottery with a Southern soul",
    story:
      "Maria Gonzalez-Guerrero discovered pottery during a difficult season of grief and found it became her meditation and her joy. After apprenticing with master potters in Oaxaca and studying at SCAD, she opened Clay & Soul in 2022. Every piece is wheel-thrown and glazed in her studio using locally sourced clay and natural pigments inspired by the Georgia landscape. Her work celebrates the intersection of her Mexican heritage and Southern roots.",
    category: "artisan",
    tags: ["latine-owned", "women-owned", "handmade"],
    address: "688 Krog St NE",
    city: "Atlanta",
    state: "GA",
    zip: "30318",
    lat: 33.772,
    lng: -84.365,
    phone: "(404) 555-0412",
    email: "maria@clayandsoul.com",
    instagram: "@clayandsoul_atl",
    hours: {
      Monday: { closed: true, open: "", close: "" },
      Tuesday: { open: "11:00 AM", close: "6:00 PM" },
      Wednesday: { open: "11:00 AM", close: "6:00 PM" },
      Thursday: { open: "11:00 AM", close: "7:00 PM" },
      Friday: { open: "11:00 AM", close: "7:00 PM" },
      Saturday: { open: "10:00 AM", close: "6:00 PM" },
      Sunday: { open: "12:00 PM", close: "5:00 PM" },
    },
    photos: [
      { url: "/placeholder-ceramics-1.jpg", alt: "Pottery studio", caption: "Our Krog Street studio" },
      { url: "/placeholder-ceramics-2.jpg", alt: "Handmade bowls", caption: "Georgia Red Clay collection" },
      { url: "/placeholder-ceramics-3.jpg", alt: "Potter at the wheel", caption: "Maria at work" },
    ],
    products: [
      { id: "p8", name: "Georgia Red Clay Bowl Set", description: "Set of 4 bowls in earthy tones", price: "$68/set", imageUrl: "/placeholder-product.jpg", category: "Ceramics" },
      { id: "p9", name: "Wildflower Vase", description: "Tall vase with natural glaze", price: "$45/each", imageUrl: "/placeholder-product.jpg", category: "Ceramics" },
      { id: "p10", name: "Coffee Mug Duo", description: "Hand-thrown mugs, perfect for morning rituals", price: "$36/pair", imageUrl: "/placeholder-product.jpg", category: "Ceramics" },
    ],
    featured: true,
    verified: true,
    joinedDate: "2024-01-20",
  },
  {
    id: "sweet-magnolia-bakery",
    name: "Sweet Magnolia Bakehouse",
    tagline: "Soul-food desserts with a modern twist",
    story:
      "Denise Williams started baking her grandmother's recipes for neighborhood potlucks, and the demand got so big she turned her home kitchen into a licensed bakery in 2021. Sweet Magnolia Bakehouse specializes in Mississippi Mud Pie, Banana Pudding, and seasonal fruit cobblers that taste like Sunday dinner at your favorite auntie's house. Every recipe is made from scratch with ingredients sourced from local farms whenever possible.",
    category: "food-producer",
    tags: ["black-owned", "women-owned", "family-farmers"],
    address: "2156 Phm Rd NW",
    city: "Atlanta",
    state: "GA",
    zip: "30318",
    lat: 33.788,
    lng: -84.405,
    phone: "(404) 555-0356",
    email: "denise@sweetmagnolia.bakery",
    instagram: "@sweetmagnolia_atl",
    hours: {
      Monday: { open: "7:00 AM", close: "3:00 PM" },
      Tuesday: { open: "7:00 AM", close: "3:00 PM" },
      Wednesday: { open: "7:00 AM", close: "3:00 PM" },
      Thursday: { open: "7:00 AM", close: "3:00 PM" },
      Friday: { open: "7:00 AM", close: "5:00 PM" },
      Saturday: { open: "8:00 AM", close: "4:00 PM" },
      Sunday: { open: "9:00 AM", close: "2:00 PM" },
    },
    photos: [
      { url: "/placeholder-bakery-1.jpg", alt: "Pastries on display", caption: "Morning fresh from the oven" },
      { url: "/placeholder-bakery-2.jpg", alt: "Baker at work", caption: "Denise perfecting her famous banana pudding" },
    ],
    products: [
      { id: "p11", name: "Mississippi Mud Pie", description: "Rich chocolate, toasted marshmallow, graham crust", price: "$8/slice", imageUrl: "/placeholder-product.jpg", category: "Desserts" },
      { id: "p12", name: "Banana Pudding", description: "Nilla wafers, fresh bananas, vanilla custard", price: "$6/cup", imageUrl: "/placeholder-product.jpg", category: "Desserts" },
      { id: "p13", name: "Seasonal Cobbler", description: "Peach in summer, apple in fall, sweet potato in winter", price: "$32/whole", imageUrl: "/placeholder-product.jpg", category: "Desserts" },
    ],
    featured: false,
    verified: true,
    joinedDate: "2024-04-10",
  },
  {
    id: "river-city-vintage",
    name: "River City Vintage",
    tagline: "Curated vintage finds from the banks of the Cumberland",
    story:
      "What began as a weekend hobby of hunting for treasures at estate sales and flea markets became Jordan Kim's full-time passion. River City Vintage is a carefully curated collection of mid-century furniture, antique clothing, and one-of-a-kind home décor pieces sourced from across Tennessee. Jordan has an eye for pieces with history and character, and every item in the shop tells a story of the Nashville area's rich past.",
    category: "retail",
    tags: ["asian-owned", "sustainable", "vintage"],
    address: "1108 Gallatin Ave",
    city: "Nashville",
    state: "TN",
    zip: "37206",
    lat: 36.178,
    lng: -86.752,
    phone: "(615) 555-0198",
    email: "jordan@rivercityvintage.com",
    website: "https://rivercityvintage.com",
    instagram: "@rivercityvintage",
    hours: {
      Monday: { closed: true, open: "", close: "" },
      Tuesday: { open: "11:00 AM", close: "6:00 PM" },
      Wednesday: { open: "11:00 AM", close: "6:00 PM" },
      Thursday: { open: "11:00 AM", close: "7:00 PM" },
      Friday: { open: "11:00 AM", close: "7:00 PM" },
      Saturday: { open: "10:00 AM", close: "6:00 PM" },
      Sunday: { open: "12:00 PM", close: "5:00 PM" },
    },
    photos: [
      { url: "/placeholder-vintage-1.jpg", alt: "Vintage furniture showroom", caption: "Our Gallatin Ave showroom" },
      { url: "/placeholder-vintage-2.jpg", alt: "Vintage clothing rack", caption: "Curated vintage clothing collection" },
    ],
    products: [
      { id: "p14", name: "Mid-Century Teak Sideboard", description: "Danish modern, circa 1965, refinished", price: "$850", imageUrl: "/placeholder-product.jpg", category: "Furniture" },
      { id: "p15", name: "Vintage Western Wear Bundle", description: "Curated selection of 70s-90s western shirts", price: "$45/each", imageUrl: "/placeholder-product.jpg", category: "Clothing" },
      { id: "p16", name: "Antique Mason Jars (Set of 6)", description: "Blue-tinted Tennessee-made canning jars", price: "$120/set", imageUrl: "/placeholder-product.jpg", category: "Home Décor" },
    ],
    featured: false,
    verified: true,
    joinedDate: "2024-02-14",
  },
  {
    id: "bayou-herbs",
    name: "Bayou Herbs & Remedies",
    tagline: "Traditional herbal wellness from the bayou",
    story:
      "For three generations, the Thibodaux family has cultivated medicinal herbs in the rich Louisiana soil. Bayou Herbs & Remedies carries forward the Creole and Cajun herbal traditions that have sustained Gulf Coast communities for centuries. From elderberry syrup to custom tea blends, every product is handcrafted using organic herbs grown on their 15-acre farm in Plaquemines Parish. They believe in the healing power of plants passed down through generations.",
    category: "wellness",
    tags: ["indigenous-owned", "organic", "sustainable", "handmade"],
    address: "3200 Chartres St",
    city: "New Orleans",
    state: "LA",
    zip: "70117",
    lat: 29.968,
    lng: -90.058,
    phone: "(504) 555-0234",
    email: "info@bayouherbs.com",
    instagram: "@bayouherbsandremedies",
    hours: {
      Monday: { open: "9:00 AM", close: "5:00 PM" },
      Tuesday: { open: "9:00 AM", close: "5:00 PM" },
      Wednesday: { open: "9:00 AM", close: "5:00 PM" },
      Thursday: { open: "9:00 AM", close: "5:00 PM" },
      Friday: { open: "9:00 AM", close: "6:00 PM" },
      Saturday: { open: "10:00 AM", close: "4:00 PM" },
      Sunday: { closed: true, open: "", close: "" },
    },
    photos: [
      { url: "/placeholder-herbs-1.jpg", alt: "Herbal remedies display", caption: "Our handcrafted wellness collection" },
      { url: "/placeholder-herbs-2.jpg", alt: "Herb garden", caption: "Organic herb gardens at our farm" },
    ],
    products: [
      { id: "p17", name: "Elderberry Immunity Syrup", description: "Organic elderberry with local honey and spices", price: "$18/bottle", imageUrl: "/placeholder-product.jpg", category: "Wellness" },
      { id: "p18", name: "Bayou Calm Tea Blend", description: "Chamomile, lemon balm, and passionflower", price: "$12/tin", imageUrl: "/placeholder-product.jpg", category: "Tea" },
      { id: "p19", name: "Herbal Bath Soak", description: "Magnolia, lavender, and rose petals", price: "$22/jar", imageUrl: "/placeholder-product.jpg", category: "Wellness" },
    ],
    featured: true,
    verified: true,
    joinedDate: "2024-05-22",
  },
  {
    id: "queen-city-milling",
    name: "Queen City Milling Co.",
    tagline: "Stone-ground flours from heritage grains",
    story:
      "Queen City Milling revives the nearly lost art of stone-milling. Founded by Tomás and Elena Reyes in Charlotte's historic South End, they source heritage grains from family farms across the Carolinas and mill them fresh weekly. Their stone-ground flours — from soft winter wheat to blue cornmeal — are what bread bakers and pastry chefs have been searching for. They also host monthly milling workshops to connect the community with where their flour comes from.",
    category: "food-producer",
    tags: ["latine-owned", "cooperative", "sustainable"],
    address: "1420 S Tryon St",
    city: "Charlotte",
    state: "NC",
    zip: "28203",
    lat: 35.215,
    lng: -80.857,
    phone: "(704) 555-0421",
    email: "tomas@queencitymilling.com",
    website: "https://queencitymilling.com",
    instagram: "@queencitymilling",
    hours: {
      Monday: { open: "8:00 AM", close: "4:00 PM" },
      Tuesday: { open: "8:00 AM", close: "4:00 PM" },
      Wednesday: { open: "8:00 AM", close: "4:00 PM" },
      Thursday: { open: "8:00 AM", close: "4:00 PM" },
      Friday: { open: "8:00 AM", close: "4:00 PM" },
      Saturday: { open: "9:00 AM", close: "2:00 PM" },
      Sunday: { closed: true, open: "", close: "" },
    },
    photos: [
      { url: "/placeholder-mill-1.jpg", alt: "Stone mill in action", caption: "Our 150-year-old French burr mill" },
      { url: "/placeholder-mill-2.jpg", alt: "Flour bags on shelves", caption: "Fresh-milled weekly" },
    ],
    products: [
      { id: "p20", name: "Heritage Wheat Flour", description: "Soft red winter wheat, stone-ground", price: "$9/2lb", imageUrl: "/placeholder-product.jpg", category: "Flour" },
      { id: "p21", name: "Blue Cornmeal", description: "Ancestral blue corn, stone-ground", price: "$11/2lb", imageUrl: "/placeholder-product.jpg", category: "Flour" },
      { id: "p22", name: "Baker's Mix", description: "Our signature blend for bread and pizza dough", price: "$10/3lb", imageUrl: "/placeholder-product.jpg", category: "Flour" },
    ],
    featured: false,
    verified: true,
    joinedDate: "2024-07-01",
  },
  {
    id: "forge-and-flora",
    name: "Forge & Flora",
    tagline: "Hand-forged botanicals — art meets nature",
    story:
      "Sarah Chen brings together two lifelong passions: metalwork and gardening. After studying metallurgy at Georgia Tech and apprenticing with a Japanese metalsmith, she returned to Birmingham to create Forge & Flora — a studio that produces hand-forged garden sculptures, planters, and botanical jewelry. Each piece is hammered from reclaimed steel and copper, then finished with patinas inspired by Alabama's native plants.",
    category: "maker",
    tags: ["women-owned", "asian-owned", "sustainable", "handmade"],
    address: "4310 2nd Ave N",
    city: "Birmingham",
    state: "AL",
    zip: "35222",
    lat: 33.519,
    lng: -86.805,
    phone: "(205) 555-0178",
    email: "sarah@forgeandflora.com",
    instagram: "@forgeandflora_bham",
    hours: {
      Monday: { closed: true, open: "", close: "" },
      Tuesday: { open: "10:00 AM", close: "5:00 PM" },
      Wednesday: { open: "10:00 AM", close: "5:00 PM" },
      Thursday: { open: "10:00 AM", close: "6:00 PM" },
      Friday: { open: "10:00 AM", close: "6:00 PM" },
      Saturday: { open: "10:00 AM", close: "4:00 PM" },
      Sunday: { closed: true, open: "", close: "" },
    },
    photos: [
      { url: "/placeholder-forge-1.jpg", alt: "Metal garden sculpture", caption: "Reclaimed steel garden art" },
      { url: "/placeholder-forge-2.jpg", alt: "Artisan at the forge", caption: "Sarah hand-forging a copper planter" },
    ],
    products: [
      { id: "p23", name: "Copper Leaf Planter", description: "Hand-hammered with natural verdigris patina", price: "$95/each", imageUrl: "/placeholder-product.jpg", category: "Garden" },
      { id: "p24", name: "Steel Botanical Earrings", description: "Forged leaf shapes with copper accents", price: "$48/pair", imageUrl: "/placeholder-product.jpg", category: "Jewelry" },
      { id: "p25", name: "Garden Trellis", description: "Twisting vine design, powder-coated steel", price: "$210", imageUrl: "/placeholder-product.jpg", category: "Garden" },
    ],
    featured: false,
    verified: true,
    joinedDate: "2024-04-18",
  },
  {
    id: "delta-cotton-collective",
    name: "Delta Cotton Collective",
    tagline: "Community-grown textiles from the Mississippi Delta",
    story:
      "Delta Cotton Collective is a cooperative of three Black-owned cotton farms and a small textile studio in the heart of the Mississippi Delta. They grow organic cotton using traditional methods, then spin and weave it into blankets, scarves, and home textiles entirely within their community. Founded by the Henderson family in 2020, the collective supports 12 families and keeps textile production rooted in the land where it started.",
    category: "maker",
    tags: ["black-owned", "cooperative", "sustainable", "handmade", "organic"],
    address: "415 Delta Ave",
    city: "Memphis",
    state: "TN",
    zip: "38106",
    lat: 35.128,
    lng: -90.035,
    phone: "(901) 555-0312",
    email: "collective@deltacotton.com",
    website: "https://deltacotton.com",
    instagram: "@deltacottoncollective",
    hours: {
      Monday: { open: "10:00 AM", close: "5:00 PM" },
      Tuesday: { open: "10:00 AM", close: "5:00 PM" },
      Wednesday: { open: "10:00 AM", close: "5:00 PM" },
      Thursday: { open: "10:00 AM", close: "5:00 PM" },
      Friday: { open: "10:00 AM", close: "5:00 PM" },
      Saturday: { open: "10:00 AM", close: "4:00 PM" },
      Sunday: { closed: true, open: "", close: "" },
    },
    photos: [
      { url: "/placeholder-cotton-1.jpg", alt: "Cotton field at sunrise", caption: "Our organic cotton fields" },
      { url: "/placeholder-cotton-2.jpg", alt: "Hand-woven blankets", caption: "Handwoven on our community looms" },
    ],
    products: [
      { id: "p26", name: "Delta Cotton Throw Blanket", description: "Hand-woven, undyed organic cotton", price: "$145/each", imageUrl: "/placeholder-product.jpg", category: "Textiles" },
      { id: "p27", name: "Cotton Scarf", description: "Lightweight hand-spun cotton, natural dyes", price: "$55/each", imageUrl: "/placeholder-product.jpg", category: "Textiles" },
      { id: "p28", name: "Cotton Napkin Set", description: "Set of 4 hand-woven napkins", price: "$40/set", imageUrl: "/placeholder-product.jpg", category: "Home" },
    ],
    featured: true,
    verified: true,
    joinedDate: "2024-02-01",
  },
  {
    id: "peachtree-cleans",
    name: "Peachtree Clean Co.",
    tagline: "Plant-based cleaning products, Atlanta-made",
    story:
      "After her daughter was diagnosed with asthma, Keisha Robinson started making her own cleaning products from simple, natural ingredients. Friends and neighbors couldn't stop asking for more. Peachtree Clean Co. now offers a full line of plant-based, essential oil-scented cleaning sprays, soaps, and laundry detergents — all mixed in small batches at their Westside Atlanta workshop. No synthetics, no mystery ingredients, no compromise.",
    category: "retail",
    tags: ["black-owned", "women-owned", "sustainable"],
    address: "1049 College St NW",
    city: "Atlanta",
    state: "GA",
    zip: "30314",
    lat: 33.755,
    lng: -84.414,
    phone: "(404) 555-0503",
    email: "keisha@peachtreecleanco.com",
    website: "https://peachtreecleanco.com",
    instagram: "@peachtreeclean",
    hours: {
      Monday: { open: "9:00 AM", close: "5:00 PM" },
      Tuesday: { open: "9:00 AM", close: "5:00 PM" },
      Wednesday: { open: "9:00 AM", close: "5:00 PM" },
      Thursday: { open: "9:00 AM", close: "5:00 PM" },
      Friday: { open: "9:00 AM", close: "5:00 PM" },
      Saturday: { open: "10:00 AM", close: "3:00 PM" },
      Sunday: { closed: true, open: "", close: "" },
    },
    photos: [
      { url: "/placeholder-clean-1.jpg", alt: "Cleaning products display", caption: "Our plant-based product line" },
    ],
    products: [
      { id: "p29", name: "All-Purpose Clean Spray", description: "Lavender and tea tree, 16oz", price: "$10/bottle", imageUrl: "/placeholder-product.jpg", category: "Home" },
      { id: "p30", name: "Laundry Detergent", description: "Unscented, gentle on sensitive skin, 32oz", price: "$14/bottle", imageUrl: "/placeholder-product.jpg", category: "Home" },
      { id: "p31", name: "Starter Kit", description: "5 essentials for a clean home", price: "$42/kit", imageUrl: "/placeholder-product.jpg", category: "Bundles" },
    ],
    featured: false,
    verified: true,
    joinedDate: "2024-08-01",
  },
  {
    id: "savannah-tide",
    name: "Savannah Tide Provisions",
    tagline: "Coastal pantry goods from the lowcountry",
    story:
      "Savannah Tide Provisions captures the flavors of the Georgia coast in a jar. Chef Samir Patel left a career in fine dining to focus on preserving and pickling — using family recipes that blend Indian spice traditions with lowcountry ingredients. His shrimp pickles, chow chow relish, and pepper jelly have become staples at Savannah's farmers markets. Every batch is small, seasonal, and made with produce from local farms and shrimp from local waters.",
    category: "food-producer",
    tags: ["asian-owned", "sustainable", "organic"],
    address: "309 Bull St",
    city: "Savannah",
    state: "GA",
    zip: "31401",
    lat: 32.074,
    lng: -81.095,
    phone: "(912) 555-0267",
    email: "samir@savannahtide.com",
    instagram: "@savannahtide",
    hours: {
      Monday: { open: "10:00 AM", close: "4:00 PM" },
      Tuesday: { open: "10:00 AM", close: "4:00 PM" },
      Wednesday: { open: "10:00 AM", close: "4:00 PM" },
      Thursday: { open: "10:00 AM", close: "4:00 PM" },
      Friday: { open: "10:00 AM", close: "5:00 PM" },
      Saturday: { open: "9:00 AM", close: "3:00 PM" },
      Sunday: { closed: true, open: "", close: "" },
    },
    photos: [
      { url: "/placeholder-pickle-1.jpg", alt: "Pickled goods on shelves", caption: "Our coastal pantry collection" },
      { url: "/placeholder-pickle-2.jpg", alt: "Chef preparing preserves", caption: "Small-batch pickling in progress" },
    ],
    products: [
      { id: "p32", name: "Lowcountry Chow Chow", description: "Sweet and tangy green tomato relish", price: "$9/jar", imageUrl: "/placeholder-product.jpg", category: "Preserves" },
      { id: "p33", name: "Shrimp Pickle", description: "Gulf shrimp in mustard-spice brine", price: "$14/jar", imageUrl: "/placeholder-product.jpg", category: "Preserves" },
      { id: "p34", name: "Peach Pepper Jelly", description: "Georgian peaches meets Carolina Reaper", price: "$11/jar", imageUrl: "/placeholder-product.jpg", category: "Preserves" },
    ],
    featured: false,
    verified: true,
    joinedDate: "2024-06-15",
  },
  {
    id: "bull-city-threads",
    name: "Bull City Threads",
    tagline: "Sustainable streetwear with a Durham story",
    story:
      "Bull City Threads is what happens when a community comes together to create. Founded by Marcus and Deja Williams, this Durham-born streetwear brand uses deadstock and organic fabrics to produce limited-run collections inspired by Durham's vibrant culture. From their knowledge: 'Durham's' tees to their hand-dyed hoodies, every piece is screen-printed or hand-finished in their studio on Rigsbee Street. They also run a youth apprenticeship program, teaching the next generation the business of fashion.",
    category: "retail",
    tags: ["black-owned", "sustainable", "handmade"],
    address: "722 Rigsbee St",
    city: "Durham",
    state: "NC",
    zip: "27701",
    lat: 35.995,
    lng: -78.892,
    phone: "(919) 555-0189",
    email: "hello@bullcitythreads.com",
    website: "https://bullcitythreads.com",
    instagram: "@bullcitythreads",
    hours: {
      Monday: { closed: true, open: "", close: "" },
      Tuesday: { open: "11:00 AM", close: "6:00 PM" },
      Wednesday: { open: "11:00 AM", close: "6:00 PM" },
      Thursday: { open: "11:00 AM", close: "7:00 PM" },
      Friday: { open: "11:00 AM", close: "7:00 PM" },
      Saturday: { open: "10:00 AM", close: "6:00 PM" },
      Sunday: { open: "12:00 PM", close: "5:00 PM" },
    },
    photos: [
      { url: "/placeholder-threads-1.jpg", alt: "Streetwear display", caption: "Current collection on Rigsbee" },
    ],
    products: [
      { id: "p35", name: "Bull City Knowledge Tee", description: "Organic cotton, screen-printed locally", price: "$38/each", imageUrl: "/placeholder-product.jpg", category: "Apparel" },
      { id: "p36", name: "Hand-Dyed Hoodie", description: "Indigo-dyed, deadstock fleece", price: "$75/each", imageUrl: "/placeholder-product.jpg", category: "Apparel" },
      { id: "p37", name: "Durham Snapback", description: "Embroidered bull logo, adjustable", price: "$32/each", imageUrl: "/placeholder-product.jpg", category: "Accessories" },
    ],
    featured: false,
    verified: true,
    joinedDate: "2024-05-10",
  },
];

export function getVendorsByCity(city: string): Vendor[] {
  return vendors.filter(
    (v) => v.city.toLowerCase() === city.toLowerCase()
  );
}

export function getVendorById(id: string): Vendor | undefined {
  return vendors.find((v) => v.id === id);
}

export function filterVendors(
  vendorList: Vendor[],
  category: BusinessCategory | "all",
  tags: BusinessTag[],
  query: string
): Vendor[] {
  return vendorList.filter((v) => {
    if (category !== "all" && v.category !== category) return false;
    if (tags.length > 0 && !tags.some((t) => v.tags.includes(t))) return false;
    if (query) {
      const q = query.toLowerCase();
      return (
        v.name.toLowerCase().includes(q) ||
        v.tagline.toLowerCase().includes(q) ||
        v.story.toLowerCase().includes(q) ||
        v.city.toLowerCase().includes(q) ||
        v.category.toLowerCase().includes(q) ||
        v.tags.some((t) => t.toLowerCase().includes(q)) ||
        v.products.some(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q)
        )
      );
    }
    return true;
  });
}

export function isOpenNow(vendor: Vendor): boolean {
  const now = new Date();
  const dayName = now.toLocaleDateString("en-US", { weekday: "long" });
  const hours = vendor.hours[dayName];
  if (!hours || hours.closed) return false;

  const parseTime = (t: string): number => {
    const [time, period] = t.split(" ");
    let [h, m] = time.split(":").map(Number);
    if (period === "PM" && h !== 12) h += 12;
    if (period === "AM" && h === 12) h = 0;
    return h * 60 + m;
  };

  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const openMinutes = parseTime(hours.open);
  const closeMinutes = parseTime(hours.close);

  return currentMinutes >= openMinutes && currentMinutes < closeMinutes;
}
