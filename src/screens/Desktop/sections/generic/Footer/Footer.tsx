import { ClockIcon, MailIcon, PhoneIcon } from "lucide-react";

export const Footer = (): JSX.Element => {
  const contactInfo = {
    phone: "(12) 3892 - 2747",
    email: "ccti.polvo@gmail.com",
    hours: "08:00 às 21:00\nSegunda à Sexta",
    address:
      "Estamos localizados na\nRua Eduardo Cássio, 220 - Porto Grande\nSão Sebastião/SP\nCEP: 03664-040",
    bankInfo:
      "Banco ABC\nAgencia: 1234\nConta: 1234567-8\n\nPix: 12 12345-6789\nccti.polvo@gmail.com",
    social: {
      instagram: "@ccti.polvo",
    },
  };

  const openSocial = (type: 'instagram' | 'facebook') => {
    const profiles = {
      instagram: { url: 'https://instagram.com/ccti.polvo' },
      facebook: { url: 'https://www.facebook.com/cctipolvo2013' },
    };
    window.open(profiles[type].url, "_blank", "noopener,noreferrer");
  }

  return (
    <footer className="w-full bg-transparent">
      {/* Secção Superior - Contatos */}
      <div className="w-full bg-[#3d566d] py-10">
        <div className="container mx-auto px-4 md:px-8">
          <h2 className="text-center text-white text-3xl md:text-[32px] font-normal mb-10">
            Atendimento
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-y-10 gap-x-8 text-white text-center">
            <div className="flex flex-col items-center">
              <h3 className="text-[26px] font-normal mb-6">Nossos Contatos</h3>
              <div className="flex items-center mb-4">
                <PhoneIcon className="w-8 h-8 text-white" />
                <span className="ml-3 text-lg">{contactInfo.phone}</span>
              </div>
              <a href="https://api.whatsapp.com/send?phone=12992162503" target="_blank" rel="noopener noreferrer" className="transition-transform hover:scale-105">
                <img className="w-[183px] h-auto" alt="Whatsapp" src="/whatsapp.png" />
              </a>
            </div>
            <div className="flex flex-col items-center">
              <h3 className="text-[26px] font-normal mb-6">Nosso Email</h3>
              <div className="flex items-center">
                <MailIcon className="w-8 h-8 text-white" />
                <span className="ml-3 text-lg break-all">{contactInfo.email}</span>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <h3 className="text-[26px] font-normal mb-6">Horários</h3>
              <div className="flex items-center">
                <ClockIcon className="w-8 h-8 text-white" />
                <span className="ml-3 text-lg whitespace-pre-line">{contactInfo.hours}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Secção Inferior - Doações, Endereço e Redes Sociais */}
      <div className="w-full bg-[#454545] py-14">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-y-12 gap-x-8 text-white text-center">
            
            <div>
              <h3 className="text-3xl md:text-4xl font-normal mb-6">Doações</h3>
              {/* --- A CORREÇÃO FINAL ESTÁ AQUI --- */}
              {/* Mudamos para xl:flex-row para dar mais espaço */}
              <div className="flex flex-col xl:flex-row justify-center items-center xl:items-start gap-6">
                <div className="text-lg md:text-xl whitespace-pre-line text-center xl:text-left">
                  {contactInfo.bankInfo}
                </div>
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className="bg-white p-2 w-[175px]">
                    <p className="text-black text-base text-center">Pague com QR Code Aqui!</p>
                  </div>
                  <img className="w-[175px] h-[175px] object-cover" alt="QR Code" src="/frame-1.png" />
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <h3 className="text-3xl md:text-4xl font-normal mb-6">Venha nos Visitar!</h3>
              <p className="text-base whitespace-pre-line">{contactInfo.address}</p>
            </div>

            <div className="flex flex-col items-center">
              <h3 className="text-3xl md:text-4xl font-normal mb-6">Redes Sociais</h3>
              <div className="flex flex-col sm:flex-row lg:flex-col items-center justify-center gap-4">
                <button onClick={() => openSocial('instagram')} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                  <img className="w-11 h-11" alt="Instagram" src="/instagram.svg" />
                  <span className="text-white text-base">{contactInfo.social.instagram}</span>
                </button>
                <button onClick={() => openSocial('facebook')} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                  <img className="w-11 h-11" alt="Facebook" src="/facebook.svg" />
                  <span className="text-white text-base">CCTI Polvo</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </footer>
  );
};