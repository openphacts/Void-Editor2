package editor.domain;

import com.hp.hpl.jena.query.Query;
import com.hp.hpl.jena.query.QueryExecution;
import com.hp.hpl.jena.query.QueryExecutionFactory;
import com.hp.hpl.jena.query.QueryFactory;
import com.hp.hpl.jena.query.QuerySolution;
import com.hp.hpl.jena.query.ResultSet;

/**
 * Tests sparql endpoint querying.
 * @author Lefteris Tatakis
 */
public class SparqlEndpointQueryTest {
	public static void main(String[] args) {
		 String sparqlQueryString =  "SELECT DISTINCT (COUNT(DISTINCT ?o) as ?count) WHERE {?s ?p ?o}";
		 Query query = QueryFactory.create(sparqlQueryString);
	     QueryExecution qexec = QueryExecutionFactory.sparqlService("http://dbpedia.org/sparql", query);
	
	     ResultSet results = qexec.execSelect();
	     //ResultSetFormatter.out(System.out, results, query);       
	     if (results.hasNext()) {
	    	    QuerySolution row= results.next();
	    	    System.out.println("=> " +  row.getLiteral("count") );
	     }
	     qexec.close() ;
	}
}
