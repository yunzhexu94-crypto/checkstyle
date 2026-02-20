package com.puppycrawl.tools.checkstyle.meta;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertEquals;

/**
 * Demonstrates a bad testable design and its improved testable version.
 */
public class TestableDesignBadTest {

    /**
     * In XmlMetaWriter, the writeToFile method hardcodes the rootOutputPath 
     * using System.getProperty("user.dir") + "/src/main/resources".
     * 
     * BAD DESIGN (original conceptually):
     * void writeToFile(Document document, ModuleDetails moduleDetails) {
     *     String rootOutputPath = System.getProperty("user.dir") + "/src/main/resources";
     *     // writes to actual project directory instead of a test temporary directory!
     * }
     * 
     * This makes it impossible to test writing the file without risking modifying 
     * the actual source code directory, and it relies on global state (System properties)
     * which can cause flaky tests if run in parallel.
     */
     
    /**
     * Refactored dummy method: Accepts rootOutputPath as a parameter instead of 
     * hardcoding System.getProperty("user.dir").
     */
    public static String writeToFileTestable(ModuleDetails moduleDetails, String rootOutputPath) {
        String moduleName = moduleDetails.getName();
        if (moduleDetails.getModuleType() == ModuleType.CHECK) {
            moduleName += "Check";
        }
        
        // Use the injected rootOutputPath instead of global state
        return rootOutputPath + "/checkstylemeta-" + moduleName + ".xml";
    }

    @Test
    public void testWriteToFileTestable() {
        // Arrange
        ModuleDetails moduleDetails = new ModuleDetails();
        moduleDetails.setName("MyCustom");
        moduleDetails.setModuleType(ModuleType.CHECK);
        
        // We can now pass a dummy or temporary directory for testing!
        String testOutputDir = "/tmp/test-output";
        
        // Act
        String resultPath = writeToFileTestable(moduleDetails, testOutputDir);
        
        // Assert
        assertEquals("/tmp/test-output/checkstylemeta-MyCustomCheck.xml", resultPath, 
            "The method should use the injected output path rather than System.getProperty");
    }
}
