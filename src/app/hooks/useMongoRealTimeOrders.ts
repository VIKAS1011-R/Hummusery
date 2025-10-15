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
  message?: string;
  userId?: string;
  role?: string;
  timestamp?: string;
}

export function useMongoRealTimeOrders(initialOrders: Order[] = []) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  // Update initial orders when prop changes
  useEffect(() => {
    setOrders(initialOrders);
  }, [initialOrders]);

  const connectToEventSource = useCallback(() => {
    // Close existing connection
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    try {
      console.log('Connecting to real-time order updates...');
      
      const eventSource = new EventSource('/api/orders/events');
      eventSourceRef.current = eventSource;

      eventSource.onopen = () => {
        console.log('Connected to real-time order updates');
        setIsConnected(true);
        setError(null);
        reconnectAttempts.current = 0;
      };

      eventSource.onmessage = (event) => {
        try {
          const data: OrderUpdateEvent = JSON.parse(event.data);
          
          switch (data.type) {
            case 'connected':
              console.log('Real-time connection established');
              break;
              
            case 'heartbeat':
              // Keep connection alive
              break;
              
            case 'order_created':
              if (data.order) {
                console.log('New order received:', data.order.orderNumber);
                setOrders(prevOrders => {
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
                console.log('Order completed:', data.orderId);
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
        console.error('Real-time connection error:', event);
        setIsConnected(false);
        
        if (reconnectAttempts.current < maxReconnectAttempts) {
          const delay = Math.pow(2, reconnectAttempts.current) * 1000;
          console.log(`Reconnecting in ${delay}ms (attempt ${reconnectAttempts.current + 1}/${maxReconnectAttempts})`);
          
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

  // Initialize connection after initial data is loaded
  useEffect(() => {
    if (initialOrders.length >= 0) { // Even empty array counts as initial data
      console.log('Initial data loaded, connecting to real-time updates...');
      const timer = setTimeout(() => {
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
  }, [initialOrders.length, connectToEventSource]);

  const refreshConnection = useCallback(() => {
    console.log('Refreshing real-time connection...');
    reconnectAttempts.current = 0;
    setError(null);
    
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    
    setTimeout(() => {
      connectToEventSource();
    }, 500);
  }, [connectToEventSource]);

  return {
    orders,
    isConnected,
    error,
    refreshConnection,
    setOrders
  };
}