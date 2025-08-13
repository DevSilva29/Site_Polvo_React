import { ArrowLeftIcon, ImagePlus, PencilIcon, Trash2Icon, X } from "lucide-react";
import React, { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { Link } from "react-router-dom";
import api from "../../../../../api/axiosInstance";
import { Button } from "../../../../../components/ui/button";
import { Card, CardContent } from "../../../../../components/ui/card";
import { Input } from "../../../../../components/ui/input";
import { Textarea } from "../../../../../components/ui/textarea";

// --- INTERFACES ---
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
interface AtividadeFormData {
    title: string;
    description: string;
}

export const Sector1 = (): JSX.Element => {
  // --- ESTADOS DO COMPONENTE ---
  const [atividades, setAtividades] = useState<Atividade[]>([]);
  const [selectedAtividade, setSelectedAtividade] = useState<Partial<Atividade> | null>(null);
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [galleryPhotoFiles, setGalleryPhotoFiles] = useState<File[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formKey, setFormKey] = useState(Date.now());

  // --- LÓGICA DE API ---
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/atividades');
      setAtividades(response.data.data);
    } catch (error) { 
      console.error("Erro ao buscar atividades:", error);
      setAtividades([]);
    } finally { 
      setIsLoading(false); 
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm("Tem certeza que deseja apagar esta atividade e todas as suas fotos?")) {
      try {
        await api.delete(`/atividades/${id}`);
        fetchData();
      } catch (error) { alert("Falha ao apagar atividade."); }
    }
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedAtividade) return;
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('titulo', selectedAtividade.title || '');
    formData.append('descricao', selectedAtividade.description || '');
    if (iconFile) {
      formData.append('icone', iconFile);
    }

    try {
      if (selectedAtividade.id) { // ATUALIZAR
        formData.append('_method', 'PUT');
        await api.post(`/atividades/${selectedAtividade.id}`, formData);
      } else { // CRIAR
        if (!iconFile) {
          alert("Um ícone é obrigatório para criar uma nova atividade.");
          setIsSubmitting(false);
          return;
        }
        await api.post('/atividades', formData);
      }
      handleCloseModal();
      fetchData();
    } catch (error) {
      console.error(error);
      alert("Falha ao salvar atividade.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddPhotos = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedAtividade?.id || galleryPhotoFiles.length === 0) return;
    setIsSubmitting(true);

    const formData = new FormData();
    galleryPhotoFiles.forEach(file => formData.append('photos[]', file));

    try {
      await api.post(`/atividades/${selectedAtividade.id}/photos`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      // Atualiza os dados para o utilizador ver a nova foto no modal
      const response = await api.get('/atividades');
      setAtividades(response.data.data);
      const updatedAtividade = response.data.data.find(a => a.id === selectedAtividade.id);
      if (updatedAtividade) {
        setSelectedAtividade(updatedAtividade);
      }
      setGalleryPhotoFiles([]); // Limpa o input de ficheiro
    } catch (error) {
      console.error(error);
      alert("Falha ao adicionar fotos.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePhoto = async (id: number) => {
    if (window.confirm("Tem certeza que deseja apagar esta foto?")) {
      try {
        await api.delete(`/atividade-photos/${id}`);
        fetchData(); // Atualiza a lista principal
        // Atualiza também o modal se estiver aberto
        if (selectedAtividade) {
            setSelectedAtividade(prev => ({
                ...prev,
                photos: prev.photos?.filter(p => p.id !== id)
            }));
        }
      } catch (error) { alert("Falha ao apagar foto."); }
    }
  };
  
  // --- HANDLERS DA UI ---
  const handleEdit = (atividade: Atividade) => {
    setSelectedAtividade(atividade);
    setFormKey(Date.now());
    setIsModalOpen(true);
  };
  const handleNew = () => {
    setSelectedAtividade({ id: 0, title: '', description: '', photos: [] });
    setFormKey(Date.now());
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAtividade(null);
    setIconFile(null);
    setGalleryPhotoFiles([]);
  };
  const handleInputChange = (field: keyof AtividadeFormData, value: string) => {
      if(selectedAtividade){
          setSelectedAtividade(s => ({...s, [field]: value}));
      }
  }

  if (isLoading) return <div className="p-48 text-center">A carregar...</div>;

  return (
    <section className="w-full py-16 bg-[url(/background-img-2.png)] bg-cover min-h-screen">
      <Card className="mx-auto max-w-6xl bg-white/80 backdrop-blur-sm">
        <CardContent className="p-8 md:p-16">
          <div className="flex items-center mb-8">
            <Link to="/d_menu" className="mr-4 p-2 hover:bg-gray-200 rounded-full"><ArrowLeftIcon className="h-6 w-6" /></Link>
            <h2 className="text-4xl font-bold">Gerir Atividades</h2>
          </div>
          <Button onClick={handleNew} className="mb-8 bg-blue-600 hover:bg-blue-700">Nova Atividade</Button>
          
          <div className="space-y-6">
            {atividades.map(atividade => (
              <div key={atividade.id} className="bg-slate-50 p-4 rounded-lg shadow">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    <img src={atividade.icon} alt={atividade.title} className="h-16 w-16 bg-slate-200 p-1 rounded-full object-contain" />
                    <div>
                      <h3 className="font-bold text-lg">{atividade.title}</h3>
                      <p className="text-sm text-gray-600 max-w-lg">{atividade.description}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(atividade)}><PencilIcon className="h-5 w-5" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(atividade.id)}><Trash2Icon className="h-5 w-5 text-red-500" /></Button>
                  </div>
                </div>
                {/* Grelha de fotos existentes */}
                <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                  {atividade.photos.map(photo => (
                    <div key={photo.id} className="relative aspect-square group">
                      <img src={photo.url} alt={photo.caption || 'Foto da atividade'} className="w-full h-full object-cover rounded" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button variant="destructive" size="icon" className="h-8 w-8" onClick={() => handleDeletePhoto(photo.id)}><Trash2Icon className="h-4 w-4"/></Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {isModalOpen && selectedAtividade && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={handleCloseModal} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] flex flex-col">
              <div className="flex justify-between items-center mb-4 flex-shrink-0">
                <h3 className="text-lg font-bold">{selectedAtividade.id ? 'Editar Atividade' : 'Nova Atividade'}</h3>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={handleCloseModal}><X className="h-5 w-5" /></Button>
              </div>
              
              <div className="overflow-y-auto pr-2">
                <form key={formKey} onSubmit={handleSave} className="space-y-4 border-b pb-6 mb-6">
                  <h4 className="font-semibold text-gray-700">Dados da Atividade</h4>
                  <Input type="text" placeholder="Título da Atividade" defaultValue={selectedAtividade.title || ''} onChange={(e) => handleInputChange('title', e.target.value)} required />
                  <Textarea placeholder="Descrição" defaultValue={selectedAtividade.description || ''} onChange={(e) => handleInputChange('description', e.target.value)} required />
                  <div>
                    <label className="text-sm">Ícone da Atividade (.svg, .png)</label>
                    <Input type="file" accept="image/*" onChange={(e) => setIconFile(e.target.files ? e.target.files[0] : null)} required={!selectedAtividade.id} />
                    {selectedAtividade.id && <img src={selectedAtividade.icon} alt="Ícone atual" className="h-16 w-16 mt-2 object-contain" />}
                  </div>
                  <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700">{isSubmitting ? 'A guardar...' : 'Salvar Dados da Atividade'}</Button>
                </form>

                {/* Secção para gerir fotos SÓ APARECE NA EDIÇÃO */}
                {selectedAtividade.id !== 0 && (
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-700">Gerir Fotos da Galeria</h4>
                    {/* Grelha de fotos existentes no modal */}
                    {selectedAtividade.photos && selectedAtividade.photos.length > 0 && (
                        <div className="grid grid-cols-4 gap-2">
                            {selectedAtividade.photos.map(photo => (
                                <div key={photo.id} className="relative aspect-square group">
                                <img src={photo.url} alt="Foto da atividade" className="w-full h-full object-cover rounded" />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center"><Button variant="destructive" size="icon" className="h-8 w-8" onClick={() => handleDeletePhoto(photo.id)}><Trash2Icon className="h-4 w-4"/></Button></div>
                                </div>
                            ))}
                        </div>
                    )}
                    {/* Formulário para adicionar mais fotos */}
                    <form onSubmit={handleAddPhotos} className="flex items-end gap-4 pt-4">
                      <div className="flex-grow">
                        <label className="text-sm">Adicionar Novas Fotos</label>
                        <Input type="file" multiple accept="image/*" onChange={(e) => setGalleryPhotoFiles(e.target.files ? Array.from(e.target.files) : [])} />
                      </div>
                      <Button type="submit" disabled={isSubmitting || galleryPhotoFiles.length === 0} className="bg-green-600 hover:bg-green-700"><ImagePlus className="h-5 w-5"/></Button>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
};