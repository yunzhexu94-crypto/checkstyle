import { motion } from "framer-motion";

export function ReportHeader() {
  return (
    <header className="border-b border-border bg-white/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary text-primary-foreground rounded-lg flex items-center justify-center font-serif font-bold text-lg">
            S
          </div>
          <div>
            <h1 className="font-serif font-bold text-sm sm:text-base leading-none">SWE 261P Project</h1>
            <p className="text-xs text-muted-foreground mt-0.5">Software Engineering • Winter 2026</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden sm:block text-xs font-medium text-muted-foreground bg-slate-100 px-3 py-1 rounded-full">
            Report ID: SWE-261P-02
          </div>
        </div>
      </div>
    </header>
  );
}
