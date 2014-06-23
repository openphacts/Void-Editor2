package editor.domain;

import static org.junit.Assert.assertTrue;

import org.junit.BeforeClass;
import org.junit.Test;

/**
 *  Testing the instantiation on correct input values through the process of the class.
 *  @author Lefteris Tatakis
 */
public class VoidTurtleTest {
	private static VoidAttributes testInput ;
	private static VoidTurtle testObject;
	
	@BeforeClass 
	public static void setup(){
		testInput = new VoidAttributes();
		//Just going to set most basic attributes
		testInput.familyName = "Lefteris";	
		testInput.userEmail= "lefteris@test.com";
		testInput.title= "A test case" ;
		testInput.description = "This is a junit test!"; 
  	    testInput.datePublish= "1";
		testInput.monthPublish= "12";
		testInput.yearPublish= "2013";
		testInput.version= "1.0.0";
		testObject = new VoidTurtle(testInput);
	}
	
	@Test
	public void testDateIsCorrect() {
		assertTrue("Testing is date set correctly", testObject.getDatePublish() == 1);
	}
	
	@Test
	public void testDateIsCorrectWithNA() {
		VoidAttributes testInput2 = new VoidAttributes();
		
		//Just going to set most basic attributes
		testInput2.familyName = "Lefteris";	
		testInput2.datePublish= "N/A";
  	  	testInput2.monthPublish= "12";
 		testInput2.yearPublish= "2013";
 		VoidTurtle testObject2 = new VoidTurtle(testInput2);
		assertTrue("Testing is date set correctly for N/A", testObject2.getDatePublish() == 1);
	}
	
	@Test
	public void testMonthIsCorrect() {
		assertTrue("Testing is month set correctly", testObject.getMonthPublish() == 12);
	}

	@Test
	public void testYearIsCorrect() {
		assertTrue("Testing is date set correctly", testObject.getYearPublish() == 2013);
	}
}
