import { Wrench, Shield, Minus, Square, X } from 'lucide-react'
import { useAppStore } from '../../store/app.store'
import { cn } from '../../lib/utils'

export default function TopBar() {
  const { mode, setMode, adminInfo } = useAppStore()
  const isNoob = mode === 'noob'

  const handleSetMode = (newMode: 'noob' | 'expert') => {
    setMode(newMode)
    window.api.saveSettings({ mode: newMode })
  }

  return (
    <div
      className={cn(
        'flex items-center justify-between px-4 h-12 select-none drag-region flex-shrink-0',
        isNoob
          ? 'bg-white border-b border-noob-border'
          : 'bg-expert-surface border-b border-expert-border'
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 no-drag">
        <div
          className={cn(
            'w-7 h-7 rounded-lg flex items-center justify-center',
            isNoob ? 'bg-noob-primary' : 'bg-expert-accent'
          )}
        >
          <Wrench className="w-4 h-4 text-white" />
        </div>
        <span
          className={cn(
            'font-bold text-sm',
            isNoob ? 'text-noob-text' : 'text-expert-text'
          )}
        >
          FreshDesk
        </span>
      </div>

      {/* Mode toggle */}
      <div
        className={cn(
          'flex rounded-lg p-0.5 no-drag',
          isNoob ? 'bg-noob-accent' : 'bg-expert-bg'
        )}
      >
        <button
          onClick={() => handleSetMode('noob')}
          className={cn(
            'px-4 py-1 rounded-md text-xs font-semibold transition-all duration-200',
            isNoob
              ? 'bg-white text-noob-primary shadow-sm'
              : 'text-expert-muted hover:text-expert-text'
          )}
        >
          Simple
        </button>
        <button
          onClick={() => handleSetMode('expert')}
          className={cn(
            'px-4 py-1 rounded-md text-xs font-semibold transition-all duration-200',
            !isNoob
              ? 'bg-expert-surface text-expert-accent shadow-sm'
              : 'text-noob-muted hover:text-noob-text'
          )}
        >
          Expert
        </button>
      </div>

      {/* Right: admin badge + window controls */}
      <div className="flex items-center gap-3 no-drag">
        {adminInfo && (
          <div
            className={cn(
              'flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium',
              adminInfo.isAdmin
                ? 'bg-green-100 text-green-700'
                : 'bg-amber-100 text-amber-700'
            )}
          >
            <Shield className="w-3 h-3" />
            {adminInfo.isAdmin ? 'Admin' : 'Standard'}
          </div>
        )}

        {/* Window controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => window.api.minimizeWindow()}
            className={cn(
              'w-7 h-7 flex items-center justify-center rounded-md transition-colors',
              isNoob ? 'hover:bg-gray-100 text-gray-500' : 'hover:bg-white/10 text-expert-muted'
            )}
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => window.api.maximizeWindow()}
            className={cn(
              'w-7 h-7 flex items-center justify-center rounded-md transition-colors',
              isNoob ? 'hover:bg-gray-100 text-gray-500' : 'hover:bg-white/10 text-expert-muted'
            )}
          >
            <Square className="w-3 h-3" />
          </button>
          <button
            onClick={() => window.api.closeWindow()}
            className={cn(
              'w-7 h-7 flex items-center justify-center rounded-md transition-colors hover:bg-red-500 hover:text-white',
              isNoob ? 'text-gray-500' : 'text-expert-muted'
            )}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
