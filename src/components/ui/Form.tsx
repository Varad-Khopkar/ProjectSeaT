import React, { useState } from 'react'
import { Search, Eye, EyeOff, ChevronDown } from 'lucide-react'

// 1. Text Input
export interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

export const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  ({ label, error, helperText, className = '', type = 'text', ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5 text-left font-sans">
        {label && <label className="text-xs font-mono font-semibold text-slate-500 uppercase tracking-wider">{label}</label>}
        <input
          ref={ref}
          type={type}
          className={`w-full bg-slate-50/70 border ${error ? 'border-brand-coral' : 'border-slate-200/80'} focus:border-brand-blue rounded-[12px] px-4 py-2.5 text-sm text-brand-navy focus-ring transition-all ${className}`}
          {...props}
        />
        {error && <span className="text-xs text-brand-coral">{error}</span>}
        {!error && helperText && <span className="text-xs text-slate-400">{helperText}</span>}
      </div>
    )
  }
)
TextInput.displayName = 'TextInput'

// 2. Search Field
export interface SearchFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

export const SearchField = React.forwardRef<HTMLInputElement, SearchFieldProps>(
  ({ label, className = '', ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5 text-left font-sans">
        {label && <label className="text-xs font-mono font-semibold text-slate-500 uppercase tracking-wider">{label}</label>}
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          <input
            ref={ref}
            type="search"
            className={`w-full bg-slate-50/70 border border-slate-200/80 focus:border-brand-blue rounded-[12px] pl-10 pr-4 py-2.5 text-sm text-brand-navy focus-ring transition-all ${className}`}
            {...props}
          />
        </div>
      </div>
    )
  }
)
SearchField.displayName = 'SearchField'

// 3. Password Input
export interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    const [show, setShow] = useState(false)

    return (
      <div className="w-full flex flex-col gap-1.5 text-left font-sans">
        {label && <label className="text-xs font-mono font-semibold text-slate-500 uppercase tracking-wider">{label}</label>}
        <div className="relative w-full">
          <input
            ref={ref}
            type={show ? 'text' : 'password'}
            className={`w-full bg-slate-50/70 border ${error ? 'border-brand-coral' : 'border-slate-200/80'} focus:border-brand-blue rounded-[12px] pl-4 pr-11 py-2.5 text-sm text-brand-navy focus-ring transition-all ${className}`}
            {...props}
          />
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-blue transition-colors cursor-pointer"
          >
            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {error && <span className="text-xs text-brand-coral">{error}</span>}
      </div>
    )
  }
)
PasswordInput.displayName = 'PasswordInput'

// 4. Textarea
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5 text-left font-sans">
        {label && <label className="text-xs font-mono font-semibold text-slate-500 uppercase tracking-wider">{label}</label>}
        <textarea
          ref={ref}
          className={`w-full min-h-[100px] bg-slate-50/70 border ${error ? 'border-brand-coral' : 'border-slate-200/80'} focus:border-brand-blue rounded-[12px] px-4 py-2.5 text-sm text-brand-navy focus-ring transition-all resize-y ${className}`}
          {...props}
        />
        {error && <span className="text-xs text-brand-coral">{error}</span>}
      </div>
    )
  }
)
Textarea.displayName = 'Textarea'

// 5. Dropdown
export interface DropdownProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: { label: string; value: string }[]
}

export const Dropdown = React.forwardRef<HTMLSelectElement, DropdownProps>(
  ({ label, error, options, className = '', ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5 text-left font-sans">
        {label && <label className="text-xs font-mono font-semibold text-slate-500 uppercase tracking-wider">{label}</label>}
        <div className="relative w-full">
          <select
            ref={ref}
            className={`w-full appearance-none bg-slate-50/70 border ${error ? 'border-brand-coral' : 'border-slate-200/80'} focus:border-brand-blue rounded-[12px] pl-4 pr-10 py-2.5 text-sm text-brand-navy focus-ring transition-all cursor-pointer ${className}`}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
        </div>
        {error && <span className="text-xs text-brand-coral">{error}</span>}
      </div>
    )
  }
)
Dropdown.displayName = 'Dropdown'

// 6. Checkbox
export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, className = '', ...props }, ref) => {
    return (
      <label className="flex items-center gap-3 cursor-pointer group font-sans text-sm text-brand-navy">
        <input
          ref={ref}
          type="checkbox"
          className={`h-4 w-4 rounded-[4px] border border-slate-200 text-brand-blue focus:ring-0 focus-ring cursor-pointer transition-colors ${className}`}
          {...props}
        />
        <span className="select-none text-slate-700 group-hover:text-brand-navy transition-colors">{label}</span>
      </label>
    )
  }
)
Checkbox.displayName = 'Checkbox'

// 7. Radio Button
export interface RadioButtonProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
}

export const RadioButton = React.forwardRef<HTMLInputElement, RadioButtonProps>(
  ({ label, className = '', ...props }, ref) => {
    return (
      <label className="flex items-center gap-3 cursor-pointer group font-sans text-sm text-brand-navy">
        <input
          ref={ref}
          type="radio"
          className={`h-4 w-4 border border-slate-200 text-brand-blue focus:ring-0 focus-ring cursor-pointer transition-colors ${className}`}
          {...props}
        />
        <span className="select-none text-slate-700 group-hover:text-brand-navy transition-colors">{label}</span>
      </label>
    )
  }
)
RadioButton.displayName = 'RadioButton'

// 8. Toggle Switch
export interface ToggleSwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  checked: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const ToggleSwitch = React.forwardRef<HTMLInputElement, ToggleSwitchProps>(
  ({ label, checked, onChange, className = '', ...props }, ref) => {
    return (
      <label className="flex items-center justify-between gap-4 cursor-pointer font-sans text-sm">
        {label && <span className="select-none text-slate-700 font-medium">{label}</span>}
        <div className="relative">
          <input
            ref={ref}
            type="checkbox"
            checked={checked}
            onChange={onChange}
            className="sr-only peer"
            {...props}
          />
          <div className="w-10 h-6 bg-slate-200 rounded-full peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-blue focus-ring"></div>
        </div>
      </label>
    )
  }
)
ToggleSwitch.displayName = 'ToggleSwitch'
