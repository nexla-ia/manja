import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function NovoChatPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data } = await supabase
    .from("chats")
    .insert({ user_id: user.id, titulo: "Novo chat" })
    .select()
    .single();

  if (data) redirect(`/chat/${data.id}`);
  redirect("/dashboard");
}
