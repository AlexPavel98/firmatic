import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollReveal } from "@/components/scroll-reveal";
import {
  Search,
  FileText,
  Shield,
  TrendingUp,
  Zap,
  Bell,
  ArrowRight,
  CheckCircle,
  Bot,
  Sparkles,
  Activity,
  ChevronRight,
  Eye,
  BarChart3,
  Lock,
  Globe,
  Smartphone,
  Clock,
  Users,
} from "lucide-react";

/* ─── Logo ─── */
function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`font-bold tracking-tight ${className}`} style={{ fontFamily: "var(--font-heading), sans-serif" }}>
      <span className="gradient-text">Fir</span>
      <span>matic</span>
    </span>
  );
}

/* ─── Full-page continuous background ─── */
function GlobalBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* Base gradient that covers full page — no gray gaps */}
      <div className="absolute inset-0 bg-gradient-to-b from-[oklch(0.96_0.01_260)] via-[oklch(0.97_0.008_200)] to-[oklch(0.96_0.01_260)]" />

      {/* === Teal blobs === */}
      <div className="absolute top-[100px] right-[-2%] h-[700px] w-[700px] bg-[oklch(0.78_0.14_175_/_25%)] blur-[130px] blob blob-1 animate-pulse-glow" />
      <div className="absolute top-[1800px] left-[-6%] h-[800px] w-[800px] bg-[oklch(0.75_0.16_175_/_22%)] blur-[140px] blob blob-2 animate-pulse-glow" />
      <div className="absolute top-[3800px] right-[5%] h-[700px] w-[700px] bg-[oklch(0.78_0.14_175_/_20%)] blur-[130px] blob blob-3 animate-pulse-glow" />
      <div className="absolute top-[5500px] left-[-3%] h-[750px] w-[750px] bg-[oklch(0.75_0.16_175_/_22%)] blur-[140px] blob blob-1 animate-pulse-glow" />

      {/* === Purple/indigo blobs === */}
      <div className="absolute top-[300px] left-[-5%] h-[650px] w-[650px] bg-[oklch(0.72_0.16_280_/_20%)] blur-[120px] blob blob-2 animate-pulse-glow" />
      <div className="absolute top-[2500px] right-[-4%] h-[700px] w-[700px] bg-[oklch(0.7_0.18_280_/_18%)] blur-[130px] blob blob-3 animate-pulse-glow" />
      <div className="absolute top-[4500px] left-[10%] h-[600px] w-[600px] bg-[oklch(0.72_0.16_280_/_16%)] blur-[120px] blob blob-1 animate-pulse-glow" />

      {/* === Warm amber/peach blobs === */}
      <div className="absolute top-[900px] right-[8%] h-[550px] w-[550px] bg-[oklch(0.85_0.12_60_/_18%)] blur-[110px] blob blob-3" />
      <div className="absolute top-[3200px] left-[5%] h-[600px] w-[600px] bg-[oklch(0.85_0.12_60_/_16%)] blur-[120px] blob blob-2" />
      <div className="absolute top-[5000px] right-[15%] h-[500px] w-[500px] bg-[oklch(0.85_0.12_60_/_15%)] blur-[100px] blob blob-1" />

      {/* === Pink accents === */}
      <div className="absolute top-[1400px] left-[20%] h-[450px] w-[450px] bg-[oklch(0.78_0.12_340_/_14%)] blur-[100px] blob blob-1" />
      <div className="absolute top-[4000px] right-[20%] h-[500px] w-[500px] bg-[oklch(0.78_0.12_340_/_12%)] blur-[110px] blob blob-3" />
    </div>
  );
}

/* ─── Navbar ─── */
function Navbar() {
  return (
    <nav className="fixed top-0 z-50 w-full">
      <div className="mx-auto max-w-6xl px-4 pt-4">
        <div className="glass flex h-14 items-center justify-between rounded-full px-6">
          <Logo className="text-xl" />
          <div className="hidden items-center gap-8 md:flex">
            {[
              ["Funcționalități", "#features"],
              ["Prețuri", "#pricing"],
              ["Întrebări", "#faq"],
            ].map(([label, href]) => (
              <a
                key={label}
                href={href}
                className="link-underline text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {label}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="btn-hover text-muted-foreground">
              Login
            </Button>
            <Button size="sm" className="btn-hover glow-teal-sm rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
              Începe gratuit
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}

/* ─── Hero ─── */
function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-28 pb-32">


      <div className="relative mx-auto max-w-6xl px-4 pt-12 text-center">
        <div className="glass-hero mx-auto max-w-4xl rounded-[2.5rem] px-6 py-14 md:px-14 md:py-18">
          <div className="animate-fade-up">
            <Badge variant="outline" className="glass rounded-full border-primary/20 px-5 py-2.5 text-primary shadow-sm">
              <Sparkles className="mr-2 h-3.5 w-3.5" />
              Powered by AI — e-Factura integrat
              <ChevronRight className="ml-1 h-3.5 w-3.5" />
            </Badge>
          </div>

          <h1 className="animate-fade-up-d1 mt-8 text-4xl font-extrabold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
            Verifică firma.
            <br />
            <span className="gradient-text text-glow">Facturează instant.</span>
          </h1>

          <p className="animate-fade-up-d2 mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            Platforma care combină{" "}
            <span className="font-semibold text-foreground">verificarea firmelor din ANAF</span>,{" "}
            <span className="font-semibold text-foreground">facturare e-Factura</span> și{" "}
            <span className="font-semibold text-foreground">scor de risc AI</span> — totul într-un singur loc.
          </p>

          <div className="animate-fade-up-d3 mx-auto mt-10 max-w-lg">
            <div className="glass-strong glow-teal flex items-center gap-2 rounded-full p-1.5">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-primary/50" />
                <Input
                  placeholder="CUI sau denumire firmă..."
                  className="h-12 rounded-full border-0 bg-transparent pl-12 text-base text-foreground placeholder:text-muted-foreground focus-visible:ring-0"
                />
              </div>
              <Button size="lg" className="btn-hover glow-teal-sm h-10 rounded-full bg-primary px-6 text-sm text-primary-foreground hover:bg-primary/90">
                <Search className="mr-2 h-4 w-4" />
                Verifică gratuit
              </Button>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              10 verificări gratuite/lună — fără card bancar
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="mx-auto mt-10 flex max-w-3xl flex-wrap justify-center gap-4">
          {[
            { value: "1.2M+", label: "Firme în baza de date", d: "animate-fade-up-d3" },
            { value: "50K+", label: "Verificări zilnice", d: "animate-fade-up-d4" },
            { value: "200K+", label: "Facturi trimise", d: "animate-fade-up-d5" },
          ].map((s) => (
            <div key={s.label} className={`glass-card flex min-w-[170px] flex-col items-center rounded-2xl px-6 py-4 ${s.d}`}>
              <span className="text-2xl font-bold gradient-text">{s.value}</span>
              <span className="mt-1 text-xs text-muted-foreground">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Trust logos ticker */}
        <div className="mt-12 overflow-hidden">
          <p className="mb-4 text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Date oficiale din surse de încredere
          </p>
          <div className="flex items-center justify-center gap-10 text-sm font-medium text-muted-foreground/60">
            <span>ANAF</span>
            <span className="text-primary/20">|</span>
            <span>Registrul Comerțului</span>
            <span className="text-primary/20">|</span>
            <span>Buletinul Insolvențelor</span>
            <span className="text-primary/20">|</span>
            <span>Ministerul Finanțelor</span>
            <span className="text-primary/20">|</span>
            <span>SPV e-Factura</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Product mockup / demo section ─── */
function DemoSection() {
  return (
    <section className="relative overflow-hidden py-24">

      <div className="relative mx-auto max-w-6xl px-4">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left: mockup */}
          <div className="glass-mockup rounded-3xl p-6">
            {/* Fake browser bar */}
            <div className="flex items-center gap-2 border-b border-border/50 pb-4">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-red-400/60" />
                <div className="h-3 w-3 rounded-full bg-yellow-400/60" />
                <div className="h-3 w-3 rounded-full bg-green-400/60" />
              </div>
              <div className="ml-4 flex-1 rounded-full bg-muted/80 px-4 py-1.5 text-xs text-muted-foreground">
                firmatic.ro/verificare/RO12345678
              </div>
            </div>
            {/* Fake dashboard content */}
            <div className="mt-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg font-bold">SC Exemplu Tech SRL</div>
                  <div className="text-xs text-muted-foreground">CUI: RO12345678 — Înregistrare: J40/1234/2020</div>
                </div>
                <Badge className="bg-green-500/15 text-green-700 border-0">Risc scăzut</Badge>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Cifra de afaceri", value: "2.4M lei", trend: "+18%" },
                  { label: "Profit net", value: "340K lei", trend: "+12%" },
                  { label: "Angajați", value: "24", trend: "+4" },
                ].map((m) => (
                  <div key={m.label} className="rounded-xl bg-muted/60 p-3">
                    <div className="text-xs text-muted-foreground">{m.label}</div>
                    <div className="mt-1 text-lg font-bold">{m.value}</div>
                    <div className="text-xs font-medium text-green-600">{m.trend}</div>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <div className="flex-1 rounded-xl bg-primary/8 p-3">
                  <div className="flex items-center gap-2 text-xs font-medium text-primary">
                    <Shield className="h-3.5 w-3.5" />
                    Scor AI: 87/100
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-primary/15">
                    <div className="h-2 w-[87%] rounded-full bg-primary" />
                  </div>
                </div>
                <div className="flex-1 rounded-xl bg-muted/60 p-3">
                  <div className="text-xs text-muted-foreground">Statut TVA</div>
                  <div className="mt-1 flex items-center gap-1 text-sm font-bold text-green-600">
                    <CheckCircle className="h-3.5 w-3.5" /> Plătitor TVA activ
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" className="btn-hover rounded-full bg-primary text-primary-foreground text-xs">
                  <FileText className="mr-1.5 h-3.5 w-3.5" />
                  Emite factură
                </Button>
                <Button size="sm" variant="outline" className="btn-hover rounded-full text-xs">
                  <Bell className="mr-1.5 h-3.5 w-3.5" />
                  Monitorizează
                </Button>
                <Button size="sm" variant="outline" className="btn-hover rounded-full text-xs">
                  <TrendingUp className="mr-1.5 h-3.5 w-3.5" />
                  Raport complet
                </Button>
              </div>
            </div>
          </div>

          {/* Right: text */}
          <div>
            <Badge variant="outline" className="glass mb-5 rounded-full border-primary/20 px-4 py-2 text-primary shadow-sm">
              <Eye className="mr-2 h-3.5 w-3.5" />
              Vezi totul dintr-o privire
            </Badge>
            <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl lg:text-5xl">
              De la CUI la{" "}
              <span className="gradient-text">factură în 30 de secunde</span>
            </h2>
            <p className="mt-5 text-muted-foreground leading-relaxed">
              Caută orice firmă din România. Primești instant bilanț, TVA, administrator, datorii, scor de risc AI. Apoi emite factură e-Factura cu un singur click — datele se completează automat.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Date ANAF actualizate în timp real",
                "Scor de risc AI bazat pe bilanțuri și comportament",
                "Facturare e-Factura cu auto-completare din CUI",
                "Alerte automate când se schimbă ceva la firmă",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm">
                  <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Button className="btn-hover glow-teal-sm mt-8 rounded-full bg-primary px-8 text-primary-foreground hover:bg-primary/90">
              Încearcă gratuit
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Features grid ─── */
const features = [
  { icon: Search, title: "Verificare instant", desc: "CIF, TVA, bilanț, datorii, administrator — date ANAF în 2 secunde.", color: "text-primary bg-primary/10" },
  { icon: FileText, title: "e-Factura nativ", desc: "Emite și trimite facturi conforme. Raportare automată la ANAF.", color: "text-[oklch(0.5_0.18_280)] bg-[oklch(0.5_0.18_280_/_8%)]" },
  { icon: Shield, title: "Scor de risc AI", desc: "Evaluare inteligentă: bilanț, comportament de plată, tendințe.", color: "text-primary bg-primary/10" },
  { icon: Bell, title: "Alerte & monitorizare", desc: "Notificări la schimbări: statut fiscal, insolvență, bilanț nou.", color: "text-[oklch(0.6_0.15_60)] bg-[oklch(0.6_0.15_60_/_8%)]" },
  { icon: BarChart3, title: "Dashboard & rapoarte", desc: "Facturi, încasări, restanțe, cash-flow — totul vizual + export.", color: "text-[oklch(0.5_0.18_280)] bg-[oklch(0.5_0.18_280_/_8%)]" },
  { icon: Bot, title: "Asistent AI", desc: "\"Arată clienții cu restanțe\" — întreabă în română, primești instant.", color: "text-primary bg-primary/10" },
  { icon: Globe, title: "API deschis", desc: "Integrează datele Firmatic în propriul tău software sau ERP.", color: "text-[oklch(0.6_0.15_60)] bg-[oklch(0.6_0.15_60_/_8%)]" },
  { icon: Smartphone, title: "Mobile ready", desc: "Verifică și facturează direct de pe telefon — responsive complet.", color: "text-primary bg-primary/10" },
  { icon: Lock, title: "GDPR compliant", desc: "Date securizate, criptare end-to-end, hosting în UE.", color: "text-[oklch(0.5_0.18_280)] bg-[oklch(0.5_0.18_280_/_8%)]" },
];

function FeaturesSection() {
  return (
    <section id="features" className="relative overflow-hidden py-28">

      <div className="relative mx-auto max-w-6xl px-4">
        <div className="text-center">
          <Badge variant="outline" className="glass mb-6 rounded-full border-primary/20 px-4 py-2 text-primary shadow-sm">
            <Activity className="mr-2 h-3.5 w-3.5" />
            9 funcționalități puternice
          </Badge>
          <h2 className="text-3xl font-extrabold tracking-tight md:text-5xl">
            Tot ce ai nevoie.{" "}
            <span className="gradient-text">Nimic în plus.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Fiecare funcție rezolvă o problemă reală. Nu features de marketing.
          </p>
        </div>

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <ScrollReveal key={f.title} delay={i * 0.08}>
              <div className="card-tilt glass-card group h-full rounded-2xl p-6">
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${f.color}`}>
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-base font-bold">{f.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Why Firmatic ─── */
function WhySection() {
  const reasons = [
    { icon: Zap, title: "Toate într-un singur loc", desc: "Verificare firme + facturare + monitorizare — fără să jonglezi între 3 platforme diferite." },
    { icon: Bot, title: "AI care lucrează pentru tine", desc: "Scor de risc inteligent, auto-completare facturi, alerte predictive. Nu doar date, ci insight-uri." },
    { icon: Clock, title: "30 secunde de la CUI la factură", desc: "Caută firma, verifică datele, emite factura. Totul automat, fără copy-paste." },
    { icon: Lock, title: "Date oficiale, mereu la zi", desc: "Surse directe: ANAF, Registrul Comerțului, Buletinul Insolvențelor. Actualizare zilnică." },
  ];

  return (
    <section className="relative overflow-hidden py-28">

      <div className="relative mx-auto max-w-6xl px-4">
        <div className="text-center">
          <Badge variant="outline" className="glass mb-6 rounded-full border-primary/20 px-4 py-2 text-primary shadow-sm">
            <BarChart3 className="mr-2 h-3.5 w-3.5" />
            De ce Firmatic?
          </Badge>
          <h2 className="text-3xl font-extrabold tracking-tight md:text-5xl">
            Singura platformă{" "}
            <span className="gradient-text">all-in-one</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Nu mai plătești separat pentru verificare, facturare și monitorizare.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {reasons.map((r) => (
            <div key={r.title} className="glass-card flex gap-5 rounded-2xl p-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <r.icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-base font-bold">{r.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{r.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Social proof ─── */
const testimonials = [
  { name: "Andrei M.", role: "Director, SRL București", text: "Am renunțat la SmartBill + RisCo și folosesc doar Firmatic. Economisesc 2 ore pe zi." },
  { name: "Elena P.", role: "Contabil, Cabinet Iași", text: "Scorul de risc AI m-a salvat de un client cu datorii ascunse. Merită fiecare leu." },
  { name: "Mihai D.", role: "Freelancer, Cluj", text: "Planul gratuit e suficient pentru mine. Verificare + facturare din același loc — genial." },
];

function TestimonialsSection() {
  return (
    <section className="relative overflow-hidden py-28">

      <div className="relative mx-auto max-w-6xl px-4">
        <div className="text-center">
          <Badge variant="outline" className="glass mb-6 rounded-full border-primary/20 px-4 py-2 text-primary shadow-sm">
            <Users className="mr-2 h-3.5 w-3.5" />
            Ce spun utilizatorii
          </Badge>
          <h2 className="text-3xl font-extrabold tracking-tight md:text-5xl">
            Iubit de{" "}
            <span className="gradient-text">mii de firme</span>
          </h2>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <div key={t.name} className="glass-card rounded-2xl p-6">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-500">★</span>
                ))}
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="mt-5 border-t border-border/50 pt-4">
                <div className="text-sm font-bold">{t.name}</div>
                <div className="text-xs text-muted-foreground">{t.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Pricing ─── */
const plans = [
  {
    name: "Gratuit",
    price: "0",
    period: "pentru totdeauna",
    desc: "Freelanceri & micro-firme",
    features: ["10 verificări/lună", "5 facturi e-Factura", "Scor risc basic", "1 utilizator"],
    cta: "Începe gratuit",
    popular: false,
  },
  {
    name: "Pro",
    price: "39",
    period: "lei/lună",
    desc: "Firme mici și medii",
    features: ["Verificări nelimitate", "Facturi nelimitate", "Scor AI avansat", "50 firme monitorizate", "Alerte email + SMS", "Asistent AI", "3 utilizatori"],
    cta: "Începe cu Pro",
    popular: true,
  },
  {
    name: "Business",
    price: "99",
    period: "lei/lună",
    desc: "Echipe & contabili",
    features: ["Tot din Pro +", "500 firme monitorizate", "API access", "Export bulk & rapoarte", "Utilizatori nelimitați", "Suport prioritar"],
    cta: "Contactează-ne",
    popular: false,
  },
];

function PricingSection() {
  return (
    <section id="pricing" className="relative overflow-hidden py-28">

      <div className="relative mx-auto max-w-6xl px-4">
        <div className="text-center">
          <Badge variant="outline" className="glass mb-6 rounded-full border-primary/20 px-4 py-2 text-primary shadow-sm">
            <Sparkles className="mr-2 h-3.5 w-3.5" />
            Prețuri simple
          </Badge>
          <h2 className="text-3xl font-extrabold tracking-tight md:text-5xl">
            Transparent.{" "}
            <span className="gradient-text">Fără surprize.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Fără contracte. Fără costuri ascunse. Anulezi oricând.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {plans.map((plan, i) => (
            <ScrollReveal key={plan.name} delay={i * 0.1}>
            <div className={`card-tilt glass-card relative rounded-2xl p-7 ${plan.popular ? "glow-teal ring-2 ring-primary/15" : ""}`}>
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 text-primary-foreground shadow-md">
                  Recomandat
                </Badge>
              )}
              <h3 className="text-lg font-bold">{plan.name}</h3>
              <p className="mt-0.5 text-xs text-muted-foreground">{plan.desc}</p>
              <div className="mt-5 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold gradient-text">{plan.price}</span>
                <span className="text-sm text-muted-foreground">{plan.period}</span>
              </div>
              <Button
                className={`btn-hover mt-6 w-full rounded-full ${plan.popular ? "glow-teal-sm bg-primary text-primary-foreground hover:bg-primary/90" : "glass border-primary/15 text-foreground hover:bg-primary/5"}`}
                variant={plan.popular ? "default" : "outline"}
              >
                {plan.cta}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <ul className="mt-6 space-y-2.5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── FAQ ─── */
const faqs = [
  { q: "De unde vin datele despre firme?", a: "Direct de la ANAF, Registrul Comerțului, Buletinul Insolvențelor și Ministerul Finanțelor. Datele sunt actualizate zilnic." },
  { q: "Cum funcționează e-Factura?", a: "Creezi factura în Firmatic, noi o trimitem automat la ANAF prin SPV. Clientul primește PDF-ul pe email. Totul e conform legislației." },
  { q: "Ce înseamnă scorul de risc AI?", a: "Analizăm bilanțul, tendințele financiare, istoricul fiscal și comportamentul de plată al firmei. Primești un scor de la 0-100 și recomandări." },
  { q: "Pot anula oricând?", a: "Da. Fără contracte, fără perioadă minimă. Anulezi din setări cu un click." },
  { q: "Datele mele sunt în siguranță?", a: "Absolut. Hosting în UE, criptare end-to-end, GDPR compliant. Nu vindem și nu partajăm datele tale." },
];

function FAQSection() {
  return (
    <section id="faq" className="relative overflow-hidden py-28">
      <div className="relative mx-auto max-w-3xl px-4">
        <div className="text-center">
          <Badge variant="outline" className="glass mb-6 rounded-full border-primary/20 px-4 py-2 text-primary shadow-sm">
            <Zap className="mr-2 h-3.5 w-3.5" />
            Întrebări frecvente
          </Badge>
          <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">
            Ai întrebări? Avem{" "}
            <span className="gradient-text">răspunsuri.</span>
          </h2>
        </div>

        <div className="mt-12 space-y-4">
          {faqs.map((faq, i) => (
            <ScrollReveal key={faq.q} delay={i * 0.08}>
              <div className="glass-card rounded-2xl p-5">
                <h3 className="font-bold">{faq.q}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{faq.a}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── CTA ─── */
function CTASection() {
  return (
    <section className="relative overflow-hidden py-28">
      <div className="mx-auto max-w-6xl px-4">
        <div className="glass-hero glow-teal relative overflow-hidden rounded-[2rem] px-8 py-20 text-center">
          <div className="absolute -top-20 -right-20 h-[250px] w-[250px] bg-primary/10 blur-[60px] blob blob-1" />
          <div className="absolute -bottom-20 -left-20 h-[200px] w-[200px] bg-[oklch(0.65_0.18_280_/_8%)] blur-[50px] blob blob-2" />
          <div className="absolute top-[30%] right-[20%] h-[150px] w-[150px] bg-[oklch(0.8_0.15_60_/_10%)] blur-[40px] blob blob-3" />

          <div className="relative">
            <h2 className="text-3xl font-extrabold tracking-tight md:text-5xl">
              Gata cu surprizele{" "}
              <span className="gradient-text">în afaceri</span>
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-muted-foreground">
              Alătură-te miilor de firme care verifică, facturează și monitorizează inteligent.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Button size="lg" className="btn-hover glow-teal h-13 rounded-full bg-primary px-10 text-base font-semibold text-primary-foreground hover:bg-primary/90">
                Creează cont gratuit
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="btn-hover glass h-13 rounded-full px-8 text-base">
                <Clock className="mr-2 h-4 w-4" />
                Programează demo
              </Button>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              Gratuit pentru totdeauna — fără card bancar
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Footer ─── */
function Footer() {
  return (
    <footer className="border-t border-border/50 py-14">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <Logo className="text-xl" />
            <p className="mt-3 text-sm text-muted-foreground">
              Verifică. Facturează. Controlează.
            </p>
            <div className="mt-4 flex gap-3 text-xs text-muted-foreground">
              <Badge variant="outline" className="text-[10px]">GDPR</Badge>
              <Badge variant="outline" className="text-[10px]">e-Factura</Badge>
              <Badge variant="outline" className="text-[10px]">ANAF</Badge>
            </div>
          </div>
          {[
            { title: "Produs", links: [["Funcționalități", "#features"], ["Prețuri", "#pricing"], ["FAQ", "#faq"], ["API", "#"]] },
            { title: "Companie", links: [["Despre noi", "#"], ["Blog", "#"], ["Contact", "#"], ["Cariere", "#"]] },
            { title: "Legal", links: [["Termeni", "#"], ["Confidențialitate", "#"], ["GDPR", "#"], ["Cookie-uri", "#"]] },
          ].map((section) => (
            <div key={section.title}>
              <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{section.title}</h4>
              <ul className="mt-4 space-y-2.5 text-sm">
                {section.links.map(([label, href]) => (
                  <li key={label}>
                    <a href={href} className="link-underline text-muted-foreground transition-colors hover:text-foreground">{label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 border-t border-border/50 pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Firmatic. Toate drepturile rezervate. Made with AI in Romania.
        </div>
      </div>
    </footer>
  );
}

/* ─── Page ─── */
export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <GlobalBackground />
      <Navbar />
      <main>
        <HeroSection />
        <ScrollReveal><DemoSection /></ScrollReveal>
        <ScrollReveal><FeaturesSection /></ScrollReveal>
        <ScrollReveal><WhySection /></ScrollReveal>
        <ScrollReveal><TestimonialsSection /></ScrollReveal>
        <ScrollReveal><PricingSection /></ScrollReveal>
        <ScrollReveal><FAQSection /></ScrollReveal>
        <ScrollReveal><CTASection /></ScrollReveal>
      </main>
      <ScrollReveal><Footer /></ScrollReveal>
    </div>
  );
}
