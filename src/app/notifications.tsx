import { useEffect, useState } from "react";
import { Fade } from "react-awesome-reveal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Bell, Mail, Smartphone } from "lucide-react";
import type { Notification } from "@/lib/interfaces";
import { useAtom } from "jotai";
import { notificationsAtom } from "@/store/notfications";
import { useNavigate } from "react-router-dom";
import { getByType } from "@/api/connections";

const getTypeBadge = (type: Notification["type"]) => {
  const variants = {
    transaction: "bg-blue-400 text-blue-900",
    security: "bg-red-400 text-yellow-100",
    system: "bg-purple-400 text-purple-900",
    promotional: "bg-green-400 text-green-900",
  };
  return variants[type] || "bg-gray-100 text-gray-800";
};

const getMediumIcon = (medium: Notification["medium"]) => {
  switch (medium) {
    case "email":
      return <Mail className="h-4 w-4" />;
    case "sms":
      return <Smartphone className="h-4 w-4" />;
    case "push":
      return <Bell className="h-4 w-4" />;
    default:
      return <Bell className="h-4 w-4" />;
  }
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useAtom(notificationsAtom);
  const navigate = useNavigate();

  useEffect(() => {
    getByType("notifications", navigate)
      .then((list) => {
        setNotifications(list);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [setNotifications]);

  const markAsRead = (id: string) => {
    // In a real app, this would update the notification status in your backend
    console.log(`Marking notification ${id} as read`);
  };

  const markAllAsRead = () => {
    // In a real app, this would update all notifications status in your backend
    console.log("Marking all notifications as read");
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
          <div className="p-4 lg:p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                Notifications
              </h3>
              <Button variant="outline" onClick={markAllAsRead}>
                Mark all as read
              </Button>
            </div>

            <div className="space-y-4">
              {[...notifications].reverse().map((notification) => (
                <Card
                  key={notification.id}
                  className={`p-3 relative overflow-hidden ${
                    !notification.status || notification.status === "unread"
                      ? "bg-gray-800"
                      : ""
                  }`}>
                  <CardContent
                    style={{
                      justifyContent: "space-between",
                      paddingLeft: "1.6rem",
                    }}
                    className="px-3 flex flex-row justifiy-between">
                    <div>
                      <CardTitle className="flex-row text-md mb-1">
                        <span
                          className="flex flex-row items-center gap-2"
                          style={{ marginLeft: "-1.6rem" }}>
                          {getMediumIcon(notification.medium)}
                          {notification.title}
                        </span>
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {notification.message}
                      </p>
                    </div>
                    {/* {!notification.read && (
                        <div className="mt-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => markAsRead(notification.id)}>
                            Mark as read
                          </Button>
                        </div>
                      )} */}
                    <div
                      className="flex flex-col items-center text-right gap-2"
                      style={{
                        justifyContent: "space-around",
                        alignItems: "flex-end",
                      }}>
                      <div className="text-sm text-muted-foreground">
                        {notification.createdAt}
                      </div>
                      <div className="flex flex-row items-center space-x-2 gap-2">
                        <Badge className={getTypeBadge(notification.type)}>
                          {notification.type}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {notifications.length === 0 && (
                <div className="h-24 text-center">No notifications.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
