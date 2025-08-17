import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";
import { TrendingUp } from "lucide-react";
import {
  CartesianGrid,
  Dot,
  Line,
  LineChart,
  LabelList,
  CartesianAxis,
  XAxis,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IconUserCircle } from "@tabler/icons-react";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
export const description = "A line chart with dots and colors";

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
import { toast } from "react-toastify";

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

const chartData = [
  { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
  { browser: "firefox", visitors: 187, fill: "var(--color-firefox)" },
  { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
  { browser: "other", visitors: 90, fill: "var(--color-other)" },
];

const chartConfig = {
  visitors: {
    label: "Visitors",
    color: "var(--chart-2)",
  },
  chrome: {
    label: "Chrome",
    color: "var(--chart-1)",
  },
  safari: {
    label: "Safari",
    color: "var(--chart-2)",
  },
  firefox: {
    label: "Firefox",
    color: "var(--chart-3)",
  },
  edge: {
    label: "Edge",
    color: "var(--chart-4)",
  },
  other: {
    label: "Other",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig;

export function ChartLineDotsColors() {
  return (
    <Card style={{ height: "20rem" }}>
      <CardHeader>
        <CardTitle>Last Month Balance Statistics</CardTitle>
        <CardDescription>Total balance</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 0,
              left: 24,
              right: 24,
            }}>
            <XAxis
              dataKey="browser"
              tickLine={false}
              axisLine={false}
              tickMargin={-30}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <CartesianGrid vertical={false} />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="line"
                  nameKey="visitors"
                  hideLabel
                />
              }
            />
            <Line
              dataKey="visitors"
              type="natural"
              stroke="var(--color-visitors)"
              strokeWidth={2}
              dot={({ payload, ...props }) => {
                return (
                  <Dot
                    key={payload.browser}
                    r={5}
                    cx={props.cx}
                    cy={props.cy}
                    fill={payload.fill}
                    stroke={payload.fill}
                  />
                );
              }}
            />
            <LabelList
              position="top"
              offset={0}
              className="fill-foreground"
              fontSize={12}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      {/* <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter> */}
    </Card>
  );
}

export function SectionCards() {
  const notify = () => {
    toast.warning("Wow so easy!");
  };
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-4 lg:px-6">
        {/* Total Balance */}
        <Card
          className="text-center border-none bg-transparent 
                   md:col-start-1 md:row-start-1 
                   lg:col-start-3 lg:row-start-1">
          <CardHeader className="text-center">
            <CardDescription className="mb-5 text-center">
              Total balance
            </CardDescription>
            <CardTitle className="text-4xl font-normal tabular-nums">
              $10.330.41
            </CardTitle>
            <div className="w-full text-center">
              <Badge variant="outline" className="text-green-500 mx-auto">
                +12.5%
                <IconTrendingUp />
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Lightning Network */}
        <Card className="md:col-start-1 md:row-start-2 lg:col-start-1 lg:row-start-1">
          <CardHeader>
            <CardDescription className="mb-7">
              Lightning Network
            </CardDescription>
            <CardTitle className="text-xl font-semibold tabular-nums">
              0.00231 <span className="text-muted-foreground">BTC</span>
              <Badge variant="outline" className="text-green-500">
                +12.5%
                <IconTrendingUp />
              </Badge>
            </CardTitle>
            <CardAction>...</CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm text-muted-foreground">
            BTC transactions
          </CardFooter>
        </Card>

        {/* Taproot Assets */}
        <Card className="md:col-start-2 md:row-start-2 lg:col-start-2 lg:row-start-1">
          <CardHeader>
            <CardDescription className="mb-7">Taproot Assets</CardDescription>
            <CardTitle className="text-xl font-semibold tabular-nums">
              2.320.01 <span className="text-muted-foreground">USDT</span>
              <Badge variant="outline" className="text-green-500">
                +12.5%
                <IconTrendingUp />
              </Badge>
            </CardTitle>
            <CardAction>...</CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm text-muted-foreground">
            USDT transactions
          </CardFooter>
        </Card>
      </div>

      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4  *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-2 mt-6">
        <div className="">
          <h2 className="mb-4">Balance History</h2>
          <ChartLineDotsColors className="" />
        </div>
        <div className="">
          <h2 className="mb-4">Transactions History</h2>
          <div
            className="flex gap-4 flex-col"
            style={{
              height: "20rem",
              overflowY: "scroll",
            }}>
            <Card className="py-2">
              <CardHeader className="flex justify-between items-center px-2">
                {/* Columna 1: Icono */}
                <div className="flex items-center space-x-4">
                  <IconUserCircle size={40} color={"green"} stroke={1} />
                  {/* Columna 2: texto tipo y red */}
                  <div>
                    <strong className="text-[12px] text-base md:text-sm lg:text-base">
                      Transfer Balance
                    </strong>
                    <small className="block text-[10px] md:text-[10px] lg:text-xs text-muted-foreground">
                      Lightning Network
                    </small>
                  </div>
                </div>

                {/* Columna 3: fecha y monto */}
                <div className="text-right">
                  <small className="text-[8px] text-xs md:text-[10px] lg:text-xs text-muted-foreground">
                    20-04-2023
                  </small>
                  <div>
                    <strong className="text-green-500 text-sm md:text-xs lg:text-sm">
                      +12.00000
                    </strong>
                  </div>
                </div>
              </CardHeader>
            </Card>
            <Card className="py-2">
              <CardHeader className="flex justify-between items-center px-2">
                {/* Columna 1: Icono */}
                <div className="flex items-center space-x-4">
                  <IconUserCircle size={40} color={"green"} stroke={1} />
                  {/* Columna 2: texto tipo y red */}
                  <div>
                    <strong className="text-[12px] text-base md:text-sm lg:text-base">
                      Transfer Balance
                    </strong>
                    <small className="block text-[10px] md:text-[10px] lg:text-xs text-muted-foreground">
                      Lightning Network
                    </small>
                  </div>
                </div>

                {/* Columna 3: fecha y monto */}
                <div className="text-right">
                  <small className="text-[8px] text-xs md:text-[10px] lg:text-xs text-muted-foreground">
                    20-04-2023
                  </small>
                  <div>
                    <strong className="text-green-500 text-sm md:text-xs lg:text-sm">
                      +12.00000
                    </strong>
                  </div>
                </div>
              </CardHeader>
            </Card>
            <Card className="py-2">
              <CardHeader className="flex justify-between items-center px-2">
                {/* Columna 1: Icono */}
                <div className="flex items-center space-x-4">
                  <IconUserCircle size={40} color={"green"} stroke={1} />
                  {/* Columna 2: texto tipo y red */}
                  <div>
                    <strong className="text-[12px] text-base md:text-sm lg:text-base">
                      Transfer Balance
                    </strong>
                    <small className="block text-[10px] md:text-[10px] lg:text-xs text-muted-foreground">
                      Lightning Network
                    </small>
                  </div>
                </div>

                {/* Columna 3: fecha y monto */}
                <div className="text-right">
                  <small className="text-[8px] text-xs md:text-[10px] lg:text-xs text-muted-foreground">
                    20-04-2023
                  </small>
                  <div>
                    <strong className="text-green-500 text-sm md:text-xs lg:text-sm">
                      +12.00000
                    </strong>
                  </div>
                </div>
              </CardHeader>
            </Card>
            <Card className="py-2">
              <CardHeader className="flex justify-between items-center px-2">
                {/* Columna 1: Icono */}
                <div className="flex items-center space-x-4">
                  <IconUserCircle size={40} color={"green"} stroke={1} />
                  {/* Columna 2: texto tipo y red */}
                  <div>
                    <strong className="text-[12px] text-base md:text-sm lg:text-base">
                      Transfer Balance
                    </strong>
                    <small className="block text-[10px] md:text-[10px] lg:text-xs text-muted-foreground">
                      Lightning Network
                    </small>
                  </div>
                </div>

                {/* Columna 3: fecha y monto */}
                <div className="text-right">
                  <small className="text-[8px] text-xs md:text-[10px] lg:text-xs text-muted-foreground">
                    20-04-2023
                  </small>
                  <div>
                    <strong className="text-green-500 text-sm md:text-xs lg:text-sm">
                      +12.00000
                    </strong>
                  </div>
                </div>
              </CardHeader>
            </Card>
            <Card className="py-2">
              <CardHeader className="flex justify-between items-center px-2">
                {/* Columna 1: Icono */}
                <div className="flex items-center space-x-4">
                  <IconUserCircle size={40} color={"green"} stroke={1} />
                  {/* Columna 2: texto tipo y red */}
                  <div>
                    <strong className="text-[12px] text-base md:text-sm lg:text-base">
                      Transfer Balance
                    </strong>
                    <small className="block text-[10px] md:text-[10px] lg:text-xs text-muted-foreground">
                      Lightning Network
                    </small>
                  </div>
                </div>

                {/* Columna 3: fecha y monto */}
                <div className="text-right">
                  <small className="text-[8px] text-xs md:text-[10px] lg:text-xs text-muted-foreground">
                    20-04-2023
                  </small>
                  <div>
                    <strong className="text-green-500 text-sm md:text-xs lg:text-sm">
                      +12.00000
                    </strong>
                  </div>
                </div>
              </CardHeader>
            </Card>
            <Card className="py-2">
              <CardHeader className="flex justify-between items-center px-2">
                {/* Columna 1: Icono */}
                <div className="flex items-center space-x-4">
                  <IconUserCircle size={40} color={"green"} stroke={1} />
                  {/* Columna 2: texto tipo y red */}
                  <div>
                    <strong className="text-[12px] text-base md:text-sm lg:text-base">
                      Transfer Balance
                    </strong>
                    <small className="block text-[10px] md:text-[10px] lg:text-xs text-muted-foreground">
                      Lightning Network
                    </small>
                  </div>
                </div>

                {/* Columna 3: fecha y monto */}
                <div className="text-right">
                  <small className="text-[8px] text-xs md:text-[10px] lg:text-xs text-muted-foreground">
                    20-04-2023
                  </small>
                  <div>
                    <strong className="text-green-500 text-sm md:text-xs lg:text-sm">
                      +12.00000
                    </strong>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4  *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-2 mt-6">
        <div>
          <h2 className="mb-4">Pending invoices</h2>
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
        <div>
          <h2 className="mb-4">Satolink address</h2>
          <div
            onClick={notify}
            style={{
              position: "relative",
              height: "223px",
              width: "150px",
              backgroundImage: "url(/glass-editing.png)",
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
            }}>
            <div
              className="text-white"
              style={{
                position: "absolute",
                bottom: "25px",
                fontSize: "14px",
                left: "10px",
                width: "130px",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}>
              joel@satolink.com
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
