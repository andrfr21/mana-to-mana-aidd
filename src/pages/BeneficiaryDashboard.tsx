import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { supabase, Need } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, MessageCircle, Edit, Trash2, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const BeneficiaryDashboard = () => {
  const { profile, signOut } = useAuthStore();
  const navigate = useNavigate();
  const [needs, setNeeds] = useState<Need[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingNeed, setEditingNeed] = useState<Need | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'other' as 'clothes' | 'food' | 'hygiene' | 'housing' | 'children' | 'other',
    urgency: 'medium' as 'low' | 'medium' | 'high',
    location: profile?.location || 'Papeete',
  });

  useEffect(() => {
    if (profile?.user_type !== 'beneficiary') {
      navigate('/donor-dashboard');
      return;
    }
    fetchNeeds();
  }, [profile]);

  const fetchNeeds = async () => {
    if (!profile) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('needs')
        .select('*')
        .eq('beneficiary_id', profile.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNeeds(data || []);
    } catch (error: any) {
      console.error('Erreur de chargement:', error);
      toast.error('Erreur de chargement de vos besoins');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!profile) return;

    try {
      if (editingNeed) {
        // Modification
        const { error } = await supabase
          .from('needs')
          .update(formData)
          .eq('id', editingNeed.id);

        if (error) throw error;
        toast.success('Besoin modifié avec succès');
      } else {
        // Création
        const { error } = await supabase
          .from('needs')
          .insert({
            ...formData,
            beneficiary_id: profile.id,
            status: 'open',
          });

        if (error) throw error;
        toast.success('Besoin créé avec succès');
      }

      setDialogOpen(false);
      resetForm();
      fetchNeeds();
    } catch (error: any) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de l\'opération');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce besoin ?')) return;

    try {
      const { error } = await supabase
        .from('needs')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Besoin supprimé');
      fetchNeeds();
    } catch (error: any) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleEdit = (need: Need) => {
    setEditingNeed(need);
    setFormData({
      title: need.title,
      description: need.description,
      category: need.category,
      urgency: need.urgency,
      location: need.location,
    });
    setDialogOpen(true);
  };

  const resetForm = () => {
    setEditingNeed(null);
    setFormData({
      title: '',
      description: '',
      category: 'other',
      urgency: 'medium',
      location: profile?.location || 'Papeete',
    });
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-blue-500';
      case 'in_progress':
        return 'bg-orange-500';
      case 'fulfilled':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      open: 'Ouvert',
      in_progress: 'En cours',
      fulfilled: 'Satisfait',
    };
    return labels[status] || status;
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
        {/* Actions */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Mes besoins</h2>
          <Dialog open={dialogOpen} onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nouveau besoin
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingNeed ? 'Modifier le besoin' : 'Créer un nouveau besoin'}
                </DialogTitle>
                <DialogDescription>
                  Décrivez ce dont vous avez besoin pour que les donateurs puissent vous aider
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Titre</Label>
                  <Input
                    id="title"
                    placeholder="Ex: Besoin de vêtements pour enfant"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Décrivez votre besoin en détail..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Catégorie</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value: any) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="clothes">Vêtements</SelectItem>
                      <SelectItem value="food">Nourriture</SelectItem>
                      <SelectItem value="hygiene">Hygiène</SelectItem>
                      <SelectItem value="housing">Logement</SelectItem>
                      <SelectItem value="children">Enfants</SelectItem>
                      <SelectItem value="other">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="urgency">Urgence</Label>
                  <Select
                    value={formData.urgency}
                    onValueChange={(value: any) => setFormData({ ...formData, urgency: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Faible</SelectItem>
                      <SelectItem value="medium">Moyen</SelectItem>
                      <SelectItem value="high">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Localisation</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    required
                  />
                </div>

                <Button type="submit" className="w-full">
                  {editingNeed ? 'Modifier' : 'Créer'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Liste des besoins */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Chargement...</p>
          </div>
        ) : needs.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Plus className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-lg text-muted-foreground mb-4">
                Vous n'avez pas encore créé de besoin
              </p>
              <Button onClick={() => setDialogOpen(true)}>
                Créer mon premier besoin
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {needs.map((need) => (
              <Card key={need.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{need.title}</CardTitle>
                      <CardDescription className="mt-2">
                        {getCategoryLabel(need.category)}
                      </CardDescription>
                    </div>
                    <Badge className={`${getStatusColor(need.status)} text-white`}>
                      {getStatusLabel(need.status)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {need.description}
                  </p>
                  <div className="flex items-center gap-2 pt-4 border-t">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(need)}
                      className="flex-1"
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Modifier
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(need.id)}
                      className="flex-1 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Supprimer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BeneficiaryDashboard;
