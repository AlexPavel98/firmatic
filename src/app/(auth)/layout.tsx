export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12">
      {/* Background blobs — matching landing page style */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[oklch(0.96_0.01_260)] via-[oklch(0.97_0.008_200)] to-[oklch(0.96_0.01_260)]" />

        {/* Teal blobs */}
        <div className="absolute top-[-10%] right-[-5%] h-[600px] w-[600px] bg-[oklch(0.78_0.14_175_/_25%)] blur-[130px] blob blob-1 animate-pulse-glow" />
        <div className="absolute bottom-[-10%] left-[-8%] h-[700px] w-[700px] bg-[oklch(0.75_0.16_175_/_22%)] blur-[140px] blob blob-2 animate-pulse-glow" />

        {/* Purple blob */}
        <div className="absolute top-[20%] left-[-5%] h-[500px] w-[500px] bg-[oklch(0.72_0.16_280_/_18%)] blur-[120px] blob blob-3 animate-pulse-glow" />

        {/* Warm amber blob */}
        <div className="absolute bottom-[10%] right-[5%] h-[450px] w-[450px] bg-[oklch(0.85_0.12_60_/_16%)] blur-[110px] blob blob-1" />
      </div>

      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <a href="/" className="inline-block">
            <span className="text-3xl font-bold tracking-tight">
              <span className="gradient-text">Fir</span>
              <span>matic</span>
            </span>
          </a>
          <p className="mt-2 text-sm text-muted-foreground">
            Verifică. Facturează. Controlează.
          </p>
        </div>

        {/* Card */}
        <div className="glass-hero rounded-2xl px-8 py-10">
          {children}
        </div>
      </div>
    </div>
  );
}
