import { useAppStore } from '../../store/app.store'
import { cn } from '../../lib/utils'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'

export default function StatusBar() {
  const { mode, isRunning, progress, lastSuccess, currentCommandId } = useAppStore()
  const isNoob = mode === 'noob'

  return (
    <div
      className={cn(
        'flex items-center justify-between px-4 h-7 text-xs flex-shrink-0',
        isNoob
          ? 'bg-noob-accent border-t border-noob-border text-noob-muted'
          : 'bg-expert-surface border-t border-expert-border text-expert-muted'
      )}
    >
      {/* Left: status message */}
      <div className="flex items-center gap-2">
        {isRunning ? (
          <>
            <Loader2 className="w-3 h-3 animate-spin" />
            <span>{progress?.message || (currentCommandId ? `Running: ${currentCommandId}` : 'Running...')}</span>
          </>
        ) : lastSuccess === true ? (
          <>
            <CheckCircle className="w-3 h-3 text-green-500" />
            <span className="text-green-600">Completed successfully</span>
          </>
        ) : lastSuccess === false ? (
          <>
            <XCircle className="w-3 h-3 text-red-500" />
            <span className="text-red-500">Command failed</span>
          </>
        ) : (
          <span>Ready</span>
        )}
      </div>

      {/* Right: progress bar */}
      {isRunning && progress && (
        <div className="flex items-center gap-2">
          <span className="text-xs opacity-60">
            {progress.step}/{progress.total}
          </span>
          <div
            className={cn(
              'w-32 h-1.5 rounded-full overflow-hidden',
              isNoob ? 'bg-noob-border' : 'bg-expert-border'
            )}
          >
            <div
              className={cn(
                'h-full rounded-full transition-all duration-300',
                isNoob ? 'bg-noob-primary' : 'bg-expert-accent'
              )}
              style={{ width: `${progress.percent}%` }}
            />
          </div>
          <span className="text-xs opacity-60">{progress.percent}%</span>
        </div>
      )}

      {/* Version */}
      {!isRunning && (
        <span className="opacity-40">v2.0.0</span>
      )}
    </div>
  )
}
