package editor.domain;

import static org.junit.Assert.*;

import java.io.FileInputStream;
import java.io.IOException;

import org.json.simple.JSONObject;
import org.junit.BeforeClass;
import org.junit.Test;
/**
 * @author Lefteris
 *
 */
public class DatasetStatsSparqlJunitTests {
	private static DatasetStatistics obj;
	
	@BeforeClass
	public static void setup() {
		obj = new DatasetStatistics( );
	}
	// The numbers of th esets can change so I am not including any hard coded numbers
	
	@Test
	public void testQuerySparqlEndpointTotalTriples() {
		JSONObject tmp = obj.querySparqlEndpointTotalTriples("http://bioportal.bio2rdf.org/sparql");
		assertTrue("Checking if output of stats is int for total triples", Integer.parseInt(tmp.get("totalNumberOfTriples").toString()) > 0 );
	}
	@Test
	public void testQuerySparqlEndpointUniqueSubject() {
		JSONObject tmp = obj.querySparqlEndpointUniqueSubject("http://bioportal.bio2rdf.org/sparql");
		assertTrue("Checking if output of stats is int for uniq subj", Integer.parseInt(tmp.get("numberOfUniqueSubjects").toString()) > 0 );
	}
	
	@Test
	public void testQuerySparqlEndpointUniqueObjects() {
		JSONObject tmp = obj.querySparqlEndpointUniqueObjects("http://bioportal.bio2rdf.org/sparql");
		assertTrue("Checking if output of stats is int for uniq obj",Integer.parseInt( tmp.get("numberOfUniqueObjects").toString())>0 );
	}

}
