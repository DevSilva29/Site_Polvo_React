import { ArrowLeftIcon, ChevronLeftIcon, ChevronRightIcon, FileTextIcon, PaperclipIcon, PencilIcon, Trash2Icon, X } from "lucide-react";
import React, { useState, useEffect, FormEvent, ChangeEvent } from "react";
import api from "../../../../../api/axiosInstance";
import { Button } from "../../../../../components/ui/button";
import { Card, CardContent } from "../../../../../components/ui/card";
import { Link } from "react-router-dom";
import { Input } from "../../../../../components/ui/input";
import { Textarea } from "../../../../../components/ui/textarea";

interface Documento {
  id: number;
  title: string;
  number: string;
  date: string;
  type: 'Ofício' | 'Ata';
  file_url: string | null;
}

interface DocumentoFormData {
  title: string;
  number: string;
  date: string;
  type: 'Ofício' | 'Ata';
}

const formatDisplayDateToInput = (dateString: string): string => {
  if (!dateString || !dateString.includes('/')) return '';
  const [day, month, year] = dateString.split('/');
  return `${year}-${month}-${day}`;
};

export const Sector1 = (): JSX.Element => {
  const [allDocuments, setAllDocuments] = useState<Documento[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<Partial<DocumentoFormData> & { id?: number, file_url?: string | null } | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isFloatingMenuOpen, setIsFloatingMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formKey, setFormKey] = useState(Date.now());

  const fetchDocuments = async () => {
    try {
      const response = await api.get('/documentos');
      setAllDocuments(response.data.data);
    } catch (error) {
      console.error("Erro ao buscar documentos:", error);
      setAllDocuments([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleDeleteDocument = async (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir este documento?")) {
      try {
        await api.delete(`/documentos/${id}`);
        fetchDocuments();
      } catch (error) {
        console.error("Erro ao deletar documento:", error);
        alert("Não foi possível excluir o documento.");
      }
    }
  };

  const handleSaveDocument = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedDocument) return;

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('docs_title', selectedDocument.title || '');
    formData.append('docs_number', selectedDocument.number || '');
    formData.append('docs_date', selectedDocument.date || '');
    formData.append('docs_types', selectedDocument.type || 'Ofício');
    
    if (selectedFile) {
      formData.append('docs_file', selectedFile);
    }

    try {
      if (selectedDocument.id) {
        formData.append('_method', 'PUT');
        await api.post(`/documentos/${selectedDocument.id}`, formData);
      } else {
        if (!selectedFile) {
          alert('Por favor, anexe um arquivo PDF para o novo documento.');
          setIsSubmitting(false);
          return;
        }
        await api.post('/documentos', formData);
      }
      
      setIsFloatingMenuOpen(false);
      fetchDocuments();

    } catch (error) {
      console.error("Erro ao salvar documento:", error);
      alert('Erro ao salvar. Verifique se todos os campos estão corretos.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditDocument = (doc: Documento) => {
    setSelectedDocument({
        id: doc.id,
        title: doc.title,
        number: doc.number,
        date: formatDisplayDateToInput(doc.date),
        type: doc.type,
        file_url: doc.file_url,
    });
    setFormKey(Date.now());
    setIsFloatingMenuOpen(true);
  };
  
  const handleNewDocument = () => {
    setSelectedDocument({
        id: 0,
        title: "",
        number: "",
        date: new Date().toISOString().split('T')[0],
        type: "Ofício",
    });
    setFormKey(Date.now());
    setIsFloatingMenuOpen(true);
  };

  const handleInputChange = (field: keyof Omit<Documento, 'id' | 'file_url'>, value: string) => {
    if (selectedDocument) {
      setSelectedDocument({ ...selectedDocument, [field]: value });
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === "application/pdf") {
        setSelectedFile(file);
      } else {
        alert("Por favor, selecione um arquivo no formato PDF.");
        e.target.value = '';
      }
    }
  };

  const handleCloseMenu = () => {
    setIsFloatingMenuOpen(false);
    setSelectedDocument(null);
    setSelectedFile(null);
  };

  const [currentPage, setCurrentPage] = useState(0);
  const documentsPerPage = 4;
  const totalPages = Math.ceil(allDocuments.length / documentsPerPage);
  const currentDocuments = allDocuments.slice(currentPage * documentsPerPage, (currentPage + 1) * documentsPerPage);
  const handlePrevious = () => { if (currentPage > 0) setCurrentPage(c => c - 1); };
  const handleNext = () => { if (currentPage < totalPages - 1) setCurrentPage(c => c + 1); };

  if (isLoading) return <div className="p-48 text-center">Carregando documentos...</div>;

  return (
    <section className="w-full py-16 relative bg-[url(/background-img-2.png)] bg-cover bg-center min-h-screen">
      <Card className="mx-auto max-w-6xl bg-white/70 rounded-[10px] z-10 relative">
        <CardContent className="p-16">
          <div className="flex flex-col items-center">
            
            <div className="flex items-center w-full mb-12">
              <Link to={"/d_menu"} className="mr-4 h-10 w-10 flex items-center justify-center hover:bg-gray-200 rounded-full transition-colors" aria-label="Voltar">
                <ArrowLeftIcon className="h-6 w-6 text-gray-800" />
              </Link>
              <h2 className="text-4xl font-semibold text-black font-['Inter',Helvetica]">Gestão de Ofícios e Atas</h2>
            </div>
            
            <div className="w-full overflow-hidden min-h-[400px]">
              <div className={`w-full space-y-4`}>
                {currentDocuments.length > 0 ? currentDocuments.map((doc) => (
                  <div key={doc.id} className="w-full h-auto bg-[#e0f7fa] rounded-[10px] flex items-center justify-between p-4">
                    <div className="flex items-center flex-grow">
                      <div className="w-[50px] h-[50px] flex-shrink-0 flex items-center justify-center bg-white/60 rounded-lg">
                        <FileTextIcon className="w-7 h-7 text-[#00796b]" />
                      </div>
                      <div className="ml-4 flex-grow">
                        <span className="font-['IBM_Plex_Sans',Helvetica] font-bold text-gray-800 text-lg">
                          {doc.number}
                          <span className={`ml-2 text-xs font-medium text-white px-2 py-0.5 rounded-full align-middle ${doc.type === 'Ofício' ? 'bg-blue-600' : 'bg-green-600'}`}>{doc.type}</span>
                        </span>
                        <p className="text-sm text-gray-800 mt-1">{doc.title}</p>
                        <span className="block text-sm text-gray-600 mt-1">Data: {doc.date}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                      {doc.file_url && (
                        <a href={doc.file_url} target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" className="h-[38px] bg-white hover:bg-gray-50 border-teal-600 text-teal-600">
                            <PaperclipIcon className="h-4 w-4 mr-2" />
                            Ver PDF
                          </Button>
                        </a>
                      )}
                      <Button variant="ghost" size="icon" className="h-[38px] w-[38px] hover:bg-blue-100 rounded-full" onClick={() => handleEditDocument(doc)}><PencilIcon className="h-5 w-5 text-blue-600" /></Button>
                      <Button variant="ghost" size="icon" className="h-[38px] w-[38px] hover:bg-red-100 rounded-full" onClick={() => handleDeleteDocument(doc.id)}><Trash2Icon className="h-5 w-5 text-red-600" /></Button>
                    </div>
                  </div>
                )) : (
                    <div className="text-center py-20 text-gray-500"><p>Nenhum documento encontrado.</p></div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between w-full mt-10">
              <div className="flex-1">
                <Button className="bg-[#00796b] text-white hover:bg-[#004d40] rounded-lg px-6 py-3 h-auto" onClick={handleNewDocument}>Novo Documento</Button>
              </div>
              <div className="flex-1 flex justify-end items-center gap-2">
                <span className="text-sm text-gray-700 font-medium">{totalPages > 0 ? currentPage + 1 : 0} de {totalPages}</span>
                <Button variant="ghost" size="icon" className={`h-[45px] w-[33px]`} onClick={handlePrevious} disabled={currentPage === 0}><ChevronLeftIcon className="h-6 w-6" /></Button>
                <Button variant="ghost" size="icon" className={`h-[45px] w-[33px]`} onClick={handleNext} disabled={currentPage >= totalPages - 1}><ChevronRightIcon className="h-6 w-6" /></Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {isFloatingMenuOpen && selectedDocument && (
        <>
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" onClick={handleCloseMenu} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl border p-6 w-[500px] max-w-full">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-800">{selectedDocument.id ? "Editar Documento" : "Novo Documento"}</h3>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-gray-200" onClick={handleCloseMenu}><X className="h-5 w-5 text-gray-600" /></Button>
              </div>

              <form key={formKey} onSubmit={handleSaveDocument} className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                  <input id="title" type="text" value={selectedDocument.title || ''} onChange={(e) => handleInputChange('title', e.target.value)} placeholder="Ex: Solicitação de Equipamentos" className="w-full px-3 py-2 border border-gray-300 rounded-md" required />
                </div>
                <div>
                  <label htmlFor="number" className="block text-sm font-medium text-gray-700 mb-1">Número / Identificador</label>
                  <input id="number" type="text" value={selectedDocument.number || ''} onChange={(e) => handleInputChange('number', e.target.value)} placeholder="Ex: Ofício Nº 123/2024" className="w-full px-3 py-2 border border-gray-300 rounded-md" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Data do Documento</label>
                        <input id="date" type="date" value={selectedDocument.date || ''} onChange={(e) => handleInputChange('date', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md" required />
                    </div>
                    <div>
                        <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                        <select id="type" value={selectedDocument.type || 'Ofício'} onChange={(e) => handleInputChange('type', e.target.value as 'Ofício' | 'Ata')} className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white" required>
                            <option value="Ofício">Ofício</option>
                            <option value="Ata">Ata</option>
                        </select>
                    </div>
                </div>
                <div>
                  <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-1">Anexar PDF</label>
                  <input id="file" type="file" accept=".pdf,application/pdf" onChange={handleFileChange} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 cursor-pointer" required={!selectedDocument.id} />
                  {selectedFile && <div className="mt-2 text-xs text-gray-600">Novo arquivo: {selectedFile.name}</div>}
                  {!selectedFile && selectedDocument.file_url && <div className="mt-2 text-xs text-gray-600">Arquivo atual: {selectedDocument.file_url.split('/').pop()}</div>}
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="ghost" onClick={handleCloseMenu}>Cancelar</Button>
                  <Button type="submit" disabled={isSubmitting} className="bg-teal-600 hover:bg-teal-700 text-white">{isSubmitting ? 'Salvando...' : 'Salvar'}</Button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </section>
  );
};