package com.puppycrawl.tools.checkstyle.checks.coding;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.spy;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import com.puppycrawl.tools.checkstyle.api.DetailAST;
import com.puppycrawl.tools.checkstyle.api.TokenTypes;
import com.puppycrawl.tools.checkstyle.api.FileContents;
import com.puppycrawl.tools.checkstyle.api.FileText;
import com.puppycrawl.tools.checkstyle.DefaultConfiguration;
import com.puppycrawl.tools.checkstyle.api.CheckstyleException;

public class DeclarationOrderFSMTest {

    private DeclarationOrderCheck check;
    private DeclarationOrderCheck spyCheck;
    private DetailAST objBlock;
    private DetailAST classDef;

    @BeforeEach
    public void setUp() throws CheckstyleException {
        check = new DeclarationOrderCheck();
        spyCheck = spy(check);
        
        // Mock FileContents to avoid NPE in log()
        FileContents fileContents = mock(FileContents.class);
        when(fileContents.getLines()).thenReturn(new String[] {"class A {", "}"}); 
        spyCheck.setFileContents(fileContents);
        
        // Mock Configuration to avoid NPE in log()
        DefaultConfiguration config = new DefaultConfiguration("DeclarationOrderCheck");
        spyCheck.configure(config);
        
        // Setup root (Class Def)
        classDef = mock(DetailAST.class);
        when(classDef.getType()).thenReturn(TokenTypes.CLASS_DEF);
        
        // Setup OBJBLOCK
        objBlock = mock(DetailAST.class);
        when(objBlock.getType()).thenReturn(TokenTypes.OBJBLOCK);
        when(objBlock.getParent()).thenReturn(classDef);
        
        // Initialize check state
        spyCheck.beginTree(objBlock);
        spyCheck.visitToken(objBlock);
    }
    
    /**
     * Helper to create a mocked DetailAST with a specific type.
     */
    private DetailAST mockAST(int type) {
        DetailAST ast = mock(DetailAST.class);
        when(ast.getType()).thenReturn(type);
        when(ast.getParent()).thenReturn(objBlock); // Default parent is the class block
        when(ast.getLineNo()).thenReturn(1);
        when(ast.getColumnNo()).thenReturn(1);
        return ast;
    }

    /**
     * Helper to create a mocked Modifier AST (needed because check inspects modifiers).
     */
    private DetailAST mockModifiers(boolean isStatic) {
        DetailAST modifiers = mock(DetailAST.class);
        when(modifiers.getType()).thenReturn(TokenTypes.MODIFIERS);
        when(modifiers.getLineNo()).thenReturn(1);
        when(modifiers.getColumnNo()).thenReturn(1);
        
        if (isStatic) {
            DetailAST staticToken = mock(DetailAST.class);
            when(staticToken.getType()).thenReturn(TokenTypes.LITERAL_STATIC);
            when(modifiers.findFirstToken(TokenTypes.LITERAL_STATIC)).thenReturn(staticToken);
        } else {
            when(modifiers.findFirstToken(TokenTypes.LITERAL_STATIC)).thenReturn(null);
        }
        return modifiers;
    }

    private DetailAST mockVariableDef(boolean isStatic) {
        DetailAST varDef = mockAST(TokenTypes.VARIABLE_DEF);
        DetailAST modifiers = mockModifiers(isStatic);
        when(modifiers.getParent()).thenReturn(varDef);
        when(varDef.findFirstToken(TokenTypes.MODIFIERS)).thenReturn(modifiers);
        
        // Needed for ScopeUtil.isClassFieldDef logic
        when(varDef.getParent()).thenReturn(objBlock);
        
        // Needed for classFieldNames logic
        DetailAST ident = mock(DetailAST.class);
        when(ident.getType()).thenReturn(TokenTypes.IDENT);
        when(ident.getText()).thenReturn("variableName");
        when(varDef.findFirstToken(TokenTypes.IDENT)).thenReturn(ident);
        
        return varDef;
    }

    private DetailAST mockMethodDef() {
        return mockAST(TokenTypes.METHOD_DEF);
    }

    private DetailAST mockCtorDef() {
        return mockAST(TokenTypes.CTOR_DEF);
    }
    
    // TC_FSM_01: Valid Sequence (Static -> Instance -> Ctor -> Method)
    @Test
    public void testValidFullSequence() {
        // 1. Static Variable
        DetailAST staticVar = mockVariableDef(true);
        DetailAST staticMods = staticVar.findFirstToken(TokenTypes.MODIFIERS);
        spyCheck.visitToken(staticMods);
        
        // 2. Instance Variable
        DetailAST instanceVar = mockVariableDef(false);
        DetailAST instanceMods = instanceVar.findFirstToken(TokenTypes.MODIFIERS);
        spyCheck.visitToken(instanceMods);
        
        // 3. Constructor
        DetailAST ctor = mockCtorDef();
        spyCheck.visitToken(ctor);
        
        // 4. Method
        DetailAST method = mockMethodDef();
        spyCheck.visitToken(method);
        
        // Assert: No violations logged
        verify(spyCheck, never()).log(any(DetailAST.class), anyString());
        verify(spyCheck, never()).log(any(DetailAST.class), anyString(), any());
    }

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
        verify(spyCheck).log(eq(staticMods), eq(DeclarationOrderCheck.MSG_STATIC));
    }

    // TC_FSM_03: Invalid (Constructor -> Instance Var)
    @Test
    public void testCtorThenInstanceVar() {
        // 1. Visit Constructor
        DetailAST ctor = mockCtorDef();
        spyCheck.visitToken(ctor);
        
        // 2. Visit Instance Variable Modifiers
        DetailAST instanceVar = mockVariableDef(false);
        DetailAST instanceMods = instanceVar.findFirstToken(TokenTypes.MODIFIERS);
        spyCheck.visitToken(instanceMods);
        
        // Assert: Violation logged (MSG_INSTANCE)
        verify(spyCheck).log(eq(instanceMods), eq(DeclarationOrderCheck.MSG_INSTANCE));
    }

    // TC_FSM_04: Invalid (Instance Var -> Static Var)
    @Test
    public void testInstanceThenStaticVar() {
        // 1. Visit Instance Variable Modifiers
        DetailAST instanceVar = mockVariableDef(false);
        DetailAST instanceMods = instanceVar.findFirstToken(TokenTypes.MODIFIERS);
        spyCheck.visitToken(instanceMods);
        
        // 2. Visit Static Variable Modifiers
        DetailAST staticVar = mockVariableDef(true);
        DetailAST staticMods = staticVar.findFirstToken(TokenTypes.MODIFIERS);
        spyCheck.visitToken(staticMods);
        
        // Assert: Violation logged (MSG_STATIC)
        verify(spyCheck).log(eq(staticMods), eq(DeclarationOrderCheck.MSG_STATIC));
    }
    
    // TC_FSM_05: Valid Loop (Static -> Static)
    @Test
    public void testStaticThenStatic() {
        // 1. Static Variable
        DetailAST staticVar1 = mockVariableDef(true);
        DetailAST staticMods1 = staticVar1.findFirstToken(TokenTypes.MODIFIERS);
        spyCheck.visitToken(staticMods1);
        
        // 2. Another Static Variable
        DetailAST staticVar2 = mockVariableDef(true);
        DetailAST staticMods2 = staticVar2.findFirstToken(TokenTypes.MODIFIERS);
        spyCheck.visitToken(staticMods2);
        
        // Assert: No violations
        verify(spyCheck, never()).log(any(DetailAST.class), anyString());
    }
}
