import { Footer } from "./sections/generic/Footer";
import { Header } from "./sections/generic/Header";
import { Sector1 } from "./sections/Dashboards/Atividades";

export const DashboardAtividades = (): JSX.Element => {
  return (
    <main className="flex flex-col w-full min-h-screen bg-white">
      <Header />
      <Sector1 />
      <Footer />
    </main>
  );
};
