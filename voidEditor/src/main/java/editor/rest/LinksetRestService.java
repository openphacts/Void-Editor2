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

import editor.domain.LinksetAttributes;
import editor.domain.VoidAttributes;
import editor.service.LinksetService;
/**
 * The RESTful service to create, download and view the produced Linkset VoID.
 *
 * @since 19/06/2014
 * @author Lefteris Tatakis
 */
@Path("/linkset")
public class LinksetRestService {
 
	private static final LinksetService  results = new LinksetService();

    /**
     * Allow the users to view the Linkset VoID.(Under the Hood)
     * @param data Attributes provided by the user.
     * @return A String that contains all the VoID created.
     */
	@Path("/output")
	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	public String postVoidCreation(LinksetAttributes data) {
		results.setLinksetInfo(data);
		String output;
		System.out.println("IN linkset REST -- OUTPUT");
		try {
			output = results.getVoid();
		} catch (RDFParseException e) {
			output = e.getMessage();
			e.printStackTrace();
		} catch (RDFHandlerException e) {
			output = e.getMessage();
			e.printStackTrace();
		} catch (IOException e) {
			output = e.getMessage();
		}
		
		return output;
	}

    /**
     *  Given the information from the UI, create the Linkset VoID and then sent it back to the UI to be downloaded.
      * @return The Linkset VoID to be given to OPS
     * @throws RDFParseException
     * @throws RDFHandlerException
     * @throws VoidValidatorException
     * @throws IOException
     */
	@Path("/file")
	@GET
	@Produces("application/text")
	public Response  getVoidFile() throws RDFParseException, RDFHandlerException,  IOException {
		File file;
		file = new File(results.getLocation());
		System.out.println("IN linkset REST -- file");
		ResponseBuilder response = Response.ok((Object) file);
		response.header("Content-Disposition","attachment; filename=void.LinksetCreator.ttl");
		return response.build();
	 }
	 

}