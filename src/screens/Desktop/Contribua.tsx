import { Footer } from "./sections/generic/Footer";
import { Header } from "./sections/generic/Header";
import { Sector1 } from "./sections/Contribua/Sector-1/Sector1";

export const Contribua = (): JSX.Element => {
  return (
    <div className="flex flex-col min-h-screen w-full bg-white">
      <Header />
      <main className="flex-1">
        <Sector1 />
      </main>
      <Footer />
    </div>
  );
};
