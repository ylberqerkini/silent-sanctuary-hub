import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Lightbulb,
  ThumbsUp,
  Check,
  X,
  Star,
  Archive,
  MessageSquare,
} from "lucide-react";
import { toast } from "sonner";

interface Idea {
  id: string;
  title: string;
  description: string;
  submittedBy: string;
  votes: number;
  comments: number;
  status: "pending" | "approved" | "featured" | "archived";
  category: string;
  submittedAt: string;
}

const ideas: Idea[] = [
  {
    id: "1",
    title: "Qibla Direction Compass",
    description:
      "Add a compass feature that shows the direction to the Qibla from anywhere in the world. This would be helpful for travelers and new Muslims.",
    submittedBy: "ahmed_dev",
    votes: 234,
    comments: 45,
    status: "featured",
    category: "Prayer Tools",
    submittedAt: "2024-11-15",
  },
  {
    id: "2",
    title: "Quran Recitation Reminders",
    description:
      "Daily reminders to read Quran with customizable notification times and tracking of progress through surahs.",
    submittedBy: "fatima_k",
    votes: 189,
    comments: 32,
    status: "approved",
    category: "Quran",
    submittedAt: "2024-11-20",
  },
  {
    id: "3",
    title: "Community Prayer Groups",
    description:
      "Allow users to create and join prayer groups for specific mosques, making it easier to coordinate Jumu'ah and Taraweeh.",
    submittedBy: "yusuf_ali",
    votes: 156,
    comments: 28,
    status: "pending",
    category: "Community",
    submittedAt: "2024-12-01",
  },
  {
    id: "4",
    title: "Dhikr Counter Widget",
    description:
      "A home screen widget for counting dhikr with haptic feedback and customizable prayers.",
    submittedBy: "aisha_m",
    votes: 145,
    comments: 21,
    status: "pending",
    category: "Dhikr",
    submittedAt: "2024-12-05",
  },
  {
    id: "5",
    title: "Islamic Calendar Integration",
    description:
      "Show Islamic holidays and important dates, with option to sync with device calendar.",
    submittedBy: "omar_f",
    votes: 98,
    comments: 15,
    status: "pending",
    category: "Calendar",
    submittedAt: "2024-12-07",
  },
];

const statusColors = {
  pending: "warning",
  approved: "success",
  featured: "gold",
  archived: "secondary",
} as const;

const Ideas = () => {
  const [ideaList, setIdeaList] = useState(ideas);

  const handleApprove = (id: string) => {
    setIdeaList(
      ideaList.map((idea) =>
        idea.id === id ? { ...idea, status: "approved" as const } : idea
      )
    );
    toast.success("Idea approved!");
  };

  const handleFeature = (id: string) => {
    setIdeaList(
      ideaList.map((idea) =>
        idea.id === id ? { ...idea, status: "featured" as const } : idea
      )
    );
    toast.success("Idea featured!");
  };

  const handleArchive = (id: string) => {
    setIdeaList(
      ideaList.map((idea) =>
        idea.id === id ? { ...idea, status: "archived" as const } : idea
      )
    );
    toast("Idea archived");
  };

  const sortedIdeas = [...ideaList].sort((a, b) => {
    const statusOrder = { featured: 0, approved: 1, pending: 2, archived: 3 };
    return statusOrder[a.status] - statusOrder[b.status];
  });

  return (
    <AdminLayout
      title="Feature Ideas"
      subtitle="Manage community suggestions for the Silent Masjid app."
    >
      {/* Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Lightbulb className="h-5 w-5 text-gold" />
            <div>
              <p className="text-2xl font-bold">{ideaList.length}</p>
              <p className="text-sm text-muted-foreground">Total Ideas</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Star className="h-5 w-5 text-gold" />
            <div>
              <p className="text-2xl font-bold">
                {ideaList.filter((i) => i.status === "featured").length}
              </p>
              <p className="text-sm text-muted-foreground">Featured</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <ThumbsUp className="h-5 w-5 text-primary" />
            <div>
              <p className="text-2xl font-bold">
                {ideaList.reduce((acc, i) => acc + i.votes, 0)}
              </p>
              <p className="text-sm text-muted-foreground">Total Votes</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <MessageSquare className="h-5 w-5 text-accent" />
            <div>
              <p className="text-2xl font-bold">
                {ideaList.reduce((acc, i) => acc + i.comments, 0)}
              </p>
              <p className="text-sm text-muted-foreground">Comments</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Ideas Grid */}
      <div className="grid gap-4 lg:grid-cols-2">
        {sortedIdeas.map((idea) => (
          <Card key={idea.id} className="overflow-hidden">
            <div className="border-b border-border bg-muted/30 px-6 py-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                      idea.status === "featured"
                        ? "bg-gold/15"
                        : "bg-primary/10"
                    }`}
                  >
                    {idea.status === "featured" ? (
                      <Star className="h-5 w-5 text-gold-dark" />
                    ) : (
                      <Lightbulb className="h-5 w-5 text-primary" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-semibold">
                      {idea.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{idea.category}</Badge>
                      <span className="text-xs text-muted-foreground">
                        by @{idea.submittedBy}
                      </span>
                    </div>
                  </div>
                </div>
                <Badge variant={statusColors[idea.status]}>{idea.status}</Badge>
              </div>
            </div>

            <div className="p-6">
              <p className="mb-4 text-sm text-muted-foreground">
                {idea.description}
              </p>

              <div className="mb-4 flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1 text-primary">
                  <ThumbsUp className="h-4 w-4" />
                  {idea.votes} votes
                </span>
                <span className="flex items-center gap-1 text-muted-foreground">
                  <MessageSquare className="h-4 w-4" />
                  {idea.comments} comments
                </span>
              </div>

              {idea.status === "pending" && (
                <div className="flex gap-2">
                  <Button
                    variant="islamic"
                    size="sm"
                    onClick={() => handleApprove(idea.id)}
                  >
                    <Check className="h-4 w-4" />
                    Approve
                  </Button>
                  <Button
                    variant="gold"
                    size="sm"
                    onClick={() => handleFeature(idea.id)}
                  >
                    <Star className="h-4 w-4" />
                    Feature
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleArchive(idea.id)}
                  >
                    <Archive className="h-4 w-4" />
                    Archive
                  </Button>
                </div>
              )}

              {idea.status === "approved" && (
                <div className="flex gap-2">
                  <Button
                    variant="gold"
                    size="sm"
                    onClick={() => handleFeature(idea.id)}
                  >
                    <Star className="h-4 w-4" />
                    Feature
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleArchive(idea.id)}
                  >
                    <Archive className="h-4 w-4" />
                    Archive
                  </Button>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </AdminLayout>
  );
};

export default Ideas;
