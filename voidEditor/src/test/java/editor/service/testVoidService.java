package editor.service;

import static org.junit.Assert.assertTrue;

import java.util.ArrayList;

import org.junit.BeforeClass;
import org.junit.Test;

import editor.domain.voidAttributes;

public class testVoidService {
	private static voidAttributes testInput ;
	private static voidService testObject ;

	//TODO Test sources input
	
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
		testInput.URI = "http://testURI.org";
		//TODO
	//	testInput.sources = (new ArrayList<Object>()).add("{'title': 'Test', 'type': 'RDF', 'URI': 'http://testSourceURI', 'noURI': false }");
		testObject = new voidService();
		testObject.setVoidInfo(testInput);
	}

	@Test
	public void testGetVoidOutput1() {
		
		assertTrue("Making sure getVoid returns a string", testObject.getVoid() instanceof String );
	}
	
	@Test
	public void testGetVoidOutput2() {
		assertTrue("Making sure getVoid contains my email", testObject.getVoid().contains(testInput.userEmail) );
	}
	
	@Test
	public void testGetVoidOutput3() {
		assertTrue("Making sure getVoid contains description", testObject.getVoid().contains(testInput.description) );
	}
	
	@Test
	public void testGetVoidOutput4() {
		assertTrue("Making sure getVoid contains version", testObject.getVoid().contains(testInput.version));
	}
	
	@Test
	public void testGetVoidOutput5() {
		assertTrue("Making sure getVoid contains date", testObject.getVoid().contains(testInput.yearPublish +"-"+testInput.monthPublish+"-0"+testInput.datePublish));
	}
	
	@Test
	public void testGetVoidOutput6() {
		assertTrue("Making sure getVoid contains void prefix", testObject.getVoid().contains("<http://rdfs.org/ns/void#>"));
	}
	
	@Test
	public void testGetVoidOutput7() {
		assertTrue("Making sure getVoid contains test URI ", testObject.getVoid().contains(testInput.URI));
	}
	
	@Test
	public void testGetVoidOutput8() {
		assertTrue("Making sure getVoid contains pav prexif", testObject.getVoid().contains("http://purl.org/pav/"));
	}
	
	
	@Test
	public void testGetVoidOutput9() {
		assertTrue("Making sure getVoid contains dcterms:issued", testObject.getVoid().contains("dcterms:issued"));
	}
	
//	@Test
//	public void testGetVoidOutput10() {
//		assertTrue("Making sure getVoid contains test source provided", testObject.getVoid().contains("http://testSourceURI"));
//	}
	
	
	
	@Test
	public void testGetLocation() {
		assertTrue("Testing it returns a string > 4 for a location", testObject.getLocation().length() > 4);
	}
	
	
}
