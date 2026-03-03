// Market database and helper functions
const SECTORS = [
  { id: 'tokyo', name: "Neo Tokyo", color: "from-pink-500 to-purple-600" },
  { id: 'solari', name: "Solari District", color: "from-orange-400 to-red-500" },
  { id: 'citadel', name: "Iron Citadel", color: "from-zinc-500 to-blue-900" },
  { id: 'lunar', name: "Lunar Heights", color: "from-blue-200 to-cyan-400" },
  { id: 'void', name: "Void Valley", color: "from-purple-900 to-black" }
];

const CATEGORIES = ["Residential", "Commercial", "Industrial", "Creative Studio"];

const getEstateImage = (index) => {
  const mansionPool = [
    "modern-mansion-luxury",
  ];
  const selectedKeyword = mansionPool[index % 1];
  return `https://picsum.photos/seed/mansion-${index % 1}-${selectedKeyword}/1200/800`;
};

const generateEnhancedDatabase = (count) => {
  const houseNames = ["Sky Villa", "Zenith Manor", "Opal Estate", "Prism House", "Horizon Mansion"];
  return Array.from({ length: count }).map((_, i) => {
    const sector = SECTORS[i % SECTORS.length];
    const category = CATEGORIES[i % CATEGORIES.length];
    const baseName = houseNames[i % houseNames.length];
    return {
      id: i + 1,
      name: `${baseName} ${100 + i}`,
      price: Math.floor(Math.random() * 5000000) + 850000,
      rentPrice: Math.floor(Math.random() * 5000) + 2000,
      location: sector.name,
      sectorId: sector.id,
      category: category,
      description: "A breathtaking luxury home featuring floor-to-ceiling smart glass, eco-friendly climate control, and advanced safety systems. This property represents the pinnacle of modern architectural achievement.",
      specs: {
        networkSpeed: (Math.random() * 10).toFixed(1) + " Gbps",
        energy: Math.floor(Math.random() * 20) + 80 + "% Efficient",
        power: "Solar-Fusion",
        floors: Math.floor(Math.random() * 4) + 2
      },
      image: getEstateImage(i),
      ownerId: i < 3 ? 'demo-user' : 'network-prime',
      isBest: i % 8 === 0
    };
  });
};

const INITIAL_DB = generateEnhancedDatabase(60);

export { SECTORS, CATEGORIES, getEstateImage, generateEnhancedDatabase, INITIAL_DB };
