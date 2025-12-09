import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Jan", donations: 2400 },
  { name: "Feb", donations: 1398 },
  { name: "Mar", donations: 4800 },
  { name: "Apr", donations: 3908 },
  { name: "May", donations: 4800 },
  { name: "Jun", donations: 3800 },
  { name: "Jul", donations: 5300 },
];

export function DonationChart() {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="font-serif text-lg font-semibold text-foreground">
            Donation Overview
          </h3>
          <p className="text-sm text-muted-foreground">
            Monthly donation trends
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-foreground">$26,406</p>
          <p className="text-sm text-success">+12.5% from last year</p>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorDonations" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(158, 64%, 35%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(158, 64%, 35%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(150, 20%, 88%)"
              vertical={false}
            />
            <XAxis
              dataKey="name"
              stroke="hsl(150, 10%, 45%)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="hsl(150, 10%, 45%)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(0, 0%, 100%)",
                border: "1px solid hsl(150, 20%, 88%)",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
              formatter={(value: number) => [`$${value}`, "Donations"]}
            />
            <Area
              type="monotone"
              dataKey="donations"
              stroke="hsl(158, 64%, 35%)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorDonations)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
