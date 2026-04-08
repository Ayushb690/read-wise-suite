import { useLibraryStore } from "@/lib/library-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ReportsPage() {
  const { books, members, transactions, purchaseOrders } = useLibraryStore();
  const overdue = transactions.filter(t => t.status === 'overdue');
  const issued = transactions.filter(t => t.status === 'active' || t.status === 'overdue');
  const totalFines = transactions.reduce((s, t) => s + t.fine, 0);
  const totalStock = books.reduce((s, b) => s + b.totalCopies, 0);
  const damagedBooks = books.filter(b => b.condition === 'damaged' || b.condition === 'lost');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold">Reports</h1>
        <p className="text-muted-foreground mt-1">Library analytics and reports</p>
      </div>

      <Tabs defaultValue="issued">
        <TabsList>
          <TabsTrigger value="issued">Issued Books ({issued.length})</TabsTrigger>
          <TabsTrigger value="overdue">Overdue ({overdue.length})</TabsTrigger>
          <TabsTrigger value="stock">Stock Summary</TabsTrigger>
          <TabsTrigger value="purchases">Purchase History</TabsTrigger>
          <TabsTrigger value="inventory">Inventory Issues</TabsTrigger>
        </TabsList>

        <TabsContent value="issued">
          <Card>
            <CardHeader><CardTitle>Currently Issued Books</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader><TableRow><TableHead>Book</TableHead><TableHead>Member</TableHead><TableHead>Issue Date</TableHead><TableHead>Due Date</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
                <TableBody>
                  {issued.map(tx => (
                    <TableRow key={tx.id}>
                      <TableCell className="font-medium">{tx.bookTitle}</TableCell>
                      <TableCell>{tx.memberName}</TableCell>
                      <TableCell>{tx.issueDate}</TableCell>
                      <TableCell>{tx.dueDate}</TableCell>
                      <TableCell><Badge variant={tx.status === 'overdue' ? 'destructive' : 'default'} className="capitalize">{tx.status}</Badge></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="overdue">
          <Card>
            <CardHeader>
              <CardTitle>Overdue Books</CardTitle>
              <p className="text-sm text-muted-foreground">Total fines: <span className="font-bold text-destructive">${totalFines}</span></p>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader><TableRow><TableHead>Book</TableHead><TableHead>Member</TableHead><TableHead>Due Date</TableHead><TableHead>Fine</TableHead></TableRow></TableHeader>
                <TableBody>
                  {overdue.map(tx => (
                    <TableRow key={tx.id}>
                      <TableCell className="font-medium">{tx.bookTitle}</TableCell>
                      <TableCell>{tx.memberName}</TableCell>
                      <TableCell>{tx.dueDate}</TableCell>
                      <TableCell className="text-destructive font-semibold">${tx.fine}</TableCell>
                    </TableRow>
                  ))}
                  {overdue.length === 0 && <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">No overdue books</TableCell></TableRow>}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stock">
          <Card>
            <CardHeader>
              <CardTitle>Stock Summary</CardTitle>
              <p className="text-sm text-muted-foreground">Total: {totalStock} copies across {books.length} titles</p>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader><TableRow><TableHead>Subject</TableHead><TableHead>Titles</TableHead><TableHead>Total Copies</TableHead><TableHead>Available</TableHead></TableRow></TableHeader>
                <TableBody>
                  {Object.entries(books.reduce((acc, b) => {
                    if (!acc[b.subject]) acc[b.subject] = { titles: 0, total: 0, available: 0 };
                    acc[b.subject].titles++;
                    acc[b.subject].total += b.totalCopies;
                    acc[b.subject].available += b.availableCopies;
                    return acc;
                  }, {} as Record<string, { titles: number; total: number; available: number }>)).map(([subject, data]) => (
                    <TableRow key={subject}>
                      <TableCell className="font-medium">{subject}</TableCell>
                      <TableCell>{data.titles}</TableCell>
                      <TableCell>{data.total}</TableCell>
                      <TableCell>{data.available}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="purchases">
          <Card>
            <CardHeader><CardTitle>Purchase History</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader><TableRow><TableHead>Order</TableHead><TableHead>Vendor</TableHead><TableHead>Date</TableHead><TableHead>Amount</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
                <TableBody>
                  {purchaseOrders.map(po => (
                    <TableRow key={po.id}>
                      <TableCell className="font-mono">{po.id}</TableCell>
                      <TableCell className="font-medium">{po.vendor}</TableCell>
                      <TableCell>{po.orderDate}</TableCell>
                      <TableCell className="font-semibold">${po.totalAmount}</TableCell>
                      <TableCell><Badge className="capitalize">{po.status}</Badge></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory">
          <Card>
            <CardHeader><CardTitle>Damaged & Lost Books</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader><TableRow><TableHead>Book</TableHead><TableHead>Author</TableHead><TableHead>Condition</TableHead><TableHead>Location</TableHead></TableRow></TableHeader>
                <TableBody>
                  {damagedBooks.map(b => (
                    <TableRow key={b.id}>
                      <TableCell className="font-medium">{b.title}</TableCell>
                      <TableCell>{b.author}</TableCell>
                      <TableCell><Badge variant="destructive" className="capitalize">{b.condition}</Badge></TableCell>
                      <TableCell>{b.location}</TableCell>
                    </TableRow>
                  ))}
                  {damagedBooks.length === 0 && <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">No damaged or lost books</TableCell></TableRow>}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
