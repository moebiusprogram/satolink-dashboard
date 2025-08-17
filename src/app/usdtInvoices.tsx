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
import { CheckCircle2Icon, AlertCircleIcon, CoinsIcon } from "lucide-react";
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

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

const colorByStatus = {
  pending: "bg-yellow-500 text-black capitalize",
  processing: "bg-blue-500 capitalize",
  success: "bg-green-500 capitalize",
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

type USDTInvoice = {
  id: string;
  asset: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  description: string;
  createdAt: string;
  expiresAt: string;
};

const usdtColumns: ColumnDef<USDTInvoice>[] = [
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "amount",
    header: "Amount (USDT-SL)",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "createdAt",
    header: "Created",
  },
];

const usdtData: USDTInvoice[] = [
  {
    id: "1",
    asset: "USDT-SL",
    amount: 100,
    status: "pending",
    description: "Service payment",
    createdAt: "2023-06-15",
    expiresAt: "2023-06-22",
  },
  {
    id: "2",
    asset: "USDT-SL",
    amount: 250,
    status: "success",
    description: "Product purchase",
    createdAt: "2023-06-10",
    expiresAt: "2023-06-17",
  },
];

const FormSchema = z.object({
  amount: z.coerce
    .number()
    .positive("Amount must be positive")
    .min(1, "Minimum amount is 1 USDT-SL")
    .max(1000000, "Maximum amount is 1,000,000 USDT-SL"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(100, "Description must be less than 100 characters"),
  expiresAt: z.string().min(1, "Expiration date is required"),
});

export default function USDTInvoicePage() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      amount: 100,
      description: "",
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      // Simulate USDT-SL invoice generation using Taproot Assets
      const taprootInvoice = `taproot-assets:usdt-sl-${Date.now()}-${
        data.amount
      }u@satolink.app`;

      toast({
        title: "USDT-SL Invoice generated",
        description: (
          <div className="mt-2 bg-secondary/80 p-4 rounded-md">
            <Label className="text-sm font-medium mb-2 block">
              Taproot Asset Invoice:
            </Label>
            <p className="font-mono break-all text-sm text-primary/90">
              {taprootInvoice}
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-2 w-full"
              onClick={() => navigator.clipboard.writeText(taprootInvoice)}>
              Copy USDT-SL Invoice
            </Button>
            <div className="mt-2 text-xs text-muted-foreground">
              Asset: USDT-SL | Amount: {data.amount} | Expires: {data.expiresAt}
            </div>
          </div>
        ),
      });
    } catch (error) {
      toast({
        title: "Error generating USDT-SL Invoice",
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="">
            <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4  *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-2">
              <Card className="@container/card">
                <CardHeader>
                  <CardTitle className="font-semibold text-2xl pb-3">
                    Generate USDT-SL Invoice
                  </CardTitle>
                  <CardDescription>
                    Create a new invoice to receive USDT-SL (Taproot Assets)
                    payments
                  </CardDescription>
                </CardHeader>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6 px-4 pb-6">
                    <FormField
                      control={form.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Amount (USDT-SL)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="100"
                              step="0.01"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Amount in USDT-SL tokens (1 = 1 USDT-SL)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Payment for services"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Purpose of this USDT-SL invoice
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="expiresAt"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Expiration Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormDescription>
                            When this invoice will expire
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      className="bg-green-700 hover:bg-green-900">
                      Generate USDT-SL Invoice
                    </Button>
                  </form>
                </Form>
                <CardFooter className="flex-col items-start gap-1.5 text-sm px-4 pb-4">
                  <Alert>
                    <CoinsIcon className="h-4 w-4" />
                    <AlertTitle>USDT-SL on Taproot</AlertTitle>
                    <AlertDescription>
                      USDT-SL is a Taproot Assets implementation for USDT-like
                      tokens. Secure and efficient transfers on Bitcoin's
                      Taproot.
                    </AlertDescription>
                  </Alert>
                </CardFooter>
              </Card>

              <Card className="@container/card">
                <CardHeader>
                  <CardTitle className="font-semibold text-2xl pb-3">
                    Pending USDT-SL Invoices
                  </CardTitle>
                  <CardDescription>
                    Active USDT-SL invoices waiting for payment
                  </CardDescription>
                </CardHeader>
                <div className="px-4 pb-6">
                  <DataTable columns={usdtColumns} data={usdtData} />
                </div>
                <CardFooter className="flex-col items-start gap-1.5 text-sm px-4 pb-4">
                  <div className="line-clamp-1 flex gap-2 font-medium">
                    USDT-SL invoices are monitored by Satolink
                  </div>
                  <div className="text-muted-foreground">
                    USDT-SL: Taproot Assets implementation for stablecoin
                    transfers
                  </div>
                </CardFooter>
              </Card>
            </div>

            <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4  *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-1 @5xl/main:grid-cols-1 mt-8">
              <Card className="@container/card">
                <CardHeader>
                  <CardTitle className="font-semibold text-2xl pb-3">
                    USDT-SL Invoices History
                  </CardTitle>
                  <CardDescription>
                    Historical USDT-SL invoices for accounting and tracking
                  </CardDescription>
                </CardHeader>
                <div className="px-4 pb-6">
                  <SecondaryDatatable columns={usdtColumns} data={usdtData} />
                </div>
                <CardFooter className="flex-col items-start gap-1.5 text-sm px-4 pb-4">
                  <Alert>
                    <AlertCircleIcon className="h-4 w-4" />
                    <AlertTitle>Privacy & Data Retention</AlertTitle>
                    <AlertDescription>
                      Configure your privacy settings to manage retention of
                      USDT-SL invoice history.
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
