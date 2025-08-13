import { useState, useEffect } from "react";
import { Button } from "../../../../../components/ui/button";
import { Card, CardContent } from "../../../../../components/ui/card";
import api from "../../../../../api/axiosInstance";
import { X } from "lucide-react";

// --- INTERFACES PARA OS DADOS DA API ---
interface AtividadePhoto {
  id: number;
  url: string;
  caption: string | null;
}
interface Atividade {
  id: number;
  title: string;
  description: string;
  icon: string;
  photos: AtividadePhoto[];
}

export const Sector2 = (): JSX.Element => {
  // --- ESTADOS DO COMPONENTE ---
  const [activities, setActivities] = useState<Atividade[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedActivity, setSelectedActivity] = useState<Atividade | null>(null);

  useEffect(() => {
    // Busca os dados das atividades e suas fotos
    api.get('/atividades')
      .then(response => {
        setActivities(response.data.data);
      })
      .catch(error => {
        console.error("Erro ao buscar atividades:", error);
        setActivities([]);
      })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <section className="relative w-full bg-[#d3f1fc]">
      <div className="absolute inset-0 w-full h-full">
        <img
          className="w-full h-full object-cover"
          alt="Background img"
          src="/background-img-1.png"
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-24">
        <header className="text-center mb-16">
          <h1 className="font-bold text-4xl md:text-5xl mb-6 leading-tight font-['Inter',Helvetica]">
            Atividades e Cronogramas
          </h1>
          <p className="font-medium text-lg md:text-xl text-[#1e2936] leading-relaxed max-w-4xl mx-auto font-['Inter',Helvetica]">
            Descubra nossa ampla variedade de atividades envolventes
            projetadas para enriquecer sua vida e fortalecer a comunidade.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {isLoading ? (
            <p className="col-span-full text-center">A carregar atividades...</p>
          ) : (
            activities.map((card) => (
              <button key={card.id} onClick={() => setSelectedActivity(card)} className="text-left h-full">
                <Card className="rounded-[15px] bg-white shadow-lg flex h-full transition-transform duration-300 hover:-translate-y-2">
                  <CardContent className="p-6 flex flex-col sm:flex-row items-center text-center sm:text-left gap-6">
                    <div className="w-16 h-16 bg-[#62c3ec6b] rounded-full flex items-center justify-center flex-shrink-0">
                      <img
                        className="w-[35px] h-[35px]"
                        alt={card.title}
                        src={card.icon}
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-xl sm:text-2xl leading-tight font-['Inter',Helvetica] mb-2">
                        {card.title}
                      </h3>
                      <p className="font-normal text-base sm:text-lg leading-snug font-['Inter',Helvetica]">
                        {card.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </button>
            ))
          )}
        </div>

        <div className="flex flex-col md:flex-row justify-center gap-6 max-w-xl mx-auto">
          <a href="/cronograma">
            <Button
              className="h-[66px] bg-[#3661a0] text-white rounded-lg shadow-button-shadow font-small-text"
              size="lg"
            >
              Explorar Atividades
            </Button>
          </a>
          <a href="/contribua">
            <Button
              className="h-[66px] bg-white text-[#3661a0] rounded-lg shadow-button-shadow font-small-text"
              variant="outline"
              size="lg"
            >
              Apoie nosso Centro!
            </Button>
          </a>
        </div>
      </div>

      {/* --- O MODAL DA GALERIA DE FOTOS --- */}
      {selectedActivity && (
        <>
          <div
            className="fixed inset-0 bg-black/70 z-40 backdrop-blur-sm"
            onClick={() => setSelectedActivity(null)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl border p-6 w-full max-w-4xl transform transition-all duration-300 ease-out animate-in slide-in-from-bottom-10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-slate-800">{selectedActivity.title}</h3>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-gray-200" onClick={() => setSelectedActivity(null)}>
                  <X className="h-5 w-5 text-gray-600" />
                </Button>
              </div>

              {selectedActivity.photos.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[60vh] overflow-y-auto pr-2">
                  {selectedActivity.photos.map(photo => (
                    <div key={photo.id} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                      <img src={photo.url} alt={photo.caption || 'Foto da atividade'} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-12">Não há fotos para esta atividade ainda.</p>
              )}
            </div>
          </div>
        </>
      )}
    </section>
  );
};