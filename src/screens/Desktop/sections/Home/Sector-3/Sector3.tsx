import { useState, useEffect } from "react";
import api from "../../../../../api/axiosInstance";
import { Card, CardContent } from "../../../../../components/ui/card";

interface Sponsor {
  id: number;
  name: string;
  logo: string;
  url: string;
}

export const Sector3 = (): JSX.Element => {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.get('/patrocinadores')
      .then(response => {

        setSponsors(response.data); 
      })
      .catch(error => {
        console.error("Erro ao buscar patrocinadores:", error);
        setSponsors([]);
      })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <section className="relative w-full bg-[#d3f1fc]">
      <div className="relative w-full h-full py-64">
        <img
          className="absolute inset-0 w-full h-full object-cover"
          alt="Background pattern"
          src="/background-img-2.png"
        />
        <div className="relative flex justify-center mb-12">
          <div className="bg-[#ffffffbf] rounded-[15px] px-8 py-4">
            <h2 className="font-['Inter',Helvetica] font-bold text-black text-5xl text-center">
              Veja quem já colaborou com a gente!
            </h2>
          </div>
        </div>
        <Card className="relative mx-auto max-w-6xl bg-white rounded-[15px]">
          <CardContent className="p-12">
            {/* Adicionamos uma altura mínima para o contentor não colapsar */}
            <div className="flex flex-wrap justify-center items-center gap-16 min-h-[150px]">
              {isLoading ? (
                <p>Carregando...</p>
              ) : sponsors.length > 0 ? (
                sponsors.map((sponsor) => (
                  <a 
                    key={sponsor.id} 
                    href={sponsor.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex flex-col items-center transition-transform duration-300 hover:scale-110"
                  >
                    <img
                      className="w-[275px] h-auto object-contain"
                      alt={`${sponsor.name} logo`}
                      src={sponsor.logo}
                    />
                    <p className="mt-6 font-['IBM_Plex_Sans',Helvetica] font-light text-black text-2xl text-center leading-9">
                      {sponsor.name}
                    </p>
                  </a>
                ))
              ) : (
                <div className="text-center text-gray-500">
                  <p className="text-xl font-medium">De momento, não temos Colaboradores.</p>
                  <p className="mt-2">Gostaria de apoiar o nosso projeto? Entre em contacto!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};