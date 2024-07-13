import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon, ...props }, ref) => {
    return (
      <div className="flex items-center border-2 border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-lg overflow-hidden focus-within:border-green-500">
        {icon && (
          <div className="bg-green-500 px-3 py-2">
            <span className="w-6 h-6">{icon}</span>
          </div>
        )}
        <input
          type={type}
          className={cn(
            'flex-1 px-3 py-2 bg-transparent outline-none text-gray-700',
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    );    
  }
);
Input.displayName = "Input";

export { Input };
