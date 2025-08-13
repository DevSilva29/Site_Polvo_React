import { useState, useEffect } from "react";
import api from "../../../../../api/axiosInstance";
import { Card, CardContent } from "../../../../../components/ui/card";

export const Sector1 = (): JSX.Element => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    api.get("/cronograma")
      .then(response => {
        setPdfUrl(response.data.pdf_url);
      })
      .catch(err => {
        console.error("Erro ao buscar cronograma:", err);
        setError("Não foi possível carregar o cronograma. Tente novamente mais tarde.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <section className="relative w-full py-16">
      <div className="relative w-full py-16">
        <img
          className="absolute inset-0 w-full h-full object-cover"
          alt="Background"
          src="/background-img-2.png"
        />
        <Card className="relative py-[px] mx-auto max-w-[1185px] bg-white/70 rounded-[10px]">
          <CardContent>
            <div className="py-4">
              <h2 className="text-center mt-[57px] font-semibold text-5xl text-black">
                Cronograma de Atividades
              </h2>
            </div>
            <div className="w-full flex justify-center items-center min-h-[850px]">
              {isLoading && <p>Carregando cronograma...</p>}
              {error && <p className="text-red-500">{error}</p>}
              {pdfUrl && (
                <iframe
                  src={pdfUrl}
                  width="1000"
                  height="850"
                  className="mt-[32px] rounded-xl shadow-lg"
                  title="Cronograma de Atividades"
                ></iframe>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};