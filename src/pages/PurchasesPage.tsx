import { useLibraryStore } from "@/lib/library-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function PurchasesPage() {
  const { purchaseOrders } = useLibraryStore();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold">Purchase Orders</h1>
        <p className="text-muted-foreground mt-1">Track book purchases, vendors, and invoices</p>
      </div>

      <div className="grid gap-4">
        {purchaseOrders.map(po => (
          <Card key={po.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{po.id} — {po.vendor}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">Ordered: {po.orderDate} {po.invoiceNo && `· Invoice: ${po.invoiceNo}`}</p>
                </div>
                <div className="text-right">
                  <Badge variant={po.status === 'received' ? 'default' : po.status === 'pending' ? 'secondary' : 'destructive'} className="capitalize">{po.status}</Badge>
                  <p className="text-lg font-bold mt-1">${po.totalAmount}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow><TableHead>Title</TableHead><TableHead>Qty</TableHead><TableHead>Unit Price</TableHead><TableHead>Total</TableHead></TableRow>
                </TableHeader>
                <TableBody>
                  {po.items.map((item, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">{item.title}</TableCell>
                      <TableCell>{item.qty}</TableCell>
                      <TableCell>${item.price}</TableCell>
                      <TableCell className="font-semibold">${item.qty * item.price}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
