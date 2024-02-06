import React from "react";
import { Transition } from "@headlessui/react";

type Props = React.PropsWithChildren<{
    show?: boolean;
    speed?: "slow" | "normal" | "fast" | "quick";
    className?: string;
    afterLeave?: () => void;
    afterEnter?: () => void;
}>

const FadeTransition = React.forwardRef<HTMLDivElement, Props>(({className, children, show = true, speed = "fast", afterLeave, afterEnter}, ref) =>
{
    const duration = speed === "slow" ? "duration-[500ms]" : speed === "normal" ? "duration-[350ms]" : speed === "quick" ? "duration-[150ms]" : "duration-[220ms]"
    return (
        <Transition
            ref={ref}
            className={className ? className : "flex-1 flex justify-center align-center"}
            appear={true}
            show={show}
            enter={`transition-opacity ease-in ${duration}`}
            enterFrom="opacity-0"
            enterTo="opacity-100"
            afterEnter={afterEnter}
            leave={`transition-opacity ease-in ${duration}`}
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={afterLeave}
        >{children}</Transition>
    )
})

export default FadeTransition