import { useState } from "react";
import { useLibraryStore } from "@/lib/library-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { toast } from "sonner";

export default function MembersPage() {
  const { members, addMember } = useLibraryStore();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [memberType, setMemberType] = useState<'student' | 'staff'>('student');

  const filtered = members.filter(m => m.name.toLowerCase().includes(search.toLowerCase()) || m.email.toLowerCase().includes(search.toLowerCase()));

  const handleAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    addMember({
      name: fd.get('name') as string,
      email: fd.get('email') as string,
      type: memberType,
      department: fd.get('department') as string,
      joinDate: new Date().toISOString().split('T')[0],
      status: 'active',
      maxBooks: memberType === 'staff' ? 10 : 5,
    });
    setOpen(false);
    toast.success("Member added successfully");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold">Members</h1>
          <p className="text-muted-foreground mt-1">Manage student and staff memberships</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button><Plus className="w-4 h-4 mr-2" /> Add Member</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add New Member</DialogTitle></DialogHeader>
            <form onSubmit={handleAdd} className="grid gap-3">
              <div><Label>Name</Label><Input name="name" required /></div>
              <div><Label>Email</Label><Input name="email" type="email" required /></div>
              <div><Label>Department</Label><Input name="department" required /></div>
              <div>
                <Label>Type</Label>
                <Select value={memberType} onValueChange={(v: 'student' | 'staff') => setMemberType(v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="staff">Staff</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="mt-2">Add Member</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader><Input placeholder="Search members..." className="max-w-sm" value={search} onChange={e => setSearch(e.target.value)} /></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead><TableHead>Name</TableHead><TableHead>Email</TableHead>
                <TableHead>Type</TableHead><TableHead>Department</TableHead><TableHead>Books</TableHead><TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(m => (
                <TableRow key={m.id}>
                  <TableCell className="font-mono text-xs">{m.id}</TableCell>
                  <TableCell className="font-medium">{m.name}</TableCell>
                  <TableCell>{m.email}</TableCell>
                  <TableCell><Badge variant="outline" className="capitalize">{m.type}</Badge></TableCell>
                  <TableCell>{m.department}</TableCell>
                  <TableCell>{m.booksIssued}/{m.maxBooks}</TableCell>
                  <TableCell>
                    <Badge variant={m.status === 'active' ? 'default' : 'destructive'} className="capitalize">{m.status}</Badge>
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
