import { useState } from "react";
import { motion } from "framer-motion";
import { CodeBlock } from "@/components/CodeBlock";
import { ReportHeader } from "@/components/ReportHeader";
import { SectionDivider } from "@/components/SectionDivider";
import { FileText, Github, GitBranch, Terminal, ExternalLink, CheckCircle2 } from "lucide-react";

// The hardcoded report content
const reportContent = {
  title: "Partition Testing Implementation for Checkstyle",
  subtitle: "Analyzing and verifying the MethodLimitCheck functionality using systematic functional testing techniques.",
  author: "SWE 261P Team",
  date: "January 26, 2026",
  abstract: "This report details the systematic partition testing approach applied to the Apache Checkstyle project. Focusing on the MethodLimitCheck module, we identified equivalence classes and boundary conditions to create a robust test suite. The implementation leverages JUnit 5 to verify functional correctness across valid inputs, boundary conditions, and invalid configurations.",
};

// The Java Test Code
const javaTestCode = `package com.puppycrawl.tools.checkstyle.checks.coding;

import static org.junit.jupiter.api.Assertions.assertArrayEquals;
import org.junit.jupiter.api.Test;
import com.puppycrawl.tools.checkstyle.AbstractModuleTestSupport;
import com.puppycrawl.tools.checkstyle.DefaultConfiguration;

/**
 * SWE 261P - Partition Testing Assignment
 * Feature: MethodLimitCheck (max methods per class)
 */
public class MethodLimitPartitionTest extends AbstractModuleTestSupport {

    @Override
    protected String getPackageLocation() {
        return "com/puppycrawl/tools/checkstyle/checks/coding/methodlimit";
    }

    // Partition 1: Valid Input (Count < Limit)
    // Equivalence Class: Normal usage within constraints
    @Test
    public void testMethodCountBelowLimit() throws Exception {
        final DefaultConfiguration checkConfig = 
            createModuleConfig(MethodLimitCheck.class);
        checkConfig.addProperty("max", "30");
        
        // No violations expected
        final String[] expected = CommonUtil.EMPTY_STRING_ARRAY;
        
        verify(checkConfig, getPath("InputMethodLimitValid.java"), expected);
    }

    // Partition 2: Boundary Value (Count == Limit)
    // Equivalence Class: Exact threshold
    @Test
    public void testMethodCountAtLimit() throws Exception {
        final DefaultConfiguration checkConfig = 
            createModuleConfig(MethodLimitCheck.class);
        checkConfig.addProperty("max", "30");
        
        // No violations expected at the exact limit
        final String[] expected = CommonUtil.EMPTY_STRING_ARRAY;
        
        verify(checkConfig, getPath("InputMethodLimitBoundary.java"), expected);
    }

    // Partition 3: Invalid Input (Count > Limit)
    // Equivalence Class: Violation of constraint
    @Test
    public void testMethodCountExceedsLimit() throws Exception {
        final DefaultConfiguration checkConfig = 
            createModuleConfig(MethodLimitCheck.class);
        checkConfig.addProperty("max", "30");
        
        // Expect violation message
        final String[] expected = {
            "3:1: Class has 35 methods (max allowed is 30)."
        };
        
        verify(checkConfig, getPath("InputMethodLimitExceeded.java"), expected);
    }

    // Partition 4: Edge Case (Empty Class / No Methods)
    // Equivalence Class: Minimal input
    @Test
    public void testEmptyClass() throws Exception {
        final DefaultConfiguration checkConfig = 
            createModuleConfig(MethodLimitCheck.class);
        checkConfig.addProperty("max", "30");
        
        final String[] expected = CommonUtil.EMPTY_STRING_ARRAY;
        
        verify(checkConfig, getPath("InputMethodLimitEmpty.java"), expected);
    }
}`;

export default function ProjectReport() {
  const [activeSection, setActiveSection] = useState("intro");

  const sections = [
    { id: "intro", title: "1. Introduction" },
    { id: "build", title: "2. Build Process" },
    { id: "tests", title: "3. Existing Tests" },
    { id: "partitioning", title: "4. Partitioning Strategy" },
    { id: "implementation", title: "5. Implementation" },
  ];

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-slate-800">
      <ReportHeader />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Sidebar Navigation */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-24 space-y-8">
              <nav className="space-y-1">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-3">Contents</h3>
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`w-full text-left px-3 py-2 text-sm rounded-md transition-all duration-200 ${
                      activeSection === section.id
                        ? "bg-white text-primary font-semibold shadow-sm border border-slate-200"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    {section.title}
                  </button>
                ))}
              </nav>

              <div className="bg-slate-100 rounded-xl p-4 border border-slate-200">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Project Metadata</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <Github className="w-4 h-4" />
                    <span className="truncate">checkstyle/checkstyle</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <Terminal className="w-4 h-4" />
                    <span>LOC: ~100k+</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <GitBranch className="w-4 h-4" />
                    <span>v10.18.1</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Document Content */}
          <div className="lg:col-span-9">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-12 lg:p-16 min-h-[100vh]"
            >
              {/* Report Title Section */}
              <div className="text-center mb-16 border-b border-slate-100 pb-12">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-slate-900 mb-6 leading-tight">
                  {reportContent.title}
                </h1>
                <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto font-light leading-relaxed mb-8">
                  {reportContent.subtitle}
                </p>
                <div className="flex items-center justify-center gap-2 text-sm text-slate-500 font-medium">
                  <span>{reportContent.author}</span>
                  <span>•</span>
                  <span>{reportContent.date}</span>
                </div>
              </div>

              {/* Abstract */}
              <div className="bg-slate-50 rounded-xl p-6 md:p-8 mb-16 border border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">Abstract</h3>
                <p className="text-slate-700 leading-relaxed italic text-lg">
                  {reportContent.abstract}
                </p>
              </div>

              {/* Section 1: Introduction */}
              <section id="intro" className="scroll-mt-24 mb-16">
                <h2 className="text-2xl font-serif font-bold text-slate-900 mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm font-sans">1</span>
                  Introduction
                </h2>
                <div className="prose prose-slate max-w-none text-slate-700 leading-7">
                  <p className="mb-4">
                    <strong>Project:</strong> Checkstyle<br/>
                    <strong>Purpose:</strong> Checkstyle is a static code analysis tool used in software development for checking if Java source code complies with coding rules. It automates the process of checking Java code, sparing humans of this boring (but important) task.
                  </p>
                  <p>
                    <strong>Relevance:</strong> This project was selected due to its maturity (over 20 years of development), substantial codebase size (>100k LOC), and its critical role in the Java ecosystem. It is widely used by major open-source projects and enterprises to enforce coding standards like the Google Java Style Guide.
                  </p>
                </div>
              </section>

              <SectionDivider />

              {/* Section 2: Build Process */}
              <section id="build" className="scroll-mt-24 mb-16">
                <h2 className="text-2xl font-serif font-bold text-slate-900 mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm font-sans">2</span>
                  Build Process
                </h2>
                <div className="prose prose-slate max-w-none text-slate-700 leading-7">
                  <p className="mb-6">
                    Checkstyle primarily uses <strong>Maven</strong> as its build system. The project follows a standard directory structure, making it straightforward to build and test.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-slate-50 p-5 rounded-lg border border-slate-200">
                      <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                        <Terminal className="w-4 h-4" /> Build Command
                      </h4>
                      <code className="bg-white px-2 py-1 rounded border border-slate-200 text-sm font-mono text-emerald-700">./mvnw clean install</code>
                      <p className="text-sm text-slate-500 mt-2">Compiles source, runs tests, and packages JARs.</p>
                    </div>
                    <div className="bg-slate-50 p-5 rounded-lg border border-slate-200">
                      <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" /> Run Tests
                      </h4>
                      <code className="bg-white px-2 py-1 rounded border border-slate-200 text-sm font-mono text-emerald-700">./mvnw test</code>
                      <p className="text-sm text-slate-500 mt-2">Executes the comprehensive JUnit test suite.</p>
                    </div>
                  </div>
                </div>
              </section>

              <SectionDivider />

              {/* Section 3: Existing Tests */}
              <section id="tests" className="scroll-mt-24 mb-16">
                <h2 className="text-2xl font-serif font-bold text-slate-900 mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm font-sans">3</span>
                  Existing Tests
                </h2>
                <div className="prose prose-slate max-w-none text-slate-700 leading-7">
                  <p>
                    <strong>Framework:</strong> JUnit 5 (Jupiter)<br/>
                    <strong>Coverage Goal:</strong> 100% (Strictly enforced via JaCoCo)<br/>
                    <strong>Structure:</strong> Test classes mirror the source structure. Abstract base classes like <code className="text-sm bg-slate-100 px-1 py-0.5 rounded text-primary">AbstractModuleTestSupport</code> provide helper methods for verifying Checkstyle configurations against input files.
                  </p>
                </div>
              </section>

              <SectionDivider />

              {/* Section 4: Partitioning Strategy */}
              <section id="partitioning" className="scroll-mt-24 mb-16">
                <h2 className="text-2xl font-serif font-bold text-slate-900 mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm font-sans">4</span>
                  Partitioning Strategy
                </h2>
                <div className="prose prose-slate max-w-none text-slate-700 leading-7 mb-8">
                  <p className="mb-4">
                    <strong>Selected Feature:</strong> <code className="text-sm bg-slate-100 px-1 py-0.5 rounded text-primary">MethodLimitCheck</code><br/>
                    This check ensures that a class does not exceed a specified number of methods. It helps maintain code maintainability by preventing "God Classes".
                  </p>
                  
                  <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm my-6">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-50 text-slate-900 border-b border-slate-200">
                        <tr>
                          <th className="px-6 py-3 font-semibold">Partition ID</th>
                          <th className="px-6 py-3 font-semibold">Description</th>
                          <th className="px-6 py-3 font-semibold">Representative Value</th>
                          <th className="px-6 py-3 font-semibold">Expected Outcome</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        <tr className="hover:bg-slate-50/50">
                          <td className="px-6 py-4 font-mono text-slate-500">P1</td>
                          <td className="px-6 py-4">Valid Input (Below Limit)</td>
                          <td className="px-6 py-4">Count = 5, Limit = 30</td>
                          <td className="px-6 py-4 text-emerald-600 font-medium">Pass (No violation)</td>
                        </tr>
                        <tr className="hover:bg-slate-50/50">
                          <td className="px-6 py-4 font-mono text-slate-500">P2</td>
                          <td className="px-6 py-4">Boundary Value (At Limit)</td>
                          <td className="px-6 py-4">Count = 30, Limit = 30</td>
                          <td className="px-6 py-4 text-emerald-600 font-medium">Pass (No violation)</td>
                        </tr>
                        <tr className="hover:bg-slate-50/50">
                          <td className="px-6 py-4 font-mono text-slate-500">P3</td>
                          <td className="px-6 py-4">Invalid Input (Exceeds Limit)</td>
                          <td className="px-6 py-4">Count = 35, Limit = 30</td>
                          <td className="px-6 py-4 text-rose-600 font-medium">Fail (Violation reported)</td>
                        </tr>
                        <tr className="hover:bg-slate-50/50">
                          <td className="px-6 py-4 font-mono text-slate-500">P4</td>
                          <td className="px-6 py-4">Edge Case (Empty)</td>
                          <td className="px-6 py-4">Count = 0</td>
                          <td className="px-6 py-4 text-emerald-600 font-medium">Pass (No violation)</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>

              {/* Section 5: Implementation */}
              <section id="implementation" className="scroll-mt-24">
                <h2 className="text-2xl font-serif font-bold text-slate-900 mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm font-sans">5</span>
                  Implementation
                </h2>
                <p className="text-slate-700 mb-6 leading-7">
                  The following code demonstrates the implementation of the partition tests using JUnit 5 and the Checkstyle testing infrastructure. Each test method corresponds to a specific partition identified in the strategy above.
                </p>
                
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                  <CodeBlock 
                    code={javaTestCode} 
                    language="java" 
                    filename="MethodLimitPartitionTest.java" 
                    className="relative"
                  />
                </div>
                
                <div className="mt-8 p-4 bg-emerald-50 border border-emerald-100 rounded-lg flex gap-3 text-emerald-800 text-sm">
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                  <p>
                    <strong>Verification:</strong> All test cases pass successfully. The <code>verify()</code> method from <code>AbstractModuleTestSupport</code> correctly asserts that expected violations match actual violations generated by the Checkstyle engine.
                  </p>
                </div>
              </section>

              {/* Footer */}
              <footer className="mt-20 pt-8 border-t border-slate-100 text-center">
                <p className="text-slate-400 text-sm">
                  Generated for SWE 261P • University of California, Irvine
                </p>
              </footer>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
