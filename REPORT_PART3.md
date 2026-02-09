# SWE 261P Project Report Part 3: White Box Testing and Coverage

**Project:** Checkstyle

**GitHub Repository:** https://github.com/yunzhexu94-crypto/checkstyle

**Team Members:** [YUNZHE XU]

---

## 1. Structural (White Box) Testing

**What is Structural Testing?**
Structural testing, also known as white-box testing, is a testing method where the internal structure, design, and implementation of the item being tested are known to the tester. Unlike black-box testing, which focuses on input-output behavior without knowledge of internal workings, structural testing derives test cases directly from the source code. It involves verifying the flow of inputs through the code, ensuring that all logical paths, branches, and conditions are executed and behave as expected.

**Why is it Important?**
1.  **Code Coverage:** It ensures that a high percentage of the code is executed, reducing the likelihood of hidden bugs in rarely used paths (e.g., error handling blocks).
2.  **Logic Verification:** It helps uncover logical errors, incorrect assumptions, and infinite loops that might not be detected by functional testing alone.
3.  **Redundant Code Elimination:** By analyzing the code structure, testers can identify dead code or redundant logic that can be removed to improve maintainability.
4.  **Optimization:** It allows developers to identify performance bottlenecks and optimize the code structure for better efficiency.
5.  **Robustness:** By testing internal boundaries and edge cases (e.g., loop limits, conditional boundaries), it ensures the software is robust against unexpected internal states.

---

## 2. Existing Test Suite Coverage

Before adding new test cases, we analyzed the coverage of the existing test suite (primarily `DeclarationOrderFSMTest` from Part 2) against the `DeclarationOrderCheck` class.

**Tools Used:** JaCoCo (Java Code Coverage) via Maven.

### Baseline Coverage Report

| Metric | Missed | Covered | Total | Coverage % |
| :--- | :--- | :--- | :--- | :--- |
| **Instructions** | 172 | 153 | 325 | 47% |
| **Branches** | 40 | 20 | 60 | 33% |
| **Lines** | 41 | 41 | 82 | **50%** |
| **Methods** | 8 | 7 | 15 | 46% |

*(Data derived from JaCoCo CSV report)*

### Analysis of Uncovered Code
The existing tests focused on the main state transitions of the Finite State Machine (Valid/Invalid sequencing of Declarations). However, several auxiliary features and logic branches were left uncovered:

1.  **Configuration Setters:** The methods `setIgnoreConstructors` and `setIgnoreModifiers` were never called, leaving the logic that uses these flags untested.
2.  **Forward Reference Logic:** The method `isForwardReference` (and its helper `getAllTokensOfType`) which prevents logging violations for forward references was not exercised.
3.  **Access Modifier Logic:** While basic public/private ordering might have been touched, specific permutations and the logic within `processModifiersSubState` handling `ignoreModifiers` were not fully covered.
4.  **Helper Methods:** Some private helper methods for token traversal were only partially covered.

---

## 3. Improved Test Suite Coverage

We implemented a new test class, `DeclarationOrderCoverageTest`, to target the identified uncovered areas.

### New Test Cases

We added **5 new test cases** targeting specific logic branches:

| Test Case | Description | Code Covered | GitHub Link |
| :--- | :--- | :--- | :--- |
| `testIgnoreConstructors` | Verifies that constructor placement violations are ignored when `ignoreConstructors` is set to true. | `processConstructor`, `setIgnoreConstructors` | [View Code]([INSERT PERMALINK TO DeclarationOrderCoverageTest.java lines 109-122]) |
| `testIgnoreModifiers` | Verifies that access modifier violations are ignored when `ignoreModifiers` is set to true. | `processModifiersState`, `setIgnoreModifiers` | [View Code]([INSERT PERMALINK TO DeclarationOrderCoverageTest.java lines 125-138]) |
| `testValidAccessOrder` | Explicitly tests valid access modifier ordering (Public → Private) to ensure `ScopeUtil` integration works. | `processModifiersSubState` | [View Code]([INSERT PERMALINK TO DeclarationOrderCoverageTest.java lines 141-155]) |
| `testInvalidAccessOrder` | Explicitly tests invalid access modifier ordering (Private → Public) to trigger the violation log. | `processModifiersSubState` | [View Code]([INSERT PERMALINK TO DeclarationOrderCoverageTest.java lines 158-170]) |
| `testForwardReference` | Simulates a forward reference (variable utilizing a future variable) to verify the `isForwardReference` logic suppresses the violation. | `isForwardReference`, `getAllTokensOfType` | [View Code]([INSERT PERMALINK TO DeclarationOrderCoverageTest.java lines 173-205]) |

### Improved Coverage Report

After running the new test cases, the coverage metrics improved significantly:

| Metric | Missed | Covered | Total | Coverage % | Improvement |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Instructions** | 50 | 275 | 325 | 84% | +37% |
| **Branches** | 13 | 47 | 60 | 78% | +45% |
| **Lines** | 8 | 74 | 82 | **90%** | **+33 lines** |
| **Methods** | 4 | 11 | 15 | 73% | +27% |

*(Note: The file `DeclarationOrderCheck.java` contains only 82 executable lines. We increased coverage from 41 to 74 lines, an increase of 33 lines. Achieving +50 lines was not possible as the total code size is small, but we reached 90% line coverage.)*

### Code Covered & Functionality Tested
The new tests successfully covered:
1.  **Configuration Flags:** We verified that users can optionally ignore constructor and modifier checks, covering the setters and the conditional logic in `processConstructor` and `processModifiersState`.
2.  **Access Modifier Logic:** We achieved deep coverage of `processModifiersSubState` by testing both valid and invalid permutations of access modifiers.
3.  **Complex AST Traversal:** The `testForwardReference` case exercised the `isForwardReference` and `getAllTokensOfType` methods, which involve recursive or iterative traversal of the Abstract Syntax Tree to find dependencies between variables.

### Evidence
[INSERT SCREENSHOT OF JACOCO COVERAGE REPORT HERE]

