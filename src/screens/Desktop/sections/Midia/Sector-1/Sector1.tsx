'use client';

import { useState, useEffect } from "react";
import api from "../../../../../api/axiosInstance";
import { Card, CardContent } from "../../../../../components/ui/card";

// --- TIPOS DE DADOS ---

// Tipo para a resposta da API de Mídias (Vídeos)
interface MediaItem {
  id: number;
  title: string;
  embed_url: string;
  description: string;
}

// Tipos para a resposta da API de Galerias
interface Photo {
  id: number;
  url: string;
  caption: string | null;
}
interface Gallery {
  id: number;
  title: string;
  description: string | null;
  photos: Photo[];
}

// Tipo que o seu componente <PhotoGallery> espera receber
interface EventPhoto {
  title: string;
  images: string[];
}

// --- COMPONENTE DA GALERIA DE FOTOS (SEM ALTERAÇÕES) ---
const PhotoGallery = ({ events }: { events: EventPhoto[] }): JSX.Element => {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    return (
        <div className="w-full px-4 md:px-8 space-y-12">
            {events.map((event, eventIndex) => (
                <div key={eventIndex}>
                    <h3 className="text-3xl font-bold text-center text-gray-800 mb-6">{event.title}</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {event.images.map((src, imgIndex) => (
                            <div key={imgIndex} className="aspect-square bg-gray-200 rounded-lg overflow-hidden cursor-pointer shadow-lg transition-transform duration-300 hover:scale-105" onClick={() => setSelectedImage(src)}>
                                <img src={src} alt={`Imagem ${imgIndex + 1} do evento ${event.title}`} className="w-full h-full object-cover" />
                            </div>
                        ))}
                    </div>
                </div>
            ))}
            {selectedImage && (
                <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50 p-4" onClick={() => setSelectedImage(null)}>
                    <button className="absolute top-4 right-4 text-white text-5xl z-[60]" onClick={() => setSelectedImage(null)}>×</button>
                    <img src={selectedImage} alt="Visualização ampliada" className="max-w-full max-h-full object-contain rounded-lg" onClick={(e) => e.stopPropagation()} />
                </div>
            )}
        </div>
    );
};


// --- COMPONENTE PRINCIPAL DA PÁGINA PÚBLICA (MODIFICADO) ---
export const Sector1 = (): JSX.Element => {
  const [videos, setVideos] = useState<MediaItem[]>([]);
  const [galleryEvents, setGalleryEvents] = useState<EventPhoto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Usamos Promise.all para fazer as duas chamadas à API em paralelo
    Promise.all([
      api.get('/midias'),
      api.get('/galleries')
    ])
    .then(([midiasResponse, galleriesResponse]) => {
      // Processa a resposta dos vídeos
      setVideos(midiasResponse.data.data);

      // --- A LÓGICA DE "TRADUÇÃO" DOS DADOS DA GALERIA ---
      const transformedGalleries = galleriesResponse.data.data.map((gallery: Gallery) => {
        // Garante que 'photos' é um array antes de tentar o .map
        const images = Array.isArray(gallery.photos) 
                        ? gallery.photos.map((photo: Photo) => photo.url) 
                        : [];
        return {
          title: gallery.title,
          images: images 
        };
      });
      setGalleryEvents(transformedGalleries);

    })
    .catch(error => {
      console.error("Erro ao buscar dados da página de mídia:", error);
    })
    .finally(() => {
      setIsLoading(false);
    });
  }, []);

  return (
    <section className="relative w-full py-16 bg-[url(/background-img-2.png)] bg-cover bg-center">
      <Card className="relative py-4 mx-auto max-w-[1185px] bg-white/70 rounded-[10px]">
        <CardContent>
          {/* Secção da Mídia (Vídeos) */}
          <div className="py-8">
            <h2 className="text-center mt-8 font-semibold text-5xl text-black">Polvo na Mídia!</h2>
          </div>
          <div className="w-full py-8 flex justify-center flex-wrap gap-8">
            {isLoading ? (
                <p>A carregar...</p>
            ) : videos.length > 0 ? (
                videos.map((video) => (
                    <div key={video.id} className="w-full max-w-[350px] px-4 py-4">
                        <p className="text-center text-lg font-semibold text-gray-800 mb-2">{video.title}</p>
                        <div className="aspect-video w-full mb-3 shadow-lg">
                            <iframe
                                className="w-full h-full rounded-lg"
                                src={video.embed_url}
                                title={`Vídeo sobre ${video.title}`}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                referrerPolicy="strict-origin-when-cross-origin"
                                allowFullScreen
                            />
                        </div>
                        <p className="text-justify text-sm text-gray-700">{video.description}</p>
                    </div>
                ))
            ) : (
                <p className="text-center text-gray-500">De momento, não há vídeos na mídia.</p>
            )}
          </div>

          {/* Divisor e Seção da Galeria */}
          <div className="py-8">
            <hr className="border-t-2 border-gray-300 max-w-lg mx-auto mb-12" />
            <h2 className="text-center font-semibold text-5xl text-black">Nossos Eventos</h2>
          </div>
          <div className="pb-12 min-h-[300px] flex justify-center items-center">
             {isLoading ? (
                <p>A carregar galerias...</p>
             ) : galleryEvents.length > 0 ? (
                <PhotoGallery events={galleryEvents} />
             ) : (
                <p className="text-center text-gray-500">De momento, não há fotos na galeria.</p>
             )}
          </div>
        </CardContent>
      </Card>
    </section>
  );
};