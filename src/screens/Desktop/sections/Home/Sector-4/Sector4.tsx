import { useState, useEffect } from "react";
import { Button } from "../../../../../components/ui/button"; // Ajuste o caminho se necessário
import { Card, CardContent } from "../../../../../components/ui/card";
import api from "../../../../../api/axiosInstance"; // Ajuste o caminho

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  photo_url: string | null; // A API agora envia a URL da foto
}

export const Sector4 = (): JSX.Element => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.get('/eventos')
      .then(response => {
        setEvents(response.data.data.slice(0, 3));
      })
      .catch(error => {
        console.error("Erro ao buscar eventos:", error);
        setEvents([]);
      })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <section className="relative w-full bg-[url(/background-img-3.png)] bg-cover bg-center py-48">
      <div className="mx-auto max-w-[499px] bg-[#ffffffbf] rounded-[15px] mb-8">
        <h1 className="py-6 font-['Inter',Helvetica] font-bold text-black text-5xl text-center leading-[72px]">
          Quadro de Eventos
        </h1>
      </div>
      <div className="mx-auto max-w-[1132px] bg-[#ffffff80] rounded-[15px] p-9">
        <div className="flex flex-col gap-8 min-h-[300px] justify-center">
          {isLoading ? (
            <p className="text-center text-lg">A carregar eventos...</p>
          ) : events.length > 0 ? (
            events.map((event) => (
              <Card key={event.id} className="bg-white rounded-[10px] shadow-[0px_3px_4px_#00000040]">
                <CardContent className="p-0">
                  <div className="flex items-center p-8 gap-7">
                    {/* Imagem do Evento */}
                    {event.photo_url && (
                      <img
                        className="w-[102px] h-24 object-cover rounded-md flex-shrink-0"
                        alt={`Imagem do evento ${event.title}`}
                        src={event.photo_url}
                      />
                    )}
                    {/* Detalhes do Evento */}
                    <div className="flex flex-col">
                      <h2 className="font-['Inter',Helvetica] font-semibold text-black text-2xl mb-3">{event.title}</h2>
                      <p className="font-['Inter',Helvetica] font-normal text-black text-base mb-3">{event.description}</p>
                      <p className="font-['Inter',Helvetica] font-bold text-black text-xl">{event.date}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-20 text-gray-700">
              <p className="text-xl font-medium">Nenhum evento agendado para breve.</p>
              <p className="mt-02">Fique atento as novidades!</p>
            </div>
          )}
          
          <div className="flex flex-col md:flex-row justify-center gap-6 max-w-xl mx-auto pt-8">
            <a href="/cronograma">
              <Button className="h-[66px] bg-[#3661a0] text-white rounded-lg shadow-button-shadow font-small-text" size="lg">
                Explorar Atividades
              </Button>
            </a>
            <a href="/avisos">
              <Button className="h-[66px] bg-white text-[#3661a0] rounded-lg shadow-button-shadow font-small-text" variant="outline" size="lg">
                Quadro de Avisos!
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};