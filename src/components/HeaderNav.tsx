// src/components/HeaderNav.tsx
import { Link } from "react-router-dom";

export function HeaderNav() {
  return (
    <nav className="container mx-auto flex items-center justify-end gap-3 p-4">
      <Link to="/login" className="px-4 py-2 rounded-md border">Connexion</Link>
      <Link to="/signup" className="px-4 py-2 rounded-md bg-black text-white">Créer un compte</Link>
    </nav>
  );
}
