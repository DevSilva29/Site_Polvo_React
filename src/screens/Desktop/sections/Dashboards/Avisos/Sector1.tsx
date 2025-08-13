import { ArrowLeftIcon, ChevronLeftIcon, ChevronRightIcon, PencilIcon, Trash2Icon, X } from "lucide-react";
import React, { useState, useEffect, FormEvent } from "react";
import api from "../../../../../api/axiosInstance"; // <-- USA A NOSSA INSTÂNCIA CENTRAL
import { Button } from "../../../../../components/ui/button";
import { Card, CardContent } from "../../../../../components/ui/card";

// Interfaces
interface Aviso {
  avisos_id: number;
  avisos_title: string;
  avisos_description: string;
}
interface AvisoForm {
  avisos_title: string;
  avisos_description: string;
}

export const Sector1 = (): JSX.Element => {
  const [allAvisos, setAllAvisos] = useState<Aviso[]>([]);
  const [selectedAviso, setSelectedAviso] = useState<Partial<Aviso> | null>(null);
  const [isFloatingMenuOpen, setIsFloatingMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Lógica de API usando a instância 'api'
  const fetchAvisos = async () => {
    try {
      const response = await api.get("/avisos"); // <-- URL relativa
      setAllAvisos(response.data);
    } catch (error) {
      console.error("Erro ao buscar avisos:", error);
      setAllAvisos([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAvisos();
  }, []);

  const handleDelete = async (avisoId: number) => {
    if (window.confirm("Tem certeza que deseja excluir este aviso?")) {
      try {
        await api.delete(`/avisos/${avisoId}`); // <-- URL relativa
        fetchAvisos();
      } catch (error) {
        console.error("Erro ao deletar aviso:", error);
        alert("Não foi possível excluir o aviso.");
      }
    }
  };

  const handleSave = async (formEvent: FormEvent) => {
    formEvent.preventDefault();
    if (!selectedAviso) return;
    setIsSubmitting(true);
    
    const avisoData: AvisoForm = {
      avisos_title: selectedAviso.avisos_title || '',
      avisos_description: selectedAviso.avisos_description || '',
    };

    try {
      if (selectedAviso.avisos_id && selectedAviso.avisos_id !== 0) {
        await api.put(`/avisos/${selectedAviso.avisos_id}`, avisoData); // <-- USA PUT
      } else {
        await api.post("/avisos", avisoData); // <-- USA POST
      }
      setIsFloatingMenuOpen(false);
      setSelectedAviso(null);
      fetchAvisos();
    } catch (error) {
      console.error("Erro ao salvar aviso:", error);
      alert("Erro ao salvar. Verifique os campos e tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const [currentPage, setCurrentPage] = useState(0);
  const avisosPerPage = 3;
  const totalPages = Math.ceil(allAvisos.length / avisosPerPage);
  const currentAvisos = allAvisos.slice(currentPage * avisosPerPage, (currentPage + 1) * avisosPerPage);

  const handleEdit = (aviso: Aviso) => {
    setSelectedAviso(aviso);
    setIsFloatingMenuOpen(true);
  };
  
  const handleInputChange = (field: keyof AvisoForm, value: string) => {
    if (selectedAviso) {
      setSelectedAviso({ ...selectedAviso, [field]: value });
    }
  };

  const [isAnimating, setIsAnimating] = useState(false);
  const handlePrevious = () => { if (currentPage > 0 && !isAnimating) { setIsAnimating(true); setTimeout(() => { setCurrentPage(currentPage - 1); setIsAnimating(false); }, 150); }};
  const handleNext = () => { if (currentPage < totalPages - 1 && !isAnimating) { setIsAnimating(true); setTimeout(() => { setCurrentPage(currentPage + 1); setIsAnimating(false); }, 150); }};

  if (isLoading) {
      return <div className="text-center p-48">Carregando painel de avisos...</div>;
  }
  
  return (
    <section className="w-full py-16 relative bg-[url(/background-img-2.png)] bg-cover bg-center">
      <Card className="mx-auto max-w-6xl bg-white/70 rounded-[10px] z-10 relative">
        <CardContent className="p-16">
          <div className="flex flex-col items-center">
            
            <div className="flex items-center w-full mb-12">
              <button onClick={() => window.history.back()} className="mr-4 p-2 hover:bg-gray-200 rounded-full transition-colors" aria-label="Voltar">
                <ArrowLeftIcon className="h-6 w-6 text-gray-800" />
              </button>
              <h2 className="text-4xl font-semibold text-black font-['Inter',Helvetica]">Painel de Avisos</h2>
            </div>

            <div className="w-full overflow-hidden min-h-[285px]"> {/* Altura mínima para evitar "pulos" na UI */}
              <div className={`w-full space-y-4 transition-all duration-300 ease-in-out ${isAnimating ? 'opacity-0 transform -translate-x-4' : 'opacity-100 transform translate-x-0'}`}>
                {currentAvisos.length > 0 ? currentAvisos.map((aviso) => (
                  <div key={aviso.avisos_id} className="w-full min-h-[79px] bg-[#beebffb2] rounded-[10px] flex items-center justify-between p-4">
                    <div className="flex-1 mr-4">
                      <h3 className="font-['IBM_Plex_Sans',Helvetica] font-semibold text-black text-lg">{aviso.avisos_title}</h3>
                      <p className="text-sm text-gray-800 mt-1">{aviso.avisos_description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(aviso)}><PencilIcon className="h-5 w-5" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(aviso.avisos_id)}><Trash2Icon className="h-5 w-5 text-red-500" /></Button>
                    </div>
                  </div>
                )) : <p className="text-center text-gray-500 pt-24">Nenhum aviso encontrado. Clique em "Novo Aviso" para começar.</p>}
              </div>
            </div>

            <div className="flex items-center justify-between w-full mt-8">
                <div className="flex-1"></div>
                <Button className="bg-[#beecff] text-[#3661a0] hover:bg-[#a9d9f0] rounded-lg px-6 py-3.5 h-[66px]"
                    onClick={() => {
                        setSelectedAviso({ avisos_id: 0, avisos_title: "", avisos_description: "" });
                        setIsFloatingMenuOpen(true);
                    }}>
                    Novo Aviso
                </Button>
                <div className="flex-1 flex justify-end gap-2">
                    <span className="text-sm text-gray-600 self-center mr-4">{totalPages > 0 ? currentPage + 1 : 0} de {totalPages}</span>
                    <Button variant="ghost" size="icon" onClick={handlePrevious} disabled={currentPage === 0 || isAnimating}><ChevronLeftIcon /></Button>
                    <Button variant="ghost" size="icon" onClick={handleNext} disabled={currentPage >= totalPages - 1 || isAnimating}><ChevronRightIcon /></Button>
                </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {isFloatingMenuOpen && selectedAviso && (
        <>
          <div className="fixed inset-0 bg-black/30 z-40 backdrop-blur-sm" onClick={() => setIsFloatingMenuOpen(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl border p-6 w-full max-w-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">{selectedAviso.avisos_id !== 0 ? "Editar Aviso" : "Adicionar Novo Aviso"}</h3>
                <Button variant="ghost" size="icon" onClick={() => setIsFloatingMenuOpen(false)}><X className="h-4 w-4" /></Button>
              </div>
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label htmlFor="titulo" className="block text-sm font-medium text-gray-700 mb-1">Título do Aviso</label>
                  <input id="titulo" type="text" value={selectedAviso.avisos_title} onChange={(e) => handleInputChange('avisos_title', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md" required />
                </div>
                <div>
                  <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                  <textarea id="descricao" value={selectedAviso.avisos_description} onChange={(e) => handleInputChange('avisos_description', e.target.value)} rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-md" required />
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="ghost" onClick={() => setIsFloatingMenuOpen(false)}>Cancelar</Button>
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">{selectedAviso.avisos_id !== 0 ? "Salvar Alterações" : "Criar Aviso"}</Button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </section>
  );
};