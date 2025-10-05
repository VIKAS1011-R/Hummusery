import { MongoClient } from 'mongodb';

const connectionString = "mongodb+srv://admin:hummusery@hummusery.0zbqtlj.mongodb.net/?retryWrites=true&w=majority&appName=Hummusery";

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
