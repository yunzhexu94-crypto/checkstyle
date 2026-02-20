package com.puppycrawl.tools.checkstyle.utils;

import org.junit.jupiter.api.Test;
import java.io.File;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class StubbingTest {

    @Test
    public void testMatchesFileExtensionWithStub() {
        // Creating a stub for File by using an anonymous subclass.
        // This overrides getName() to return a specific value without needing an actual file on disk.
        File fileStub = new File("dummy.txt") {
            @Override
            public String getName() {
                return "test.java";
            }
        };
        
        // Use the stubbed object to test the method
        boolean result = CommonUtil.matchesFileExtension(fileStub, ".java");
        assertTrue(result, "The method should return true for the stubbed file name 'test.java'");
    }
}
