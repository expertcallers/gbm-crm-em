import { useCallback, useMemo, useState } from "react"
import DialogContainer from "../coremodules/Dialog";


export namespace UseModal {

  export type Primitives = string | boolean | number | bigint | null | undefined

  export type Record = { [key: string]: Primitives | Primitives[] | Record[] | Record }

  export type ModalComponentProps<T extends Record = Record, R extends Record = Record> = { close: (args?: R) => void; } & T

  export type Show<T> = (props?: T) => void;

  export type Props<T extends Record, R extends Record> =
    {
      Component: React.FC<ModalComponentProps<T, R>>;
      scroll?: boolean;
      className?: string;
      dialogClassName?: string;
      onClosed?: (result: R) => void;
      hideClose?: boolean;
      autoClose?: boolean;
      removeShadow?: boolean;
      disableVerticalCenter?: boolean;
      expand?: boolean;
      disableAnimation?: boolean;
      position?: "center" | "right";
      maxWidth?: "400px" | "500px" |  "600px" | "700px" | "800px" | "900px" | "1000px" | "1100px" | "1200px" | "full";
    }

  export type ReturnType<T, R extends Record> =
    {
      visible: boolean;
      show: Show<T>;
      result: R;
      Modal: JSX.Element;
    }

}

export default function useModal<T extends UseModal.Record, R extends UseModal.Record>({
  disableVerticalCenter,
  expand = false,
  autoClose = false,
  hideClose = false,
  removeShadow = true,
  Component,
  scroll = false,
  position = "center",
  onClosed,
  disableAnimation = false,
  maxWidth,
  ...modalProps
}: UseModal.Props<T, R>): UseModal.ReturnType<T, R> {

  const [visible, setVisible] = useState(false);
  const [props, setProps] = useState<any>({});
  const [result, setResult] = useState<any>({});

  const show: UseModal.Show<T> = useCallback((props) => {
    setResult({});
    setVisible(true);
    setProps(props);
  }, [setVisible, setProps, setResult]);

  const reset: (args?: R) => void = useCallback((args) => {
    setResult(args ?? {});
    setVisible(false);
    onClosed && onClosed(args ?? {} as R)
  }, [setVisible, setProps, setResult]);

  const className = maxWidth ? "w-full" : modalProps.className;
  const dialogClassName = maxWidth ? `w-full ${maxWidth === "full" ? "!max-w-full" : ""} ${maxWidth === "400px" ? "!max-w-[400px]" : ""} ${maxWidth === "500px" ? "!max-w-[500px]" : ""} ${maxWidth === "600px" ? "!max-w-[600px]" : ""} ${maxWidth === "700px" ? "!max-w-[700px]" : ""} ${maxWidth === "800px" ? "!max-w-[800px]" : ""} ${maxWidth === "900px" ? "!max-w-[900px]" : ""} ${maxWidth === "1000px" ? "!max-w-[1000px]" : ""} ${maxWidth === "1100px" ? "!max-w-[1100px]" : ""} ${maxWidth === "1200px" ? "!max-w-[1200px]" : ""}` : modalProps.dialogClassName;

  return useMemo(() => ({
    show,
    visible,
    result,
    Modal: (
      <DialogContainer
        isOpen={visible}
        closeModal={() => { onClosed && onClosed(result); reset() }}
        wrapperClassName={className}
        scroll={scroll}
        hideClose={hideClose}
        autoClose={autoClose}
        disableVerticalCenter={disableVerticalCenter}
        expand={expand}
        removeShadow={removeShadow}
        disableAnimation={disableAnimation}
        position={position}
        dialogClassName={dialogClassName}
      >
        {<Component {...props} close={reset} />}
      </DialogContainer>
    )
  }), [visible, props, result])
}