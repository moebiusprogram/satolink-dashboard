import { Fade } from "react-awesome-reveal";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Trash, Filter, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

type Transaction = {
  id: string;
  type: "sent" | "received";
  asset: "BTC-LN" | "USDT-SL" | "SATOLINK";
  amount: number;
  address: string;
  contactName?: string;
  date: Date;
  status: "completed" | "pending" | "failed";
  fee?: number;
  note?: string;
};

const mockTransactions: Transaction[] = [
  {
    id: "1",
    type: "received",
    asset: "BTC-LN",
    amount: 0.005,
    address: "alice@satolink.me",
    contactName: "Alice Crypto",
    date: new Date(2023, 10, 15, 14, 30),
    status: "completed",
    fee: 0.00001,
    note: "Invoice #12345",
  },
  {
    id: "2",
    type: "sent",
    asset: "USDT-SL",
    amount: 150,
    address: "0x1a2b3c4d5e6f7890",
    date: new Date(2023, 10, 14, 9, 15),
    status: "completed",
    fee: 0.5,
    note: "Payment for services",
  },
  {
    id: "3",
    type: "received",
    asset: "SATOLINK",
    amount: 500,
    address: "bob@satolink.me",
    contactName: "Bob Bitcoin",
    date: new Date(2023, 10, 12, 16, 45),
    status: "completed",
  },
  {
    id: "4",
    type: "sent",
    asset: "BTC-LN",
    amount: 0.001,
    address: "carol@lightning.network",
    contactName: "Carol Coin",
    date: new Date(2023, 10, 10, 11, 20),
    status: "pending",
    fee: 0.00001,
  },
  {
    id: "5",
    type: "received",
    asset: "USDT-SL",
    amount: 75,
    address: "0x9f8e7d6c5b4a3f2e1",
    date: new Date(2023, 10, 8, 8, 0),
    status: "failed",
    note: "Expired invoice",
  },
];

export default function TransactionsPage() {
  const [transactions, setTransactions] =
    useState<Transaction[]>(mockTransactions);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAsset, setFilterAsset] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch = `${tx.address} ${tx.contactName || ""} ${
      tx.note || ""
    }`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesAsset = filterAsset === "all" || tx.asset === filterAsset;
    const matchesStatus = filterStatus === "all" || tx.status === filterStatus;
    return matchesSearch && matchesAsset && matchesStatus;
  });

  const deleteAllTransactions = () => {
    setTransactions([]);
    setIsDeleteDialogOpen(false);
  };

  const getStatusBadge = (status: Transaction["status"]) => {
    const variants = {
      completed: "bg-green-500 text-green-900",
      pending: "bg-yellow-500 text-gray-900",
      failed: "bg-red-900 text-red-100",
    };
    return variants[status] || "bg-gray-100 text-gray-800";
  };

  const getTypeBadge = (type: Transaction["type"]) => {
    return type === "received" ? (
      <Badge className="bg-blue-100 text-blue-800">Received</Badge>
    ) : (
      <Badge className="bg-purple-100 text-purple-800">Sent</Badge>
    );
  };

  const getAssetBadge = (asset: Transaction["asset"]) => {
    const variants = {
      "BTC-LN": "bg-yellow-500 text-gray-900",
      "USDT-SL": "bg-teal-500 text-teal-800",
      SATOLINK: "bg-red-500 text-indigo-100",
    };
    return <Badge className={variants[asset]}>{asset}</Badge>;
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
          <div className="p-4 lg:p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                Transaction History
              </h3>
              <div className="flex gap-2">
                <Dialog
                  open={isDeleteDialogOpen}
                  onOpenChange={setIsDeleteDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="text-red-500">
                      <Trash className="mr-2 h-4 w-4" />
                      Clear History
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Clear All Transaction History?</DialogTitle>
                    </DialogHeader>
                    <p className="text-sm text-muted-foreground">
                      This will permanently delete all your transaction records.
                      This action cannot be undone.
                    </p>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setIsDeleteDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={deleteAllTransactions}>
                        Delete All
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <Input
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-md"
              />
              <div className="flex gap-2">
                <div className="relative">
                  <select
                    value={filterAsset}
                    onChange={(e) => setFilterAsset(e.target.value)}
                    className="appearance-none bg-background border rounded-md pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring">
                    <option value="all">All Assets</option>
                    <option value="BTC-LN">BTC-LN</option>
                    <option value="USDT-SL">USDT-SL</option>
                    <option value="SATOLINK">SATOLINK</option>
                  </select>
                  <Filter className="absolute right-3 top-2.5 h-4 w-4 opacity-50" />
                </div>
                <div className="relative">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="appearance-none bg-background border rounded-md pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring">
                    <option value="all">All Statuses</option>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                  </select>
                  <Filter className="absolute right-3 top-2.5 h-4 w-4 opacity-50" />
                </div>
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Currency</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Address/Contact</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Fee</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.length > 0 ? (
                    filteredTransactions.map((tx) => (
                      <TableRow key={tx.id}>
                        <TableCell>{getAssetBadge(tx.asset)}</TableCell>
                        <TableCell>
                          {tx.amount}{" "}
                          {tx.asset === "BTC-LN"
                            ? "BTC"
                            : tx.asset === "USDT-SL"
                            ? "USDT"
                            : "SL"}
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">
                            {tx.contactName || tx.address}
                          </div>
                          {tx.note && (
                            <div className="text-sm text-muted-foreground">
                              {tx.note}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          {tx.date.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusBadge(tx.status)}>
                            {tx.status.charAt(0).toUpperCase() +
                              tx.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {tx.fee !== undefined
                            ? tx.asset === "BTC-LN"
                              ? `${tx.fee} BTC`
                              : `${tx.fee} USDT`
                            : "-"}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        No transactions found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
