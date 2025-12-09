import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Check, X, MapPin, User, Clock, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface Submission {
  id: string;
  mosqueName: string;
  address: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  submittedBy: string;
  email: string;
  notes: string;
  submittedAt: string;
  status: "pending" | "approved" | "rejected";
}

const submissions: Submission[] = [
  {
    id: "1",
    mosqueName: "Masjid Al-Nur",
    address: "123 Main Street",
    city: "Chicago",
    country: "USA",
    latitude: 41.8781,
    longitude: -87.6298,
    submittedBy: "Ahmed Hassan",
    email: "ahmed@example.com",
    notes: "Beautiful mosque with large prayer hall. Open 24 hours during Ramadan.",
    submittedAt: "2024-12-08",
    status: "pending",
  },
  {
    id: "2",
    mosqueName: "Islamic Cultural Center",
    address: "456 Oak Avenue",
    city: "Toronto",
    country: "Canada",
    latitude: 43.6532,
    longitude: -79.3832,
    submittedBy: "Fatima Khan",
    email: "fatima@example.com",
    notes: "Community center with mosque, school, and event hall.",
    submittedAt: "2024-12-07",
    status: "pending",
  },
  {
    id: "3",
    mosqueName: "Grand Mosque of Paris",
    address: "2bis Place du Puits de l'Ermite",
    city: "Paris",
    country: "France",
    latitude: 48.8422,
    longitude: 2.3559,
    submittedBy: "Yusuf Dubois",
    email: "yusuf@example.com",
    notes: "Historic mosque with stunning architecture. Popular tourist destination.",
    submittedAt: "2024-12-06",
    status: "pending",
  },
];

const Submissions = () => {
  const [submissionList, setSubmissionList] = useState(submissions);

  const handleApprove = (id: string) => {
    setSubmissionList(
      submissionList.map((s) =>
        s.id === id ? { ...s, status: "approved" as const } : s
      )
    );
    toast.success("Mosque approved and added to the network!");
  };

  const handleReject = (id: string) => {
    setSubmissionList(
      submissionList.map((s) =>
        s.id === id ? { ...s, status: "rejected" as const } : s
      )
    );
    toast.error("Submission rejected");
  };

  const pendingSubmissions = submissionList.filter((s) => s.status === "pending");
  const processedSubmissions = submissionList.filter((s) => s.status !== "pending");

  return (
    <AdminLayout
      title="Mosque Submissions"
      subtitle="Review and approve new mosque submissions from the community."
    >
      {/* Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/15">
              <Clock className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold">{pendingSubmissions.length}</p>
              <p className="text-sm text-muted-foreground">Pending Review</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/15">
              <Check className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {processedSubmissions.filter((s) => s.status === "approved").length}
              </p>
              <p className="text-sm text-muted-foreground">Approved Today</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/15">
              <X className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {processedSubmissions.filter((s) => s.status === "rejected").length}
              </p>
              <p className="text-sm text-muted-foreground">Rejected Today</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Pending Submissions */}
      <div className="mb-8">
        <h2 className="mb-4 font-serif text-xl font-semibold">Pending Submissions</h2>
        {pendingSubmissions.length === 0 ? (
          <Card className="p-8 text-center">
            <Check className="mx-auto mb-4 h-12 w-12 text-success" />
            <h3 className="font-serif text-lg font-semibold">All caught up!</h3>
            <p className="text-muted-foreground">No pending submissions to review.</p>
          </Card>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {pendingSubmissions.map((submission) => (
              <Card key={submission.id} className="overflow-hidden">
                <div className="border-b border-border bg-muted/30 px-6 py-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                        <MapPin className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-serif text-lg font-semibold">
                          {submission.mosqueName}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {submission.city}, {submission.country}
                        </p>
                      </div>
                    </div>
                    <Badge variant="pending">Pending</Badge>
                  </div>
                </div>

                <div className="p-6">
                  <div className="mb-4 space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{submission.address}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {submission.submittedBy} ({submission.email})
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>Submitted {submission.submittedAt}</span>
                    </div>
                  </div>

                  <div className="mb-4 rounded-lg bg-muted/50 p-3">
                    <p className="text-sm text-muted-foreground">{submission.notes}</p>
                  </div>

                  <div className="mb-4">
                    <a
                      href={`https://www.google.com/maps?q=${submission.latitude},${submission.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                    >
                      View on Google Maps
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="islamic"
                      className="flex-1"
                      onClick={() => handleApprove(submission.id)}
                    >
                      <Check className="h-4 w-4" />
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleReject(submission.id)}
                    >
                      <X className="h-4 w-4" />
                      Reject
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Processed Submissions */}
      {processedSubmissions.length > 0 && (
        <div>
          <h2 className="mb-4 font-serif text-xl font-semibold">Recently Processed</h2>
          <div className="grid gap-4 lg:grid-cols-3">
            {processedSubmissions.map((submission) => (
              <Card key={submission.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{submission.mosqueName}</p>
                      <p className="text-xs text-muted-foreground">
                        {submission.city}, {submission.country}
                      </p>
                    </div>
                  </div>
                  <Badge variant={submission.status}>{submission.status}</Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default Submissions;
