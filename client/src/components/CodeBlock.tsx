import React, { useState } from "react";
import { Highlight, themes, type Language } from "prism-react-renderer";
import { Check, Copy, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  className?: string;
}

export function CodeBlock({ code, language = "java", filename, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn("group rounded-xl overflow-hidden border border-border/60 bg-[#1e1e1e] shadow-lg my-8", className)}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-white/5">
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
          <Terminal className="w-3.5 h-3.5" />
          {filename || "Code Snippet"}
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-white/10 transition-colors text-xs text-muted-foreground font-medium"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-green-400" />
              <span className="text-green-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Code</span>
            </>
          )}
        </button>
      </div>

      {/* Code */}
      <Highlight
        theme={themes.vsDark}
        code={code.trim()}
        language={language as Language}
      >
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre
            className={cn(className, "p-4 overflow-x-auto text-sm font-mono leading-relaxed")}
            style={{ ...style, backgroundColor: "transparent" }}
          >
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })} className="table-row">
                <span className="table-cell select-none text-white/20 text-right pr-4 w-8 text-xs">
                  {i + 1}
                </span>
                <span className="table-cell">
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token })} />
                  ))}
                </span>
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  );
}
