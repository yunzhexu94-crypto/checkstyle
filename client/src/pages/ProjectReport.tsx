import { motion } from "framer-motion";
import { CodeBlock } from "@/components/CodeBlock";
import { ReportLayout } from "@/components/ReportLayout";

const javaTestCode = `package org.apache.commons.lang3;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import org.junit.jupiter.api.Test;

/**
 * SWE 261P Project - Partition Testing
 * Target: Apache Commons Lang StringUtils.substring
 */
class StringUtilsSubstringTest {
    
    private static final String FOOBAR = "foobar";

    @Test
    void testSubstring_StringInt() {
        // Partition 1: Null input
        assertNull(StringUtils.substring(null, 0));
        
        // Partition 2: Empty string
        assertEquals("", StringUtils.substring("", 0));
        
        // Partition 3: Valid positive start index
        assertEquals("bar", StringUtils.substring(FOOBAR, 3));
        
        // Partition 4: Start index beyond length
        assertEquals("", StringUtils.substring(FOOBAR, 100));
        
        // Partition 5: Negative start index (from end)
        assertEquals("bar", StringUtils.substring(FOOBAR, -3));
        
        // Partition 6: Negative start beyond length
        assertEquals("foobar", StringUtils.substring(FOOBAR, -10));
    }

    @Test
    void testSubstring_StringIntInt() {
        // Partition 1: Valid range
        assertEquals("foo", StringUtils.substring(FOOBAR, 0, 3));
        
        // Partition 2: End beyond length (truncates)
        assertEquals("bar", StringUtils.substring(FOOBAR, 3, 100));
        
        // Partition 3: End before start (empty)
        assertEquals("", StringUtils.substring(FOOBAR, 4, 2));
        
        // Partition 4: Negative indices
        assertEquals("bar", StringUtils.substring(FOOBAR, -3, 6));
        assertEquals("oo", StringUtils.substring(FOOBAR, 1, -3));
    }
}`;

export default function ProjectReport() {
  return (
    <ReportLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header Section */}
        <header className="mb-12 pb-8 border-b border-border">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 text-xs font-semibold tracking-wide uppercase bg-primary/10 text-primary rounded-full">
              Final Project
            </span>
            <span className="text-sm text-muted-foreground">Jan 14, 2026</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4 leading-tight">
            Apache Commons Lang: StringUtils Partition Testing
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
            A comprehensive analysis and test suite implementation for the StringUtils library, focusing on boundary value analysis and partition testing methodologies.
          </p>
        </header>

        {/* Introduction Section */}
        <section id="intro" className="mb-16">
          <h2 className="text-2xl font-serif font-bold mb-6 flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary text-sm text-secondary-foreground font-sans">1</span>
            Introduction
          </h2>
          <div className="prose prose-slate dark:prose-invert max-w-none text-muted-foreground">
            <p className="mb-4">
              The <strong>Apache Commons Lang</strong> library provides a host of helper utilities for the java.lang API, most notably String manipulation methods. This project focuses on the <code>StringUtils</code> class, specifically the <code>substring</code> family of methods.
            </p>
            <p>
              The goal is to apply <em>Partition Testing</em> techniques to ensure robust handling of all possible input classes, including nulls, empty strings, negative indices, and out-of-bound values. By dividing the input domain into equivalence classes, we can derive a compact yet powerful set of test cases that cover the majority of execution paths.
            </p>
          </div>
        </section>

        {/* Testing Strategy Section */}
        <section id="testing" className="mb-16">
          <h2 className="text-2xl font-serif font-bold mb-6 flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary text-sm text-secondary-foreground font-sans">2</span>
            Testing Strategy
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white dark:bg-card p-6 rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-foreground mb-2">Input Partitions</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Null String Input</li>
                <li>Empty String ("")</li>
                <li>Valid Positive Indices</li>
                <li>Negative Indices (count from end)</li>
                <li>Indices > String Length</li>
              </ul>
            </div>
            <div className="bg-white dark:bg-card p-6 rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-foreground mb-2">Boundary Values</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Start Index = 0</li>
                <li>Start Index = Length</li>
                <li>Start Index = Length + 1</li>
                <li>End Index = Start Index</li>
                <li>Negative Index = -Length</li>
              </ul>
            </div>
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none text-muted-foreground">
            <p>
              The strategy identified several critical edge cases often missed in standard testing, particularly the handling of negative indices which Apache Commons treats as offsets from the end of the string. This behavior is unique compared to standard Java <code>String.substring</code>.
            </p>
          </div>
        </section>

        {/* Source Code Section */}
        <section id="code" className="mb-16">
           <h2 className="text-2xl font-serif font-bold mb-6 flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary text-sm text-secondary-foreground font-sans">3</span>
            Test Implementation
          </h2>
          <p className="text-muted-foreground mb-4">
            The following JUnit 5 test class demonstrates the implementation of the derived test cases. It covers <code>substring(String, int)</code> and <code>substring(String, int, int)</code>.
          </p>
          
          <CodeBlock 
            code={javaTestCode} 
            filename="StringUtilsSubstringTest.java" 
            language="java"
          />
        </section>
      </motion.div>
    </ReportLayout>
  );
}
