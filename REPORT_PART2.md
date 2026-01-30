# SWE 261P Project Report Part 2: Finite State Machine Testing

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

We will verify this model using White-box Unit Testing with **Mockito**. By mocking the AST tokens, we can simulate the parser visiting tokens in specific sequences and verify that the `DeclarationOrderCheck` logs errors for invalid transitions.

| Test Case ID | Sequence of Inputs (Tokens) | Transition | Expected Result | Description |
| :--- | :--- | :--- | :--- | :--- |
| `TC_FSM_01` | `OBJBLOCK` → `STATIC_VAR` → `INSTANCE_VAR` → `CTOR` → `METHOD` | 1→2→3→4→5 | **Pass** | Standard valid sequence (All Transitions Forward) |
| `TC_FSM_02` | `OBJBLOCK` → `METHOD` → `STATIC_VAR` | 1→5→2 | **Fail** (Violation) | Invalid: Static Var after Method |
| `TC_FSM_03` | `OBJBLOCK` → `CTOR` → `INSTANCE_VAR` | 1→4→3 | **Fail** (Violation) | Invalid: Instance Var after Constructor |
| `TC_FSM_04` | `OBJBLOCK` → `INSTANCE_VAR` → `STATIC_VAR` | 1→3→2 | **Fail** (Violation) | Invalid: Static Var after Instance Var |
| `TC_FSM_05` | `OBJBLOCK` → `STATIC_VAR` → `STATIC_VAR` | 2→2 | **Pass** | Loop transition (Multiple static vars) |

### **Test Implementation Details:**
The accompanying file `DeclarationOrderFSMTest.java` implements these tests.
-   It uses `Mockito` to create `DetailAST` nodes.
-   It manually calls `check.visitToken(ast)` to simulate the traversal.
-   It asserts that `log()` is called (or not called) based on the expected behavior.
