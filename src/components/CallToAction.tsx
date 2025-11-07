import { Button } from "@/components/ui/button";
import { ArrowRight, HandHeart, Users } from "lucide-react";

export const CallToAction = () => {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Donateur Card */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-primary-dark p-8 md:p-12 shadow-card hover:shadow-soft transition-smooth group">
            <div className="relative z-10 space-y-6">
              <div className="w-16 h-16 bg-primary-foreground/20 rounded-2xl flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-smooth">
                <HandHeart className="h-8 w-8 text-primary-foreground" />
              </div>
              
              <h3 className="text-3xl md:text-4xl font-bold text-primary-foreground">
                Vous voulez donner ?
              </h3>
              
              <p className="text-lg text-primary-foreground/90 leading-relaxed">
                Offrez vêtements, nourriture, objets ou votre temps. Chaque geste compte pour améliorer la vie de quelqu'un dans votre communauté.
              </p>

              <ul className="space-y-3 text-primary-foreground/90">
                <li className="flex items-start gap-2">
                  <ArrowRight className="h-5 w-5 mt-1 flex-shrink-0" />
                  <span>Consultez les besoins près de chez vous</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="h-5 w-5 mt-1 flex-shrink-0" />
                  <span>Choisissez qui vous voulez aider</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="h-5 w-5 mt-1 flex-shrink-0" />
                  <span>Planifiez un rendez-vous sécurisé</span>
                </li>
              </ul>

              <Button 
                size="lg"
                className="bg-card hover:bg-card/90 text-primary font-semibold shadow-soft w-full sm:w-auto transition-smooth"
              >
                Devenir donateur
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>

            {/* Decorative Circle */}
            <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-primary-foreground/10 rounded-full blur-3xl" />
          </div>

          {/* Bénéficiaire Card */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-secondary to-secondary-light p-8 md:p-12 shadow-card hover:shadow-soft transition-smooth group">
            <div className="relative z-10 space-y-6">
              <div className="w-16 h-16 bg-secondary-foreground/20 rounded-2xl flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-smooth">
                <Users className="h-8 w-8 text-secondary-foreground" />
              </div>
              
              <h3 className="text-3xl md:text-4xl font-bold text-secondary-foreground">
                Vous avez besoin d'aide ?
              </h3>
              
              <p className="text-lg text-secondary-foreground/90 leading-relaxed">
                N'ayez pas peur de demander. Notre communauté est là pour vous soutenir avec ce dont vous avez vraiment besoin.
              </p>

              <ul className="space-y-3 text-secondary-foreground/90">
                <li className="flex items-start gap-2">
                  <ArrowRight className="h-5 w-5 mt-1 flex-shrink-0" />
                  <span>Créez votre profil en toute confidentialité</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="h-5 w-5 mt-1 flex-shrink-0" />
                  <span>Listez vos besoins essentiels</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="h-5 w-5 mt-1 flex-shrink-0" />
                  <span>Recevez de l'aide près de chez vous</span>
                </li>
              </ul>

              <Button 
                size="lg"
                className="bg-card hover:bg-card/90 text-secondary font-semibold shadow-soft w-full sm:w-auto transition-smooth"
              >
                Demander de l'aide
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>

            {/* Decorative Circle */}
            <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-secondary-foreground/10 rounded-full blur-3xl" />
          </div>
        </div>
      </div>
    </section>
  );
};
