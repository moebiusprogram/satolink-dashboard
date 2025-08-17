// Define the shape of a notification for type safety
export interface AppNotification {
  message: string;
  timestamp: string; // Assuming ISO string from server
}

// Define the shape of the context value
export interface SocketContextType {
  socket: Socket | null;
  notifications: AppNotification[];
  clearNotifications: () => void;
}

// Define props for the provider for type safety
export interface SocketProviderProps {
  children: ReactNode;
  userId: string | number;
}

export type Notification = {
  id: string;
  type: "transaction" | "security" | "system" | "promotional";
  title: string;
  message: string;
  medium: "email" | "sms" | "push";
  createdAt: Date;
  status: string;
};
