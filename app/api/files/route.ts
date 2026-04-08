import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("plano")
      .eq("id", user.id)
      .single();

    const body = await request.json();
    const { tipo, titulo, subtitulo, conteudo } = body;

    if (profile?.plano === "free" && !["resumo", "prova"].includes(tipo)) {
      return NextResponse.json(
        { error: "Upgrade para o plano Pro para gerar este tipo de arquivo." },
        { status: 402 }
      );
    }

    const FILE_SERVICE_URL = process.env.FILE_SERVICE_URL?.replace(/\/$/, "");
    const FILE_SERVICE_SECRET = process.env.FILE_SERVICE_SECRET;

    const response = await fetch(`${FILE_SERVICE_URL}/gerar`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${FILE_SERVICE_SECRET}`,
      },
      body: JSON.stringify({ tipo, titulo, subtitulo, conteudo }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: err.detail || "Erro ao gerar arquivo" },
        { status: response.status }
      );
    }

    const blob = await response.blob();
    const contentDisposition = response.headers.get("content-disposition") || "";
    const contentType = response.headers.get("content-type") || "application/octet-stream";

    return new NextResponse(blob, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": contentDisposition,
      },
    });

  } catch (error) {
    console.error("[/api/files] Erro:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
