import { useState } from "react";
import { Highlight, themes } from "prism-react-renderer";
import { Copy, Check, Terminal } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  code: string;
  language: string;
  filename?: string;
  className?: string;
}

export function CodeBlock({ code, language, filename, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn("rounded-lg overflow-hidden border border-slate-200 shadow-sm my-6 bg-white", className)}>
      <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-slate-500" />
          <span className="text-xs font-mono font-medium text-slate-600">{filename || "Source Code"}</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium text-slate-600 hover:bg-slate-200 transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-emerald-600">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Code</span>
            </>
          )}
        </button>
      </div>
      
      <Highlight theme={themes.github} code={code} language={language}>
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre className={cn("p-4 overflow-x-auto text-sm font-mono leading-relaxed", className)} style={style}>
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })} className="table-row">
                <span className="table-cell select-none text-slate-300 text-xs pr-4 text-right w-8">{i + 1}</span>
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
