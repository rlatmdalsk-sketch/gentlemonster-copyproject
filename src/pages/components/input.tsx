import type { InputHTMLAttributes } from "react";
import type {FieldError, UseFormRegisterReturn} from "react-hook-form";
import { twMerge } from "tailwind-merge";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: FieldError;
    registration?: UseFormRegisterReturn; // Partial 제거하고 전체 타입 수용
    containerClassName?: string;
    labelClassName?: string;
}

function Input({
                   className,
                   containerClassName,
                   labelClassName,
                   label,
                   error,
                   registration,
                   ...props
               }: InputProps) {
    return (
        <div className={twMerge("flex flex-col gap-1 w-full", containerClassName)}>
            {label && (
                <label className={twMerge("text-sm font-medium text-gray-700", labelClassName)}>
                    {label}
                </label>
            )}
            <input
                className={twMerge(
                    "w-full h-10 px-3 py-2 flex text-sm text-black placeholder:text-gray-400 border border-gray-300 rounded-md bg-white focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all",
                    error && "border-red-500 focus:border-red-500 focus:ring-red-500",
                    className
                )}
                {...registration}
                {...props}
                autoComplete="off"
            />
            {error && <span className="text-xs text-red-500">{error}</span>}
        </div>
    );
}

export default Input;