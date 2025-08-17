import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useNavigate, Link } from "react-router-dom";
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

function Button({ loading, children, ...props }) {
  return (
    <ShadcnButton disabled={loading} {...props}>
      {loading && <Loader2Icon className="animate-spin" />}
      {children}
    </ShadcnButton>
  );
}

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
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
      if (!firstname || !lastname || !email || !password) {
        toast.error(
          "All fields are required. Please fill them out and try again."
        );
        return;
      }
      const data = {
        user: {
          firstname,
          lastname,
          email,
          password,
        },
      };

      const response = await fetch("https://satolink.com/api/v1/user/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result?.success) {
        toast.success("Signup completed successfully");
        navigate("/login?registration=success");
        setEmail("");
        setFirstname("");
        setLastname("");
        setPassword("");
      } else {
        toast.error("Error in signup", {
          description: result.message,
        });
      }
    } catch (error) {
      toast("Error in signup.", {
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
            <CardTitle>Register a new account</CardTitle>
          </CardHeader>
          <CardContent>
            <form>
              <div className="flex flex-col gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="firstname">First Name</Label>
                  <Input
                    id="firstname"
                    type="text"
                    value={firstname}
                    onChange={(e) => setFirstname(e.target.value)}
                    placeholder="john"
                    required
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="lastname">Last Name</Label>
                  <Input
                    id="lastname"
                    type="text"
                    value={lastname}
                    onChange={(e) => setLastname(e.target.value)}
                    placeholder="doe"
                    required
                  />
                </div>
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
                    Sign Up
                  </Button>
                  {/* <Button variant="outline" className="w-full">
                    Login with Google
                  </Button> */}
                </div>
              </div>
              <div className="mt-4 text-center text-sm">
                Already have an account?{" "}
                <Link to="/login" className="underline underline-offset-4">
                  Login
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
