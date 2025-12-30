"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login?left=true");
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      className="text-xs text-neutral-500 underline-offset-2 hover:underline"
    >
      Leave
    </button>
  );
}

