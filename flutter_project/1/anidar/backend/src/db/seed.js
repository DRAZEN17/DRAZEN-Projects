// Run: node src/db/seed.js
// Creates default nests if they don't exist
require('dotenv').config();
const pool = require('./pool');

async function seed() {
  const nests = [
    { slug: 'general', name: 'General', description: 'General discussion — all posts show here' },
    { slug: 'anime', name: 'Anime', description: 'Anime discussions, recommendations and news' },
    { slug: 'flutter', name: 'Flutter', description: 'Flutter and Dart development' },
  ];

  for (const nest of nests) {
    await pool.query(
      `INSERT INTO nests (slug, name, description, creator_id)
       VALUES ($1, $2, $3, 1)
       ON CONFLICT (slug) DO NOTHING`,
      [nest.slug, nest.name, nest.description]
    );
    console.log(`✓ Nest: n/${nest.slug}`);
  }
  console.log('Seed complete');
  process.exit(0);
}

seed().catch(e => { console.error(e); process.exit(1); });
