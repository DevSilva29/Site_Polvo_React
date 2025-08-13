import { Footer } from "./sections/generic/Footer";
import { Header } from "./sections/generic/Header";
import { Sector1 } from "./sections/Home/Sector-1";
import { Sector2 } from "./sections/Home/Sector-2";
import { Sector3 } from "./sections/Home/Sector-3";
import { Sector5 } from "./sections/Home/Sector-5";
import { Sector4 } from "./sections/Home/Sector-4";
import { FadeSection } from "../../components/FadeSection"

export const Home = (): JSX.Element => {
  return (
    <main className="flex flex-col w-full min-h-screen bg-white overflow-x-hidden">
      <Header />

      <FadeSection>
        <Sector1 />
      </FadeSection>

      <FadeSection>
        <Sector2 />
      </FadeSection>

      <FadeSection>
        <Sector3 />
      </FadeSection>

      <FadeSection>
        <Sector4 />
      </FadeSection>

      <FadeSection>
        <Sector5 />
      </FadeSection>

      <Footer />
    </main>
  );
};