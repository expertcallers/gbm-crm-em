import { useState } from "react";

interface ButtonProps extends React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  text?: string;
  Icon?: (props: { size: number; className: string }) => React.ReactElement;
  className?: string;
  onClick?: () => void;
  focused?: boolean;
  animateHideIcon?: boolean;
  iconSize?: "16" | "24" | "32";
  disabled?: boolean;
}

const iconWidths = {
  "16": "w-[16px]",
  "24": "w-[24px]",
  "32": "w-[32px]",
}

export function MenuButton(props: ButtonProps) {

  const {
    text,
    className = "",
    Icon,
    onClick,
    animateHideIcon,
    iconSize = "24",
    focused: _focused,
    disabled,
    ...buttonProps
  } = props;

  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);

  const isFocused = _focused !== undefined ? _focused : focused;

  const styleClassName = "flex items-center gap-2 px-4 py-2 rounded-lg transition duration-300 outline outline-2 outline-offset-2";

  const disabledClassName = `${className} ${styleClassName} outline-none cursor-default bg-gray-lightest text-gray`;

  return (
    <button
      className={disabled ? disabledClassName : `${className} ${styleClassName} ${isFocused ? 'bg-primary-light text-white outline-transparent hover:outline-primary-light' : 'outline-transparent bg-white hover:outline-primary-light hover:text-primary'}`}
      onClick={() => onClick && onClick()}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      onMouseOver={() => setHovered(true)}
      onMouseOut={() => setHovered(false)}
      {...buttonProps}
    >
      {Icon && <Icon className={`${typeof animateHideIcon === "boolean" ? `transition-[width] duration-300 ${animateHideIcon ? 'w-0' : iconWidths[iconSize]}` : 'transition'} ${isFocused ? 'text-white' : ''} ${(hovered && !isFocused) ? 'text-primary' : 'text-slate-400'}`} size={24} />}
      {text}
    </button>
  )
}