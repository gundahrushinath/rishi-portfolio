import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { LucideIcon, Eye, EyeOff } from 'lucide-react';
import { ReactNode, useState } from 'react';
import { TRANSITIONS } from '@/lib/design-system';

interface FormInputProps {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
  icon?: LucideIcon;
  helperText?: string;
  labelExtra?: ReactNode;
}

export function FormInput({
  id,
  label,
  type,
  placeholder,
  value,
  onChange,
  required = false,
  disabled = false,
  icon: Icon,
  helperText,
  labelExtra,
}: FormInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordField = type === 'password';
  const inputType = isPasswordField && showPassword ? 'text' : type;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={id} className="text-xs sm:text-sm font-medium">
          {label}
        </Label>
        {labelExtra}
      </div>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-2 sm:left-3 top-2.5 sm:top-3 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
        )}
        <Input
          id={id}
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          disabled={disabled}
          className={`${Icon ? 'pl-8 sm:pl-10' : ''} ${isPasswordField ? 'pr-10 sm:pr-12' : ''} ${TRANSITIONS.all} focus:ring-2 focus:ring-primary/20 h-10 sm:h-11 text-sm sm:text-base`}
        />
        {isPasswordField && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-1 top-1.5 sm:top-2 h-7 w-7 sm:h-8 sm:w-8 p-0 hover:bg-transparent"
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
            ) : (
              <Eye className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
            )}
            <span className="sr-only">
              {showPassword ? 'Hide password' : 'Show password'}
            </span>
          </Button>
        )}
      </div>
      {helperText && (
        <p className="text-xs sm:text-sm text-muted-foreground">{helperText}</p>
      )}
    </div>
  );
}
