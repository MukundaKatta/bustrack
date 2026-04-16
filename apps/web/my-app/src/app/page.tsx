import { Button } from "@/components/ui/button";
import {
  MapPin,
  Clock,
  Shield,
  Smartphone,
  Bus,
  Zap,
  ChevronRight,
} from "lucide-react";

const features = [
  {
    icon: MapPin,
    title: "Live Bus Tracking",
    description:
      "Watch buses move on a real-time map. Updates every 10 seconds — no refresh needed.",
  },
  {
    icon: Clock,
    title: "Accurate ETA",
    description:
      "Know exactly when to head out. Arrival time updates as the bus gets closer.",
  },
  {
    icon: Smartphone,
    title: "Driver App",
    description:
      "One tap to start a trip. The app handles the rest — automatic GPS pings every 30 seconds.",
  },
  {
    icon: Shield,
    title: "Role-Based Access",
    description:
      "Parents see the map. Drivers manage trips. Admins control everything. Everyone in their lane.",
  },
  {
    icon: Bus,
    title: "Fleet Management",
    description:
      "Admins can add buses, assign drivers, and define routes with stops from a simple web panel.",
  },
  {
    icon: Zap,
    title: "AI ETA — Coming Sprint 3",
    description:
      "XGBoost-powered arrival prediction trained on real trip data. Better every week.",
  },
];

const team = [
  { name: "Charan Lokku", role: "Product Owner" },
  { name: "Mukunda Rao Katta", role: "Tech Lead" },
  { name: "Sanjana Vegesana", role: "Data / ML" },
  { name: "Reema", role: "Engineer" },
  { name: "Tharun", role: "Engineer" },
  { name: "Teju", role: "Engineer" },
  { name: "Hareesh", role: "Engineer" },
  { name: "Manohar", role: "Engineer" },
  { name: "Ravi Kiran", role: "Engineer" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navbar */}
      <header className="border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-foreground rounded-lg flex items-center justify-center">
            <Bus className="w-4 h-4 text-background" />
          </div>
          <span className="font-bold text-lg tracking-tight">BusTrack</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground hidden sm:block">
            by Team Zion
          </span>
          <Button size="sm">Get Started</Button>
        </div>
      </header>

      {/* Hero */}
      <section className="px-6 py-24 max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 border border-border rounded-full px-3 py-1 text-xs text-muted-foreground mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          Sprint 1 · MVP · Week 2 Demo
        </div>

        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight leading-tight mb-6">
          Where is the
          <br />
          <span className="text-muted-foreground">school bus?</span>
        </h1>

        <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10">
          BusTrack gives parents a live map and an accurate ETA — so you know
          exactly when to send your child out. No guessing. No calling the
          school.
        </p>

        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Button size="lg" className="gap-2">
            View Live Map <ChevronRight className="w-4 h-4" />
          </Button>
          <Button size="lg" variant="outline">
            Driver Login
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-16 border-t border-border">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs uppercase tracking-widest text-muted-foreground text-center mb-12">
            What ships in Sprint 1
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="border border-border rounded-xl p-5 space-y-3 hover:bg-muted/40 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-foreground/5 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-foreground" />
                </div>
                <h3 className="font-semibold text-sm">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="px-6 py-16 border-t border-border bg-muted/20">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            Tech Stack
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              "Next.js 14",
              "TypeScript",
              "Tailwind CSS",
              "shadcn/ui",
              "Prisma",
              "PostgreSQL",
              "NextAuth.js",
              "Mapbox GL",
              "React Native",
              "Expo",
              "Zod",
              "Vercel",
              "Neon",
            ].map((tech) => (
              <span
                key={tech}
                className="border border-border rounded-full px-3 py-1 text-xs text-muted-foreground"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="px-6 py-16 border-t border-border">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs uppercase tracking-widest text-muted-foreground text-center mb-10">
            The Squad
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {team.map(({ name, role }) => (
              <div
                key={name}
                className="border border-border rounded-xl p-4 space-y-1"
              >
                <div className="w-7 h-7 rounded-full bg-foreground/10 flex items-center justify-center text-xs font-semibold">
                  {name[0]}
                </div>
                <p className="text-sm font-medium leading-tight">{name}</p>
                <p className="text-xs text-muted-foreground">{role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-8">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-foreground rounded-md flex items-center justify-center">
              <Bus className="w-3 h-3 text-background" />
            </div>
            <span className="font-semibold text-sm">BusTrack</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Built by{" "}
            <span className="font-medium text-foreground">Team Zion</span> ·
            Sprint 1 · 2 Weeks · MVP
          </p>
          <p className="text-xs text-muted-foreground">
            Product Owner: Charan Lokku
          </p>
        </div>
      </footer>
    </div>
  );
}
