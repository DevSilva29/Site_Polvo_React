import { ArrowLeftIcon, ImagePlus, PencilIcon, Trash2Icon, X } from "lucide-react";
import React, { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { Link } from "react-router-dom";
import api from "../../../../../api/axiosInstance";
import { Button } from "../../../../../components/ui/button";
import { Card, CardContent } from "../../../../../components/ui/card";
import { Input } from "../../../../../components/ui/input";

// Interface para os dados que vêm da API
interface Sponsor {
  id: number;
  name: string;
  logo: string; // URL completa da imagem
  url: string;  // Link do site
}

// Interface para os dados do formulário
interface SponsorFormData {
  name: string;
  url: string;
}

export const Sector1 = (): JSX.Element => {
  // --- ESTADOS ---
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [selectedSponsor, setSelectedSponsor] = useState<Partial<SponsorFormData> & { id?: number, logo?: string } | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formKey, setFormKey] = useState(Date.now()); // Para resetar o input de arquivo

  // --- LÓGICA DE API ---
  const fetchSponsors = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/patrocinadores');
      
      // Lógica robusta: verifica se vem em 'data' ou direto
      const dataList = Array.isArray(response.data.data) 
        ? response.data.data 
        : (Array.isArray(response.data) ? response.data : []);

      setSponsors(dataList);
    } catch (error) {
      console.error("Erro ao buscar patrocinadores:", error);
      setSponsors([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSponsors();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir este patrocinador?")) {
      try {
        await api.delete(`/patrocinadores/${id}`);
        fetchSponsors();
      } catch (error) {
        alert("Falha ao excluir patrocinador.");
      }
    }
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedSponsor) return;

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('patrocinadores_name', selectedSponsor.name || '');
    formData.append('patrocinadores_url', selectedSponsor.url || '');
    
    if (logoFile) {
      formData.append('patrocinadores_logo', logoFile);
    }

    try {
      if (selectedSponsor.id) { // ATUALIZAR
        formData.append('_method', 'PUT');
        await api.post(`/patrocinadores/${selectedSponsor.id}`, formData);
      } else { // CRIAR
        if (!logoFile) {
          alert("O logo é obrigatório para novos patrocinadores.");
          setIsSubmitting(false);
          return;
        }
        await api.post('/patrocinadores', formData);
      }
      handleCloseModal();
      fetchSponsors();
    } catch (error) {
      console.error(error);
      alert("Falha ao salvar patrocinador. Verifique os campos.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- HANDLERS DA UI ---
  const handleNew = () => {
    setSelectedSponsor({ id: 0, name: '', url: '' });
    setLogoFile(null);
    setFormKey(Date.now());
    setIsModalOpen(true);
  };

  const handleEdit = (sponsor: Sponsor) => {
    setSelectedSponsor({
        id: sponsor.id,
        name: sponsor.name,
        url: sponsor.url,
        logo: sponsor.logo // Guardamos a URL atual para mostrar preview
    });
    setLogoFile(null);
    setFormKey(Date.now());
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSponsor(null);
    setLogoFile(null);
  };

  const handleInputChange = (field: keyof SponsorFormData, value: string) => {
    if (selectedSponsor) {
      setSelectedSponsor({ ...selectedSponsor, [field]: value });
    }
  };

  if (isLoading) return <div className="p-48 text-center">A carregar patrocinadores...</div>;

  return (
    <section className="w-full py-16 bg-[url(/background-img-2.png)] bg-cover min-h-screen">
      <Card className="mx-auto max-w-6xl bg-white/80 backdrop-blur-sm">
        <CardContent className="p-8 md:p-16">
          <div className="flex items-center mb-8">
            <Link to="/d_menu" className="mr-4 p-2 hover:bg-gray-200 rounded-full"><ArrowLeftIcon className="h-6 w-6" /></Link>
            <h2 className="text-4xl font-bold">Gerir Patrocinadores</h2>
          </div>
          
          <Button onClick={handleNew} className="mb-8 bg-blue-600 hover:bg-blue-700 text-white">
            <ImagePlus className="mr-2 h-4 w-4" /> Novo Patrocinador
          </Button>
          
          <div className="w-full overflow-hidden">
            {/* --- LÓGICA DE "NÃO HÁ DADOS" --- */}
            {sponsors.length > 0 ? (
                <div className="space-y-4">
                    {sponsors.map((sponsor) => (
                    <div key={sponsor.id} className="bg-slate-50 p-4 rounded-lg shadow flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <img src={sponsor.logo} alt={sponsor.name} className="h-16 w-16 object-contain bg-white rounded border p-1" />
                            <div>
                                <h3 className="font-bold text-lg">{sponsor.name}</h3>
                                <a href={sponsor.url} target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:underline truncate max-w-[200px] block">{sponsor.url}</a>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="ghost" size="icon" onClick={() => handleEdit(sponsor)}><PencilIcon className="h-5 w-5 text-blue-600" /></Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDelete(sponsor.id)}><Trash2Icon className="h-5 w-5 text-red-500" /></Button>
                        </div>
                    </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 text-gray-500">
                    <p className="text-xl font-medium">Nenhum patrocinador registado.</p>
                    <p className="mt-2 text-sm">Clique em "Novo Patrocinador" para adicionar parceiros.</p>
                </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* --- MODAL --- */}
      {isModalOpen && selectedSponsor && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={handleCloseModal} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">{selectedSponsor.id ? 'Editar Patrocinador' : 'Novo Patrocinador'}</h3>
                <Button variant="ghost" size="icon" onClick={handleCloseModal}><X className="h-5 w-5" /></Button>
              </div>
              
              <form key={formKey} onSubmit={handleSave} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Nome da Empresa</label>
                    <Input type="text" value={selectedSponsor.name || ''} onChange={(e) => handleInputChange('name', e.target.value)} required />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Link do Site (URL)</label>
                    <Input type="url" value={selectedSponsor.url || ''} onChange={(e) => handleInputChange('url', e.target.value)} placeholder="https://..." required />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Logo (Imagem)</label>
                    <Input type="file" accept="image/*" onChange={(e) => setLogoFile(e.target.files ? e.target.files[0] : null)} required={!selectedSponsor.id} />
                    {selectedSponsor.id && selectedSponsor.logo && !logoFile && (
                        <div className="mt-2">
                            <p className="text-xs text-gray-500 mb-1">Logo Atual:</p>
                            <img src={selectedSponsor.logo} alt="Logo atual" className="h-12 object-contain border p-1" />
                        </div>
                    )}
                </div>
                
                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="ghost" onClick={handleCloseModal}>Cancelar</Button>
                  <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white">
                    {isSubmitting ? 'A guardar...' : 'Salvar'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </section>
  );
};