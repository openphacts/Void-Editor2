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
 * @author Lefteris Tatakis
 *
 */
public class VoidUpload {

	private String importedFromSource = "http://purl.org/pav/importedFrom";
	private  File importedFile;
	private VoidAttributes attributes = new VoidAttributes() ;
	private Map<String, Object> mainDatasetSubjects = new HashMap<String, Object>();
	private Map<String, String> sourceDatasetSubjects = new HashMap<String, String>();
	private JSONObject result ;
	
	public VoidUpload(InputStream uploadedInputStream) throws RDFParseException, RDFHandlerException {
		importedFile = writeToTempFile(uploadedInputStream);
		result = new JSONObject();
		createSubjectMap();
		createSourceMap();
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
		//Resource mainResourse = model.getResource(path); // for windows
		// Get createdBy information
		Resource createdBy = mainResourse.getProperty(Pav.createdBy).getResource();
		if (createdBy.hasProperty(FOAF.family_name)) result.put("familyName", createdBy.getProperty(FOAF.family_name).getString());
		if (createdBy.hasProperty(FOAF.givenname))result.put("givenName" , createdBy.getProperty(FOAF.givenname).getString());
		if (createdBy.hasProperty(FOAF.mbox)) result.put("userEmail" , createdBy.getProperty(FOAF.mbox).getResource().toString().replace("mailto:", ""));
		
		//Get primary topic and iterate
		if(!mainResourse.hasProperty(FOAF.primaryTopic)) System.err.println("Primary topic is missing..");
		Resource primaryTopic = mainResourse.getProperty(FOAF.primaryTopic).getResource();
		StmtIterator iter = primaryTopic.listProperties();
		boolean doneSources = false;
		result.put("URI" , primaryTopic.toString());
		while (iter.hasNext()) {
			 Statement stmt      = iter.nextStatement();  // get next statement
			 Property  predicate = stmt.getPredicate();   // get the predicate
			 if ( mainDatasetSubjects.get(predicate.toString()) != null && predicate.toString().compareTo(importedFromSource) != 0){
				 
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
				 
			 }else if (predicate.toString().compareTo(importedFromSource) == 0 && !doneSources){
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
				System.err.println("In Imported file --> Got a RDFParseException!! ");
				throw new RDFParseException("Inputed VOID file parse error. Is it RDF?");
			 } catch (RDFHandlerException e) {
				System.out.println("In Imported file -->Got a RDFHandlerException ");
				throw new RDFHandlerException("Input VOID file Handling error. Is it RDF?");
			 } catch (IOException e) {
				System.out.println("In Imported file -->Got a IOException ");
				e.printStackTrace();
			 }
	}
	
	private void printModel (Model model){
		StmtIterator iter = model.listStatements();
		printIterator(iter);
	}

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
	
	private void createSourceMap(){
		sourceDatasetSubjects.put("http://purl.org/dc/terms/description", "description");
		sourceDatasetSubjects.put("http://purl.org/dc/terms/title", "title");
		sourceDatasetSubjects.put("http://purl.org/pav/version", "version");
		sourceDatasetSubjects.put("http://www.w3.org/ns/dcat#landingPage", "webpage");
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
