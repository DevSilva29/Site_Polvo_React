import { ArrowLeftIcon, ChevronLeftIcon, ChevronRightIcon, PencilIcon, Trash2Icon, X, ImagePlus, ImageIcon } from "lucide-react";
import React, { useState, useEffect, FormEvent, ChangeEvent } from "react";
import api from "../../../../../api/axiosInstance";
import { Button } from "../../../../../components/ui/button";
import { Card, CardContent } from "../../../../../components/ui/card";
import { Link } from "react-router-dom";

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

export const Sector1 = (): JSX.Element => {
  const [allGalleries, setAllGalleries] = useState<Gallery[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [newGalleryTitle, setNewGalleryTitle] = useState("");
  const [newGalleryDescription, setNewGalleryDescription] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const fetchGalleries = async () => {
    try {
      const response = await api.get('/galleries');
      setAllGalleries(response.data.data);
    } catch (error) {
      console.error("Erro ao buscar galerias:", error);
      setAllGalleries([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGalleries();
  }, []);

  const handleDeleteGallery = async (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir esta galeria e todas as suas fotos? Esta ação não pode ser desfeita.")) {
      try {
        await api.delete(`/galleries/${id}`);
        fetchGalleries();
      } catch (error) {
        console.error("Erro ao deletar galeria:", error);
        alert("Não foi possível excluir a galeria.");
      }
    }
  };

  const handleDeletePhoto = async (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir esta foto?")) {
      try {
        await api.delete(`/photos/${id}`);
        fetchGalleries();
      } catch (error) {
        console.error("Erro ao deletar foto:", error);
        alert("Não foi possível excluir a foto.");
      }
    }
  };

  const handleSaveGallery = async (e: FormEvent) => {
    e.preventDefault();
    if (selectedFiles.length === 0) {
      alert("Por favor, selecione pelo menos uma foto para a nova galeria.");
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('title', newGalleryTitle);
    formData.append('description', newGalleryDescription);

    selectedFiles.forEach(file => {
      formData.append('photos[]', file);
    });

    try {
      await api.post('/galleries', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setIsModalOpen(false);
      fetchGalleries();

    } catch (error) {
      console.error("Erro ao salvar galeria:", error);
      alert('Erro ao salvar a galeria. Verifique o console para mais detalhes.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenNewModal = () => {
    setNewGalleryTitle("");
    setNewGalleryDescription("");
    setSelectedFiles([]);
    setIsModalOpen(true);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleCloseMenu = () => {
    setIsModalOpen(false);
  };

  if (isLoading) return <div className="p-48 text-center">A carregar galerias...</div>;

  return (
    <section className="w-full py-16 relative bg-[url(/background-img-2.png)] bg-cover bg-center">
      <Card className="mx-auto max-w-6xl bg-white/70 rounded-[10px] z-10 relative">
        <CardContent className="p-16">
          <div className="flex flex-col items-center">

            <div className="flex items-center w-full mb-12">
              <Link to={"/d_menu"} className="mr-4 h-10 w-10 flex items-center justify-center hover:bg-gray-200 rounded-full transition-colors" aria-label="Voltar">
                <ArrowLeftIcon className="h-6 w-6 text-gray-800" />
              </Link>
              <h2 className="text-4xl font-semibold text-black font-['Inter',Helvetica]">Painel da Galeria de Fotos</h2>
            </div>

            <div className="w-full">
              <Button className="bg-green-600 text-white hover:bg-green-700 rounded-lg px-6 py-3 h-auto mb-8" onClick={handleOpenNewModal}>
                <ImagePlus className="mr-2 h-5 w-5" />
                Criar Nova Galeria
              </Button>
            </div>

            <div className="w-full space-y-8">
              {allGalleries.length > 0 ? allGalleries.map((gallery) => (
                <div key={gallery.id} className="w-full bg-slate-50 rounded-xl p-6 shadow-md">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-slate-800">{gallery.title}</h3>
                      <p className="text-sm text-slate-600">{gallery.description}</p>
                    </div>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteGallery(gallery.id)}>
                      <Trash2Icon className="h-4 w-4 mr-2" />
                      Apagar Galeria
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {gallery.photos.map(photo => (
                      <div key={photo.id} className="relative aspect-square group">
                        <img src={photo.url} alt={photo.caption || 'Foto da galeria'} className="w-full h-full object-cover rounded-md shadow-sm" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button variant="destructive" size="icon" className="h-9 w-9" onClick={() => handleDeletePhoto(photo.id)}>
                            <Trash2Icon className="h-5 w-5" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )) : (
                <div className="text-center py-20 text-gray-500"><p>Nenhuma galeria encontrada. Clique em "Criar Nova Galeria" para começar.</p></div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {isModalOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={handleCloseMenu} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl border p-6 w-[600px] max-w-full">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-800">Criar Nova Galeria</h3>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-gray-200" onClick={handleCloseMenu}><X className="h-5 w-5 text-gray-600" /></Button>
              </div>

              <form onSubmit={handleSaveGallery} className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Título da Galeria</label>
                  <input id="title" type="text" value={newGalleryTitle} onChange={(e) => setNewGalleryTitle(e.target.value)} placeholder="Ex: Festa Junina 2025" className="w-full px-3 py-2 border border-gray-300 rounded-md" required />
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Descrição (Opcional)</label>
                  <textarea id="description" value={newGalleryDescription} onChange={(e) => setNewGalleryDescription(e.target.value)} rows={3} placeholder="Digite uma breve descrição sobre o evento..." className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                </div>
                <div>
                  <label htmlFor="photos" className="block text-sm font-medium text-gray-700 mb-1">Selecione as Fotos</label>
                  <input id="photos" type="file" accept="image/*" multiple onChange={handleFileChange} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 cursor-pointer" required />
                  {selectedFiles.length > 0 && <div className="mt-2 text-xs text-gray-600">{selectedFiles.length} foto(s) selecionada(s).</div>}
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="ghost" onClick={handleCloseMenu}>Cancelar</Button>
                  <Button type="submit" disabled={isSubmitting} className="bg-green-600 hover:bg-green-700 text-white">{isSubmitting ? 'A guardar...' : 'Criar Galeria'}</Button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </section>
  );
};