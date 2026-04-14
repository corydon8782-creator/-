'use client'

import React, { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Users,
  FolderOpen,
  BookTemplate,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Bell,
  Building2,
  Shield,
  Activity,
  Menu,
  Database,
  AlertTriangle,
  ArrowLeft,
} from 'lucide-react'

interface AdminNavItem {
  label: string
  href: string
  icon: React.ReactNode
  badge?: string | number
}

const adminNavItems: AdminNavItem[] = [
  { label: '관리자 대시보드', href: '/admin', icon: <LayoutDashboard size={18} /> },
  { label: '사용자 관리', href: '/admin/users', icon: <Users size={18} /> },
  { label: '프로젝트 관리', href: '/admin/projects', icon: <FolderOpen size={18} /> },
  { label: '템플릿 관리', href: '/admin/templates', icon: <BookTemplate size={18} /> },
  { label: '시스템 로그', href: '/admin/logs', icon: <Activity size={18} /> },
  { label: '통계/리포트', href: '/admin/reports', icon: <BarChart3 size={18} /> },
  { label: '시스템 설정', href: '/admin/settings', icon: <Settings size={18} /> },
]

interface AdminLayoutProps {
  children: React.ReactNode
  title?: string
  breadcrumbs?: { label: string; href?: string }[]
  headerActions?: React.ReactNode
}

export default function AdminLayout({
  children,
  title,
  breadcrumbs,
  headerActions,
}: AdminLayoutProps) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Admin Sidebar - distinct dark red/slate tone to differentiate from user sidebar */}
      <aside
        className={cn(
          'flex flex-col bg-slate-800 text-white transition-all duration-200 z-50',
          'fixed inset-y-0 left-0 lg:relative lg:translate-x-0',
          collapsed ? 'w-16' : 'w-64',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        )}
      >
        {/* Logo */}
        <div className={cn(
          'flex items-center h-16 px-4 border-b border-slate-700 flex-shrink-0',
          collapsed ? 'justify-center' : 'justify-between',
        )}>
          {!collapsed && (
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-md bg-red-600 flex items-center justify-center flex-shrink-0">
                <Shield size={16} className="text-white" />
              </div>
              <div>
                <span className="text-sm font-bold text-white">QualityAI</span>
                <p className="text-2xs text-slate-400 leading-none">관리자 콘솔</p>
              </div>
            </div>
          )}
          {collapsed && (
            <div className="w-8 h-8 rounded-md bg-red-600 flex items-center justify-center">
              <Shield size={16} className="text-white" />
            </div>
          )}
          {!collapsed && (
            <button
              onClick={() => setCollapsed(true)}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-700 hidden lg:flex"
            >
              <ChevronLeft size={16} />
            </button>
          )}
        </div>

        {/* Admin badge */}
        {!collapsed && (
          <div className="mx-3 mt-3 px-2 py-1.5 bg-red-900/50 border border-red-700/50 rounded-lg flex items-center gap-2">
            <AlertTriangle size={13} className="text-red-400 flex-shrink-0" />
            <span className="text-2xs text-red-300 font-medium">관리자 전용 영역</span>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 py-4 overflow-y-auto">
          <ul className="space-y-0.5 px-2">
            {adminNavItems.map((item) => {
              const isActive =
                item.href === '/admin'
                  ? pathname === '/admin'
                  : pathname.startsWith(item.href)

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-red-700 text-white'
                        : 'text-slate-400 hover:text-white hover:bg-slate-700',
                      collapsed && 'justify-center px-0',
                    )}
                    title={collapsed ? item.label : undefined}
                  >
                    <span className="flex-shrink-0">{item.icon}</span>
                    {!collapsed && <span className="flex-1">{item.label}</span>}
                    {!collapsed && item.badge && (
                      <span className="text-2xs bg-red-500 text-white px-1.5 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Bottom */}
        <div className="py-4 border-t border-slate-700 px-2 space-y-1">
          <Link
            href="/dashboard"
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-700 transition-colors',
              collapsed && 'justify-center px-0',
            )}
            title={collapsed ? '사용자 화면으로' : undefined}
          >
            <ArrowLeft size={18} />
            {!collapsed && <span>사용자 화면으로</span>}
          </Link>
          <Link
            href="/auth/login"
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-700 transition-colors',
              collapsed && 'justify-center px-0',
            )}
          >
            <LogOut size={18} />
            {!collapsed && <span>로그아웃</span>}
          </Link>
        </div>

        {collapsed && (
          <button
            onClick={() => setCollapsed(false)}
            className="mx-auto mb-2 p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-700"
          >
            <ChevronRight size={16} />
          </button>
        )}
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-4 lg:px-6 gap-4 flex-shrink-0">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-1.5 rounded text-slate-500 hover:bg-slate-100 lg:hidden"
          >
            <Menu size={20} />
          </button>

          <div className="flex items-center gap-2 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded px-2.5 py-1">
            <Shield size={13} />
            관리자 모드
          </div>

          <div className="flex-1 min-w-0">
            {breadcrumbs && breadcrumbs.length > 0 ? (
              <nav className="flex items-center gap-1 text-sm">
                {breadcrumbs.map((crumb, i) => (
                  <React.Fragment key={i}>
                    {i > 0 && <span className="text-slate-300">/</span>}
                    {crumb.href ? (
                      <Link href={crumb.href} className="text-slate-500 hover:text-slate-700">{crumb.label}</Link>
                    ) : (
                      <span className="text-slate-900 font-medium">{crumb.label}</span>
                    )}
                  </React.Fragment>
                ))}
              </nav>
            ) : title ? (
              <h1 className="text-base font-semibold text-slate-900">{title}</h1>
            ) : null}
          </div>

          <div className="flex items-center gap-2">
            {headerActions}
            <button className="relative p-2 rounded-md text-slate-500 hover:bg-slate-100">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
            </button>
            <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-xs font-bold text-white">
              관
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}
