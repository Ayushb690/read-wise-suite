import { useLibraryStore } from "@/lib/library-store";
import { useAuthStore } from "@/lib/auth-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock, AlertTriangle, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { calculateFine } from "@/lib/data";

export default function StudentDashboard() {
  const { books, transactions, searchBooks } = useLibraryStore();
  const user = useAuthStore((s) => s.user);
  const [query, setQuery] = useState("");

  const myTransactions = transactions.filter((t) => t.memberId === user?.id);
  const activeLoans = myTransactions.filter((t) => t.status === "active" || t.status === "overdue");
  const overdueLoans = myTransactions.filter((t) => t.status === "overdue");
  const searchResults = query.length >= 2 ? searchBooks(query) : [];

  // Due-date reminders: loans due within 3 days
  const today = new Date();
  const reminders = activeLoans.filter((t) => {
    const due = new Date(t.dueDate);
    const diff = Math.floor((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff <= 3 && diff >= 0;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold">Welcome, {user?.name}</h1>
        <p className="text-muted-foreground mt-1">Student Portal — Search books, view history & reminders</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{activeLoans.length}</p>
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
              <p className="text-2xl font-bold">{overdueLoans.length}</p>
              <p className="text-xs text-muted-foreground">Overdue</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold">{reminders.length}</p>
              <p className="text-xs text-muted-foreground">Due Soon</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Due-date reminders */}
      {reminders.length > 0 && (
        <Card className="border-warning/50 bg-warning/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="w-4 h-4 text-warning" /> Due-Date Reminders
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {reminders.map((t) => {
              const daysLeft = Math.floor((new Date(t.dueDate).getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
              return (
                <div key={t.id} className="flex justify-between items-center p-2 rounded bg-card border">
                  <div>
                    <p className="font-medium text-sm">{t.bookTitle}</p>
                    <p className="text-xs text-muted-foreground">Due: {t.dueDate}</p>
                  </div>
                  <Badge variant={daysLeft === 0 ? "destructive" : "outline"}>
                    {daysLeft === 0 ? "Due today" : `${daysLeft} day${daysLeft > 1 ? "s" : ""} left`}
                  </Badge>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Book search */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Search Books</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative max-w-xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search by title, author, subject or ISBN..." className="pl-10" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          {query.length >= 2 && (
            <p className="text-sm text-muted-foreground">{searchResults.length} result{searchResults.length !== 1 ? "s" : ""}</p>
          )}
          <div className="grid gap-2 max-h-64 overflow-auto">
            {searchResults.map((book) => (
              <div key={book.id} className="flex items-center justify-between p-3 rounded border bg-card">
                <div>
                  <p className="font-medium text-sm">{book.title}</p>
                  <p className="text-xs text-muted-foreground">{book.author} · {book.subject}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{book.availableCopies}/{book.totalCopies}</p>
                  <p className="text-xs text-muted-foreground">available</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Borrowing history */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Borrowing History</CardTitle>
        </CardHeader>
        <CardContent>
          {myTransactions.length === 0 ? (
            <p className="text-sm text-muted-foreground">No borrowing history yet.</p>
          ) : (
            <div className="space-y-2">
              {myTransactions.map((t) => (
                <div key={t.id} className="flex items-center justify-between p-3 rounded border">
                  <div>
                    <p className="font-medium text-sm">{t.bookTitle}</p>
                    <p className="text-xs text-muted-foreground">Issued: {t.issueDate} · Due: {t.dueDate}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {t.fine > 0 && <Badge variant="destructive">${t.fine} fine</Badge>}
                    <Badge variant={t.status === "returned" ? "secondary" : t.status === "overdue" ? "destructive" : "outline"}>
                      {t.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
