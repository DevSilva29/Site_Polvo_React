import { ArrowLeftIcon, ChevronLeftIcon, ChevronRightIcon, PencilIcon, Trash2Icon, X } from "lucide-react";
import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import api from "../../../../../api/axiosInstance";
import { Button } from "../../../../../components/ui/button";
import { Card, CardContent } from "../../../../../components/ui/card";
import { Link } from "react-router-dom";

interface Depoimento {
  id: number;
  author: string;
  image: string;
  text: string;
}

interface DepoimentoFormData {
  author: string;
  text: string;
}

export const Sector1 = (): JSX.Element => {
  const [allDepoimentos, setAllDepoimentos] = useState<Depoimento[]>([]);
  const [selectedDepoimento, setSelectedDepoimento] = useState<Partial<Depoimento> | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isFloatingMenuOpen, setIsFloatingMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchDepoimentos = async () => {
    try {
      const response = await api.get('/depoimentos');
      setAllDepoimentos(response.data.data);
    } catch (error) {
      console.error("Erro ao buscar depoimentos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDepoimentos();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir este depoimento?")) {
      try {
        await api.delete(`/depoimentos/${id}`);
        fetchDepoimentos();
      } catch (error) {
        console.error("Erro ao deletar depoimento:", error);
        alert("Não foi possível excluir o depoimento.");
      }
    }
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedDepoimento) return;

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('depoimentos_name', selectedDepoimento.author || '');
    formData.append('depoimentos_message', selectedDepoimento.text || '');
    if (selectedFile) {
      formData.append('depoimentos_photo', selectedFile);
    }

    try {
      if (selectedDepoimento.id) {
        formData.append('_method', 'PUT');
        await api.post(`/depoimentos/${selectedDepoimento.id}`, formData);
      } else {
        if (!selectedFile) {
          alert('Por favor, adicione uma imagem para o novo depoimento.');
          setIsSubmitting(false);
          return;
        }
        await api.post('/depoimentos', formData);
      }
      setIsFloatingMenuOpen(false);
      setSelectedDepoimento(null);
      setSelectedFile(null);
      fetchDepoimentos();
    } catch (error) {
      console.error("Erro ao salvar depoimento:", error);
      alert('Erro ao salvar. Verifique se todos os campos estão corretos.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (depoimento: Depoimento) => {
    setSelectedDepoimento(depoimento);
    setIsFloatingMenuOpen(true);
  };
  
  const handleNew = () => {
    setSelectedDepoimento({ id: 0, author: "", text: "", image: "" });
    setSelectedFile(null);
    setIsFloatingMenuOpen(true);
  };

  const handleInputChange = (field: keyof DepoimentoFormData, value: string) => {
    if (selectedDepoimento) {
      setSelectedDepoimento({ ...selectedDepoimento, [field]: value });
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFile(e.target.files[0]);
    }
  };
  
  const [currentPage, setCurrentPage] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const depoimentosPerPage = 3;
  const totalPages = Math.ceil(allDepoimentos.length / depoimentosPerPage);
  const currentDepoimentos = allDepoimentos.slice(currentPage * depoimentosPerPage, (currentPage + 1) * depoimentosPerPage);
  const handlePrevious = () => { if (currentPage > 0 && !isAnimating) { setIsAnimating(true); setTimeout(() => { setCurrentPage(currentPage - 1); setIsAnimating(false); }, 150); } };
  const handleNext = () => { if (currentPage < totalPages - 1 && !isAnimating) { setIsAnimating(true); setTimeout(() => { setCurrentPage(currentPage + 1); setIsAnimating(false); }, 150); } };

  if(isLoading) return <div className="p-48 text-center">Carregando depoimentos...</div>

  return (
    <section className="w-full py-16 relative bg-[url(/background-img-2.png)] bg-cover bg-center">
      <Card className="mx-auto max-w-6xl bg-white/70 rounded-[10px] z-10 relative">
        <CardContent className="p-16">
          <div className="flex items-center mb-12">
            <Link to={"/d_menu"} className="mr-4 h-10 w-10 flex items-center justify-center hover:bg-gray-200 rounded-full transition-colors" aria-label="Voltar para a página anterior">
              <ArrowLeftIcon className="h-6 w-6 text-gray-800" />
            </Link>
            <h2 className="text-4xl font-semibold text-black font-['Inter',Helvetica]">
              Gerenciar Depoimentos
            </h2>
          </div>

          <div className="w-full overflow-hidden min-h-[350px]">
            <div className={`w-full space-y-6 transition-all duration-300 ease-in-out ${isAnimating ? 'opacity-0 transform -translate-x-4' : 'opacity-100 transform translate-x-0'}`}>
              {currentDepoimentos.length > 0 ? currentDepoimentos.map((depoimento) => (
                <div key={depoimento.id} className="w-full bg-[#f0f8ff] rounded-[10px] flex items-start p-4 transform transition-all duration-200 hover:scale-[1.02] hover:shadow-md border border-gray-200/50">
                  <img src={depoimento.image} alt={`Avatar de ${depoimento.author}`} className="w-[61px] h-[61px] object-cover rounded-full flex-shrink-0" />
                  <div className="ml-4 flex-grow">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-['IBM_Plex_Sans',Helvetica] font-semibold text-black text-lg block">{depoimento.author}</span>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Button variant="ghost" size="icon" className="h-[35px] w-[35px] hover:bg-blue-100 rounded-full" onClick={() => handleEdit(depoimento)}><PencilIcon className="h-5 w-5 text-gray-700" /></Button>
                        <Button variant="ghost" size="icon" className="h-[35px] w-[35px] hover:bg-red-100 rounded-full" onClick={() => handleDelete(depoimento.id)}><Trash2Icon className="h-5 w-5 text-gray-700" /></Button>
                      </div>
                    </div>
                    <p className="text-gray-800 text-sm font-['Inter',Helvetica]">
                      {depoimento.text}
                    </p>
                  </div>
                </div>
              )) : (
                 <div className="text-center py-20 text-gray-500">
                    <p>Nenhum depoimento encontrado. Clique em "Novo Depoimento" para começar.</p>
                  </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between w-full mt-8">
            <div className="flex-1"></div>
            <Button className="bg-[#beecff] text-[#3661a0] hover:bg-[#a9d9f0] rounded-lg px-6 py-3.5 h-[66px] transition-all duration-200 hover:scale-105" onClick={handleNew}>Novo Depoimento</Button>
            <div className="flex-1 flex justify-end gap-2">
              <div className="flex items-center gap-2 mr-4"><span className="text-sm text-gray-600">{totalPages > 0 ? currentPage + 1 : 0} de {totalPages}</span></div>
              <Button variant="ghost" size="icon" className={`h-[45px] w-[33px]`} onClick={handlePrevious} disabled={currentPage === 0 || isAnimating}><ChevronLeftIcon className="h-6 w-6" /></Button>
              <Button variant="ghost" size="icon" className={`h-[45px] w-[33px]`} onClick={handleNext} disabled={currentPage >= totalPages - 1 || isAnimating}><ChevronRightIcon className="h-6 w-6" /></Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {isFloatingMenuOpen && selectedDepoimento && (
        <>
          <div className="fixed inset-0 bg-black/20 z-40 backdrop-blur-sm" onClick={() => setIsFloatingMenuOpen(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl border p-6 w-full max-w-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{selectedDepoimento.id ? "Editar Depoimento" : "Adicionar Depoimento"}</h3>
                <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-gray-100" onClick={() => setIsFloatingMenuOpen(false)}><X className="h-4 w-4" /></Button>
              </div>
              <form onSubmit={handleSave} className="space-y-4">
                <div><label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">Nome do Autor</label><input id="author" type="text" value={selectedDepoimento.author || ''} onChange={(e) => handleInputChange('author', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md" required /></div>
                <div><label htmlFor="photo" className="block text-sm font-medium text-gray-700 mb-1">Foto do Autor</label><input id="photo" type="file" accept="image/*" onChange={handleFileChange} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" /></div>
                <div><label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-1">Texto do Depoimento</label><textarea id="text" value={selectedDepoimento.text || ''} onChange={(e) => handleInputChange('text', e.target.value)} rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-md" required /></div>
                <div className="flex justify-end gap-3 pt-4"><Button type="button" variant="ghost" onClick={() => setIsFloatingMenuOpen(false)}>Cancelar</Button><Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white">{isSubmitting ? "Salvando..." : (selectedDepoimento.id ? "Salvar" : "Criar")}</Button></div>
              </form>
            </div>
          </div>
        </>
      )}
    </section>
  );
};