package editor.domain;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.HashMap;
import java.util.Map;

import com.hp.hpl.jena.rdf.model.*;
import editor.ontologies.DCAT;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.openrdf.rio.RDFHandlerException;
import org.openrdf.rio.RDFParseException;

import com.hp.hpl.jena.sparql.vocabulary.FOAF;

import editor.ontologies.Pav;
import editor.validator.RdfChecker;

/**
 * This class handles the VoID uploaded by the users.
 * <p>It creates HashMaps of information needed (subjects) in the RDF, loops through the structure of the RDF
 * to extract all information and finally returns a JSON Object containing on the information acquired to be passed to the UI side.</p>
 *
 * @author Lefteris Tatakis
 */
public class VoidUpload {

    private String importedFromSource = "http://purl.org/pav/importedFrom";
    private String authoredBy = "http://purl.org/pav/authoredBy";
    private String contributedBy = "http://purl.org/pav/contributedBy";
    private String curatedBy = "http://purl.org/pav/curatedBy";
    private String distribution = "http://www.w3.org/ns/dcat#Distribution";
    private File importedFile;

    private VoidAttributes attributes = new VoidAttributes();
    private Map<String, Object> mainDatasetSubjects = new HashMap<String, Object>();
    private Map<String, String> sourceDatasetSubjects = new HashMap<String, String>();
    private Map<String, String> contrDatasetSubjects = new HashMap<String, String>();
    private Map<String, String> distributionDatasetSubjects = new HashMap<String, String>();
    private JSONObject result;

    /**
     * Initialises the HashMaps and processes the input stream (file).
     *
     * @param uploadedInputStream An input stream provided by the UI, which represents the uploaded VoID file the user wants parsing.
     * @throws RDFParseException
     * @throws RDFHandlerException
     */
    public VoidUpload(InputStream uploadedInputStream) throws RDFParseException, RDFHandlerException {
        importedFile = writeToTempFile(uploadedInputStream);
        result = new JSONObject();
        createSubjectMap();
        createSourceMap();
        createContributorMap();
        createDistributionMap();
        processVoid();
        importedFile.delete();
    }

    /**
     * The main processing power of the class. Extracts all info needed.
     *
     * @throws RDFParseException
     * @throws RDFHandlerException
     */
    private void processVoid() throws RDFParseException, RDFHandlerException {
        //Check that the inputted RDF is correct and not an MP3 file(example).
        checkRDF();

        Model model = ModelFactory.createDefaultModel();
        String path = importedFile.getAbsolutePath();
        model.read(path, "TURTLE");
        Resource mainResourse = null;

        // Allows this class to run on Linux and Windows machines.
        String OS = System.getProperty("os.name").toLowerCase();
        if (OS.indexOf("win") >= 0) {
            mainResourse = model.getResource(path);
        } else {
            mainResourse = model.getResource("file://" + path);
        }
        /**
         * Get createdBy information. (Name, Surname, Email, Orcid).
         */
        Resource createdBy = mainResourse.getProperty(Pav.createdBy).getResource();
        if (createdBy.hasProperty(FOAF.family_name))
            result.put("familyName", createdBy.getProperty(FOAF.family_name).getString());
        if (createdBy.hasProperty(FOAF.givenname))
            result.put("givenName", createdBy.getProperty(FOAF.givenname).getString());
        if (createdBy.hasProperty(FOAF.mbox))
            result.put("userEmail", createdBy.getProperty(FOAF.mbox).getResource().toString().replace("mailto:", ""));

        if (createdBy.getURI().contains("orcid")) {
            String temp = createdBy.getURI().replace("http://orcid.org/", "");
            result.put("ORCID", temp);
        }

        //Get primary topic and iterate
        if (!mainResourse.hasProperty(FOAF.primaryTopic)) System.err.println("Primary topic is missing..");
        Resource primaryTopic = mainResourse.getProperty(FOAF.primaryTopic).getResource();
        StmtIterator iter = primaryTopic.listProperties();
        boolean doneSources = false;
        boolean doneDistributions = false;
        boolean doneSparqlEndpoint = false;
        boolean doneRDF = false;
        result.put("URI", primaryTopic.toString());

        JSONArray distributions = new JSONArray();
        JSONObject distributionObject = new JSONObject();
        int indexOfRDFDistributionObject = -1;
        /**
         * The 'while' that iterates though the the document.
         */
        while (iter.hasNext()) {
            Statement stmt = iter.nextStatement();  // get next statement
            Property predicate = stmt.getPredicate();   // get the predicate
            /**
             * <p>If - Handles the date extraction into the format needed by the UI. (year, month,date)</p>
             * <p>Else if - loops through sources information.</p>
             * <p>Else if - lopps through contributor information provided. (Name, Surname, Email, Orcid)</p>
             */
            if (mainDatasetSubjects.get(predicate.toString()) != null && predicate.toString().compareTo(importedFromSource) != 0
                    && predicate.toString().compareTo(curatedBy) != 0 && predicate.toString().compareTo(authoredBy) != 0
                    && predicate.toString().compareTo(distribution) != 0
                    && predicate.toString().compareTo(contributedBy) != 0) {

                String objectString = (String) mainDatasetSubjects.get(predicate.toString());
                String value = stmt.getObject().toString().replace("@en", "");
                value = value.replace("^^http://www.w3.org/2001/XMLSchema#int", "");

                if (!objectString.equals("date") && !objectString.equals("dataDump") &&  !objectString.equals("sparqlEndpoint")) {
                    result.put(objectString, value);
                } else if(objectString.equals("dataDump") && !doneRDF) {
                    if (indexOfRDFDistributionObject == -1 && !doneSparqlEndpoint ) {
                        distributionObject.put("URL", value);
                        distributionObject.put("name", "RDF");
                        distributionObject.put("isRDF", true);
                        distributions.add(distributionObject);
                        indexOfRDFDistributionObject = distributions.indexOf(distributionObject);
                    }else{
                        JSONObject tmp = (JSONObject) distributions.get(indexOfRDFDistributionObject);
                        tmp.put("URL", value);
                        distributions.add( indexOfRDFDistributionObject, tmp);
                    }
                    doneRDF =true;
                } else if(objectString.equals("sparqlEndpoint") && !doneSparqlEndpoint) {
                    if (indexOfRDFDistributionObject == -1 && !doneRDF) {
                       distributionObject.put("sparqlEndpoint", value);
                       distributionObject.put("name", "RDF");
                       distributionObject.put("isRDF", true);
                       distributions.add(distributionObject);
                       indexOfRDFDistributionObject = distributions.indexOf(distributionObject);
                    } else{
                       JSONObject tmp = (JSONObject) distributions.get(indexOfRDFDistributionObject);
                       tmp.put("sparqlEndpoint", value);
                       distributions.add( indexOfRDFDistributionObject, tmp);
                    }
                    doneSparqlEndpoint = true;
                } else if(objectString.equals("date")) {
                    value = value.replace("^^http://www.w3.org/2001/XMLSchema#dateTime", "");
                    String[] dateString = value.split("T"); // get first part only that where date is
                    String[] individualDates = dateString[0].split("-");

                    result.put("yearPublish", Integer.parseInt(individualDates[0]));
                    result.put("monthPublish", Integer.parseInt(individualDates[1]));
                    result.put("datePublish", Integer.parseInt(individualDates[2]));
                }

            } else if (predicate.toString().compareTo(importedFromSource) == 0 && !doneSources
                    && predicate.toString().compareTo(curatedBy) != 0 && predicate.toString().compareTo(authoredBy) != 0
                    && predicate.toString().compareTo(distribution) != 0
                    && predicate.toString().compareTo(contributedBy) != 0) {
                //multiple object handling
                StmtIterator sources = primaryTopic.listProperties(Pav.importedFrom); // for each source
                JSONArray sourcesArrayJson = new JSONArray();
                /**
                 * When the property inspected in importedFrom loop through the RDF structure to extract the needed info.
                 */
                while (sources.hasNext()) {

                    Statement sourcesStmt = sources.nextStatement();  // get next statement
                    StmtIterator sourcesResourceItr = sourcesStmt.getResource().listProperties(); // go to each source
                    JSONObject attributeSourcesObjectReference = new JSONObject();

                    while (sourcesResourceItr.hasNext()) { // extract info
                        Statement sourceStmt = sourcesResourceItr.nextStatement();  // get next statement
                        // Check JSON for sources
                        String sourcePredicate = sourceStmt.getPredicate().toString();
                        String sourceObject = sourceStmt.getObject().toString().replace("@en", "");

                        if (sourceDatasetSubjects.get(sourcePredicate) != null) {
                            attributeSourcesObjectReference.put("URI", sourceStmt.getSubject().toString());
                            attributeSourcesObjectReference.put(sourceDatasetSubjects.get(sourcePredicate), sourceObject);
                            // To know if it was a custom Source or a OPS one
                            if (sourceDatasetSubjects.get(sourcePredicate).equals("description") && sourceObject.equals("N/A")) {
                                attributeSourcesObjectReference.put("noURI", false);
                            } else if (sourceDatasetSubjects.get(sourcePredicate).equals("description") && !sourceObject.equals("N/A")) {
                                attributeSourcesObjectReference.put("noURI", true);
                            }
                        }
                    }//while
                    sourcesArrayJson.add(attributeSourcesObjectReference);
                }
                result.put("sources", sourcesArrayJson);
                doneSources = true;

            } else if (predicate.toString().compareTo(distribution) == 0 && !doneDistributions
                    && predicate.toString().compareTo(curatedBy) != 0 && predicate.toString().compareTo(authoredBy) != 0
                    && predicate.toString().compareTo(importedFromSource) != 0
                    && predicate.toString().compareTo(contributedBy) != 0){

                //add the remaining distributions
                StmtIterator distributionsIter = primaryTopic.listProperties(DCAT.distribution); // for each source
                /**
                 * When the property inspected in importedFrom loop through the RDF structure to extract the needed info.
                 */
                while (distributionsIter.hasNext()) {

                    Statement distributionsStmt = distributionsIter.nextStatement();  // get next statement
                    StmtIterator distributionResourceItr = distributionsStmt.getResource().listProperties(); // go to each source
                    JSONObject innderDistributionObject = new JSONObject();

                    while (distributionResourceItr.hasNext()) { // extract info
                        Statement distributionStmt = distributionResourceItr.nextStatement();  // get next statement
                        String distributionPredicate = distributionStmt.getPredicate().toString();
                        String distributionObjectOfInput = distributionStmt.getObject().toString().replace("@en", "");
                        String distributionMapValue = distributionDatasetSubjects.get(distributionPredicate);
                            //{"name": value, "URL": "", "version": "" , "isRDF": true, "sparqlEndpoint":"" }
                        if (distributionMapValue != null) {
                             if (distributionMapValue.contains("mediaType")) {
                                 innderDistributionObject.put("isRDF", false);
                                 innderDistributionObject.put("sparqlEndpoint", "");
                                if (distributionObjectOfInput.contains("text") && distributionObjectOfInput.contains("/")) {
                                    innderDistributionObject.put("name", "Datadump");
                                } else if (distributionObjectOfInput.contains("text/csv")) {
                                    innderDistributionObject.put("name", "CSV");
                                } else if (distributionObjectOfInput.contains("text/sdf")) {
                                    innderDistributionObject.put("name", "SDF");
                                } else if (distributionObjectOfInput.contains("text/tsv")) {
                                    innderDistributionObject.put("name", "TSV");
                                } else if (distributionObjectOfInput.contains("json")) {
                                    innderDistributionObject.put("name", "JSON-LD");
                                } else if (distributionObjectOfInput.contains("text/xml")) {
                                    innderDistributionObject.put("name", "XML");
                                }
                             } else {
                                 innderDistributionObject.put(distributionMapValue, distributionObjectOfInput);
                             }
                        }//if
                    }//while
                    distributions.add(innderDistributionObject);
                }//while
                doneDistributions = true;
            } else if (predicate.toString().compareTo(curatedBy) == 0 || predicate.toString().compareTo(authoredBy) == 0
                    || predicate.toString().compareTo(contributedBy) == 0) {
                /**
                 * A contributor can have multiple instances in the RDF( up to 3 per contributor).
                 */
                Property[] properties = {Pav.authoredBy, Pav.curatedBy, Pav.contributedBy};
                Map<String, String> urisExist = new HashMap<String, String>();
                int id = 0;
                JSONArray contributorsArrayJson = new JSONArray();
                /**
                 * Looping through the RDF data structure of the Constructor node, for each possible role.
                 */
                for (int i = 0; i < properties.length; i++) {
                    StmtIterator sources = primaryTopic.listProperties(properties[i]); // for each source
                    while (sources.hasNext()) {
                        Statement contribStmt = sources.nextStatement();  // get next statement
                        StmtIterator contribResourceItr = contribStmt.getResource().listProperties(); // go to each source
                        JSONObject contribObjectReference = new JSONObject();
                        Statement finalStmt = null;
                        while (contribResourceItr.hasNext()) { // extract info
                            Statement sourceStmt = contribResourceItr.nextStatement();  // get next statement
                            // Check JSON for sources
                            String sourcePredicate = sourceStmt.getPredicate().toString();
                            String sourceObject = sourceStmt.getObject().toString().replace("@en", "");
                            if (contrDatasetSubjects.get(sourcePredicate) != null) {
                                if (contrDatasetSubjects.get(sourcePredicate).equals("name")) {
                                    contribObjectReference.put("name", sourceObject);
                                } else if (contrDatasetSubjects.get(sourcePredicate).equals("surname")) {
                                    contribObjectReference.put("surname", sourceObject);
                                } else if (contrDatasetSubjects.get(sourcePredicate).equals("email")) {
                                    contribObjectReference.put("email", sourceObject.toString().replace("mailto:", ""));
                                } else if (sourceStmt.getSubject().getURI().contains("orcid")) {
                                    String temp = createdBy.getURI().replace("http://orcid.org/", "");
                                    contribObjectReference.put("orcid", temp);
                                }
                            }
                            finalStmt = sourceStmt;
                        }//while

                        contribObjectReference.put("URI", finalStmt.getSubject().getURI());
                        contribObjectReference.put("id", id);

                        if (properties[i].equals(Pav.authoredBy)) contribObjectReference.put("author", true);
                        else contribObjectReference.put("author", false);

                        if (properties[i].equals(Pav.curatedBy)) contribObjectReference.put("curator", true);
                        else contribObjectReference.put("curator", false);

                        if (properties[i].equals(Pav.contributedBy)) contribObjectReference.put("contributor", true);
                        else contribObjectReference.put("contributor", false);

                        if (!urisExist.containsKey(finalStmt.getSubject().getURI())) {

                            contributorsArrayJson.add(contribObjectReference);
                            urisExist.put(finalStmt.getSubject().getURI(), id + "");
                            id++;
                        } else {
                            for (int j = 0; j < contributorsArrayJson.size(); j++) {

                                JSONObject ttmp = (JSONObject) contributorsArrayJson.get(j);
                                if (ttmp.get("URI").equals(finalStmt.getSubject().getURI())) {
                                    if (properties[i].equals(Pav.authoredBy)) ttmp.put("author", true);
                                    if (properties[i].equals(Pav.curatedBy)) ttmp.put("curator", true);
                                    if (properties[i].equals(Pav.contributedBy)) ttmp.put("contributor", true);
                                    contributorsArrayJson.set(j, ttmp);
                                }//if
                            }//for
                        }//else
                    }//while
                    result.put("contributors", contributorsArrayJson);
                }//for
            }//else
        }//while
        //Distributions must be added last because it can be RDF or a nonRDF - and have different processing for each.
        result.put("distributions", distributions);

    }//processVoid

    /**
     * @return The created JSON Object containing all information captured.
     */
    public JSONObject getResult() {
        return result;
    }

    /**
     * Checks if RDF consumed is correct.
     *
     * @throws RDFParseException
     * @throws RDFHandlerException
     */
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

    private void printModel(Model model) {
        StmtIterator iter = model.listStatements();
        printIterator(iter);
    }

    /**
     * Main / Core information regarding dataset.
     * <p>Creates Hash Maps (URI of subject -> Key that will be used ) to allow flexibility and robustness.</p>
     */
    private void createSubjectMap() {
        mainDatasetSubjects.put("http://purl.org/dc/terms/description", "description");
        mainDatasetSubjects.put("http://purl.org/dc/terms/publisher", "publisher");
        mainDatasetSubjects.put("http://www.w3.org/ns/dcat#landingPage", "webpage");
        mainDatasetSubjects.put("http://purl.org/pav/version", "version");
        mainDatasetSubjects.put("http://purl.org/pav/importedFrom", "sources");
        mainDatasetSubjects.put("http://purl.org/dc/terms/license", "licence");
        mainDatasetSubjects.put("http://www.w3.org/ns/dcat#Distribution", "distributions");
        mainDatasetSubjects.put("http://rdfs.org/ns/void#dataDump", "dataDump");
        mainDatasetSubjects.put("http://rdfs.org/ns/void#triples", "totalNumberOfTriples");
        mainDatasetSubjects.put("http://rdfs.org/ns/void#distinctSubjects", "numberOfUniqueSubjects");
        mainDatasetSubjects.put("http://rdfs.org/ns/void#distinctObjects", "numberOfUniqueObjects");
        mainDatasetSubjects.put("http://purl.org/dc/terms/accrualPeriodicity", "updateFrequency");
        mainDatasetSubjects.put("http://purl.org/dc/terms/issued", "date");
        mainDatasetSubjects.put("http://purl.org/dc/terms/title", "title");
        mainDatasetSubjects.put("http://rdfs.org/ns/void#sparqlEndpoint", "sparqlEndpoint");
    }

    /**
     * Source information of dataset.
     * <p>Creates Hash Maps (URI of subject -> Key that will be used ) to allow flexibility and robustness.</p>
     */
    private void createSourceMap() {
        sourceDatasetSubjects.put("http://purl.org/dc/terms/description", "description");
        sourceDatasetSubjects.put("http://purl.org/dc/terms/title", "title");
        sourceDatasetSubjects.put("http://purl.org/pav/version", "version");
        sourceDatasetSubjects.put("http://www.w3.org/ns/dcat#landingPage", "webpage");
    }


    private void createDistributionMap() {
        distributionDatasetSubjects.put("http://purl.org/pav/version", "version");
        distributionDatasetSubjects.put("http://www.w3.org/ns/dcat#downloadURL", "URL");
        distributionDatasetSubjects.put("http://www.w3.org/ns/dcat#mediaType", "mediaType");
    }

    /**
     * Contributor information in the dataset.
     * <p>Creates Hash Maps (URI of subject -> Key that will be used ) to allow flexibility and robustness.</p>
     */
    private void createContributorMap() {
        contrDatasetSubjects.put("http://xmlns.com/foaf/0.1/mbox", "email");
        contrDatasetSubjects.put("http://xmlns.com/foaf/0.1/givenname", "name");
        contrDatasetSubjects.put("http://xmlns.com/foaf/0.1/family_name", "surname");
    }

    /**
     * Printing function to allow debugging - general understanding of input.
     * @param iter
     */
    private void printIterator(StmtIterator iter) {
        while (iter.hasNext()) {
            Statement stmt = iter.nextStatement();  // get next statement
            Resource subject = stmt.getSubject();     // get the subject
            Property predicate = stmt.getPredicate();   // get the predicate
            RDFNode object = stmt.getObject();      // get the object

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
     * @param uploadedInputStream
     * @return A temporary file to be processed.
     */
    private File writeToTempFile(InputStream uploadedInputStream) {
        File fileOutput = null;
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
        } finally {
            try {
                out.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        if (fileOutput == null) System.err.println("File did not write!!!");
        return fileOutput;
    }
}
