import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertEquals;
import java.util.ArrayList;
import java.util.List;

/**
 * SWE 261P - Partition Testing Assignment
 * Feature: MethodLimitCheck (Simulated for demonstration)
 * 
 * Note: In the real Checkstyle project, this would extend AbstractModuleTestSupport.
 * Here we simulate the logic to demonstrate the partition testing concept.
 */
public class MethodLimitPartitionTest {

    // Simulating the check logic for the purpose of this assignment
    public List<String> checkMethodLimit(int methodCount, int max) {
        List<String> violations = new ArrayList<>();
        if (methodCount > max) {
            violations.add("Class has " + methodCount + " methods (max allowed is " + max + ").");
        }
        return violations;
    }

    private static final int MAX_METHODS = 30;

    // Partition 1: Valid Input (Count < Max)
    @Test
    public void testMethodCountBelowLimit() {
        int methodCount = 29; // Representative value
        List<String> violations = checkMethodLimit(methodCount, MAX_METHODS);
        assertEquals(0, violations.size(), "Partition P1: 29 methods should have 0 violations");
    }

    // Partition 2: Boundary Value (Count == Max)
    @Test
    public void testMethodCountAtLimit() {
        int methodCount = 30; // Representative value
        List<String> violations = checkMethodLimit(methodCount, MAX_METHODS);
        assertEquals(0, violations.size(), "Partition P2: 30 methods should have 0 violations");
    }

    // Partition 3: Invalid Input (Count > Max)
    @Test
    public void testMethodCountExceedsLimit() {
        int methodCount = 31; // Representative value
        List<String> violations = checkMethodLimit(methodCount, MAX_METHODS);
        assertEquals(1, violations.size(), "Partition P3: 31 methods should have 1 violation");
        assertEquals("Class has 31 methods (max allowed is 30).", violations.get(0));
    }

    // Partition 4: Edge Case (Empty Class)
    @Test
    public void testEmptyClass() {
        int methodCount = 0; // Representative value
        List<String> violations = checkMethodLimit(methodCount, MAX_METHODS);
        assertEquals(0, violations.size(), "Partition P4: 0 methods should have 0 violations");
    }
}
