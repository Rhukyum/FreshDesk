import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Loader2 } from 'lucide-react'
import { useAppStore, CommandMeta } from '../../store/app.store'
import CategoryCard from './CategoryCard'
import NoobCommandList from './NoobCommandList'
import NoobProgressView from './NoobProgressView'
import FixAllDialog from './FixAllDialog'

interface Props {
  onRun: (id: string) => void
  onRunAll: (ids: string[]) => void
}

type NoobScreen = 'home' | 'category' | 'running'

export default function NoobView({ onRun, onRunAll }: Props) {
  const { commands, isRunning, currentCommandId, progress } = useAppStore()
  const [screen, setScreen] = useState<NoobScreen>('home')
  const [activeCategory, setActiveCategory] = useState<CommandMeta['category'] | null>(null)
  const [fixAllOpen, setFixAllOpen] = useState(false)

  const categories: CommandMeta['category'][] = ['network', 'maintenance', 'performance', 'security', 'diagnostics', 'system']

  // Commands visible in noob mode per category
  const getNoobCommands = (cat: CommandMeta['category']) =>
    commands.filter(
      (c) => c.category === cat &&
      (c.mode === 'noob' || c.mode === 'both') &&
      (c.risk === 'low' || c.risk === 'medium')
    )

  const noobSafeCommands = commands.filter(
    (c) =>
      (c.mode === 'noob' || c.mode === 'both') &&
      (c.risk === 'low' || c.risk === 'medium') &&
      (c.noobLabel || c.label)
  )

  const handleFixAll = (ids: string[]) => {
    setFixAllOpen(false)
    setScreen('running')
    onRunAll(ids)
  }

  const handleCategorySelect = (cat: CommandMeta['category']) => {
    setActiveCategory(cat)
    setScreen('category')
  }

  const handleRunFromCategory = (id: string) => {
    setScreen('running')
    onRun(id)
  }

  if (screen === 'running' || (isRunning && screen !== 'home' && screen !== 'category')) {
    return <NoobProgressView onDone={() => setScreen('home')} />
  }

  if (screen === 'category' && activeCategory) {
    return (
      <NoobCommandList
        category={activeCategory}
        commands={commands}
        onBack={() => setScreen('home')}
        onRun={handleRunFromCategory}
        isRunning={isRunning}
        currentCommandId={currentCommandId}
      />
    )
  }

  return (
    <>
      <motion.div
        key="noob-home"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="h-full flex flex-col overflow-y-auto"
      >
        {/* Hero section */}
        <div className="px-8 pt-8 pb-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-noob-primary to-blue-700 rounded-2xl p-7 text-white relative overflow-hidden"
          >
            {/* Background decoration */}
            <div className="absolute right-0 top-0 w-40 h-40 bg-white/5 rounded-full -translate-y-10 translate-x-10" />
            <div className="absolute right-8 bottom-0 w-24 h-24 bg-white/5 rounded-full translate-y-8" />

            <div className="relative">
              <h1 className="text-2xl font-bold mb-1.5">Mon PC a besoin d'aide ?</h1>
              <p className="text-blue-100 text-sm mb-6">
                FreshDesk analyse et répare les problèmes courants en un clic.
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setFixAllOpen(true)}
                disabled={isRunning}
                className="flex items-center gap-2.5 bg-white text-noob-primary font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-60"
              >
                {isRunning ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Sparkles className="w-5 h-5" />
                )}
                Réparer et optimiser mon PC
              </motion.button>
              <p className="text-blue-200 text-xs mt-3 opacity-80">
                Choisissez parmi {noobSafeCommands.length} corrections disponibles
              </p>
            </div>
          </motion.div>
        </div>

        {/* Category grid */}
        <div className="px-8 pb-8">
          <h2 className="text-sm font-semibold text-noob-muted uppercase tracking-wider mb-4">
            Ou choisir une catégorie
          </h2>
          <div className="grid grid-cols-3 gap-4">
            {categories.map((cat, i) => (
              <motion.div
                key={cat}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
              >
                <CategoryCard
                  category={cat}
                  commands={commands}
                  onSelectCategory={handleCategorySelect}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Fix All Selection Dialog */}
      <FixAllDialog
        open={fixAllOpen}
        commands={commands}
        onConfirm={handleFixAll}
        onCancel={() => setFixAllOpen(false)}
      />
    </>
  )
}
