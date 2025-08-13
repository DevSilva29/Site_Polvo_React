import { FileIcon, X } from "lucide-react";
import { useState, FormEvent, ChangeEvent } from "react";
import { Button } from "../../../../../components/ui/button";
import { Card, CardContent } from "../../../../../components/ui/card";
import api from "../../../../../api/axiosInstance";
import { isAxiosError } from "axios";


export const Sector1 = (): JSX.Element => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [status, setStatus] = useState({
    enviando: false,
    sucesso: '',
    erro: '',
  });

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedFile) {
      setStatus({ ...status, erro: 'Por favor, selecione um arquivo PDF primeiro.' });
      return;
    }

    setStatus({ enviando: true, sucesso: '', erro: '' });
    const formData = new FormData();
    formData.append('pdf_file', selectedFile);

    try {
      const response = await api.post('/cronograma', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setStatus({ enviando: false, sucesso: response.data.message, erro: '' });
      setTimeout(() => {
        setIsModalOpen(false);
        setSelectedFile(null);
        setStatus({ enviando: false, sucesso: '', erro: '' });
      }, 2000);

    } catch (error) {
      let errorMessage = "Falha no upload. Tente novamente.";
      if (isAxiosError(error) && error.response) {
          const validationErrors = error.response.data.errors;
          if (validationErrors?.pdf_file) {
              errorMessage = validationErrors.pdf_file[0]; // Pega a primeira mensagem de erro específica do arquivo
          }
      }
      setStatus({ enviando: false, sucesso: '', erro: errorMessage });
      console.error("Erro no upload:", error);
    }
  };


  return (
    <main className="relative w-full min-h-screen bg-white">
      <div className="relative w-full h-[960px]">
        <img
          className="absolute w-full h-full object-cover"
          alt="Background img"
          src="/background-img-2.png"
        />

        <div className="absolute top-[121px] left-1/2 transform -translate-x-1/2 w-[1185px] h-[716px] bg-[#ffffffb2] rounded-[10px] flex items-center justify-center">
          <Card className="w-[382px] bg-transparent border-none shadow-none">
            <CardContent className="flex flex-col items-center justify-center space-y-12 p-0">
              <h2 className="font-semibold text-[40px] text-black text-center">
                Cronograma
              </h2>

              <div className="flex items-center gap-4">
                <FileIcon className="w-12 h-12" />
                <span className="font-light text-[#00c0eb] text-[32px] text-center">
                  Cronograma Atual
                </span>
              </div>

              <Button
                onClick={() => setIsModalOpen(true)}
                className="w-[258px] h-[66px] mt-32 bg-[#beecff] text-[#3661a0] rounded-lg shadow-[inset_0px_1px_2px_#0000000d] hover:bg-[#a5e0ff]"
              >
                Atualizar PDF
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {isModalOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/30 z-40 backdrop-blur-sm"
            onClick={() => !status.enviando && setIsModalOpen(false)} // Não deixa fechar enquanto envia
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl border p-6 w-full max-w-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Atualizar Cronograma (PDF)
                </h3>
                <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-gray-100" onClick={() => !status.enviando && setIsModalOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="cronograma" className="block text-sm font-medium text-gray-700 mb-1">
                    Selecione um novo arquivo PDF
                  </label>
                  <input
                    id="cronograma"
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  {selectedFile && <p className="text-xs text-gray-500 mt-2">Arquivo selecionado: {selectedFile.name}</p>}
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="ghost" disabled={status.enviando} onClick={() => setIsModalOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={!selectedFile || status.enviando} className="bg-blue-600 hover:bg-blue-700 text-white">
                    {status.enviando ? 'Enviando...' : 'Enviar PDF'}
                  </Button>
                </div>
                {status.sucesso && <p className="text-green-600 mt-2 text-sm">{status.sucesso}</p>}
                {status.erro && <p className="text-red-600 mt-2 text-sm">{status.erro}</p>}
              </form>
            </div>
          </div>
        </>
      )}
    </main>
  );
};