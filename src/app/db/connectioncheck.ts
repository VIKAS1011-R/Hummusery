import { MongoClient } from 'mongodb';

const connectionString = process.env.DATABASE_URL;

async function checkMongoConnection() {
  if (!connectionString) {
    console.error('❌ DATABASE_URL environment variable is not set');
    return false;
  }
  
  const client = new MongoClient(connectionString);
  
  try {
    console.log('Attempting to connect to MongoDB...');
    await client.connect();
    
    // Test the connection
    await client.db().admin().ping();
    
    console.log('✅ MongoDB connection successful!');
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    return false;
  } finally {
    await client.close();
  }
}

checkMongoConnection();
