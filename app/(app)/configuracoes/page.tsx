import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { PLANS } from "@/lib/stripe/plans";

export default async function ConfiguracoesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles").select("*").eq("id", user.id).single();

  const isPro = profile?.plano === "pro";

  return (
    <div className="flex-1 overflow-y-auto p-8 max-w-2xl">
      <h1 className="text-2xl font-bold text-white mb-8">Configurações</h1>

      {/* Perfil */}
      <section className="bg-[#0d1410] border border-[#1e2e20] rounded-2xl p-6 mb-6">
        <h2 className="text-white font-semibold mb-4">Perfil</h2>
        <div className="space-y-3">
          <div>
            <p className="text-gray-500 text-xs mb-1">Nome</p>
            <p className="text-white text-sm">{profile?.nome ?? "—"}</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs mb-1">Email</p>
            <p className="text-white text-sm">{user.email}</p>
          </div>
        </div>
      </section>

      {/* Plano */}
      <section className="bg-[#0d1410] border border-[#1e2e20] rounded-2xl p-6 mb-6">
        <h2 className="text-white font-semibold mb-4">Plano atual</h2>

        <div className="grid grid-cols-2 gap-4">
          {/* Free */}
          <div className={`border rounded-xl p-4 ${!isPro ? "border-green-600 bg-green-600/5" : "border-[#1e2e20]"}`}>
            <p className="text-white font-bold mb-1">Gratuito</p>
            <p className="text-green-500 font-bold text-xl mb-3">R$ 0</p>
            <ul className="space-y-1.5">
              {PLANS.free.features.map((f, i) => (
                <li key={i} className="text-gray-400 text-xs flex items-start gap-1.5">
                  <span className="text-gray-600 mt-0.5">•</span> {f}
                </li>
              ))}
            </ul>
            {!isPro && (
              <div className="mt-3 text-green-500 text-xs font-semibold">✓ Plano atual</div>
            )}
          </div>

          {/* Pro */}
          <div className={`border rounded-xl p-4 ${isPro ? "border-green-600 bg-green-600/5" : "border-green-700/40 bg-green-600/5"}`}>
            <p className="text-white font-bold mb-1">Pro</p>
            <p className="text-green-500 font-bold text-xl mb-3">R$ 49<span className="text-sm font-normal text-gray-500">/mês</span></p>
            <ul className="space-y-1.5">
              {PLANS.pro.features.map((f, i) => (
                <li key={i} className="text-gray-300 text-xs flex items-start gap-1.5">
                  <span className="text-green-500 mt-0.5">✓</span> {f}
                </li>
              ))}
            </ul>
            {isPro ? (
              <div className="mt-3 text-green-500 text-xs font-semibold">✓ Plano atual</div>
            ) : (
              <button className="mt-3 w-full bg-green-600 hover:bg-green-500 text-white text-xs font-semibold rounded-lg py-2 transition">
                Fazer upgrade
              </button>
            )}
          </div>
        </div>

        {!isPro && (
          <p className="text-gray-600 text-xs mt-3">
            Gerações este mês: {profile?.geracoes_mes ?? 0} / {PLANS.free.geracoes}
          </p>
        )}
      </section>

      {/* Estatísticas */}
      <section className="bg-[#0d1410] border border-[#1e2e20] rounded-2xl p-6">
        <h2 className="text-white font-semibold mb-4">Suas estatísticas</h2>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "XP total", value: profile?.xp_total ?? 0 },
            { label: "Nível", value: profile?.nivel ?? 1 },
            { label: "Streak", value: `${profile?.streak_dias ?? 0} dias` },
          ].map((stat) => (
            <div key={stat.label} className="bg-[#111a13] rounded-xl p-4 text-center">
              <p className="text-green-400 font-bold text-xl">{stat.value}</p>
              <p className="text-gray-500 text-xs mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
