import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "sonner";
import { Button as ShadcnButton } from "@/components/ui/button";
import { Loader2Icon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DataTable as SecondaryDatatable } from "@components/data-table";
function Button({ loading, children, ...props }) {
  return (
    <ShadcnButton disabled={loading} {...props}>
      {loading && <Loader2Icon className="animate-spin" />}
      {children}
    </ShadcnButton>
  );
}

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = {
        user: {
          email,
          password,
        },
      };

      const response = await fetch("https://satolink.com/api/v1/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result?.success) {
        toast.success("Event has been created");
        localStorage.setItem("token", result.token);
        navigate("/dashboard");
        setUser("");
        setPassword("");
      } else {
        toast.error("Error in login", {
          description: result.message,
        });
      }
    } catch (error) {
      toast("Error in login.", {
        description: error.message,
      });
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-form">
      {/* <img src="/264.avif" alt="background" className="login-background" /> */}
      <div
        className={cn("flex flex-col gap-6", className)}
        {...props}
        style={{
          maxWidth: "30rem",
          maxHeight: "30rem",
          width: "100%",
          height: "100%",
          zIndex: "99",
        }}>
        <Toaster position="top-center" />
        <img className="login-logo" src="/263.avif" alt="logo" />
        <Card>
          <CardHeader>
            <CardTitle>Login to your account</CardTitle>
          </CardHeader>
          <CardContent>
            <form>
              <div className="flex flex-col gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="m@example.com"
                    required
                  />
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <a
                      href="#"
                      className="ml-auto inline-block text-sm underline-offset-4 hover:underline">
                      Forgot your password?
                    </a>
                  </div>
                  <Input
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    required
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <Button
                    onClick={handleSubmit}
                    loading={loading}
                    type="submit"
                    className="w-full">
                    Login
                  </Button>
                  {/* <Button variant="outline" className="w-full">
                    Login with Google
                  </Button> */}
                </div>
              </div>
              <div className="mt-4 text-center text-sm">
                Don&apos;t have an account?{" "}
                <a href="#" className="underline underline-offset-4">
                  Sign up
                </a>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
