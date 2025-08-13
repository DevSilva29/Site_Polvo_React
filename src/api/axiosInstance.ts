import axios from 'axios';

// Cria uma nova "instância" do axios com configurações pré-definidas
const axiosInstance = axios.create({
    // Pega a URL base do nosso arquivo .env
    baseURL: import.meta.env.VITE_API_BASE_URL,

    // Esta linha é MUITO importante para a autenticação que faremos depois
    withCredentials: true, 

    // --- ADIÇÃO IMPORTANTE AQUI ---
    // Diz ao Axios para procurar um cookie chamado 'XSRF-TOKEN'
    xsrfCookieName: 'XSRF-TOKEN',
    // E para colocar o valor desse cookie em um cabeçalho chamado 'X-XSRF-TOKEN'
    xsrfHeaderName: 'X-XSRF-TOKEN',
});

export default axiosInstance;