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

import editor.ontologies.Biopax_level3;
import editor.ontologies.DCAT;
import editor.ontologies.Freq;
import editor.ontologies.Gpml;
import editor.ontologies.Pav;
import editor.ontologies.Prov;
import editor.ontologies.Void;
import editor.ontologies.Wp;
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
public class voidTurtle {

    private String userName;	
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
	/**
	 * @param obj This object provides all data extracted from Angular side.
	 */
	public voidTurtle(voidAttributes obj){
		this.userName = obj.userName;
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
         voidModel.setNsPrefix("biopax", Biopax_level3.getURI());
         voidModel.setNsPrefix("gpml", Gpml.getURI());
         voidModel.setNsPrefix("wp", Wp.getURI());
         voidModel.setNsPrefix("foaf", FOAF.getURI());
         voidModel.setNsPrefix("hmdb", "http://identifiers.org/hmdb/");
         voidModel.setNsPrefix("freq", Freq.getURI());
         voidModel.setNsPrefix("dc", DC.getURI());
         voidModel.setNsPrefix("dcat", DCAT.getURI());
         voidModel.setNsPrefix("", "#");
         
         //Populate void.ttl
         
         // Dataset Description info
         
         
         Resource voidDescriptionBase = voidModel.createResource("");
         Literal titleDescriptionLiteral = voidModel.createLiteral("VoID Description", "en");
         Literal descriptionDescriptionLiteral = voidModel.createLiteral("The VoID description for the RDF representation of this dataset.", "en");
         Calendar now = Calendar.getInstance();
         Literal nowDescriptionLiteral = voidModel.createTypedLiteral(now);
         Literal createdByNameLiteral = voidModel.createLiteral(userName, "en");
         Literal createdByEmailLiteral = voidModel.createLiteral(userEmail, "en");
         
         
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
         voidDescriptionBase.addProperty(Pav.createdBy, createdByNameLiteral);
         voidDescriptionBase.addProperty(Pav.createdBy, createdByEmailLiteral);
         
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
	        	 // Extract source URI first to be able to create the correct structure in the void.
	        	 
	        	 // Source is placed as the 3rd element in the array
	        	 String[] sourceInfoToVariableAndValue = splitingSetsOfInfo[2].split("="); 
	 			 Resource source = voidModel.createResource(sourceInfoToVariableAndValue[1].replace("}","")); // URI
	             voidBase.addProperty(Pav.importedFrom, source);
	             
	             // check if RDF resource or not
	             // Type is 2nd element
	             String[] splitType = splitingSetsOfInfo[1].split("="); 
	             if (splitType[1].contains("-")) {
	            	 source.addProperty(RDF.type, DCTypes.Dataset);
	             }else{
	            	 source.addProperty(RDF.type, Void.Dataset);
	             }
	             
	             String[] titleSplit = splitingSetsOfInfo[0].split("="); 
	             Literal titleLiteralTmp = voidModel.createLiteral(titleSplit[1], "en");
	             source.addProperty(DCTerms.title, titleLiteralTmp);
	             
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
