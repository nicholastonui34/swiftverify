import type { Block } from "@/lib/guides";

/** Renders a guide's typed content blocks as accessible article markup. */
export function GuideContent({ blocks }: { blocks: Block[] }) {
  return (
    <div className="space-y-5">
      {blocks.map((block, i) => {
        if (block.type === "h2") {
          return (
            <h2
              key={i}
              className="mt-10 font-display text-2xl font-bold tracking-tight text-navy-900"
            >
              {block.text}
            </h2>
          );
        }
        if (block.type === "ul") {
          return (
            <ul key={i} className="space-y-2 pl-1">
              {block.items.map((item, j) => (
                <li key={j} className="flex gap-3 text-navy-700">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          );
        }
        return (
          <p key={i} className="leading-relaxed text-navy-700">
            {block.text}
          </p>
        );
      })}
    </div>
  );
}
