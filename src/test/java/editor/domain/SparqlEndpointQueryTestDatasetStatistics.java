package editor.domain;

import org.json.simple.JSONObject;

/**
 * Testing multiple sparql endpoints.
 * @author Lefteris Tatakis
 */
public class SparqlEndpointQueryTestDatasetStatistics {
	public static void main(String[] args) {

		DatasetStatistics obj = new DatasetStatistics( );
		JSONObject tmp = obj.querySparqlEndpointTotalTriples("http://bioportal.bio2rdf.org/sparql");
		System.out.println(tmp.toJSONString());
		tmp = obj.querySparqlEndpointUniqueObjects("http://bioportal.bio2rdf.org/sparql");
		System.out.println(tmp.toJSONString());
		tmp = obj.querySparqlEndpointUniqueSubject("http://bioportal.bio2rdf.org/sparql");
		System.out.println(tmp.toJSONString());
	}
}
