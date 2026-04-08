import { useState } from "react";
import { useLibraryStore } from "@/lib/library-store";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, BookOpen, MapPin } from "lucide-react";

export default function SearchPage() {
  const { searchBooks } = useLibraryStore();
  const [query, setQuery] = useState("");
  const results = query.length >= 2 ? searchBooks(query) : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold">Search Books</h1>
        <p className="text-muted-foreground mt-1">Search by title, author, subject, or ISBN</p>
      </div>

      <div className="relative max-w-2xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input placeholder="Type at least 2 characters to search..." className="pl-12 h-12 text-lg" value={query} onChange={e => setQuery(e.target.value)} />
      </div>

      {query.length >= 2 && (
        <p className="text-sm text-muted-foreground">{results.length} result{results.length !== 1 ? 's' : ''} found</p>
      )}

      <div className="grid gap-4">
        {results.map(book => (
          <Card key={book.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-5 flex items-start gap-4">
              <div className="w-12 h-16 rounded bg-primary/10 flex items-center justify-center shrink-0">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg">{book.title}</h3>
                <p className="text-muted-foreground text-sm">{book.author} · {book.publisher}, {book.year}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="outline">{book.subject}</Badge>
                  <Badge variant="outline" className="font-mono text-xs">{book.isbn}</Badge>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3" /> {book.location}
                  </div>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-medium">{book.availableCopies}/{book.totalCopies}</p>
                <p className="text-xs text-muted-foreground">available</p>
                {book.status === 'out-of-stock' && <Badge variant="destructive" className="mt-1">Out of stock</Badge>}
                {book.status === 'low-stock' && <Badge className="mt-1 bg-warning text-warning-foreground">Low stock</Badge>}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
