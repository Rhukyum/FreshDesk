import { motion, AnimatePresence } from 'framer-motion'
import { Download, X, RefreshCw } from 'lucide-react'

interface Props {
  open: boolean
  version: string
  downloadPercent: number | null
  onUpdate: () => void
  onSkip: () => void
}

export default function UpdateDialog({ open, version, downloadPercent, onUpdate, onSkip }: Props) {
  const isDownloading = downloadPercent !== null && downloadPercent < 100

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          />
          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[400px]"
          >
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-5 text-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <RefreshCw className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base">Mise à jour disponible</h3>
                    <p className="text-blue-100 text-sm">FreshDesk v{version}</p>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="px-6 py-5">
                {!isDownloading ? (
                  <>
                    <p className="text-gray-600 text-sm leading-relaxed mb-5">
                      Une nouvelle version de FreshDesk est disponible. Voulez-vous mettre à jour maintenant ?
                      L'application redémarrera automatiquement après le téléchargement.
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={onSkip}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-500 text-sm font-medium hover:bg-gray-50 transition-colors"
                      >
                        <X className="w-4 h-4" />
                        Plus tard
                      </button>
                      <button
                        onClick={onUpdate}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        Mettre à jour
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-gray-600 text-sm mb-4">
                      Téléchargement de la mise à jour en cours...
                    </p>
                    <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden mb-2">
                      <motion.div
                        className="h-full bg-blue-600 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${downloadPercent}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                    <p className="text-blue-600 text-sm font-semibold text-right">
                      {downloadPercent}%
                    </p>
                    <p className="text-gray-400 text-xs mt-3 text-center">
                      L'application redémarrera automatiquement à la fin du téléchargement.
                    </p>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
