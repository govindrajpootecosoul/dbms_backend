import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    // URL encode the connection string if needed
    let mongoUri = process.env.MONGODB_URI;
    
    // If MONGODB_URI is not set, use the default connection string
    if (!mongoUri) {
      // Default connection string with URL-encoded password (@ -> %40) and database name
      // Database name: dbms
      mongoUri = 'mongodb+srv://shivank24:Shilpank%402414@mydbms.dgew6sb.mongodb.net/dbms?retryWrites=true&w=majority';
    }
    
    const conn = await mongoose.connect(mongoUri);
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database Name: ${conn.connection.name}`);
    
    // Ensure database and collections exist
    await ensureDatabaseAndCollections(conn.connection);
    
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    // Don't exit in serverless environment (Vercel)
    if (process.env.VERCEL !== '1') {
      process.exit(1);
    }
    throw error;
  }
};

// Function to ensure database and collections exist
const ensureDatabaseAndCollections = async (connection) => {
  try {
    const db = connection.db;
    const dbName = connection.name;
    
    console.log(`🔍 Checking database: ${dbName}`);
    
    // List all collections in the database
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(col => col.name);
    
    console.log(`📋 Existing collections: ${collectionNames.length > 0 ? collectionNames.join(', ') : 'None'}`);
    
    // Expected collections based on models
    const expectedCollections = ['users', 'animes', 'genshins', 'games', 'credentials', 'kdramas', 'movies'];
    
    // Check and create collections if they don't exist
    for (const collectionName of expectedCollections) {
      if (!collectionNames.includes(collectionName)) {
        // Create collection by inserting an empty document and then deleting it
        // This ensures the collection is created with proper indexes from the schema
        await db.createCollection(collectionName);
        console.log(`✅ Created collection: ${collectionName}`);
      } else {
        console.log(`✓ Collection exists: ${collectionName}`);
      }
    }
    
    // Mongoose will automatically create indexes when models are first used
    // The unique indexes for username and email will be created automatically
    
    console.log(`✅ Database and collections verified for: ${dbName}`);
    
  } catch (error) {
    console.error(`⚠️ Error ensuring database/collections: ${error.message}`);
    // Don't throw - connection is still valid, collections will be created on first use
  }
};

export default connectDB;

