import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DollarSign, TrendingUp, Users, Target, Download, CreditCard } from "lucide-react";

interface Donation {
  id: string;
  donor: string;
  email: string;
  amount: number;
  type: "one-time" | "monthly";
  method: "stripe" | "paypal";
  date: string;
  status: "completed" | "pending" | "failed";
}

const donations: Donation[] = [
  {
    id: "1",
    donor: "Anonymous",
    email: "hidden",
    amount: 100,
    type: "one-time",
    method: "stripe",
    date: "2024-12-08",
    status: "completed",
  },
  {
    id: "2",
    donor: "Ahmed Hassan",
    email: "ahmed@email.com",
    amount: 50,
    type: "monthly",
    method: "stripe",
    date: "2024-12-08",
    status: "completed",
  },
  {
    id: "3",
    donor: "Fatima Khan",
    email: "fatima@email.com",
    amount: 250,
    type: "one-time",
    method: "paypal",
    date: "2024-12-07",
    status: "completed",
  },
  {
    id: "4",
    donor: "Anonymous",
    email: "hidden",
    amount: 25,
    type: "monthly",
    method: "stripe",
    date: "2024-12-07",
    status: "pending",
  },
  {
    id: "5",
    donor: "Yusuf Ali",
    email: "yusuf@email.com",
    amount: 500,
    type: "one-time",
    method: "paypal",
    date: "2024-12-06",
    status: "completed",
  },
];

const fundingGoal = 50000;
const currentFunding = 26406;
const fundingProgress = (currentFunding / fundingGoal) * 100;

const Donations = () => {
  return (
    <AdminLayout
      title="Donations"
      subtitle="Track donations and manage funding goals."
    >
      {/* Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gold/15">
              <DollarSign className="h-6 w-6 text-gold-dark" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Raised</p>
              <p className="text-2xl font-bold">${currentFunding.toLocaleString()}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/15">
              <TrendingUp className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">This Month</p>
              <p className="text-2xl font-bold">$4,250</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/15">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Donors</p>
              <p className="text-2xl font-bold">1,247</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/15">
              <Target className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Monthly Subscribers</p>
              <p className="text-2xl font-bold">156</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Funding Goal */}
      <Card className="mb-6 p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="font-serif text-lg font-semibold">Funding Goal</h3>
            <p className="text-sm text-muted-foreground">
              Support Islamic apps for the Ummah
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gold-dark">
              ${currentFunding.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">
              of ${fundingGoal.toLocaleString()} goal
            </p>
          </div>
        </div>
        <Progress value={fundingProgress} className="h-3" />
        <p className="mt-2 text-sm text-muted-foreground">
          {fundingProgress.toFixed(1)}% funded
        </p>
      </Card>

      {/* Actions */}
      <div className="mb-6 flex gap-3">
        <Button variant="islamic">
          <Download className="h-4 w-4" />
          Export Report
        </Button>
        <Button variant="outline">
          <CreditCard className="h-4 w-4" />
          View Stripe Dashboard
        </Button>
      </div>

      {/* Donations Table */}
      <div className="rounded-xl border border-border bg-card">
        <div className="border-b border-border px-6 py-4">
          <h3 className="font-serif text-lg font-semibold">Recent Donations</h3>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Donor</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {donations.map((donation) => (
              <TableRow key={donation.id}>
                <TableCell>
                  <div>
                    <p className="font-medium">{donation.donor}</p>
                    <p className="text-xs text-muted-foreground">
                      {donation.email}
                    </p>
                  </div>
                </TableCell>
                <TableCell className="font-bold text-gold-dark">
                  ${donation.amount}
                </TableCell>
                <TableCell>
                  <Badge variant={donation.type === "monthly" ? "gold" : "secondary"}>
                    {donation.type}
                  </Badge>
                </TableCell>
                <TableCell className="capitalize">{donation.method}</TableCell>
                <TableCell className="text-muted-foreground">
                  {donation.date}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      donation.status === "completed"
                        ? "success"
                        : donation.status === "pending"
                        ? "warning"
                        : "destructive"
                    }
                  >
                    {donation.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </AdminLayout>
  );
};

export default Donations;
