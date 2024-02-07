
type Props =
{
  isLoading?: boolean
}

const Ping: React.FC<Props> = ({isLoading}) => {
  if(!isLoading) return null;
  return <span className="absolute -top-1 -right-1">
    <span className="relative flex h-2 w-2">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-light opacity-75"></span>
      <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
    </span>
  </span>
}

export default Ping;