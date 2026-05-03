import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { useTransactionsContext } from '../contexts/TransactionContext';
import { MonthSelector } from '../components/dashboard/MonthSelector';
import { SummaryCards } from '../components/dashboard/SummaryCards';
import { TransactionList } from '../components/dashboard/TransactionList';

export default function Home() {
  const navigate = useNavigate();
  const { 
    transactions, 
    recentTransactions, 
    loading, 
    monthTitle, 
    summary, 
    changeMonth 
  } = useTransactionsContext();

  const [backendMessage, setBackendMessage] = useState('');

  useEffect(() => {
    const testarGateway = async () => {
      try {
        console.log("⏳ Buscando sessão do usuário...");
        
        // 1. Pega a sessão ativa
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("❌ Erro do Supabase:", error.message);
          return;
        }

        const token = data.session?.access_token;
        
        // 2. Rastreador para vermos se o token existe mesmo
        console.log("🔑 Token capturado no React:", token ? "Token Existe!" : "Token VAZIO");

        // Se não tiver token, a gente nem tenta bater no Gateway para não tomar bronca
        if (!token) {
          console.warn("⚠️ Nenhum token encontrado. O usuário pode não estar logado totalmente ainda.");
          return;
        }

        // 3. Faz o fetch ENVIANDO O CABEÇALHO (Headers)
        const response = await fetch('http://localhost:3000/api/transactions', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}` // Essa é a linha que estava faltando chegar no Gateway!
          }
        });

        const responseData = await response.json();
        
        if (!response.ok) {
          console.error("❌ O Gateway recusou a entrada:", responseData);
          return;
        }

        console.log("✅ Resposta do Gateway:", responseData);
        setBackendMessage(responseData.message);

      } catch (error) {
        console.error("❌ Erro na requisição:", error);
      }
    };

    testarGateway();
  }, []);

  const handleEdit = (transaction) => {
    navigate('/add', { state: { transaction } });
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-500 md:pb-0">
      <div className="flex justify-between items-center px-1">
        <h1 className="text-xl font-bold text-foreground">Visão Mensal</h1>
        <MonthSelector />
      </div>

      {backendMessage && (
        <div style={{ padding: '10px', backgroundColor: '#d4edda', color: '#155724', borderRadius: '5px', margin: '15px 0' }}>
          🚀 <strong>Gateway conectou:</strong> {backendMessage}
        </div>
      )}
      <SummaryCards summary={summary} />
      <TransactionList 
        transactions={transactions} 
        loading={loading} 
        recentTransactions={recentTransactions} 
        handleEdit={handleEdit} 
      />
    </div>
  );
}