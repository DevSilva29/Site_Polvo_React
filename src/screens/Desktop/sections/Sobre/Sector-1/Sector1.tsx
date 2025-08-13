'use client';

import { Card, CardContent } from "../../../../../components/ui/card";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { useState, useEffect } from "react";
import api from "../../../../../api/axiosInstance";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';

// --- INTERFACES CORRIGIDAS ---
interface SobreContent {
  text1: string;
  text2: string;
  team_photo_url: string;
}
interface Presidente {
  id: number;
  name: string;
  role: string;
  term: string;
  photo_url: string;
}
// Corrigido 'path' para 'url' para corresponder à API
interface LocalPhoto {
  id: number;
  url: string; 
  caption: string | null;
}

export const Sector1 = (): JSX.Element => {
  // --- ESTADOS ---
  const [sobre, setSobre] = useState<SobreContent | null>(null);
  const [presidentes, setPresidentes] = useState<Presidente[]>([]);
  // 1. ESTADO EM FALTA ADICIONADO
  const [localPhotos, setLocalPhotos] = useState<LocalPhoto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    // 2. CORREÇÃO NA BUSCA DE DADOS
    Promise.all([
      api.get('/sobre'),
      api.get('/presidentes'),
      api.get('/local-photos') // A chamada já estava aqui, o que é ótimo
    ])
    // Corrigido para receber as 3 respostas
    .then(([sobreRes, presidentesRes, localPhotosRes]) => {
      setSobre(sobreRes.data.data);
      setPresidentes(presidentesRes.data.data);
      // Agora guardamos os dados das fotos do local no novo estado
      setLocalPhotos(localPhotosRes.data.data);
    })
    .catch(error => console.error("Erro ao buscar dados da página Sobre:", error))
    .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return <div className="p-48 text-center">A carregar informações...</div>;
  }

  if (!sobre) {
    return <div className="p-48 text-center">Não foi possível carregar o conteúdo da página.</div>;
  }

  // O JSX agora usa os dados corretos de 'localPhotos'
  return (
    <section className="relative w-full py-16">
      <div className="relative w-full py-16">
        <img
          className="absolute inset-0 w-full h-full object-cover"
          alt="Background"
          src="/background-img-2.png"
        />
        <Card className="relative mx-auto max-w-[1185px] bg-white/70 rounded-[10px]">
          <CardContent className="p-14">
            <div className="space-y-6">
              <p className="font-['IBM_Plex_Sans',Helvetica] font-light text-2xl leading-9 text-black">
                {sobre.text1}
              </p>

              <div className="flex flex-col md:flex-row gap-8 mt-6">
                <div className="flex flex-col items-center w-full md:w-[333px] flex-shrink-0">
                  <img
                    className="w-[333px] h-[250px] object-cover rounded-lg"
                    alt="Equipe CCTI"
                    src={sobre.team_photo_url}
                  />
                  <p className="font-['IBM_Plex_Sans',Helvetica] font-light text-[22px] text-center mt-2">
                    Equipe CCTI
                  </p>

                  <div className="flex flex-col items-center mt-6 w-full mx-auto">
                    <Swiper
                      modules={[Navigation]}
                      spaceBetween={30}
                      navigation
                      className="w-full h-full"
                      onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
                    >
                      {presidentes.map((presidente) => (
                        <SwiperSlide key={presidente.id}>
                          <img
                            className="w-full h-[250px] object-cover"
                            alt={presidente.name}
                            src={presidente.photo_url}
                          />
                        </SwiperSlide>
                      ))}
                    </Swiper>
                    <p className="font-['IBM_Plex_Sans',Helvetica] font-light text-[22px] text-center mt-2 min-h-[90px]">
                      {presidentes[activeIndex]?.name}<br />
                      {presidentes[activeIndex]?.role}<br />
                      {presidentes[activeIndex]?.term}
                    </p>
                  </div>
                </div>

                <div className="flex-1 flex flex-col space-y-8">
                  <p className="font-['IBM_Plex_Sans',Helvetica] font-light text-[22px] text-black">
                    {sobre.text2}
                  </p>

                  {/* --- NOVO SLIDER DE FOTOS DO LOCAL --- */}
                  {/* Ele só aparece se houver fotos para mostrar */}
                  {localPhotos.length > 0 && (
                    <div className="w-full">
                        <h3 className="text-2xl font-semibold mb-4 text-center md:text-left">Nosso Espaço</h3>
                        <Swiper
                            modules={[Navigation, Autoplay]}
                            spaceBetween={10}
                            slidesPerView={1}
                            navigation
                            loop={true}
                            autoplay={{ delay: 3500, disableOnInteraction: false }}
                            className="w-full h-[300px] md:h-[400px] rounded-lg shadow-lg"
                        >
                            {localPhotos.map((photo) => (
                                <SwiperSlide key={photo.id}>
                                    <img src={photo.url} alt={photo.caption || 'Foto do Local'} className="w-full h-full object-cover" />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};