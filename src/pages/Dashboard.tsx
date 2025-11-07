import { useAuth } from "@/context/AuthProvider";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";


export default function Dashboard() {
const { user, signOut } = useAuth();
const role = (user?.user_metadata?.role as "donor" | "beneficiary" | undefined) ?? "donor";


return (
<div className="min-h-screen p-6">
<div className="max-w-3xl mx-auto space-y-6">
<div className="flex items-center justify-between">
<h1 className="text-2xl font-semibold">Tableau de bord</h1>
<Button variant="outline" onClick={signOut}>Se déconnecter</Button>
</div>
{role === "donor" ? (
<div className="space-y-4">
<p>Bienvenue, donateur.trice. Parcourez les demandes proches de vous.</p>
<Link to="/donateur" className="underline">Aller à l’espace Donateur</Link>
</div>
) : (
<div className="space-y-4">
<p>Bienvenue, bénéficiaire. Créez/éditez vos besoins.</p>
<Link to="/beneficiaire" className="underline">Aller à l’espace Bénéficiaire</Link>
</div>
)}
</div>
</div>
);
}
