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
  status?: string;
  message?: string;
  userId?: string;
  role?: string;
  timestamp?: string;
}

export function useRealTimeOrderHistory(initialOrderHistory: OrderHistoryItem[] = [], userId?: string) {
  const [orderHistory, setOrderHistory] = useState<OrderHistoryItem[]>(initialOrderHistory);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasInitialData, setHasInitialData] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  const connectToEventSource = useCallback(() => {
    // Only connect if we have a userId
    if (!userId) return;

    // Close existing connection
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    try {
      const eventSource = new EventSource('/api/orders/events');
      eventSourceRef.current = eventSource;

      eventSource.onopen = () => {
        console.log('Connected to order updates for user');
        setIsConnected(true);
        setError(null);
        reconnectAttempts.current = 0;
      };

      eventSource.onmessage = (event) => {
        try {
          const data: OrderUpdateEvent = JSON.parse(event.data);
          
          switch (data.type) {
            case 'connected':
              console.log('SSE connection established for user:', data.message);
              break;
              
            case 'heartbeat':
              // Keep connection alive
              break;
              
            case 'order_updated':
              if (data.order && data.order.userId === userId) {
                // Update order status in history if it belongs to this user
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
                // Add new order to history if it belongs to this user
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
                  // Check if order already exists to prevent duplicates
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
        console.error('SSE connection error:', event);
        setIsConnected(false);
        
        // Attempt to reconnect with exponential backoff
        if (reconnectAttempts.current < maxReconnectAttempts) {
          const delay = Math.pow(2, reconnectAttempts.current) * 1000;
          console.log(`Attempting to reconnect in ${delay}ms (attempt ${reconnectAttempts.current + 1}/${maxReconnectAttempts})`);
          
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

  // Initialize connection only after we have initial data and userId
  useEffect(() => {
    if (userId && hasInitialData) {
      console.log('Initial order history loaded, establishing SSE connection for user:', userId);
      // Small delay to ensure everything is ready
      const timer = setTimeout(() => {
        connectToEventSource();
      }, 500);

      return () => {
        clearTimeout(timer);
        if (eventSourceRef.current) {
          eventSourceRef.current.close();
        }
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
        }
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
  }, [hasInitialData, userId, connectToEventSource]);

  // Update initial order history when prop changes and mark as having initial data
  useEffect(() => {
    setOrderHistory(initialOrderHistory);
    if (initialOrderHistory.length >= 0) { // Even empty array counts as initial data
      setHasInitialData(true);
    }
  }, [initialOrderHistory]);

  const refreshConnection = useCallback(() => {
    reconnectAttempts.current = 0;
    connectToEventSource();
  }, [connectToEventSource]);

  return {
    orderHistory,
    isConnected,
    error,
    refreshConnection,
    setOrderHistory, // Allow manual updates if needed
    hasInitialData
  };
}