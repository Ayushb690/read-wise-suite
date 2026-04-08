import { create } from 'zustand';
import { Book, Member, Transaction, PurchaseOrder, sampleBooks, sampleMembers, sampleTransactions, samplePurchaseOrders, calculateFine } from './data';

interface LibraryStore {
  books: Book[];
  members: Member[];
  transactions: Transaction[];
  purchaseOrders: PurchaseOrder[];
  issueBook: (bookId: string, memberId: string) => string | null;
  returnBook: (transactionId: string) => number;
  renewBook: (transactionId: string) => string | null;
  addBook: (book: Omit<Book, 'id' | 'status'>) => void;
  addMember: (member: Omit<Member, 'id' | 'booksIssued'>) => void;
  searchBooks: (query: string) => Book[];
}

export const useLibraryStore = create<LibraryStore>((set, get) => ({
  books: sampleBooks,
  members: sampleMembers,
  transactions: sampleTransactions.map(t => ({
    ...t,
    fine: t.status === 'overdue' || t.status === 'active' ? calculateFine(t.dueDate, t.returnDate) : t.fine,
  })),
  purchaseOrders: samplePurchaseOrders,

  issueBook: (bookId, memberId) => {
    const { books, members, transactions } = get();
    const book = books.find(b => b.id === bookId);
    const member = members.find(m => m.id === memberId);
    if (!book || !member) return 'Book or member not found';
    if (book.availableCopies <= 0) return 'No copies available';
    if (member.status === 'suspended') return 'Member is suspended';
    if (member.booksIssued >= member.maxBooks) return 'Member has reached max books limit';

    const today = new Date();
    const due = new Date(today);
    due.setDate(due.getDate() + 14);

    const newTx: Transaction = {
      id: `T${String(transactions.length + 1).padStart(3, '0')}`,
      bookId, bookTitle: book.title, memberId, memberName: member.name,
      type: 'issue', issueDate: today.toISOString().split('T')[0],
      dueDate: due.toISOString().split('T')[0], fine: 0, status: 'active',
    };

    set({
      transactions: [...transactions, newTx],
      books: books.map(b => b.id === bookId ? { ...b, availableCopies: b.availableCopies - 1, status: b.availableCopies - 1 === 0 ? 'out-of-stock' : b.availableCopies - 1 <= 1 ? 'low-stock' : 'available' } : b),
      members: members.map(m => m.id === memberId ? { ...m, booksIssued: m.booksIssued + 1 } : m),
    });
    return null;
  },

  returnBook: (transactionId) => {
    const { transactions, books, members } = get();
    const tx = transactions.find(t => t.id === transactionId);
    if (!tx) return 0;
    const fine = calculateFine(tx.dueDate);
    const today = new Date().toISOString().split('T')[0];

    set({
      transactions: transactions.map(t => t.id === transactionId ? { ...t, returnDate: today, status: 'returned', fine, type: 'return' } : t),
      books: books.map(b => b.id === tx.bookId ? { ...b, availableCopies: b.availableCopies + 1, status: 'available' } : b),
      members: members.map(m => m.id === tx.memberId ? { ...m, booksIssued: Math.max(0, m.booksIssued - 1) } : m),
    });
    return fine;
  },

  renewBook: (transactionId) => {
    const { transactions } = get();
    const tx = transactions.find(t => t.id === transactionId);
    if (!tx || tx.status === 'returned') return 'Transaction not found or already returned';
    if (calculateFine(tx.dueDate) > 0) return 'Please pay fine before renewal';

    const newDue = new Date(tx.dueDate);
    newDue.setDate(newDue.getDate() + 14);

    set({
      transactions: transactions.map(t => t.id === transactionId ? { ...t, dueDate: newDue.toISOString().split('T')[0], type: 'renewal' } : t),
    });
    return null;
  },

  addBook: (book) => {
    const { books } = get();
    const id = `B${String(books.length + 1).padStart(3, '0')}`;
    const status = book.availableCopies === 0 ? 'out-of-stock' : book.availableCopies <= 1 ? 'low-stock' : 'available';
    set({ books: [...books, { ...book, id, status }] });
  },

  addMember: (member) => {
    const { members } = get();
    const id = `M${String(members.length + 1).padStart(3, '0')}`;
    set({ members: [...members, { ...member, id, booksIssued: 0 }] });
  },

  searchBooks: (query) => {
    const { books } = get();
    const q = query.toLowerCase();
    return books.filter(b =>
      b.title.toLowerCase().includes(q) ||
      b.author.toLowerCase().includes(q) ||
      b.subject.toLowerCase().includes(q) ||
      b.isbn.includes(q)
    );
  },
}));
