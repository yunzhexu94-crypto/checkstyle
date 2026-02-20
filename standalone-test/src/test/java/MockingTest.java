package com.puppycrawl.tools.checkstyle;

import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.times;
import com.puppycrawl.tools.checkstyle.api.AuditListener;
import com.puppycrawl.tools.checkstyle.api.AuditEvent;

public class MockingTest {

    @Test
    public void testAuditListenerMocking() throws Exception {
        // Create a mock of AuditListener interface
        AuditListener mockListener = Mockito.mock(AuditListener.class);
        
        // Create a checker and attach the listener
        Checker checker = new Checker();
        checker.addListener(mockListener);
        
        // Fire audit by processing an empty list of files
        checker.process(java.util.Collections.emptyList());
        
        // Verify that the auditStarted and auditFinished methods were called exactly once
        verify(mockListener, times(1)).auditStarted(Mockito.any(AuditEvent.class));
        verify(mockListener, times(1)).auditFinished(Mockito.any(AuditEvent.class));
    }
}
