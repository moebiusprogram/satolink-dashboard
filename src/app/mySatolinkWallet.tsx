import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Fade } from "react-awesome-reveal";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CheckCircle2Icon,
  AlertCircleIcon,
  QrCodeIcon,
  SendIcon,
  WalletIcon,
} from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Toaster, toast } from "sonner";
import { DataTable as SecondaryDatatable } from "@/components/data-table";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

const colorByStatus = {
  pending: "bg-yellow-500 text-black capitalize",
  completed: "bg-green-500 capitalize",
  failed: "bg-red-500 capitalize",
};

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  return (
    <div className="overflow-hidden rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {cell.column.id === "status" ? (
                      <Badge
                        className={
                          colorByStatus[cell.getValue()] || "bg-gray-500"
                        }>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </Badge>
                    ) : (
                      flexRender(cell.column.columnDef.cell, cell.getContext())
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

type InternalTransaction = {
  id: string;
  amount: number;
  status: "pending" | "completed" | "failed";
  counterparty: string;
  type: "sent" | "received";
  description: string;
  date: string;
};

const transactionColumns: ColumnDef<InternalTransaction>[] = [
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "counterparty",
    header: "Counterparty",
  },
  {
    accessorKey: "amount",
    header: "Amount (sats)",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "date",
    header: "Date",
  },
];

const transactionData: InternalTransaction[] = [
  {
    id: "1",
    amount: 5000,
    status: "completed",
    counterparty: "alice@satolink.app",
    type: "received",
    description: "Payment for services",
    date: "2023-06-15",
  },
  {
    id: "2",
    amount: 1000,
    status: "completed",
    counterparty: "bob@satolink.app",
    type: "sent",
    description: "Gift",
    date: "2023-06-14",
  },
  {
    id: "3",
    amount: 7500,
    status: "pending",
    counterparty: "charlie@satolink.app",
    type: "sent",
    description: "Invoice payment",
    date: "2023-06-15",
  },
];

const receiveFormSchema = z.object({
  amount: z.coerce
    .number()
    .int()
    .positive()
    .min(1, "Amount must be at least 1 sat"),
  description: z
    .string()
    .max(100, "Description must be less than 100 characters")
    .optional(),
});

const sendFormSchema = z.object({
  recipient: z
    .string()
    .min(1, "Recipient is required")
    .email("Invalid email format"),
  amount: z.coerce
    .number()
    .int()
    .positive()
    .min(1, "Amount must be at least 1 sat"),
  description: z
    .string()
    .max(100, "Description must be less than 100 characters")
    .optional(),
});

export default function WalletPage() {
  const [activeTab, setActiveTab] = useState<"send" | "receive">("send");
  const [showQrCode, setShowQrCode] = useState(false);
  const [generatedQrData, setGeneratedQrData] = useState("");

  const receiveForm = useForm<z.infer<typeof receiveFormSchema>>({
    resolver: zodResolver(receiveFormSchema),
    defaultValues: {
      amount: 1000,
      description: "",
    },
  });

  const sendForm = useForm<z.infer<typeof sendFormSchema>>({
    resolver: zodResolver(sendFormSchema),
    defaultValues: {
      recipient: "",
      amount: 1000,
      description: "",
    },
  });

  const onSubmitReceive = (data: z.infer<typeof receiveFormSchema>) => {
    // Generate a mock payment request
    const paymentRequest = `satolink:${data.amount}:${Date.now()}`;
    setGeneratedQrData(paymentRequest);
    setShowQrCode(true);

    toast({
      title: "Payment request generated",
      description: (
        <div className="mt-2 bg-secondary/80 p-4 rounded-md">
          <Label className="text-sm font-medium mb-2 block">
            Payment Request:
          </Label>
          <p className="font-mono break-all text-sm text-primary/90">
            {paymentRequest}
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-2 w-full"
            onClick={() => navigator.clipboard.writeText(paymentRequest)}>
            Copy Request
          </Button>
        </div>
      ),
    });
  };

  const onSubmitSend = (data: z.infer<typeof sendFormSchema>) => {
    try {
      // Simulate sending payment
      toast({
        title: "Payment Sent",
        description: (
          <div className="mt-2">
            <p className="text-sm">
              Successfully sent {data.amount} sats to {data.recipient}
            </p>
            {data.description && (
              <p className="text-sm text-muted-foreground mt-1">
                Note: {data.description}
              </p>
            )}
          </div>
        ),
      });

      // Reset form
      sendForm.reset({
        recipient: "",
        amount: 1000,
        description: "",
      });
    } catch (error) {
      toast({
        title: "Error sending payment",
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="">
            <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4  *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-2">
              <Card className="@container/card">
                <CardHeader>
                  <CardTitle className="font-semibold text-2xl pb-3">
                    My Satolink Wallet
                  </CardTitle>
                  <CardDescription>
                    Manage your balance and send/receive payments with other
                    Satolink users
                  </CardDescription>
                </CardHeader>

                {/* Balance Display */}
                <div className="px-4 pb-6">
                  <div className="bg-secondary/50 rounded-lg p-4 mb-6">
                    <Label className="text-sm font-medium">
                      Current Balance
                    </Label>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-2xl font-bold">125,430</span>
                      <Badge variant="secondary">sats</Badge>
                    </div>
                  </div>

                  {/* Send/Receive Tabs */}
                  <div className="mb-6 border-b">
                    <nav className="flex space-x-8">
                      <button
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${
                          activeTab === "send"
                            ? "border-primary text-primary"
                            : "border-transparent text-muted-foreground hover:text-foreground"
                        }`}
                        onClick={() => setActiveTab("send")}>
                        <div className="flex items-center gap-2">
                          <SendIcon className="h-4 w-4" />
                          Send
                        </div>
                      </button>
                      <button
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${
                          activeTab === "receive"
                            ? "border-primary text-primary"
                            : "border-transparent text-muted-foreground hover:text-foreground"
                        }`}
                        onClick={() => {
                          setActiveTab("receive");
                          setShowQrCode(false);
                        }}>
                        <div className="flex items-center gap-2">
                          <WalletIcon className="h-4 w-4" />
                          Receive
                        </div>
                      </button>
                    </nav>
                  </div>

                  {/* Send Form */}
                  {activeTab === "send" && (
                    <Form {...sendForm}>
                      <form
                        onSubmit={sendForm.handleSubmit(onSubmitSend)}
                        className="space-y-6">
                        <FormField
                          control={sendForm.control}
                          name="recipient"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Recipient</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="user@satolink.app"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                Email address of the Satolink user
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={sendForm.control}
                          name="amount"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Amount (sats)</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="1000"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={sendForm.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Description</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="What's this payment for?"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                Optional note for the recipient
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button
                          type="submit"
                          className="bg-green-700 hover:bg-green-900">
                          Send Payment
                        </Button>
                      </form>
                    </Form>
                  )}

                  {/* Receive Form */}
                  {activeTab === "receive" && (
                    <Form {...receiveForm}>
                      <form
                        onSubmit={receiveForm.handleSubmit(onSubmitReceive)}
                        className="space-y-6">
                        <FormField
                          control={receiveForm.control}
                          name="amount"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Amount (sats)</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="1000"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={receiveForm.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Description</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="What's this payment for?"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                Optional note for the payer
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button
                          type="submit"
                          className="bg-green-700 hover:bg-green-900">
                          Generate Request
                        </Button>
                      </form>
                    </Form>
                  )}

                  {/* QR Code Display */}
                  {showQrCode && (
                    <div className="mt-6 p-4 bg-secondary/50 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-medium">Payment QR Code</h3>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setShowQrCode(false)}>
                          ✕
                        </Button>
                      </div>
                      {/* Placeholder for QR code - would use a library like react-qr-code */}
                      <div className="w-full aspect-square bg-white p-4 rounded flex items-center justify-center">
                        <div className="text-center">
                          <QrCodeIcon className="h-16 w-16 mx-auto text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground">
                            QR Code would be displayed here
                          </p>
                        </div>
                      </div>
                      <p className="text-center mt-3 text-sm text-muted-foreground">
                        Share this QR code with the payer
                      </p>
                    </div>
                  )}
                </div>

                <CardFooter className="flex-col items-start gap-1.5 text-sm px-4 pb-4">
                  <Alert>
                    <CheckCircle2Icon className="h-4 w-4" />
                    <AlertTitle>Instant Transfers</AlertTitle>
                    <AlertDescription>
                      Payments between Satolink users are instant and free of
                      fees
                    </AlertDescription>
                  </Alert>
                </CardFooter>
              </Card>

              <Card className="@container/card">
                <CardHeader>
                  <CardTitle className="font-semibold text-2xl pb-3">
                    Recent Transactions
                  </CardTitle>
                  <CardDescription>
                    Internal transfers between Satolink users
                  </CardDescription>
                </CardHeader>
                <div className="px-4 pb-6">
                  <DataTable
                    columns={transactionColumns}
                    data={transactionData}
                  />
                </div>
                <CardFooter className="flex-col items-start gap-1.5 text-sm px-4 pb-4">
                  <div className="line-clamp-1 flex gap-2 font-medium">
                    All transactions are secure and encrypted
                  </div>
                  <div className="text-muted-foreground">
                    Internal transfers are instant and free
                  </div>
                </CardFooter>
              </Card>
            </div>

            <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4  *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-1 @5xl/main:grid-cols-1 mt-8">
              <Card className="@container/card">
                <CardHeader>
                  <CardTitle className="font-semibold text-2xl pb-3">
                    Transaction History
                  </CardTitle>
                  <CardDescription>
                    Complete history of your internal Satolink transactions
                  </CardDescription>
                </CardHeader>
                <div className="px-4 pb-6">
                  <SecondaryDatatable
                    columns={transactionColumns}
                    data={transactionData}
                  />
                </div>
                <CardFooter className="flex-col items-start gap-1.5 text-sm px-4 pb-4">
                  <Alert>
                    <AlertCircleIcon className="h-4 w-4" />
                    <AlertTitle>Transaction Security</AlertTitle>
                    <AlertDescription>
                      All transactions are end-to-end encrypted and securely
                      stored
                    </AlertDescription>
                  </Alert>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
