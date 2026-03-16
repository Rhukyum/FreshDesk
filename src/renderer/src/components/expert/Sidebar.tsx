import { useEffect, useRef } from 'react'
import { Cpu, HardDrive, MemoryStick, Clock, Wifi, Trash2, Zap, Shield, Search, Settings, LayoutGrid } from 'lucide-react'
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
  const { activeCategory, setActiveCategory, systemStats, setSystemStats, commands } = useAppStore()
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const fetchStats = async () => {
    const stats = await window.api.getSystemStats()
    setSystemStats(stats)
  }

  useEffect(() => {
    fetchStats()
    timerRef.current = setInterval(fetchStats, 3000)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

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

      {/* Divider */}
      <div className="h-px bg-expert-border mx-3 my-1" />

      {/* System stats */}
      <div className="p-3">
        <div className="text-xs font-semibold text-expert-muted uppercase tracking-wider px-2 py-1.5 mb-2">
          Système
        </div>
        <div className="space-y-2.5 px-2">
          <StatRow icon={<Cpu className="w-3.5 h-3.5" />} label="CPU" value={systemStats?.cpu ?? 0} suffix="%" />
          <StatRow
            icon={<MemoryStick className="w-3.5 h-3.5" />}
            label={`RAM${systemStats?.ramTotal ? ` (${systemStats.ramTotal}GB)` : ''}`}
            value={systemStats?.ram ?? 0}
            suffix="%"
          />
          <StatRow
            icon={<HardDrive className="w-3.5 h-3.5" />}
            label={`Disque${systemStats?.diskFreeGB ? ` (${systemStats.diskFreeGB}GB libres)` : ''}`}
            value={systemStats?.disk ?? 0}
            suffix="%"
          />
          <div className="flex items-center gap-2 text-xs text-expert-muted">
            <Clock className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Uptime:</span>
            <span className="text-expert-text">{systemStats?.uptime ?? '—'}</span>
          </div>
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Snapshot button */}
      <div className="p-3 border-t border-expert-border">
        <button
          onClick={onSnapshot}
          className="w-full expert-btn text-center"
        >
          📸 Snapshot registre
        </button>
      </div>
    </div>
  )
}

function StatRow({
  icon,
  label,
  value,
  suffix
}: {
  icon: React.ReactNode
  label: string
  value: number
  suffix: string
}) {
  const color =
    value > 85 ? 'bg-red-500' : value > 65 ? 'bg-amber-400' : 'bg-expert-accent'

  return (
    <div>
      <div className="flex items-center gap-2 text-xs text-expert-muted mb-1">
        <span className="flex-shrink-0">{icon}</span>
        <span className="truncate flex-1">{label}</span>
        <span className="text-expert-text font-mono">{value}{suffix}</span>
      </div>
      <div className="w-full h-1.5 bg-expert-border rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${Math.min(value, 100)}%` }}
        />
      </div>
    </div>
  )
}
