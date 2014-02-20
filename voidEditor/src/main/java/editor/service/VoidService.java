package editor.service;

import java.io.IOException;
import java.io.InputStream;

import org.json.simple.JSONObject;
import org.openrdf.rio.RDFHandlerException;
import org.openrdf.rio.RDFParseException;

import uk.ac.manchester.cs.datadesc.validator.rdftools.VoidValidatorException;
import editor.domain.DataUpload;
import editor.domain.DatasetStatistics;
import editor.domain.VoidAttributes;
import editor.domain.VoidTurtle;
import editor.domain.VoidUpload;
import editor.rest.VoidRestService;
/**
 * Provides the {@link VoidRestService} with a variety of functions that are used. 
 * 
 * @author Lefteris Tatakis
 *
 */
public class VoidService {

	private VoidAttributes voidInfo ;
	private JSONObject statistics ;
	private JSONObject statisticsUniqueSubjects ;
	private JSONObject statisticsUniqueObjects ;
	private JSONObject statisticsTotalTriples ;
	private VoidTurtle tmp ;
	private VoidUpload upload;
	private DataUpload uploadData;
	private JSONObject jsonUpload;
	public VoidService  (){}
	
	public void setVoidInfo(VoidAttributes info){
		voidInfo = info;
	}
	
	public String getVoid() throws RDFParseException, RDFHandlerException, VoidValidatorException, IOException {
		tmp = new VoidTurtle(voidInfo);
		tmp.createVoid();
		return tmp.getVoid();
	}
	
	public String getVoidValidationResults() throws RDFParseException, RDFHandlerException, VoidValidatorException, IOException {
		tmp = new VoidTurtle(voidInfo);
		tmp.createVoid();
		return tmp.getValidationResults();
	}
	
	public String getLocation() throws RDFParseException, RDFHandlerException, VoidValidatorException, IOException {
		tmp = new VoidTurtle(voidInfo);
		tmp.createVoid();
		return tmp.getLocation();
	}
	
	public void uploadVoid(InputStream uploadedInputStream) throws RDFParseException, RDFHandlerException  {
		upload = new VoidUpload(uploadedInputStream );
		jsonUpload = upload.getResult();
	}
	// using separate instances of DatasetStatistics in order to get results faster
	public void sparqlStatsUniqueSubjects(String endpoint) {
		DatasetStatistics stats = new DatasetStatistics( );
		statisticsUniqueSubjects = stats.querySparqlEndpointUniqueSubject(endpoint);
	}
	
	public void sparqlStatsUniqueObjects(String endpoint) {
		DatasetStatistics stats = new DatasetStatistics( );
		statisticsUniqueObjects = stats.querySparqlEndpointUniqueObjects(endpoint);
	}
	
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
	
	public void uploadData(InputStream uploadedInputStream) throws RDFParseException, RDFHandlerException {
		uploadData = new DataUpload(uploadedInputStream );
		statistics = uploadData.getStatistics();
	}
	
	public JSONObject getUploadedRDFInJson(){
		return jsonUpload;
	}
	
	public JSONObject getUserDataStatistics(){
		return statistics;
	}

}
