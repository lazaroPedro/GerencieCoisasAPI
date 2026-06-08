"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Boxes } from 'lucide-react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setCarregando(true);
    setErro('');

    try {
      const bodyData = new URLSearchParams();
      bodyData.append('grant_type', 'password');
      bodyData.append('username', username);
      bodyData.append('password', password);
      bodyData.append('client_id', 'gerenciecoisas-dev-client');

      const res = await fetch('http://localhost:8000/o/token/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: bodyData.toString(),
      });

      if (!res.ok) {
        throw new Error('Usuário ou senha incorretos.');
      }

      const data = await res.json();

      localStorage.setItem('token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);
      localStorage.setItem('username', username);

      router.push('/produtos');
    } catch (err: unknown) {
      setErro((err as Error).message || 'Erro ao tentar fazer login');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex flex-col items-center  justify-center text-orange-500">
          <Boxes className="h-12 w-12" />
          <span className="text-3xl font-bold text-primary">Gerencie Coisas</span>
        </div>
        <span className="mt-2 block text-center text-sm text-slate-600">
          Acesso ao Sistema
        </span>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm sm:rounded-xl sm:px-10 border border-slate-200">
          <form className="space-y-6" onSubmit={handleLogin}>
            {erro && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center font-medium">
                {erro}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-semibold text-slate-700">Usuário</label>
              <div className="mt-1">
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700">Senha</label>
              <div className="mt-1">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={carregando}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 transition-colors"
              >
                {carregando ? 'Entrando...' : 'Entrar'}
              </button>
            </div>

          </form>
          <div className="mt-6 text-center text-sm text-slate-500">
            Não tem uma conta? <a href="#" className="font-medium text-orange-600 hover:text-orange-500">  
              Cadastre-se
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
   