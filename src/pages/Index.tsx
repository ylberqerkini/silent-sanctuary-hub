import { AdminLayout } from "@/components/layout/AdminLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { DonationChart } from "@/components/dashboard/DonationChart";
import { MosqueMap } from "@/components/dashboard/MosqueMap";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { MapPin, Users, DollarSign, Bell, FileText, Lightbulb } from "lucide-react";

const Dashboard = () => {
  return (
    <AdminLayout
      title="Dashboard"
      subtitle="Welcome back! Here's what's happening with Silent Masjid."
    >
      {/* Stats Grid */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 stagger-children">
        <StatsCard
          title="Total Mosques"
          value="1,247"
          change={12}
          icon={<MapPin className="h-5 w-5" />}
          variant="primary"
        />
        <StatsCard
          title="Active Users"
          value="48.2K"
          change={8.2}
          icon={<Users className="h-5 w-5" />}
          variant="success"
        />
        <StatsCard
          title="Total Donations"
          value="$26,406"
          change={15.3}
          icon={<DollarSign className="h-5 w-5" />}
          variant="gold"
        />
        <StatsCard
          title="Notifications Sent"
          value="124K"
          change={22}
          icon={<Bell className="h-5 w-5" />}
          variant="default"
        />
        <StatsCard
          title="Pending Submissions"
          value="23"
          change={-5}
          icon={<FileText className="h-5 w-5" />}
          variant="warning"
        />
        <StatsCard
          title="Feature Ideas"
          value="87"
          change={4}
          icon={<Lightbulb className="h-5 w-5" />}
          variant="default"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Charts */}
        <div className="space-y-6 lg:col-span-2">
          <DonationChart />
          <MosqueMap />
        </div>

        {/* Right Column - Activity & Actions */}
        <div className="space-y-6">
          <QuickActions />
          <RecentActivity />
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
