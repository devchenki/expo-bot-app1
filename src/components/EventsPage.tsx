import { useState } from "react";
import { Calendar, MapPin, Package, FileText, Plus, Eye } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { CreateEventDialog } from "./CreateEventDialog";
import { EventDetailDialog } from "./EventDetailDialog";

interface Event {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  location: string;
  booths: number;
  laptops: number;
  brotherPrinters: number;
  godexPrinters: number;
  status: "active" | "completed" | "upcoming";
}

export function EventsPage() {
  const [filter, setFilter] = useState("all");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const events: Event[] = [
    {
      id: 1,
      name: "TechExpo Moscow 2025",
      startDate: "15 марта 2025",
      endDate: "18 марта 2025",
      location: "Крокус Экспо, Павильон 2",
      booths: 25,
      laptops: 20,
      brotherPrinters: 15,
      godexPrinters: 10,
      status: "active",
    },
    {
      id: 2,
      name: "Digital Forum",
      startDate: "22 марта 2025",
      endDate: "24 марта 2025",
      location: "Экспоцентр, Зал 3",
      booths: 18,
      laptops: 15,
      brotherPrinters: 12,
      godexPrinters: 6,
      status: "upcoming",
    },
    {
      id: 3,
      name: "Innovation Summit",
      startDate: "1 марта 2025",
      endDate: "3 марта 2025",
      location: "Сокольники, Павильон 4",
      booths: 32,
      laptops: 25,
      brotherPrinters: 20,
      godexPrinters: 12,
      status: "completed",
    },
    {
      id: 4,
      name: "Business Expo",
      startDate: "8 марта 2025",
      endDate: "10 марта 2025",
      location: "Крокус Экспо, Павильон 1",
      booths: 15,
      laptops: 12,
      brotherPrinters: 10,
      godexPrinters: 5,
      status: "completed",
    },
  ];

  const filteredEvents = events.filter((event) => {
    if (filter === "all") return true;
    return event.status === filter;
  });

  const statusColors = {
    active: "default",
    completed: "secondary",
    upcoming: "outline",
  } as const;

  const statusLabels = {
    active: "Активно",
    completed: "Завершено",
    upcoming: "Предстоит",
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2>События</h2>
        <Button size="sm" onClick={() => setCreateDialogOpen(true)}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <Tabs value={filter} onValueChange={setFilter} className="w-full">
        <TabsList className="w-full grid grid-cols-4">
          <TabsTrigger value="all">Все</TabsTrigger>
          <TabsTrigger value="upcoming">Предстоит</TabsTrigger>
          <TabsTrigger value="active">Активные</TabsTrigger>
          <TabsTrigger value="completed">Завершено</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="space-y-3">
        {filteredEvents.map((event) => (
          <Card key={event.id} className="border-border/40 bg-card/50">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-2.5">
                  <div className="rounded-lg bg-primary/10 p-2 text-xl leading-none">
                    🎪
                  </div>
                  <CardTitle className="text-base">{event.name}</CardTitle>
                </div>
                <Badge variant={statusColors[event.status]} className="shadow-sm">
                  {statusLabels[event.status]}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 pb-3">
              <div className="flex items-center gap-2 text-sm">
                <div className="rounded bg-primary/10 p-1">
                  <Calendar className="h-3.5 w-3.5 text-primary" />
                </div>
                <span>{event.startDate} — {event.endDate}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="rounded bg-primary/10 p-1">
                  <MapPin className="h-3.5 w-3.5 text-primary" />
                </div>
                <span>{event.location}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="rounded bg-muted/50 p-1">
                  <Package className="h-3.5 w-3.5" />
                </div>
                <span>
                  {event.laptops + event.brotherPrinters + event.godexPrinters} единиц оборудования
                </span>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full hover:bg-primary/10 hover:text-primary"
                onClick={() => setSelectedEvent(event)}
              >
                <Eye className="mr-2 h-4 w-4" />
                Детали
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <CreateEventDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
      />

      <EventDetailDialog
        open={selectedEvent !== null}
        onClose={() => setSelectedEvent(null)}
        event={selectedEvent}
      />
    </div>
  );
}
