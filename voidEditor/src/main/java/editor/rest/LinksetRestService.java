package editor.rest;

import java.io.File;
import java.io.IOException;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.ResponseBuilder;

import org.openrdf.rio.RDFHandlerException;
import org.openrdf.rio.RDFParseException;

import uk.ac.manchester.cs.datadesc.validator.rdftools.VoidValidatorException;
import editor.domain.LinksetAttributes;
import editor.domain.VoidAttributes;
import editor.service.LinksetService;
/**
 * Using Restful to send information back and forth. 
 * 
 * @author Lefteris Tatakis
 *
 */
@Path("/linkset")
public class LinksetRestService {
 
	private static final LinksetService  results = new LinksetService();
	
	@Path("/output")
	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	public String postVoidCreation(LinksetAttributes data) {
		results.setLinksetInfo(data);
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
	 
//	
//	@Path("/validation")
//	@POST
//	@Consumes(MediaType.APPLICATION_JSON)
//	public String validateVoid(VoidAttributes data) {
//		results.setVoidInfo(data);
//		String output;
//		try {
//			output = results.getVoidValidationResults();
//		} catch (RDFParseException e) {
//			output = e.getMessage();
//			e.printStackTrace();
//		} catch (RDFHandlerException e) {
//			output = e.getMessage();
//			e.printStackTrace();
//		} catch (VoidValidatorException e) {
//			output = e.getMessage();
//			e.printStackTrace();
//		} catch (IOException e) {
//			output = e.getMessage();
//		}
//		
//		return output;
//	}
//	

}