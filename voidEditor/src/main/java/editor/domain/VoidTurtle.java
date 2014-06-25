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

import uk.ac.manchester.cs.datadesc.validator.rdftools.VoidValidatorException;

import com.hp.hpl.jena.rdf.model.Literal;
import com.hp.hpl.jena.rdf.model.Model;
import com.hp.hpl.jena.rdf.model.ModelFactory;
import com.hp.hpl.jena.rdf.model.Resource;
import com.hp.hpl.jena.sparql.vocabulary.FOAF;
import com.hp.hpl.jena.vocabulary.DC;
import com.hp.hpl.jena.vocabulary.DCTerms;
import com.hp.hpl.jena.vocabulary.DCTypes;
import com.hp.hpl.jena.vocabulary.RDF;
import com.hp.hpl.jena.vocabulary.RDFS;
import com.hp.hpl.jena.vocabulary.XSD;

import editor.ontologies.DCAT;
import editor.ontologies.Freq;
import editor.ontologies.Pav;
import editor.ontologies.Prov;
import editor.ontologies.Void;
import editor.validator.RdfChecker;
import editor.validator.Validator;

/**
 * Main class for the creation of the VoID file for the dataset descriptions.
 * The data is provided from that browser side of the project(specified in the voidAttributes).
 * This java class is based on work of Andra Waagmeester.
 *
 * @author Lefteris Tatakis
 */

@XmlRootElement
public class VoidTurtle {

    private String givenName;
    private String familyName;
    private String userEmail;
    private String title;
    private String description;
    private String publisher;
    private int datePublish;
    private int monthPublish;
    private int yearPublish;
    private String webpage;
    private String licence;
    private String downloadFrom;
    private String sparqlEndpoint;
    private String version;
    private String previousVersion;
    private String updateFrequency;
    private File output = null;
    private ArrayList sources = null;
    private ArrayList contributors = null;
    private String URI;
    private String totalNumberOfTriples = "";
    private String numberOfUniqueSubjects = "";
    private String numberOfUniqueObjects = "";
    private String ORCID = "";
    private String datasetType = "";

    private Validator validator = null;

    /**
     * Retrieves all variables from the passed VoidAttributes object. Sets all appropriate variable values.
     * @param obj This object provides all data extracted from Angular side.
     */
    public VoidTurtle(VoidAttributes obj) {
        this.givenName = obj.givenName;
        this.familyName = obj.familyName;
        this.userEmail = obj.userEmail;
        this.title = obj.title;
        this.description = obj.description;
        this.publisher = obj.publisher;
        this.webpage = obj.webpage;
        this.licence = obj.licence;
        this.downloadFrom = obj.downloadFrom;
        this.sparqlEndpoint = obj.sparqlEndpoint;
        this.version = obj.version;
        this.previousVersion = obj.previousVersion;
        this.updateFrequency = obj.updateFrequency;
        this.sources = (ArrayList) obj.sources;
        this.URI = obj.URI;
        this.totalNumberOfTriples = obj.totalNumberOfTriples;
        this.numberOfUniqueSubjects = obj.numberOfUniqueSubjects;
        this.numberOfUniqueObjects = obj.numberOfUniqueObjects;
        this.ORCID = obj.ORCID;
        this.contributors = (ArrayList) obj.contributors;
        this.datasetType = obj.datasetType;

        if (obj.datePublish.equals("N/A")) {
            this.setDatePublish(1);
        } else {
            this.setDatePublish(Integer.parseInt(obj.datePublish));
        }
        this.setMonthPublish(Integer.parseInt(obj.monthPublish));
        this.setYearPublish(Integer.parseInt(obj.yearPublish));
    }

    /**
     * Using data from the constructor it creates the VoID dataset description.
     *
     * @throws VoidValidatorException
     * @throws IOException
     * @throws RDFHandlerException
     * @throws RDFParseException
     */
    public void createVoid() throws VoidValidatorException, RDFParseException, RDFHandlerException, IOException {
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
        voidModel.setNsPrefix("dctypes", DCTypes.getURI());
        voidModel.setNsPrefix("rdfs", RDFS.getURI());
        voidModel.setNsPrefix("", "#");

        //Populate void.ttl
        //Dataset Description info
        Resource voidDescriptionBase = voidModel.createResource("");
        Literal titleDescriptionLiteral = voidModel.createLiteral("VoID Description", "en");
        Literal descriptionDescriptionLiteral = voidModel.createLiteral("The VoID description for the RDF representation of this dataset.", "en");
        Calendar now = Calendar.getInstance();
        Literal nowDescriptionLiteral = voidModel.createTypedLiteral(now);
        Literal issueDescriptionLiteral = voidModel.createTypedLiteral(now);

        Literal createdByGivenNameLiteral = voidModel.createLiteral(givenName);
        Literal createdByFamilyNameLiteral = voidModel.createLiteral(familyName);
        Resource createdByEmailResource = voidModel.createResource("mailto:" + userEmail);
        Resource createdWith = voidModel.createResource("http://voideditor.cs.man.ac.uk/");

        Calendar publishmentDate = Calendar.getInstance();
        publishmentDate.set(getYearPublish(), getMonthPublish() - 1, getDatePublish(), 0, 0, 0);
        Literal publishmentLiteral = voidModel.createTypedLiteral(publishmentDate);
        Literal titleLiteral;
        if (title == "") {
            titleLiteral = voidModel.createLiteral("-", "en");
        } else {
            titleLiteral = voidModel.createLiteral(title, "en");
        }

        Literal descriptionLiteral;
        if (title == "") {
            descriptionLiteral = voidModel.createLiteral("-", "en");
        } else {
            descriptionLiteral = voidModel.createLiteral(description, "en");
        }
        //initial data
        if (URI.equalsIgnoreCase("http://www.openphacts.org/")) {
            URI = URI + UUID.randomUUID();
        }

        Resource voidBase = voidModel.createResource(URI);
        if (datasetType != "" && !datasetType.contains("Not")) {
            voidBase.addProperty(RDF.type, Void.Dataset);
        } else {
            voidBase.addProperty(RDF.type, DCTypes.Dataset);
        }

        voidBase.addProperty(DCTerms.title, titleLiteral);
        voidBase.addProperty(DCTerms.description, descriptionLiteral);
        voidBase.addProperty(DCTerms.issued, publishmentLiteral);

        // Creation of void
        voidDescriptionBase.addProperty(RDF.type, Void.DatasetDescription);
        voidDescriptionBase.addProperty(DCTerms.title, titleDescriptionLiteral);
        voidDescriptionBase.addProperty(DCTerms.description, descriptionDescriptionLiteral);
        voidDescriptionBase.addProperty(DCTerms.issued, issueDescriptionLiteral);
        String URI4Person = "";
        if (this.ORCID == null || this.ORCID == "") {
            URI4Person = "http://voideditor.cs.man.ac.uk/" + UUID.randomUUID();
        } else {
            URI4Person = "http://orcid.org/" + this.ORCID;
        }
        Resource resourceForPerson = voidModel.createResource(URI4Person);
        voidDescriptionBase.addProperty(Pav.createdBy, resourceForPerson);
        resourceForPerson.addProperty(RDF.type, FOAF.Person);
        resourceForPerson.addProperty(FOAF.givenname, createdByGivenNameLiteral);
        resourceForPerson.addProperty(FOAF.family_name, createdByFamilyNameLiteral);
        resourceForPerson.addProperty(FOAF.mbox, createdByEmailResource);

        voidDescriptionBase.addProperty(Pav.createdWith, createdWith);

        voidDescriptionBase.addLiteral(Pav.createdOn, nowDescriptionLiteral);
        voidDescriptionBase.addProperty(FOAF.primaryTopic, voidBase);

        //Dataset void - conditional
        if (publisher != "") {
            Resource identifiersOrg = voidModel.createResource(publisher);
            voidBase.addProperty(DCTerms.publisher, identifiersOrg);
        }

        if (webpage != "") {
            Resource landingPage = voidModel.createResource(webpage);
            voidBase.addProperty(DCAT.landingPage, landingPage);
        }

        if (downloadFrom != "" && !datasetType.contains("Not")) {
            Resource mainDatadump = voidModel.createResource(downloadFrom);
            voidBase.addProperty(Void.dataDump, mainDatadump);
        } else if (downloadFrom != "") {
            Resource distribution = voidModel.createResource(downloadFrom);
            voidBase.addProperty(DCAT.distribution, distribution);
        }

        if (licence != "" && !licence.contains("N/A")) {
            Resource license = voidModel.createResource(licence);
            voidBase.addProperty(DCTerms.license, license);
        } else if (licence.contains("N/A")) {
            //:dataset dct:license [ rdfs:label "unknown" ];
            voidBase.addProperty(DCTerms.license, voidModel.createResource().addProperty(RDFS.label, "unknown"));
        }

        if (sparqlEndpoint != "") {
            Resource sparqlEndpointLoc = voidModel.createResource(sparqlEndpoint);
            voidBase.addProperty(Void.sparqlEndpoint, sparqlEndpointLoc);
        }
        if (version != "") {
            Literal versionUsed = voidModel.createLiteral(version);
            voidBase.addProperty(Pav.version, versionUsed);
        }

        if (previousVersion != "") { // Will validator allow it?
            Resource prevVersion = voidModel.createResource(previousVersion);
            voidBase.addProperty(Pav.previousVersion, prevVersion);
        }

        if (updateFrequency != "") {
            Literal updateFrequencyDef = voidModel.createLiteral(updateFrequency);
            voidBase.addProperty(DCTerms.accrualPeriodicity, updateFrequencyDef);
        }

        if (totalNumberOfTriples != "" && totalNumberOfTriples != null) {
            Literal totalNumberOfTriplesDef = voidModel.createTypedLiteral(new Integer(totalNumberOfTriples));
            voidBase.addProperty(Void.triples, totalNumberOfTriplesDef);
        }

        if (numberOfUniqueSubjects != "" && numberOfUniqueSubjects != null) {
            Literal numberOfUniqueSubjectsDef = voidModel.createTypedLiteral(new Integer(numberOfUniqueSubjects));
            voidBase.addProperty(Void.distinctSubjects, numberOfUniqueSubjectsDef);
        }

        if (numberOfUniqueObjects != "" && numberOfUniqueObjects != null) {
            Literal numberOfUniquePredicatesDef = voidModel.createTypedLiteral(new Integer(numberOfUniqueObjects));
            voidBase.addProperty(Void.distinctObjects, numberOfUniquePredicatesDef);
        }


        if (contributors != null) {
            /**
             * Creating the structure needed for of the contributors.
             */
            for (int i = 0; i < contributors.size(); i++) {
                String tmpValue = contributors.get(i).toString();
                System.out.println(tmpValue);
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
                if (this.ORCID == null || this.ORCID == "") {
                    URI4Contributor = "http://voideditor.cs.man.ac.uk/" + UUID.randomUUID();
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
        }//if
        /**
         *  Extracts data from datasources which the user provides.
         */
        if (sources != null) {
            for (int i = 0; i < sources.size(); i++) {
                // Sources provided in wierd format - so manually do parsing.
                String tmpValue = sources.get(i).toString();
                System.out.println(tmpValue);
                String[] splitingSetsOfInfo = tmpValue.split(","); // for example { var = val , var2 = val }

                Resource source = null;

                // Extract source URI first to be able to create the correct structure in the void.
                for (int j = 0; j < splitingSetsOfInfo.length; j++) {
                    String[] couple = splitingSetsOfInfo[j].split("=");
                    String property2Check = couple[0];
                    String value = couple[1].replace("}", "");
                    if (property2Check.contains("URI") && !property2Check.contains("no")) {
                        source = voidModel.createResource(value);
                        voidBase.addProperty(Pav.importedFrom, source);
                    }
                }

                for (int j = 0; j < splitingSetsOfInfo.length; j++) {
                    String[] couple = splitingSetsOfInfo[j].split("=");
                    String property2Check = couple[0];
                    String value = couple[1].replace("}", "");
                    if (property2Check.contains("type")) {
                        System.out.println("IN TYPE ====>");
                        System.out.println(value);
                        if (value.contains("0")) {
                            source.addProperty(RDF.type, DCTypes.Dataset);
                        } else {
                            source.addProperty(RDF.type, Void.Dataset);
                        }
                    } else if (property2Check.contains("title")) {
                        Literal titleLiteralTmp = voidModel.createLiteral(value, "en");
                        source.addProperty(DCTerms.title, titleLiteralTmp);
                    } else if (property2Check.contains("version")) {
                        Literal versionLiteralTmp = voidModel.createLiteral(value, "en");
                        source.addProperty(Pav.version, versionLiteralTmp);
                    } else if (property2Check.contains("webpage")) {
                        Resource webpageResourceTmp = voidModel.createResource(value);
                        source.addProperty(DCAT.landingPage, webpageResourceTmp);
                    } else if (property2Check.contains("description")) {
                        Literal descriptionLiteralTmp = voidModel.createLiteral(value, "en");
                        source.addProperty(DCTerms.description, descriptionLiteralTmp);
                    }
                }//for
            }//for
        }//if

        BufferedWriter bw = null;
        try {
            output = File.createTempFile("void", ".ttl");
            bw = new BufferedWriter(new FileWriter(output));
            System.out.println("Temp file : " + output.getAbsolutePath());
            voidModel.write(bw, "TURTLE");
            System.out.println("Done");
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            try {
                bw.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        checkRDF();

        validateRDFForOPS();
    }

    /**
     * Validating the RDF against the RDF spec found at <a href="http://www.openphacts.org/specs/2013/WD-datadesc-20130912/" > OPS specification</a>.
     *
     * @throws VoidValidatorException
     */
    private void validateRDFForOPS() throws VoidValidatorException {

        try {
            validator = new Validator(output);
        } catch (VoidValidatorException e) {
            System.err.println("Got a VoidValidatorException!! ");
            e.printStackTrace();
            throw new VoidValidatorException("The editor created a not valid file - please contact Lefteris.");
        }
        if (!validator.passedTests())
            throw new VoidValidatorException("The editor created a not valid file - please contact Lefteris.");
    }

    /**
     * Checks if the RDF produced in correct.
     *
     * @throws RDFParseException
     * @throws RDFHandlerException
     * @throws IOException
     */
    private void checkRDF() throws RDFParseException, RDFHandlerException, IOException {
        RdfChecker checker = new RdfChecker();
        try {
            checker.check(output);
        } catch (RDFParseException e) {
            e.printStackTrace();
            throw new RDFParseException("The editor created a wrong file - please contact Lefteris.");
        } catch (RDFHandlerException e) {
            e.printStackTrace();
            throw new RDFHandlerException("The editor handled a wrong file - please contact Lefteris.");
        } catch (IOException e) {
            e.printStackTrace();
            throw new IOException("The editor could not find the file - please contact Lefteris.");
        }
    }

    /**
     * <p>Return the VoID created in a string format.</p>
     * Used  the "Under the Hood" modal.
     *
     * @return VoID created in a String.
     */
    public String getVoid() {
        String outputString = "";
        BufferedReader read = null;
        try {
            read = new BufferedReader(new FileReader(output));
            String line;
            while ((line = read.readLine()) != null) {
                outputString += (line + '\n');
            }
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            System.out.println("IOException --> Something went wrong with file");
            e.printStackTrace();
        } finally {
            try {
                read.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        output.delete();

        return outputString;
    }

    /**
     * @return The result the OPS validator produces for the VoID file created.
     */
    public String getValidationResults() {
        return validator.showResult();
    }

    /**
     * @return Location of the temporary file containing the VoID.
     */
    public String getLocation() {
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
