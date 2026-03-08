import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/dashboard/sidebar";
import { TopBar } from "@/components/dashboard/top-bar";
import type { User } from "@supabase/supabase-js";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let user: User | null = null;

  // Skip auth check if Supabase is not configured (dev mode)
  if (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    user = data.user;

    if (!user) {
      redirect("/login");
    }
  }

  // Dev fallback user when Supabase is not configured
  const displayUser = user ?? ({
    id: "dev",
    email: "dev@firmatic.ro",
    app_metadata: {},
    user_metadata: {},
    aud: "authenticated",
    created_at: "",
  } as User);

  return (
    <div className="relative flex min-h-screen bg-background">
      <Sidebar user={displayUser} />
      <div className="flex flex-1 flex-col lg:pl-64">
        <TopBar user={displayUser} />
        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
