package editor.domain;

import org.json.simple.JSONObject;

import com.hp.hpl.jena.query.Query;
import com.hp.hpl.jena.query.QueryExecution;
import com.hp.hpl.jena.query.QueryExecutionFactory;
import com.hp.hpl.jena.query.QueryFactory;
import com.hp.hpl.jena.query.QuerySolution;
import com.hp.hpl.jena.query.ResultSet;
import com.hp.hpl.jena.rdf.model.Model;

/**
 * A class which will be responsible for handling all statistical queries for 
 * sparql endpoints and data which is upload to the VE through the interface.
 * @author Lefteris Tatakis
 *
 */

public class DatasetStatistics {
	//get total number of triples
	//select count(*) where {?x ?y ?z}  
	private String totalNumberOfTriples = "SELECT DISTINCT (COUNT(*) as ?count) WHERE {?s ?p ?o} ";
	private Query totalNumberOfTriplesQuery = null;
	private int resultTotalNumberOfTriples = 0;
	//get number of unique subjects
	//select count(distinct ?x) where{?x ?y ?z}
    private String numberOfUniqueSubjects = "SELECT DISTINCT (COUNT(DISTINCT ?s) as ?count) WHERE {?s ?p ?o} ";
    private Query  numberOfUniqueSubjectsQuery = null;
    private int resultNumberOfUniqueSubjects = 0;
	//get number of unique predicates
	//select count(distinct ?y) where{?x ?y ?z}
    private String numberOfUniqueObjects = "SELECT DISTINCT (COUNT(DISTINCT ?o) as ?count) WHERE {?s ?p ?o} ";
    private Query numberOfUniqueObjectsQuery =null ;
    private int resultNumberOfUniqueObjects = 0 ;
    
    private JSONObject statisticts = new JSONObject();
    
    
    private QueryExecution tnotExec = null ;
    private QueryExecution nousExec =null;
    private QueryExecution nouoExec =null ;
    
    
	public DatasetStatistics(){
		totalNumberOfTriplesQuery= QueryFactory.create(totalNumberOfTriples);
		numberOfUniqueSubjectsQuery= QueryFactory.create(numberOfUniqueSubjects);
		numberOfUniqueObjectsQuery = QueryFactory.create(numberOfUniqueObjects);
	}
	
	
	public JSONObject queryLocalDataModel(Model model){
		//TODO can do each one of these in separate threads
		 tnotExec = QueryExecutionFactory.create( totalNumberOfTriplesQuery , model);
	     nousExec = QueryExecutionFactory.create( numberOfUniqueSubjectsQuery, model);
	     nouoExec = QueryExecutionFactory.create( numberOfUniqueObjectsQuery, model);
	     return makeJSONObject ();
		
	}
	
	private JSONObject makeJSONObject (){
		getUniqueSubject( );	 
		getUniqueObjects();
		getTotalTriples();
		return statisticts;
	}

	public JSONObject querySparqlEndpointUniqueSubject(String endpoint) {
		nousExec = QueryExecutionFactory.sparqlService(endpoint, numberOfUniqueSubjectsQuery);
		nousExec.setTimeout(600000);
		return getUniqueSubject( );
	}

	
	public JSONObject querySparqlEndpointUniqueObjects(String endpoint) {
		nouoExec = QueryExecutionFactory.sparqlService(endpoint, numberOfUniqueObjectsQuery);
		nouoExec.setTimeout(600000);
		return getUniqueObjects( );
	}

	public JSONObject querySparqlEndpointTotalTriples(String endpoint) {
		tnotExec = QueryExecutionFactory.sparqlService(endpoint, totalNumberOfTriplesQuery);
		tnotExec.setTimeout(600000);
		return getTotalTriples( );
	}	
	
	private JSONObject getUniqueSubject() {
		try {
		     ResultSet resultSetNumberOfUniqueSubjects = nousExec.execSelect();
		     if (resultSetNumberOfUniqueSubjects.hasNext()) { 
		    	   QuerySolution row= resultSetNumberOfUniqueSubjects.next();
		    	   statisticts.put("numberOfUniqueSubjects" , (row.getLiteral("count")).toString().replace("^^http://www.w3.org/2001/XMLSchema#integer", ""));
		     }
		}catch (Exception e){System.err.println(e);}
		finally {nousExec.close() ;  }
		
		return statisticts;
	}

	
	private JSONObject getUniqueObjects() {
		try {
		     ResultSet resultSetNumberOfUniqueObjects = nouoExec.execSelect();
		     if (resultSetNumberOfUniqueObjects.hasNext()) { 
		    	   QuerySolution row= resultSetNumberOfUniqueObjects.next();
		    	   statisticts.put("numberOfUniqueObjects" , (row.getLiteral("count")).toString().replace("^^http://www.w3.org/2001/XMLSchema#integer", ""));
		     }
			    
			}catch (Exception e){System.err.println(e);}
			finally {nouoExec.close() ;}
		
		return statisticts;
	}

	private JSONObject getTotalTriples() {
		try {
	    	 
	    	 ResultSet resultSetTotalNumberofTriples = tnotExec.execSelect();
		     if (resultSetTotalNumberofTriples.hasNext()) { 
		    	   QuerySolution row= resultSetTotalNumberofTriples.next();
		    	   statisticts.put("totalNumberOfTriples" ,( row.getLiteral("count")).toString().replace("^^http://www.w3.org/2001/XMLSchema#integer", ""));
		     }
			}catch (Exception e){System.err.println(e);}
			finally {
				tnotExec.close() ;
		     }
		
		return statisticts;
	}	
}
