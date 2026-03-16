import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CommandMeta } from '../../store/app.store'
import { ArrowLeft, Play, CheckCircle, Loader2 } from 'lucide-react'
import ConfirmDialog from './ConfirmDialog'

interface Props {
  category: CommandMeta['category']
  commands: CommandMeta[]
  onBack: () => void
  onRun: (id: string) => void
  isRunning: boolean
  currentCommandId: string | null
}

const categoryLabels: Record<CommandMeta['category'], string> = {
  network: 'Réseau',
  maintenance: 'Nettoyage',
  performance: 'Vitesse',
  security: 'Sécurité',
  diagnostics: 'Diagnostic',
  system: 'Système'
}

export default function NoobCommandList({ category, commands, onBack, onRun, isRunning, currentCommandId }: Props) {
  const [pendingCommand, setPendingCommand] = useState<CommandMeta | null>(null)

  const noobCommands = commands.filter(
    (c) =>
      c.category === category &&
      (c.mode === 'noob' || c.mode === 'both') &&
      (c.risk === 'low' || c.risk === 'medium')
  )

  const handleRunClick = (cmd: CommandMeta) => {
    setPendingCommand(cmd)
  }

  const handleConfirm = () => {
    if (pendingCommand) {
      onRun(pendingCommand.id)
      setPendingCommand(null)
    }
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="h-full flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-noob-border">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-noob-muted hover:text-noob-text transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </button>
          <div className="w-px h-4 bg-noob-border" />
          <h2 className="font-semibold text-noob-text">{categoryLabels[category]}</h2>
        </div>

        {/* Command list */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-3 max-w-xl mx-auto">
            <AnimatePresence>
              {noobCommands.map((cmd, i) => {
                const isThisRunning = isRunning && currentCommandId === cmd.id
                return (
                  <motion.div
                    key={cmd.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="noob-card flex items-center justify-between gap-4"
                  >
                    <div className="min-w-0">
                      <div className="font-semibold text-noob-text text-sm">{cmd.noobLabel || cmd.label}</div>
                      <div className="text-noob-muted text-xs mt-0.5 leading-relaxed">
                        {cmd.noobDesc || cmd.description}
                      </div>
                    </div>
                    <button
                      onClick={() => handleRunClick(cmd)}
                      disabled={isRunning}
                      className="flex-shrink-0 w-10 h-10 rounded-xl bg-noob-primary hover:bg-noob-primary-hover disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-200 hover:shadow-md hover:shadow-noob-primary/25"
                    >
                      {isThisRunning ? (
                        <Loader2 className="w-4 h-4 text-white animate-spin" />
                      ) : (
                        <Play className="w-4 h-4 text-white" />
                      )}
                    </button>
                  </motion.div>
                )
              })}
            </AnimatePresence>

            {noobCommands.length === 0 && (
              <div className="text-center text-noob-muted py-12">
                <CheckCircle className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p>Aucune action disponible dans cette catégorie.</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      <ConfirmDialog
        open={!!pendingCommand}
        title={`Lancer : ${pendingCommand?.noobLabel || pendingCommand?.label || ''}`}
        description={pendingCommand?.noobDesc || pendingCommand?.description || ''}
        onConfirm={handleConfirm}
        onCancel={() => setPendingCommand(null)}
      />
    </>
  )
}
