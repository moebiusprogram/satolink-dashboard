import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAtom } from "jotai";
import { settingsAtom } from "@/store/settings";
import { useNavigate } from "react-router-dom";
import { getByType } from "@/api/connections";
import { toast } from "react-toastify";

// Form schema using Zod for validation
const settingsFormSchema = z.object({
  maxUSDT: z.string,
  minUSDT: z.string,
  maxBTC: z.string,
  minBTC: z.string,
  saveTransactionHist: z.boolean(),
  lightningActive: z.boolean(),
  taprootActive: z.boolean(),
  twoFactor: z.boolean(),
  emailNotifications: z.boolean(),
});

type SettingsFormValues = z.infer<typeof settingsFormSchema>;

// Default values
const defaultValues: Partial<SettingsFormValues> = {
  maxUSDT: "1000",
  minUSDT: "1",
  maxBTC: "0.1",
  minBTC: "0.00001",
  saveTransactionHist: true,
  lightningActive: true,
  taprootActive: true,
  twoFactor: false,
  emailNotifications: true,
};

export default function SettingsPage() {
  const [settings, setSettings] = useAtom(settingsAtom);
  const navigate = useNavigate();

  useEffect(() => {
    getByType("settings", navigate)
      .then((list) => {
        setSettings(list);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [setSettings, navigate]);

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: settings || defaultValues,
  });

  const onSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const booleanFields = [
      "saveTransactionHist",
      "twoFactor",
      "emailNotifications",
      "pushNotifications",
      "smsNotifications",
      "lightningActive",
      "taprootActive",
    ];

    for (const field of booleanFields) {
      settings[field] = settings[field] ? "true" : "false";
    }

    console.log("Settings saved:", settings);

    const response = await fetch("https://satolink.com/api/v1/settings/set", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(settings),
    });

    const result = await response.json();

    //const result = { success: true };

    if (result.success) {
      toast.info("Settings saved successfully");
    } else {
      toast.error("Error in saving settings");
    }
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
          <div className="p-4 lg:p-6">
            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mb-6">
              Satolink Settings
            </h3>

            <Form {...form}>
              <form className="space-y-8">
                {/* Transaction Limits Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Transaction Limits</h4>

                    <FormField
                      control={form.control}
                      name="maxUSDT"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Max USDT Transaction</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              value={settings?.maxUSDT}
                              onChange={(e) =>
                                setSettings({
                                  ...settings,
                                  maxUSDT: e.target.value,
                                })
                              }
                            />
                          </FormControl>
                          <FormDescription>
                            Maximum USDT amount per transaction
                          </FormDescription>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="minUSDT"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Min USDT Transaction</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              value={settings.minUSDT}
                              onChange={(e) =>
                                setSettings({
                                  ...settings,
                                  minUSDT: e.target.value,
                                })
                              }
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="maxBTC"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Max BTC Transaction</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              value={settings.maxBTC}
                              onChange={(e) =>
                                setSettings({
                                  ...settings,
                                  maxBTC: e.target.value,
                                })
                              }
                            />
                          </FormControl>
                          <FormDescription>
                            Maximum BTC amount per transaction
                          </FormDescription>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="minBTC"
                      render={() => (
                        <FormItem>
                          <FormLabel>Min BTC Transaction</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              value={settings.minBTC}
                              onChange={(e) =>
                                setSettings({
                                  ...settings,
                                  minBTC: e.target.value,
                                })
                              }
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Privacy & Security Section */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Privacy & Security</h4>

                    <FormField
                      control={form.control}
                      name="saveTransactionHist"
                      render={() => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Save Transaction History
                            </FormLabel>
                            <FormDescription>
                              Allow Satolink to store your transaction records
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={settings.saveTransactionHist}
                              onCheckedChange={(e) =>
                                setSettings({
                                  ...settings,
                                  saveTransactionHist:
                                    !settings.saveTransactionHist,
                                })
                              }
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="twoFactor"
                      render={() => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Two-Factor Authentication
                            </FormLabel>
                            <FormDescription>
                              Extra security layer for your account
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={settings.twoFactor}
                              onCheckedChange={(e) =>
                                setSettings({
                                  ...settings,
                                  twoFactor: !settings.twoFactor,
                                })
                              }
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="emailNotifications"
                      render={() => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Email Notifications
                            </FormLabel>
                            <FormDescription>
                              Receive email alerts for transactions
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={settings.emailNotifications}
                              onCheckedChange={(e) =>
                                setSettings({
                                  ...settings,
                                  emailNotifications:
                                    !settings.emailNotifications,
                                })
                              }
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Network Settings Section */}
                <div className="space-y-4">
                  <h4 className="font-medium">Network Preferences</h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="lightningActive"
                      render={() => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Lightning Network
                            </FormLabel>
                            <FormDescription>
                              Enable fast BTC transactions
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={settings.lightningActive}
                              onCheckedChange={(e) =>
                                setSettings({
                                  ...settings,
                                  lightningActive: !settings.lightningActive,
                                })
                              }
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="taprootActive"
                      render={() => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Taproot (USDT)
                            </FormLabel>
                            <FormDescription>
                              Enable Taproot addresses for USDT
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={settings.taprootActive}
                              onCheckedChange={(e) =>
                                setSettings({
                                  ...settings,
                                  taprootActive: !settings.taprootActive,
                                })
                              }
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={onSubmit}>Save Settings</Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
