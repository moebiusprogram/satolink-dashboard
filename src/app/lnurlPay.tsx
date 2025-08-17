"use client";
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
import { CheckCircle2Icon, AlertCircleIcon } from "lucide-react";
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

type LNURLPay = {
  id: string;
  lnurl: string;
  min: number;
  max: number;
  status: "active" | "inactive";
  description: string;
};

const lnurlColumns: ColumnDef<LNURLPay>[] = [
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "min",
    header: "Min (sats)",
  },
  {
    accessorKey: "max",
    header: "Max (sats)",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "lnurl",
    header: "LNURL",
  },
];

const lnurlData: LNURLPay[] = [
  {
    id: "1",
    lnurl: "lnurlp:john Doe@satolink.app",
    min: 1,
    max: 50000,
    status: "active",
    description: "Support my content",
  },
  {
    id: "2",
    lnurl: "lnurlp:donations@satolink.app",
    min: 100,
    max: 100000,
    status: "active",
    description: "General donations",
  },
];

const FormSchema = z.object({
  description: z
    .string()
    .min(1, "Description is required")
    .max(50, "Description must be less than 50 characters"),
  minAmount: z.coerce
    .number()
    .int()
    .positive()
    .min(1, "Minimum amount must be at least 1 sat"),
  maxAmount: z.coerce
    .number()
    .int()
    .positive()
    .min(1, "Maximum amount must be at least 1 sat")
    .refine((data, { path, ctx }) => data >= ctx.parent.minAmount, {
      message: "Max amount must be greater than or equal to min amount",
      path: [],
    }),
  commentAllowed: z.coerce.number().min(0).max(500).default(0),
});

export default function LNURLPayPage() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      description: "",
      minAmount: 1,
      maxAmount: 50000,
      commentAllowed: 100,
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      // Simulate LNURL Pay link generation
      const lnurl = `lnurlp:${data.description
        .toLowerCase()
        .replace(/\s+/g, "-")}-min${data.minAmount}-max${
        data.maxAmount
      }@satolink.app`;

      toast({
        title: "LNURL Pay link generated",
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
              Min: {data.minAmount} sats | Max: {data.maxAmount} sats
            </div>
          </div>
        ),
      });
    } catch (error) {
      toast({
        title: "Error generating LNURL Pay",
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
                    Generate LNURL Pay Link
                  </CardTitle>
                  <CardDescription>
                    Create a LNURL Pay link to receive payments on the Lightning
                    Network
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
                            <Input placeholder="Support my work" {...field} />
                          </FormControl>
                          <FormDescription>
                            A short description for your payment request
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="minAmount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Minimum Amount (sats)</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="1" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="maxAmount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Maximum Amount (sats)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="50000"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="commentAllowed"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Comment Length Allowed</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="0"
                              {...field}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value === ""
                                    ? 0
                                    : parseInt(e.target.value)
                                )
                              }
                            />
                          </FormControl>
                          <FormDescription>
                            Maximum characters allowed in comment (0-500)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      className="bg-green-700 hover:bg-green-900">
                      Generate LNURL Pay
                    </Button>
                  </form>
                </Form>
                <CardFooter className="flex-col items-start gap-1.5 text-sm px-4 pb-4">
                  <Alert>
                    <CheckCircle2Icon className="h-4 w-4" />
                    <AlertTitle>LNURL Pay is universal</AlertTitle>
                    <AlertDescription>
                      Anyone with a Lightning wallet can pay your LNURL,
                      regardless of their provider
                    </AlertDescription>
                  </Alert>
                </CardFooter>
              </Card>

              <Card className="@container/card">
                <CardHeader>
                  <CardTitle className="font-semibold text-2xl pb-3">
                    Active LNURL Pay Links
                  </CardTitle>
                  <CardDescription>
                    Your current LNURL payment links
                  </CardDescription>
                </CardHeader>
                <div className="px-4 pb-6">
                  <DataTable columns={lnurlColumns} data={lnurlData} />
                </div>
                <CardFooter className="flex-col items-start gap-1.5 text-sm px-4 pb-4">
                  <div className="line-clamp-1 flex gap-2 font-medium">
                    Manage your LNURL Pay links
                  </div>
                  <div className="text-muted-foreground">
                    LNURL Pay allows others to pay you using a simple link
                  </div>
                </CardFooter>
              </Card>
            </div>

            <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4  *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-1 @5xl/main:grid-cols-1 mt-8">
              <Card className="@container/card">
                <CardHeader>
                  <CardTitle className="font-semibold text-2xl pb-3">
                    LNURL Pay History
                  </CardTitle>
                  <CardDescription>
                    Historical data of your LNURL payment requests
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
                      Your LNURL Pay history is stored securely. Configure your
                      privacy settings to manage data retention.
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
