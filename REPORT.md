# SWE 261P Project Report: Checkstyle
**GitHub repository link:** https://github.com/yunzhexu94-crypto/checkstyle
## 1. Introduction
**Software Project:** Checkstyle  
**Purpose:** Checkstyle is a development tool to help programmers write Java code that adheres to a coding standard. It automates the process of checking Java code to spare humans of this boring (but important) task. It supports the Google Java Style Guide and Sun Code Conventions by default but is highly configurable.  
**Relevance:** 
- **Size:** It is a large-scale, enterprise-grade open-source project with an estimated 100,000+ lines of code.
- **Languages:** Written primarily in **Java**.
- **Users:** Widely adopted in the Java ecosystem, used by major open-source projects, and integrated into popular IDEs (IntelliJ, Eclipse) and build tools (Maven, Gradle).

## 2. Build Process
**Build System:** Apache Maven  
**How to Build:**
1.  **Clone the repository:**
    ```bash
    git clone https://github.com/checkstyle/checkstyle.git
    cd checkstyle
    ```
2.  **Build and Run Tests:**
    The project follows a standard Maven workflow. To build the project, run tests, and generate artifacts:
    ```bash
    mvn clean install
    ```
    To skip the extensive validation checks (for a faster build during development):
    ```bash
    mvn -P no-validations clean install
    ```
    This command compiles the source code, runs unit tests, and packages the JAR file.

## 3. Existing Test Cases
**Testing Framework:** JUnit 5 (Jupiter)  
**Existing Practices:**
- **High Coverage:** The project mandates 100% code coverage for all checks.
- **Test Location:** Tests are located in `src/test/java`, organized by the package structure of the checks they verify.
- **Test Support:** It uses a custom test support class `AbstractModuleTestSupport` to simplify testing custom checks.
- **Running Tests:**
    Execute all tests via Maven:
    ```bash
    mvn test
    ```
    Run a specific test class:
    ```bash
    mvn -Dtest=MethodLimitCheckTest test
    ```

## 4. Partitioning
**Motivation:** 
Systematic functional testing via Partition Testing is crucial for static analysis tools like Checkstyle. Since the input domain (all possible Java source code) is infinite, we must divide valid and invalid code patterns into equivalence classes. This ensures that a Check correctly identifies violations (positive cases) and ignores compliant code (negative cases) without false positives.

**Selected Feature:** `MethodLimitCheck`
This check restricts the number of methods allowed in a class. The default maximum is 30.

**Partitioning Scheme:**
We define partitions based on the number of methods in a class relative to the configured limit (`max`).

1.  **Partition 1 (Valid):** Number of methods < `max`
    -   *Representative Value:* `max - 1`
2.  **Partition 2 (Boundary - Valid):** Number of methods == `max`
    -   *Representative Value:* `max`
3.  **Partition 3 (Invalid):** Number of methods > `max`
    -   *Representative Value:* `max + 1`
4.  **Partition 4 (Edge Case):** Empty class (0 methods)
    -   *Representative Value:* `0`

**Representative Values:**
Assuming `max = 30`:
*   P1: 29 methods
*   P2: 30 methods
*   P3: 31 methods
*   P4: 0 methods

**New Test Cases (JUnit):**
*(See accompanying code file `MethodLimitPartitionTest.java` for implementation)*

| Test Case ID | Input Description | Partition Coverage | Expected Result | Description |
| :--- | :--- | :--- | :--- | :--- |
| `TC01` | Class with 29 methods | P1 | No Violations | Valid case below limit |
| `TC02` | Class with 30 methods | P2 | No Violations | Boundary case at limit |
| `TC03` | Class with 31 methods | P3 | 1 Violation | Invalid case exceeding limit |
| `TC04` | Class with 0 methods | P4 | No Violations | Edge case empty class |
