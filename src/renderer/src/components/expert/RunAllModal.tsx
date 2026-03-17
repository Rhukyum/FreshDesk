import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckSquare, Square, Play } from 'lucide-react'
import { useAppStore, CommandMeta } from '../../store/app.store'
import RiskBadge from '../shared/RiskBadge'

interface Props {
  open: boolean
  onClose: () => void
  onRun: (ids: string[]) => void
}

const categoryLabels: Record<Exclude<CommandMeta['category'], 'all'>, string> = {
  network: 'Réseau',
  maintenance: 'Nettoyage',
  performance: 'Vitesse',
  security: 'Sécurité',
  diagnostics: 'Diagnostic',
  system: 'Système'
}

export default function RunAllModal({ open, onClose, onRun }: Props) {
  const { commands } = useAppStore()
  const [selected, setSelected] = useState<Set<string>>(new Set())

  // Pre-select all commands when modal opens
  useEffect(() => {
    if (open) {
      setSelected(new Set(commands.map((c) => c.id)))
    }
  }, [open, commands])

  const toggleAll = (val: boolean) => {
    if (val) setSelected(new Set(commands.map((c) => c.id)))
    else setSelected(new Set())
  }

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleRun = () => {
    const ids = commands.filter((c) => selected.has(c.id)).map((c) => c.id)
    if (ids.length === 0) return
    onClose()
    onRun(ids)
  }

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center text-expert-text">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 8 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="relative z-10 w-[500px] max-h-[75vh] bg-expert-surface border border-expert-border rounded-xl flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-expert-border flex-shrink-0">
              <div>
                <h2 className="text-expert-text font-semibold text-sm">Tout lancer</h2>
                <p className="text-expert-muted text-xs mt-0.5">
                  Sélectionne les commandes à exécuter en séquence
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 text-expert-muted hover:text-expert-text rounded-lg hover:bg-expert-bg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Selection toolbar */}
            <div className="flex items-center gap-3 px-4 py-2 border-b border-expert-border bg-expert-bg flex-shrink-0">
              <button
                onClick={() => toggleAll(true)}
                className="flex items-center gap-1.5 text-xs text-expert-accent hover:text-blue-300 transition-colors"
              >
                <CheckSquare className="w-3.5 h-3.5" />
                Tout cocher
              </button>
              <span className="text-expert-border text-xs">|</span>
              <button
                onClick={() => toggleAll(false)}
                className="flex items-center gap-1.5 text-xs text-expert-muted hover:text-expert-text transition-colors"
              >
                <Square className="w-3.5 h-3.5" />
                Tout décocher
              </button>
              <span className="ml-auto text-xs text-expert-muted">
                {selected.size} / {commands.length} sélectionné{selected.size > 1 ? 's' : ''}
              </span>
            </div>

            {/* Command list */}
            <div className="flex-1 overflow-y-auto">
              {commands.map((cmd) => {
                const isSelected = selected.has(cmd.id)
                return (
                  <div
                    key={cmd.id}
                    onClick={() => toggle(cmd.id)}
                    className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer border-b border-expert-border/40 transition-colors ${
                      isSelected ? 'bg-expert-accent/5 hover:bg-expert-accent/10' : 'hover:bg-expert-bg'
                    }`}
                  >
                    {/* Checkbox */}
                    <div
                      className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'bg-expert-accent border-expert-accent'
                          : 'border-expert-muted bg-transparent'
                      }`}
                    >
                      {isSelected && (
                        <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 10 10" fill="none">
                          <path
                            d="M1.5 5 L4 7.5 L8.5 2.5"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </div>

                    {/* Command info */}
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-expert-text truncate">{cmd.label}</div>
                      <div className="text-xs text-expert-muted">{categoryLabels[cmd.category]}</div>
                    </div>

                    {/* Risk badge */}
                    <RiskBadge risk={cmd.risk} />
                  </div>
                )
              })}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-4 py-3 border-t border-expert-border flex-shrink-0">
              <button
                onClick={onClose}
                className="text-xs text-expert-muted hover:text-expert-text px-4 py-2 rounded-lg hover:bg-expert-bg transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleRun}
                disabled={selected.size === 0}
                className="expert-btn flex items-center gap-2 px-5 py-2 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Play className="w-3.5 h-3.5" />
                Lancer {selected.size} commande{selected.size !== 1 ? 's' : ''}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  )
}
