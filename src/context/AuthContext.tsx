import { createContext, useState, useContext, useEffect, ReactNode } from "react";
import api from "../api/axiosInstance"; // Nossa instância axios!

// Define o formato do objeto de usuário
interface User {
    name: string;
    email: string;
}

// Define o que nosso contexto vai fornecer
interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    // Função para buscar o estado de autenticação no backend
    const checkAuth = async () => {
        try {
            const response = await api.get('/user');
            setUser(response.data);
        } catch (error) {
            setUser(null);
        }
    };

    // Verifica o login quando a aplicação carrega
    useEffect(() => {
        checkAuth();
    }, []);

    const login = async (email: string, password: string) => {
        // --- CORREÇÃO AQUI ---
        // Pegamos a URL base do servidor do nosso .env
        const serverBaseUrl = import.meta.env.VITE_SERVER_BASE_URL;

        // 1. Chamamos a URL completa do CSRF, ignorando a baseURL da instância 'api'
        // A instância 'api' ainda é usada para enviar os cookies (withCredentials)
        await api.get(`${serverBaseUrl}/sanctum/csrf-cookie`);

        // 2. Agora fazemos o login normalmente. A instância 'api' adicionará o /api,
        // resultando em .../api/login, que está correto.
        await api.post('/login', { email, password });

        // 3. Busca os dados do usuário para confirmar o login e atualizar o estado
        await checkAuth();
    };

    const logout = async () => {
        await api.post('/logout');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook customizado para usar o contexto facilmente nos componentes
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};