import React from "react";
import { Link } from "react-router-dom";

function App() {
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Mana Aid est lancé ✅</h1>
      <p className="text-sm text-gray-600">
        Ceci est une version temporaire (sans conflits) pour vérifier que l’app compile.
      </p>

      <div className="flex gap-3">
        <Link to="/beneficiary" className="px-3 py-2 rounded bg-black text-white">
          Page Bénéficiaire
        </Link>
        <Link to="/donor" className="px-3 py-2 rounded bg-black text-white">
          Page Donateur
        </Link>
      </div>
    </div>
  );
}

export default App;
