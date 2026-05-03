const fastify = require('fastify')({ logger: true });
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

fastify.register(require('@fastify/cors'), { origin: '*' });

const PORT = process.env.PORT || 3001;
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

// Nova rota raiz conectada ao banco de dados!
fastify.get('/', async (request, reply) => {
    try {
        // 1. Pegamos o token que o Gateway deixou passar
        const authHeader = request.headers.authorization;
        const token = authHeader ? authHeader.split(' ')[1] : null;

        // 2. Criamos uma conexão com o Supabase usando o SEU token
        const supabase = createClient(supabaseUrl, supabaseKey, {
            global: { headers: { Authorization: `Bearer ${token}` } }
        });

        // 3. Vamos no banco de dados buscar as transações!
        // OBS: Troque 'transactions' pelo nome real da sua tabela, caso seja diferente
        const { data, error } = await supabase
            .from('transactions')
            .select('*')
            .order('date', { ascending: false })
            .limit(5); // Trazendo as 5 últimas só pra testar

        if (error) throw error;

        return {
            service: 'Finance Core',
            message: 'Transações reais carregadas do banco de dados!',
            dados: data // Mandamos as transações de volta pro React
        };

    } catch (error) {
        fastify.log.error(error);
        return reply.status(500).send({ erro: 'Erro ao buscar dados no banco' });
    }
});

const start = async () => {
    try {
        await fastify.listen({ port: PORT });
        console.log(`✅ Microsserviço Financeiro rodando na porta ${PORT}`);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();