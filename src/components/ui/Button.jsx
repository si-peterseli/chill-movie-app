import { cn } from "../../utils/cn";

const BASE =
  "inline-flex items-center justify-center gap-5 max-sm:gap-3 py-[10px] px-[26px] " +
  "rounded-full text-body-medium-medium transition-colors " +
  "max-sm:py-1 max-sm:px-3 max-sm:text-caption-1-bold";

const VARIANTS = {
  contained: {
    primary: "bg-primary-400 border border-primary-400 text-white",
    secondary: "bg-body-background border border-body-background text-white",
    disabled:
      "bg-greyscale-400 border border-greyscale-400 text-text-dark-disabled",
  },
  shadow: {
    primary: "bg-primary-200 border border-primary-200 text-white",
    secondary: "bg-transparent border-0 text-body-background",
    disabled:
      "bg-greyscale-300 border border-greyscale-300 text-text-dark-disabled",
  },
  outlined: {
    primary: "bg-transparent border border-primary text-primary",
    secondary:
      "bg-transparent border border-body-background text-body-background",
    disabled:
      "bg-greyscale-200 border border-text-dark-disabled text-text-dark-disabled",
  },
};

const HOVER_VARIANTS = {
  contained: {
    primary:
      "hover:bg-primary-400 hover:border hover:border-primary-400 hover:text-white",
    secondary:
      "hover:bg-body-background hover:border hover:border-body-background hover:text-white",
    disabled:
      "hover:bg-greyscale-400 hover:border hover:border-greyscale-400 hover:text-text-dark-disabled",
  },
  shadow: {
    primary:
      "hover:bg-primary-200 hover:border hover:border-primary-200 hover:text-white",
    secondary:
      "hover:bg-input-field-bg hover:border-0 hover:text-body-background",
    disabled:
      "hover:bg-greyscale-300 hover:border hover:border-greyscale-300 hover:text-text-dark-disabled",
  },
  outlined: {
    primary:
      "hover:bg-transparent hover:border hover:border-primary hover:text-primary",
    secondary:
      "hover:bg-transparent hover:border hover:border-body-background hover:text-body-background",
    disabled:
      "hover:bg-greyscale-200 hover:border hover:border-text-dark-disabled hover:text-text-dark-disabled",
  },
};

/**
 * @param {"contained"|"shadow"|"outlined"} variant
 * @param {"primary"|"secondary"|"disabled"} color
 * @param {"contained"|"shadow"|"outlined"} [hoverVariant]
 * @param {"primary"|"secondary"|"disabled"} [hoverColor]
 * @param {boolean} disabled
 */
export default function Button({
  variant = "contained",
  color = "primary",
  hoverVariant,
  hoverColor,
  disabled = false,
  leftIcon = "",
  rightIcon = "",
  className = "",
  type = "button",
  children,
  ...props
}) {
  const isDisabled = disabled || color === "disabled";
  const appliedColor = isDisabled ? "disabled" : color;
  const variantClass =
    VARIANTS[variant]?.[appliedColor] ?? VARIANTS.contained.primary;

  const hasHover = !isDisabled && (hoverVariant || hoverColor);
  const hoverClass = hasHover
    ? (HOVER_VARIANTS[hoverVariant ?? variant]?.[hoverColor ?? color] ?? "")
    : "";

  const classes = cn(
    BASE,
    variantClass,
    hoverClass,
    isDisabled ? "cursor-not-allowed" : "cursor-pointer",
    className,
  );

  return (
    <button type={type} disabled={isDisabled} className={classes} {...props}>
      {leftIcon}
      {children}
      {rightIcon}
    </button>
  );
}