package editor.domain;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.util.Calendar;
import java.util.LinkedHashMap;
import java.util.UUID;

import javax.xml.bind.annotation.XmlRootElement;

import org.openrdf.rio.RDFHandlerException;
import org.openrdf.rio.RDFParseException;

import uk.ac.manchester.cs.datadesc.validator.rdftools.VoidValidatorException;

import com.hp.hpl.jena.rdf.model.Literal;
import com.hp.hpl.jena.rdf.model.Model;
import com.hp.hpl.jena.rdf.model.ModelFactory;
import com.hp.hpl.jena.rdf.model.Property;
import com.hp.hpl.jena.rdf.model.Resource;
import com.hp.hpl.jena.sparql.vocabulary.FOAF;
import com.hp.hpl.jena.vocabulary.DC;
import com.hp.hpl.jena.vocabulary.DCTerms;
import com.hp.hpl.jena.vocabulary.RDF;
import com.hp.hpl.jena.vocabulary.XSD;

import editor.ontologies.DCAT;
import editor.ontologies.Freq;
import editor.ontologies.Pav;
import editor.ontologies.Prov;
import editor.ontologies.Void;
import editor.validator.RdfChecker;
import editor.validator.Validator;
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
public class LinksetTurtle {

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
	private File output= null ;
	private String URI;
	private String ORCID = "";
	private String relationship ="";
	private String justification ="";
	private LinkedHashMap userTarget =null;
	private LinkedHashMap userSource =null;
	  
	private Validator validator = null;
	/**
	 * @param obj This object provides all data extracted from Angular side.
	 */
	public LinksetTurtle(LinksetAttributes obj){
		this.givenName = obj.givenName;
		this.familyName= obj.familyName ;
		this.userEmail = obj.userEmail;
		this.title = obj.title;
		this.description = obj.description ; 
		this.publisher = obj.publisher;
	    this.webpage= obj.webpage ;
	    this.licence = obj.licence;
	    this.downloadFrom = obj.downloadFrom;
	    this.URI = obj.URI;
	    this.ORCID = obj.ORCID;
	    this.relationship = obj.relationship;
	    this.justification = obj.justification;
	    this.userTarget = (LinkedHashMap) obj.userTarget;
	    this.userSource = (LinkedHashMap) obj.userSource;
	    
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
	 * @throws VoidValidatorException 
	 * @throws IOException 
	 * @throws RDFHandlerException 
	 * @throws RDFParseException 
	 */
	public void createVoid() throws VoidValidatorException, RDFParseException, RDFHandlerException, IOException{
		
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
         voidModel.setNsPrefix("bdb", "http://vocabularies.bridgedb.org/ops");
         voidModel.setNsPrefix("", "#");
         
         //Populate void.ttl
         //Dataset Description info
         Resource voidDescriptionBase = voidModel.createResource("");
         Literal titleDescriptionLiteral = voidModel.createLiteral("Linkset Description", "en");
         Literal descriptionDescriptionLiteral = voidModel.createLiteral("The VoID description for the linkset between two data sources.", "en");
         Calendar now = Calendar.getInstance();
         Literal nowDescriptionLiteral = voidModel.createTypedLiteral(now);
         Literal issueDescriptionLiteral = voidModel.createTypedLiteral(now);
         
         Literal createdByGivenNameLiteral = voidModel.createLiteral(givenName);
         Literal createdByFamilyNameLiteral = voidModel.createLiteral(familyName);
         Resource createdByEmailResource = voidModel.createResource( "mailto:"+ userEmail);
         Resource createdWith = voidModel.createResource("http://voideditor.cs.man.ac.uk/");
         
         Calendar publishmentDate = Calendar.getInstance();
         publishmentDate.set( getYearPublish(),getMonthPublish() -1 , getDatePublish() , 0, 0, 0);
         Literal publishmentLiteral = voidModel.createTypedLiteral(publishmentDate);
         Literal titleLiteral ;
         if (title =="") {
        	 titleLiteral = voidModel.createLiteral( "-", "en");
         }else{
        	 titleLiteral = voidModel.createLiteral(title, "en");
         }
         Literal descriptionLiteral;
         if (title =="" ) {
        	 descriptionLiteral = voidModel.createLiteral("-", "en");
         }else{
        	 descriptionLiteral = voidModel.createLiteral(description, "en");
         }
         //initial data
         if (URI.equalsIgnoreCase("http://www.openphacts.org/")){
        	 URI = URI + UUID.randomUUID();
         }
         
         Resource voidBase = voidModel.createResource(URI);
         voidBase.addProperty(RDF.type, Void.Linkset);
         voidBase.addProperty(DCTerms.title, titleLiteral);
         voidBase.addProperty(DCTerms.description, descriptionLiteral);
         voidBase.addProperty(DCTerms.issued, publishmentLiteral);
         
         // Creation of void
         voidDescriptionBase.addProperty(RDF.type, Void.DatasetDescription);
         voidDescriptionBase.addProperty(DCTerms.title, titleDescriptionLiteral);
         voidDescriptionBase.addProperty(DCTerms.description, descriptionDescriptionLiteral);
         voidDescriptionBase.addProperty(DCTerms.issued, issueDescriptionLiteral);
         String URI4Person = "";
         if ( this.ORCID == null || this.ORCID == ""){
            URI4Person = "http://voideditor.cs.man.ac.uk/" + UUID.randomUUID();
         } else{
        	 URI4Person = "http://orcid.org/" + this.ORCID;
         }
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
         
         if (relationship !="" ){
        	 Resource relationshipR = voidModel.createResource(relationship);
        	 voidBase.addProperty(Void.linkPredicate, relationshipR);
         }
         System.out.println("userSource => " + userSource);
         System.out.println(userSource.toString());
         if (userSource !=null ){
        	 
	        Resource userSourceR = voidModel.createResource((userSource.get("URI")).toString());
	        voidBase.addProperty(Void.subjectsTarget, userSourceR);    
         }
         System.out.println("userTarget==> " +userTarget);
         System.out.println(userTarget.toString());
         if (userTarget !=null ){
        	 Resource userTargetR = voidModel.createResource((userTarget.get("URI")).toString());
        	 voidBase.addProperty(Void.objectsTarget, userTargetR);
        	 
         }
         
         if (justification !="" ){
        	 Resource justificationR = voidModel.createResource(justification);
        	 Property LinksetJustification = voidModel.createProperty( "http://vocabularies.bridgedb.org/ops#linksetJustification" );
        	 voidBase.addProperty(LinksetJustification, justificationR);
         }
         
         
         BufferedWriter bw = null;
         try
         {
        	output = File.createTempFile("linksetVoid", ".ttl"); 
     	    bw = new BufferedWriter(new FileWriter(output));
     	    System.out.println("Temp file : " + output.getAbsolutePath());
     	    voidModel.write(bw,  "TURTLE");
     	    System.out.println("Done");
     	 }
         catch(IOException e){e.printStackTrace();}
         finally { try {bw.close();} catch (IOException e) {e.printStackTrace();}
         }
         
         checkRDF();
         
         ///validateRDFForOPS();
	}

	
	private void checkRDF() throws RDFParseException, RDFHandlerException, IOException {
		RdfChecker checker = new RdfChecker();
         try {
			checker.check(output);
	  	 } catch (RDFParseException e) {
			System.err.println("Got a RDFParseException!! ");
			e.printStackTrace();
			throw new RDFParseException("The editor created a wrong file - please contact Lefteris.");
		 } catch (RDFHandlerException e) {
			System.out.println("Got a RDFHandlerException ");
			e.printStackTrace();
			System.out.println("==========================");
			throw new RDFHandlerException("The editor handled a wrong file - please contact Lefteris.");
		 } catch (IOException e) {
			System.out.println("Got a IOException ");
			e.printStackTrace();
			System.out.println("==========================");
			throw new IOException("The editor could not find the file - please contact Lefteris.");
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
	
	public String getValidationResults(){
		return validator.showResult();
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
