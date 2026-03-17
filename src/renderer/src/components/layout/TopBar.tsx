import { useState } from 'react'
import { createPortal } from 'react-dom'
import { Minus, Square, X, AlertTriangle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '../../store/app.store'
import { cn } from '../../lib/utils'
import FreshDeskLogo from '../shared/FreshDeskLogo'

export default function TopBar() {
  const { mode, setMode } = useAppStore()
  const isNoob = mode === 'noob'
  const [showExpertWarning, setShowExpertWarning] = useState(false)

  const handleSetMode = (newMode: 'noob' | 'expert') => {
    if (newMode === 'expert' && mode !== 'expert') {
      setShowExpertWarning(true)
      return
    }
    setMode(newMode)
    window.api.saveSettings({ mode: newMode })
  }

  const confirmExpert = () => {
    setShowExpertWarning(false)
    setMode('expert')
    window.api.saveSettings({ mode: 'expert' })
  }

  return (
    <>
      <div
        className={cn(
          'flex items-center h-11 px-3 gap-2 select-none drag-region flex-shrink-0',
          isNoob
            ? 'bg-white border-b border-noob-border'
            : 'bg-expert-surface border-b border-expert-border'
        )}
      >
        {/* Logo — fixed width, no shrink */}
        <div className="flex items-center gap-2 no-drag flex-shrink-0">
          <FreshDeskLogo size={26} />
          <span
            className={cn(
              'font-bold text-sm whitespace-nowrap',
              isNoob ? 'text-noob-text' : 'text-expert-text'
            )}
          >
            FreshDesk
          </span>
        </div>

        {/* Mode toggle — centered, can shrink */}
        <div className="flex-1 flex justify-center no-drag">
          <div
            className={cn(
              'flex rounded-lg p-0.5',
              isNoob ? 'bg-noob-accent' : 'bg-expert-bg'
            )}
          >
            <button
              onClick={() => handleSetMode('noob')}
              className={cn(
                'px-4 py-1 rounded-md text-xs font-semibold transition-all duration-200 whitespace-nowrap',
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
                'px-4 py-1 rounded-md text-xs font-semibold transition-all duration-200 whitespace-nowrap',
                !isNoob
                  ? 'bg-expert-surface text-expert-accent shadow-sm'
                  : 'text-noob-muted hover:text-noob-text'
              )}
            >
              Expert
            </button>
          </div>
        </div>

        {/* Right: window controls — fixed, no shrink */}
        <div className="flex items-center gap-2 no-drag flex-shrink-0">
          {/* Window controls */}
          <div className="flex items-center gap-0.5 ml-1">
            <WindowBtn
              onClick={() => window.api.minimizeWindow()}
              title="Réduire"
              hoverColor={isNoob ? 'hover:bg-amber-100 hover:text-amber-600' : 'hover:bg-amber-500/20 hover:text-amber-400'}
              baseColor={isNoob ? 'text-gray-400' : 'text-expert-muted'}
            >
              <Minus className="w-3 h-3" />
            </WindowBtn>
            <WindowBtn
              onClick={() => window.api.maximizeWindow()}
              title="Agrandir"
              hoverColor={isNoob ? 'hover:bg-emerald-100 hover:text-emerald-600' : 'hover:bg-emerald-500/20 hover:text-emerald-400'}
              baseColor={isNoob ? 'text-gray-400' : 'text-expert-muted'}
            >
              <Square className="w-3 h-3" />
            </WindowBtn>
            <WindowBtn
              onClick={() => window.api.closeWindow()}
              title="Fermer"
              hoverColor="hover:bg-red-500 hover:text-white"
              baseColor={isNoob ? 'text-gray-400' : 'text-expert-muted'}
            >
              <X className="w-3 h-3" />
            </WindowBtn>
          </div>
        </div>
      </div>

      {/* Expert mode warning dialog */}
      {createPortal(
        <AnimatePresence>
          {showExpertWarning && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/50"
                onClick={() => setShowExpertWarning(false)}
              />
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 8 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="relative z-10 w-[420px] bg-white rounded-2xl shadow-2xl border border-gray-100 p-6"
              >
              {/* Warning icon */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h2 className="font-bold text-gray-900 text-base">Mode Expert</h2>
                  <p className="text-xs text-gray-500">Réservé aux utilisateurs avancés</p>
                </div>
              </div>

              <div className="space-y-2 mb-5">
                <p className="text-sm text-gray-700 leading-relaxed">
                  Le mode Expert donne accès à <strong>toutes les commandes</strong>, y compris des
                  opérations à risque élevé ou critique pouvant modifier profondément votre système.
                </p>
                <ul className="text-xs text-gray-500 space-y-1 pl-4">
                  <li className="flex items-start gap-1.5">
                    <span className="text-amber-500 mt-0.5 flex-shrink-0">⚠</span>
                    Certaines commandes peuvent rendre le PC instable si mal utilisées
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-amber-500 mt-0.5 flex-shrink-0">⚠</span>
                    Les opérations critiques ne sont pas réversibles automatiquement
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-amber-500 mt-0.5 flex-shrink-0">⚠</span>
                    Utilisez uniquement si vous savez ce que vous faites
                  </li>
                </ul>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowExpertWarning(false)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={confirmExpert}
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold transition-colors shadow-sm"
                >
                  Je comprends, continuer
                </button>
              </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  )
}

function WindowBtn({
  children,
  onClick,
  title,
  hoverColor,
  baseColor
}: {
  children: React.ReactNode
  onClick: () => void
  title: string
  hoverColor: string
  baseColor: string
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={cn(
        'w-7 h-7 flex items-center justify-center rounded-lg transition-all duration-150',
        baseColor,
        hoverColor
      )}
    >
      {children}
    </button>
  )
}
