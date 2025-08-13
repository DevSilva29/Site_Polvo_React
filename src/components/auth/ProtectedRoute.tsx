import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Importa nosso hook de autenticação

const ProtectedRoute = () => {
  // Pega o status de autenticação do nosso contexto global
  const { isAuthenticated } = useAuth();

  // Se o usuário NÃO estiver autenticado, redireciona para a página de login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Se estiver autenticado, renderiza a página de dashboard que foi solicitada
  return <Outlet />;
};

export default ProtectedRoute;