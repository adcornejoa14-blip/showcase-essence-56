import { Star } from "lucide-react";

type Props = {
  value: number;
  onChange?: (v: number) => void;
  size?: number;
  readOnly?: boolean;
  className?: string;
};

const StarRating = ({ value, onChange, size = 20, readOnly = false, className = "" }: Props) => {
  return (
    <div className={`inline-flex items-center gap-1 ${className}`}>
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = n <= Math.round(value);
        const Comp = readOnly ? "span" : "button";
        return (
          <Comp
            key={n}
            {...(readOnly
              ? {}
              : { type: "button" as const, onClick: () => onChange?.(n), "aria-label": `${n} stars` })}
            className={readOnly ? "" : "transition-transform hover:scale-110"}
          >
            <Star
              size={size}
              className={filled ? "fill-foreground text-foreground" : "text-foreground/25"}
            />
          </Comp>
        );
      })}
    </div>
  );
};

export default StarRating;
