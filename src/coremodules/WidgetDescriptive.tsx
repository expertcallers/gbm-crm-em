import { ButtonProps, WidgetButton } from "./Button";
import Wrapper from "./Wrapper";

interface Props extends React.PropsWithChildren {
  title: string;
  description: React.ReactNode;
  buttons: ButtonProps[];
  wrapperClassname?: string;
}

export default function WidgetDescriptive(props: Props) {
  const { title, description, buttons, wrapperClassname } = props;

  return (
    <Wrapper
      title={title}
      wrapperClassname={`flex flex-col ${wrapperClassname}`}
    >
      <p className="mx-4 text-sm text-[#808080]">{description}</p>
      <div className="mt-auto flex p-4 pt-4 gap-4 justify-end flex-wrap overflow-y-auto">
        {buttons.map((buttonProps, i) => (
          <WidgetButton
            disableAutoCapitalize
            key={i}
            className="text-xs p-1 min-w-[100px]"
            {...buttonProps}
          />
        ))}
      </div>
    </Wrapper>
  );
}
