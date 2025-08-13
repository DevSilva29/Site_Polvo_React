import { useState } from "react";
import { Link } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "../../../../../components/ui/navigation-menu";
// Para os ícones, você pode usar uma biblioteca como a lucide-react.
// Instale com: npm install lucide-react
import { Menu, X } from "lucide-react";

export const Header = (): JSX.Element => {
  // Estado para controlar se o menu mobile está aberto ou fechado
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: "Atividades", path: "/cronograma" },
    { name: "Avisos", path: "/avisos" },
    { name: "Contato", path: "/contato" },
    { name: "Contribuir", path: "/contribua" },
    { name: "Depoimentos", path: "/depoimentos" },
    { name: "Midia", path: "/midia" },
    { name: "Sobre", path: "/sobre" },
  ];

  return (
    // Adicionado `relative` para que o menu mobile absoluto se posicione corretamente
    <header className="relative flex flex-col items-center w-full py-8 bg-white">
      {/* Container principal para alinhar itens e permitir o posicionamento dos ícones */}
      <div className="flex items-center justify-center w-full px-4">
        {/* Ícone do Menu Hamburguer (visível apenas em telas pequenas) */}
        <div className="absolute left-5 top-9 md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {/* Alterna entre o ícone de Menu e o de X (fechar) */}
            {isMenuOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>

        <div className="flex flex-col items-center">
          <Link to={"/"} onClick={() => setIsMenuOpen(false)}>
            <img
              className="w-[185px] h-auto mb-5"
              alt="Logocircular"
              src="/logocircular-1.png"
            />
          </Link>
          <h1 className="font-medium text-center text-black text-[28px] md:text-[32px] leading-tight md:leading-[48px] font-['Inter',Helvetica]">
            Centro de Convivência da Terceira Idade - Polvo
          </h1>
        </div>

        {/* Ícone de Login */}
        <Link
          to={"/login"}
          className="absolute right-5 top-8 w-[40px] h-auto"
        >
          <img alt="Button" src="/button.png" />
        </Link>
      </div>

      {/* Navegação para Desktop (visível apenas em telas 'md' ou maiores) */}
      <NavigationMenu className="hidden mt-6 md:flex">
        <NavigationMenuList className="flex items-center gap-[38.74px]">
          {navItems.map((item, index) => (
            <NavigationMenuItem key={index}>
              <NavigationMenuLink
                className="font-medium text-[16.1px] leading-[24.2px] text-black font-['Inter',Helvetica]"
                href={item.path}
              >
                {item.name}
              </NavigationMenuLink>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>

      {/* Menu Mobile Dropdown (só aparece se isMenuOpen for true) */}
      {isMenuOpen && (
        <div className="absolute top-full w-full mt-4 bg-white flex flex-col items-center shadow-lg md:hidden z-10">
          <ul className="flex flex-col items-center gap-4 py-4">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className="font-medium text-lg text-black"
                  // Fecha o menu ao clicar em um item
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
};