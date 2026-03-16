import { useEffect } from 'react'
import { useAppStore } from '../../store/app.store'
import { cn } from '../../lib/utils'
import { RefreshCw } from 'lucide-react'

export default function LogViewer() {
  const { logs, setLogs } = useAppStore()

  const loadLogs = async () => {
    const data = await window.api.getLogs(100)
    setLogs(data)
  }

  useEffect(() => {
    loadLogs()
  }, [])

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-3 py-2 border-b border-expert-border bg-expert-surface flex-shrink-0">
        <span className="text-xs font-semibold text-expert-muted uppercase tracking-wider">Logs</span>
        <button
          onClick={loadLogs}
          className="p-1.5 text-expert-muted hover:text-expert-text rounded transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {logs.length === 0 ? (
          <div className="flex items-center justify-center h-20 text-expert-muted text-xs">
            Aucun log disponible
          </div>
        ) : (
          <table className="w-full text-xs">
            <tbody>
              {logs.map((log, i) => (
                <tr key={i} className="border-b border-expert-border/50 hover:bg-expert-surface-hover">
                  <td className="px-3 py-1.5 text-expert-muted font-mono whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </td>
                  <td className="px-2 py-1.5 whitespace-nowrap">
                    <span
                      className={cn(
                        'px-1.5 py-0.5 rounded text-xs font-semibold',
                        log.level === 'SUCCESS' ? 'bg-green-500/15 text-green-400' :
                        log.level === 'ERROR' ? 'bg-red-500/15 text-red-400' :
                        log.level === 'WARN' ? 'bg-amber-500/15 text-amber-400' :
                        'bg-expert-accent/10 text-expert-accent'
                      )}
                    >
                      {log.level}
                    </span>
                  </td>
                  <td className="px-2 py-1.5 text-expert-muted font-mono">
                    {log.commandId}
                  </td>
                  <td className="px-2 py-1.5 text-expert-text truncate max-w-[200px]">
                    {log.message}
                  </td>
                  {log.duration !== undefined && (
                    <td className="px-2 py-1.5 text-expert-muted text-right whitespace-nowrap">
                      {log.duration}ms
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
