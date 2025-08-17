"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Fade, Slide, JackInTheBox } from "react-awesome-reveal";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";
import { AlertCircleIcon, CheckCircle2Icon, PopcornIcon } from "lucide-react";
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
import { LightningBoltIcon, ReloadIcon } from "@radix-ui/react-icons";
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
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
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

type Payment = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
};

// export const payments: Payment[] = [
//   {
//     id: "728ed52f",
//     amount: 100,
//     status: "pending",
//     email: "m@example.com",
//   },
//   {
//     id: "489e1d42",
//     amount: 125,
//     status: "processing",
//     email: "example@gmail.com",
//   },
//   // ...
// ]

const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "amount",
    header: "Amount *",
  },
];

const data: Payment[] = [
  {
    id: "728ed52f",
    amount: 100,
    status: "pending",
    email: "m@example.com",
  },
  {
    id: "728ed52f",
    amount: 100,
    status: "pending",
    email: "m@example.com",
  },
  {
    id: "489e1d42",
    amount: 125,
    status: "processing",
    email: "example@gmail.com",
  },
];

// Esquema de validación con Zod
const FormSchema = z.object({
  amount: z.coerce
    .number()
    .int()
    .positive("El monto debe ser positivo")
    .min(1, "El monto mínimo es 1 sat"),
  memo: z.string().optional(),
});

export default function Page() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      amount: 1000,
      memo: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      // Simulación de generación de invoice
      const response = {
        paymentRequest: "lnbc10u1p3...", // Invoice simulada
        paymentHash: "abc123...",
      };

      toast({
        title: "Invoice generada con éxito",
        description: (
          <div className="mt-2 bg-secondary/80 p-4 rounded-md">
            <Label className="text-sm font-medium mb-2 block">
              Invoice Lightning:
            </Label>
            <p className="font-mono break-all text-sm text-primary/90">
              {response.paymentRequest}
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-2 w-full"
              onClick={() =>
                navigator.clipboard.writeText(response.paymentRequest)
              }>
              Copiar Invoice
            </Button>
          </div>
        ),
      });
    } catch (error) {
      toast({
        title: "Error al generar la invoice",
        description:
          error instanceof Error ? error.message : "Error desconocido",
        variant: "destructive",
      });
    }
  }

  return (
    <div>
      {/* <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="px-4 lg:px-6">
              <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mb-12">
                BTC Invoices
              </h3>
            </div>
          </div>
        </div>
      </div> */}
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="">
              <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4  *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-2">
                <Card className="@container/card">
                  <CardHeader>
                    <CardTitle className="font-semibold text-2xl pb-3">
                      Generate BTC Invoice
                    </CardTitle>
                    <CardDescription>
                      Create a new invoice to receive payments in the Ligntning
                      Network
                    </CardDescription>
                    <form className="my-5">
                      <div className="flex flex-col gap-6">
                        <div className="grid gap-5">
                          <Label htmlFor="amount">Amount</Label>
                          <Input
                            id="amount"
                            type="amount"
                            onChange={(e) => console.log("click")}
                            placeholder="5000000"
                            required
                          />
                          <Label htmlFor="amount">Memo/Description</Label>
                          <Textarea placeholder="Type your message here." />
                          <Button className="bg-green-700 hover:bg-green-900 cursor-pointer">
                            Generate Invoice
                          </Button>
                        </div>
                      </div>
                    </form>
                  </CardHeader>
                  <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <Alert>
                      <CheckCircle2Icon />
                      <AlertTitle>Share your invoice</AlertTitle>
                      <AlertDescription>
                        Improve your business with automatic invoices
                      </AlertDescription>
                    </Alert>
                  </CardFooter>
                </Card>
                <Card className="@container/card">
                  <CardHeader>
                    <CardTitle className="font-semibold text-2xl pb-3">
                      Pending invoices
                    </CardTitle>
                    <CardDescription>
                      Active Invoices waiting for payment
                    </CardDescription>
                    <div className="w-full overflow-hidden">
                      <DataTable columns={columns} data={data} />
                    </div>
                  </CardHeader>
                  <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className="line-clamp-1 flex gap-2 font-medium">
                      Pending invoices are monitorized by Satolink
                    </div>
                    <div className="text-muted-foreground">
                      (*) Amount is expressed in Satoshis
                    </div>
                  </CardFooter>
                </Card>
              </div>
              <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4  *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-1 @5xl/main:grid-cols-1 mt-8">
                <Card className="@container/card">
                  <CardHeader>
                    <CardTitle className="font-semibold text-2xl pb-3">
                      Invoices Historic
                    </CardTitle>
                    <CardDescription>
                      Generated invoices to receive payments in the Ligntning
                      Network
                    </CardDescription>
                  </CardHeader>
                  <SecondaryDatatable columns={columns} data={data} />
                  <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <Alert>
                      <CheckCircle2Icon />
                      <AlertTitle>Privacy Setup</AlertTitle>
                      <AlertDescription>
                        Check your historical data configuration to keep or
                        delete your past invoices automatically
                      </AlertDescription>
                    </Alert>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
