import { ArrowLeftIcon, ChevronLeftIcon, ChevronRightIcon, PencilIcon, Trash2Icon, X } from "lucide-react";
import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import api from "../../../../../api/axiosInstance";
import { Button } from "../../../../../components/ui/button";
import { Card, CardContent } from "../../../../../components/ui/card";
import { Link } from "react-router-dom";

interface Sponsor {
  id: number;
  name: string;
  logo: string;
  url: string;
}

interface SponsorFormData {
  name: string;
  url: string;
}

export const Sector1 = (): JSX.Element => {
  const [allSponsors, setAllSponsors] = useState<Sponsor[]>([]);
  const [selectedSponsor, setSelectedSponsor] = useState<Partial<Sponsor> | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isFloatingMenuOpen, setIsFloatingMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchSponsors = async () => {
    try {
      const response = await api.get('/patrocinadores');
      setAllSponsors(response.data);;
    } catch (error) {
      console.error("Erro ao buscar patrocinadores:", error);
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
        console.error("Erro ao deletar patrocinador:", error);
        alert("Não foi possível excluir o patrocinador.");
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
    
    if (selectedFile) {
      formData.append('patrocinadores_logo', selectedFile);
    }

    try {
      if (selectedSponsor.id) {
        formData.append('_method', 'PUT');
        await api.post(`/patrocinadores/${selectedSponsor.id}`, formData);
      } else {
        if (!selectedFile) {
          alert('Por favor, adicione um logo para o novo patrocinador.');
          setIsSubmitting(false);
          return;
        }
        await api.post('/patrocinadores', formData);
      }


      setIsFloatingMenuOpen(false);
      setSelectedSponsor(null);
      setSelectedFile(null);
      fetchSponsors();

    } catch (error) {
      console.error("Erro ao salvar patrocinador:", error);
      alert('Erro ao salvar. Verifique se todos os campos (nome, URL e logo) estão corretos.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (sponsor: Sponsor) => {
    setSelectedSponsor(sponsor);
    setSelectedFile(null);
    setIsFloatingMenuOpen(true);
  };
  
  const handleAddNew = () => {
    setSelectedSponsor({ id: 0, name: "", url: "", logo: "" });
    setSelectedFile(null);
    setIsFloatingMenuOpen(true);
  };

  const handleInputChange = (field: keyof SponsorFormData, value: string) => {
    if (selectedSponsor) {
      setSelectedSponsor({ ...selectedSponsor, [field]: value });
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleCloseMenu = () => {
    setIsFloatingMenuOpen(false);
    setSelectedSponsor(null);
    setSelectedFile(null);
  };

  const [currentPage, setCurrentPage] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const sponsorsPerPage = 4;
  const totalPages = Math.ceil(allSponsors.length / sponsorsPerPage);
  const currentSponsors = allSponsors.slice(currentPage * sponsorsPerPage, (currentPage + 1) * sponsorsPerPage);
  const handlePrevious = () => { if (currentPage > 0 && !isAnimating) { setIsAnimating(true); setTimeout(() => { setCurrentPage(currentPage - 1); setIsAnimating(false); }, 150); } };
  const handleNext = () => { if (currentPage < totalPages - 1 && !isAnimating) { setIsAnimating(true); setTimeout(() => { setCurrentPage(currentPage + 1); setIsAnimating(false); }, 150); } };


  if (isLoading) {
    return <div className="p-48 text-center">Carregando patrocinadores...</div>;
  }

  return (
    <section className="bg-[url(/background-img-2.png)] bg-cover bg-center w-full py-16 relative min-h-screen">
      <Card className="mx-auto max-w-6xl bg-white/70 rounded-[10px] z-10 relative">
        <CardContent className="p-16">
          <div className="flex flex-col items-center">
            <div className="flex items-center w-full mb-12">
              <Link to={"/d_menu"} className="mr-4 h-10 w-10 flex items-center justify-center hover:bg-gray-200 rounded-full transition-colors" aria-label="Voltar para a página anterior">
                <ArrowLeftIcon className="h-6 w-6 text-gray-800" />
              </Link>
              <h2 className="text-4xl font-semibold text-black font-['Inter',Helvetica]">Patrocinadores</h2>
            </div>

            <div className="w-full overflow-hidden min-h-[400px]">
              <div className={`w-full space-y-8 transition-all duration-300 ease-in-out ${isAnimating ? 'opacity-0 transform translate-x-4' : 'opacity-100 transform translate-x-0'}`}>
                {currentSponsors.length > 0 ? currentSponsors.map((sponsor) => (
                  <div key={sponsor.id} className="w-full h-[79px] bg-[#beebffb2] rounded-[10px] flex items-center justify-between px-4">
                    <div className="flex items-center">
                      <img className="w-[61px] h-[61px] object-contain rounded-lg bg-white p-1" alt={`Logo ${sponsor.name}`} src={sponsor.logo} />
                      <span className="ml-4 font-['IBM_Plex_Sans',Helvetica] font-light text-black text-lg">{sponsor.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button variant="ghost" size="icon" className="h-[35px] w-[35px] hover:bg-blue-100 rounded-full" onClick={() => handleEdit(sponsor)}><PencilIcon className="h-5 w-5 text-gray-700" /></Button>
                      <Button variant="ghost" size="icon" className="h-[35px] w-[35px] hover:bg-red-100 rounded-full" onClick={() => handleDelete(sponsor.id)}><Trash2Icon className="h-5 w-5 text-gray-700" /></Button>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-20 text-gray-500"><p>Nenhum patrocinador encontrado.</p></div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between w-full mt-8">
              <div className="flex-1"></div>
              <Button className="bg-[#beecff] text-[#3661a0] hover:bg-[#a9d9f0] rounded-lg px-6 py-3.5 h-[66px]" onClick={handleAddNew}>Novo Patrocinador</Button>
              <div className="flex-1 flex justify-end gap-2">
                <div className="flex items-center gap-2 mr-4"><span className="text-sm text-gray-600">{totalPages > 0 ? currentPage + 1 : 0} de {totalPages}</span></div>
                <Button variant="ghost" size="icon" className={`h-[45px] w-[33px]`} onClick={handlePrevious} disabled={currentPage === 0 || isAnimating}><ChevronLeftIcon className="h-6 w-6" /></Button>
                <Button variant="ghost" size="icon" className={`h-[45px] w-[33px]`} onClick={handleNext} disabled={currentPage >= totalPages - 1 || isAnimating}><ChevronRightIcon className="h-6 w-6" /></Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {isFloatingMenuOpen && selectedSponsor && (
        <>
          <div className="fixed inset-0 bg-black/20 z-40" onClick={handleCloseMenu} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl border p-6 w-[550px] max-w-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{selectedSponsor.id ? "Editar Patrocinador" : "Novo Patrocinador"}</h3>
                <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-gray-100" onClick={handleCloseMenu}><X className="h-4 w-4" /></Button>
              </div>
              <form onSubmit={handleSave} className="space-y-4">
                <div><label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nome</label><input id="name" type="text" value={selectedSponsor.name || ''} onChange={(e) => handleInputChange('name', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md" required /></div>
                <div><label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">URL (link do site)</label><input id="url" type="url" value={selectedSponsor.url || ''} onChange={(e) => handleInputChange('url', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="https://exemplo.com" required/></div>
                <div><label htmlFor="logo" className="block text-sm font-medium text-gray-700 mb-1">Logo (PNG ou JPG)</label><input id="logo" type="file" accept="image/png, image/jpeg" onChange={handleFileChange} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" required={!selectedSponsor.id} /></div>
                
                <div className="flex justify-end gap-3 pt-4"><Button type="button" variant="ghost" onClick={handleCloseMenu}>Cancelar</Button><Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white">{isSubmitting ? 'Salvando...' : (selectedSponsor.id ? "Salvar" : "Adicionar")}</Button></div>
              </form>
            </div>
          </div>
        </>
      )}
    </section>
  );
};