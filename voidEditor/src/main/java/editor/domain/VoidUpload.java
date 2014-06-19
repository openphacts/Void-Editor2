package editor.domain;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.HashMap;
import java.util.Map;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.openrdf.rio.RDFHandlerException;
import org.openrdf.rio.RDFParseException;

import com.hp.hpl.jena.rdf.model.Model;
import com.hp.hpl.jena.rdf.model.ModelFactory;
import com.hp.hpl.jena.rdf.model.Property;
import com.hp.hpl.jena.rdf.model.RDFNode;
import com.hp.hpl.jena.rdf.model.Resource;
import com.hp.hpl.jena.rdf.model.Statement;
import com.hp.hpl.jena.rdf.model.StmtIterator;
import com.hp.hpl.jena.sparql.vocabulary.FOAF;

import editor.ontologies.Pav;
import editor.validator.RdfChecker;
/**
 *
 * @since 19/06/2014
 * @author Lefteris Tatakis
 *
 */
//TODO Javadoc
public class VoidUpload {

	private String importedFromSource = "http://purl.org/pav/importedFrom";
	private String authoredBy = "http://purl.org/pav/authoredBy";
	private String contributedBy = "http://purl.org/pav/contributedBy";
	private String curatedBy = "http://purl.org/pav/curatedBy";
	private File importedFile;

	private VoidAttributes attributes = new VoidAttributes() ;
	private Map<String, Object> mainDatasetSubjects = new HashMap<String, Object>();
	private Map<String, String> sourceDatasetSubjects = new HashMap<String, String>();
	private Map<String, String> contrDatasetSubjects = new HashMap<String, String>();
	private JSONObject result ;

    /**
     *
     * @param uploadedInputStream
     * @throws RDFParseException
     * @throws RDFHandlerException
     */
	public VoidUpload(InputStream uploadedInputStream) throws RDFParseException, RDFHandlerException {
		importedFile = writeToTempFile(uploadedInputStream);
		result = new JSONObject();
		createSubjectMap();
		createSourceMap();
		createContributorMap();
		processVoid();
		importedFile.delete();
	}
	
	private void processVoid() throws RDFParseException, RDFHandlerException {
		 
		checkRDF();
		
		Model model = ModelFactory.createDefaultModel(); 
		String path = importedFile.getAbsolutePath() ;
		model.read( path, "TURTLE") ;
		Resource mainResourse = null;

		String OS = System.getProperty("os.name").toLowerCase();
		
		if (OS.indexOf("win") >= 0 ) {
			mainResourse = model.getResource(path);
		} else {
			mainResourse = model.getResource("file://"+path); 
		}
		// Get createdBy information
		Resource createdBy = mainResourse.getProperty(Pav.createdBy).getResource();
		if (createdBy.hasProperty(FOAF.family_name)) result.put("familyName", createdBy.getProperty(FOAF.family_name).getString());
		if (createdBy.hasProperty(FOAF.givenname))result.put("givenName" , createdBy.getProperty(FOAF.givenname).getString());
		if (createdBy.hasProperty(FOAF.mbox)) result.put("userEmail" , createdBy.getProperty(FOAF.mbox).getResource().toString().replace("mailto:", ""));
		
		if (createdBy.getURI().contains("orcid")){
			String temp =createdBy.getURI().replace("http://orcid.org/", "");
			result.put("ORCID", temp);
		}
		
		//Get primary topic and iterate
		if(!mainResourse.hasProperty(FOAF.primaryTopic)) System.err.println("Primary topic is missing..");
		Resource primaryTopic = mainResourse.getProperty(FOAF.primaryTopic).getResource();
		StmtIterator iter = primaryTopic.listProperties();
		boolean doneSources = false;
		result.put("URI" , primaryTopic.toString());
		while (iter.hasNext()) {
			 Statement stmt      = iter.nextStatement();  // get next statement
			 Property  predicate = stmt.getPredicate();   // get the predicate
			 if ( mainDatasetSubjects.get(predicate.toString()) != null && predicate.toString().compareTo(importedFromSource) != 0
					 && predicate.toString().compareTo(curatedBy) != 0 && predicate.toString().compareTo(authoredBy) != 0
					 && predicate.toString().compareTo(contributedBy) != 0 ){
				 
				 String objectString = (String) mainDatasetSubjects.get(predicate.toString()) ;
				 String value = stmt.getObject().toString().replace("@en", "");
				 value =value.replace("^^http://www.w3.org/2001/XMLSchema#int", "");
				 
				 if (!objectString.equals("date"))
				 {
					 result.put(objectString , value);
				 } else{
					 value = value.replace("^^http://www.w3.org/2001/XMLSchema#dateTime" ,"");
					 System.out.println(value);
					 String[] dateString = value.split("T"); // get first part only that where date is
					 String[] individualDates = dateString[0].split("-");
					 
					 result.put("yearPublish",Integer.parseInt(individualDates[0]));
					 result.put("monthPublish",Integer.parseInt(individualDates[1]));
					 result.put("datePublish",Integer.parseInt( individualDates[2]));
				 }
				 
			 }else if (predicate.toString().compareTo(importedFromSource) == 0 && !doneSources 
					 && predicate.toString().compareTo(curatedBy) != 0 && predicate.toString().compareTo(authoredBy) != 0
					 && predicate.toString().compareTo(contributedBy) != 0 ){
				 //multiple object handling
				 StmtIterator sources = primaryTopic.listProperties(Pav.importedFrom); // for each source
				 JSONArray sourcesArrayJson = new JSONArray ();
				 
				 while (sources.hasNext()) {
					 
					  Statement sourcesStmt      = sources.nextStatement();  // get next statement
					  StmtIterator sourcesResourceItr = sourcesStmt.getResource().listProperties(); // go to each source
					  JSONObject attributeSourcesObjectReference = new JSONObject();
					  
					  while (sourcesResourceItr.hasNext()) { // extract info
						  Statement sourceStmt      = sourcesResourceItr.nextStatement();  // get next statement
						  // Check JSON for sources
						  String sourcePredicate = sourceStmt.getPredicate().toString();
						  String sourceObject = sourceStmt.getObject().toString().replace("@en", "");
						  
						  if(sourceDatasetSubjects.get(sourcePredicate)!= null)
						  {
							  attributeSourcesObjectReference.put( "URI", sourceStmt.getSubject().toString());
							  attributeSourcesObjectReference.put( sourceDatasetSubjects.get(sourcePredicate), sourceObject );
							  // To know if it was a custom Source or a OPS one
							  if( sourceDatasetSubjects.get(sourcePredicate).equals("description")  && sourceObject.equals("N/A")){
								  attributeSourcesObjectReference.put( "noURI", false);
							  }else if( sourceDatasetSubjects.get(sourcePredicate).equals("description")  && !sourceObject.equals("N/A")){
								  attributeSourcesObjectReference.put( "noURI", true);
							  }
						  }
					  }
 					  sourcesArrayJson.add(attributeSourcesObjectReference);
				 }
				 result.put("sources" , sourcesArrayJson);
				 doneSources = true;
				 
			 } else if ( predicate.toString().compareTo(curatedBy) == 0 || predicate.toString().compareTo(authoredBy) == 0
					|| predicate.toString().compareTo(contributedBy) == 0 ){
				 
				 Property[]  properties = {Pav.authoredBy , Pav.curatedBy, Pav.contributedBy};
				 Map<String, String> urisExist = new HashMap<String, String>();
				 int id= 0; 
				 JSONArray contriArrayJson = new JSONArray ();
				 for (int i =0 ; i <properties.length ; i++ ){
					 StmtIterator sources = primaryTopic.listProperties(properties[i]); // for each source
					 while (sources.hasNext()) {
						 
						  Statement contribStmt      = sources.nextStatement();  // get next statement
						  StmtIterator  contribResourceItr =  contribStmt.getResource().listProperties(); // go to each source
						  JSONObject  contribObjectReference = new JSONObject();
						  Statement finalStmt = null;
						  while ( contribResourceItr.hasNext()) { // extract info
							  Statement sourceStmt  =  contribResourceItr.nextStatement();  // get next statement
							  // Check JSON for sources
							  String sourcePredicate = sourceStmt.getPredicate().toString();
							  String sourceObject = sourceStmt.getObject().toString().replace("@en", "");
							 if(contrDatasetSubjects.get(sourcePredicate)!= null)
							  {
								  if( contrDatasetSubjects.get(sourcePredicate).equals("name")){
									  contribObjectReference.put( "name", sourceObject );
								  }	else if( contrDatasetSubjects.get(sourcePredicate).equals("surname")){
									  contribObjectReference.put( "surname", sourceObject );
								  }else if (contrDatasetSubjects.get(sourcePredicate).equals("email")) {
									  contribObjectReference.put( "email", sourceObject.toString().replace("mailto:", ""));
								  }else if ( sourceStmt.getSubject().getURI().contains("orcid")){
										String temp =createdBy.getURI().replace("http://orcid.org/", "");
										contribObjectReference.put( "orcid", temp);
								  }
							  }
							 finalStmt = sourceStmt;
						  }
						  contribObjectReference.put( "URI", finalStmt.getSubject().getURI());
						  contribObjectReference.put( "id",id);
						  
						  if (properties[i].equals(  Pav.authoredBy )) contribObjectReference.put( "author",true);
						  else contribObjectReference.put( "author",false);
							  
						  if (properties[i].equals(  Pav.curatedBy )) contribObjectReference.put( "curator",true);
						  else contribObjectReference.put( "curator",false);
						  
						  if (properties[i].equals( Pav.contributedBy) ) contribObjectReference.put( "contributor",true);
						  else contribObjectReference.put( "contributor",false);
						  
						  if (!urisExist.containsKey(finalStmt.getSubject().getURI())) {
							  
							  contriArrayJson.add(contribObjectReference);
							  urisExist.put( finalStmt.getSubject().getURI(), id+"");
							  id++;
						  } else {
							  for (int j= 0 ; j < contriArrayJson.size();j++){
								 
								  JSONObject ttmp = (JSONObject) contriArrayJson.get(j);
								  if (ttmp.get("URI").equals(finalStmt.getSubject().getURI()) ){
									  if (properties[i].equals(  Pav.authoredBy )) ttmp.put( "author",true);
									  if (properties[i].equals(  Pav.curatedBy )) ttmp.put( "curator",true);
									  if (properties[i].equals( Pav.contributedBy) ) ttmp.put( "contributor",true);
									  contriArrayJson.set(j, ttmp);
								  }
							  }
						  }
					 }
					 System.out.println(contriArrayJson);
					 result.put("contributors" , contriArrayJson);
					
				 }
			 }
		}
		System.out.println(result);
	}

	public JSONObject getResult(){
		return result;
	}
	
	private void checkRDF() throws RDFParseException, RDFHandlerException {
		RdfChecker checker = new RdfChecker();
         try {
			checker.check(importedFile);
         } catch (RDFParseException e) {
				throw new RDFParseException("Inputed VOID file parse error. Is it RDF?");
			 } catch (RDFHandlerException e) {
				throw new RDFHandlerException("Input VOID file Handling error. Is it RDF?");
			 } catch (IOException e) {
				e.printStackTrace();
			 }
	}
	
	private void printModel (Model model){
		StmtIterator iter = model.listStatements();
		printIterator(iter);
	}

    /**
     *
     */
	private void createSubjectMap(){
		mainDatasetSubjects.put("http://purl.org/dc/terms/description" , "description" ); 
		mainDatasetSubjects.put("http://purl.org/dc/terms/publisher", "publisher");
		mainDatasetSubjects.put("http://www.w3.org/ns/dcat#landingPage", "webpage" );
		mainDatasetSubjects.put("http://purl.org/pav/version" , "version");
		mainDatasetSubjects.put( "http://purl.org/pav/importedFrom" , "sources");
		mainDatasetSubjects.put("http://purl.org/dc/terms/license" , "licence");
		mainDatasetSubjects.put("http://rdfs.org/ns/void#dataDump" , "downloadFrom");
		mainDatasetSubjects.put("http://rdfs.org/ns/void#triples" , "totalNumberOfTriples");
		mainDatasetSubjects.put("http://rdfs.org/ns/void#distinctSubjects" , "numberOfUniqueSubjects");
		mainDatasetSubjects.put("http://rdfs.org/ns/void#distinctObjects" , "numberOfUniqueObjects");
		mainDatasetSubjects.put("http://purl.org/dc/terms/accrualPeriodicity" , "updateFrequency");
		mainDatasetSubjects.put("http://purl.org/dc/terms/issued" , "date" ); 
		mainDatasetSubjects.put("http://purl.org/dc/terms/title" , "title");
		mainDatasetSubjects.put("http://rdfs.org/ns/void#sparqlEndpoint" , "sparqlEndpoint");
	}

    /**
     *
     */
	private void createSourceMap(){
		sourceDatasetSubjects.put("http://purl.org/dc/terms/description", "description");
		sourceDatasetSubjects.put("http://purl.org/dc/terms/title", "title");
		sourceDatasetSubjects.put("http://purl.org/pav/version", "version");
		sourceDatasetSubjects.put("http://www.w3.org/ns/dcat#landingPage", "webpage");
	}

    /**
     *
     */
	private void createContributorMap(){
		contrDatasetSubjects.put("http://xmlns.com/foaf/0.1/mbox", "email");
		contrDatasetSubjects.put("http://xmlns.com/foaf/0.1/givenname", "name");
		contrDatasetSubjects.put("http://xmlns.com/foaf/0.1/family_name", "surname");
	}
	
	
	private void printIterator(StmtIterator iter) {
		while (iter.hasNext()) {
			   Statement stmt      = iter.nextStatement();  // get next statement
			    Resource  subject   = stmt.getSubject();     // get the subject
			    Property  predicate = stmt.getPredicate();   // get the predicate
			    RDFNode   object    = stmt.getObject();      // get the object

			    System.out.print(subject.toString());
			    System.out.print(" " + predicate.toString() + " ");
			    if (object instanceof Resource) {
			       System.out.print(object.toString());
			    } else {
			        // object is a literal
			        System.out.print(" \"" + object.toString() + "\"");
			    }
			    System.out.println(" .");
		   }
	}

    /**
     *
     * @param uploadedInputStream
     * @return A temporary file to be processed.
     */
	private File writeToTempFile(InputStream uploadedInputStream) {
			File fileOutput= null;
			OutputStream out = null;
			try {
				fileOutput = File.createTempFile("void", ".ttl");
				out = new FileOutputStream(fileOutput);
				int read = 0;
				byte[] bytes = new byte[1024];
				out = new FileOutputStream(fileOutput);
				while ((read = uploadedInputStream.read(bytes)) != -1) {
					out.write(bytes, 0, read);
				}
				out.flush();
			} catch (IOException e) {
				e.printStackTrace();
			} finally { try {out.close();} catch (IOException e) {e.printStackTrace();}}
			
			if (fileOutput == null) System.err.println("File did not write!!!");
			return fileOutput;
		}
}
