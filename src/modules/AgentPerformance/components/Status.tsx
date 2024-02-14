import { useMemo } from "react";
import { IoCaretDown } from "react-icons/io5";
import Tag from "../../../coremodules/Tag";

const DEFAULT = { color: "text-[#000]", backgroundColor: "bg-[#f8f8ff]" };
//here  giving colors to the status
const STATUS: { [key: string]: { color: string; backgroundColor: string } } = {
  rejected: { color: "text-tag-red", backgroundColor: "bg-tag-red" },
  contacted: { color: "text-tag-green", backgroundColor: "bg-tag-green" },
};

type Props = {
  status?: string;
  carrotDown?: boolean;
};
//this function is used to display the status with the colors to identify easily
const Status: React.FC<Props> = ({ status = "", carrotDown }) => {
  const { color, backgroundColor } = useMemo(() => {
    const value = STATUS[status.toLocaleLowerCase()];
    if (value) return value;
    return DEFAULT;
  }, [status, STATUS]);
  return (
    <Tag
      value={status}
      color={color}
      backgroundColor={backgroundColor}
      Icon={carrotDown && <IoCaretDown size={16} />}
      className="gap-1 w-fit !font-bold"
    />
  );
};

export default Status;
