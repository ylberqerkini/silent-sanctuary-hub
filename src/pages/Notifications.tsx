import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  Send,
  Clock,
  Users,
  MessageSquare,
  Plus,
  Edit,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

interface NotificationTemplate {
  id: string;
  title: string;
  message: string;
  type: "spiritual" | "announcement" | "reminder";
  isActive: boolean;
}

const templates: NotificationTemplate[] = [
  {
    id: "1",
    title: "Masjid Entry Reminder",
    message:
      "Switch to silent mode and connect with Allah. Leave the dunya outside. 🕌",
    type: "spiritual",
    isActive: true,
  },
  {
    id: "2",
    title: "Jumu'ah Reminder",
    message:
      "Jumu'ah Mubarak! Remember to prepare for the Friday prayer. 📿",
    type: "reminder",
    isActive: true,
  },
  {
    id: "3",
    title: "Ramadan Announcement",
    message:
      "Ramadan Kareem! May this blessed month bring you closer to Allah. 🌙",
    type: "announcement",
    isActive: false,
  },
  {
    id: "4",
    title: "Dhikr Reminder",
    message:
      "Take a moment to remember Allah. SubhanAllah, Alhamdulillah, Allahu Akbar. 💫",
    type: "spiritual",
    isActive: true,
  },
];

const typeColors = {
  spiritual: "primary",
  announcement: "gold",
  reminder: "success",
} as const;

const Notifications = () => {
  const [templateList, setTemplateList] = useState(templates);
  const [newTitle, setNewTitle] = useState("");
  const [newMessage, setNewMessage] = useState("");

  const handleSendGlobal = () => {
    toast.success("Global notification sent to all users!");
  };

  const handleAddTemplate = () => {
    if (!newTitle || !newMessage) {
      toast.error("Please fill in both title and message");
      return;
    }

    const newTemplate: NotificationTemplate = {
      id: Date.now().toString(),
      title: newTitle,
      message: newMessage,
      type: "spiritual",
      isActive: true,
    };

    setTemplateList([...templateList, newTemplate]);
    setNewTitle("");
    setNewMessage("");
    toast.success("Template added successfully!");
  };

  const toggleTemplate = (id: string) => {
    setTemplateList(
      templateList.map((t) =>
        t.id === id ? { ...t, isActive: !t.isActive } : t
      )
    );
  };

  const deleteTemplate = (id: string) => {
    setTemplateList(templateList.filter((t) => t.id !== id));
    toast("Template deleted");
  };

  return (
    <AdminLayout
      title="Notifications"
      subtitle="Manage notification templates and send global announcements."
    >
      {/* Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Bell className="h-5 w-5 text-primary" />
            <div>
              <p className="text-2xl font-bold">124,567</p>
              <p className="text-sm text-muted-foreground">Total Sent</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Users className="h-5 w-5 text-success" />
            <div>
              <p className="text-2xl font-bold">48.2K</p>
              <p className="text-sm text-muted-foreground">Subscribers</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-gold" />
            <div>
              <p className="text-2xl font-bold">98.5%</p>
              <p className="text-sm text-muted-foreground">Delivery Rate</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <MessageSquare className="h-5 w-5 text-accent" />
            <div>
              <p className="text-2xl font-bold">{templateList.length}</p>
              <p className="text-sm text-muted-foreground">Templates</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Send Global Notification */}
        <Card className="p-6">
          <h3 className="mb-4 flex items-center gap-2 font-serif text-lg font-semibold">
            <Send className="h-5 w-5 text-primary" />
            Send Global Announcement
          </h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="announcement-title">Title</Label>
              <Input
                id="announcement-title"
                placeholder="Announcement title..."
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="announcement-message">Message</Label>
              <Textarea
                id="announcement-message"
                placeholder="Your message to the Ummah..."
                className="mt-1"
                rows={4}
              />
            </div>
            <Button variant="islamic" onClick={handleSendGlobal}>
              <Send className="h-4 w-4" />
              Send to All Users
            </Button>
          </div>
        </Card>

        {/* Add New Template */}
        <Card className="p-6">
          <h3 className="mb-4 flex items-center gap-2 font-serif text-lg font-semibold">
            <Plus className="h-5 w-5 text-gold" />
            Add New Template
          </h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="template-title">Template Title</Label>
              <Input
                id="template-title"
                placeholder="Template name..."
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="template-message">Message</Label>
              <Textarea
                id="template-message"
                placeholder="Notification message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="mt-1"
                rows={4}
              />
            </div>
            <Button variant="gold" onClick={handleAddTemplate}>
              <Plus className="h-4 w-4" />
              Add Template
            </Button>
          </div>
        </Card>
      </div>

      {/* Templates */}
      <div className="mt-6">
        <h3 className="mb-4 font-serif text-xl font-semibold">
          Notification Templates
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {templateList.map((template) => (
            <Card
              key={template.id}
              className={`p-4 ${!template.isActive ? "opacity-60" : ""}`}
            >
              <div className="mb-3 flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant={typeColors[template.type]}>
                    {template.type}
                  </Badge>
                  {template.isActive && (
                    <span className="h-2 w-2 rounded-full bg-success" />
                  )}
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={() => deleteTemplate(template.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <h4 className="mb-2 font-semibold">{template.title}</h4>
              <p className="mb-3 text-sm text-muted-foreground">
                {template.message}
              </p>
              <Button
                variant={template.isActive ? "outline" : "islamic"}
                size="sm"
                onClick={() => toggleTemplate(template.id)}
              >
                {template.isActive ? "Deactivate" : "Activate"}
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default Notifications;
