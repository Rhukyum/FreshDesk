import { motion, AnimatePresence } from 'framer-motion'
import { AlertCircle } from 'lucide-react'

interface Props {
  open: boolean
  title: string
  description: string
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmDialog({ open, title, description, onConfirm, onCancel }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
            onClick={onCancel}
          />
          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[360px]"
          >
            <div className="bg-white rounded-2xl shadow-2xl p-6 border border-noob-border">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-noob-primary/10 flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-5 h-5 text-noob-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-noob-text text-base">{title}</h3>
                  <p className="text-noob-muted text-sm mt-1 leading-relaxed">{description}</p>
                </div>
              </div>
              <div className="flex gap-3 mt-5">
                <button
                  onClick={onCancel}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-noob-border text-noob-muted text-sm font-medium hover:bg-noob-accent transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={onConfirm}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-noob-primary text-white text-sm font-semibold hover:bg-noob-primary-hover transition-colors"
                >
                  Continuer
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
