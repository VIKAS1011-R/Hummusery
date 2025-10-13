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
  serverSelectionTimeoutMS: 5000, // 5 seconds for server selection
  socketTimeoutMS: 0, // No socket timeout - let MongoDB handle it
  heartbeatFrequencyMS: 30000, // 30 second heartbeats (less aggressive)
  connectTimeoutMS: 10000, // 10 seconds for initial connection
  retryWrites: true, // Enable retryable writes
  maxConnecting: 2, // Limit concurrent connection attempts
};

// Track last health check to avoid excessive pings
let lastHealthCheck = 0;
const HEALTH_CHECK_INTERVAL = 300000; // 5 minutes - much less aggressive

export async function connectToDatabase(): Promise<Db> {
  // If we already have a connection, trust it and return immediately
  // MongoDB's connection pool will handle connection health automatically
  if (db && client) {
    return db;
  }

  // If already connecting, wait for that connection with timeout
  if (isConnecting && connectionPromise) {
    console.log('🔄 Connection in progress, waiting...');
    try {
      return await Promise.race([
        connectionPromise,
        new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error('Connection wait timeout')), 10000)
        )
      ]);
    } catch (error) {
      console.error('Connection wait failed:', error);
      // Reset connection state and try again
      isConnecting = false;
      connectionPromise = null;
    }
  }

  const connectionString = process.env.DATABASE_URL;
  
  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set');
  }

  // Set connecting flag and create connection promise with timeout
  isConnecting = true;
  connectionPromise = Promise.race([
    createConnection(connectionString),
    new Promise<never>((_, reject) => 
      setTimeout(() => reject(new Error('Connection timeout after 15 seconds')), 15000)
    )
  ]);

  try {
    const result = await connectionPromise;
    lastHealthCheck = Date.now(); // Mark successful connection
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
    console.log('🔌 Establishing new MongoDB connection...');
    
    // Try with optimized options first
    try {
      client = new MongoClient(connectionString, CONNECTION_OPTIONS);
      await client.connect();
    } catch (configError) {
      console.warn('⚠️ Optimized connection failed, trying with basic options:', configError);
      
      // Fallback to basic connection options
      const basicOptions = {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      };
      
      client = new MongoClient(connectionString, basicOptions);
      await client.connect();
    }
    
    // Get database instance
    db = client.db('Hummusery_Data');
    
    // Verify connection with ping
    await db.admin().ping();
    
    console.log('✅ Connected to MongoDB database: Hummusery_Data');
    console.log(`📊 Connection established successfully`);
    
    // Set up connection event listeners
    setupConnectionListeners(client);
    
    return db;
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error);
    
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
  mongoClient.on('connectionPoolCreated', () => {
    console.log('🏊 MongoDB connection pool created');
  });

  // Only log important pool events, not individual connections
  mongoClient.on('connectionPoolCleared', () => {
    console.warn('🧹 MongoDB connection pool cleared - this may indicate connection issues');
  });

  mongoClient.on('connectionPoolClosed', () => {
    console.log('🏊 MongoDB connection pool closed');
  });

  // Always log errors and timeouts
  mongoClient.on('error', (error) => {
    console.error('❌ MongoDB connection error:', error);
  });

  mongoClient.on('timeout', () => {
    console.warn('⏰ MongoDB connection timeout');
  });

  // Log server events
  mongoClient.on('serverOpening', () => {
    console.log('🌐 MongoDB server connection opening');
  });

  mongoClient.on('serverClosed', () => {
    console.log('🌐 MongoDB server connection closed');
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
      console.log('🔌 Disconnected from MongoDB');
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
  console.log('🛑 Received SIGINT, closing database connection...');
  await closeDatabaseConnection();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('🛑 Received SIGTERM, closing database connection...');
  await closeDatabaseConnection();
  process.exit(0);
});