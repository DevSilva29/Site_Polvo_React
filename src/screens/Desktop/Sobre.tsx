import { Footer } from "./sections/generic/Footer";
import { Header } from "./sections/generic/Header";
import { Sector1 } from "./sections/Sobre/Sector-1/Sector1";

export const Sobre = (): JSX.Element => {
  return (
    <main className="flex flex-col min-h-screen w-full bg-white">
      <Header />
      <Sector1 />
      <Footer />
    </main>
  );
};
