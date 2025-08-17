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
  AlertCircleIcon as LightningBoltIcon,
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

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

const colorByStatus = {
  active: "bg-green-500 capitalize",
  inactive: "bg-gray-500 capitalize",
  pending: "bg-yellow-500 text-black capitalize",
  full: "bg-blue-500 capitalize",
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

type LNChannel = {
  id: string;
  nodeId: string;
  capacity: number;
  localBalance: number;
  status: "active" | "inactive" | "pending" | "full";
  createdAt: string;
};

const channelColumns: ColumnDef<LNChannel>[] = [
  {
    accessorKey: "nodeId",
    header: "Node ID",
  },
  {
    accessorKey: "capacity",
    header: "Capacity (sats)",
  },
  {
    accessorKey: "localBalance",
    header: "Local Balance (sats)",
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

const channelData: LNChannel[] = [
  {
    id: "1",
    nodeId: "02abc123...def456",
    capacity: 500000,
    localBalance: 450000,
    status: "active",
    createdAt: "2023-06-15",
  },
  {
    id: "2",
    nodeId: "03xyz789...uvw012",
    capacity: 250000,
    localBalance: 250000,
    status: "full",
    createdAt: "2023-06-10",
  },
];

// Assuming user has a balance of 1,000,000 sats
const MAX_CHANNEL_CAPACITY = 1000000;

const FormSchema = z.object({
  capacity: z.coerce
    .number()
    .int()
    .positive()
    .min(1, "Channel capacity must be at least 1 sat")
    .max(
      MAX_CHANNEL_CAPACITY,
      `Channel capacity cannot exceed your balance of ${MAX_CHANNEL_CAPACITY} sats`
    ),
  nodeId: z
    .string()
    .min(1, "Node ID is required")
    .regex(/^0[2-3][a-fA-F0-9]{64}$/, "Invalid Node ID format"),
  confirmation: z.boolean().refine((value) => value === true, {
    message: "You must confirm the channel creation",
  }),
});

export default function LNChannelPage() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      capacity: 100000,
      nodeId: "",
      confirmation: false,
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      // Simulate LN channel creation
      const channelId = `channel-${Date.now()}`;

      toast({
        title: "Lightning Channel Requested",
        description: (
          <div className="mt-2 bg-secondary/80 p-4 rounded-md">
            <Label className="text-sm font-medium mb-2 block">
              Channel Details:
            </Label>
            <div className="space-y-1 text-sm text-primary/90">
              <p>
                <span className="font-medium">Node ID:</span> {data.nodeId}
              </p>
              <p>
                <span className="font-medium">Capacity:</span> {data.capacity}{" "}
                sats
              </p>
              <p>
                <span className="font-medium">Channel ID:</span> {channelId}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="mt-2 w-full"
              onClick={() => navigator.clipboard.writeText(`${channelId}`)}>
              Copy Channel ID
            </Button>
            <div className="mt-2 text-xs text-muted-foreground">
              Channel is being established. This may take a few minutes.
            </div>
          </div>
        ),
      });
    } catch (error) {
      toast({
        title: "Error creating Lightning Channel",
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
                    Open Lightning Channel
                  </CardTitle>
                  <CardDescription>
                    Create a new channel to improve your Lightning Network
                    connectivity
                  </CardDescription>
                </CardHeader>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6 px-4 pb-6">
                    <FormField
                      control={form.control}
                      name="nodeId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Remote Node ID</FormLabel>
                          <FormControl>
                            <Input placeholder="02abc123...def456" {...field} />
                          </FormControl>
                          <FormDescription>
                            The public key of the node you want to open a
                            channel with
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="capacity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Channel Capacity (sats)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="100000"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Amount to allocate to this channel (1 -{" "}
                            {MAX_CHANNEL_CAPACITY} sats)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="confirmation"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <input
                              type="checkbox"
                              checked={field.value}
                              onChange={field.onChange}
                              className="mt-1 h-4 w-4 rounded border-gray-300 text-green-700 focus:ring-green-700"
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              I understand that opening a channel commits my
                              funds
                            </FormLabel>
                            <FormDescription>
                              Channel funds are locked until the channel is
                              closed
                            </FormDescription>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      className="bg-green-700 hover:bg-green-900">
                      Open Channel
                    </Button>
                  </form>
                </Form>
                <CardFooter className="flex-col items-start gap-1.5 text-sm px-4 pb-4">
                  <Alert>
                    <LightningBoltIcon className="h-4 w-4" />
                    <AlertTitle>Channel Capacity</AlertTitle>
                    <AlertDescription>
                      Your maximum channel capacity is {MAX_CHANNEL_CAPACITY}{" "}
                      sats, which is your total available balance.
                    </AlertDescription>
                  </Alert>
                </CardFooter>
              </Card>

              <Card className="@container/card">
                <CardHeader>
                  <CardTitle className="font-semibold text-2xl pb-3">
                    Active Channels
                  </CardTitle>
                  <CardDescription>
                    Your current Lightning Network channels
                  </CardDescription>
                </CardHeader>
                <div className="px-4 pb-6">
                  <DataTable columns={channelColumns} data={channelData} />
                </div>
                <CardFooter className="flex-col items-start gap-1.5 text-sm px-4 pb-4">
                  <div className="line-clamp-1 flex gap-2 font-medium">
                    Manage your Lightning channels
                  </div>
                  <div className="text-muted-foreground">
                    Active channels enable faster and more reliable payments
                  </div>
                </CardFooter>
              </Card>
            </div>

            <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4  *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-1 @5xl/main:grid-cols-1 mt-8">
              <Card className="@container/card">
                <CardHeader>
                  <CardTitle className="font-semibold text-2xl pb-3">
                    Channel History
                  </CardTitle>
                  <CardDescription>
                    Historical data of your Lightning Network channels
                  </CardDescription>
                </CardHeader>
                <div className="px-4 pb-6">
                  <SecondaryDatatable
                    columns={channelColumns}
                    data={channelData}
                  />
                </div>
                <CardFooter className="flex-col items-start gap-1.5 text-sm px-4 pb-4">
                  <Alert>
                    <AlertCircleIcon className="h-4 w-4" />
                    <AlertTitle>Channel Management</AlertTitle>
                    <AlertDescription>
                      Monitor your channel performance and consider rebalancing
                      when needed.
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
