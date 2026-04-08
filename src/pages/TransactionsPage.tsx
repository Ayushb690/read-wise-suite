import { useState } from "react";
import { useLibraryStore } from "@/lib/library-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, RotateCcw, Undo2 } from "lucide-react";
import { toast } from "sonner";

export default function TransactionsPage() {
  const { transactions, books, members, issueBook, returnBook, renewBook } = useLibraryStore();
  const [issueOpen, setIssueOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState("");
  const [selectedMember, setSelectedMember] = useState("");

  const handleIssue = () => {
    if (!selectedBook || !selectedMember) return toast.error("Select both book and member");
    const err = issueBook(selectedBook, selectedMember);
    if (err) return toast.error(err);
    setIssueOpen(false);
    setSelectedBook("");
    setSelectedMember("");
    toast.success("Book issued successfully");
  };

  const handleReturn = (txId: string) => {
    const fine = returnBook(txId);
    if (fine > 0) toast.warning(`Book returned with fine: $${fine}`);
    else toast.success("Book returned successfully");
  };

  const handleRenew = (txId: string) => {
    const err = renewBook(txId);
    if (err) return toast.error(err);
    toast.success("Book renewed for 14 more days");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold">Transactions</h1>
          <p className="text-muted-foreground mt-1">Issue, return, and renew books</p>
        </div>
        <Dialog open={issueOpen} onOpenChange={setIssueOpen}>
          <DialogTrigger asChild><Button><Plus className="w-4 h-4 mr-2" /> Issue Book</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Issue Book</DialogTitle></DialogHeader>
            <div className="grid gap-4">
              <div>
                <Label>Book</Label>
                <Select value={selectedBook} onValueChange={setSelectedBook}>
                  <SelectTrigger><SelectValue placeholder="Select a book" /></SelectTrigger>
                  <SelectContent>
                    {books.filter(b => b.availableCopies > 0).map(b => (
                      <SelectItem key={b.id} value={b.id}>{b.title} ({b.availableCopies} avail.)</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Member</Label>
                <Select value={selectedMember} onValueChange={setSelectedMember}>
                  <SelectTrigger><SelectValue placeholder="Select a member" /></SelectTrigger>
                  <SelectContent>
                    {members.filter(m => m.status === 'active').map(m => (
                      <SelectItem key={m.id} value={m.id}>{m.name} ({m.booksIssued}/{m.maxBooks})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleIssue}>Confirm Issue</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead><TableHead>Book</TableHead><TableHead>Member</TableHead>
                <TableHead>Type</TableHead><TableHead>Issue Date</TableHead><TableHead>Due Date</TableHead>
                <TableHead>Fine</TableHead><TableHead>Status</TableHead><TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...transactions].reverse().map(tx => (
                <TableRow key={tx.id}>
                  <TableCell className="font-mono text-xs">{tx.id}</TableCell>
                  <TableCell className="font-medium text-sm">{tx.bookTitle}</TableCell>
                  <TableCell className="text-sm">{tx.memberName}</TableCell>
                  <TableCell><Badge variant="outline" className="capitalize">{tx.type}</Badge></TableCell>
                  <TableCell className="text-sm">{tx.issueDate}</TableCell>
                  <TableCell className="text-sm">{tx.dueDate}</TableCell>
                  <TableCell>{tx.fine > 0 ? <span className="text-destructive font-semibold">${tx.fine}</span> : '-'}</TableCell>
                  <TableCell>
                    <Badge variant={tx.status === 'overdue' ? 'destructive' : tx.status === 'returned' ? 'secondary' : 'default'} className="capitalize">{tx.status}</Badge>
                  </TableCell>
                  <TableCell>
                    {tx.status !== 'returned' && (
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline" onClick={() => handleReturn(tx.id)}><Undo2 className="w-3 h-3 mr-1" /> Return</Button>
                        <Button size="sm" variant="ghost" onClick={() => handleRenew(tx.id)}><RotateCcw className="w-3 h-3 mr-1" /> Renew</Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
