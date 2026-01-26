import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import org.apache.commons.lang3.StringUtils;
import org.junit.jupiter.api.Test;

/**
 * SWE 261P - Partition Testing Assignment
 * Feature: StringUtils.substring(String str, int start, int end)
 */
public class StringUtilsPartitionTest {

    // Partition 1: Null Input
    @Test
    public void testSubstring_NullString() {
        assertNull(StringUtils.substring(null, 0, 5), "Partition P1: Null input should return null");
    }

    // Partition 2: Empty Input
    @Test
    public void testSubstring_EmptyString() {
        assertEquals("", StringUtils.substring("", 0, 5), "Partition P2: Empty string should return empty");
    }

    // Partition 3, 5, 12: Full String (Start 0, End > Length)
    @Test
    public void testSubstring_FullString_EndOutOfBounds() {
        assertEquals("abcde", StringUtils.substring("abcde", 0, 10), "Partition P3, P5, P12: Start 0, End > Len returns full string");
    }

    // Partition 3, 6, 11: Standard Substring (Start > 0, End > Start & End < Length)
    @Test
    public void testSubstring_StandardMiddle() {
        assertEquals("cd", StringUtils.substring("abcde", 2, 4), "Partition P3, P6, P11: Standard substring 'cd'");
    }

    // Partition 4: Negative Start (interpreted as len + start)
    @Test
    public void testSubstring_NegativeStart() {
        // "abcde", start -2 means index 3 ('d')
        assertEquals("de", StringUtils.substring("abcde", -2, 5), "Partition P4: Negative start -2 means start at index 3");
    }

    // Partition 8: Negative End (interpreted as len + end)
    @Test
    public void testSubstring_NegativeEnd() {
        // "abcde", end -1 means index 4 ('e'), exclusive so up to 'd'
        assertEquals("cd", StringUtils.substring("abcde", 2, -1), "Partition P8: Negative end -1 means end at index 4");
    }

    // Partition 10: End < Start
    @Test
    public void testSubstring_EndBeforeStart() {
        assertEquals("", StringUtils.substring("abcde", 4, 2), "Partition P10: End < Start should return empty string");
    }

    // Partition 7: Start >= Length
    @Test
    public void testSubstring_StartOutOfBounds() {
        assertEquals("", StringUtils.substring("abcde", 5, 10), "Partition P7: Start >= Length should return empty string");
    }
}
