package editor.domain;

import org.json.simple.JSONObject;


public class SparqlEndpointQueryTestDatasetStatistics {
	public static void main(String[] args) {

		DatasetStatistics obj = new DatasetStatistics( );
		JSONObject tmp = obj.querySparqlEndpoint("http://bioportal.bio2rdf.org/sparql");
		System.out.println(tmp.toJSONString());
	}
}
