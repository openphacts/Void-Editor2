package editor.service;

import java.io.IOException;
import java.io.InputStream;

import editor.domain.*;

import org.json.simple.JSONObject;
import org.openrdf.rio.RDFHandlerException;
import org.openrdf.rio.RDFParseException;

import uk.ac.manchester.cs.datadesc.validator.rdftools.VoidValidatorException;
import editor.rest.VoidRestService;
/**
 * Provides the {@link VoidRestService} with a variety of functions that are used in the RESTful communications with th UI.
 * 
 * @author Lefteris Tatakis
 *
 */
public class VoidService {
    /**
     * Information provided by the user.
     */
	private VoidAttributes voidInfo ;
	private JSONObject statistics ;
	private JSONObject statisticsUniqueSubjects ;
	private JSONObject statisticsUniqueObjects ;
	private JSONObject statisticsTotalTriples ;
	private VoidTurtle tmp ;
	private VoidUpload upload;
	private DataUpload uploadData;
	private JSONObject jsonUpload;
    private Object sources ;
	public VoidService  (){}

    /**
     * Set the VoidAttributes information.
     * @param info The information from the user.
     */
	public void setVoidInfo(VoidAttributes info){
		voidInfo = info;
	}

    public void setOPSSources(Object sources){
        this.sources = sources;
    }
    /**
     * Returns the VoID created using the voidInfo in a String format in order to be displayed in the "Under the Hood"
     * functionality.
     *
     * @return The VoID created in a String format.
     * @throws RDFParseException
     * @throws RDFHandlerException
     * @throws VoidValidatorException
     * @throws IOException
     */
	public String getVoid() throws RDFParseException, RDFHandlerException, VoidValidatorException, IOException {
		tmp = new VoidTurtle(voidInfo);
		tmp.createVoid();
		return tmp.getVoid();
	}

    /**
     * Validates created VoID to the OPS validator and returns the results.
     * @return The result of the OPS validator regarding the quality of the created RDF.
     * @throws RDFParseException
     * @throws RDFHandlerException
     * @throws VoidValidatorException
     * @throws IOException
     */
	public String getVoidValidationResults() throws RDFParseException, RDFHandlerException, VoidValidatorException, IOException {
		tmp = new VoidTurtle(voidInfo);
		tmp.createVoid();
		return tmp.getValidationResults();
	}

    /**
     *
     * @return  Location of the temporary file containing the VoID.
     * @throws RDFParseException
     * @throws RDFHandlerException
     * @throws VoidValidatorException
     * @throws IOException
     */
	public String getLocation() throws RDFParseException, RDFHandlerException, VoidValidatorException, IOException {
		tmp = new VoidTurtle(voidInfo);
		tmp.createVoid();
		return tmp.getLocation();
	}

    /**
     * <p>Given a VoID from the user process it, upload it and prepare the results to be sent
     * back to the users.</p>
     * @param uploadedInputStream
     * @throws RDFParseException
     * @throws RDFHandlerException
     */
	public void uploadVoid(InputStream uploadedInputStream) throws RDFParseException, RDFHandlerException  {
		upload = new VoidUpload(uploadedInputStream  , sources);
		jsonUpload = upload.getResult();
	}

    /**
     * Statistical analysis of Sparql endpoint provided (Unique Subjects).
     * @param endpoint The URL of the SPARQL endpoint that we want to communicate with.
     */
	public void sparqlStatsUniqueSubjects(String endpoint) {
		DatasetStatistics stats = new DatasetStatistics( );
		statisticsUniqueSubjects = stats.querySparqlEndpointUniqueSubject(endpoint);
	}
    /**
     *  Statistical analysis of Sparql endpoint provided ( Unique Objects).
     * @param endpoint The URL of the SPARQL endpoint that we want to communicate with.
     */
	public void sparqlStatsUniqueObjects(String endpoint) {
		DatasetStatistics stats = new DatasetStatistics( );
		statisticsUniqueObjects = stats.querySparqlEndpointUniqueObjects(endpoint);
	}
    /**
     *  Statistical analysis of Sparql endpoint provided (Total number of triples).
     * @param endpoint The URL of the SPARQL endpoint that we want to communicate with.
     */
	public void sparqlStatsTotalTriples(String endpoint) {
		DatasetStatistics stats = new DatasetStatistics( );
		statisticsTotalTriples = stats.querySparqlEndpointTotalTriples(endpoint);
	}

	public JSONObject getUserDataStatisticsUniqueSubjects(){
		return statisticsUniqueSubjects;
	}
	
	public JSONObject getUserDataStatisticsUniqueObjects(){
		return statisticsUniqueObjects;
	}
	
	public JSONObject getUserDataStatisticsTotalTriples(){
		return statisticsTotalTriples;
	}

    /**
     * Allow the RESTful service to upload a RDF dataset file for statistical analysis.
     * @param uploadedInputStream The input stream (file) of the RDF data to be processed.
     * @throws RDFParseException
     * @throws RDFHandlerException
     */
	public void uploadData(InputStream uploadedInputStream) throws RDFParseException, RDFHandlerException {
		uploadData = new DataUpload(uploadedInputStream );
		statistics = uploadData.getStatistics();
	}

    /**
     * @return JSON Object of the VoID dataset description uploaded by the user.
     */
	public JSONObject getUploadedRDFInJson(){
		return jsonUpload;
	}

    /**
     * @return JSON Object of the stats results done on the RDF dataset uploaded.
     */
	public JSONObject getUserDataStatistics(){
		return statistics;
	}

}
