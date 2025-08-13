import { useState, FormEvent } from "react";
import { useAuth } from "../../../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../../../../../components/ui/card";
import { Input } from "../../../../../components/ui/input";
import { Button } from "../../../../../components/ui/button";

export const Sector1 = (): JSX.Element => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await login(email, password);
      navigate("/d_menu");
    } catch (err) {
      setError("Email ou senha inválidos. Tente novamente.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="bg-[url(/background-img-2.png)] bg-cover bg-center relative w-full py-16">
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md bg-white/70 rounded-[10px] shadow-md py-8 px-6">
          <CardContent>
            <h1 className="text-3xl font-semibold text-center mb-8 font-inter">Login Admin</h1>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                <Input
                  id="email" type="email" required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Digite seu email"
                  className="bg-[#b2d1df] h-10 px-3 w-full"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-1">Senha</label>
                <Input
                  id="password" type="password" required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite sua senha"
                  className="bg-[#b2d1df] h-10 px-3 w-full"
                />
              </div>

              {error && <p className="text-sm text-red-600 text-center">{error}</p>}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
              >
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};