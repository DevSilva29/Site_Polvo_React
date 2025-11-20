import { Card, CardContent } from "../../../../../components/ui/card";

export const Sector1 = (): JSX.Element => {
  const contributionWays = [
    "Seja um voluntário: doe seu tempo, carinho e talento;",
    "Contribua com doações em dinheiro ou materiais;",
    "Apoie nosso trabalho com patrocínio institucional;",
    "Doe itens essenciais como alimentos (pão, leite, bolachas, café), livros, papel sulfite, materiais de artesanato, cartuchos de tinta, entre outros.",
  ];

  return (
    <section className="w-auto h-auto py-16 bg-[url(/background-img-2.png)] bg-cover bg-center">
      <Card className="max-w-[879px] mx-auto bg-[#ffffffb2] rounded-[10px]">
        <CardContent className="p-16">
          <div className="space-y-16">
            
            <div className="space-y-16">
              <p className="font-light text-2xl text-center text-black leading-9 font-['IBM_Plex_Sans',Helvetica]">
                O Centro de Convivência da Terceira Idade Polvo conta com a sua
                solidariedade para continuar promovendo atividades que valorizam,
                acolhem e transformam a vida dos nossos idosos.
              </p>

              <div className="font-normal text-base text-black leading-[27.2px] font-['IBM_Plex_Sans',Helvetica]">
                {contributionWays.map((way, index) => (
                  <p key={index}>
                    {way}
                    <br />
                  </p>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border border-gray-300 p-6 bg-white">
              
              {/* Depósito / Transferência */}
              <div className="text-center space-y-4 border-r md:border-r border-gray-400 pr-4 flex flex-col justify-center">
                <p className="text-lg font-bold">
                  DEPÓSITO<br />OU<br />TRANSFERÊNCIA
                </p>
                <p className="text-base">BANCO: ITAÚ</p>
                <p className="text-base">AGÊNCIA: 2931</p>
                <p className="text-base">CONTA CORRENTE: 01699-8</p>
              </div>

              {/* Em Dinheiro */}
              <div className="text-center space-y-4 border-r md:border-r border-gray-400 px-4 flex flex-col justify-center">
                <p className="text-lg font-bold">EM DINHEIRO</p>
                <p className="text-base">
                  PROCURAR<br />TESOURARIA
                </p>
              </div>

              {/* QR Code */}
              <div className="text-center pl-4 flex flex-col items-center">
                <p className="text-lg font-bold mb-2">QRCODE</p>
                <img
                  className="w-[150px] h-[150px] object-cover"
                  alt="QR Code"
                  src="/frame-1.png"
                />
                <p className="font-bold text-base mt-4">PIX:</p>
                <p className="text-base">12 992162503</p>
              </div>

            </div>

          </div>
        </CardContent>
      </Card>
    </section>
  );
};
