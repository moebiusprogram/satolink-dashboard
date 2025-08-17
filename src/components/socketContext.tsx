import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import type {
  AppNotification,
  SocketContextType,
  SocketProviderProps,
} from "@/lib/interfaces";
import config from "@/config";
import { useAtom } from "jotai";
//todo mejorar este enfoque global
//import { atoms } from "@/store/atoms"
import { notificationsAtom, paymentAtom } from "@/store/notfications";
import { getByType } from "@/api/connections";

const API_URL = config.API_URL;

// Create the context with a typed but undefined default value
const SocketContext = createContext<SocketContextType | undefined>(undefined);

// Custom hook to use the socket context, with a check for provider existence
export const useSocket = (): SocketContextType => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

export const SocketProvider = ({ children, userId }: SocketProviderProps) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [notifications, setNotifications] = useAtom(notificationsAtom);
  const [, setPayment] = useAtom(paymentAtom);

  useEffect(() => {
    const newSocket = io(API_URL);

    newSocket.on("connect", () => {
      console.log("Connected to server");

      if (userId) {
        console.log("emiting the register", userId);
        newSocket.emit("register", userId);
      }
    });

    // Listen for notifications with typed data
    newSocket.on("notification", (data: AppNotification) => {
      console.log("data", data);

      getByType("notifications")
        .then((list) => {
          setPayment(true);
          setNotifications(list);

          setTimeout(() => {
            setPayment(false);
          }, 5000);
        })
        .catch((err) => {
          console.log(err);
        });

      //setNotifications((prev) => [data, ...prev]);
      // Optional: Show browser notification, with permission request
      if (Notification.permission === "granted") {
        new Notification("New Notification", { body: data.message });
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            new Notification("New Notification", { body: data.message });
          }
        });
      }
    });

    setSocket(newSocket);

    // Cleanup on component unmount
    return () => {
      newSocket.disconnect();
    };
  }, [userId]);

  const contextValue: SocketContextType = {
    socket,
    notifications,
    clearNotifications: () => setNotifications([]),
  };

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
};
