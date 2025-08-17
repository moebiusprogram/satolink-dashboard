import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { Toaster, toast } from "sonner";
import { Button as ShadcnButton } from "@/components/ui/button";
import { Loader2Icon, CheckCircle2Icon } from "lucide-react";
import { useAtom } from "jotai";
import {
  emailAtom,
  usernameAtom,
  accountIDAtom,
  avatarAtom,
} from "@/store/users";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
  const [emailField, setEmailField] = useState("");
  const [passwordField, setPasswordField] = useState("");
  const [loading, setLoading] = useState(false);
  const [, setEmail] = useAtom(emailAtom);
  const [, setUsername] = useAtom(usernameAtom);
  const [, setAccountID] = useAtom(accountIDAtom);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const registrationSuccess = searchParams.get("registration") === "success";

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
      if (!emailField || !passwordField) {
        toast.error("Please enter email and password");
        return;
      }

      const data = {
        user: {
          email: emailField,
          password: passwordField,
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
        localStorage.setItem("token", result.token);
        setUsername(`${result.firstname} ${result.lastname}`);
        setEmail(result.email);
        setAccountID(`${result.accountID}`);
        setEmailField("");
        setPasswordField("");
        navigate("/dashboard");
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
          <CardHeader className="text-center">
            <CardTitle>Login to your account</CardTitle>
          </CardHeader>
          {registrationSuccess && (
            <div className="flex justify-center ml-6 mr-6">
              <Alert style={{ backgroundColor: "white", color: "black" }}>
                <CheckCircle2Icon style={{ color: "green" }} />
                <AlertTitle style={{ color: "green" }}>Great News!</AlertTitle>
                <AlertDescription style={{ color: "gray" }}>
                  Your account is ready to go
                </AlertDescription>
              </Alert>
            </div>
          )}
          <CardContent>
            <form>
              <div className="flex flex-col gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={emailField}
                    onChange={(e) => setEmailField(e.target.value)}
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
                    value={passwordField}
                    onChange={(e) => setPasswordField(e.target.value)}
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
                <Link className="underline underline-offset-4" to="/signup">
                  Sign up
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
