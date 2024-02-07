type Props =
  {
    value?: string;
    backgroundColor?: string;
    color?: string;
    Icon?: React.ReactNode;
    className?: string;
    wrapperClassName?: string;
    textClassName?: string;
  } & React.PropsWithChildren

const Tag: React.FC<Props> = ({ value, color, textClassName = "", wrapperClassName = "", className = '', backgroundColor = '', Icon, children }) => {
  return <div className={`flex w-full max-w-fit overflow-hidden ${wrapperClassName}`}>
    <span className={`flex w-full items-center ${backgroundColor} ${color} px-2 py-1 text-[0.65rem] text-center font-medium uppercase rounded ${className}`}>
      <span className={`${textClassName} text-ellipsis overflow-hidden`}>{value}</span>
      {Icon}
      {children}
    </span>
  </div>
}

export default Tag;