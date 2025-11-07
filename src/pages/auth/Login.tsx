import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthProvider";
import { Button } from "@/components/ui/button";


export default function Login() {
const { signIn } = useAuth();
const nav = useNavigate();
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [err, setErr] = useState<string | null>(null);


const onSubmit = async (e: React.FormEvent) => {
e.preventDefault();
const res = await signIn(email, password);
if ((res as any)?.error) setErr((res as any).error);
else nav("/dashboard");
};


return (
<div className="min-h-screen flex items-center justify-center bg-background p-6">
<form onSubmit={onSubmit} className="w-full max-w-md space-y-4 bg-card p-6 rounded-xl border">
<h1 className="text-2xl font-semibold">Se connecter</h1>
{err && <p className="text-sm text-red-600">{err}</p>}
<input
className="w-full rounded-md border p-3 bg-background"
placeholder="Email"
type="email"
value={email}
onChange={(e) => setEmail(e.target.value)}
required
/>
<input
className="w-full rounded-md border p-3 bg-background"
placeholder="Mot de passe"
type="password"
value={password}
onChange={(e) => setPassword(e.target.value)}
required
/>
<Button type="submit" className="w-full">Connexion</Button>
<p className="text-sm text-muted-foreground">Pas de compte ? <Link to="/signup" className="underline">Créer un compte</Link></p>
</form>
</div>
);
}
