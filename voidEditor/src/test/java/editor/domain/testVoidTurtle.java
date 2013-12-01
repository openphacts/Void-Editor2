package editor.domain;

import static org.junit.Assert.assertTrue;

import org.junit.BeforeClass;
import org.junit.Test;

/*
 *  Output void of this class is tested in the voidService Test Class
 *  Here testing the instantiation on correct input values through the process of the class.
 */
public class testVoidTurtle {
	private static voidAttributes testInput ;
	private static voidTurtle testObject;
	
	@BeforeClass 
	public static void setup(){
		testInput = new voidAttributes();
		//Just going to set most basic attributes
		testInput.userName = "Lefteris";	
		testInput.userEmail= "lefteris@test.com";
		testInput.title= "A test case" ;
		testInput.description = "This is a junit test!"; 
  	    testInput.datePublish= "1";
		testInput.monthPublish= "12";
		testInput.yearPublish= "2013";
		testInput.version= "1.0.0";
		testObject = new voidTurtle(testInput);
	}
	
	@Test
	public void testDateIsCorrect() {
		assertTrue("Testing is date set correctly", testObject.getDatePublish() == 1);
	}
	
	@Test
	public void testDateIsCorrectWithNA() {
		voidAttributes testInput2 = new voidAttributes();
		
		//Just going to set most basic attributes
		testInput2.userName = "Lefteris";	
		testInput2.datePublish= "N/A";
  	  	testInput2.monthPublish= "12";
 		testInput2.yearPublish= "2013";
 		voidTurtle testObject2 = new voidTurtle(testInput2);
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
