import { MongoClient, Db } from 'mongodb';

// Global connection variables
let client: MongoClient | null = null;
let db: Db | null = null;
let isConnecting = false;
let connectionPromise: Promise<Db> | null = null;

// Connection pool configuration optimized for persistent connections
const CONNECTION_OPTIONS = {
  maxPoolSize: 10, // Maximum number of connections in the pool
  minPoolSize: 3,  // Keep more connections alive
  maxIdleTimeMS: 600000, // 10 minutes idle timeout (much longer to maintain pool)
  serverSelectionTimeoutMS: 10000, // 10 seconds for server selection (increased)
  socketTimeoutMS: 0, // No socket timeout - let MongoDB handle it
  heartbeatFrequencyMS: 30000, // 30 second heartbeats (less aggressive)
  connectTimeoutMS: 20000, // 20 seconds for initial connection (increased)
  retryWrites: true, // Enable retryable writes
  maxConnecting: 2, // Limit concurrent connection attempts
  bufferMaxEntries: 0, // Disable mongoose buffering
  bufferCommands: false, // Disable mongoose buffering
};

// Track last health check to avoid excessive pings
let lastHealthCheck = 0;
const HEALTH_CHECK_INTERVAL = 300000; // 5 minutes - much less aggressive

export async function connectToDatabase(): Promise<Db> {
  // If we already have a connection, return it
  if (db && client) {
    try {
      // Quick health check
      await db.admin().ping();
      return db;
    } catch (error) {
      // Connection is stale, reset and reconnect
      console.log('Stale connection detected, reconnecting...');
      client = null;
      db = null;
    }
  }

  // If already connecting, wait for that connection
  if (isConnecting && connectionPromise) {
    try {
      return await connectionPromise;
    } catch (error) {
      // Reset connection state and try again
      isConnecting = false;
      connectionPromise = null;
    }
  }

  const connectionString = process.env.DATABASE_URL;
  
  console.log('Environment check:', {
    hasConnectionString: !!connectionString,
    nodeEnv: process.env.NODE_ENV,
    connectionStringPreview: connectionString ? connectionString.replace(/:[^:@]*@/, ':***@') : 'undefined'
  });
  
  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set');
  }

  // Set connecting flag and create connection promise
  isConnecting = true;
  connectionPromise = createConnection(connectionString);

  try {
    const result = await connectionPromise;
    lastHealthCheck = Date.now();
    return result;
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error;
  } finally {
    isConnecting = false;
    connectionPromise = null;
  }
}

async function createConnection(connectionString: string): Promise<Db> {
  try {
    // Use simplified connection options
    const options = {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 0,
      retryWrites: true,
    };
    
    client = new MongoClient(connectionString, options);
    await client.connect();
    
    // Get database instance
    db = client.db('Hummusery_Data');
    
    // Verify connection with ping
    await db.admin().ping();
    
    console.log('✅ MongoDB connected successfully');
    
    // Set up connection event listeners
    setupConnectionListeners(client);
    
    return db;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    
    // Clean up on failure
    if (client) {
      try {
        await client.close();
      } catch (closeError) {
        console.error('Error closing failed connection:', closeError);
      }
    }
    
    client = null;
    db = null;
    throw error;
  }
}

function setupConnectionListeners(mongoClient: MongoClient) {
  // Only log critical events in production
  mongoClient.on('connectionPoolCleared', () => {
    console.warn('MongoDB connection pool cleared - connection issues detected');
  });

  mongoClient.on('error', (error) => {
    console.error('MongoDB connection error:', error);
  });

  mongoClient.on('timeout', () => {
    console.warn('MongoDB connection timeout');
  });
}

// Health check function with caching
let lastHealthStatus = false;
let lastHealthCheckTime = 0;

export async function checkDatabaseHealth(forceCheck = false): Promise<boolean> {
  const now = Date.now();
  
  // Return cached result if recent (within 30 seconds) and not forcing
  if (!forceCheck && now - lastHealthCheckTime < 30000) {
    return lastHealthStatus;
  }

  try {
    if (!db || !client) {
      lastHealthStatus = false;
      lastHealthCheckTime = now;
      return false;
    }
    
    // Use a quick ping with timeout but don't close connection on failure
    await Promise.race([
      db.admin().ping(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Health check timeout')), 5000)
      )
    ]);
    
    lastHealthStatus = true;
    lastHealthCheckTime = now;
    return true;
  } catch (error) {
    // Don't log every health check failure, just mark as unhealthy
    // The connection pool will handle reconnection automatically
    lastHealthStatus = false;
    lastHealthCheckTime = now;
    return false;
  }
}

// Get connection stats and pool information
export async function getConnectionStats() {
  if (!client) {
    return { 
      connected: false, 
      stats: null,
      poolInfo: null,
      lastHealthCheck: new Date(lastHealthCheck).toISOString(),
      clientExists: false
    };
  }

  try {
    const isHealthy = await checkDatabaseHealth();
    
    return {
      connected: isHealthy,
      clientExists: !!client,
      dbExists: !!db,
      poolInfo: {
        maxPoolSize: CONNECTION_OPTIONS.maxPoolSize,
        minPoolSize: CONNECTION_OPTIONS.minPoolSize,
        maxIdleTimeMS: CONNECTION_OPTIONS.maxIdleTimeMS,
        heartbeatFrequencyMS: CONNECTION_OPTIONS.heartbeatFrequencyMS
      },
      lastHealthCheck: new Date(lastHealthCheck).toISOString(),
      connectionAge: Date.now() - lastHealthCheck,
      healthCheckInterval: HEALTH_CHECK_INTERVAL
    };
  } catch (error) {
    return { 
      connected: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      lastHealthCheck: new Date(lastHealthCheck).toISOString(),
      clientExists: !!client,
      dbExists: !!db
    };
  }
}

export async function closeDatabaseConnection(): Promise<void> {
  if (client) {
    try {
      await client.close();
    } catch (error) {
      console.error('Error closing MongoDB connection:', error);
    } finally {
      client = null;
      db = null;
    }
  }
}

// Graceful shutdown handler
process.on('SIGINT', async () => {
  await closeDatabaseConnection();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await closeDatabaseConnection();
  process.exit(0);
});