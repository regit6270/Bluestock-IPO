import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ChartLine, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { setToken, setUser } from "@/lib/auth";
import { apiRequest } from "@/lib/queryClient";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function AdminLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      const response = await apiRequest('POST', '/api/auth/login', data);
      const result = await response.json();
      
      // Store auth data
      setToken(result.token);
      setUser(result.user);
      
      toast({
        title: "Login Successful",
        description: "Welcome to the admin dashboard!",
      });
      
      setLocation('/admin/dashboard');
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid credentials",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4" data-testid="login-page">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-bluestock-500 to-orange-500 rounded-lg flex items-center justify-center">
              <ChartLine className="text-white" size={16} />
            </div>
            <span className="text-2xl font-bold text-white">BLUESTOCK</span>
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-black border border-gray-800 rounded-lg p-6 space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Email Field */}
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">Email Address</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder="johndoe@gmail.com"
                        className="bg-gray-900 border-gray-700 text-white placeholder-gray-400 focus:border-bluestock-500"
                        data-testid="input-username"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password Field */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel className="text-gray-300">Password</FormLabel>
                      <button
                        type="button"
                        className="text-bluestock-500 text-sm hover:underline"
                        data-testid="link-forgot-password"
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••••••"
                          className="bg-gray-900 border-gray-700 text-white placeholder-gray-400 focus:border-bluestock-500 pr-12"
                          data-testid="input-password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                          data-testid="button-toggle-password"
                        >
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Keep me signed in */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="keep-signed-in"
                  className="w-4 h-4 text-bluestock-500 border-gray-600 rounded focus:ring-bluestock-500 bg-gray-900"
                  data-testid="checkbox-keep-signed-in"
                />
                <Label htmlFor="keep-signed-in" className="text-gray-300 text-sm">
                  Keep me signed in
                </Label>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-bluestock-500 hover:bg-bluestock-600 text-white font-medium py-3 rounded-lg transition-colors"
                data-testid="button-login"
              >
                {isLoading ? "Signing in..." : "Login"}
              </Button>
            </form>
          </Form>

          {/* Divider */}
          <div className="flex items-center space-x-4">
            <div className="flex-1 h-px bg-gray-700"></div>
            <span className="text-gray-400 text-sm">or sign in with</span>
            <div className="flex-1 h-px bg-gray-700"></div>
          </div>

          {/* Google Sign In */}
          <Button
            variant="outline"
            className="w-full border-gray-700 text-gray-300 hover:bg-gray-900"
            data-testid="button-google-signin"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </Button>

          {/* Create Account Link */}
          <div className="text-center">
            <span className="text-gray-400 text-sm">Don't have an account? </span>
            <button
              type="button"
              className="text-bluestock-500 text-sm hover:underline"
              data-testid="link-create-account"
            >
              Create an account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
