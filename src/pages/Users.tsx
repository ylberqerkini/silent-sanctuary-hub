import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Search, MoreHorizontal, Mail, Ban, Shield, User } from "lucide-react";

interface UserData {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  joinedAt: string;
  lastActive: string;
  mosqueVisits: number;
  donations: number;
  status: "active" | "inactive" | "banned";
  role: "user" | "admin";
}

const users: UserData[] = [
  {
    id: "1",
    name: "Ahmed Hassan",
    email: "ahmed.hassan@email.com",
    avatar: "",
    joinedAt: "2024-01-15",
    lastActive: "2 hours ago",
    mosqueVisits: 156,
    donations: 250,
    status: "active",
    role: "user",
  },
  {
    id: "2",
    name: "Fatima Khan",
    email: "fatima.khan@email.com",
    avatar: "",
    joinedAt: "2024-02-20",
    lastActive: "5 minutes ago",
    mosqueVisits: 89,
    donations: 500,
    status: "active",
    role: "user",
  },
  {
    id: "3",
    name: "Yusuf Ali",
    email: "yusuf.ali@email.com",
    avatar: "",
    joinedAt: "2024-03-10",
    lastActive: "1 day ago",
    mosqueVisits: 234,
    donations: 150,
    status: "active",
    role: "admin",
  },
  {
    id: "4",
    name: "Aisha Mohammed",
    email: "aisha.m@email.com",
    avatar: "",
    joinedAt: "2024-04-05",
    lastActive: "3 days ago",
    mosqueVisits: 45,
    donations: 0,
    status: "inactive",
    role: "user",
  },
  {
    id: "5",
    name: "Omar Farooq",
    email: "omar.f@email.com",
    avatar: "",
    joinedAt: "2024-05-18",
    lastActive: "1 week ago",
    mosqueVisits: 12,
    donations: 75,
    status: "banned",
    role: "user",
  },
];

const Users = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout
      title="Users"
      subtitle="Manage user accounts and view activity."
    >
      {/* Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        <div className="rounded-xl border bg-card p-4">
          <p className="text-sm text-muted-foreground">Total Users</p>
          <p className="text-2xl font-bold">48,234</p>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <p className="text-sm text-muted-foreground">Active Today</p>
          <p className="text-2xl font-bold text-success">12,456</p>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <p className="text-sm text-muted-foreground">New This Week</p>
          <p className="text-2xl font-bold text-primary">892</p>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <p className="text-sm text-muted-foreground">Total Donations</p>
          <p className="text-2xl font-bold text-gold">$26,406</p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-right">Mosque Visits</TableHead>
              <TableHead className="text-right">Donations</TableHead>
              <TableHead>Last Active</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id} className="group">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-foreground">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      user.status === "active"
                        ? "success"
                        : user.status === "banned"
                        ? "destructive"
                        : "secondary"
                    }
                  >
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={user.role === "admin" ? "gold" : "outline"}>
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-medium">
                  {user.mosqueVisits}
                </TableCell>
                <TableCell className="text-right font-medium">
                  ${user.donations}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {user.lastActive}
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
                        <User className="mr-2 h-4 w-4" />
                        View Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Mail className="mr-2 h-4 w-4" />
                        Send Email
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Shield className="mr-2 h-4 w-4" />
                        Make Admin
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Ban className="mr-2 h-4 w-4" />
                        Ban User
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

export default Users;
