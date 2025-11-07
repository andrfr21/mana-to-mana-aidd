import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthProvider";
import { Button } from "@/components/ui/button";

export default function Signup() {
  const { signUp } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"donor" | "beneficiary">("donor");
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    const res = await signUp(email.trim(), password, role);
    setLoading(false);
    if ((res as any)?.error) {
      setErr((res as any).error);
      return;
    }
    setOk(true);
    // Redirection douce vers /login
    setTimeout(() => nav("/login"), 1600);
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center px-4">
      {/* fond dégradé doux */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_50%_0%,hsl(var(--secondary)/0.12),transparent),radial-gradient(60%_60%_at_10%_90%,hsl(var(--primary)/0.12),transparent)]" />
      
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold tracking-tight">Créer un compte</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Rejoignez la communauté et commencez à aider ou à recevoir de l’aide.
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="rounded-2xl border bg-card p-6 shadow-[var(--shadow-card)]"
        >
          {ok && (
            <div className="mb-4 rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-2 text-emerald-800 text-sm">
              Compte créé avec succès. Redirection vers <span className="font-medium">Se connecter</span>…
            </div>
          )}
          {err && (
            <div className="mb-4 rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-red-800 text-sm">
              {err}
            </div>
          )}

          <div className="space-y-3">
            <label className="block text-sm font-medium">Email</label>
            <input
              className="w-full rounded-lg border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-[hsl(var(--primary))] transition-[var(--transition-smooth)]"
              placeholder="vous@exemple.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-3 mt-4">
            <label className="block text-sm font-medium">Mot de passe</label>
            <input
              className="w-full rounded-lg border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-[hsl(var(--primary))] transition-[var(--transition-smooth)]"
              placeholder="••••••••"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
              disabled={loading}
            />
            <p className="text-xs text-muted-foreground">Au moins 6 caractères.</p>
          </div>

          <div className="mt-5">
            <label className="block text-sm font-medium mb-2">Rôle</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole("donor")}
                className={`rounded-xl border p-4 text-sm transition-[var(--transition-smooth)] ${
                  role === "donor"
                    ? "border-[hsl(var(--primary))] bg-[hsl(var(--primary)/0.08)]"
                    : "hover:bg-muted"
                }`}
                disabled={loading}
              >
                Donateur
              </button>
              <button
                type="button"
                onClick={() => setRole("beneficiary")}
                className={`rounded-xl border p-4 text-sm transition-[var(--transition-smooth)] ${
                  role === "beneficiary"
                    ? "border-[hsl(var(--primary))] bg-[hsl(var(--primary)/0.08)]"
                    : "hover:bg-muted"
                }`}
                disabled={loading}
              >
                Bénéficiaire
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full mt-6 h-11 rounded-xl shadow-[var(--shadow-soft)]"
          >
            {loading ? "Création..." : "Créer mon compte"}
          </Button>

          <p className="text-center text-sm text-muted-foreground mt-4">
            Déjà un compte ?{" "}
            <Link to="/login" className="underline">
              Se connecter
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
