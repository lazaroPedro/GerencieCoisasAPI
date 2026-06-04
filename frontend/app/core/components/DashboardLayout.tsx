"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Boxes, LayoutDashboard, Box, Tags, Truck, 
  ArrowLeftRight, Menu, User, LogOut, IdCard 
} from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const pathname = usePathname() ?? '/';
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  const menuItems = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Produtos', href: '/produtos', icon: Box },
    { name: 'Categorias', href: '/categorias', icon: Tags }, 
    { name: 'Fornecedores', href: '/fornecedores', icon: Truck },
    { name: 'Movimentações', href: '/movimentacoes', icon: ArrowLeftRight },
  ];

  return (
    <div className="flex h-screen bg-bodyBg text-slate-800 font-sans overflow-hidden">

      <aside 
        className={`bg-white border-r border-slate-200 transition-all duration-300 flex flex-col z-20
          ${sidebarOpen ? 'w-65' : 'w-0 -translate-x-full md:w-20 md:translate-x-0'}`}
      >

        <div className="h-15 flex items-center px-6 border-b border-slate-200 shrink-0">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
            <Boxes className="h-6 w-6 shrink-0" />
            <span className={`${!sidebarOpen && 'md:hidden'} transition-opacity`}>GerencieCoisas</span>
          </Link>
        </div>


        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {menuItems.map((item, index) => {
             

              const Icon = item.icon!;

              const isActive = item.href === '/' 
                ? pathname === '/' 
                : pathname?.startsWith(item.href ?? "") ?? false;

              return (
                <li key={index}>
                  <Link
                    href={item.href ?? '#'}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                      ${isActive 
                        ? 'bg-orange-50 text-primary' 
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
                  >
                    <Icon className={`h-5 w-5 shrink-0 ${isActive ? 'text-primary' : 'text-slate-400'}`} />
                    <span className={`${!sidebarOpen && 'md:hidden'}`}>{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        <header className="h-15 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h5 className="text-sm font-semibold text-slate-500 hidden md:block">Painel Administrativo</h5>
          </div>


          <div className="relative">
            <button 
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 focus:outline-none"
            >
              <div className="w-8.75 h-8.75 bg-slate-100 rounded-full flex items-center justify-center border border-slate-200">
                <User className="h-4 w-4 text-slate-500" />
              </div>
              <span className="text-sm font-bold text-slate-700 hidden md:inline">Administrador</span>
            </button>

            {profileOpen && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setProfileOpen(false)} />
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-40">
                  <Link 
                    href="/perfil" 
                    className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                    onClick={() => setProfileOpen(false)}
                  >
                    <IdCard className="h-4 w-4 text-slate-400" /> Perfil
                  </Link>
                  <hr className="border-slate-100 my-1" />
                  <Link 
                    href="/logout" 
                    className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium"
                    onClick={() => setProfileOpen(false)}
                  >
                    <LogOut className="h-4 w-4" /> Sair
                  </Link>
                </div>
              </>
            )}
          </div>
        </header>


        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}