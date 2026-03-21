import * as React from "react"
import { Plus, Users } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { Button } from "@/components/ui/button"
import { cities, getLocalCity } from "@/lib/cities"
import { Person, PersonCard } from "@/components/person-card"
import { OverlapTable } from "@/components/overlap-table"

const defaultColleagueCities = [
  cities.find(c => c.name === "London")!,
  cities.find(c => c.name === "Tokyo")!,
  cities.find(c => c.name === "Singapore")!,
]

const defaultColleagues: Person[] = defaultColleagueCities.map((city, i) => ({
  id: `default-${i}`,
  name: `Colleague ${i + 1}`,
  city,
}))

export default function Home() {
  const [me, setMe] = React.useState<Person>({
    id: "me",
    name: "You",
    city: cities.find(c => c.name === "New York") ?? null,
  })

  const [colleagues, setColleagues] = React.useState<Person[]>(defaultColleagues)

  const [dragIndex, setDragIndex] = React.useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = React.useState<number | null>(null)

  React.useEffect(() => {
    const detectedCity = getLocalCity();
    if (detectedCity) {
      setMe(prev => ({ ...prev, city: detectedCity }));
    }
  }, []);

  const addColleague = () => {
    if (colleagues.length >= 5) return;
    const newId = Math.random().toString(36).substring(7);
    setColleagues(prev => [...prev, {
      id: newId,
      name: `Colleague ${prev.length + 1}`,
      city: null,
    }]);
  }

  const removeColleague = (id: string) => {
    setColleagues(prev => prev.filter(c => c.id !== id));
  }

  const updateColleague = (id: string, updates: Partial<Person>) => {
    setColleagues(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  }

  const handleDragStart = (index: number) => {
    setDragIndex(index);
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (index !== dragOverIndex) setDragOverIndex(index);
  }

  const handleDrop = (index: number) => {
    if (dragIndex !== null && dragIndex !== index) {
      setColleagues(prev => {
        const next = [...prev];
        const [item] = next.splice(dragIndex, 1);
        next.splice(index, 0, item);
        return next;
      });
    }
    setDragIndex(null);
    setDragOverIndex(null);
  }

  const handleDragEnd = () => {
    setDragIndex(null);
    setDragOverIndex(null);
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-[20%] right-[-5%] w-[30%] h-[50%] bg-blue-400/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 relative z-10">

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center justify-center p-2.5 mb-6 rounded-2xl bg-white shadow-sm border border-slate-200 text-primary"
          >
            <Users className="w-6 h-6" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4"
          >
            Find the perfect time to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-teal-400">
              collaborate.
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-500"
          >
            Compare up to 5 time zones side-by-side and instantly spot the
            optimal working hours for your global team.
          </motion.p>
        </div>

        {/* People cards */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Team Locations</h2>
              {colleagues.length > 0 && (
                <p className="text-xs text-slate-400 mt-0.5">Drag colleague cards to reorder columns</p>
              )}
            </div>
            <Button
              onClick={addColleague}
              disabled={colleagues.length >= 5}
              className="rounded-full shadow-md shadow-primary/20 hover:shadow-lg transition-all"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Colleague
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* "You" card — never draggable */}
            <PersonCard
              isMe={true}
              person={me}
              onUpdate={(updates) => setMe(prev => ({ ...prev, ...updates }))}
            />

            <AnimatePresence>
              {colleagues.map((colleague, index) => (
                <PersonCard
                  key={colleague.id}
                  isMe={false}
                  person={colleague}
                  onUpdate={(updates) => updateColleague(colleague.id, updates)}
                  onRemove={() => removeColleague(colleague.id)}
                  draggable
                  isDragging={dragIndex === index}
                  isDragOver={dragOverIndex === index && dragIndex !== index}
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDrop={() => handleDrop(index)}
                  onDragEnd={handleDragEnd}
                />
              ))}
            </AnimatePresence>

            {colleagues.length < 5 && (
              <motion.button
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={addColleague}
                className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-primary/30 text-slate-400 hover:text-primary transition-colors min-h-[160px]"
              >
                <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center mb-1">
                  <Plus className="w-5 h-5" />
                </div>
                <span className="font-medium text-sm">Add another location</span>
                <span className="text-xs text-slate-400">
                  {5 - colleagues.length} slots remaining
                </span>
              </motion.button>
            )}
          </div>
        </div>

        {/* Overlap table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="relative"
        >
          <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl -z-10" />
          <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-blue-400/10 rounded-full blur-2xl -z-10" />

          <OverlapTable
            people={[me, ...colleagues]}
            baseTimezone={me.city?.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone}
          />
        </motion.div>

      </div>
    </div>
  )
}
