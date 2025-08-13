import { title } from "framer-motion/client";
import { Button } from "../../../../../components/ui/button";
import { Card, CardContent } from "../../../../../components/ui/card";
import { Link } from "react-router-dom";

export const Sector1 = (): JSX.Element => {
  const leftColumnActions = [
    { title: "Editar Patrocinadores", path: "/d_patrocinadores" },
    { title: "Editar Eventos", path: "/d_eventos" },
    { title: "Editar Ofício e Atas", path: "/d_documentos" },
    { title: "Editar Cronograma", path: "/d_cronograma" },
    { title: "Editar Depoimentos", path: "/d_depoimentos"},
    { title: "Editar Atividades", path: "/d_atividades"},
  ];

  const rightColumnActions = [
    { title: "Editar Avisos", path: "/d_avisos" },
    { title: "Editar Sobre", path: "/d_sobre" },
    { title: "Ver Mensagens", path: "/d_mensagens" },
    { title: "Editar Mídia", path: "/d_midias" },
    { title: "Editar Galeria de Fotos", path: "/d_galeria"}
  ];

  return (
    <section className="w-full py-16">
      <div className="relative w-full">
        <img
          className="w-full h-[960px] object-cover"
          alt="Background"
          src="/background-img-2.png"
        />
        {/* --- CORREÇÃO AQUI --- */}
        <Card className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl bg-white/70 rounded-[10px] p-8 md:p-16">
          <CardContent className="flex flex-col items-center">
            <h1 className="text-4xl font-semibold text-black text-center mb-16 font-sans">
              Painel de Controle
            </h1>
            
            {/* Adicionado 'w-full' e espaçamento responsivo */}
            <div className="flex flex-col md:flex-row justify-center items-center md:items-start gap-8 md:gap-x-24 w-full">
              {/* Coluna da Esquerda */}
              <div className="flex flex-col gap-8">
                {leftColumnActions.map((action, index) => (
                  <Link to={action.path} key={`left-${index}`}>
                    <Button className="w-[211px] h-[54px] bg-[#beecff] hover:bg-[#a5e0f7] text-black font-light text-lg rounded-[10px]">
                      {action.title}
                    </Button>
                  </Link>
                ))}
              </div>

              {/* Coluna da Direita */}
              <div className="flex flex-col gap-8">
                {rightColumnActions.map((action, index) => (
                  <Link to={action.path} key={`right-${index}`}>
                    <Button className="w-[211px] h-[54px] bg-[#beecff] hover:bg-[#a5e0f7] text-black font-light text-lg rounded-[10px]">
                      {action.title}
                    </Button>
                  </Link>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};