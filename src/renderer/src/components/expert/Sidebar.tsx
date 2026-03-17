import { Wifi, Trash2, Zap, Shield, Search, Settings, LayoutGrid } from 'lucide-react'
import { useAppStore, Category } from '../../store/app.store'
import { cn } from '../../lib/utils'

interface Props {
  onSnapshot?: () => void
}

const categories: { id: Category; label: string; Icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'all', label: 'Toutes', Icon: LayoutGrid },
  { id: 'network', label: 'Réseau', Icon: Wifi },
  { id: 'maintenance', label: 'Maintenance', Icon: Trash2 },
  { id: 'performance', label: 'Performance', Icon: Zap },
  { id: 'security', label: 'Sécurité', Icon: Shield },
  { id: 'diagnostics', label: 'Diagnostics', Icon: Search },
  { id: 'system', label: 'Système', Icon: Settings }
]

export default function Sidebar({ onSnapshot }: Props) {
  const { activeCategory, setActiveCategory, commands } = useAppStore()

  const getCount = (cat: Category) => {
    if (cat === 'all') return commands.length
    return commands.filter((c) => c.category === cat).length
  }

  return (
    <div className="flex flex-col h-full expert-panel border-r">
      {/* Category filter */}
      <div className="p-3 space-y-0.5">
        <div className="text-xs font-semibold text-expert-muted uppercase tracking-wider px-2 py-1.5">
          Catégories
        </div>
        {categories.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => setActiveCategory(id)}
            className={cn(
              'w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-sm transition-colors duration-150',
              activeCategory === id
                ? 'bg-expert-accent/15 text-expert-accent font-medium'
                : 'text-expert-muted hover:bg-expert-surface-hover hover:text-expert-text'
            )}
          >
            <div className="flex items-center gap-2.5">
              <Icon className="w-3.5 h-3.5" />
              {label}
            </div>
            <span className="text-xs opacity-50">{getCount(id)}</span>
          </button>
        ))}
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Snapshot button */}
      {onSnapshot && (
        <div className="p-3 border-t border-expert-border">
          <button
            onClick={onSnapshot}
            className="w-full expert-btn text-center"
          >
            📸 Snapshot registre
          </button>
        </div>
      )}
    </div>
  )
}

