import { useState } from 'react'
import { Play, Square, Search, RotateCw } from 'lucide-react'
import { useAppStore, CommandMeta } from '../../store/app.store'
import RiskBadge from '../shared/RiskBadge'
import { cn } from '../../lib/utils'

interface Props {
  onRun: (id: string) => void
  selectedId: string | null
  onSelect: (cmd: CommandMeta) => void
  onRunAll: () => void
}

const categoryLabels: Record<string, string> = {
  network: 'Réseau',
  maintenance: 'Maintenance',
  performance: 'Performance',
  security: 'Sécurité',
  diagnostics: 'Diagnostics',
  system: 'Système'
}

export default function CommandTable({ onRun, selectedId, onSelect, onRunAll }: Props) {
  const { commands, activeCategory, isRunning, currentCommandId, searchQuery, setSearchQuery } = useAppStore()

  const filtered = commands.filter((c) => {
    const matchesCat = activeCategory === 'all' || c.category === activeCategory
    const q = searchQuery.toLowerCase()
    const matchesSearch =
      !q ||
      c.label.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.category.includes(q)
    return matchesCat && matchesSearch
  })

  return (
    <div className="flex flex-col h-full">
      {/* Search bar + Run All button */}
      <div className="px-3 py-2 border-b border-expert-border flex items-center gap-2">
        <div className="flex items-center gap-2 bg-expert-bg rounded-lg px-3 py-1.5 flex-1 min-w-0">
          <Search className="w-3.5 h-3.5 text-expert-muted flex-shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher une commande..."
            className="bg-transparent text-expert-text text-sm outline-none w-full placeholder:text-expert-muted"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="text-expert-muted hover:text-expert-text">
              <Square className="w-3 h-3" />
            </button>
          )}
        </div>
        <button
          onClick={onRunAll}
          disabled={isRunning}
          title="Tout lancer"
          className="flex items-center gap-1.5 expert-btn py-1.5 px-3 flex-shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Play className="w-3.5 h-3.5" />
          <span className="text-xs whitespace-nowrap">Tout lancer</span>
        </button>
      </div>

      {/* Table header */}
      <div className="grid grid-cols-[1fr_90px_80px_40px] gap-2 px-3 py-2 border-b border-expert-border text-xs font-semibold text-expert-muted uppercase tracking-wider">
        <div>Commande</div>
        <div>Catégorie</div>
        <div>Risque</div>
        <div></div>
      </div>

      {/* Table rows */}
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center h-32 text-expert-muted text-sm">
            <Search className="w-8 h-8 mb-2 opacity-30" />
            Aucune commande trouvée
          </div>
        )}
        {filtered.map((cmd) => {
          const isThisRunning = isRunning && currentCommandId === cmd.id
          const isSelected = selectedId === cmd.id
          return (
            <div
              key={cmd.id}
              onClick={() => onSelect(cmd)}
              className={cn(
                'grid grid-cols-[1fr_90px_80px_40px] gap-2 items-center px-3 py-2.5 expert-row cursor-pointer',
                isSelected && 'bg-expert-accent/10 border-l-2 border-l-expert-accent',
                isThisRunning && 'bg-expert-accent/5'
              )}
            >
              {/* Name + desc */}
              <div className="min-w-0">
                <div className="text-expert-text text-sm font-medium truncate flex items-center gap-1.5">
                  {isThisRunning && (
                    <div className="w-1.5 h-1.5 rounded-full bg-expert-accent animate-pulse flex-shrink-0" />
                  )}
                  {cmd.label}
                  {cmd.hasRollback && (
                    <RotateCw className="w-3 h-3 text-expert-muted opacity-50 flex-shrink-0" />
                  )}
                </div>
                <div className="text-expert-muted text-xs truncate mt-0.5 opacity-70">
                  {cmd.description}
                </div>
              </div>

              {/* Category */}
              <div className="text-xs text-expert-muted">
                {categoryLabels[cmd.category] || cmd.category}
              </div>

              {/* Risk badge */}
              <div>
                <RiskBadge risk={cmd.risk} />
              </div>

              {/* Run button */}
              <div className="flex justify-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onRun(cmd.id)
                  }}
                  disabled={isRunning}
                  className={cn(
                    'w-7 h-7 rounded-md flex items-center justify-center transition-all duration-150',
                    isRunning
                      ? 'opacity-30 cursor-not-allowed'
                      : 'bg-expert-accent/10 hover:bg-expert-accent/20 text-expert-accent'
                  )}
                >
                  <Play className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
