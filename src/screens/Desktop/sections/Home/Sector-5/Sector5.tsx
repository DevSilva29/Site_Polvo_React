import { useState, useEffect } from "react";
import api from "../../../../../api/axiosInstance";
import { FileDownIcon } from "lucide-react";
import { Card, CardContent } from "../../../../../components/ui/card";

// Interface para um Documento, conforme a API retorna
interface DocumentRequest {
  id: number;
  title: string;
  number: string;
  date: string;
  type: string;
  file_url: string; // URL para download
}

export const Sector5 = (): JSX.Element => {
  const [documents, setDocuments] = useState<DocumentRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.get('/documentos')
      .then(response => {
        // A resposta da nossa API de Documentos vem dentro de um "pacote" data
        setDocuments(response.data.data);
      })
      .catch(error => {
        console.error("Erro ao buscar documentos:", error);
        setDocuments([]); // Garante que seja um array vazio em caso de erro
      })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <section className="relative w-full h-auto bg-[url('/background-img-2.png')] bg-cover bg-center py-16 sm:py-24">
      <div className="relative w-[90%] max-w-[1132px] mx-auto flex flex-col items-center space-y-12">
        <div className="w-full max-w-[636px] min-h-[115px] bg-[#ffffffbf] rounded-[15px] flex items-center justify-center p-4">
          <h1 className="font-bold text-black text-4xl md:text-5xl text-center leading-tight">
            Quadro de Ofícios e Atas
          </h1>
        </div>

        <div className="w-full h-auto bg-[#ffffff80] rounded-[15px] p-6">
          <div className="w-full max-w-[1004px] mx-auto space-y-8 min-h-[300px] flex flex-col justify-center">
            {isLoading ? (
              <p className="text-center text-gray-700">A carregar documentos...</p>
            ) : documents.length > 0 ? (
              // Se NÃO está a carregar E a lista TEM itens, mostre os documentos
              documents.map((doc) => (
                <a 
                  key={doc.id}
                  href={doc.file_url}
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="block hover:scale-[1.01] transition-transform duration-300"
                >
                  <Card className="w-full h-40 shadow-[0px_3px_4px_#00000040] bg-white cursor-pointer">
                    <CardContent className="p-0 h-full relative">
                      <div className="absolute top-6 left-5 sm:left-8 font-semibold text-black text-lg">
                        {doc.title}
                      </div>
                      <div className="absolute top-[66px] left-6 sm:left-9 font-normal text-black text-sm">
                        Número: {doc.number} <br />
                        Data: {doc.date} <br />
                        Tipo: {doc.type}
                      </div>
                      <div className="absolute top-1/2 -translate-y-1/2 right-8 sm:right-12">
                        <FileDownIcon className="w-16 h-auto sm:w-[68px] text-gray-600" />
                      </div>
                    </CardContent>
                  </Card>
                </a>
              ))
            ) : (
              // Se NÃO está a carregar E a lista está VAZIA, mostre esta mensagem
              <div className="text-center py-20 text-gray-500">
                <p className="text-xl font-medium">Nenhum documento publicado no momento.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};