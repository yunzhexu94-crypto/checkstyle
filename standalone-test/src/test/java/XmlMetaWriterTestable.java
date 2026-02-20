package com.puppycrawl.tools.checkstyle.meta;

import org.w3c.dom.Document;
import java.io.File;

/**
 * A dummy refactored version of XmlMetaWriter to demonstrate Testable Design.
 * The original writeToFile method tightly coupled with System.getProperty("user.dir")
 * making it hard to test. This testable version accepts the output directory as a parameter.
 */
public class XmlMetaWriterTestable {

    /**
     * Refactored method: Accepts rootOutputPath as a parameter instead of 
     * hardcoding System.getProperty("user.dir").
     * For simplicity, this dummy method just returns the path that WOULD be written to.
     */
    public static String writeToFileTestable(ModuleDetails moduleDetails, String rootOutputPath) {
        String moduleName = moduleDetails.getName();
        if (moduleDetails.getModuleType() == ModuleType.CHECK) {
            moduleName += "Check";
        }
        
        // Use the injected rootOutputPath instead of global state
        return rootOutputPath + "/checkstylemeta-" + moduleName + ".xml";
    }
}
