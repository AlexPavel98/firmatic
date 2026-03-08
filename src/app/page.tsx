import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
} from "lucide-react";

function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`font-bold tracking-tight ${className}`}>
      <span className="text-primary">Fir</span>
      <span className="text-foreground">matic</span>
    </span>
  );
}

function Navbar() {
  return (
    <nav className="fixed top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Logo className="text-2xl" />
        <div className="hidden items-center gap-8 md:flex">
          <a
            href="#features"
            className="text-sm text-muted-foreground transition hover:text-foreground"
          >
            Funcționalități
          </a>
          <a
            href="#pricing"
            className="text-sm text-muted-foreground transition hover:text-foreground"
          >
            Prețuri
          </a>
          <a
            href="#how-it-works"
            className="text-sm text-muted-foreground transition hover:text-foreground"
          >
            Cum funcționează
          </a>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm">
            Autentificare
          </Button>
          <Button size="sm">
            Începe gratuit
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </div>
    </nav>
  );
}

function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,var(--color-teal-light)_0%,transparent_50%)]" />
      <div className="mx-auto max-w-6xl px-4 text-center">
        <Badge variant="secondary" className="mb-6">
          <Zap className="mr-1 h-3 w-3" />
          Lansat în România — e-Factura integrat
        </Badge>
        <h1 className="mx-auto max-w-4xl text-5xl font-bold leading-tight tracking-tight md:text-6xl lg:text-7xl">
          Verifică firma.{" "}
          <span className="text-primary">Facturează instant.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
          Singura platformă din România care combină verificarea firmelor cu
          facturarea e-Factura și monitorizare AI. Știi cu cine lucrezi, iar
          banii vin la timp.
        </p>
        <div className="mx-auto mt-10 flex max-w-lg flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Introdu CUI sau denumire firmă..."
              className="h-12 pl-10 text-base"
            />
          </div>
          <Button size="lg" className="h-12 px-8">
            Verifică gratuit
          </Button>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          10 verificări gratuite/lună. Fără card bancar.
        </p>
      </div>
    </section>
  );
}

const features = [
  {
    icon: Search,
    title: "Verificare firme instant",
    description:
      "Date ANAF în timp real: CIF, TVA, bilanțuri, datorii, stare fiscală. Află totul despre un partener în 2 secunde.",
  },
  {
    icon: FileText,
    title: "Facturare e-Factura",
    description:
      "Creează și trimite facturi conforme e-Factura. Raportare automată la ANAF, PDF profesional, un singur click.",
  },
  {
    icon: Shield,
    title: "Scor de risc AI",
    description:
      "Inteligența artificială analizează bilanțul, comportamentul de plată și tendințele pentru a-ți spune cât de sigur e un client.",
  },
  {
    icon: Bell,
    title: "Monitorizare și alerte",
    description:
      "Primești notificări când se schimbă ceva la o firmă: statut fiscal, administrator nou, bilanț depus, insolvență.",
  },
  {
    icon: TrendingUp,
    title: "Rapoarte și analiză",
    description:
      "Dashboard cu facturile tale, încasări, restanțe. Previziuni cash-flow cu AI. Exporturi Excel și PDF.",
  },
  {
    icon: Bot,
    title: "Asistent AI",
    description:
      'Întreabă în limbaj natural: "Arată-mi toți clienții cu cifra de afaceri peste 1M" sau "Cine are facturi restante?"',
  },
];

function FeaturesSection() {
  return (
    <section id="features" className="bg-muted/40 py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center">
          <Badge variant="outline" className="mb-4">
            Funcționalități
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Tot ce ai nevoie într-un singur loc
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Nu mai jonglezi între termene.ro, SmartBill și Excel. Firmatic le
            unește pe toate.
          </p>
        </div>
        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="border-0 bg-background shadow-sm transition hover:shadow-md"
            >
              <CardContent className="pt-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const steps = [
    {
      step: "1",
      title: "Caută firma",
      description:
        "Introdu CUI-ul sau numele firmei. Primești instant: date financiare, statut TVA, administrator, scor de risc.",
    },
    {
      step: "2",
      title: "Facturează",
      description:
        "Datele se completează automat în factură. Trimite e-Factura direct la ANAF. Clientul primește PDF-ul pe email.",
    },
    {
      step: "3",
      title: "Monitorizează",
      description:
        "Activează alerte pe firmele care te interesează. AI-ul te avertizează dacă un client devine riscant.",
    },
  ];

  return (
    <section id="how-it-works" className="py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center">
          <Badge variant="outline" className="mb-4">
            Cum funcționează
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            De la verificare la încasare în 3 pași
          </h2>
        </div>
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {steps.map((item) => (
            <div key={item.step} className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                {item.step}
              </div>
              <h3 className="mt-6 text-xl font-semibold">{item.title}</h3>
              <p className="mt-3 text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const plans = [
  {
    name: "Gratuit",
    price: "0",
    description: "Pentru freelanceri și micro-firme",
    features: [
      "10 verificări firme/lună",
      "5 facturi e-Factura/lună",
      "Scor de risc basic",
      "1 utilizator",
    ],
    cta: "Începe gratuit",
    popular: false,
  },
  {
    name: "Pro",
    price: "39",
    description: "Pentru firme mici și medii",
    features: [
      "Verificări nelimitate",
      "Facturi nelimitate + e-Factura",
      "Scor de risc AI avansat",
      "Monitorizare 50 firme",
      "Alerte email și SMS",
      "Asistent AI",
      "3 utilizatori",
    ],
    cta: "Începe cu Pro",
    popular: true,
  },
  {
    name: "Business",
    price: "99",
    description: "Pentru echipe și contabili",
    features: [
      "Tot din Pro +",
      "Monitorizare 500 firme",
      "API access",
      "Export bulk",
      "Rapoarte avansate",
      "Utilizatori nelimitați",
      "Suport prioritar",
    ],
    cta: "Contactează-ne",
    popular: false,
  },
];

function PricingSection() {
  return (
    <section id="pricing" className="bg-muted/40 py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center">
          <Badge variant="outline" className="mb-4">
            Prețuri
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Simplu și transparent
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Fără contracte. Fără surprize. Anulezi oricând.
          </p>
        </div>
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative border-0 bg-background shadow-sm ${
                plan.popular ? "ring-2 ring-primary shadow-lg" : ""
              }`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                  Cel mai popular
                </Badge>
              )}
              <CardContent className="pt-8">
                <h3 className="text-xl font-semibold">{plan.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {plan.description}
                </p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">lei/lună</span>
                </div>
                <Button
                  className="mt-6 w-full"
                  variant={plan.popular ? "default" : "outline"}
                >
                  {plan.cta}
                </Button>
                <ul className="mt-8 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="rounded-2xl bg-primary px-8 py-16 text-center text-primary-foreground">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Gata cu surprizele în afaceri
          </h2>
          <p className="mx-auto mt-4 max-w-xl opacity-90">
            Înregistrează-te gratuit și verifică prima firmă în mai puțin de 30
            de secunde.
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="mt-8 h-12 px-8 text-base"
          >
            Creează cont gratuit
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t py-12">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <Logo className="text-xl" />
            <p className="mt-3 text-sm text-muted-foreground">
              Verifică. Facturează. Controlează.
            </p>
          </div>
          <div>
            <h4 className="font-semibold">Produs</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#features" className="transition hover:text-foreground">
                  Funcționalități
                </a>
              </li>
              <li>
                <a href="#pricing" className="transition hover:text-foreground">
                  Prețuri
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-foreground">
                  API
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold">Companie</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="transition hover:text-foreground">
                  Despre noi
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-foreground">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-foreground">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold">Legal</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="transition hover:text-foreground">
                  Termeni și condiții
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-foreground">
                  Politica de confidențialitate
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-foreground">
                  GDPR
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Firmatic. Toate drepturile rezervate.
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <PricingSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
