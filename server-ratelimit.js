const express = require('express');
const rateLimit = require('express-rate-limit');

const app = express();
const port = 8080;

// Middleware de rate limiting (Limite de 5 requisições por minuto)
const limiter = rateLimit({
    windowMs: 60 * 1000,  // 1 minuto
    max: 100,  // Limite de 5 requisições
    message: 'Você excedeu o limite de requisições, tente novamente mais tarde.',
});

// Aplica o rate limiter para todas as rotas
app.use(limiter);

// Função simulando chamada externa
async function externalService() {
    return 'Resposta da chamada externa';
}

// Rota que faz a chamada simulada
app.get('/api/ratelimit', async (req, res) => {
    try {
        const result = await externalService();
        res.send(result);
    } catch (error) {
        res.status(500).send(`Erro: ${error.message}`);
    }
});

function simulateRateLimitError() {
    console.log('Iniciando teste de Rate Limit...');
    
    for (let i = 1; i <= 110; i++) {
        fetch('http://localhost:8080/api/ratelimit')
            .then(response => response.text())
            .then(data => console.log(`Requisição ${i}: ${data}`))
            .catch(() => console.error(`Erro na requisição ${i}: Limite atingido`));
    }
}

// Iniciando o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
    simulateRateLimitError();
});
