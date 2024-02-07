import { useState } from "react"
import DialogContainer from "../coremodules/Dialog";


export namespace UseModalController {

  export interface Props {
    scroll?: boolean;
    className?: string;
    dialogClassName?: string;
    hideClose?: boolean;
    autoClose?: boolean;
    removeShadow?: boolean;
    disableVerticalCenter?: boolean;
    expand?: boolean;
    onHide?: () => void;
    maxWidth?: "600px" | "700px" | "800px" | "900px" | "1000px" | "1100px" | "1200px";
  }

  export interface Controller extends Props {
    name?: string;
    visible: boolean;
    show: (name?: string) => void;
    hide: () => void;
  }

  export interface ReturnType extends Controller {
    Modal: React.FC<Controller>;
  }

  export type Children = React.PropsWithChildren | { children: (name?: string) => React.ReactNode };

}

export default function useModalController(config: UseModalController.Props = {}): UseModalController.ReturnType {

  const [name, setName] = useState<string>();
  const [visible, setVisible] = useState(false);

  const show = (name?: string) => {
    setName(name);
    setVisible(true);
  }

  const hide = () => {
    setName(undefined);
    setVisible(false);
    config.onHide && config.onHide();
  }

  return {
    name,
    show,
    hide,
    visible,
    ...config,
    Modal
  }
}

function Modal(controller: UseModalController.Controller & UseModalController.Children) {

  const {
    name,
    hide,
    visible,
    autoClose,
    disableVerticalCenter,
    expand,
    hideClose,
    removeShadow,
    scroll,
    children,
    maxWidth
  } = controller;

  const className = maxWidth ? "w-full" : controller.className;
  const dialogClassName = maxWidth ? `w-full ${maxWidth === "600px" ? "!max-w-[600px]" : ""} ${maxWidth === "700px" ? "!max-w-[700px]" : ""} ${maxWidth === "800px" ? "!max-w-[800px]" : ""} ${maxWidth === "900px" ? "!max-w-[900px]" : ""} ${maxWidth === "1000px" ? "!max-w-[1000px]" : ""} ${maxWidth === "1100px" ? "!max-w-[1100px]" : ""} ${maxWidth === "1200px" ? "!max-w-[1200px]" : ""}` : controller.dialogClassName;

  return (
    <DialogContainer
      isOpen={visible}
      closeModal={hide}
      wrapperClassName={className}
      scroll={scroll}
      hideClose={hideClose}
      autoClose={autoClose}
      disableVerticalCenter={disableVerticalCenter}
      dialogClassName={dialogClassName}
      expand={expand}
      removeShadow={removeShadow}
    >
      {
        typeof children === "function"
          ? children(name)
          : children
      }
    </DialogContainer>
  )
}