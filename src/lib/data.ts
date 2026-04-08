export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  subject: string;
  publisher: string;
  year: number;
  totalCopies: number;
  availableCopies: number;
  status: 'available' | 'low-stock' | 'out-of-stock';
  location: string;
  condition: 'good' | 'fair' | 'damaged' | 'lost';
}

export interface Member {
  id: string;
  name: string;
  email: string;
  type: 'student' | 'staff';
  department: string;
  joinDate: string;
  status: 'active' | 'suspended';
  booksIssued: number;
  maxBooks: number;
}

export interface Transaction {
  id: string;
  bookId: string;
  bookTitle: string;
  memberId: string;
  memberName: string;
  type: 'issue' | 'return' | 'renewal';
  issueDate: string;
  dueDate: string;
  returnDate?: string;
  fine: number;
  status: 'active' | 'returned' | 'overdue';
}

export interface PurchaseOrder {
  id: string;
  vendor: string;
  orderDate: string;
  items: { title: string; qty: number; price: number }[];
  totalAmount: number;
  status: 'pending' | 'received' | 'cancelled';
  invoiceNo?: string;
}

const FINE_PER_DAY = 2; // $2 per day

export function calculateFine(dueDate: string, returnDate?: string): number {
  const due = new Date(dueDate);
  const ret = returnDate ? new Date(returnDate) : new Date();
  const diff = Math.floor((ret.getTime() - due.getTime()) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff * FINE_PER_DAY : 0;
}

export const sampleBooks: Book[] = [
  { id: 'B001', title: 'Introduction to Algorithms', author: 'Thomas H. Cormen', isbn: '978-0262033848', subject: 'Computer Science', publisher: 'MIT Press', year: 2009, totalCopies: 5, availableCopies: 2, status: 'available', location: 'Shelf A-12', condition: 'good' },
  { id: 'B002', title: 'Clean Code', author: 'Robert C. Martin', isbn: '978-0132350884', subject: 'Software Engineering', publisher: 'Prentice Hall', year: 2008, totalCopies: 3, availableCopies: 0, status: 'out-of-stock', location: 'Shelf B-05', condition: 'good' },
  { id: 'B003', title: 'Design Patterns', author: 'Gang of Four', isbn: '978-0201633610', subject: 'Software Engineering', publisher: 'Addison-Wesley', year: 1994, totalCopies: 4, availableCopies: 1, status: 'low-stock', location: 'Shelf B-07', condition: 'fair' },
  { id: 'B004', title: 'The Pragmatic Programmer', author: 'Andrew Hunt', isbn: '978-0135957059', subject: 'Software Engineering', publisher: 'Addison-Wesley', year: 2019, totalCopies: 6, availableCopies: 4, status: 'available', location: 'Shelf B-03', condition: 'good' },
  { id: 'B005', title: 'Database System Concepts', author: 'Abraham Silberschatz', isbn: '978-0078022159', subject: 'Database', publisher: 'McGraw-Hill', year: 2019, totalCopies: 3, availableCopies: 3, status: 'available', location: 'Shelf C-01', condition: 'good' },
  { id: 'B006', title: 'Operating System Concepts', author: 'Abraham Silberschatz', isbn: '978-1119800361', subject: 'Operating Systems', publisher: 'Wiley', year: 2021, totalCopies: 4, availableCopies: 2, status: 'available', location: 'Shelf C-04', condition: 'good' },
  { id: 'B007', title: 'Artificial Intelligence: A Modern Approach', author: 'Stuart Russell', isbn: '978-0134610993', subject: 'AI', publisher: 'Pearson', year: 2020, totalCopies: 2, availableCopies: 0, status: 'out-of-stock', location: 'Shelf D-02', condition: 'fair' },
  { id: 'B008', title: 'Computer Networks', author: 'Andrew S. Tanenbaum', isbn: '978-0132126953', subject: 'Networking', publisher: 'Pearson', year: 2010, totalCopies: 3, availableCopies: 1, status: 'low-stock', location: 'Shelf D-08', condition: 'damaged' },
];

export const sampleMembers: Member[] = [
  { id: 'M001', name: 'Alice Johnson', email: 'alice@university.edu', type: 'student', department: 'Computer Science', joinDate: '2024-01-15', status: 'active', booksIssued: 2, maxBooks: 5 },
  { id: 'M002', name: 'Dr. Robert Smith', email: 'rsmith@university.edu', type: 'staff', department: 'Mathematics', joinDate: '2023-06-01', status: 'active', booksIssued: 3, maxBooks: 10 },
  { id: 'M003', name: 'Emma Williams', email: 'emma.w@university.edu', type: 'student', department: 'Physics', joinDate: '2024-03-10', status: 'active', booksIssued: 1, maxBooks: 5 },
  { id: 'M004', name: 'James Brown', email: 'jbrown@university.edu', type: 'student', department: 'Computer Science', joinDate: '2024-02-20', status: 'suspended', booksIssued: 0, maxBooks: 5 },
  { id: 'M005', name: 'Dr. Sarah Davis', email: 'sdavis@university.edu', type: 'staff', department: 'English', joinDate: '2022-09-01', status: 'active', booksIssued: 5, maxBooks: 10 },
];

export const sampleTransactions: Transaction[] = [
  { id: 'T001', bookId: 'B001', bookTitle: 'Introduction to Algorithms', memberId: 'M001', memberName: 'Alice Johnson', type: 'issue', issueDate: '2025-03-01', dueDate: '2025-03-15', status: 'overdue', fine: 0 },
  { id: 'T002', bookId: 'B002', bookTitle: 'Clean Code', memberId: 'M002', memberName: 'Dr. Robert Smith', type: 'issue', issueDate: '2025-03-10', dueDate: '2025-03-24', status: 'overdue', fine: 0 },
  { id: 'T003', bookId: 'B003', bookTitle: 'Design Patterns', memberId: 'M001', memberName: 'Alice Johnson', type: 'issue', issueDate: '2025-04-01', dueDate: '2025-04-15', status: 'active', fine: 0 },
  { id: 'T004', bookId: 'B004', bookTitle: 'The Pragmatic Programmer', memberId: 'M003', memberName: 'Emma Williams', type: 'return', issueDate: '2025-02-15', dueDate: '2025-03-01', returnDate: '2025-02-28', status: 'returned', fine: 0 },
  { id: 'T005', bookId: 'B007', bookTitle: 'AI: A Modern Approach', memberId: 'M005', memberName: 'Dr. Sarah Davis', type: 'renewal', issueDate: '2025-03-15', dueDate: '2025-04-12', status: 'active', fine: 0 },
];

export const samplePurchaseOrders: PurchaseOrder[] = [
  { id: 'PO001', vendor: 'Academic Books Inc.', orderDate: '2025-01-10', items: [{ title: 'Clean Code', qty: 3, price: 35 }, { title: 'Design Patterns', qty: 2, price: 45 }], totalAmount: 195, status: 'received', invoiceNo: 'INV-2025-001' },
  { id: 'PO002', vendor: 'University Press Direct', orderDate: '2025-02-20', items: [{ title: 'AI: A Modern Approach', qty: 2, price: 80 }], totalAmount: 160, status: 'pending' },
  { id: 'PO003', vendor: 'Global Publishers', orderDate: '2025-03-05', items: [{ title: 'Computer Networks', qty: 4, price: 55 }, { title: 'Database Concepts', qty: 3, price: 60 }], totalAmount: 400, status: 'received', invoiceNo: 'INV-2025-045' },
];
