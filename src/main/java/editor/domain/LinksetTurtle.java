package editor.domain;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.util.*;

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
import com.hp.hpl.jena.vocabulary.RDF;
import com.hp.hpl.jena.vocabulary.RDFS;
import com.hp.hpl.jena.vocabulary.XSD;

import editor.ontologies.BDB;
import editor.ontologies.DCAT;
import editor.ontologies.Freq;
import editor.ontologies.Pav;
import editor.ontologies.Prov;
import editor.ontologies.Void;

/**
 * Main class for the creation of the VoID file for the Linkset descriptions.
 * The data is provided from that browser side of the project(specified in the LinksetAttributes).
 *  The outputed VoID of this program complies to the
 *  <a href="http://www.openphacts.org/specs/2013/WD-datadesc-20130912/" target="_blank">OPS Dataset Description Specification</a>.
 * This java class is based on work of Andra Waagmeester.
 *
 * @since 19/06/2014
 * @author Lefteris Tatakis
 * @see editor.domain.LinksetAttributes
 */
@XmlRootElement
public class LinksetTurtle {
    /**
     * All the variables here correspond to the inputs from the user.
     */
	private String givenName ;	
	private String familyName;	
    private String userEmail;
    private String title ="";
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
    private String version;
    private String previousVersion;
    private String updateFrequency;
    private ArrayList contributors = null;
	private LinkedHashMap userTarget =null;
	private LinkedHashMap userSource =null;
	private String assertionMethod = "";
	private String subjectDatatype = "";
	private String targetDatatype = "";
    private String contributor ="";
    private String curator ="";
    private String author ="";

	private HashMap<String, String> justificationDataset  = new HashMap<String, String>();
    private Resource voidBase;
    private Model voidModel;
    private String referenceURL ="http://voideditor.cs.man.ac.uk/";

	/**
     * Takes in the parameters provided by the user and starts the process of the VoID creation.
	 * @param obj This object provides all data extracted from Angular side.
	 */
	public LinksetTurtle(LinksetAttributes obj){
		this.givenName = obj.givenName;
		this.familyName= obj.familyName ;
		this.userEmail = obj.userEmail;
		this.description = obj.description ; 
		this.publisher = obj.publisher;
	    this.licence = obj.licence;
	    this.downloadFrom = obj.downloadFrom;
	    this.URI = obj.URI;
	    this.ORCID = obj.ORCID;
	    this.relationship = obj.relationship;
	    this.justification = obj.justification;
	    this.userTarget = (LinkedHashMap) obj.userTarget;
	    this.userSource = (LinkedHashMap) obj.userSource;
	    this.assertionMethod = obj.assertionMethod;
	    this.subjectDatatype = obj.subjectDatatype;
	    this.targetDatatype = obj.targetDatatype;
        this.contributors = (ArrayList) obj.contributors;
        this.contributor =obj.contributor;
        this.curator =obj.curator;
        this.author =obj.author ;
        this.version = obj.version;
        this.previousVersion = obj.previousVersion;
        this.updateFrequency = obj.updateFrequency;

	    if (obj.datePublish.equals("N/A")){
	    	this.setDatePublish(1) ;
	    }else {
	    	this.setDatePublish(Integer.parseInt(obj.datePublish));
	    }
	    
	    this.setMonthPublish(Integer.parseInt(obj.monthPublish));
	    this.setYearPublish(Integer.parseInt(obj.yearPublish));
	    
	    createJustificationMap();
	}
	
	
	/**
	 * Using data from the constructor it creates the Linkset VoID .
     *
	 * @throws IOException
	 * @throws RDFHandlerException 
	 * @throws RDFParseException 
	 */
	public void createVoid() throws RDFParseException, RDFHandlerException, IOException{
		
		 voidModel = ModelFactory.createDefaultModel();
		 voidModel.setNsPrefix("xsd", XSD.getURI());
         voidModel.setNsPrefix("void", Void.getURI());
         voidModel.setNsPrefix("pav", Pav.getURI());
         voidModel.setNsPrefix("prov", Prov.getURI());
         voidModel.setNsPrefix("dcterms", DCTerms.getURI());
         voidModel.setNsPrefix("foaf", FOAF.getURI());
         voidModel.setNsPrefix("freq", Freq.getURI());
         voidModel.setNsPrefix("dc", DC.getURI());
         voidModel.setNsPrefix("dcat", DCAT.getURI());
         voidModel.setNsPrefix("bdb", BDB.getURI());
         voidModel.setNsPrefix("rdfs", RDFS.getURI());
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
         //Creating the appropriate title
         if (userSource.get("URI") !=null && userTarget.get("URI")!=null && title==null ){
        	 title =  userSource.get("title")+ "-"+ justificationDataset.get(justification) + "-"+ userTarget.get("title");
         }else if (userSource.get("title") !=null &&title==null   ){
        	 title =  userSource.get("title")+ "-"+justificationDataset.get(justification) + "-"+ "";
         }else if( userTarget.get("URI")!=null && title==null ){
        	 title =  "source"+ "-"+justificationDataset.get(justification) + "-"+ userTarget.get("title");
         }else if( title==null){
        	 title =  "source"+ "-"+justificationDataset.get(justification) + "-"+ "target";
         }

         titleLiteral = voidModel.createLiteral(title, "en");
         Literal descriptionLiteral;
         if (title=="" ) {
        	 descriptionLiteral = voidModel.createLiteral("-", "en");
         }else{
        	 descriptionLiteral = voidModel.createLiteral(description, "en");
         }
         //initial data
         if (URI.equalsIgnoreCase("http://www.openphacts.org/")){
        	 URI = URI + UUID.randomUUID();
         }
         
         voidBase = voidModel.createResource(URI);
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
         //The contributotions of this user
         //The contributotions of this user
         if (curator.contains("true")) {
            voidBase.addProperty(Pav.curatedBy, resourceForPerson);
         }
         if (contributor.contains("true")) {
            voidBase.addProperty(Pav.contributedBy, resourceForPerson);
         }
         if (author.contains("true")) {
            voidBase.addProperty(Pav.authoredBy, resourceForPerson);
         }

         //Dataset void - conditional
         if (publisher !=""){
        	 Resource identifiersOrg = voidModel.createResource(publisher);
        	 voidBase.addProperty(DCTerms.publisher, identifiersOrg);
         }
        
         if (downloadFrom !=""){
        	   Resource mainDatadump = voidModel.createResource(downloadFrom);
        	   voidBase.addProperty(Void.dataDump, mainDatadump);
         }

         if (version != "") {
            Literal versionUsed = voidModel.createLiteral(version);
            voidBase.addProperty(Pav.version, versionUsed);
         }

         if (previousVersion != "") {
            Resource prevVersion = voidModel.createResource(previousVersion);
            voidBase.addProperty(Pav.previousVersion, prevVersion);
         }

         if (updateFrequency != "") {
            Literal updateFrequencyDef = voidModel.createLiteral(updateFrequency);
            voidBase.addProperty(DCTerms.accrualPeriodicity, updateFrequencyDef);
         }


        if (licence !="" && !licence.contains("N/A")){
        	 Resource license = voidModel.createResource(licence);
        	 voidBase.addProperty(DCTerms.license, license);
        }else if (licence.contains("N/A")){
        	 //:dataset dct:license [ rdfs:label "unknown" ];
        	 voidBase.addProperty(DCTerms.license, voidModel.createResource().addProperty(RDFS.label , "unknown"));
        }
         
        if (relationship !="" ){
        	 Resource relationshipR = voidModel.createResource(relationship);
        	 voidBase.addProperty(Void.linkPredicate, relationshipR);
        }

        if (contributors != null) {
            additionOfContributorInformationToVoID();
        }//if

         if (userSource !=null && userSource.get("URI") != null ){
	        Resource userSourceR = voidModel.createResource((userSource.get("URI")).toString());
	        voidBase.addProperty(Void.subjectsTarget, userSourceR);    
         } else if (userSource !=null && userSource.get("_about") != null){
        	 Resource userSourceR = voidModel.createResource((userSource.get("_about")).toString());
 	        voidBase.addProperty(Void.subjectsTarget, userSourceR);  
         }

         if(assertionMethod!=""){
        	 Resource assertionMethodRersource = voidModel.createResource(assertionMethod);
        	 voidBase.addProperty( BDB.assertionMethod, assertionMethodRersource);
         }
         
         if(targetDatatype!=""){
        	 Resource targetDatatypeRersource = voidModel.createResource(targetDatatype);
        	 voidBase.addProperty( BDB.targetDatatype, targetDatatypeRersource);
         }
         
         if(subjectDatatype!=""){
        	 Resource subjectDatatypeRersource = voidModel.createResource(subjectDatatype);
        	 voidBase.addProperty( BDB.subjectDatatype, subjectDatatypeRersource);
         }
         
         if (userTarget != null  && userTarget.get("URI")!=null){
        	 Resource userTargetR = voidModel.createResource((userTarget.get("URI")).toString());
        	 voidBase.addProperty(Void.objectsTarget, userTargetR);
         }else if (userTarget !=null && userTarget.get("_about") != null){
        	 Resource userTargetR = voidModel.createResource((userTarget.get("_about")).toString());
        	 voidBase.addProperty(Void.objectsTarget, userTargetR);  
         }
         
         if (justification !="" ){
        	 Resource justificationR = voidModel.createResource(justification);
        	 voidBase.addProperty(BDB.linksetJustification, justificationR);
         }
         
         BufferedWriter bw = null;
         try
         {
        	output = File.createTempFile("linksetVoid", ".ttl"); 
     	    bw = new BufferedWriter(new FileWriter(output));
     	    //System.out.println("Temp file : " + output.getAbsolutePath());
     	    voidModel.write(bw,  "TURTLE");
     	    System.out.println("Done");
     	 }
         catch(IOException e){e.printStackTrace();}
         finally { try {bw.close();} catch (IOException e) {e.printStackTrace();}
         }
         
	}
    /**
     *  Creating the structure needed for of the contributors.
     */
    private void additionOfContributorInformationToVoID(){

        for (int i = 0; i < contributors.size(); i++) {
            String tmpValue = contributors.get(i).toString();
            String[] splitingSetsOfInfo = tmpValue.split(","); // for example { var = val , var2 = val }

            String tmpOrcid = "";
            Literal contributorGivenNameLiteral = null;
            Literal tmpSurname = null;
            Resource contributorEmailResource = null;

            String tmpCurator = "false";
            String tmpAuthor = "false";
            String tmpContributedBy = "false";

            Resource source = null;
            for (int j = 0; j < splitingSetsOfInfo.length; j++) {
                String[] couple = splitingSetsOfInfo[j].split("=");
                String property2Check = couple[0];
                if (couple.length > 1) {
                    String value = couple[1].replace("}", "");

                    if (property2Check.contains("name") && !property2Check.contains("sur") && value != "-") {
                        contributorGivenNameLiteral = voidModel.createLiteral(value);
                    } else if ((property2Check.contains("surname") && value != "-")) {
                        tmpSurname = voidModel.createLiteral(value);
                    } else if ((property2Check.contains("orcid") && value != "-")) {
                        tmpOrcid = value;
                    } else if ((property2Check.contains("email") && value != "-")) {
                        contributorEmailResource = voidModel.createResource("mailto:" + value);
                    } else if ((property2Check.contains("curator"))) {
                        tmpCurator = value;
                    } else if ((property2Check.contains("author"))) {
                        tmpAuthor = value;
                    } else if ((property2Check.contains("contributor"))) {
                        tmpContributedBy = value;
                    } else {
                        System.out.println("Something escaped = >" + value);
                    }
                }//if
            }//for
            String URI4Contributor = "";
            if (tmpOrcid == null || tmpOrcid == ""|| tmpOrcid == "-") {
                URI4Contributor = referenceURL + UUID.randomUUID();
            } else {
                URI4Contributor = "http://orcid.org/" + tmpOrcid;
            }

            Resource resourceForContributor = voidModel.createResource(URI4Contributor);
            resourceForContributor.addProperty(RDF.type, FOAF.Person);

            if (contributorGivenNameLiteral != null)
                resourceForContributor.addProperty(FOAF.givenname, contributorGivenNameLiteral);

            if (tmpSurname != null) resourceForContributor.addProperty(FOAF.family_name, tmpSurname);

            if (contributorEmailResource != null)
                resourceForContributor.addProperty(FOAF.mbox, contributorEmailResource);
            if (tmpCurator.contains("true")) {
                voidBase.addProperty(Pav.curatedBy, resourceForContributor);
            }
            if (tmpContributedBy.contains("true")) {
                voidBase.addProperty(Pav.contributedBy, resourceForContributor);
            }
            if (tmpAuthor.contains("true")) {
                voidBase.addProperty(Pav.authoredBy, resourceForContributor);
            }
        }//for
    }

    /**
     * A mapping function to help find the appropriate value for the information which is returned from the user side.
     */
     private void createJustificationMap(){
		justificationDataset.put("http://semanticscience.org/resource/SIO_010004", "Chemical entity");
 		justificationDataset.put("http://semanticscience.org/resource/CHEMINF_000480", "Has component with uncharged counterpart");
 		justificationDataset.put("http://semanticscience.org/resource/CHEMINF_000486", "Has major tautomer at pH 7.4");
 		justificationDataset.put("http://semanticscience.org/resource/CHEMINF_000458", "Has OPS normalized counterpart");
 		justificationDataset.put("http://purl.obolibrary.org/obo#has_part", "Has part");
 		justificationDataset.put("http://semanticscience.org/resource/CHEMINF_000456", "Has stereoundefined parent");
 		justificationDataset.put("http://semanticscience.org/resource/CHEMINF_000460", "Has uncharged counterpart");
 		justificationDataset.put("http://semanticscience.org/resource/CHEMINF_000059", "InChI Key");
 		justificationDataset.put("http://purl.obolibrary.org/obo#is_tautomer_of", "Is tautomer of");
 	}

    /**
     * A quality control function to test if output is valid.
     * @return The VoID created in a String.
     */
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

    /**
     * @return The location of the temporary VoID Linkset file created.
     */
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
