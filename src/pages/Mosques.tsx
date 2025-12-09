import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, Search, MoreHorizontal, MapPin, Edit, Trash2, Eye } from "lucide-react";

interface Mosque {
  id: string;
  name: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  status: "active" | "pending" | "inactive";
  visits: number;
  addedBy: string;
  createdAt: string;
}

const mosques: Mosque[] = [
  {
    id: "1",
    name: "Masjid Al-Haram",
    city: "Makkah",
    country: "Saudi Arabia",
    latitude: 21.4225,
    longitude: 39.8262,
    status: "active",
    visits: 125000,
    addedBy: "System",
    createdAt: "2024-01-01",
  },
  {
    id: "2",
    name: "Al-Masjid an-Nabawi",
    city: "Madinah",
    country: "Saudi Arabia",
    latitude: 24.4672,
    longitude: 39.6112,
    status: "active",
    visits: 98000,
    addedBy: "System",
    createdAt: "2024-01-01",
  },
  {
    id: "3",
    name: "Al-Aqsa Mosque",
    city: "Jerusalem",
    country: "Palestine",
    latitude: 31.7761,
    longitude: 35.2358,
    status: "active",
    visits: 75000,
    addedBy: "System",
    createdAt: "2024-01-01",
  },
  {
    id: "4",
    name: "Islamic Center of New York",
    city: "New York",
    country: "USA",
    latitude: 40.7700,
    longitude: -73.9572,
    status: "pending",
    visits: 0,
    addedBy: "user_1234",
    createdAt: "2024-12-01",
  },
  {
    id: "5",
    name: "East London Mosque",
    city: "London",
    country: "United Kingdom",
    latitude: 51.5185,
    longitude: -0.0657,
    status: "active",
    visits: 45000,
    addedBy: "admin",
    createdAt: "2024-02-15",
  },
];

const Mosques = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredMosques = mosques.filter((mosque) => {
    const matchesSearch =
      mosque.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mosque.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mosque.country.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || mosque.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <AdminLayout
      title="Mosques"
      subtitle="Manage all mosques in the Silent Masjid network."
    >
      {/* Actions Bar */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 gap-3">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search mosques..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <Button variant="islamic">
          <Plus className="h-4 w-4" />
          Add Mosque
        </Button>
      </div>

      {/* Mosques Table */}
      <div className="rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mosque</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Coordinates</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Visits</TableHead>
              <TableHead>Added By</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMosques.map((mosque) => (
              <TableRow key={mosque.id} className="group">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{mosque.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Added {mosque.createdAt}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="text-sm text-foreground">{mosque.city}</p>
                    <p className="text-xs text-muted-foreground">{mosque.country}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <code className="rounded bg-muted px-2 py-1 text-xs">
                    {mosque.latitude.toFixed(4)}, {mosque.longitude.toFixed(4)}
                  </code>
                </TableCell>
                <TableCell>
                  <Badge variant={mosque.status}>{mosque.status}</Badge>
                </TableCell>
                <TableCell className="text-right font-medium">
                  {mosque.visits.toLocaleString()}
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">{mosque.addedBy}</span>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </AdminLayout>
  );
};

export default Mosques;
