import { useLayoutEffect, useRef, useState } from "react";


export default function AutoHeight(props: React.PropsWithChildren) {

  const { children } = props;
  const ref = useRef<HTMLDivElement>(null);
  const [maxHeight, setMaxHeight] = useState<number>();

  const onResize = (entries: ResizeObserverEntry[]) => {
    if(!entries[0]) return;
    setMaxHeight(entries[0].contentRect.height);
  }

  useLayoutEffect(() => {
    const observer = new ResizeObserver(onResize);
    setMaxHeight(ref.current?.clientHeight)
    if (ref.current) { observer.observe(ref.current); }
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} style={{ height: "100%" }}>
      {!!maxHeight && (
        <div style={{ height: "100%", maxHeight: maxHeight }}>
          {children}
        </div>
      )}
    </div>
  )
}
