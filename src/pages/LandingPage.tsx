import { useState } from "react";
import { BookOpen, GraduationCap, UserCog, Shield } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuthStore, UserRole } from "@/lib/auth-store";
import { useToast } from "@/hooks/use-toast";

const roles: { value: UserRole; label: string; description: string; icon: React.ElementType; color: string }[] = [
  { value: "student", label: "Student", description: "Search books, check availability & view history", icon: GraduationCap, color: "bg-primary/10 text-primary" },
  { value: "staff", label: "Staff", description: "Manage transactions & view reports", icon: UserCog, color: "bg-accent/10 text-accent" },
  { value: "admin", label: "Librarian", description: "Full library management access", icon: Shield, color: "bg-destructive/10 text-destructive" },
];

export default function LandingPage() {
  const [selectedRole, setSelectedRole] = useState<UserRole>("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const login = useAuthStore((s) => s.login);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const error = login(email, password, selectedRole);
    if (error) {
      toast({ title: "Login failed", description: error, variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hero header */}
      <header className="border-b bg-card">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-display font-bold text-foreground">E-Library</h1>
            <p className="text-xs text-muted-foreground">Management System</p>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-5xl grid md:grid-cols-2 gap-10 items-center">
          {/* Left — Info */}
          <div className="space-y-6">
            <div>
              <h2 className="text-4xl font-display font-bold text-foreground leading-tight">
                Welcome to the<br />
                <span className="text-primary">Digital Library</span>
              </h2>
              <p className="text-muted-foreground mt-3 text-lg leading-relaxed">
                A modern library management platform for students, staff, and librarians.
                Search books, manage transactions, and track inventory — all in one place.
              </p>
            </div>
            <div className="grid gap-3">
              {roles.map((r) => (
                <div key={r.value} className="flex items-start gap-3 p-3 rounded-lg border bg-card">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${r.color}`}>
                    <r.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-foreground">{r.label}</p>
                    <p className="text-xs text-muted-foreground">{r.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Login card */}
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-display">Sign In</CardTitle>
              <CardDescription>Select your role and enter credentials</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Role selector */}
                <div className="grid grid-cols-3 gap-2">
                  {roles.map((r) => (
                    <button
                      key={r.value}
                      type="button"
                      onClick={() => setSelectedRole(r.value)}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border-2 transition-all text-center ${
                        selectedRole === r.value
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-muted-foreground/30"
                      }`}
                    >
                      <r.icon className={`w-5 h-5 ${selectedRole === r.value ? "text-primary" : "text-muted-foreground"}`} />
                      <span className={`text-xs font-medium ${selectedRole === r.value ? "text-primary" : "text-muted-foreground"}`}>
                        {r.label}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="you@university.edu" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} />
                  </div>
                </div>

                <Button type="submit" className="w-full" size="lg">
                  Sign In as {roles.find((r) => r.value === selectedRole)?.label}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  Demo mode — any email & password will work
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="border-t bg-card py-4 text-center text-xs text-muted-foreground">
        © 2026 E-Library Management System. All rights reserved.
      </footer>
    </div>
  );
}
