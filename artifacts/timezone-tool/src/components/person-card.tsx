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
      initial={{ opacity: 0, height: 0, scale: 0.95 }}
      animate={{ opacity: 1, height: 'auto', scale: 1 }}
      exit={{ opacity: 0, height: 0, scale: 0.95, transition: { duration: 0.2 } }}
      className="group relative flex flex-col gap-2 p-3 rounded-xl bg-card border border-border/50 hover:border-border hover:bg-muted/30 transition-all shadow-sm"
    >
      <div className="flex items-center gap-2">
        <div className={`flex items-center justify-center w-7 h-7 rounded-md shrink-0 ${isMe ? 'bg-primary/20 text-primary' : 'bg-secondary text-secondary-foreground'}`}>
          {isMe ? <Globe className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
        </div>
        
        <div className="flex-1 min-w-0">
          {isMe ? (
            <div className="font-medium text-sm text-foreground truncate pl-1">You</div>
          ) : (
            <Input
              value={person.name}
              onChange={(e) => onUpdate({ name: e.target.value })}
              className="h-7 text-sm font-medium border-transparent bg-transparent hover:bg-secondary/50 focus-visible:bg-secondary/50 focus-visible:ring-1 focus-visible:ring-primary/50 px-2 py-0"
              placeholder="Colleague Name"
            />
          )}
        </div>
        
        {!isMe && onRemove && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6 text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-md"
            onClick={onRemove}
          >
            <X className="w-3.5 h-3.5" />
          </Button>
        )}
      </div>

      <div className="pl-9 pr-1 pb-1">
        <CityPicker 
          value={person.city} 
          onChange={(city) => onUpdate({ city })}
          placeholder="Select city..." 
          className="h-8 text-xs bg-transparent border-dashed border-border hover:border-primary/50"
        />
      </div>
    </motion.div>
  )
}