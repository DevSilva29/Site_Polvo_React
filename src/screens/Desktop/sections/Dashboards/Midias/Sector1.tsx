import { ArrowLeftIcon, ChevronLeftIcon, ChevronRightIcon, PencilIcon, Trash2Icon, X, YoutubeIcon, VideoIcon } from "lucide-react";
import React, { useState, useEffect, FormEvent, ChangeEvent } from "react";
import api from "../../../../../api/axiosInstance";
import { Button } from "../../../../../components/ui/button";
import { Card, CardContent } from "../../../../../components/ui/card";
import { Link } from "react-router-dom";
import { Input } from "../../../../../components/ui/input";
import { Textarea } from "../../../../../components/ui/textarea";

// --- FUNÇÃO INTELIGENTE PARA EXTRAIR O ID ---
// Retorna o ID e a plataforma de qualquer link do YouTube ou Vimeo
const extractVideoId = (url: string): { id: string; platform: 'youtube' | 'vimeo' } | null => {
  let match;
  // Regex para vários formatos de link do YouTube (normal, curto, embed, live, etc.)
  const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|live)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/;
  match = url.match(youtubeRegex);
  if (match && match[1]) {
    return { id: match[1], platform: 'youtube' };
  }
  // Regex para vários formatos de link do Vimeo
  const vimeoRegex = /(?:player\.|www\.)?vimeo\.com\/(?:video\/|channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|)(\d+)/;
  match = url.match(vimeoRegex);
  if (match && match[1]) {
    return { id: match[1], platform: 'vimeo' };
  }
  return null;
};


// Interface para os dados da API
interface Midia {
  id: number;
  title: string;
  link: string; // Link original que o utilizador colou
  platform: 'youtube' | 'vimeo';
  description: string;
  embed_url: string; // URL pronta para o iframe
}

export const Sector1 = (): JSX.Element => {
  // --- ESTADOS DO COMPONENTE ---
  const [allMedia, setAllMedia] = useState<Midia[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<Partial<Omit<Midia, 'id' | 'embed_url'>> & { id?: number } | null>(null);
  const [linkInput, setLinkInput] = useState(''); // Estado separado para o input do link
  const [isFloatingMenuOpen, setIsFloatingMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- LÓGICA DE API ---
  const fetchMedia = async () => {
    try {
      const response = await api.get('/midias');
      setAllMedia(response.data.data);
    } catch (error) {
      console.error("Erro ao buscar mídias:", error);
      setAllMedia([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchMedia(); }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir esta mídia?")) {
      try {
        await api.delete(`/midias/${id}`);
        fetchMedia();
      } catch (error) {
        console.error("Erro ao deletar mídia:", error);
        alert("Não foi possível excluir a mídia.");
      }
    }
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedMedia || !linkInput) {
      alert("Por favor, preencha o título e o link do vídeo.");
      return;
    }
    
    const videoInfo = extractVideoId(linkInput);
    if (!videoInfo) {
      alert("O link do vídeo não parece ser um URL válido do YouTube ou Vimeo. Por favor, copie o link da barra de endereços do seu navegador e cole aqui.");
      return;
    }

    setIsSubmitting(true);
    const dataToSend = {
      midia_title: selectedMedia.title || '',
      midia_description: selectedMedia.description || '',
      midia_link: linkInput, // Guardamos o link original que o utilizador colou
      midia_platform: videoInfo.platform, // A plataforma que a nossa função descobriu
      midia_video_id: videoInfo.id, // Enviamos APENAS o ID do vídeo para o backend
    };

    try {
      if (selectedMedia.id) {
        await api.put(`/midias/${selectedMedia.id}`, dataToSend);
      } else {
        await api.post('/midias', dataToSend);
      }
      
      setIsFloatingMenuOpen(false);
      fetchMedia();

    } catch (error) {
      console.error("Erro ao salvar mídia:", error);
      alert('Erro ao salvar. Verifique o console para mais detalhes.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- HANDLERS DA UI ---
  const handleEdit = (media: Midia) => {
    setSelectedMedia(media);
    setLinkInput(media.link); // Preenche o input com o link original guardado
    setIsFloatingMenuOpen(true);
  };
  
  const handleNew = () => {
    setSelectedMedia({ id: 0, title: "", description: "" });
    setLinkInput(''); // Limpa o input do link
    setIsFloatingMenuOpen(true);
  };
  
  const handleCloseMenu = () => {
    setIsFloatingMenuOpen(false);
    setSelectedMedia(null);
    setLinkInput('');
  };
  
  // --- LÓGICA DE PAGINAÇÃO ---
  const [currentPage, setCurrentPage] = useState(0);
  const mediaPerPage = 4;
  const totalPages = Math.ceil(allMedia.length / mediaPerPage);
  const currentMedia = allMedia.slice(currentPage * mediaPerPage, (currentPage + 1) * mediaPerPage);
  const handlePrevious = () => { if (currentPage > 0) setCurrentPage(c => c - 1); };
  const handleNext = () => { if (currentPage < totalPages - 1) setCurrentPage(c => c + 1); };

  if (isLoading) return <div className="p-48 text-center">A carregar mídias...</div>;

  return (
    <section className="w-full py-16 relative bg-[url(/background-img-2.png)] bg-cover bg-center min-h-screen">
      <Card className="mx-auto max-w-6xl bg-white/70 rounded-[10px] z-10 relative">
        <CardContent className="p-16">
          <div className="flex flex-col items-center">
            
            <div className="flex items-center w-full mb-12">
              <Link to={"/d_menu"} className="mr-4 h-10 w-10 flex items-center justify-center hover:bg-gray-200 rounded-full transition-colors" aria-label="Voltar">
                <ArrowLeftIcon className="h-6 w-6 text-gray-800" />
              </Link>
              <h2 className="text-4xl font-semibold text-black font-['Inter',Helvetica]">Painel de Mídias</h2>
            </div>
            
            <div className="w-full mb-8">
              <Button className="bg-blue-600 text-white hover:bg-blue-700" onClick={handleNew}>Nova Mídia</Button>
            </div>
            
            <div className="w-full overflow-hidden min-h-[400px]">
              <div className={`w-full space-y-4`}>
                {currentMedia.length > 0 ? currentMedia.map((media) => (
                  <div key={media.id} className="w-full h-auto bg-[#e0f7fa] rounded-[10px] flex items-center justify-between p-4">
                    <div className="flex items-center flex-grow">
                      <div className="w-[50px] h-[50px] flex-shrink-0 flex items-center justify-center bg-white/60 rounded-lg">
                        {media.platform === 'youtube' ? <YoutubeIcon className="w-7 h-7 text-red-600" /> : <VideoIcon className="w-7 h-7 text-blue-500" />}
                      </div>
                      <div className="ml-4 flex-grow overflow-hidden">
                        <h3 className="font-['IBM_Plex_Sans',Helvetica] font-bold text-gray-800 text-lg truncate">{media.title}</h3>
                        <p className="text-sm text-gray-600 mt-1 truncate">{media.link}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                      <Button variant="ghost" size="icon" className="h-[38px] w-[38px] hover:bg-blue-100 rounded-full" onClick={() => handleEdit(media)}><PencilIcon className="h-5 w-5 text-blue-600" /></Button>
                      <Button variant="ghost" size="icon" className="h-[38px] w-[38px] hover:bg-red-100 rounded-full" onClick={() => handleDelete(media.id)}><Trash2Icon className="h-5 w-5 text-red-600" /></Button>
                    </div>
                  </div>
                )) : (
                    <div className="text-center py-20 text-gray-500"><p>Nenhuma mídia encontrada.</p></div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end w-full mt-10">
              <div className="flex-1 flex justify-end items-center gap-2">
                <span className="text-sm text-gray-700 font-medium">{totalPages > 0 ? currentPage + 1 : 0} de {totalPages}</span>
                <Button variant="ghost" size="icon" className={`h-[45px] w-[33px]`} onClick={handlePrevious} disabled={currentPage === 0}><ChevronLeftIcon className="h-6 w-6" /></Button>
                <Button variant="ghost" size="icon" className={`h-[45px] w-[33px]`} onClick={handleNext} disabled={currentPage >= totalPages - 1}><ChevronRightIcon className="h-6 w-6" /></Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {isFloatingMenuOpen && selectedMedia && (
        <>
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" onClick={handleCloseMenu} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl border p-6 w-[500px] max-w-full">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-800">{selectedMedia.id ? "Editar Mídia" : "Nova Mídia"}</h3>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-gray-200" onClick={handleCloseMenu}><X className="h-5 w-5 text-gray-600" /></Button>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                  <Input id="title" type="text" defaultValue={selectedMedia.title || ''} onChange={(e) => setSelectedMedia(m => m ? {...m, title: e.target.value} : null)} placeholder="Ex: Reportagem sobre o Polvo" className="w-full px-3 py-2 border border-gray-300 rounded-md" required />
                </div>
                <div>
                  <label htmlFor="link" className="block text-sm font-medium text-gray-700 mb-1">Link do Vídeo (Qualquer link do YouTube ou Vimeo)</label>
                  <Input id="link" type="url" value={linkInput} onChange={(e) => setLinkInput(e.target.value)} placeholder="Cole o link aqui" className="w-full px-3 py-2 border border-gray-300 rounded-md" required />
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                  <Textarea id="description" defaultValue={selectedMedia.description || ''} onChange={(e) => setSelectedMedia(m => m ? {...m, description: e.target.value} : null)} rows={4} placeholder="Digite uma breve descrição sobre o vídeo..." className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                </div>
                
                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="ghost" onClick={handleCloseMenu}>Cancelar</Button>
                  <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white">{isSubmitting ? 'A guardar...' : 'Salvar'}</Button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </section>
  );
};