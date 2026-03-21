import * as React from "react"
import { X, User, Globe } from "lucide-react"
import { motion } from "framer-motion"

import { City } from "@/lib/cities"
import { CityPicker } from "@/components/city-picker"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export interface Person {
  id: string;
  name: string;
  city: City | null;
}

interface PersonCardProps {
  person: Person;
  isMe: boolean;
  onUpdate: (updates: Partial<Person>) => void;
  onRemove?: () => void;
}

export function PersonCard({ person, isMe, onUpdate, onRemove }: PersonCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      className="relative flex flex-col gap-4 p-5 rounded-2xl glass-card group hover:shadow-lg transition-shadow duration-300"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 w-full pr-6">
          <div className={`flex items-center justify-center w-10 h-10 rounded-full shrink-0 ${isMe ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-600'}`}>
            {isMe ? <Globe className="w-5 h-5" /> : <User className="w-5 h-5" />}
          </div>
          
          {isMe ? (
            <div className="font-semibold text-lg text-slate-800 tracking-tight">Your Location</div>
          ) : (
            <Input
              value={person.name}
              onChange={(e) => onUpdate({ name: e.target.value })}
              className="h-8 font-medium text-base border-transparent bg-transparent hover:border-slate-200 focus-visible:border-primary focus-visible:ring-primary/20 px-2 -ml-2"
              placeholder="Colleague Name"
            />
          )}
        </div>
        
        {!isMe && onRemove && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-4 right-4 h-8 w-8 text-slate-400 hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={onRemove}
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Location Picker */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-slate-500 ml-1 uppercase tracking-wider">
          Time Zone
        </label>
        <CityPicker 
          value={person.city} 
          onChange={(city) => onUpdate({ city })}
          placeholder="Search city..." 
        />
      </div>
    </motion.div>
  )
}
