import { useEffect, useRef } from 'react'
import { Copy, Trash2, StopCircle } from 'lucide-react'
import { useAppStore } from '../../store/app.store'
import { cn } from '../../lib/utils'

export default function OutputPanel() {
  const { output, isRunning, clearOutput } = useAppStore()
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [output])

  const copyOutput = () => {
    const text = output.map((l) => l.text).join('\n')
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-expert-border bg-expert-surface flex-shrink-0">
        <span className="text-xs font-semibold text-expert-muted uppercase tracking-wider">Output</span>
        <div className="flex items-center gap-1.5">
          {isRunning && (
            <button
              onClick={() => window.api.stopCommand()}
              className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 transition-colors"
            >
              <StopCircle className="w-3.5 h-3.5" />
              Arrêter
            </button>
          )}
          <button
            onClick={copyOutput}
            className="p-1.5 text-expert-muted hover:text-expert-text rounded transition-colors"
            title="Copier"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={clearOutput}
            className="p-1.5 text-expert-muted hover:text-expert-text rounded transition-colors"
            title="Effacer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Terminal */}
      <div className="flex-1 overflow-y-auto terminal p-3">
        {output.length === 0 ? (
          <span className="text-expert-terminal-text/30">
            Sélectionne une commande et clique sur Exécuter...
          </span>
        ) : (
          output.map((line, i) => (
            <div
              key={i}
              className={cn(
                'leading-5',
                line.type === 'stderr' && 'text-red-400',
                line.type === 'system' && 'text-expert-accent font-semibold'
              )}
            >
              {line.text}
            </div>
          ))
        )}
        {isRunning && (
          <div className="flex items-center gap-1 text-expert-terminal-text/60 mt-1">
            <span className="animate-pulse">▌</span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  )
}
