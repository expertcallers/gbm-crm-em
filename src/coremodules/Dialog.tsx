import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { IoCloseOutline } from "react-icons/io5";

type Props = {
  isOpen?: boolean;
  closeModal: (...args: any[]) => void;
  afterLeave?: (...args: any[]) => void;
  wrapperClassName?: string;
  dialogClassName?: string;
  hideClose?: boolean;
  scroll?: boolean;
  autoClose?: boolean;
  removeShadow?: boolean;
  disableVerticalCenter?: boolean;
  expand?: boolean;
  disableOverlay?: boolean;
  disableAnimation?: boolean;
  position?: "center" | "right";
} & React.PropsWithChildren;

const DialogContainer: React.FC<Props> = ({
  position = "center",
  disableAnimation,
  disableOverlay,
  expand,
  disableVerticalCenter,
  removeShadow,
  autoClose = true,
  hideClose = false,
  scroll = true,
  isOpen,
  afterLeave,
  closeModal,
  wrapperClassName,
  dialogClassName,
  children,
}) => {
  const containerPosition =
    position === "center"
      ? `${disableVerticalCenter ? "" : "items-center"} justify-center`
      : position === "right"
      ? `${disableVerticalCenter ? "" : "items-center"} justify-end`
      : `${disableVerticalCenter ? "" : "items-center"} justify-center`;

  return (
    <Transition appear show={isOpen} as={Fragment} afterLeave={afterLeave}>
      <Dialog
        as="div"
        className="z-[50] relative"
        onClose={() => autoClose && closeModal()}
      >
        {!disableOverlay && (
          <Transition.Child
            as={"div"}
            className={"bg-black fixed inset-0 opacity-20"}
          />
        )}

        <div
          className={`fixed inset-0 ${
            scroll ? "flex justify-center overflow-hidden" : "overflow-scroll"
          }`}
        >
          <div
            className={`flex min-h-full w-full ${containerPosition} p-4 ${
              scroll ? "" : "mb-[25vh]"
            } text-center`}
          >
            <Transition.Child
              as={Fragment}
              enter={disableAnimation ? undefined : "ease-in duration-150"}
              enterFrom={disableAnimation ? undefined : "opacity-0"}
              enterTo={disableAnimation ? undefined : "opacity-100"}
              leave={disableAnimation ? undefined : "ease-in duration-150"}
              leaveFrom={disableAnimation ? undefined : "opacity-100"}
              leaveTo={disableAnimation ? undefined : "opacity-0"}
            >
              <Dialog.Panel
                className={`${
                  expand ? "w-full" : "md:max-w-[90%] ls:max-w-[70%]"
                } relative flex ${
                  scroll ? "h-full overflow-hidden" : ""
                } bg-white rounded-2xl ${
                  removeShadow ? "" : "shadow-xl"
                } text-left ${
                  dialogClassName
                    ? dialogClassName
                    : scroll
                    ? "max-h-[500px]"
                    : ""
                }`}
              >
                {!hideClose && (
                  <button
                    onClick={closeModal}
                    type="button"
                    className="absolute top-2 right-2 z-[999] text-primary"
                  >
                    <IoCloseOutline size={32} />
                  </button>
                )}
                <div
                  className={`${expand ? "w-full" : ""} ${
                    scroll ? "overflow-auto" : ""
                  } p-2 md:p-4 ${wrapperClassName ? wrapperClassName : ""}`}
                >
                  {children}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default DialogContainer;
