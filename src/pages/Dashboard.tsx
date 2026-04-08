import { BookOpen, Users, ArrowLeftRight, AlertTriangle, TrendingUp, Clock } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { useLibraryStore } from "@/lib/library-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function Dashboard() {
  const { books, members, transactions } = useLibraryStore();
  const totalBooks = books.reduce((s, b) => s + b.totalCopies, 0);
  const activeMembers = members.filter(m => m.status === 'active').length;
  const activeTransactions = transactions.filter(t => t.status === 'active' || t.status === 'overdue');
  const overdueCount = transactions.filter(t => t.status === 'overdue').length;
  const totalFines = transactions.reduce((s, t) => s + t.fine, 0);
  const recentTx = [...transactions].reverse().slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Overview of library operations</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Books" value={totalBooks} icon={BookOpen} variant="primary" description={`${books.length} unique titles`} />
        <StatCard title="Active Members" value={activeMembers} icon={Users} variant="success" description={`${members.length} total members`} />
        <StatCard title="Books Issued" value={activeTransactions.length} icon={ArrowLeftRight} variant="default" />
        <StatCard title="Overdue Books" value={overdueCount} icon={AlertTriangle} variant={overdueCount > 0 ? 'destructive' : 'default'} description={totalFines > 0 ? `$${totalFines} in fines` : undefined} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Clock className="w-4 h-4" /> Recent Transactions</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Book</TableHead>
                  <TableHead>Member</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentTx.map(tx => (
                  <TableRow key={tx.id}>
                    <TableCell className="font-medium text-sm">{tx.bookTitle}</TableCell>
                    <TableCell className="text-sm">{tx.memberName}</TableCell>
                    <TableCell><Badge variant="outline" className="capitalize">{tx.type}</Badge></TableCell>
                    <TableCell>
                      <Badge variant={tx.status === 'overdue' ? 'destructive' : tx.status === 'returned' ? 'secondary' : 'default'} className="capitalize">{tx.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><TrendingUp className="w-4 h-4" /> Low Stock & Issues</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {books.filter(b => b.status !== 'available' || b.condition === 'damaged').map(b => (
                <div key={b.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="text-sm font-medium">{b.title}</p>
                    <p className="text-xs text-muted-foreground">{b.author}</p>
                  </div>
                  <div className="flex gap-2">
                    {b.status === 'out-of-stock' && <Badge variant="destructive">Out of stock</Badge>}
                    {b.status === 'low-stock' && <Badge className="bg-warning text-warning-foreground">Low stock</Badge>}
                    {b.condition === 'damaged' && <Badge variant="outline" className="border-destructive text-destructive">Damaged</Badge>}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
