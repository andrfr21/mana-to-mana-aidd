import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { supabase, Need, Profile } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { MapPin, Heart, MessageCircle, Search, Filter, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

interface NeedWithProfile extends Need {
  profile: Profile;
}

const DonorDashboard = () => {
  const { profile, signOut } = useAuthStore();
  const navigate = useNavigate();
  const [needs, setNeeds] = useState<NeedWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    location: 'all',
    category: 'all',
    urgency: 'all',
    search: '',
  });

  useEffect(() => {
    if (profile?.user_type !== 'donor') {
      navigate('/beneficiary-dashboard');
      return;
    }
    fetchNeeds();
  }, [profile, filters]);

  const fetchNeeds = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('needs')
        .select(`
          *,
          profile:profiles!beneficiary_id(*)
        `)
        .eq('status', 'open')
        .order('created_at', { ascending: false });

      if (filters.location !== 'all') {
        query = query.eq('location', filters.location);
      }
      if (filters.category !== 'all') {
        query = query.eq('category', filters.category);
      }
      if (filters.urgency !== 'all') {
        query = query.eq('urgency', filters.urgency);
      }
      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      setNeeds(data || []);
    } catch (error: any) {
      console.error('Erreur de chargement:', error);
      toast.error('Erreur de chargement des besoins');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
      toast.success('Déconnexion réussie');
    } catch (error) {
      toast.error('Erreur de déconnexion');
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-orange-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      clothes: 'Vêtements',
      food: 'Nourriture',
      hygiene: 'Hygiène',
      housing: 'Logement',
      children: 'Enfants',
      other: 'Autre',
    };
    return labels[category] || category;
  };

  const getUrgencyLabel = (urgency: string) => {
    const labels: Record<string, string> = {
      high: 'Urgent',
      medium: 'Moyen',
      low: 'Faible',
    };
    return labels[urgency] || urgency;
  };

  const locations = ['all', 'Papeete', "Faa'a", 'Punaauia', 'Pirae', 'Arue', 'Mahina', 'Moorea', 'Bora Bora'];
  const categories = ['all', 'clothes', 'food', 'hygiene', 'housing', 'children', 'other'];
  const urgencies = ['all', 'high', 'medium', 'low'];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Fa'atauturu</h1>
              <p className="text-sm text-muted-foreground">
                Bienvenue, {profile?.full_name}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" asChild>
                <Link to="/messages">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Messages
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link to="/profile">
                  Mon profil
                </Link>
              </Button>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Filtres */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              <CardTitle>Filtres de recherche</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Recherche</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher..."
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Localisation</label>
                <Select
                  value={filters.location}
                  onValueChange={(value) => setFilters({ ...filters, location: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les villes</SelectItem>
                    {locations.slice(1).map((loc) => (
                      <SelectItem key={loc} value={loc}>
                        {loc}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Catégorie</label>
                <Select
                  value={filters.category}
                  onValueChange={(value) => setFilters({ ...filters, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes catégories</SelectItem>
                    {categories.slice(1).map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {getCategoryLabel(cat)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Urgence</label>
                <Select
                  value={filters.urgency}
                  onValueChange={(value) => setFilters({ ...filters, urgency: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes urgences</SelectItem>
                    {urgencies.slice(1).map((urg) => (
                      <SelectItem key={urg} value={urg}>
                        {getUrgencyLabel(urg)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Liste des besoins */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Personnes à aider ({needs.length})</h2>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Chargement...</p>
            </div>
          ) : needs.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-lg text-muted-foreground">
                  Aucun besoin trouvé avec ces filtres
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {needs.map((need) => (
                <Card key={need.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{need.title}</CardTitle>
                        <CardDescription className="flex items-center gap-1 mt-2">
                          <MapPin className="h-3 w-3" />
                          {need.location}
                        </CardDescription>
                      </div>
                      <Badge className={`${getUrgencyColor(need.urgency)} text-white`}>
                        {getUrgencyLabel(need.urgency)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {need.description}
                      </p>

                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{getCategoryLabel(need.category)}</Badge>
                      </div>

                      <div className="pt-2 border-t">
                        <p className="text-xs text-muted-foreground mb-2">
                          Demandé par {need.profile?.full_name || 'Anonyme'}
                        </p>
                        <Button className="w-full" size="sm" asChild>
                          <Link to={`/need/${need.id}`}>
                            <Heart className="h-4 w-4 mr-2" />
                            Proposer mon aide
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DonorDashboard;
