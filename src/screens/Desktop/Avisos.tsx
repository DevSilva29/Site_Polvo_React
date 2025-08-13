import { Footer } from "./sections/generic/Footer";
import { Header } from "./sections/generic/Header";
import { Sector1 } from "./sections/Avisos/Sector-1";


export const Avisos = (): JSX.Element => {
  return (
    <main className="flex flex-col w-full min-h-screen bg-white overflow-x-hidden">
      <Header />
        <Sector1 />
      <Footer />
    </main>
  );
};