import * as React from "react"
import { Plus, Clock } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { Button } from "@/components/ui/button"
import { cities, getLocalCity } from "@/lib/cities"
import { Person, PersonCard } from "@/components/person-card"
import { OverlapTable } from "@/components/overlap-table"

// Default example cities shown on first load so users immediately see the table
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

  // Try to replace the default "You" city with the browser's actual timezone
  React.useEffect(() => {
    const detectedCity = getLocalCity();
    if (detectedCity) {
      setMe(prev => ({ ...prev, city: detectedCity }));
    }
  }, []);

  const addColleague = () => {
    if (colleagues.length >= 7) return;
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

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-background overflow-hidden text-foreground">
      {/* Sidebar */}
      <aside className="w-full lg:w-[340px] border-b lg:border-b-0 lg:border-r border-border bg-card flex flex-col z-20 shadow-xl">
        {/* Header/Branding */}
        <div className="p-4 lg:p-6 border-b border-border flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground shadow-sm">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-tight leading-none text-foreground">Time Overlap</h1>
            <p className="text-xs text-muted-foreground mt-1">Global team sync</p>
          </div>
        </div>

        {/* People List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 lg:p-6 space-y-6">
          <div>
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Your Timezone</h2>
            <PersonCard
              isMe={true}
              person={me}
              onUpdate={(updates) => setMe(prev => ({ ...prev, ...updates }))}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Team ({colleagues.length}/7)</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={addColleague}
                disabled={colleagues.length >= 7}
                className="h-6 w-6 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors"
                title="Add Colleague"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-3">
              <AnimatePresence initial={false}>
                {colleagues.map((colleague) => (
                  <PersonCard
                    key={colleague.id}
                    isMe={false}
                    person={colleague}
                    onUpdate={(updates) => updateColleague(colleague.id, updates)}
                    onRemove={() => removeColleague(colleague.id)}
                  />
                ))}
              </AnimatePresence>

              {colleagues.length < 7 && (
                <motion.div
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Button
                    variant="outline"
                    className="w-full justify-start text-muted-foreground border-dashed border-border hover:border-primary/50 hover:bg-primary/5 transition-colors h-10"
                    onClick={addColleague}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Colleague
                  </Button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area - Table */}
      <main className="flex-1 overflow-hidden relative bg-background/50 flex flex-col">
        {/* Subtle decorative lights in dark mode */}
        <div className="absolute top-[-20%] left-[20%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[50%] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="flex-1 overflow-auto custom-scrollbar p-0 lg:p-8 relative z-10">
          <div className="h-full flex flex-col max-w-[1400px] mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              className="flex-1 flex flex-col lg:rounded-2xl border-0 lg:border border-border shadow-2xl overflow-hidden bg-card"
            >
              <OverlapTable
                people={[me, ...colleagues]}
                baseTimezone={me.city?.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone}
              />
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  )
}