package com.puppycrawl.tools.checkstyle.checks.coding;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.spy;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.doReturn;

import java.util.HashSet;
import java.util.Set;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import com.puppycrawl.tools.checkstyle.api.DetailAST;
import com.puppycrawl.tools.checkstyle.api.TokenTypes;
import com.puppycrawl.tools.checkstyle.api.FileContents;
import com.puppycrawl.tools.checkstyle.DefaultConfiguration;
import com.puppycrawl.tools.checkstyle.api.CheckstyleException;
import com.puppycrawl.tools.checkstyle.api.Scope;

public class DeclarationOrderCoverageTest {

    private DeclarationOrderCheck check;
    private DeclarationOrderCheck spyCheck;
    private DetailAST objBlock;
    private DetailAST classDef;

    @BeforeEach
    public void setUp() throws CheckstyleException {
        check = new DeclarationOrderCheck();
        spyCheck = spy(check);
        
        FileContents fileContents = mock(FileContents.class);
        when(fileContents.getLines()).thenReturn(new String[] {"class A {", "}"}); 
        spyCheck.setFileContents(fileContents);
        
        DefaultConfiguration config = new DefaultConfiguration("DeclarationOrderCheck");
        spyCheck.configure(config);
        
        classDef = mock(DetailAST.class);
        when(classDef.getType()).thenReturn(TokenTypes.CLASS_DEF);
        
        objBlock = mock(DetailAST.class);
        when(objBlock.getType()).thenReturn(TokenTypes.OBJBLOCK);
        when(objBlock.getParent()).thenReturn(classDef);
        
        spyCheck.beginTree(objBlock);
        spyCheck.visitToken(objBlock);
    }
    
    private DetailAST mockAST(int type) {
        DetailAST ast = mock(DetailAST.class);
        when(ast.getType()).thenReturn(type);
        when(ast.getParent()).thenReturn(objBlock);
        when(ast.getLineNo()).thenReturn(1);
        when(ast.getColumnNo()).thenReturn(1);
        return ast;
    }

    private DetailAST mockModifiers(String scopeName) {
        DetailAST modifiers = mock(DetailAST.class);
        when(modifiers.getType()).thenReturn(TokenTypes.MODIFIERS);
        when(modifiers.getLineNo()).thenReturn(1);
        when(modifiers.getColumnNo()).thenReturn(1);
        
        int tokenType = -1;
        if ("public".equals(scopeName)) tokenType = TokenTypes.LITERAL_PUBLIC;
        else if ("protected".equals(scopeName)) tokenType = TokenTypes.LITERAL_PROTECTED;
        else if ("private".equals(scopeName)) tokenType = TokenTypes.LITERAL_PRIVATE;
        
        if (tokenType != -1) {
            DetailAST modToken = mock(DetailAST.class);
            when(modToken.getType()).thenReturn(tokenType);
            when(modifiers.findFirstToken(tokenType)).thenReturn(modToken);
            
            // ScopeUtil likely iterates over children
            when(modifiers.getFirstChild()).thenReturn(modToken);
            when(modToken.getNextSibling()).thenReturn(null);
        } else {
            when(modifiers.getFirstChild()).thenReturn(null);
        }
        
        return modifiers;
    }

    private DetailAST mockVariableDef(String name, String scope, boolean isStatic) {
        DetailAST varDef = mockAST(TokenTypes.VARIABLE_DEF);
        DetailAST modifiers = mockModifiers(scope);
        when(modifiers.getParent()).thenReturn(varDef);
        when(varDef.findFirstToken(TokenTypes.MODIFIERS)).thenReturn(modifiers);
        when(varDef.getParent()).thenReturn(objBlock);
        
        DetailAST ident = mock(DetailAST.class);
        when(ident.getType()).thenReturn(TokenTypes.IDENT);
        when(ident.getText()).thenReturn(name);
        when(varDef.findFirstToken(TokenTypes.IDENT)).thenReturn(ident);
        
        if (isStatic) {
            DetailAST staticToken = mock(DetailAST.class);
            when(staticToken.getType()).thenReturn(TokenTypes.LITERAL_STATIC);
            when(modifiers.findFirstToken(TokenTypes.LITERAL_STATIC)).thenReturn(staticToken);
        }
        
        return varDef;
    }

    // TC_COV_01: Ignore Constructors
    @Test
    public void testIgnoreConstructors() {
        spyCheck.setIgnoreConstructors(true);
        
        // Advance state to METHOD (4)
        DetailAST method = mockAST(TokenTypes.METHOD_DEF);
        spyCheck.visitToken(method);
        
        // Go back to CTOR (3) -> normally invalid
        DetailAST ctor = mockAST(TokenTypes.CTOR_DEF);
        spyCheck.visitToken(ctor);
        
        verify(spyCheck, never()).log(any(DetailAST.class), eq(DeclarationOrderCheck.MSG_CONSTRUCTOR));
    }

    // TC_COV_02: Ignore Modifiers (Access Order)
    @Test
    public void testIgnoreModifiers() {
        spyCheck.setIgnoreModifiers(true);
        
        // 1. Private Static Var
        DetailAST var1 = mockVariableDef("v1", "private", true);
        spyCheck.visitToken(var1.findFirstToken(TokenTypes.MODIFIERS));
        
        // 2. Public Static Var (Private -> Public is invalid order)
        DetailAST var2 = mockVariableDef("v2", "public", true);
        spyCheck.visitToken(var2.findFirstToken(TokenTypes.MODIFIERS));
        
        verify(spyCheck, never()).log(any(DetailAST.class), eq(DeclarationOrderCheck.MSG_ACCESS));
    }

    // TC_COV_03: Valid Access Order (Public -> Private)
    @Test
    public void testValidAccessOrder() {
        // 1. Public
        DetailAST var1 = mockVariableDef("v1", "public", true);
        
        // Need to ensure ScopeUtil.getScopeFromMods returns PUBLIC
        // Since ScopeUtil is real, and it inspects the AST, we rely on our mock AST structure being correct for ScopeUtil.
        // ScopeUtil.getScopeFromMods checks for LITERAL_PUBLIC etc.
        // Our mockModifiers adds the token if requested.
        
        spyCheck.visitToken(var1.findFirstToken(TokenTypes.MODIFIERS));
        
        // 2. Private
        DetailAST var2 = mockVariableDef("v2", "private", true);
        spyCheck.visitToken(var2.findFirstToken(TokenTypes.MODIFIERS));
        
        verify(spyCheck, never()).log(any(DetailAST.class), anyString());
    }

    // TC_COV_04: Invalid Access Order (Private -> Public)
    @Test
    public void testInvalidAccessOrder() {
        // 1. Private
        DetailAST var1 = mockVariableDef("v1", "private", true);
        spyCheck.visitToken(var1.findFirstToken(TokenTypes.MODIFIERS));
        
        // 2. Public
        DetailAST var2 = mockVariableDef("v2", "public", true);
        DetailAST mods2 = var2.findFirstToken(TokenTypes.MODIFIERS);
        spyCheck.visitToken(mods2);
        
        verify(spyCheck).log(eq(mods2), eq(DeclarationOrderCheck.MSG_ACCESS));
    }
    
    // TC_COV_05: Forward Reference (should be ignored)
    @Test
    public void testForwardReference() {
        // 1. Define field "x"
        DetailAST varX = mockVariableDef("x", "private", false);
        spyCheck.visitToken(varX); // Registers "x" in classFieldNames
        
        // 1. Private field "x"
        DetailAST modsX = varX.findFirstToken(TokenTypes.MODIFIERS);
        spyCheck.visitToken(modsX); 
        
        // 2. Public field "y" that uses "x" (Private -> Public is invalid order)
        DetailAST varY = mockVariableDef("y", "public", false);
        DetailAST modsY = varY.findFirstToken(TokenTypes.MODIFIERS);
        
        // Construct AST structure so that "y" references "x"
        // isForwardReference starts traversing from the IDENT of the variable definition ("y")
        // We need to ensure "x" is reachable from "y" via siblings/children.
        DetailAST identY = varY.findFirstToken(TokenTypes.IDENT);
        
        DetailAST identX = mock(DetailAST.class);
        when(identX.getType()).thenReturn(TokenTypes.IDENT);
        when(identX.getText()).thenReturn("x");
        
        // Simplify: make "x" a sibling of "y" (e.g. simulating y = x)
        when(identY.getNextSibling()).thenReturn(identX);
        when(identX.getNextSibling()).thenReturn(null);
        when(identX.getFirstChild()).thenReturn(null);
        
        // Trigger the check
        spyCheck.visitToken(modsY);
        
        verify(spyCheck, never()).log(any(DetailAST.class), eq(DeclarationOrderCheck.MSG_ACCESS));
    }
}
