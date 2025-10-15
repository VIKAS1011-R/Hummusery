// This will be a server-side only service
// We'll use it through API endpoints, not directly in the browser

import { ChangeStreamDocument } from "mongodb";

import { ChangeStreamDocument } from "mongodb";

import { MongoClient } from "mongodb";

import { ChangeStream } from "mongodb";

import { MongoClient } from "mongodb";

interface OrderChangeEvent {
  type: 'order_created' | 'order_updated' | 'order_deleted';
  order?: any;
  orderId?: string;
}

class MongoDBRealTimeService {
  private client: MongoClient | null = null;
  private changeStream: ChangeStream | null = null;
  private listeners: Set<(event: OrderChangeEvent) => void> = new Set();
  private isConnected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  async initialize() {
    if (this.isConnected) return;

    try {
      console.log('🔌 Initializing MongoDB real-time connection...');
      
      if (!process.env.DATABASE_URL) {
        throw new Error('DATABASE_URL not found');
      }

      this.client = new MongoClient(process.env.DATABASE_URL);
      await this.client.connect();
      
      const db = this.client.db('Hummusery_Data');
      const collection = db.collection('activeOrders');

      // Create change stream to watch for changes
      this.changeStream = collection.watch([
        {
          $match: {
            $or: [
              { operationType: 'insert' },
              { operationType: 'update' },
              { operationType: 'delete' },
              { operationType: 'replace' }
            ]
          }
        }
      ], {
        fullDocument: 'updateLookup'
      });

      this.changeStream.on('change', (change: ChangeStreamDocument) => {
        this.handleChange(change);
      });

      this.changeStream.on('error', (error) => {
        console.error('❌ MongoDB Change Stream error:', error);
        this.handleReconnect();
      });

      this.changeStream.on('close', () => {
        console.log('🔚 MongoDB Change Stream closed');
        this.isConnected = false;
      });

      this.isConnected = true;
      this.reconnectAttempts = 0;
      console.log('✅ MongoDB real-time connection established');

    } catch (error) {
      console.error('❌ Failed to initialize MongoDB real-time connection:', error);
      this.handleReconnect();
    }
  }

  private handleChange(change: ChangeStreamDocument) {
    console.log('📡 MongoDB change detected:', change.operationType);

    try {
      let event: OrderChangeEvent;

      switch (change.operationType) {
        case 'insert':
          event = {
            type: 'order_created',
            order: this.transformOrder(change.fullDocument)
          };
          break;

        case 'update':
        case 'replace':
          event = {
            type: 'order_updated',
            order: this.transformOrder(change.fullDocument)
          };
          break;

        case 'delete':
          event = {
            type: 'order_deleted',
            orderId: change.documentKey._id.toString()
          };
          break;

        default:
          return;
      }

      // Broadcast to all listeners
      this.listeners.forEach(listener => {
        try {
          listener(event);
        } catch (error) {
          console.error('Error in change listener:', error);
        }
      });

    } catch (error) {
      console.error('Error handling MongoDB change:', error);
    }
  }

  private transformOrder(document: any) {
    if (!document) return null;

    return {
      ...document,
      id: document._id?.toString(),
      createdAt: document.createdAt instanceof Date 
        ? document.createdAt.toISOString() 
        : document.createdAt,
      updatedAt: document.updatedAt instanceof Date 
        ? document.updatedAt.toISOString() 
        : document.updatedAt,
      _id: undefined // Remove MongoDB _id field
    };
  }

  private async handleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('❌ Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    const delay = Math.pow(2, this.reconnectAttempts) * 1000; // Exponential backoff

    console.log(`🔄 Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);

    setTimeout(() => {
      this.cleanup();
      this.initialize();
    }, delay);
  }

  addListener(listener: (event: OrderChangeEvent) => void) {
    this.listeners.add(listener);
    console.log(`📡 Added change listener. Total listeners: ${this.listeners.size}`);

    // Initialize connection if not already done
    if (!this.isConnected) {
      this.initialize();
    }

    // Return cleanup function
    return () => {
      this.listeners.delete(listener);
      console.log(`📡 Removed change listener. Total listeners: ${this.listeners.size}`);
      
      // Close connection if no more listeners
      if (this.listeners.size === 0) {
        this.cleanup();
      }
    };
  }

  private cleanup() {
    console.log('🧹 Cleaning up MongoDB real-time connection...');
    
    if (this.changeStream) {
      this.changeStream.close();
      this.changeStream = null;
    }

    if (this.client) {
      this.client.close();
      this.client = null;
    }

    this.isConnected = false;
  }

  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      listenersCount: this.listeners.size,
      reconnectAttempts: this.reconnectAttempts
    };
  }
}

// Singleton instance
const mongoRealTimeService = new MongoDBRealTimeService();

export default mongoRealTimeService;