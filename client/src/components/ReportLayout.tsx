import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { BookOpen, FileCode, Home, Menu } from "lucide-react";

export function ReportLayout({ children }: { children: ReactNode }) {
  const [location] = useLocation();

  const navItems = [
    { label: "Introduction", path: "/", icon: Home },
    { label: "Partition Testing", path: "/#testing", icon: BookOpen },
    { label: "Source Code", path: "/#code", icon: FileCode },
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-background font-sans text-foreground">
      {/* Sidebar Navigation - Fixed on Desktop */}
      <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-card border-r border-border hidden lg:flex flex-col">
        <div className="p-6 border-b border-border/50">
          <h1 className="font-serif font-bold text-xl tracking-tight text-primary">SWE 261P</h1>
          <p className="text-xs text-muted-foreground mt-1">Software Testing & QA</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <a
              key={item.path}
              href={item.path}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                ${location === item.path || (location === "/" && item.path === "/") 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"}
              `}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </a>
          ))}
        </nav>

        <div className="p-4 border-t border-border/50">
          <div className="bg-secondary/50 rounded-lg p-3">
            <p className="text-xs font-semibold">Author</p>
            <p className="text-xs text-muted-foreground mt-0.5">Student ID: 12345678</p>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 z-40 bg-white/80 dark:bg-card/80 backdrop-blur-md border-b border-border px-4 py-3 flex items-center justify-between">
        <span className="font-serif font-bold text-primary">SWE 261P</span>
        <button className="p-2 -mr-2 text-muted-foreground">
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Main Content Area */}
      <main className="lg:pl-64 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 py-12 lg:py-16">
          {children}
        </div>
      </main>
    </div>
  );
}
