# SWE 261P Project Report Part 2: Finite State Machine Testing

**Project:**  Checkstyle

**GitHub Repository:** https://github.com/yunzhexu94-crypto/checkstyle

**Team Members:** [YUNZHE XU]


## 1. Finite Models in Testing
**Utility of Finite Models:**
Finite models, such as Finite State Machines (FSMs), are powerful tools for model-based testing. They allow testers to abstract a complex system into a set of finite states and transitions.
-   **Coverage:** They define clear coverage criteria (e.g., All-States, All-Transitions).
-   **Oracle:** The model serves as an oracle to predict expected behavior (valid vs. invalid transitions).
-   **Systematic:** They guide the generation of test cases to explore edge cases and sequences that might be missed by ad-hoc testing.
-   **State-Dependent Logic:** They are particularly useful for features where the output depends not just on the current input, but on the history of inputs (state).

## 2. Selected Feature: `DeclarationOrderCheck`
**Component:** `com.puppycrawl.tools.checkstyle.checks.coding.DeclarationOrderCheck`

**Description:**
This check enforces the standard Java coding convention for the order of class declarations. The expected order is:
1.  **Static Variables** (Public → Protected → Package → Private)
2.  **Instance Variables** (Public → Protected → Package → Private)
3.  **Constructors**
4.  **Methods**

This component is an ideal candidate for FSM modeling because it inherently validates a **sequence**. As the parser reads the file, the Check maintains a "current state" (e.g., "I am currently processing Instance Variables"). If it encounters a token that belongs to a "previous" state (e.g., finding a Static Variable after seeing a Constructor), it reports a violation.

## 3. Functional Model (Finite State Machine)

The logic can be modeled as a Finite State Machine where the states represent the *type of the last valid declaration seen*.

### **States:**
1.  **START**: Initial state (Class body entered).
2.  **STATIC_VARS**: Processing static variables.
3.  **INSTANCE_VARS**: Processing instance variables.
4.  **CTORS**: Processing constructors.
5.  **METHODS**: Processing methods.

### **Transitions:**
The FSM allows transitions to the *same* state (loop) or a *later* state. Transitions to an *earlier* state are **Illegal** (Violations).

**Valid Transitions (Simplified):**
*   `START` → `STATIC_VARS` | `INSTANCE_VARS` | `CTORS` | `METHODS`
*   `STATIC_VARS` → `STATIC_VARS` | `INSTANCE_VARS` | `CTORS` | `METHODS`
*   `INSTANCE_VARS` → `INSTANCE_VARS` | `CTORS` | `METHODS`
*   `CTORS` → `CTORS` | `METHODS`
*   `METHODS` → `METHODS`

**Invalid Transitions (Violations):**
*   `INSTANCE_VARS` → `STATIC_VARS` (Static var defined after instance var)
*   `CTORS` → `STATIC_VARS` | `INSTANCE_VARS` (Field defined after constructor)
*   `METHODS` → `STATIC_VARS` | `INSTANCE_VARS` | `CTORS` (Field or Ctor defined after method)

*(Note: There is a nested FSM for Access Modifiers within the variable states, but for this model, we focus on the high-level member ordering.)*

## 4. Test Cases

We verify this model using White-box Unit Testing with **Mockito**. By mocking the AST tokens, we can simulate the parser visiting tokens in specific sequences and verify that the `DeclarationOrderCheck` logs errors for invalid transitions.

| Test Case ID | Input Sequence | Transition | Result | Code | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `TC_FSM_01` | `OBJ` → `STATIC` → `INST` → `CTOR` → `METH` | 1→2→3→4→5 | **Pass** | [View](https://github.com/yunzhexu94-crypto/checkstyle/blob/7f95ebfd6685611cb80a9b7467a82b5a4e10f260/standalone-test/src/test/java/DeclarationOrderFSMTest.java#L117) | Standard valid sequence (All Transitions Forward) |
| `TC_FSM_02` | `OBJ` → `METH` → `STATIC` | 1→5→2 | **Fail** | [View](https://github.com/yunzhexu94-crypto/checkstyle/blob/7f95ebfd6685611cb80a9b7467a82b5a4e10f260/standalone-test/src/test/java/DeclarationOrderFSMTest.java#L142) | Invalid: Static Var after Method |
| `TC_FSM_03` | `OBJ` → `CTOR` → `INST` | 1→4→3 | **Fail** | [View](https://github.com/yunzhexu94-crypto/checkstyle/blob/7f95ebfd6685611cb80a9b7467a82b5a4e10f260/standalone-test/src/test/java/DeclarationOrderFSMTest.java#L158) | Invalid: Instance Var after Constructor |
| `TC_FSM_04` | `OBJ` → `INST` → `STATIC` | 1→3→2 | **Fail** | [View](https://github.com/yunzhexu94-crypto/checkstyle/blob/7f95ebfd6685611cb80a9b7467a82b5a4e10f260/standalone-test/src/test/java/DeclarationOrderFSMTest.java#L174C1-L187C6) | Invalid: Static Var after Instance Var |
| `TC_FSM_05` | `OBJ` → `STATIC` → `STATIC` | 2→2 | **Pass** | [View](https://github.com/yunzhexu94-crypto/checkstyle/blob/7f95ebfd6685611cb80a9b7467a82b5a4e10f260/standalone-test/src/test/java/DeclarationOrderFSMTest.java#L191-L204) | Loop transition (Multiple static vars) |

*(Note: Click "View" to see the specific test implementation on GitHub)*

### **Example Test Code**
Below is the implementation of `TC_FSM_02` (`testMethodThenStaticVar`), which verifies that a Static Variable cannot appear after a Method definition.

```java
// TC_FSM_02: Invalid (Method -> Static Var)
@Test
public void testMethodThenStaticVar() {
    // 1. Visit Method
    DetailAST method = mockMethodDef();
    spyCheck.visitToken(method);
    
    // 2. Visit Static Variable Modifiers
    DetailAST staticVar = mockVariableDef(true);
    DetailAST staticMods = staticVar.findFirstToken(TokenTypes.MODIFIERS);
    spyCheck.visitToken(staticMods);
    
    // Assert: Violation logged (MSG_STATIC)
    // The model expects a transition violation here.
    verify(spyCheck).log(eq(staticMods), eq(DeclarationOrderCheck.MSG_STATIC));
}
```

## 5. Test Execution Evidence

### **How to Run the Tests**
1.  Ensure you have **Maven** and **Java JDK 11+** installed.
2.  Navigate to the project root directory.
3.  Run the tests using the following command:
    ```bash
    mvn -f standalone-test/pom.xml test
    ```

### **Test Results**
[INSERT SCREENSHOT OF YOUR IDE OR TERMINAL OUTPUT SHOWING "BUILD SUCCESS" HERE]

*(Example Output)*
```text
[INFO] Running com.puppycrawl.tools.checkstyle.checks.coding.DeclarationOrderFSMTest
[INFO] Tests run: 5, Failures: 0, Errors: 0, Skipped: 0
[INFO] BUILD SUCCESS
```
