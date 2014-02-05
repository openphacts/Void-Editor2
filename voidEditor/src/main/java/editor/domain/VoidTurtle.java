package editor.domain;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.UUID;

import javax.xml.bind.annotation.XmlRootElement;

import org.openrdf.rio.RDFHandlerException;
import org.openrdf.rio.RDFParseException;

import com.hp.hpl.jena.rdf.model.Literal;
import com.hp.hpl.jena.rdf.model.Model;
import com.hp.hpl.jena.rdf.model.ModelFactory;
import com.hp.hpl.jena.rdf.model.Resource;
import com.hp.hpl.jena.sparql.vocabulary.FOAF;
import com.hp.hpl.jena.vocabulary.DC;
import com.hp.hpl.jena.vocabulary.DCTerms;
import com.hp.hpl.jena.vocabulary.DCTypes;
import com.hp.hpl.jena.vocabulary.RDF;
import com.hp.hpl.jena.vocabulary.XSD;

import editor.ontologies.DCAT;
import editor.ontologies.Freq;
import editor.ontologies.Pav;
import editor.ontologies.Prov;
import editor.ontologies.Void;
import editor.validator.RdfChecker;
/**
 *  This java class is based on work of : Andra Waagmeester 
 *  This class is provided all the data specified in the voidAttributes {@link voidAttributes}.
 *  The data is provided from that browser side of the project.
 *  It places all data in the appropriate field of the dataset description.
 * 
 * @author Lefteris Tatakis
 * @author Andra Waagmeester 
 */

@XmlRootElement
public class VoidTurtle {

	private String givenName ;	
	private String familyName;	
    private String userEmail;
    private String title;
    private String description ; 
    private String publisher;
    private int  datePublish;
    private int  monthPublish;
    private int  yearPublish;
    private String  webpage;
    private String  licence;
    private String  downloadFrom;
    private String  sparqlEndpoint;
    private String  version;
    private String  previousVersion;
    private String updateFrequency;
	private File output= null ;
	private ArrayList sources = null;
	private String URI;
	private String totalNumberOfTriples="";
	private String numberOfUniqueSubjects="";
	private String numberOfUniqueObjects ="";
	/**
	 * @param obj This object provides all data extracted from Angular side.
	 */
	public VoidTurtle(VoidAttributes obj){
		this.givenName = obj.givenName;
		this.familyName= obj.familyName ;
		this.userEmail = obj.userEmail;
		this.title = obj.title;
		this.description = obj.description ; 
		this.publisher = obj.publisher;
	    this.webpage= obj.webpage ;
	    this.licence = obj.licence;
	    this.downloadFrom = obj.downloadFrom;
	    this.sparqlEndpoint= obj.sparqlEndpoint;
	    this.version= obj.version ;
	    this.previousVersion= obj.previousVersion ;
	    this.updateFrequency = obj.updateFrequency;
	    this.sources = (ArrayList) obj.sources;
	    this.URI = obj.URI;
	    this.totalNumberOfTriples=obj.totalNumberOfTriples;
	    this.numberOfUniqueSubjects=obj.numberOfUniqueSubjects;
	    this.numberOfUniqueObjects =obj.numberOfUniqueObjects;

		System.out.println(obj.datePublish);
	    if (obj.datePublish.equals("N/A")){
	    	this.setDatePublish(1) ;
	    }else {
	    	this.setDatePublish(Integer.parseInt(obj.datePublish));
	    }
	    
	    System.out.println(obj.monthPublish);
	    this.setMonthPublish(Integer.parseInt(obj.monthPublish));
	    
	    System.out.println(obj.yearPublish);
	    this.setYearPublish(Integer.parseInt(obj.yearPublish));
	    
	}
	
	
	/**
	 * Using data from the constructor it creates dataset description.
	 */
	public void createVoid(){
		
		 Model voidModel = ModelFactory.createDefaultModel();
		 voidModel.setNsPrefix("xsd", XSD.getURI());
         voidModel.setNsPrefix("void", Void.getURI());
         voidModel.setNsPrefix("pav", Pav.getURI());
         voidModel.setNsPrefix("prov", Prov.getURI());
         voidModel.setNsPrefix("dcterms", DCTerms.getURI());
         voidModel.setNsPrefix("foaf", FOAF.getURI());
         voidModel.setNsPrefix("freq", Freq.getURI());
         voidModel.setNsPrefix("dc", DC.getURI());
         voidModel.setNsPrefix("dcat", DCAT.getURI());
         voidModel.setNsPrefix("", "#");
         
         //Populate void.ttl
         //Dataset Description info
         Resource voidDescriptionBase = voidModel.createResource("");
         Literal titleDescriptionLiteral = voidModel.createLiteral("VoID Description", "en");
         Literal descriptionDescriptionLiteral = voidModel.createLiteral("The VoID description for the RDF representation of this dataset.", "en");
         Calendar now = Calendar.getInstance();
         Literal nowDescriptionLiteral = voidModel.createTypedLiteral(now);
         Literal issueDescriptionLiteral = voidModel.createTypedLiteral(now);
         
         Literal createdByGivenNameLiteral = voidModel.createLiteral(givenName, "en");
         Literal createdByFamilyNameLiteral = voidModel.createLiteral(familyName, "en");
         Resource createdByEmailResource = voidModel.createResource( "mailto:"+ userEmail);
         Resource createdWith = voidModel.createResource("http://voideditor.cs.man.ac.uk/");
         
         Calendar publishmentDate = Calendar.getInstance();
         publishmentDate.set( getYearPublish(),getMonthPublish() -1 , getDatePublish());
         Literal publishmentLiteral = voidModel.createTypedLiteral(publishmentDate);
         Literal titleLiteral = voidModel.createLiteral(title, "en");
         Literal descriptionLiteral = voidModel.createLiteral(description, "en");
     
         //initial data
         Resource voidBase = voidModel.createResource(URI);
         voidBase.addProperty(RDF.type, Void.Dataset);
         voidBase.addProperty(DCTerms.title, titleLiteral);
         voidBase.addProperty(DCTerms.description, descriptionLiteral);
         voidBase.addProperty(DCTerms.issued, publishmentLiteral);
         
         // Creation of void
         voidDescriptionBase.addProperty(RDF.type, Void.DatasetDescription);
         voidDescriptionBase.addProperty(DCTerms.title, titleDescriptionLiteral);
         voidDescriptionBase.addProperty(DCTerms.description, descriptionDescriptionLiteral);
         voidDescriptionBase.addProperty(DCTerms.issued, issueDescriptionLiteral);
         String URI4Person = "http://voideditor.cs.man.ac.uk/" + UUID.randomUUID();
         Resource resourceForPerson = voidModel.createResource(URI4Person);
         voidDescriptionBase.addProperty(Pav.createdBy, resourceForPerson);
         resourceForPerson.addProperty(RDF.type, FOAF.Person);
         resourceForPerson.addProperty( FOAF.givenname, createdByGivenNameLiteral  );
         resourceForPerson.addProperty( FOAF.family_name, createdByFamilyNameLiteral  );
         resourceForPerson.addProperty( FOAF.mbox , createdByEmailResource );
         
         voidDescriptionBase.addProperty(Pav.createdWith, createdWith);
         
         voidDescriptionBase.addLiteral(Pav.createdOn, nowDescriptionLiteral);
         voidDescriptionBase.addProperty(FOAF.primaryTopic,voidBase );
         
         //Dataset void - conditional
         if (publisher !=""){
        	 Resource identifiersOrg = voidModel.createResource(publisher);
        	 voidBase.addProperty(DCTerms.publisher, identifiersOrg);
         }
        
         if (webpage !=""){
        	 Resource landingPage = voidModel.createResource(webpage);
        	 voidBase.addProperty(DCAT.landingPage, landingPage);
         }
         
         if (downloadFrom !=""){
        	   Resource mainDatadump = voidModel.createResource(downloadFrom);
        	   voidBase.addProperty(Void.dataDump, mainDatadump);
         }
         
         if (licence !="" ){
        	 Resource license = voidModel.createResource(licence);
        	 voidBase.addProperty(DCTerms.license, license);
         }
         
         if (sparqlEndpoint !=""){
        	 Resource sparqlEndpointLoc = voidModel.createResource(sparqlEndpoint);
        	 voidBase.addProperty(Void.sparqlEndpoint, sparqlEndpointLoc);
         }
         if (version !=""){
        	 Literal versionUsed = voidModel.createLiteral(version);
        	 voidBase.addProperty(Pav.version, versionUsed);
         }
        
         if (previousVersion !=""){ // Will validator allow it?
        	 Resource prevVersion = voidModel.createResource(previousVersion);
        	 voidBase.addProperty(Pav.previousVersion, prevVersion);
         }
        
         if (updateFrequency !=""){
        	 Literal updateFrequencyDef = voidModel.createLiteral(updateFrequency);
             voidBase.addProperty(DCTerms.accrualPeriodicity, updateFrequencyDef);
         }
         
         if (totalNumberOfTriples !="" && totalNumberOfTriples != null){
        	 Literal totalNumberOfTriplesDef = voidModel.createTypedLiteral(new Integer(totalNumberOfTriples));
             voidBase.addProperty(Void.triples, totalNumberOfTriplesDef);
         }
         
         if (numberOfUniqueSubjects !="" && numberOfUniqueSubjects != null){
        	 Literal numberOfUniqueSubjectsDef = voidModel.createTypedLiteral(new Integer(numberOfUniqueSubjects));
             voidBase.addProperty(Void.distinctSubjects, numberOfUniqueSubjectsDef);
         }
         
         if (numberOfUniqueObjects !="" && numberOfUniqueObjects != null){
        	 Literal numberOfUniquePredicatesDef = voidModel.createTypedLiteral(new Integer(numberOfUniqueObjects));
             voidBase.addProperty(Void.distinctObjects, numberOfUniquePredicatesDef);
         }
         
 	    
         //Here will add sources
         /**
          *  Extracts data from datasources which the user provides.  
          */
         if (sources != null ){
        	 for (int i = 0; i < sources.size(); i++) {
	        	 // Sources provided in wierd format - so manually do parsing.
	        	 String tmpValue = sources.get(i).toString();
	        	 System.out.println(tmpValue);
	        	 String[] splitingSetsOfInfo = tmpValue.split(","); // for example { var = val , var2 = val } 
	        	 
	        	 Resource source = null;
	        	 
	        	 // Extract source URI first to be able to create the correct structure in the void.
	        	 for(int j = 0; j <splitingSetsOfInfo.length ; j++ )
	        	 {
	        		 String[] couple = splitingSetsOfInfo[j].split("=");
	        		 String property2Check = couple[0];
	        		 String value = couple[1].replace("}","");
	        		 if(property2Check.contains("URI")){
	        			 source = voidModel.createResource(value);
	        			 voidBase.addProperty(Pav.importedFrom, source);
	        		 }
	        	 }
	        	 
	        	 for(int j = 0; j <splitingSetsOfInfo.length ; j++ )
	        	 {
	        		 String[] couple = splitingSetsOfInfo[j].split("=");
	        		 String property2Check = couple[0];
	        		 String value = couple[1].replace("}","");
	        		 if(property2Check.contains("type")){
	    	             if (value.contains("-")) {
	    	            	 source.addProperty(RDF.type, DCTypes.Dataset);
	    	             }else{
	    	            	 source.addProperty(RDF.type, Void.Dataset);
	    	             }
	        		 } else if(property2Check.contains("title")){
	        			 Literal titleLiteralTmp = voidModel.createLiteral(value, "en");
	                     source.addProperty(DCTerms.title, titleLiteralTmp);
	        		 } else if(property2Check.contains("version")){
	        			 Literal versionLiteralTmp = voidModel.createLiteral(value, "en");
	    	             source.addProperty(Pav.version, versionLiteralTmp);
	        		 } else if(property2Check.contains("webpage")){
	        			 Resource webpageResourceTmp = voidModel.createResource(value);
	    	             source.addProperty(DCAT.landingPage, webpageResourceTmp);
	        		 } else if(property2Check.contains("description")){
	        			 Literal descriptionLiteralTmp = voidModel.createLiteral(value, "en");
	    	             source.addProperty(DCTerms.description, descriptionLiteralTmp);
	        		 }
	        	 }
	 		 }
         }
         BufferedWriter bw = null;
         try
         {
        	output = File.createTempFile("void", ".ttl"); 
     	    bw = new BufferedWriter(new FileWriter(output));
     	    System.out.println("Temp file : " + output.getAbsolutePath());
     	    voidModel.write(bw,  "TURTLE");
     	    System.out.println("Done");
     	 }
         catch(IOException e){e.printStackTrace();}
         finally { try {bw.close();} catch (IOException e) {e.printStackTrace();}
         }
         
         checkRDF();
	}


	private void checkRDF() {
		RdfChecker checker = new RdfChecker();
         try {
			checker.check(output);
	  	 } catch (RDFParseException e) {
			System.err.println("Got a RDFParseException!! ");
			e.printStackTrace();
			System.out.println("==========================");
		 } catch (RDFHandlerException e) {
			System.out.println("Got a RDFHandlerException ");
			e.printStackTrace();
			System.out.println("==========================");
		 } catch (IOException e) {
			System.out.println("Got a IOException ");
			e.printStackTrace();
			System.out.println("==========================");
		 }
	}
	
	public String getVoid(){
		String outputString ="";
		BufferedReader read = null;
		try { 
			read = new BufferedReader( new FileReader(output) ); 
			String line; 
			while ((line = read.readLine()) != null){ 
				outputString += (line + '\n');
			} 
		} catch (FileNotFoundException e) { e.printStackTrace(); } catch (IOException e) {
			System.out.println("IOException --> Something went wrong with file");
			e.printStackTrace();
		} finally{try {read.close();} catch (IOException e) {	e.printStackTrace();}}
		output.delete();
		
		return outputString;
	}
	
	public String getLocation(){
		output.deleteOnExit();
		return output.getAbsolutePath();
	}


	public int getDatePublish() {
		return datePublish;
	}


	public void setDatePublish(int datePublish) {
		this.datePublish = datePublish;
	}


	public int getYearPublish() {
		return yearPublish;
	}


	public void setYearPublish(int yearPublish) {
		this.yearPublish = yearPublish;
	}


	public int getMonthPublish() {
		return monthPublish;
	}


	public void setMonthPublish(int monthPublish) {
		this.monthPublish = monthPublish;
	}
	
	
}
