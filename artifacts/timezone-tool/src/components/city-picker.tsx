import * as React from "react"
import { Check, ChevronsUpDown, Search, MapPin } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { City, cities } from "@/lib/cities"

interface CityPickerProps {
  value: City | null;
  onChange: (city: City) => void;
  placeholder?: string;
  className?: string;
}

export function CityPicker({ value, onChange, placeholder = "Select city...", className }: CityPickerProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between bg-white hover:bg-slate-50 border-slate-200 shadow-sm transition-all duration-200",
            !value && "text-muted-foreground",
            className
          )}
        >
          <div className="flex items-center gap-2 overflow-hidden">
            <MapPin className="h-4 w-4 shrink-0 text-primary/60" />
            <span className="truncate">
              {value ? `${value.name}, ${value.country}` : placeholder}
            </span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0 shadow-xl border-slate-100 rounded-xl overflow-hidden" align="start">
        <Command>
          <CommandInput placeholder="Search worldwide cities..." className="border-none focus:ring-0" />
          <CommandList className="hide-scrollbar max-h-[280px]">
            <CommandEmpty className="py-6 text-center text-sm text-slate-500">
              No city found. Try a major hub.
            </CommandEmpty>
            <CommandGroup className="p-1.5">
              {cities.map((city) => (
                <CommandItem
                  key={city.id}
                  value={`${city.name} ${city.country}`}
                  onSelect={() => {
                    onChange(city)
                    setOpen(false)
                  }}
                  className="rounded-lg cursor-pointer flex items-center justify-between data-[selected='true']:bg-primary/5 data-[selected='true']:text-primary"
                >
                  <div className="flex flex-col">
                    <span className="font-medium text-slate-900">{city.name}</span>
                    <span className="text-xs text-slate-500">{city.country} • {city.timezone.split('/')[1]?.replace('_', ' ')}</span>
                  </div>
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4 text-primary",
                      value?.id === city.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
