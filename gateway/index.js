const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

// 1. Aqui nós importamos o middleware que você acabou de criar
const { verificarToken } = require('./middlewares/auth');

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

app.get('/health', (req, res) => {
    res.json({ status: 'API Gateway Operacional', timestamp: new Date() });
});

// 2. 🔒 Aplicamos o 'verificarToken' ANTES do proxy!
// A requisição bate no Gateway, passa pela verificação e, se der tudo certo, vai pro Fastify.
app.use('/api/transactions', verificarToken, createProxyMiddleware({
    target: 'http://localhost:3001',
    changeOrigin: true
}));

// 3. 🔓 Rota do Python continua aberta (sem o verificarToken)
app.use('/api/process', createProxyMiddleware({
    target: 'http://localhost:3002',
    changeOrigin: true
}));

app.listen(PORT, () => {
    console.log(`🚀 API Gateway rodando na porta ${PORT}`);
    console.log('🔒 /api/transactions está PROTEGIDA com JWT');
    console.log('🔓 /api/process está ABERTA');
});