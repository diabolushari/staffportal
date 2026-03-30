interface StatusBadgeProps {
  isActive: boolean
}

export const StatusBadge = ({ isActive }: StatusBadgeProps) => (
  <div
    className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
      isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
    }`}
  >
    {isActive ? 'Active' : 'Inactive'}
  </div>
)
