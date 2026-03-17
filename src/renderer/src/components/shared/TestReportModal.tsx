import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, ClipboardList, X } from 'lucide-react'
import { TestReport } from '../../store/app.store'

interface Props {
  report: TestReport | null
  onClose: () => void
}

const CATEGORY_LABELS: Record<string, string> = {
  network: 'Réseau',
  maintenance: 'Maintenance',
  performance: 'Performance',
  security: 'Sécurité',
  diagnostics: 'Diagnostics',
  system: 'Système'
}

function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

export default function TestReportModal({ report, onClose }: Props) {
  return createPortal(
    <AnimatePresence>
      {report && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[480px] max-h-[85vh] flex flex-col"
          >
            <div className="bg-white rounded-2xl shadow-2xl border border-noob-border flex flex-col overflow-hidden">
              {/* Header */}
              <div className="px-6 pt-5 pb-4 border-b border-noob-border flex-shrink-0">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-noob-primary/10 flex items-center justify-center">
                      <ClipboardList className="w-5 h-5 text-noob-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-noob-text text-base">
                        {report.isBatch ? 'Rapport de réparation' : 'Résultat du test'}
                      </h3>
                      <p className="text-noob-muted text-xs mt-0.5">
                        Terminé à {formatTime(report.completedAt)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-1.5 text-noob-muted hover:text-noob-text rounded-lg hover:bg-noob-accent transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Summary counters */}
                <div className="flex gap-3 mt-4">
                  <div className="flex-1 bg-green-50 border border-green-200 rounded-xl px-4 py-2.5 text-center">
                    <p className="text-2xl font-bold text-green-600">{report.totalSuccess}</p>
                    <p className="text-xs text-green-600 font-medium mt-0.5">
                      {report.totalSuccess > 1 ? 'Réussis' : 'Réussi'}
                    </p>
                  </div>
                  <div className="flex-1 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5 text-center">
                    <p className="text-2xl font-bold text-red-500">{report.totalFailed}</p>
                    <p className="text-xs text-red-500 font-medium mt-0.5">
                      {report.totalFailed > 1 ? 'Échoués' : 'Échoué'}
                    </p>
                  </div>
                  <div className="flex-1 bg-noob-accent border border-noob-border rounded-xl px-4 py-2.5 text-center">
                    <p className="text-2xl font-bold text-noob-text">{report.items.length}</p>
                    <p className="text-xs text-noob-muted font-medium mt-0.5">Total</p>
                  </div>
                </div>
              </div>

              {/* Command list */}
              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-1.5">
                {report.items.map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${
                      item.success
                        ? 'bg-green-50 border-green-200'
                        : 'bg-red-50 border-red-200'
                    }`}
                  >
                    {item.success ? (
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${item.success ? 'text-green-800' : 'text-red-800'}`}>
                        {item.noobLabel || item.label}
                      </p>
                      <p className={`text-xs mt-0.5 ${item.success ? 'text-green-600' : 'text-red-500'}`}>
                        {item.success ? 'Corrigé avec succès' : 'Échec — vérification manuelle requise'}
                        {item.duration !== undefined && (
                          <span className="ml-2 opacity-70">
                            ({item.duration < 1000 ? `${item.duration}ms` : `${(item.duration / 1000).toFixed(1)}s`})
                          </span>
                        )}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${
                      item.success
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-600'
                    }`}>
                      {item.success ? 'OK' : 'KO'}
                    </span>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-noob-border flex-shrink-0 bg-white">
                {report.totalFailed === 0 ? (
                  <p className="text-sm text-green-600 font-medium text-center mb-3">
                    Tout s'est déroulé correctement !
                  </p>
                ) : (
                  <p className="text-sm text-noob-muted text-center mb-3">
                    {report.totalFailed} correction{report.totalFailed > 1 ? 's ont' : ' a'} échoué
                    {report.totalFailed > 1 ? '' : ''} — un redémarrage peut être nécessaire.
                  </p>
                )}
                <button
                  onClick={onClose}
                  className="w-full px-4 py-2.5 rounded-xl bg-noob-primary text-white text-sm font-semibold hover:bg-noob-primary-hover transition-colors"
                >
                  Fermer
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
