package editor.validator;

import static org.junit.Assert.*;

import java.io.File;

import org.junit.BeforeClass;
import org.junit.Test;

import uk.ac.manchester.cs.datadesc.validator.rdftools.VoidValidatorException;
import editor.domain.VoidAttributes;
import editor.service.VoidService;

public class TestMyValidator {
	private static File file;
	private static Validator validator;

	@BeforeClass 
	public static void setup() {
		  file = new File ("C:\\Users\\Lefteris\\Desktop\\Void-Editor2\\voidEditor\\src\\test\\res\\editor\\domain\\testVoid.ttl");
		  try {
			validator = new Validator(file);
		} catch (VoidValidatorException e) {
			fail("Got VoidValidatorException");
		}
	}
	
	@Test
	public void testGetVoidOutput1() {
		assertTrue("Check if it accepts the void", validator.passedTests() );
	}
}
