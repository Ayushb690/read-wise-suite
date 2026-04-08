import { useLibraryStore } from "@/lib/library-store";
import { useAuthStore } from "@/lib/auth-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Users, ArrowLeftRight, AlertTriangle } from "lucide-react";
import { calculateFine } from "@/lib/data";

export default function StaffDashboard() {
  const { books, members, transactions } = useLibraryStore();
  const user = useAuthStore((s) => s.user);

  const activeTransactions = transactions.filter((t) => t.status === "active" || t.status === "overdue");
  const overdueTransactions = transactions.filter((t) => t.status === "overdue");
  const totalBooks = books.reduce((s, b) => s + b.totalCopies, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold">Staff Portal</h1>
        <p className="text-muted-foreground mt-1">Welcome, {user?.name} — View transactions & reports</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalBooks}</p>
              <p className="text-xs text-muted-foreground">Total Books</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold">{members.length}</p>
              <p className="text-xs text-muted-foreground">Members</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <ArrowLeftRight className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{activeTransactions.length}</p>
              <p className="text-xs text-muted-foreground">Active Loans</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold">{overdueTransactions.length}</p>
              <p className="text-xs text-muted-foreground">Overdue</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent transactions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {transactions.slice(-10).reverse().map((t) => (
              <div key={t.id} className="flex items-center justify-between p-3 rounded border">
                <div>
                  <p className="font-medium text-sm">{t.bookTitle}</p>
                  <p className="text-xs text-muted-foreground">{t.memberName} · {t.type} · {t.issueDate}</p>
                </div>
                <div className="flex items-center gap-2">
                  {t.fine > 0 && <Badge variant="destructive">${t.fine}</Badge>}
                  <Badge variant={t.status === "returned" ? "secondary" : t.status === "overdue" ? "destructive" : "outline"}>
                    {t.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Overdue list */}
      {overdueTransactions.length > 0 && (
        <Card className="border-destructive/30">
          <CardHeader>
            <CardTitle className="text-lg text-destructive">Overdue Books</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {overdueTransactions.map((t) => (
                <div key={t.id} className="flex items-center justify-between p-3 rounded border border-destructive/20 bg-destructive/5">
                  <div>
                    <p className="font-medium text-sm">{t.bookTitle}</p>
                    <p className="text-xs text-muted-foreground">{t.memberName} · Due: {t.dueDate}</p>
                  </div>
                  <Badge variant="destructive">${calculateFine(t.dueDate)} fine</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
