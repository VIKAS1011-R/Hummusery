import { useState, useEffect, useCallback, useRef } from 'react';

interface OrderHistoryItem {
  orderId: string;
  orderNumber: string;
  items: {
    name: string;
    quantity: number;
    price: number;
    isVeg: boolean;
  }[];
  totalAmount: number;
  status: "pending" | "preparing" | "ready" | "completed" | "cancelled";
  orderDate: string;
}

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
  userId: string;
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

export function useMongoRealTimeOrderHistory(initialOrderHistory: OrderHistoryItem[] = [], userId?: string) {
  const [orderHistory, setOrderHistory] = useState<OrderHistoryItem[]>(initialOrderHistory);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  // Update initial order history when prop changes
  useEffect(() => {
    setOrderHistory(initialOrderHistory);
  }, [initialOrderHistory]);

  const connectToEventSource = useCallback(() => {
    if (!userId) return;

    // Close existing connection
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    try {
      console.log('Connecting to real-time order updates for user:', userId);
      
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
              
            case 'order_updated':
              if (data.order && data.order.userId === userId) {
                console.log('Order status updated:', data.order.orderNumber, 'status:', data.order.status);
                setOrderHistory(prevHistory => 
                  prevHistory.map(historyItem => 
                    historyItem.orderId === data.order!.id 
                      ? { ...historyItem, status: data.order!.status }
                      : historyItem
                  )
                );
              }
              break;
              
            case 'order_created':
              if (data.order && data.order.userId === userId) {
                console.log('New order added to history:', data.order.orderNumber);
                const newHistoryItem: OrderHistoryItem = {
                  orderId: data.order.id,
                  orderNumber: data.order.orderNumber,
                  items: data.order.items.map((item: OrderItem) => ({
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price,
                    isVeg: item.isVeg
                  })),
                  totalAmount: data.order.totalAmount,
                  status: data.order.status,
                  orderDate: data.order.createdAt
                };
                
                setOrderHistory(prevHistory => {
                  const exists = prevHistory.some(item => item.orderId === newHistoryItem.orderId);
                  if (exists) return prevHistory;
                  return [newHistoryItem, ...prevHistory];
                });
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
  }, [userId]);

  // Initialize connection when userId and initial data are available
  useEffect(() => {
    if (userId && initialOrderHistory.length >= 0) {
      console.log('Initial order history loaded, connecting to real-time updates...');
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
  }, [userId, initialOrderHistory.length, connectToEventSource]);

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
    orderHistory,
    isConnected,
    error,
    refreshConnection,
    setOrderHistory
  };
}