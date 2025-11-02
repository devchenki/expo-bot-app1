import { useState } from "react";
import { Calendar, MapPin, Package, FileText } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";

interface Event {
  id: number;
  name: string;
  date: string;
  location: string;
  booths: number;
  status: "active" | "completed" | "upcoming";
}

export function EventsPage() {
  const [filter, setFilter] = useState("all");

  const events: Event[] = [
    {
      id: 1,
      name: "TechExpo Moscow 2025",
      date: "15-18 марта 2025",
      location: "Крокус Экспо, Павильон 2",
      booths: 25,
      status: "active",
    },
    {
      id: 2,
      name: "Digital Forum",
      date: "22-24 марта 2025",
      location: "Экспоцентр, Зал 3",
      booths: 18,
      status: "upcoming",
    },
    {
      id: 3,
      name: "Innovation Summit",
      date: "1-3 марта 2025",
      location: "Сокольники, Павильон 4",
      booths: 32,
      status: "completed",
    },
    {
      id: 4,
      name: "Business Expo",
      date: "8-10 марта 2025",
      location: "Крокус Экспо, Павильон 1",
      booths: 15,
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
      <h2>События</h2>

      <Tabs value={filter} onValueChange={setFilter} className="w-full">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="all">Все</TabsTrigger>
          <TabsTrigger value="active">Активные</TabsTrigger>
          <TabsTrigger value="completed">Завершенные</TabsTrigger>
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
                <span>{event.date}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="rounded bg-primary/10 p-1">
                  <MapPin className="h-3.5 w-3.5 text-primary" />
                </div>
                <span>{event.location}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="rounded bg-primary/10 p-1">
                  <Package className="h-3.5 w-3.5 text-primary" />
                </div>
                <span>{event.booths} стоек</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full hover:bg-primary/10 hover:text-primary">
                <FileText className="mr-2 h-4 w-4" />
                Детали
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
