import { ArrowLeftIcon, ImagePlus, PencilIcon, Trash2Icon, X } from "lucide-react";
import React, { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { Link } from "react-router-dom";
import api from "../../../../../api/axiosInstance";
import { Button } from "../../../../../components/ui/button";
import { Card, CardContent } from "../../../../../components/ui/card";
import { Input } from "../../../../../components/ui/input";
import { Textarea } from "../../../../../components/ui/textarea";

// --- INTERFACES ---
interface SobreContent {
  id: number;
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
interface LocalPhoto {
  id: number;
  url: string;
  caption: string | null;
}
interface PresidenteFormData {
  name: string;
  role: string;
  term: string;
}

export const Sector1 = (): JSX.Element => {
  // --- ESTADOS ---
  const [sobreData, setSobreData] = useState<Partial<SobreContent>>({});
  const [teamPhotoFile, setTeamPhotoFile] = useState<File | null>(null);

  const [allPresidentes, setAllPresidentes] = useState<Presidente[]>([]);
  const [selectedPresidente, setSelectedPresidente] = useState<Partial<Presidente> | null>(null);
  const [presidentePhotoFile, setPresidentePhotoFile] = useState<File | null>(null);
  
  const [localPhotos, setLocalPhotos] = useState<LocalPhoto[]>([]);
  const [newLocalPhotosFiles, setNewLocalPhotosFiles] = useState<File[]>([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formKey, setFormKey] = useState(Date.now());

  // --- LÓGICA DE API ---
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [sobreRes, presidentesRes, localPhotosRes] = await Promise.all([
        api.get('/sobre'),
        api.get('/presidentes'),
        api.get('/local-photos'),
      ]);
      setSobreData(sobreRes.data.data);
      setAllPresidentes(presidentesRes.data.data);
      setLocalPhotos(localPhotosRes.data.data);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  
  const handleSaveSobre = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('sobre_text', sobreData.text1 || '');
    formData.append('sobre_text2', sobreData.text2 || '');
    if (teamPhotoFile) {
      formData.append('sobre_photo', teamPhotoFile);
    }
    formData.append('_method', 'PUT');

    try {
      await api.post(`/sobre/update`, formData); // Rota simplificada sem ID
      alert('Conteúdo "Sobre" atualizado com sucesso!');
      setTeamPhotoFile(null);
      fetchData();
    } catch (error) {
      console.error("Erro ao salvar conteúdo 'Sobre':", error);
      alert('Falha ao salvar conteúdo "Sobre".');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSavePresidente = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedPresidente) return;
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('presidentes_name', selectedPresidente.name || '');
    formData.append('presidentes_role', selectedPresidente.role || '');
    formData.append('presidentes_term', selectedPresidente.term || '');
    if (presidentePhotoFile) {
      formData.append('presidentes_photo', presidentePhotoFile);
    }
    
    try {
      if (selectedPresidente.id) { // ATUALIZAR
        formData.append('_method', 'PUT');
        await api.post(`/presidentes/${selectedPresidente.id}`, formData);
      } else { // CRIAR
        if (!presidentePhotoFile) {
          alert("Por favor, adicione uma foto para o novo presidente.");
          setIsSubmitting(false);
          return;
        }
        await api.post('/presidentes', formData);
      }
      setIsModalOpen(false);
      fetchData();
    } catch(error) {
      console.error("Erro ao salvar presidente:", error);
      alert('Falha ao salvar presidente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePresidente = async (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir este presidente?")) {
      try {
        await api.delete(`/presidentes/${id}`);
        fetchData();
      } catch (error) {
        alert('Falha ao excluir presidente.');
      }
    }
  };

  const handleSaveLocalPhotos = async (e: FormEvent) => {
    e.preventDefault();
    if (newLocalPhotosFiles.length === 0) {
      alert("Por favor, selecione pelo menos uma foto para enviar.");
      return;
    }
    setIsSubmitting(true);
    const formData = new FormData();
    newLocalPhotosFiles.forEach(file => {
      formData.append('photos[]', file);
    });
    try {
      await api.post('/local-photos', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert("Novas fotos do local salvas com sucesso!");
      setNewLocalPhotosFiles([]);
      fetchData();
    } catch (error) {
      console.error("Erro ao salvar fotos do local:", error);
      alert("Falha ao salvar as fotos.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteLocalPhoto = async (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir esta foto?")) {
      try {
        await api.delete(`/local-photos/${id}`);
        fetchData();
      } catch (error) {
        alert("Falha ao excluir a foto.");
      }
    }
  };
  
  // --- HANDLERS DA UI ---
  const handleNewPresidente = () => {
    setSelectedPresidente({ id: 0, name: '', role: '', term: '' });
    setIsModalOpen(true);
    setFormKey(Date.now());
  };
  const handleEditPresidente = (presidente: Presidente) => {
    setSelectedPresidente(presidente);
    setIsModalOpen(true);
    setFormKey(Date.now());
  };
  const handlePresidenteInputChange = (field: keyof PresidenteFormData, value: string) => {
    if(selectedPresidente){
        setSelectedPresidente(p => ({...p, [field]: value }));
    }
  }

  if (isLoading) return <div className="p-48 text-center">A carregar...</div>;

  return (
    <section className="w-full min-h-screen py-24 px-6 relative" style={{ backgroundImage: "url('/background-img-2.png')", backgroundSize: "cover", backgroundPosition: "center" }}>
      <Card className="w-full max-w-[1185px] mx-auto bg-white/70 rounded-[10px]">
        <CardContent className="p-12 md:p-24">
          <div className="flex flex-col items-center space-y-12">
            <div className="flex items-center w-full">
              <Link to="/d_menu" className="mr-4 p-2 hover:bg-gray-200 rounded-full"><ArrowLeftIcon className="h-6 w-6" /></Link>
              <h1 className="text-4xl font-semibold text-black font-['Inter',Helvetica]">Painel Sobre</h1>
            </div>

            <form onSubmit={handleSaveSobre} className="w-full space-y-8 p-6 bg-slate-50 rounded-lg shadow-inner">
              <h2 className="text-3xl font-semibold text-slate-800 border-b pb-4">Conteúdo Principal da Página</h2>
              <div>
                <label className="font-semibold text-gray-700 text-lg mb-2 block">Texto Principal</label>
                <Textarea value={sobreData.text1 || ''} onChange={(e) => setSobreData(p => ({ ...p, text1: e.target.value }))} className="w-full h-[200px] bg-white rounded p-4" />
              </div>
              <div>
                <label className="font-semibold text-gray-700 text-lg mb-2 block">Texto Secundário</label>
                <Textarea value={sobreData.text2 || ''} onChange={(e) => setSobreData(p => ({ ...p, text2: e.target.value }))} className="w-full h-[200px] bg-white rounded p-4" />
              </div>
              <div>
                <label className="font-semibold text-gray-700 text-lg mb-2 block">Alterar Imagem da Equipe</label>
                <Input type="file" accept="image/*" onChange={(e) => setTeamPhotoFile(e.target.files ? e.target.files[0] : null)} className="w-full text-sm" />
                {sobreData.team_photo_url && !teamPhotoFile && <img src={sobreData.team_photo_url} alt="Equipe atual" className="mt-4 h-32 w-auto object-contain border rounded p-1 bg-white" />}
              </div>
              <Button type="submit" disabled={isSubmitting} className="bg-green-600 hover:bg-green-700 text-white w-full py-3">{isSubmitting ? 'A guardar...' : 'Salvar Conteúdo da Página'}</Button>
            </form>
            
            <hr className="w-full border-t-2 border-gray-400" />
            
            <div className="w-full p-6 bg-slate-50 rounded-lg shadow-inner">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-semibold text-slate-800">Gerir Presidentes</h2>
                <Button onClick={handleNewPresidente} className="bg-blue-600 hover:bg-blue-700 text-white">Adicionar Presidente</Button>
              </div>
              <div className="space-y-4">
                {allPresidentes.map(p => (
                  <div key={p.id} className="bg-white p-4 rounded-lg flex justify-between items-center shadow">
                    <div className="flex items-center gap-4">
                      <img src={p.photo_url} alt={p.name} className="h-16 w-16 rounded-full object-cover" />
                      <div>
                        <p className="font-bold">{p.name}</p>
                        <p className="text-sm">{p.role} ({p.term})</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEditPresidente(p)}><PencilIcon className="h-5 w-5" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeletePresidente(p.id)}><Trash2Icon className="h-5 w-5 text-red-500" /></Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <hr className="w-full border-t-2 border-gray-400" />

            <div className="w-full p-6 bg-slate-50 rounded-lg shadow-inner">
              <h2 className="text-3xl font-semibold mb-6">Gerir Fotos do Local</h2>
              <form onSubmit={handleSaveLocalPhotos} className="bg-white p-4 rounded-lg mb-6 space-y-4 border">
                <div>
                  <label htmlFor="local-photos-input" className="block text-sm font-medium text-gray-700 mb-1">Adicionar Novas Fotos (pode selecionar várias)</label>
                  <Input id="local-photos-input" type="file" multiple accept="image/*" onChange={(e) => setNewLocalPhotosFiles(e.target.files ? Array.from(e.target.files) : [])} className="w-full text-sm" />
                  {newLocalPhotosFiles.length > 0 && <p className="text-xs mt-2 text-gray-600">{newLocalPhotosFiles.length} foto(s) selecionada(s).</p>}
                </div>
                <Button type="submit" disabled={isSubmitting || newLocalPhotosFiles.length === 0} className="bg-green-600 hover:bg-green-700 text-white">
                  <ImagePlus className="mr-2 h-5 w-5" />
                  {isSubmitting ? 'A enviar...' : 'Enviar Novas Fotos'}
                </Button>
              </form>
              <h3 className="text-xl font-semibold mb-4 mt-8">Fotos Atuais na Galeria</h3>
              {localPhotos.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {localPhotos.map(photo => (
                    <div key={photo.id} className="relative aspect-square group">
                      <img src={photo.url} alt={photo.caption || 'Foto do local'} className="w-full h-full object-cover rounded-md shadow-md" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button variant="destructive" size="icon" className="h-10 w-10 rounded-full" onClick={() => handleDeleteLocalPhoto(photo.id)}><Trash2Icon className="h-5 w-5" /></Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : ( <p className="text-center text-gray-500 py-8">Não há fotos do local na galeria.</p> )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {isModalOpen && selectedPresidente && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setIsModalOpen(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
              <h3 className="text-lg font-bold mb-4">{selectedPresidente.id ? 'Editar Presidente' : 'Novo Presidente'}</h3>
              <form key={formKey} onSubmit={handleSavePresidente} className="space-y-4">
                <Input type="text" placeholder="Nome" value={selectedPresidente.name || ''} onChange={(e) => handlePresidenteInputChange('name', e.target.value)} required className="w-full p-2 border rounded" />
                <Input type="text" placeholder="Cargo (Ex: Presidente)" value={selectedPresidente.role || ''} onChange={(e) => handlePresidenteInputChange('role', e.target.value)} required className="w-full p-2 border rounded" />
                <Input type="text" placeholder="Mandato (Ex: 2023 à 2027)" value={selectedPresidente.term || ''} onChange={(e) => handlePresidenteInputChange('term', e.target.value)} required className="w-full p-2 border rounded" />
                <div>
                  <label className="text-sm">Foto</label>
                  <Input type="file" accept="image/*" onChange={(e) => setPresidentePhotoFile(e.target.files ? e.target.files[0] : null)} className="w-full text-sm" required={!selectedPresidente.id} />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                  <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'A guardar...' : 'Salvar'}</Button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </section>
  );
};