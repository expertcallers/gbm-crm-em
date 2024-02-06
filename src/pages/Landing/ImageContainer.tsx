import { useEffect, useRef, useState } from "react";

function importAll(r: any) {
  return r.keys().map(r);
}

const images: string[] = importAll((require as any).context('../../assets/landing-page-images', false, /\.(png|jpe?g|svg|webp|avif)$/));

type Pros =
  {
    className?: string;
  }

const ImageContainer: React.FC<Pros> = ({ className }) => {

  const ref = useRef<HTMLDivElement>(null);
  const [dimensions, setDiminsions] = useState<{ width: number; height: number; }>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        setDiminsions({ width, height })
      }
    });

    if (ref.current) resizeObserver.observe(ref.current);

    return () => { resizeObserver.disconnect(); };
  }, [ref.current])

  const onNext = () => setCurrent(prev => {
    const n = prev + 1;
    if (n > (images.length - 1)) return 0;
    return n
  })

  return (
    <div
      ref={ref}
      className="flex-1 h-full justify-center items-center flex"
    >
      <div className="rounded-2xl overflow-hidden">
        <img
          src={images[current]}
          onClick={onNext}
          className="object-contain"
          style={{
            maxWidth: dimensions?.width,
            maxHeight: dimensions?.height,
            
          }}
        />
      </div>
    </div>
  )
}

export default ImageContainer;