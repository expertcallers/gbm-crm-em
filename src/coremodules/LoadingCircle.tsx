type Props =
{
	size?: "small" | "medium" | "smaller" | "smx"
	className?: string;
}

const LoadingCircle: React.FC<Props> = ({size = "medium", className = ""}) => {
	return <div className={`${
		size === "smx" ? 'after:w-7 after:h-7 after:border-2' : 
		size === "medium" ? 'after:w-10 after:h-10 after:border-4' : 
		size === "small" ? 'after:w-5 after:h-5 after:border-2' :
		'after:w-4 after:h-4 after:border-2'
	} after:animate-rotate inline-block after:content-[' '] after:block after:rounded-full after:border-y-primary after:border-x-transparent ${className}`}></div>
}

export default LoadingCircle;