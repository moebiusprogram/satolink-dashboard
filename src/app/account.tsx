import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Star, StarFilled, Pencil, Trash, Plus } from "@/components/ui/icons";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import config from "@/config";

const API_URL = config.API_URL;

// Form schema using Zod for validation
const accountFormSchema = z
  .object({
    username: z.string().min(5, {
      message: "Username must be at least 5 characters.",
    }),
    email: z.email({
      message: "Please enter a valid email address.",
    }),
    currentPassword: z
      .string()
      .min(8, {
        message: "Password must be at least 8 characters.",
      })
      .optional(),
    newPassword: z
      .string()
      .min(8, {
        message: "Password must be at least 8 characters.",
      })
      .optional(),
    confirmNewPassword: z
      .string()
      .min(8, {
        message: "Password must be at least 8 characters.",
      })
      .optional(),
    avatar: z.url().optional(),
    twoFactor: z.boolean(),
    notifications: z.enum(["all", "transactions", "none"]),
  })
  .refine(
    (data) => {
      if (data.newPassword) {
        return data.newPassword === data.confirmNewPassword;
      }
      return true;
    },
    {
      message: "Passwords don't match",
      path: ["confirmNewPassword"],
    }
  );

//The type in the form fields
type AccountFormValues = z.infer<typeof accountFormSchema>;

const defaultValues: Partial<AccountFormValues> = {
  username: "",
  email: "",
  twoFactor: false,
  notifications: "all",
  avatar: "https://github.com/shadcn.png",
};

export default function AccountPage() {
  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues,
  });

  const getAccountSettings = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/v1/accounts/get`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      if (data.success && data.account) {
        return data.account;
      } else {
        return defaultValues;
      }
    } catch (error) {
      console.error("Error fetching account settings:", error);
    }
  };

  useEffect(() => {
    const fetchAccountSettings = async () => {
      try {
        const data = await getAccountSettings();
        console.log("data", data);
        form.reset(data);
      } catch (error) {
        console.error("Error fetching account settings:", error);
      }
    };

    fetchAccountSettings();
  }, [form]);

  // function onSubmit(data: AccountFormValues) {
  //   console.log("Account settings saved:", data);
  //   // Here you would typically send the data to your backend
  // }

  const onSubmit = async (data: AccountFormValues) => {
    const token = localStorage.getItem("token");
    // if (!token) {
    //   navigate("/login");
    //   return;
    // }

    console.log("data:", data);

    const response = await fetch(`${API_URL}/api/v1/accounts/set`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (result.success) {
      toast.info("Account settings saved successfully");
    } else {
      toast.error("Error in saving the account settings");
    }
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
          <div className="p-4 lg:p-6">
            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mb-6">
              Account Settings
            </h3>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8">
                {/* Profile Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Profile Information</h4>

                    <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={form.watch("avatar")} />
                        <AvatarFallback>
                          {form.watch("username")?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <Button variant="outline" type="button">
                          Change Avatar
                        </Button>
                        <FormDescription>
                          JPG, GIF or PNG. Max size of 2MB
                        </FormDescription>
                      </div>
                    </div>

                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input placeholder="Your username" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="Your email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Security Section */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Security</h4>

                    <FormField
                      control={form.control}
                      name="currentPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Your current password"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>New Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Leave blank to keep current"
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="confirmNewPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm New Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Confirm your new password"
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <Separator />

                {/* Preferences Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Two-Factor Authentication</h4>

                    <FormField
                      control={form.control}
                      name="twoFactor"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Enable 2FA
                            </FormLabel>
                            <FormDescription>
                              Add an extra layer of security to your account
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    {form.watch("twoFactor") && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium">
                          Scan this QR code with your authenticator app
                        </p>
                        <div className="p-4 bg-white rounded-md inline-block">
                          {/* Placeholder for QR code - in a real app this would be generated */}
                          <div className="w-32 h-32 bg-gray-200 flex items-center justify-center">
                            <span className="text-xs text-gray-500">
                              QR Code
                            </span>
                          </div>
                        </div>
                        <FormDescription>
                          Or enter this code manually:{" "}
                          <strong>SATO-1234-5678</strong>
                        </FormDescription>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Notification Preferences</h4>

                    <FormField
                      control={form.control}
                      name="notifications"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Notification Level</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select notification preference" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="all">
                                All Transactions
                              </SelectItem>
                              <SelectItem value="transactions">
                                Transactions only
                              </SelectItem>
                              <SelectItem value="none">
                                No notifications
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Control which notifications you receive
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-4">
                  <Button variant="outline" type="button">
                    Cancel
                  </Button>
                  <Button type="submit">Save Changes</Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
