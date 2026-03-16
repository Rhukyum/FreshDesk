import { motion } from 'framer-motion'
import { useAppStore } from '../../store/app.store'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'

interface Props {
  onDone: () => void
}

export default function NoobProgressView({ onDone }: Props) {
  const { progress, output, isRunning, lastSuccess } = useAppStore()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full flex flex-col items-center justify-center p-8"
    >
      <div className="w-full max-w-md text-center">
        {/* Progress ring */}
        <div className="relative w-28 h-28 mx-auto mb-6">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="52" stroke="#E2E8F0" strokeWidth="10" fill="none" />
            <motion.circle
              cx="60"
              cy="60"
              r="52"
              stroke="#2563EB"
              strokeWidth="10"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={327}
              strokeDashoffset={327 - (327 * (progress?.percent ?? 0)) / 100}
              transition={{ duration: 0.4 }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            {isRunning ? (
              <Loader2 className="w-7 h-7 text-noob-primary animate-spin" />
            ) : lastSuccess ? (
              <CheckCircle className="w-7 h-7 text-green-500" />
            ) : (
              <XCircle className="w-7 h-7 text-red-500" />
            )}
          </div>
        </div>

        <h3 className="font-semibold text-noob-text text-lg mb-1">
          {isRunning ? 'Réparation en cours...' : lastSuccess ? 'Tout est réparé !' : 'Terminé'}
        </h3>

        {progress && isRunning && (
          <p className="text-noob-muted text-sm mb-4">{progress.message}</p>
        )}

        {/* Last output lines */}
        <div className="text-left bg-noob-accent border border-noob-border rounded-xl p-4 mt-4 text-xs font-mono text-noob-muted max-h-40 overflow-y-auto">
          {output.slice(-8).map((line, i) => (
            <div key={i} className={line.type === 'stderr' ? 'text-red-500' : line.type === 'system' ? 'text-noob-primary' : ''}>
              {line.text}
            </div>
          ))}
          {output.length === 0 && <span className="opacity-50">En attente...</span>}
        </div>

        {!isRunning && (
          <motion.button
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={onDone}
            className="mt-6 noob-btn-primary px-8 py-3"
          >
            Retour à l'accueil
          </motion.button>
        )}
      </div>
    </motion.div>
  )
}
