package editor.domain;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.util.Calendar;

import javax.xml.bind.annotation.XmlRootElement;

import com.hp.hpl.jena.rdf.model.Literal;
import com.hp.hpl.jena.rdf.model.Model;
import com.hp.hpl.jena.rdf.model.ModelFactory;
import com.hp.hpl.jena.rdf.model.Resource;
import com.hp.hpl.jena.sparql.vocabulary.FOAF;
import com.hp.hpl.jena.vocabulary.DC;
import com.hp.hpl.jena.vocabulary.DCTerms;
import com.hp.hpl.jena.vocabulary.RDF;
import com.hp.hpl.jena.vocabulary.XSD;

import editor.ontologies.Biopax_level3;
import editor.ontologies.Freq;
import editor.ontologies.Gpml;
import editor.ontologies.Pav;
import editor.ontologies.Prov;
import editor.ontologies.Voag;
import editor.ontologies.Void;
import editor.ontologies.Wp;



@XmlRootElement
public class voidTurtle {

    private String userName;	
    private String userEmail;
    private String title;
    private String description ; 
    private String publisher;
    private String  datePublish;
    private String  monthPublish;
    private String  yearPublish;
    private String  webpage;
    private String  licence;
    private String  downloadFrom;
    private String  sparqlEndpoint;
    private String  version;
    private String  previousVersion;
    private String updateFrequency;
	private File output= null ;
	
	public voidTurtle(voidAttributes obj){
		this.userName = obj.userName;
		this.userEmail = obj.userEmail;
		this.title = obj.title;
		this.description = obj.description ; 
		this.publisher = obj.publisher;
	    this.datePublish =obj.datePublish;
	    this.monthPublish = obj.monthPublish;
	    this.yearPublish= obj.yearPublish ;
	    this.webpage= obj.webpage ;
	    this.licence = obj.licence;
	    this.downloadFrom = obj.downloadFrom;
	    this.sparqlEndpoint= obj.sparqlEndpoint;
	    this.version= obj.version ;
	    this.previousVersion= obj.previousVersion ;
	    this.updateFrequency = obj.updateFrequency;
			
	}
	
	
	
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
         
         
         //Populate void.ttl
         Calendar now = Calendar.getInstance();
         Literal nowLiteral = voidModel.createTypedLiteral(now);
         Literal titleLiteral = voidModel.createLiteral(title, "en");
         Literal descriptionLiteral = voidModel.createLiteral(description, "en");
         
         Resource voidBase = voidModel.createResource(webpage);
         Resource identifiersOrg = voidModel.createResource(publisher);
         Resource wpHomeBase = voidModel.createResource(webpage);
         Resource authorResource = voidModel.createResource(userName);
         //Resource apiResource = voidModel.createResource("http://www.wikipathways.org/wpi/webservice/webservice.php");
         Resource mainDatadump = voidModel.createResource(downloadFrom);
         Resource license = voidModel.createResource(licence);
         //Resource instituteResource = voidModel.createResource("http://dbpedia.org/page/Maastricht_University");
         Resource sparqlEndpointLoc = voidModel.createResource(sparqlEndpoint);
         Resource versionUsed = voidModel.createResource(version);
         Resource prevVersion = voidModel.createResource(previousVersion);
         Resource updateFrequencyDef = voidModel.createResource(updateFrequency);
         
         voidBase.addProperty(RDF.type, Void.Dataset);
         voidBase.addProperty(DCTerms.title, titleLiteral);
         voidBase.addProperty(DCTerms.description, descriptionLiteral);
         voidBase.addProperty(FOAF.homepage, wpHomeBase);
         voidBase.addProperty(DCTerms.license, license);
         
         voidBase.addProperty(Void.sparqlEndpoint, sparqlEndpointLoc);
         voidBase.addProperty(Pav.version, versionUsed);
         voidBase.addProperty(Pav.previousVersion, prevVersion);
         voidBase.addProperty(DCTerms.accrualPeriodicity, updateFrequencyDef);
         
         voidBase.addProperty(Void.uriSpace, voidBase);
         voidBase.addProperty(Void.uriSpace, identifiersOrg);
         voidBase.addProperty(Pav.importedBy, authorResource);
        // voidBase.addProperty(Pav.importedFrom, apiResource);
         voidBase.addProperty(Pav.importedOn, nowLiteral);
         voidBase.addProperty(Void.dataDump, mainDatadump);
         voidBase.addProperty(Voag.frequencyOfChange, Freq.Irregular);
         voidBase.addProperty(Pav.createdBy, authorResource);
        // voidBase.addProperty(Pav.createdAt, instituteResource);                 
         voidBase.addLiteral(Pav.createdOn, nowLiteral);
         //voidBase.addProperty(Void.exampleResource, voidModel.createResource("http://identifiers.org/ncbigene/2678"));
     
         //voidBase.addProperty(Void.vocabulary, FOAF.NAMESPACE);
         //voidBase.addProperty(Void.vocabulary, Pav.NAMESPACE);
         
         
         try
         {
        	 output = File.createTempFile("void", ".tmp"); 
     	    BufferedWriter bw = new BufferedWriter(new FileWriter(output));
     	    System.out.println("Temp file : " + output.getAbsolutePath());
     	    voidModel.write(bw,  "TURTLE");
     	    bw.close();
     	    System.out.println("Done");
     	 }
         catch(IOException e){e.printStackTrace();}
	}
	
	public String getVoid(){
		String outputString ="";
		try { 
			BufferedReader read = new BufferedReader( new FileReader(output) ); 
			String line; 
			while ((line = read.readLine()) != null){ 
				outputString += (line + '\n');
			} 
		} catch (FileNotFoundException e) { 
			e.printStackTrace(); 
		} catch (IOException e) {
			System.out.println("IOException --> Something went wrong with file");
			e.printStackTrace();
		} 
		return outputString;
	}
	
}
