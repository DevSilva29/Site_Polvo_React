import { useState, FormEvent, ChangeEvent } from "react";
import api from "../../../../../api/axiosInstance";
import { isAxiosError } from "axios";
import { Card, CardContent } from "../../../../../components/ui/card";
import { Checkbox } from "../../../../../components/ui/checkbox";
import { Input } from "../../../../../components/ui/input";
import { Textarea } from "../../../../../components/ui/textarea";
import { Button } from "../../../../../components/ui/button";

export const Sector1 = (): JSX.Element => {
  const [formData, setFormData] = useState({
    msgContato_name: "",
    msgContato_lastname: "",
    msgContato_email: "",
    msgContato_phone: "",
    msgContato_adress: "",
    msgContato_type: "Cliente",
    msgContato_msg: "",
  });

  const [status, setStatus] = useState({
    enviando: false,
    sucesso: false,
    erro: null as string | null,
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    let onlyNums = value.replace(/\D/g, "");
    if (onlyNums.length > 11) {
      onlyNums = onlyNums.slice(0, 11);
    }
    let formattedPhone = onlyNums;
    if (onlyNums.length > 2) {
      formattedPhone = `(${onlyNums.substring(0, 2)}) ${onlyNums.substring(2)}`;
    }
    if (onlyNums.length > 7) {
      formattedPhone = `(${onlyNums.substring(0, 2)}) ${onlyNums.substring(2, 7)}-${onlyNums.substring(7, 11)}`;
    }
    setFormData(prevState => ({ ...prevState, msgContato_phone: formattedPhone }));
  };

  const handleCheckboxChange = (type: 'Cliente' | 'Empresas/Parceria') => {
    setFormData(prevState => ({ ...prevState, msgContato_type: type }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus({ enviando: true, sucesso: false, erro: null });

    const dataToSend = {
      ...formData,
      msgContato_phone: formData.msgContato_phone.replace(/\D/g, "")
    };

    api.post("/contato", dataToSend)
      .then(response => {
        setStatus({ enviando: false, sucesso: true, erro: null });
        setFormData({
          msgContato_name: "", msgContato_lastname: "", msgContato_email: "",
          msgContato_phone: "", msgContato_adress: "", msgContato_type: "Cliente",
          msgContato_msg: "",
        });
      })
      .catch((error) => {
        let errorMessage = "Ocorreu um erro inesperado. Tente novamente.";
        if (isAxiosError(error) && error.response) {
          const validationErrors = error.response.data.errors;
          if (validationErrors) {
            errorMessage = Object.values(validationErrors)[0] as string;
          } else {
            errorMessage = error.response.data.message || "Erro no servidor.";
          }
        }
        setStatus({ enviando: false, sucesso: false, erro: errorMessage });
        console.error("Erro ao enviar formulário:", error);
      });
  };

  const contactInfo = {
    email: "ccti.polvo@gmail.com",
    hours: {
      days: "Segunda a Sexta:",
      time: "10:00 às 17:00",
    },
  };

  return (
    <section className="w-full py-16 relative">
      <img
        className="absolute inset-0 w-full h-full object-cover"
        alt="Background"
        src="/background-img-2.png"
      />
      <Card className="relative mx-auto max-w-6xl bg-white/70 backdrop-blur-sm rounded-lg shadow-md">
        <CardContent className="p-12">
          <h1 className="text-5xl font-semibold text-center mb-10 font-inter">
            Contato
          </h1>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center space-y-8">
              <div>
                <h2 className="text-2xl font-inter mb-4">WhatsApp</h2>
                <a href="https://api.whatsapp.com/send?phone=12992162503" target="_blank" rel="noopener noreferrer">
                  <img
                    className="w-[225px] h-auto mx-auto"
                    alt="Whatsapp"
                    src="/whatsapp.png"
                  />
                </a>
              </div>
              <div>
                <h2 className="text-2xl font-inter mb-4">Email</h2>
                <p className="text-xl font-ibm-plex-sans font-light">
                  {contactInfo.email}
                </p>
              </div>
              <div>
                <h2 className="text-2xl font-inter mb-4">Horários</h2>
                <p className="text-xl font-ibm-plex-sans font-light">
                  {contactInfo.hours.days}
                  <br />
                  {contactInfo.hours.time}
                </p>
              </div>
            </div>
            <div className="lg:col-span-2">
              <h2 className="text-4xl font-semibold text-center mb-10 font-inter">
                Formulário de Contato
              </h2>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input name="msgContato_name" value={formData.msgContato_name} onChange={handleChange} required className="bg-[#b2d1df] h-[35px] pl-3 placeholder:text-gray-700" placeholder="Nome" />
                  <Input name="msgContato_lastname" value={formData.msgContato_lastname} onChange={handleChange} required className="bg-[#b2d1df] h-[35px] pl-4 placeholder:text-gray-700" placeholder="Sobrenome" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input type="email" name="msgContato_email" value={formData.msgContato_email} onChange={handleChange} required className="bg-[#b2d1df] h-[35px] pl-3 placeholder:text-gray-700" placeholder="Email" />
                  <Input
                    type="tel"
                    name="msgContato_phone"
                    value={formData.msgContato_phone}
                    onChange={handlePhoneChange}
                    maxLength={15} // (xx) xxxxx-xxxx tem 15 caracteres
                    className="bg-[#b2d1df] h-[35px] pl-4 placeholder:text-gray-700"
                    placeholder="Telefone Celular (xx) xxxxx-xxxx"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input name="msgContato_adress" value={formData.msgContato_adress} onChange={handleChange} className="bg-[#b2d1df] h-[35px] pl-3 placeholder:text-gray-700" placeholder="Endereço" />
                  <div className="flex items-center space-x-8">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="cliente" checked={formData.msgContato_type === 'Cliente'} onCheckedChange={() => handleCheckboxChange('Cliente')} className="bg-[#b2d1df] h-[15px] w-[15px]" />
                      <label htmlFor="cliente" className="text-sm font-light font-ibm-plex-sans cursor-pointer">Cliente</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="empresa" checked={formData.msgContato_type === 'Empresas/Parceria'} onCheckedChange={() => handleCheckboxChange('Empresas/Parceria')} className="bg-[#b2d1df] h-[15px] w-[15px]" />
                      <label htmlFor="empresa" className="text-sm font-light font-ibm-plex-sans cursor-pointer">Empresas/Parceria</label>
                    </div>
                  </div>
                </div>
                <Textarea name="msgContato_msg" value={formData.msgContato_msg} onChange={handleChange} required minLength={10} maxLength={1000} className="bg-[#b2d1df] h-28 pl-3 pt-1.5 placeholder:text-gray-700" placeholder="Digite sua Mensagem (Max. 1000 Caracteres)" />

                <div className="text-center pt-4">
                  <Button type="submit" disabled={status.enviando} size="lg" className="h-[50px] bg-[#3661a0] text-white rounded-lg shadow-button-shadow font-small-text px-8">
                    {status.enviando ? 'Enviando...' : 'Enviar Mensagem'}
                  </Button>
                  {status.sucesso && <p className="text-green-600 mt-4 font-semibold">Mensagem enviada com sucesso! Entraremos em contato em breve.</p>}
                  {status.erro && <p className="text-red-600 mt-4 font-semibold">{status.erro}</p>}
                </div>
              </form>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};