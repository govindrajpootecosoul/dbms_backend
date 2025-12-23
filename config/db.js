const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
  try {
    let mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      mongoUri =
        'mongodb+srv://shivank24:Shilpank%402414@mydbms.dgew6sb.mongodb.net/dbms?retryWrites=true&w=majority';
    }

    const conn = await mongoose.connect(mongoUri);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database Name: ${conn.connection.name}`);

    await ensureDatabaseAndCollections(conn.connection);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    if (process.env.VERCEL !== '1') {
      process.exit(1);
    }
    throw error;
  }
};

const ensureDatabaseAndCollections = async (connection) => {
  try {
    const db = connection.db;
    const dbName = connection.name;

    console.log(`🔍 Checking database: ${dbName}`);

    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map((col) => col.name);

    console.log(
      `📋 Existing collections: ${
        collectionNames.length > 0 ? collectionNames.join(', ') : 'None'
      }`
    );

    const expectedCollections = [
      'users',
      'animes',
      'genshins',
      'games',
      'credentials',
      'kdramas',
      'movies',
    ];

    for (const collectionName of expectedCollections) {
      if (!collectionNames.includes(collectionName)) {
        await db.createCollection(collectionName);
        console.log(`✅ Created collection: ${collectionName}`);
      } else {
        console.log(`✓ Collection exists: ${collectionName}`);
      }
    }

    console.log(`✅ Database and collections verified for: ${dbName}`);
  } catch (error) {
    console.error(`⚠️ Error ensuring database/collections: ${error.message}`);
  }
};

module.exports = connectDB;

