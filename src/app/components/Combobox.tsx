import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface ComboboxProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
}

export function Combobox({ label, value, onChange, options, placeholder = 'Select or type...' }: ComboboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [isTyping, setIsTyping] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Update input value when value prop changes
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsTyping(false);
        // Revert to selected value if user clicks away
        if (inputValue !== value) {
          setInputValue(value);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [inputValue, value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setIsTyping(true);
    setIsOpen(true);
  };

  const handleInputBlur = () => {
    // Apply the typed value when input loses focus
    if (inputValue.trim()) {
      onChange(inputValue.trim());
    } else {
      setInputValue(value);
    }
  };

  const handleOptionClick = (option: string) => {
    setInputValue(option);
    onChange(option);
    setIsTyping(false);
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (inputValue.trim()) {
        onChange(inputValue.trim());
        setIsOpen(false);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setInputValue(value);
    }
  };

  // Show all options when just opening; filter only when user is typing
  const filteredOptions = isTyping
    ? options.filter(option => option.toLowerCase().includes(inputValue.toLowerCase()))
    : options;

  return (
    <div ref={containerRef} className="relative">
      {label && (
        <label className="block text-[15px] text-stone-700 mb-2">
          {label}
        </label>
      )}

      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full px-4 py-2.5 pr-10 border-2 border-stone-300 rounded-xl text-stone-700 focus:outline-none focus:border-stone-400 transition-colors text-[15px] placeholder:text-[13px] placeholder:text-stone-400"
        />
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-700 transition-colors"
        >
          <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Dropdown */}
      {isOpen && filteredOptions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-stone-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
          {filteredOptions.map((option) => (
            <button
              key={option}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                handleOptionClick(option);
              }}
              className={`w-full text-left px-4 py-2.5 text-[14px] text-stone-700 hover:bg-stone-50 transition-colors ${
                option === value ? 'bg-stone-100' : ''
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}

      {/* No results message */}
      {isOpen && filteredOptions.length === 0 && inputValue && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-stone-200 rounded-xl shadow-lg p-3">
          <p className="text-[13px] text-stone-500">
            No matches found. Press Enter to use "{inputValue}"
          </p>
        </div>
      )}
    </div>
  );
}
