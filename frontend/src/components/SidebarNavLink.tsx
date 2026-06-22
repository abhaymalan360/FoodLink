'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavItem {
  href: string
  icon: string
  label: string
}

interface SidebarNavLinkProps {
  items: NavItem[]
  bottomItems?: NavItem[]
  children?: React.ReactNode
}

export default function SidebarNavLinks({ items, bottomItems, children }: SidebarNavLinkProps) {
  const pathname = usePathname()

  const NavLink = ({ href, icon, label }: NavItem) => {
    const isActive = pathname === href || pathname.startsWith(href + '/')
    return (
      <Link
        href={href}
        className={`group flex items-center gap-3 px-3 py-2.5 mx-3 rounded-xl transition-all duration-200 relative ${
          isActive 
            ? 'bg-surface-container-lowest shadow-[0_1px_3px_rgba(0,0,0,0.02),0_1px_2px_rgba(0,0,0,0.04)] text-on-surface border border-outline-variant/60' 
            : 'text-on-surface-variant hover:bg-surface-container-high/40 hover:text-on-surface border border-transparent'
        }`}
      >
        <span className={`material-symbols-outlined text-[20px] transition-colors ${
          isActive ? 'text-on-surface' : 'text-on-surface-variant group-hover:text-on-surface-variant'
        }`} style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>
          {icon}
        </span>
        <span className={`text-[13.5px] tracking-tight ${isActive ? 'font-semibold' : 'font-medium'}`}>{label}</span>
      </Link>
    )
  }

  return (
    <nav className="flex-1 py-4 space-y-1">
      <div className="px-6 mb-3">
        <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-on-surface-variant/80">Menu</p>
      </div>

      {items.map((item) => (
        <NavLink key={item.href} {...item} />
      ))}

      {children && (
        <div className="mt-1 mb-1">
          {children}
        </div>
      )}

      {bottomItems && bottomItems.map((item) => (
        <NavLink key={item.href} {...item} />
      ))}
    </nav>
  )
}
