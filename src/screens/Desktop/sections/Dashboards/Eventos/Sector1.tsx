import { ArrowLeftIcon, ChevronLeftIcon, ChevronRightIcon, PencilIcon, Trash2Icon, X, ImagePlus as ImageIcon, ImagePlus } from "lucide-react";
import React, { useState, useEffect, FormEvent, ChangeEvent } from "react";
import api from "../../../../../api/axiosInstance";
import { Button } from "../../../../../components/ui/button";
import { Card, CardContent } from "../../../../../components/ui/card";
import { Link } from "react-router-dom";
import { Input } from "../../../../../components/ui/input";
import { Textarea } from "../../../../../components/ui/textarea";

// Interface para um Evento, como a API retorna
interface Event {
  id: number;
  title: string;
  description: string;
  date: string; // formato DD/MM/YYYY
  photo_url: string | null;
}

// Interface para os dados do formulário
interface EventFormData {
  title: string;
  description: string;
  date: string; // formato YYYY-MM-DD
}

// Função para formatar a data para o input
const formatDisplayDateToInput = (dateString: string): string => {
  if (!dateString || !dateString.includes('/')) return '';
  const [day, month, year] = dateString.split('/');
  return `${year}-${month}-${day}`;
};

export const Sector1 = (): JSX.Element => {
  // --- ESTADOS DO COMPONENTE ---
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Partial<Event> | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isFloatingMenuOpen, setIsFloatingMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formKey, setFormKey] = useState(Date.now()); // Chave para resetar o formulário

  // --- LÓGICA DE API ---
  const fetchEvents = async () => {
    try {
      const response = await api.get('/eventos');
      setAllEvents(response.data.data);
    } catch (error) {
      console.error("Erro ao buscar eventos:", error);
      setAllEvents([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir este evento?")) {
      try {
        await api.delete(`/eventos/${id}`);
        fetchEvents();
      } catch (error) {
        console.error("Erro ao deletar evento:", error);
        alert('Não foi possível excluir o evento.');
      }
    }
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedEvent) return;
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('eventos_title', selectedEvent.title || '');
    formData.append('eventos_description', selectedEvent.description || '');
    formData.append('eventos_date', selectedEvent.date || '');
    
    if (selectedFile) {
      formData.append('eventos_photo', selectedFile);
    }

    try {
      if (selectedEvent.id) { // ATUALIZAR
        formData.append('_method', 'PUT');
        await api.post(`/eventos/${selectedEvent.id}`, formData);
      } else { // CRIAR
        if (!selectedFile) {
          alert('Por favor, adicione uma foto para o novo evento.');
          setIsSubmitting(false);
          return;
        }
        await api.post('/eventos', formData);
      }
      setIsFloatingMenuOpen(false);
      fetchEvents();
    } catch (error) {
      console.error("Erro ao salvar evento:", error);
      alert('Erro ao salvar. Verifique os campos e tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- HANDLERS DA UI ---
  const handleEdit = (event: Event) => {
    setSelectedEvent({ ...event, date: formatDisplayDateToInput(event.date) });
    setFormKey(Date.now());
    setIsFloatingMenuOpen(true);
  };
  
  const handleNew = () => {
    setSelectedEvent({ id: 0, title: "", description: "", date: "" });
    setFormKey(Date.now());
    setIsFloatingMenuOpen(true);
  };

  const handleInputChange = (field: keyof Omit<Event, 'id' | 'photo_url'>, value: string) => {
    if (selectedEvent) {
      setSelectedEvent({ ...selectedEvent, [field]: value });
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };
  
  const handleCloseMenu = () => {
    setIsFloatingMenuOpen(false);
    setSelectedEvent(null);
    setSelectedFile(null);
  };

  // Lógica de paginação
  const [currentPage, setCurrentPage] = useState(0);
  const eventsPerPage = 4;
  const totalPages = Math.ceil(allEvents.length / eventsPerPage);
  const currentEvents = allEvents.slice(currentPage * eventsPerPage, (currentPage + 1) * eventsPerPage);
  const handlePrevious = () => { if (currentPage > 0) setCurrentPage(c => c - 1); };
  const handleNext = () => { if (currentPage < totalPages - 1) setCurrentPage(c => c + 1); };

  if (isLoading) return <div className="p-48 text-center">A carregar eventos...</div>;

  return (
    <section className="w-full py-16 relative bg-[url(/background-img-2.png)] bg-cover bg-center min-h-screen">
      <Card className="mx-auto max-w-6xl bg-white/70 rounded-[10px] z-10 relative">
        <CardContent className="p-16">
          <div className="flex flex-col items-center">
            <div className="flex items-center w-full mb-12">
              <Link to={"/d_menu"} className="mr-4 h-10 w-10 flex items-center justify-center hover:bg-gray-200 rounded-full transition-colors" aria-label="Voltar">
                <ArrowLeftIcon className="h-6 w-6 text-gray-800" />
              </Link>
              <h2 className="text-4xl font-semibold text-black font-['Inter',Helvetica]">Gerir Eventos</h2>
            </div>

            <div className="w-full">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white mb-8" onClick={handleNew}>
                    <ImagePlus className="mr-2 h-5 w-5" />
                    Novo Evento
                </Button>
            </div>
            
            <div className="w-full overflow-hidden min-h-[300px]">
              <div className="w-full space-y-4">
                {currentEvents.length > 0 ? currentEvents.map((event) => (
                  <div key={event.id} className="w-full h-auto bg-[#beebffb2] rounded-[10px] flex items-center justify-between p-4">
                    <div className="flex items-center gap-4">
                        {event.photo_url ? (
                            <img src={event.photo_url} alt={`Foto do evento ${event.title}`} className="w-[80px] h-[60px] object-cover rounded-md bg-white/50" />
                        ) : (
                            <div className="w-[80px] h-[60px] bg-gray-200 rounded-md flex items-center justify-center"><ImageIcon className="h-8 w-8 text-gray-400"/></div>
                        )}
                      <div className="flex flex-col">
                        <span className="font-['IBM_Plex_Sans',Helvetica] font-semibold text-black text-lg">{event.title}</span>
                        <span className="text-sm text-gray-700">{event.date}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button variant="ghost" size="icon" className="h-[35px] w-[35px] hover:bg-blue-100 rounded-full" onClick={() => handleEdit(event)}><PencilIcon className="h-5 w-5 text-gray-700" /></Button>
                      <Button variant="ghost" size="icon" className="h-[35px] w-[35px] hover:bg-red-100 rounded-full" onClick={() => handleDelete(event.id)}><Trash2Icon className="h-5 w-5 text-gray-700" /></Button>
                    </div>
                  </div>
                )) : (
                    <div className="text-center py-20 text-gray-500"><p>Nenhum evento encontrado. Clique em "Novo Evento" para começar.</p></div>
                )}
              </div>
            </div>
            
            <div className="flex items-center justify-end w-full mt-8">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">{totalPages > 0 ? currentPage + 1 : 0} de {totalPages}</span>
                <Button variant="ghost" size="icon" className={`h-[45px] w-[33px]`} onClick={handlePrevious} disabled={currentPage === 0}><ChevronLeftIcon className="h-6 w-6" /></Button>
                <Button variant="ghost" size="icon" className={`h-[45px] w-[33px]`} onClick={handleNext} disabled={currentPage >= totalPages - 1}><ChevronRightIcon className="h-6 w-6" /></Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {isFloatingMenuOpen && selectedEvent && (
        <>
          <div className="fixed inset-0 bg-black/20 z-40 backdrop-blur-sm" onClick={handleCloseMenu} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl border p-6 w-full max-w-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{selectedEvent.id ? "Editar Evento" : "Adicionar Novo Evento"}</h3>
                <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-gray-100" onClick={handleCloseMenu}><X className="h-4 w-4" /></Button>
              </div>
              <form key={formKey} onSubmit={handleSave} className="space-y-4">
                <div><label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Título do Evento</label><Input id="title" type="text" value={selectedEvent.title || ''} onChange={(e) => handleInputChange('title', e.target.value)} className="w-full p-2 border rounded-md" required/></div>
                <div><label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Data</label><Input id="date" type="date" value={selectedEvent.date || ''} onChange={(e) => handleInputChange('date', e.target.value)} className="w-full p-2 border rounded-md" required/></div>
                <div><label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Descrição</label><Textarea id="description" value={selectedEvent.description || ''} onChange={(e) => handleInputChange('description', e.target.value)} rows={4} className="w-full p-2 border rounded-md" required/></div>
                <div>
                    <label htmlFor="photo" className="block text-sm font-medium text-gray-700 mb-1">Foto do Evento</label>
                    <Input id="photo" type="file" accept="image/*" onChange={handleFileChange} className="w-full text-sm" required={!selectedEvent.id} />
                    {selectedEvent.photo_url && !selectedFile && <img src={selectedEvent.photo_url} alt="Pré-visualização" className="mt-2 h-24 w-auto rounded-md border p-1" />}
                </div>
                <div className="flex justify-end gap-3 pt-4"><Button type="button" variant="ghost" onClick={handleCloseMenu}>Cancelar</Button><Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white">{isSubmitting ? "A guardar..." : (selectedEvent.id ? "Salvar Alterações" : "Criar Evento")}</Button></div>
              </form>
            </div>
          </div>
        </>
      )}
    </section>
  );
};