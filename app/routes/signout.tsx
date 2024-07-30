import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { createSupabaseServerClient } from "~/supabase/supabase.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const { supabase, headers } = createSupabaseServerClient(request);
    await supabase.auth.signOut()
    return redirect('/signin', { headers });
}