import { Card, CardContent } from "../../../../../components/ui/card";

const featureCards = [
  {
    id: 1,
    icon: "/info-solid-1.svg",
    iconAlt: "Info solid",
    title: "Conheça o\nPolvo!",
    link: "/sobre"
  },
  {
    id: 2,
    icon: "/headset-solid-1.svg",
    iconAlt: "Headset solid",
    title: "Atendimento",
    link: "/contato"
  },
  {
    id: 3,
    icon: "/hand-holding-dollar-solid-1.svg",
    iconAlt: "Hand holding dollar",
    title: "Colabore!",
    link: "/contribua"
  },
  {
    id: 4,
    icon: "/calendar-days-regular-1.svg",
    iconAlt: "Calendar days",
    title: "Cronograma\nAtividades",
    link: "/cronograma"
  },
];

export const Sector1 = (): JSX.Element => {
  return (
    <section className="w-full bg-[url(/background-img-2.png)] bg-cover bg-center py-16 md:py-32">
      <div className="container mx-auto px-4">
        <Card className="max-w-[1135px] mx-auto bg-[#e8f9ffd9] rounded-[15px] p-6 md:p-10">
          <h1 className="text-center text-4xl md:text-[64px] font-semibold font-['Inter',Helvetica] text-black mb-10 md:mb-20">
            Bem Vindo!
          </h1>
  
          <CardContent className="p-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 justify-items-center">
              {featureCards.map((card) => (
                <div
                  key={card.id}
                  className="flex flex-col items-center w-full max-w-[230px]"
                >
                  <a href={card.link}>
                    <div className="relative w-36 h-36 sm:w-44 sm:h-44 lg:w-[230px] lg:h-[230px] bg-white rounded-full flex items-center justify-center transition-transform duration-300 hover:scale-105">
                      <img
                        className="h-16 sm:h-20 lg:h-24 w-auto"
                        alt={card.iconAlt}
                        src={card.icon}
                      />
                    </div>
                  </a>
                  <div className="mt-5 font-medium font-['IBM_Plex_Sans',Helvetica] text-2xl md:text-[32px] text-center text-black leading-[1.5] md:leading-[48px] whitespace-pre-line">
                    {card.title}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )};