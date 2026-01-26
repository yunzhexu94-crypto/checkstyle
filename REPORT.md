# SWE 261P Project Report: Apache Commons Lang

## 1. Introduction
**Software Project:** Apache Commons Lang  
**Purpose:** Apache Commons Lang provides a host of helper utilities for the java.lang API, notably String manipulation methods, basic numerical methods, object reflection, concurrency, creation and serialization, and System properties. It complements the standard Java library by providing extra functionality for core classes.  
**Relevance:** 
- **Size:** It is a mature project with over 20 years of development. While exact LOC varies by version, it is well over the 15K LOC requirement (estimated 60K+ LOC).
- **Languages:** Written primarily in **Java**.
- **Users:** Used by thousands of Java projects globally, including major frameworks like Spring and Hibernate.

## 2. Build Process
**Build System:** Apache Maven  
**How to Build:**
1.  **Clone the repository:**
    ```bash
    git clone https://github.com/apache/commons-lang.git
    cd commons-lang
    ```
2.  **Build and Run Tests:**
    The project uses a standard Maven workflow. To build the project and run all verifications:
    ```bash
    mvn clean install
    ```
    This command compiles the source code, runs the unit tests, generates documentation, and packages the JAR file.

## 3. Existing Test Cases
**Testing Framework:** JUnit 5 (Jupiter)  
**Existing Practices:**
- The project maintains a high standard of test coverage.
- Tests are located in `src/test/java`.
- Test classes generally mirror the structure of source classes (e.g., `StringUtilsTest.java` tests `StringUtils.java`).
- **Running Tests:**
    Tests can be executed via Maven:
    ```bash
    mvn test
    ```
    Or for a specific test class:
    ```bash
    mvn -Dtest=StringUtilsTest test
    ```

## 4. Partitioning
**Motivation:** 
Systematic functional testing, specifically Partition Testing, is essential because testing every possible input value is impossible (the input space is infinite). Partitioning allows us to divide the input domain into finite equivalence classes where we assume that all values in a partition trigger the same behavior. This maximizes fault detection probability while minimizing the number of test cases.

**Selected Feature:** `StringUtils.substring(String str, int start, int end)`
This method gets a substring from the specified String, avoiding exceptions (null-safe).

**Partitioning Scheme:**
We identify partitions based on the three input parameters: `str`, `start`, and `end`.

1.  **Input `str`:**
    *   **P1:** `null`
    *   **P2:** Empty String `""`
    *   **P3:** Non-empty String (e.g., `"abcde"`)

2.  **Input `start`:**
    *   **P4:** Negative (`< 0`) -> Interpreted as `length + start`
    *   **P5:** Zero (`0`)
    *   **P6:** Positive within bounds (`0 < start < length`)
    *   **P7:** Positive out of bounds (`>= length`)

3.  **Input `end`:**
    *   **P8:** Negative (`< 0`) -> Interpreted as `length + end`
    *   **P9:** Zero (`0`)
    *   **P10:** Positive less than start (`< start`) -> Returns empty
    *   **P11:** Positive greater than start (`> start`) and within bounds
    *   **P12:** Positive out of bounds (`> length`) -> Treated as `length`

**Representative Values:**
*   String: `"abcde"` (Length = 5)
*   Indices designed to hit partitions: `-1`, `0`, `2`, `5`, `10`.

**New Test Cases (JUnit):**
*(See accompanying code file `StringUtilsPartitionTest.java` for implementation)*

| Test Case ID | Input `str` | Input `start` | Input `end` | Partition Coverage | Expected Output | Description |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `TC01` | `null` | `0` | `5` | P1 | `null` | Null safe check |
| `TC02` | `""` | `0` | `5` | P2 | `""` | Empty string check |
| `TC03` | `"abcde"` | `0` | `5` | P3, P5, P12 | `"abcde"` | Full string (end > len) |
| `TC04` | `"abcde"` | `2` | `4` | P3, P6, P11 | `"cd"` | Standard substring |
| `TC05` | `"abcde"` | `-2` | `5` | P3, P4, P12 | `"de"` | Negative start |
| `TC06` | `"abcde"` | `2` | `-1` | P3, P6, P8 | `"cd"` | Negative end |
| `TC07` | `"abcde"` | `4` | `2` | P3, P6, P10 | `""` | End < Start |
| `TC08` | `"abcde"` | `5` | `10` | P3, P7, P12 | `""` | Start = Length |

