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
import { CheckCircle2Icon, AlertCircleIcon, LinkIcon } from "lucide-react";
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
  active: "bg-green-500 capitalize",
  expired: "bg-red-500 capitalize",
  used: "bg-gray-500 capitalize",
  pending: "bg-yellow-500 text-black capitalize",
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

type LNURLWithdraw = {
  id: string;
  lnurl: string;
  amount: number;
  status: "active" | "expired" | "used" | "pending";
  description: string;
  createdAt: string;
  expiresAt: string;
};

const lnurlColumns: ColumnDef<LNURLWithdraw>[] = [
  {
    accessorKey: "description",
    header: "Description",
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
    accessorKey: "createdAt",
    header: "Created",
  },
  {
    accessorKey: "expiresAt",
    header: "Expires",
  },
];

const lnurlData: LNURLWithdraw[] = [
  {
    id: "1",
    lnurl: "lnurlw:withdraw123@satolink.app",
    amount: 5000,
    status: "active",
    description: "Gift for John",
    createdAt: "2023-06-15",
    expiresAt: "2023-07-15",
  },
  {
    id: "2",
    lnurl: "lnurlw:withdraw456@satolink.app",
    amount: 10000,
    status: "used",
    description: "Event ticket",
    createdAt: "2023-05-10",
    expiresAt: "2023-06-10",
  },
];

const FormSchema = z.object({
  description: z
    .string()
    .min(1, "Description is required")
    .max(50, "Description must be less than 50 characters"),
  amount: z.coerce
    .number()
    .int()
    .positive()
    .min(1, "Amount must be at least 1 sat"),
  expiresAt: z.string().min(1, "Expiration date is required"),
  uses: z.coerce.number().int().min(1).max(100).default(1),
});

export default function LNURLWithdrawPage() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      description: "",
      amount: 1000,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      uses: 1,
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      // Simulate LNURL Withdraw link generation
      const lnurl = `lnurlw:${data.description
        .toLowerCase()
        .replace(/\s+/g, "-")}-${data.amount}sat@satolink.app`;

      toast({
        title: "LNURL Withdraw link generated",
        description: (
          <div className="mt-2 bg-secondary/80 p-4 rounded-md">
            <Label className="text-sm font-medium mb-2 block">LNURL:</Label>
            <p className="font-mono break-all text-sm text-primary/90">
              {lnurl}
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-2 w-full"
              onClick={() => navigator.clipboard.writeText(lnurl)}>
              Copy LNURL
            </Button>
            <div className="mt-2 text-xs text-muted-foreground">
              Amount: {data.amount} sats | Expires: {data.expiresAt}
            </div>
          </div>
        ),
      });
    } catch (error) {
      toast({
        title: "Error generating LNURL Withdraw",
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
                    Generate LNURL Withdraw Link
                  </CardTitle>
                  <CardDescription>
                    Create a LNURL Withdraw link to let others withdraw funds
                    from your wallet
                  </CardDescription>
                </CardHeader>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6 px-4 pb-6">
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Input placeholder="Gift for friend" {...field} />
                          </FormControl>
                          <FormDescription>
                            A short description for your withdrawal link
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
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
                          <FormDescription>
                            The amount available for withdrawal
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
                            When this withdrawal link will expire
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="uses"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Number of Uses</FormLabel>
                          <FormControl>
                            <Input type="number" min="1" max="100" {...field} />
                          </FormControl>
                          <FormDescription>
                            How many times this link can be used (1-100)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      className="bg-green-700 hover:bg-green-900">
                      Generate LNURL Withdraw
                    </Button>
                  </form>
                </Form>
                <CardFooter className="flex-col items-start gap-1.5 text-sm px-4 pb-4">
                  <Alert>
                    <LinkIcon className="h-4 w-4" />
                    <AlertTitle>LNURL Withdraw is flexible</AlertTitle>
                    <AlertDescription>
                      Share your withdrawal link with anyone - they can claim
                      funds without any account
                    </AlertDescription>
                  </Alert>
                </CardFooter>
              </Card>

              <Card className="@container/card">
                <CardHeader>
                  <CardTitle className="font-semibold text-2xl pb-3">
                    Active Withdraw Links
                  </CardTitle>
                  <CardDescription>
                    Your current LNURL withdrawal links
                  </CardDescription>
                </CardHeader>
                <div className="px-4 pb-6">
                  <DataTable columns={lnurlColumns} data={lnurlData} />
                </div>
                <CardFooter className="flex-col items-start gap-1.5 text-sm px-4 pb-4">
                  <div className="line-clamp-1 flex gap-2 font-medium">
                    Manage your withdrawal links
                  </div>
                  <div className="text-muted-foreground">
                    LNURL Withdraw allows others to withdraw funds using a
                    simple link
                  </div>
                </CardFooter>
              </Card>
            </div>

            <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4  *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-1 @5xl/main:grid-cols-1 mt-8">
              <Card className="@container/card">
                <CardHeader>
                  <CardTitle className="font-semibold text-2xl pb-3">
                    Withdraw History
                  </CardTitle>
                  <CardDescription>
                    Historical data of your LNURL withdrawal links
                  </CardDescription>
                </CardHeader>
                <div className="px-4 pb-6">
                  <SecondaryDatatable columns={lnurlColumns} data={lnurlData} />
                </div>
                <CardFooter className="flex-col items-start gap-1.5 text-sm px-4 pb-4">
                  <Alert>
                    <AlertCircleIcon className="h-4 w-4" />
                    <AlertTitle>Data Retention</AlertTitle>
                    <AlertDescription>
                      Your LNURL Withdraw history is stored securely. Configure
                      your privacy settings to manage data retention.
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
