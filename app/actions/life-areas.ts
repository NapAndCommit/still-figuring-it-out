"use server";

import { createClient } from "@/lib/supabase/server";
import { seedLifeAreas } from "@/lib/supabase/seed";
import {
  fetchLifeAreas,
  updateLifeArea,
  lifeAreaDataToRow,
  rowToLifeAreaData,
  LifeAreaData,
} from "@/lib/supabase/life-areas";

export async function getLifeAreas(): Promise<LifeAreaData[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Not authenticated");
  }

  // Seed initial data if needed
  await seedLifeAreas(user.id);

  // Fetch life areas
  return await fetchLifeAreas(user.id);
}

export async function saveLifeArea(lifeArea: LifeAreaData): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Not authenticated");
  }

  await updateLifeArea(user.id, lifeArea.id, lifeArea);
}

