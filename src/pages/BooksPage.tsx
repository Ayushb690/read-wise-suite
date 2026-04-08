import { useState } from "react";
import { useLibraryStore } from "@/lib/library-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";

export default function BooksPage() {
  const { books, addBook } = useLibraryStore();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const filtered = books.filter(b => {
    const q = search.toLowerCase();
    return b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q) || b.isbn.includes(q) || b.subject.toLowerCase().includes(q);
  });

  const handleAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    addBook({
      title: fd.get('title') as string,
      author: fd.get('author') as string,
      isbn: fd.get('isbn') as string,
      subject: fd.get('subject') as string,
      publisher: fd.get('publisher') as string,
      year: parseInt(fd.get('year') as string),
      totalCopies: parseInt(fd.get('copies') as string),
      availableCopies: parseInt(fd.get('copies') as string),
      location: fd.get('location') as string,
      condition: 'good',
    });
    setOpen(false);
    toast.success("Book added successfully");
  };

  const statusBadge = (status: string) => {
    if (status === 'out-of-stock') return <Badge variant="destructive">Out of stock</Badge>;
    if (status === 'low-stock') return <Badge className="bg-warning text-warning-foreground">Low stock</Badge>;
    return <Badge className="bg-success text-success-foreground">Available</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold">Books</h1>
          <p className="text-muted-foreground mt-1">Manage library book inventory</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="w-4 h-4 mr-2" /> Add Book</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add New Book</DialogTitle></DialogHeader>
            <form onSubmit={handleAdd} className="grid gap-3">
              {['title', 'author', 'isbn', 'subject', 'publisher', 'location'].map(f => (
                <div key={f}>
                  <Label className="capitalize">{f}</Label>
                  <Input name={f} required />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Year</Label><Input name="year" type="number" defaultValue={2024} required /></div>
                <div><Label>Copies</Label><Input name="copies" type="number" defaultValue={1} required /></div>
              </div>
              <Button type="submit" className="mt-2">Add Book</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search by title, author, ISBN, subject..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>ISBN</TableHead>
                <TableHead>Available</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Condition</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(b => (
                <TableRow key={b.id}>
                  <TableCell className="font-mono text-xs">{b.id}</TableCell>
                  <TableCell className="font-medium">{b.title}</TableCell>
                  <TableCell>{b.author}</TableCell>
                  <TableCell>{b.subject}</TableCell>
                  <TableCell className="font-mono text-xs">{b.isbn}</TableCell>
                  <TableCell>{b.availableCopies}/{b.totalCopies}</TableCell>
                  <TableCell>{statusBadge(b.status)}</TableCell>
                  <TableCell><Badge variant="outline" className="capitalize">{b.condition}</Badge></TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={8} className="text-center text-muted-foreground py-8">No books found</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
