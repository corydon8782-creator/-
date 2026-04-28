'use client'

import React, { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { currentUser } from '@/lib/dummy-data'
import {
  LayoutDashboard,
  FolderOpen,
  FilePlus,
  FileText,
  BookTemplate,
  Download,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Bell,
  HelpCircle,
  Building2,
  Menu,
  X,
  Shield,
  PackageSearch,
} from 'lucide-react'

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
  badge?: string | number
}

const navItems: NavItem[] = [
  { label: '대시보드', href: '/dashboard', icon: <LayoutDashboard size={18} /> },
  { label: '프로젝트 목록', href: '/projects', icon: <FolderOpen size={18} /> },
  { label: '새 계획서 작성', href: '/projects/new', icon: <FilePlus size={18} /> },
  { label: '계획서 편집', href: '/editor', icon: <FileText size={18} /> },
  { label: '템플릿 관리', href: '/templates', icon: <BookTemplate size={18} /> },
  { label: '출력 / 다운로드', href: '/export', icon: <Download size={18} /> },
  { label: '주요자재 수불부', href: '/materials', icon: <PackageSearch size={18} /> },
]

const bottomNavItems: NavItem[] = [
  { label: '설정', href: '/settings', icon: <Settings size={18} /> },
  { label: '관리자 콘솔', href: '/admin', icon: <Shield size={18} /> },
]

interface AppLayoutProps {
  children: React.ReactNode
  title?: string
  breadcrumbs?: { label: string; href?: string }[]
  headerActions?: React.ReactNode
}

export default function AppLayout({
  children,
  title,
  breadcrumbs,
  headerActions,
}: AppLayoutProps) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'flex flex-col bg-slate-900 text-white transition-all duration-200 z-50',
          'fixed inset-y-0 left-0 lg:relative lg:translate-x-0',
          collapsed ? 'w-16' : 'w-64',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        )}
      >
        {/* Logo */}
        <div className={cn(
          'flex items-center h-16 px-4 border-b border-slate-800 flex-shrink-0',
          collapsed ? 'justify-center' : 'justify-between',
        )}>
          {!collapsed && (
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-md bg-primary-600 flex items-center justify-center flex-shrink-0">
                <Building2 size={18} className="text-white" />
              </div>
              <div>
                <span className="text-sm font-bold text-white tracking-tight">QualityAI</span>
                <p className="text-2xs text-slate-400 leading-none">건설품질관리 플랫폼</p>
              </div>
            </div>
          )}
          {collapsed && (
            <div className="w-8 h-8 rounded-md bg-primary-600 flex items-center justify-center">
              <Building2 size={18} className="text-white" />
            </div>
          )}
          <button
            onClick={() => setCollapsed((v) => !v)}
            className={cn(
              'p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors hidden lg:flex',
              collapsed && 'hidden',
            )}
          >
            <ChevronLeft size={16} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 overflow-y-auto">
          <ul className="space-y-0.5 px-2">
            {navItems.map((item) => {
              const isActive =
                item.href === '/dashboard'
                  ? pathname === '/dashboard'
                  : pathname.startsWith(item.href)

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors duration-100',
                      isActive
                        ? 'bg-primary-700 text-white'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800',
                      collapsed && 'justify-center px-0',
                    )}
                    title={collapsed ? item.label : undefined}
                  >
                    <span className="flex-shrink-0">{item.icon}</span>
                    {!collapsed && (
                      <span className="flex-1">{item.label}</span>
                    )}
                    {!collapsed && item.badge && (
                      <span className="text-2xs bg-primary-500 text-white px-1.5 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Bottom nav */}
        <div className="py-4 border-t border-slate-800 px-2 space-y-0.5">
          {bottomNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors',
                'text-slate-400 hover:text-white hover:bg-slate-800',
                collapsed && 'justify-center px-0',
              )}
              title={collapsed ? item.label : undefined}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </Link>
          ))}

          {/* User info */}
          <div className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-md border border-slate-700 mt-2',
            collapsed && 'justify-center px-0',
          )}>
            <div className="w-7 h-7 rounded-full bg-primary-600 flex items-center justify-center flex-shrink-0 text-xs font-bold text-white">
              {currentUser.name[0]}
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-white truncate">{currentUser.name}</p>
                <p className="text-2xs text-slate-400 truncate">{currentUser.department}</p>
              </div>
            )}
            {!collapsed && (
              <Link href="/auth/login">
                <LogOut size={15} className="text-slate-500 hover:text-slate-300 flex-shrink-0" />
              </Link>
            )}
          </div>
        </div>

        {/* Collapse toggle for collapsed state */}
        {collapsed && (
          <button
            onClick={() => setCollapsed(false)}
            className="mx-auto mb-2 p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <ChevronRight size={16} />
          </button>
        )}
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-4 lg:px-6 gap-4 flex-shrink-0 z-30">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-1.5 rounded text-slate-500 hover:bg-slate-100 lg:hidden"
          >
            <Menu size={20} />
          </button>

          <div className="flex-1 min-w-0">
            {breadcrumbs && breadcrumbs.length > 0 ? (
              <nav className="flex items-center gap-1 text-sm">
                {breadcrumbs.map((crumb, i) => (
                  <React.Fragment key={i}>
                    {i > 0 && <span className="text-slate-400">/</span>}
                    {crumb.href ? (
                      <Link href={crumb.href} className="text-slate-500 hover:text-slate-700">
                        {crumb.label}
                      </Link>
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
            <button className="relative p-2 rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-700">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
            </button>
            <button className="p-2 rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-700">
              <HelpCircle size={18} />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
