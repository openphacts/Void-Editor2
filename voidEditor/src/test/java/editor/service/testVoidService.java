package editor.service;

import static org.junit.Assert.assertTrue;

import java.io.IOException;

import org.junit.BeforeClass;
import org.junit.Test;
import org.openrdf.rio.RDFHandlerException;
import org.openrdf.rio.RDFParseException;

import uk.ac.manchester.cs.datadesc.validator.rdftools.VoidValidatorException;
import editor.domain.VoidAttributes;

/**
 * Tests for the VoID Service.
 * @author Lefteris Tatakis
 */
public class testVoidService {
	private static VoidAttributes testInput ;
	private static VoidService testObject ;
	// This class is not testing VoidUpload service - that is done in other tests
	
	@BeforeClass 
	public static void setup(){
		testInput = new VoidAttributes();
		//Just going to set most basic attributes
		testInput.givenName = "Lefteris";	
		testInput.userEmail= "lefteris@test.com";
		testInput.title= "A test case" ;
		testInput.description = "This is a junit test!"; 
  	    testInput.datePublish= "1";
		testInput.monthPublish= "12";
		testInput.yearPublish= "2013";
		testInput.version= "1.0.0";
		testInput.URI = "http://testURI.org";
		testObject = new VoidService();
		testObject.setVoidInfo(testInput);
	}

	@Test
	public void testGetVoidOutput1() throws RDFParseException, RDFHandlerException, VoidValidatorException, IOException {
		assertTrue("Making sure getVoid returns a string", testObject.getVoid() instanceof String );
	}
	
	@Test
	public void testGetVoidOutput2()  throws RDFParseException, RDFHandlerException, VoidValidatorException, IOException{
		assertTrue("Making sure getVoid contains my email", testObject.getVoid().contains(testInput.userEmail) );
	}
	
	@Test
	public void testGetVoidOutput3() throws RDFParseException, RDFHandlerException, VoidValidatorException, IOException {
		assertTrue("Making sure getVoid contains description", testObject.getVoid().contains(testInput.description) );
	}
	
	@Test
	public void testGetVoidOutput4()  throws RDFParseException, RDFHandlerException, VoidValidatorException, IOException{
		assertTrue("Making sure getVoid contains version", testObject.getVoid().contains(testInput.version));
	}
	
	@Test
	public void testGetVoidOutput5()  throws RDFParseException, RDFHandlerException, VoidValidatorException, IOException{
		assertTrue("Making sure getVoid contains date", testObject.getVoid().contains(testInput.yearPublish +"-"+testInput.monthPublish+"-0"+testInput.datePublish));
	}
	
	@Test
	public void testGetVoidOutput6()  throws RDFParseException, RDFHandlerException, VoidValidatorException, IOException{
		assertTrue("Making sure getVoid contains void prefix", testObject.getVoid().contains("<http://rdfs.org/ns/void#>"));
	}
	
	@Test
	public void testGetVoidOutput7() throws RDFParseException, RDFHandlerException, VoidValidatorException, IOException {
		assertTrue("Making sure getVoid contains test URI ", testObject.getVoid().contains(testInput.URI));
	}
	
	@Test
	public void testGetVoidOutput8() throws RDFParseException, RDFHandlerException, VoidValidatorException, IOException {
		assertTrue("Making sure getVoid contains pav prexif", testObject.getVoid().contains("http://purl.org/pav/"));
	}
	
	
	@Test
	public void testGetVoidOutput9()  throws RDFParseException, RDFHandlerException, VoidValidatorException, IOException{
		assertTrue("Making sure getVoid contains dcterms:issued", testObject.getVoid().contains("dcterms:issued"));
	}
	
	
	@Test
	public void testGetLocation() throws RDFParseException, RDFHandlerException, VoidValidatorException, IOException {
		assertTrue("Testing it returns a string > 4 for a location", testObject.getLocation().length() > 4);
	}
	
	
}
