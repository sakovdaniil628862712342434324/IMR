/*
Author: Daniil Sakov
Inputs are NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY from .env.local.
Processing builds one browser Supabase client with those values, or leaves supabase null if either is missing so pages can show a setup message instead of crashing on createClient.
Outputs are supabase (the client or null) and supabaseReady (boolean). Auth sessions persist in localStorage. All movie and profile queries go through this client.
*/

import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabaseReady = !!(url && key);
export const supabase = supabaseReady ? createClient(url, key) : null;
