'use client';

import React, { useEffect, useRef, useId, useState } from 'react';

interface MermaidProps {
  chart: string;
}

const Mermaid: React.FC<MermaidProps> = ({ chart }) => {
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (
      mounted &&
      typeof window !== 'undefined' &&
      typeof document !== 'undefined' &&
      ref.current
    ) {
      // Dynamically import mermaid only on the client
      import('mermaid').then((mermaid) => {
        try {
          mermaid.default.initialize({ startOnLoad: false });
          mermaid.default.parse(chart); // Throws if invalid
          mermaid.default.render(`mermaid-svg-${id}`, chart, (svgCode: string) => {
            ref.current!.innerHTML = svgCode;
          });
        } catch (err) {
          ref.current.innerHTML = `<pre style='color:red'>Mermaid render error:\n${err}</pre>`;
        }
      });
    }
  }, [chart, id, mounted]);

  return <div ref={ref} className="w-full overflow-x-auto" />;
};

export default Mermaid; 