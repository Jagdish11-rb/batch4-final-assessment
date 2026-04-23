export default function Spinner({ size = 'md' }) {
  const cls = size === 'sm' ? 'w-4 h-4 border-2' : 'w-8 h-8 border-4'
  return (
    <div className={`${cls} border-nsdl-blue border-t-transparent rounded-full animate-spin`} />
  )
}
