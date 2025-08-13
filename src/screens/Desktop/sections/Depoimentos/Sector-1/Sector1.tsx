import { useState, useEffect } from "react";
import api from "../../../../../api/axiosInstance";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../../../components/ui/avatar";
import { Card, CardContent } from "../../../../../components/ui/card";

interface Testimonial {
  id: number;
  author: string;
  image: string;
  text: string;
}

export const Sector1 = (): JSX.Element => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.get('/depoimentos')
      .then(response => {
        setTestimonials(response.data.data);
      })
      .catch(error => {
        console.error("Erro ao buscar depoimentos:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <section className="relative w-full bg-[url(/background-img-2.png)] bg-cover bg-center py-16">
      <div className="relative w-full">
        <div className="relative max-w-6xl mx-auto px-4">
          <Card className="bg-[#ffffffb2] rounded-[10px] p-8">
            <h2 className="text-5xl font-semibold text-black text-center mb-12 font-sans">
              Depoimentos
            </h2>
            <div className="flex flex-col gap-8">
              {isLoading ? (
                <p className="text-center">Carregando depoimentos...</p>
              ) : (
                testimonials.map((testimonial) => (
                  <Card key={testimonial.id} className="bg-white rounded-[25px]">
                    <CardContent className="p-6 flex">
                      <div className="mr-6">
                        <Avatar className="h-[117px] w-[117px]">
                          <AvatarImage
                            src={testimonial.image}
                            alt={testimonial.author}
                            className="object-cover"
                          />
                          <AvatarFallback>
                            {testimonial.author.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="flex flex-col">
                        <h3 className="text-[32px] font-semibold text-black mb-4">
                          {testimonial.author}
                        </h3>
                        <p className="text-2xl font-medium text-black font-['IBM_Plex_Sans',Helvetica]">
                          {testimonial.text}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};