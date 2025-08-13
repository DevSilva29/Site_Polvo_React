import { Card, CardContent } from "../../../../../components/ui/card";

export const Sector1 = (): JSX.Element => {
  const bankInfo = [
    "Banco ABC",
    "Agencia: 1234",
    "Conta: 1234567-8",
    "",
    "Pix: 12 12345-6789",
    "ccti.polvo@gmail.com",
  ];

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
                solidariedade para continuar promovendo atividades que
                valorizam, acolhem e transformam a vida dos nossos idosos.
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

            <div className="flex flex-wrap justify-between items-end gap-8">
              <div className="font-normal text-xl text-black font-['IBM_Plex_Sans',Helvetica] space-y-1">
                {bankInfo.map((line, index) => (
                  <p key={index}>{line}</p>
                ))}
              </div>

              <div className="relative w-[170px]">
                <div className="bg-white p-5 text-center">
                  <p className="font-normal text-base text-black font-['IBM_Plex_Sans',Helvetica]">
                    Pague com QR Code Aqui!
                  </p>
                </div>
                <img
                  className="w-full h-[170px] object-cover"
                  alt="QR Code para pagamento"
                  src="/frame-1.png"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};
