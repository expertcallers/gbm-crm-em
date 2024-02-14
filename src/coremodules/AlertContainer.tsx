import EventEmitter from "events";
import { useEffect, useState } from "react";
import Button from "./Button";
import DialogContainer from "./Dialog";

interface AlertButton {
  id?: string;
  text: string;
  onClick?: (close: () => void, updateButton: UpdateButtonCallback) => void | Promise<any>;
  disabled?: boolean;
  autoClose?: boolean;
}

type Alert =
  {
    title: string;
    content: string;
    buttons?: AlertButton[]
    hide?: boolean;
  }

type UpdateButtonCallback = (id: string, nextProps: Optional<Omit<AlertButton, "id" | "onClick">>) => void;

const event = new EventEmitter()

type Optional<T> = {
	[P in keyof T]?: T[P];
};

export const alert = (alert: Alert) => event.emit("AlertContainerEvent", alert)

const AlertContainer: React.FC = () => {
  const [working, setWorking] = useState<{ [text: string]: boolean }>({});
  const [alert, setAlert] = useState<Alert | null>(null);

  useEffect(() => {
    event.addListener("AlertContainerEvent", setAlert);
    return () => { event.removeListener("AlertContainerEvent", setAlert) }
  }, [])

  const close = () => setAlert(p => (p ? { ...p, hide: true } : null));

  const updateButton = (id: string, nextProps: Optional<Omit<AlertButton, "id" | "onClick">>) => {
    if (!alert?.buttons?.filter(b => b.id === id)) return;
    setAlert(prev => {
      const next = { ...prev } as Alert;
      if (next.buttons) {
        next.buttons = next.buttons.map(b => {
          if (b.id === id) return { ...b, ...nextProps };
          return b
        })
      }
      return next
    })
  }

  const onClick = async (text: string, callback?: (close: () => void, updateButton: UpdateButtonCallback) => void | Promise<void>, autoClose?: boolean) => {
    try {
      if (callback) {
        setWorking(prev => ({ ...prev, [text]: true }));
        await callback(close, updateButton);
      }
    }
    finally { setWorking(prev => ({ ...prev, [text]: false })); }
    if (autoClose !== false) close();
  }

  return (
    <DialogContainer
      isOpen={!((alert && alert.hide === true) || !alert)}
      closeModal={close}
      wrapperClassName="w-fit max-w-[500px]"
      afterLeave={() => setAlert(null)}
      hideClose
      removeShadow
      scroll={false}
    >
      {
        alert && (
          <div className="w-full">
            <p className="text-xl font-bold text-primary capitalize">{alert.title}</p>
            <pre className="text-white mt-2 font-[system-ui] whitespace-pre-wrap">{alert.content}</pre>
            <div className="w-full flex justify-end flex-wrap mt-4">
              {
                alert.buttons && (
                  alert.buttons.map(b => (
                    <Button
                      key={b.text}
                      text={b.text}
                      disabled={b.disabled}
                      onClick={() => onClick(b.text, b.onClick, b.autoClose)}
                      className={"ml-2 px-2 py-1 min-w-[75px]"}
                      loading={working[b.text]}
                      disableMinWidthHeight
                    />
                  ))
                )
              }
            </div>
          </div>
        )
      }
    </DialogContainer>
  )
}

export default AlertContainer;