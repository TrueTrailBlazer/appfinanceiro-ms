const jwt = require('jsonwebtoken');
require('dotenv').config(); // Para ler o nosso arquivo .env

const verificarToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            erro: "Acesso Negado",
            motivo: "Nenhum token de autenticação foi fornecido."
        });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ erro: "Token mal formatado." });
    }

    try {
        // 1. Pegamos a Chave Mestra do .env
        const JWT_SECRET = process.env.SUPABASE_JWT_SECRET;

        if (!JWT_SECRET) {
            console.error("ERRO GRAVE: SUPABASE_JWT_SECRET não está configurado no .env");
            return res.status(500).json({ erro: "Erro interno do servidor." });
        }

        // 2. A Mágica Criptográfica (Validação HS256)
        const usuarioDecodificado = jwt.verify(token, JWT_SECRET);

        // 3. Se chegou aqui, o token é autêntico!
        req.user = usuarioDecodificado;

        console.log(`✅ Acesso Autorizado! ID do Usuário: ${usuarioDecodificado.sub}`);

        // Libera a catraca!
        next();

    } catch (error) {
        console.error("❌ Tentativa de acesso bloqueada:", error.message);
        return res.status(403).json({
            erro: "Acesso Proibido",
            motivo: "Token inválido, expirado ou assinatura não confere."
        });
    }
};

module.exports = { verificarToken };