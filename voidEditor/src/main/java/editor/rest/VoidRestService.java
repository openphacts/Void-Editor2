package editor.rest;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.ResponseBuilder;

import org.json.simple.JSONObject;
import org.openrdf.rio.RDFHandlerException;
import org.openrdf.rio.RDFParseException;

import uk.ac.manchester.cs.datadesc.validator.rdftools.VoidValidatorException;

import com.sun.jersey.multipart.FormDataParam;

import editor.domain.VoidAttributes;
import editor.service.VoidService;
/**
 * Using Restful to send information back and forth to the UI.
 * 
 * @author Lefteris Tatakis
 *
 */
@Path("/void")
public class VoidRestService {
 
	private static final VoidService  results = new VoidService();

    /**
     * Created a temporary VoID file in order to display users their current progress.
     * @param data The information captured from the user.
     * @return The VoID file created in a String in order to be shown in Modal of "Under the Hood"
     */
	@Path("/output")
	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	public String postVoidCreation(VoidAttributes data) {
		results.setVoidInfo(data);
		String output;
		try {
			output = results.getVoid();
		} catch (RDFParseException e) {
			output = e.getMessage();
			e.printStackTrace();
		} catch (RDFHandlerException e) {
			output = e.getMessage();
			e.printStackTrace();
		} catch (VoidValidatorException e) {
			output = e.getMessage();
			e.printStackTrace();
		} catch (IOException e) {
			output = e.getMessage();
		}
		return output;
	}

    /**
     * Given all the appropriate user data, this will create a fully validated VoID dataset description that can be used
     * in the OPS project.
     * @return A file which will be downloaded by the users. This file is a validated and correct VoID dataset description.
     * @throws RDFParseException
     * @throws RDFHandlerException
     * @throws VoidValidatorException
     * @throws IOException
     */
	// I prefer to throw an error to the users than give them now valid output.
	@Path("/file")
	@GET
	@Produces("application/text")
	public Response  getVoidFile() throws RDFParseException, RDFHandlerException, VoidValidatorException, IOException {
		File file;
		file = new File(results.getLocation());
		
		ResponseBuilder response = Response.ok((Object) file);
		response.header("Content-Disposition","attachment; filename=void.voidCreator.ttl");
		return response.build();
	 }

    /**
     * <p>Translates the VoID the Users upload to the UI into a JSON Object which can be used by Angularjs to feel in the
     * information.</p>
     * @param uploadedInputStream An old VoID dataset description the users wish to update.
     * @return JSON Object that contains the information provided in the file uploaded by the user in a usable format.
     */
	@Path("/uploadVoid")
	@POST
	@Consumes(MediaType.MULTIPART_FORM_DATA)
	public JSONObject uploadFile(@FormDataParam("file") InputStream uploadedInputStream) {
		JSONObject result ;
		try {
			results.uploadVoid(uploadedInputStream);
			result = results.getUploadedRDFInJson();
		} catch (RDFHandlerException e) {
			result = new JSONObject();
			System.out.println( e.getMessage());
			result.put("error", e.getMessage());
		} catch (RDFParseException   e) {
			result = new JSONObject();
			System.out.println( e.getMessage());
			result.put("error", e.getMessage());
		}
	    
		return result;
	}

    /**
     *
     * @param uploadedInputStream RDF data the user want statistical analysis done on.
     * @return JSON Object containing Stats.
     */
	@Path("/uploadData")
	@POST
	@Consumes(MediaType.MULTIPART_FORM_DATA)
	public JSONObject uploadUserDataFile(@FormDataParam("file") InputStream uploadedInputStream){
		JSONObject result ;
		try {
			results.uploadData(uploadedInputStream);
			result = results.getUserDataStatistics();
		} catch (RDFParseException e) {
			result = new JSONObject();
			result.put("error", e.getMessage());
		} catch ( RDFHandlerException e) {
			result = new JSONObject();
			result.put("error", e.getMessage());
		}
		
		return result;
	}

    /**
     *
     * @param endpoint The sparql endpoint the User wants to be statistically analysed.
     * @return JSON Object containing Unique Objects.
     */
	@Path("/sparqlStatsObject")
	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	public JSONObject sparqlEndpointStatsUniqueObjects(VoidAttributes endpoint) {
		results.sparqlStatsUniqueObjects(endpoint.sparqlEndpoint);
		JSONObject result = results.getUserDataStatisticsUniqueObjects();
		return result;
	}

    /**
     *
     * @param endpoint The sparql endpoint the User wants to be statistically analysed.
     * @return JSON Object containing number of total triples.
     */
	@Path("/sparqlStatsTotalTriples")
	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	public JSONObject sparqlEndpointStatsTotalTriples(VoidAttributes endpoint) {
		results.sparqlStatsTotalTriples(endpoint.sparqlEndpoint);
		JSONObject result = results.getUserDataStatisticsTotalTriples();
		return result;
	}

    /**
     *
     * @param endpoint The sparql endpoint the User wants to be statistically analysed.
     * @return JSON Object containing unique subjects.
     */
	@Path("/sparqlStatsSubject")
	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	public JSONObject sparqlEndpointStatsUniqueSubjects(VoidAttributes endpoint) {
		results.sparqlStatsUniqueSubjects(endpoint.sparqlEndpoint);
		JSONObject result = results.getUserDataStatisticsUniqueSubjects();
		return result;
	}

    /**
     * API service to check if created VoID is correctly validated by OPS Validator.
     * @param data The user input from the UI.
     * @return The result produced by the OPS Validator.
     */
	@Path("/validation")
	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	public String validateVoid(VoidAttributes data) {
		results.setVoidInfo(data);
		String output;
		try {
			output = results.getVoidValidationResults();
		} catch (RDFParseException e) {
			output = e.getMessage();
			e.printStackTrace();
		} catch (RDFHandlerException e) {
			output = e.getMessage();
			e.printStackTrace();
		} catch (VoidValidatorException e) {
			output = e.getMessage();
			e.printStackTrace();
		} catch (IOException e) {
			output = e.getMessage();
		}
		
		return output;
	}
	

}