import { useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Check, Minus, ChevronDown, ChevronUp } from 'lucide-react'
import { CommandMeta } from '../../store/app.store'

const OPTIMAL_IDS = [
  'flush-dns',
  'clean-temp',
  'clean-prefetch',
  'reset-print-queue',
  'check-defender',
  'check-uac'
]

const CATEGORY_LABELS: Record<string, string> = {
  network: 'Réseau',
  maintenance: 'Maintenance',
  performance: 'Performance',
  security: 'Sécurité',
  diagnostics: 'Diagnostics',
  system: 'Système'
}

interface Props {
  open: boolean
  commands: CommandMeta[]
  onConfirm: (ids: string[]) => void
  onCancel: () => void
}

export default function FixAllDialog({ open, commands, onConfirm, onCancel }: Props) {
  // Only show noob-safe commands
  const eligibleCommands = commands.filter(
    (c) =>
      (c.mode === 'noob' || c.mode === 'both') &&
      (c.risk === 'low' || c.risk === 'medium') &&
      (c.noobLabel || c.label)
  )

  const [selected, setSelected] = useState<Set<string>>(new Set(OPTIMAL_IDS))
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(['network', 'maintenance', 'security'])
  )

  const toggle = useCallback((id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const selectAll = () => setSelected(new Set(eligibleCommands.map((c) => c.id)))
  const deselectAll = () => setSelected(new Set())
  const selectOptimal = () => setSelected(new Set(OPTIMAL_IDS.filter((id) => eligibleCommands.find((c) => c.id === id))))

  const toggleCategory = (cat: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev)
      if (next.has(cat)) next.delete(cat)
      else next.add(cat)
      return next
    })
  }

  // Group by category
  const byCategory = eligibleCommands.reduce<Record<string, CommandMeta[]>>((acc, cmd) => {
    if (!acc[cmd.category]) acc[cmd.category] = []
    acc[cmd.category].push(cmd)
    return acc
  }, {})

  const categories = Object.keys(byCategory)

  const handleConfirm = () => {
    // Preserve original command order
    const orderedIds = eligibleCommands.filter((c) => selected.has(c.id)).map((c) => c.id)
    if (orderedIds.length > 0) onConfirm(orderedIds)
  }

  // Check if all in category are selected
  const isCategoryAllSelected = (cat: string) =>
    byCategory[cat]?.every((c) => selected.has(c.id)) ?? false
  const isCategoryPartialSelected = (cat: string) =>
    byCategory[cat]?.some((c) => selected.has(c.id)) && !isCategoryAllSelected(cat)

  const toggleCategorySelect = (cat: string) => {
    const all = isCategoryAllSelected(cat)
    setSelected((prev) => {
      const next = new Set(prev)
      byCategory[cat]?.forEach((c) => {
        if (all) next.delete(c.id)
        else next.add(c.id)
      })
      return next
    })
  }

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            onClick={onCancel}
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[480px] max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white rounded-2xl shadow-2xl border border-noob-border flex flex-col overflow-hidden">
              {/* Header */}
              <div className="px-6 pt-6 pb-4 border-b border-noob-border flex-shrink-0">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-noob-primary/10 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-noob-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-noob-text text-base">Réparer et optimiser mon PC</h3>
                    <p className="text-noob-muted text-xs mt-0.5">
                      {selected.size} correction{selected.size !== 1 ? 's' : ''} sélectionnée{selected.size !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>

                {/* Preset buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={selectOptimal}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-noob-primary text-white rounded-lg hover:bg-noob-primary-hover transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Optimal
                  </button>
                  <button
                    onClick={selectAll}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-noob-accent text-noob-text rounded-lg border border-noob-border hover:bg-gray-100 transition-colors"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Tout cocher
                  </button>
                  <button
                    onClick={deselectAll}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-noob-accent text-noob-muted rounded-lg border border-noob-border hover:bg-gray-100 transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                    Tout décocher
                  </button>
                </div>
              </div>

              {/* Scrollable command list */}
              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
                {categories.map((cat) => (
                  <div key={cat} className="border border-noob-border rounded-xl overflow-hidden">
                    {/* Category header */}
                    <button
                      className="w-full flex items-center gap-3 px-4 py-3 bg-noob-accent hover:bg-gray-50 transition-colors"
                      onClick={() => toggleCategory(cat)}
                    >
                      {/* Category checkbox */}
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleCategorySelect(cat) }}
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                          isCategoryAllSelected(cat)
                            ? 'bg-noob-primary border-noob-primary'
                            : isCategoryPartialSelected(cat)
                            ? 'bg-noob-primary/40 border-noob-primary'
                            : 'bg-white border-gray-300'
                        }`}
                      >
                        {isCategoryAllSelected(cat) && <Check className="w-3 h-3 text-white" />}
                        {isCategoryPartialSelected(cat) && <Minus className="w-3 h-3 text-white" />}
                      </button>
                      <span className="flex-1 text-left text-sm font-semibold text-noob-text">
                        {CATEGORY_LABELS[cat] ?? cat}
                      </span>
                      <span className="text-xs text-noob-muted">
                        {byCategory[cat].filter((c) => selected.has(c.id)).length}/{byCategory[cat].length}
                      </span>
                      {expandedCategories.has(cat) ? (
                        <ChevronUp className="w-4 h-4 text-noob-muted" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-noob-muted" />
                      )}
                    </button>

                    {/* Commands */}
                    {expandedCategories.has(cat) && (
                      <div className="divide-y divide-noob-border bg-white">
                        {byCategory[cat].map((cmd) => (
                          <button
                            key={cmd.id}
                            onClick={() => toggle(cmd.id)}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-noob-accent/50 transition-colors text-left"
                          >
                            <div
                              className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                                selected.has(cmd.id)
                                  ? 'bg-noob-primary border-noob-primary'
                                  : 'bg-white border-gray-300'
                              }`}
                            >
                              {selected.has(cmd.id) && <Check className="w-3 h-3 text-white" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-noob-text truncate">
                                {cmd.noobLabel || cmd.label}
                              </p>
                              {cmd.noobDesc && (
                                <p className="text-xs text-noob-muted truncate mt-0.5">
                                  {cmd.noobDesc}
                                </p>
                              )}
                            </div>
                            {cmd.risk === 'medium' && (
                              <span className="text-xs bg-yellow-50 text-yellow-600 px-2 py-0.5 rounded-full border border-yellow-200 flex-shrink-0">
                                moyen
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-noob-border flex gap-3 flex-shrink-0 bg-white">
                <button
                  onClick={onCancel}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-noob-border text-noob-muted text-sm font-medium hover:bg-noob-accent transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={selected.size === 0}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-noob-primary text-white text-sm font-semibold hover:bg-noob-primary-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Lancer {selected.size > 0 ? `(${selected.size})` : ''}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  )
}
