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

  try {
    // Quietly ensure all default life areas exist (recovery mechanism)
    await seedLifeAreas(user.id);
  } catch (error) {
    // Log error but don't fail the entire load
    console.error("Error ensuring life areas exist:", error);
  }

  // Fetch life areas
  try {
    return await fetchLifeAreas(user.id);
  } catch (error) {
    // Log error but return empty array to prevent UI crash
    console.error("Error fetching life areas:", error);
    return [];
  }
}

export async function saveLifeArea(
  lifeArea: LifeAreaData
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      error: "Not authenticated",
    };
  }

  return await updateLifeArea(user.id, lifeArea.id, lifeArea);
}

