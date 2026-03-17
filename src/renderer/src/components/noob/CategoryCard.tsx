import { motion } from 'framer-motion'
import { CommandMeta } from '../../store/app.store'
import { Wifi, Trash2, Zap, Shield, Search, Settings } from 'lucide-react'

interface Props {
  category: CommandMeta['category']
  commands: CommandMeta[]
  onSelectCategory: (cat: CommandMeta['category']) => void
}

const categoryConfig = {
  network: {
    icon: Wifi,
    label: 'Réseau',
    hint: 'Connexion lente ?',
    color: 'text-blue-500',
    bg: 'bg-blue-50',
    border: 'border-blue-100',
    hoverBorder: 'hover:border-blue-300'
  },
  maintenance: {
    icon: Trash2,
    label: 'Nettoyage',
    hint: 'Libérer de l\'espace',
    color: 'text-emerald-500',
    bg: 'bg-emerald-50',
    border: 'border-emerald-100',
    hoverBorder: 'hover:border-emerald-300'
  },
  performance: {
    icon: Zap,
    label: 'Vitesse',
    hint: 'Booster mon PC',
    color: 'text-amber-500',
    bg: 'bg-amber-50',
    border: 'border-amber-100',
    hoverBorder: 'hover:border-amber-300'
  },
  security: {
    icon: Shield,
    label: 'Sécurité',
    hint: 'Vérifier la protection',
    color: 'text-violet-500',
    bg: 'bg-violet-50',
    border: 'border-violet-100',
    hoverBorder: 'hover:border-violet-300'
  },
  diagnostics: {
    icon: Search,
    label: 'Diagnostic',
    hint: 'Analyser les problèmes',
    color: 'text-pink-500',
    bg: 'bg-pink-50',
    border: 'border-pink-100',
    hoverBorder: 'hover:border-pink-300'
  },
  system: {
    icon: Settings,
    label: 'Système',
    hint: 'Réparations système',
    color: 'text-slate-500',
    bg: 'bg-slate-50',
    border: 'border-slate-200',
    hoverBorder: 'hover:border-slate-400'
  }
}

export default function CategoryCard({ category, commands, onSelectCategory }: Props) {
  const config = categoryConfig[category]
  const Icon = config.icon
  const noobCount = commands.filter(
    (c) =>
      c.category === category &&
      (c.mode === 'noob' || c.mode === 'both') &&
      (c.risk === 'low' || c.risk === 'medium')
  ).length

  return (
    <motion.button
      whileHover={{ y: -3, scale: 1.01 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => onSelectCategory(category)}
      className={`noob-card text-left ${config.border} ${config.hoverBorder} w-full`}
    >
      <div className={`w-11 h-11 rounded-xl ${config.bg} flex items-center justify-center mb-3`}>
        <Icon className={`w-5.5 h-5.5 ${config.color}`} />
      </div>
      <div className="font-semibold text-noob-text text-sm">{config.label}</div>
      <div className="text-noob-muted text-xs mt-0.5">{config.hint}</div>
      {noobCount > 0 && (
        <div className="mt-2 text-xs text-noob-muted opacity-60">
          {noobCount} action{noobCount > 1 ? 's' : ''} disponible{noobCount > 1 ? 's' : ''}
        </div>
      )}
    </motion.button>
  )
}
