import { Risk } from '../../store/app.store'
import { cn } from '../../lib/utils'

interface Props {
  risk: Risk
  size?: 'sm' | 'md'
}

const labels: Record<Risk, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  critical: 'Critical'
}

const icons: Record<Risk, string> = {
  low: '🟢',
  medium: '🟡',
  high: '🟠',
  critical: '🔴'
}

export default function RiskBadge({ risk, size = 'sm' }: Props) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full font-medium border',
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs',
        `risk-${risk}`
      )}
    >
      <span className="text-[10px] leading-none">{icons[risk]}</span>
      {labels[risk]}
    </span>
  )
}
