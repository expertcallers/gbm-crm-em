import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { IoExpandOutline, IoMenuOutline } from "react-icons/io5";
import DialogContainer from "./Dialog";

type Props = {
  Menu: React.FC<{ closeMenu?: () => void }>;
  RightBar?: React.FC<any> | null;
} & React.PropsWithChildren;

const InnerLayout: React.FC<Props> = ({ Menu, RightBar, children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMenu = useCallback(() => setMobileMenuOpen(false), []);

  return (
    <div className="flex min-h-full gap-1">
      <div className="hidden md:flex w-[250px] bg-white rounded-lg overflow-hidden">
        <Menu />
      </div>
      <button
        type="button"
        onClick={() => setMobileMenuOpen(true)}
        className="fixed z-10 md:hidden bottom-[10px] right-[10px] shadow-sm bg-primary rounded-full w-[40px] h-[40px] flex items-center justify-center focus:outline-none"
      >
        <IoMenuOutline size={24} className="stroke-white p-1 w-full h-full" />
      </button>
      <DialogContainer
        isOpen={mobileMenuOpen}
        closeModal={() => setMobileMenuOpen(false)}
        wrapperClassName="w-full h-full"
        dialogClassName="w-full max-h-[90%]"
      >
        <Menu closeMenu={closeMenu} />
      </DialogContainer>
      <InnterLayoutProvider>
        <InnterLayoutContext.Consumer>
          {({ fullscreen }) => (
            <div
              className={`flex flex-col flex-1 w-full bg-white ${
                fullscreen
                  ? "z-10 absolute top-0 bottom-0 left-0 right-0 overflow-y-scroll"
                  : "overflow-hidden rounded-lg relative"
              }`}
            >
              {children}
            </div>
          )}
        </InnterLayoutContext.Consumer>
      </InnterLayoutProvider>
      {RightBar && (
        <div className="hidden md:flex min-w-[250px] bg-white rounded-lg overflow-hidden">
          <RightBar />
        </div>
      )}
    </div>
  );
};

type InnterLayoutType = {
  fullscreen: boolean;
  toggleFullscreen: () => void;
};

const InnterLayoutContext = createContext<InnterLayoutType>({
  fullscreen: false,
  toggleFullscreen: () => {
    throw new Error("Innter layout provider is not ready.");
  },
});

export const useInnterLayout = () => useContext(InnterLayoutContext);

const InnterLayoutProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    const keyDownEvent = (e: any) =>
      e.key === "Escape" && fullscreen && setFullscreen(false);
    if (fullscreen) document.addEventListener("keydown", keyDownEvent);
    return () => {
      document.removeEventListener("keydown", keyDownEvent);
    };
  }, [fullscreen]);

  const value = useMemo(
    () => ({
      fullscreen,
      toggleFullscreen: () => setFullscreen((p) => !p),
    }),
    [fullscreen]
  );

  return (
    <InnterLayoutContext.Provider value={value}>
      {children}
    </InnterLayoutContext.Provider>
  );
};

export const FullscreenInnerLayoutButton: React.FC<{ className?: string }> = ({
  className,
}) => {
  const { toggleFullscreen } = useInnterLayout();

  return (
    <button
      type="button"
      className={`hidden md:block ${className}`}
      onClick={toggleFullscreen}
    >
      <IoExpandOutline size={24} />
    </button>
  );
};

export default InnerLayout;
