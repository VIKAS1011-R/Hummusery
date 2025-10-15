import { useState, useEffect, useCallback, useRef } from 'react';

interface OrderItem {
  id: string;
  name: string;
  description: string;
  isVeg: boolean;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  orderNumber: string;
  items: OrderItem[];
  status: "pending" | "preparing" | "ready" | "completed" | "cancelled";
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  createdAt: string;
}

interface OrderUpdateEvent {
  type: 'order_created' | 'order_updated' | 'order_deleted' | 'connected' | 'heartbeat';
  order?: Order;
  orderId?: string;
  status?: string;
  message?: string;
  userId?: string;
  role?: string;
  timestamp?: string;
}

export function useRealTimeOrders(initialOrders: Order[] = []) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasInitialData, setHasInitialData] = useState(false);
  const [connectionAttempted, setConnectionAttempted] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  const connectToEventSource = useCallback(() => {
    // Close existing connection
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    try {
      console.log('🔌 Creating new EventSource connection to /api/orders/events');
      
      // Create EventSource - cookies are automatically sent for same-origin requests
      const eventSource = new EventSource('/api/orders/events');
      eventSourceRef.current = eventSource;
      
      console.log('📡 EventSource created, readyState:', eventSource.readyState);

      eventSource.onopen = () => {
        console.log('✅ SSE connection opened successfully');
        setIsConnected(true);
        setError(null);
        reconnectAttempts.current = 0;
      };

      eventSource.onmessage = (event) => {
        try {
          const data: OrderUpdateEvent = JSON.parse(event.data);
          switch (data.type) {
            case 'connected':
              console.log('SSE connection established:', data.message);
              break;
              
            case 'heartbeat':
              // Keep connection alive
              break;
              
            case 'order_created':
              if (data.order) {
                console.log('New order received:', data.order.orderNumber);
                setOrders(prevOrders => {
                  // Check if order already exists to prevent duplicates
                  const exists = prevOrders.some(order => order.id === data.order!.id);
                  if (exists) return prevOrders;
                  
                  return [data.order!, ...prevOrders];
                });
              }
              break;
              
            case 'order_updated':
              if (data.order) {
                console.log('Order updated:', data.order.orderNumber, 'status:', data.order.status);
                setOrders(prevOrders => 
                  prevOrders.map(order => 
                    order.id === data.order!.id ? data.order! : order
                  )
                );
              }
              break;
              
            case 'order_deleted':
              if (data.orderId) {
                console.log('Order completed/deleted:', data.orderId);
                setOrders(prevOrders => 
                  prevOrders.filter(order => order.id !== data.orderId)
                );
              }
              break;
          }
        } catch (err) {
          console.error('Error parsing SSE data:', err);
        }
      };

      eventSource.onerror = (event) => {
        console.error('❌ SSE connection error:', event);
        console.error('EventSource readyState:', (event.target as EventSource)?.readyState);
        console.error('EventSource url:', (event.target as EventSource)?.url);
        setIsConnected(false);
        
        // Check if this is an authentication error (401)
        if (event.target && (event.target as EventSource).readyState === EventSource.CLOSED) {
          console.log('🔒 EventSource closed, likely due to auth error');
        }
        
        // Attempt to reconnect with exponential backoff
        if (reconnectAttempts.current < maxReconnectAttempts) {
          const delay = Math.pow(2, reconnectAttempts.current) * 1000; // 1s, 2s, 4s, 8s, 16s
          console.log(`🔄 Attempting to reconnect in ${delay}ms (attempt ${reconnectAttempts.current + 1}/${maxReconnectAttempts})`);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttempts.current++;
            connectToEventSource();
          }, delay);
        } else {
          setError('Connection lost. Please refresh the page.');
        }
      };

    } catch (err) {
      console.error('Failed to create EventSource:', err);
      setError('Failed to connect to real-time updates');
    }
  }, []);

  // Initialize connection only after we have initial data
  useEffect(() => {
    if (hasInitialData && !connectionAttempted) {
      console.log('📊 Initial data loaded, establishing SSE connection');
      setConnectionAttempted(true);
      
      // Add a small delay to ensure the page is fully loaded
      const timer = setTimeout(() => {
        console.log('🚀 Starting SSE connection...');
        connectToEventSource();
      }, 1000);

      return () => {
        clearTimeout(timer);
      };
    }

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [hasInitialData, connectionAttempted, connectToEventSource]);

  // Update initial orders when prop changes and mark as having initial data
  useEffect(() => {
    setOrders(initialOrders);
    if (initialOrders.length >= 0) { // Even empty array counts as initial data
      setHasInitialData(true);
    }
  }, [initialOrders]);

  const refreshConnection = useCallback(() => {
    console.log('🔄 Refreshing SSE connection...');
    reconnectAttempts.current = 0;
    setConnectionAttempted(false);
    setError(null);
    
    // Close existing connection
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    
    // Restart connection
    setTimeout(() => {
      setConnectionAttempted(true);
      connectToEventSource();
    }, 500);
  }, [connectToEventSource]);

  return {
    orders,
    isConnected,
    error,
    refreshConnection,
    setOrders, // Allow manual updates if needed
    hasInitialData,
    connectionAttempted
  };
}