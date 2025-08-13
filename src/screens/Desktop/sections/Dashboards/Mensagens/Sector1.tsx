import { ArrowLeftIcon, ChevronLeftIcon, ChevronRightIcon, EyeIcon, Mail, Trash2Icon, X } from "lucide-react";
import React, { useState, useEffect } from "react";
import api from "../../../../../api/axiosInstance";
import { Button } from "../../../../../components/ui/button";
import { Card, CardContent } from "../../../../../components/ui/card";
import { Link } from "react-router-dom";

// Interface para os dados da mensagem, conforme a nossa API retorna
interface ContactMessage {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  userType: 'Empresa' | 'Cliente';
  message: string;
  date: string;
  read: boolean;
}

// Componente para o selo de tipo de utilizador
const UserTypeBadge = ({ type }: { type: ContactMessage['userType'] }) => {
  const isCompany = type === 'Empresa';
  const bgColor = isCompany ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800';
  const Icon = isCompany ? '🏢' : '👤'; // Usando emojis para simplicidade

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium ${bgColor}`}>
      {Icon} {type}
    </span>
  );
};


export const Sector1 = (): JSX.Element => {
  // --- ESTADOS DO COMPONENTE ---
  const [allMessages, setAllMessages] = useState<ContactMessage[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // --- LÓGICA DE API ---
  const fetchMessages = async () => {
    try {
      const response = await api.get('/mensagens');
      setAllMessages(response.data.data);
    } catch (error) {
      console.error("Erro ao buscar mensagens:", error);
      setAllMessages([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleDeleteMessage = async (id: number) => {
    const messageToDelete = allMessages.find(m => m.id === id);
    if (!messageToDelete) return;

    if (window.confirm(`Tem certeza que deseja excluir a mensagem de "${messageToDelete.firstName} ${messageToDelete.lastName}"?`)) {
      try {
        await api.delete(`/mensagens/${id}`);
        fetchMessages(); // Atualiza a lista após apagar
      } catch (error) {
        console.error("Erro ao deletar mensagem:", error);
        alert("Não foi possível excluir a mensagem.");
      }
    }
  };

  const handleViewMessage = async (message: ContactMessage) => {
    setSelectedMessage(message);
    setIsModalOpen(true);
    // Se a mensagem ainda não foi lida, chama a API para marcar como lida
    if (!message.read) {
      try {
        // Atualiza a UI otimisticamente para uma resposta mais rápida
        setAllMessages(prev => prev.map(m => m.id === message.id ? { ...m, read: true } : m));
        await api.put(`/mensagens/${message.id}/read`);
      } catch (error) {
        console.error("Erro ao marcar mensagem como lida:", error);
        // Se der erro, busca a lista real do servidor para re-sincronizar
        fetchMessages();
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMessage(null);
  };

  // --- LÓGICA DE PAGINAÇÃO ---
  const [currentPage, setCurrentPage] = useState(0);
  const messagesPerPage = 4;
  const totalPages = Math.ceil(allMessages.length / messagesPerPage);
  const currentMessages = allMessages.slice(currentPage * messagesPerPage, (currentPage + 1) * messagesPerPage);
  const handlePrevious = () => { if (currentPage > 0) setCurrentPage(c => c - 1); };
  const handleNext = () => { if (currentPage < totalPages - 1) setCurrentPage(c => c + 1); };

  if (isLoading) return <div className="p-48 text-center">A carregar mensagens...</div>;

  return (
    <section className="w-full py-16 relative bg-[url(/background-img-2.png)] bg-cover bg-center">
      <Card className="mx-auto max-w-6xl bg-white/70 rounded-[10px] z-10 relative">
        <CardContent className="p-16">
          <div className="flex flex-col items-center">
            <div className="flex items-center w-full mb-12">
              <Link to={"/d_menu"} className="mr-4 h-10 w-10 flex items-center justify-center hover:bg-gray-200 rounded-full transition-colors" aria-label="Voltar">
                <ArrowLeftIcon className="h-6 w-6 text-gray-800" />
              </Link>
              <h2 className="text-4xl font-semibold text-black font-['Inter',Helvetica]">Caixa de Entrada</h2>
            </div>
            
            <div className="w-full min-h-[350px] overflow-hidden">
              <div className="w-full space-y-4">
                {currentMessages.length > 0 ? currentMessages.map((message) => (
                  <div key={message.id} className={`w-full rounded-[10px] flex items-center justify-between p-4 transition-colors duration-300 ${message.read ? 'bg-gray-200/70' : 'bg-sky-100/70 hover:bg-sky-200/80'}`}>
                    <div className="flex items-center gap-4">
                      <Mail className={`h-6 w-6 flex-shrink-0 ${message.read ? 'text-gray-400' : 'text-gray-600'}`} />
                      <div className="flex flex-col md:flex-row md:items-center md:gap-3">
                        <span className={`font-['IBM_Plex_Sans',Helvetica] text-black text-lg ${message.read ? 'font-normal' : 'font-semibold'}`}>
                          {`${message.firstName} ${message.lastName}`}
                        </span>
                        <UserTypeBadge type={message.userType} />
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-500 hidden md:block">{message.date}</span>
                      <Button variant="ghost" size="icon" className="h-[35px] w-[35px] hover:bg-blue-100 rounded-full" onClick={() => handleViewMessage(message)}>
                        <EyeIcon className="h-5 w-5 text-gray-700" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-[35px] w-[35px] hover:bg-red-100 rounded-full" onClick={() => handleDeleteMessage(message.id)}>
                        <Trash2Icon className="h-5 w-5 text-gray-700" />
                      </Button>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-20 text-gray-500">
                    <p>Nenhuma mensagem na sua caixa de entrada.</p>
                  </div>
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

      {isModalOpen && selectedMessage && (
        <>
          <div className="fixed inset-0 bg-black/30 z-40 backdrop-blur-sm" onClick={handleCloseModal} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl border p-6 w-[600px] max-w-full">
              <div className="flex items-center justify-between mb-4 pb-4 border-b">
                <h3 className="text-xl font-semibold text-gray-900">Detalhes da Mensagem</h3>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-gray-200" onClick={handleCloseModal}><X className="h-5 w-5 text-gray-600" /></Button>
              </div>
              <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-500">Nome Completo</label>
                    <p className="font-semibold text-gray-800">{`${selectedMessage.firstName} ${selectedMessage.lastName}`}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Tipo</label>
                    <div className="mt-1"><UserTypeBadge type={selectedMessage.userType} /></div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Email</label>
                    <p className="font-semibold text-gray-800">{selectedMessage.email}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Telefone</label>
                    <p className="font-semibold text-gray-800">{selectedMessage.phone}</p>
                  </div>
                  <div className="col-span-1 md:col-span-2">
                    <label className="text-sm text-gray-500">Endereço</label>
                    <p className="font-semibold text-gray-800">{selectedMessage.address}</p>
                  </div>
                </div>
                <div className="border-t pt-4">
                  <label className="text-sm text-gray-500">Mensagem</label>
                  <p className="mt-1 text-gray-800 whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>
                <p className="text-xs text-gray-400 text-right pt-2">Recebido em: {selectedMessage.date}</p>
              </div>
              <div className="flex justify-end pt-6 mt-4 border-t">
                <Button onClick={handleCloseModal} className="px-4 py-2 hover:bg-gray-100">Fechar</Button>
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
};