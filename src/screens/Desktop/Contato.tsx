import { Sector1 } from "./sections/Contato/Sector-1";
import { Footer } from "./sections/generic/Footer";
import { Header } from "./sections/generic/Header";

export const Contato = (): JSX.Element => {
  return (
    <main className="flex flex-col w-full min-h-screen bg-white">
      <Header />
      <Sector1 />
      <Footer />
    </main>
  );
};
