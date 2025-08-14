import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, EyeOff, TrendingUp, Shield, BarChart3, CheckCircle } from "lucide-react";
import LoadingScreen from "@/components/loading-screen";

export default function AuthPage() {
  const { user, loginMutation, registerMutation } = useAuth();
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Login form state
  const [loginForm, setLoginForm] = useState({
    username: "",
    password: "",
    rememberMe: false
  });

  // Registration form state
  const [registerForm, setRegisterForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      setLocation("/");
    }
  }, [user, setLocation]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await loginMutation.mutateAsync({
        username: loginForm.username,
        password: loginForm.password
      });
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (registerForm.password !== registerForm.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    
    setIsLoading(true);
    
    try {
      await registerMutation.mutateAsync({
        username: registerForm.username,
        email: registerForm.email,
        password: registerForm.password
      });
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (user) return null;

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-bluestock-primary to-bluestock-secondary p-12 flex-col justify-center">
        <div className="max-w-md">
          <div className="flex items-center mb-8">
            <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center mr-4">
              <TrendingUp className="text-bluestock-primary text-2xl" />
            </div>
            <h1 className="text-3xl font-bold text-white">
              BLUESTOCK<span className="text-sm align-top">™</span>
              <span className="text-bluestock-accent">.in</span>
            </h1>
          </div>
          <h2 className="text-4xl font-bold text-white mb-6">
            Welcome to IPO Admin Dashboard
          </h2>
          <p className="text-white/80 text-lg leading-relaxed mb-8">
            Manage IPO listings, track performance metrics, and oversee the complete IPO lifecycle with our comprehensive admin platform.
          </p>
          <div className="space-y-4">
            <div className="flex items-center text-white/90">
              <CheckCircle className="mr-3 w-5 h-5" />
              <span>Complete IPO Management</span>
            </div>
            <div className="flex items-center text-white/90">
              <BarChart3 className="mr-3 w-5 h-5" />
              <span>Real-time Analytics</span>
            </div>
            <div className="flex items-center text-white/90">
              <Shield className="mr-3 w-5 h-5" />
              <span>Secure Authentication</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Forms */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-12 lg:px-16">
        <div className="max-w-md mx-auto w-full">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center mb-8">
            <div className="w-12 h-12 bg-gradient-to-r from-bluestock-primary to-bluestock-secondary rounded-lg flex items-center justify-center mr-3">
              <TrendingUp className="text-white text-xl" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">
              BLUESTOCK<span className="text-sm align-top">™</span>
              <span className="text-bluestock-accent">.in</span>
            </h1>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Sign In</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            
            {/* Login Form */}
            <TabsContent value="login">
              <Card>
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">Sign In</CardTitle>
                  <CardDescription>Access your admin dashboard</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-username">Username</Label>
                      <Input
                        id="login-username"
                        type="text"
                        placeholder="Enter your username"
                        value={loginForm.username}
                        onChange={(e) => setLoginForm(prev => ({ ...prev, username: e.target.value }))}
                        required
                        data-testid="input-login-username"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="login-password">Password</Label>
                      <div className="relative">
                        <Input
                          id="login-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          value={loginForm.password}
                          onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                          required
                          data-testid="input-login-password"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-1/2 -translate-y-1/2"
                          onClick={() => setShowPassword(!showPassword)}
                          data-testid="button-toggle-password"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="remember"
                          checked={loginForm.rememberMe}
                          onChange={(e) => setLoginForm(prev => ({ ...prev, rememberMe: e.target.checked }))}
                          className="rounded border-gray-300"
                        />
                        <Label htmlFor="remember" className="text-sm">Remember me</Label>
                      </div>
                      <Button variant="link" className="text-sm text-bluestock-primary">
                        Forgot password?
                      </Button>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-bluestock-primary to-bluestock-secondary hover:from-bluestock-secondary hover:to-bluestock-primary"
                      disabled={loginMutation.isPending}
                      data-testid="button-login-submit"
                    >
                      {loginMutation.isPending ? "Signing In..." : "Sign In to Dashboard"}
                    </Button>
                  </form>

                  <div className="mt-6 p-4 bg-bluestock-light rounded-lg">
                    <p className="text-sm text-bluestock-gray text-center mb-2">Demo Admin Credentials:</p>
                    <p className="text-xs text-gray-600 text-center"><strong>Username:</strong> admin</p>
                    <p className="text-xs text-gray-600 text-center"><strong>Password:</strong> BlueStock@123</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Registration Form */}
            <TabsContent value="register">
              <Card>
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">Create Account</CardTitle>
                  <CardDescription>Register as a new admin user</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="register-username">Username</Label>
                      <Input
                        id="register-username"
                        type="text"
                        placeholder="Choose a username"
                        value={registerForm.username}
                        onChange={(e) => setRegisterForm(prev => ({ ...prev, username: e.target.value }))}
                        required
                        data-testid="input-register-username"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-email">Email Address</Label>
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="Enter your email address"
                        value={registerForm.email}
                        onChange={(e) => setRegisterForm(prev => ({ ...prev, email: e.target.value }))}
                        required
                        data-testid="input-register-email"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="register-password">Password</Label>
                      <Input
                        id="register-password"
                        type="password"
                        placeholder="Create a strong password"
                        value={registerForm.password}
                        onChange={(e) => setRegisterForm(prev => ({ ...prev, password: e.target.value }))}
                        required
                        minLength={8}
                        data-testid="input-register-password"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-confirm-password">Confirm Password</Label>
                      <Input
                        id="register-confirm-password"
                        type="password"
                        placeholder="Confirm your password"
                        value={registerForm.confirmPassword}
                        onChange={(e) => setRegisterForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        required
                        data-testid="input-register-confirm-password"
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-bluestock-primary to-bluestock-secondary hover:from-bluestock-secondary hover:to-bluestock-primary"
                      disabled={registerMutation.isPending}
                      data-testid="button-register-submit"
                    >
                      {registerMutation.isPending ? "Creating Account..." : "Create Admin Account"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
