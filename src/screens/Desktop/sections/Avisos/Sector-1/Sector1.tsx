import { useState, useEffect } from "react";
import api from "../../../../../api/axiosInstance";
import { Button } from "../../../../../components/ui/button";
import { Card, CardContent } from "../../../../../components/ui/card";

interface Aviso {
  avisos_id: number;
  avisos_title: string;
  avisos_description: string;
}

export const Sector1 = (): JSX.Element => {
  const [avisos, setAvisos] = useState<Aviso[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    api.get("/avisos")
      .then(response => {
        setAvisos(response.data);
        setCarregando(false);
      })
      .catch(error => {
        console.error("Erro ao buscar os avisos:", error);
        setCarregando(false);
      });
  }, []);

  return (
    <section className="relative w-full bg-[url(/background-img-3.png)] bg-cover bg-center py-48">
      <div className="mx-auto max-w-[499px] bg-[#ffffffbf] rounded-[15px] mb-8">
        <h1 className="py-6 font-[Inter,Helvetica] font-bold text-black text-5xl text-center leading-[72px]">
          Quadro de Avisos
        </h1>
      </div>

      <div className="mx-auto max-w-[1132px] bg-[#ffffff80] rounded-[15px] p-9">
        <div className="flex flex-col gap-8">
          {carregando ? (
            <p className="text-center font-bold">Carregando avisos...</p>
          ) : avisos.length > 0 ? (
            avisos.map((aviso) => (
              <Card
                key={aviso.avisos_id}
                className="bg-white rounded-[10px] shadow-[0px_3px_4px_#00000040]"
              >
                <CardContent className="p-0">
                  <div className="flex items-start p-8">
                    <div className="flex flex-col">
                      <h2 className="font-[Inter,Helvetica] font-semibold text-black text-2xl mb-3">
                        {aviso.avisos_title}
                      </h2>
                      <p className="font-[Inter,Helvetica] font-normal text-black text-base mb-3">
                        {aviso.avisos_description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-20 text-gray-500">
              <p>No momento, não avisos há publicados.</p>
            </div>
          )}
          <div className="flex flex-col md:flex-row justify-center gap-6 max-w-xl mx-auto">
            <a href="/cronograma">
              <Button
                className="h-[66px] bg-[#3661a0] text-white rounded-lg shadow-button-shadow font-small-text"
                size="lg"
              >
                Explorar Atividades
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};