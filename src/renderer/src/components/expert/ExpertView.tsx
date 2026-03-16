import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CommandMeta } from '../../store/app.store'
import Sidebar from './Sidebar'
import CommandTable from './CommandTable'
import OutputPanel from './OutputPanel'
import LogViewer from './LogViewer'
import RiskBadge from '../shared/RiskBadge'
import { Info, RotateCw, Terminal, ScrollText } from 'lucide-react'

interface Props {
  onRun: (id: string) => void
}

type BottomTab = 'output' | 'logs'

export default function ExpertView({ onRun }: Props) {
  const [selectedCommand, setSelectedCommand] = useState<CommandMeta | null>(null)
  const [bottomTab, setBottomTab] = useState<BottomTab>('output')

  return (
    <div className="flex h-full">
      {/* Left sidebar: 220px */}
      <div className="w-[220px] flex-shrink-0">
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Command list + detail - top portion */}
        <div className="flex flex-1 min-h-0" style={{ maxHeight: '55%' }}>
          {/* Command table */}
          <div className="flex-1 min-w-0">
            <CommandTable
              onRun={onRun}
              selectedId={selectedCommand?.id ?? null}
              onSelect={setSelectedCommand}
            />
          </div>

          {/* Command detail panel */}
          <AnimatePresence>
            {selectedCommand && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 240, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex-shrink-0 overflow-hidden border-l border-expert-border"
              >
                <div className="w-60 h-full p-4 space-y-4 overflow-y-auto bg-expert-panel">
                  <div>
                    <h3 className="text-expert-text font-semibold text-sm mb-1">
                      {selectedCommand.label}
                    </h3>
                    <p className="text-expert-muted text-xs leading-relaxed">
                      {selectedCommand.description}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <InfoRow icon={<Info className="w-3 h-3" />} label="Risque">
                      <RiskBadge risk={selectedCommand.risk} />
                    </InfoRow>
                    <InfoRow icon={<RotateCw className="w-3 h-3" />} label="Rollback">
                      <span className={`text-xs font-medium ${selectedCommand.hasRollback ? 'text-green-400' : 'text-expert-muted'}`}>
                        {selectedCommand.hasRollback ? 'Oui' : 'Non'}
                      </span>
                    </InfoRow>
                    <InfoRow icon={<Info className="w-3 h-3" />} label="Admin requis">
                      <span className={`text-xs font-medium ${selectedCommand.adminRequired ? 'text-amber-400' : 'text-expert-muted'}`}>
                        {selectedCommand.adminRequired ? 'Oui' : 'Non'}
                      </span>
                    </InfoRow>
                    <InfoRow icon={<Info className="w-3 h-3" />} label="Mode">
                      <span className="text-xs text-expert-muted capitalize">{selectedCommand.mode}</span>
                    </InfoRow>
                  </div>

                  <button
                    onClick={() => onRun(selectedCommand.id)}
                    className="w-full expert-btn py-2"
                  >
                    ▶ Exécuter
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Divider */}
        <div className="h-px bg-expert-border flex-shrink-0" />

        {/* Bottom panel: output + logs */}
        <div className="flex flex-col flex-1 min-h-0">
          {/* Tabs */}
          <div className="flex items-center border-b border-expert-border bg-expert-surface flex-shrink-0">
            <button
              onClick={() => setBottomTab('output')}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-medium border-b-2 transition-colors ${
                bottomTab === 'output'
                  ? 'border-expert-accent text-expert-accent'
                  : 'border-transparent text-expert-muted hover:text-expert-text'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              Terminal
            </button>
            <button
              onClick={() => setBottomTab('logs')}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-medium border-b-2 transition-colors ${
                bottomTab === 'logs'
                  ? 'border-expert-accent text-expert-accent'
                  : 'border-transparent text-expert-muted hover:text-expert-text'
              }`}
            >
              <ScrollText className="w-3.5 h-3.5" />
              Logs
            </button>
          </div>

          {/* Panel content */}
          <div className="flex-1 min-h-0">
            {bottomTab === 'output' ? <OutputPanel /> : <LogViewer />}
          </div>
        </div>
      </div>
    </div>
  )
}

function InfoRow({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1.5 text-expert-muted text-xs">
        {icon}
        {label}
      </div>
      <div>{children}</div>
    </div>
  )
}
