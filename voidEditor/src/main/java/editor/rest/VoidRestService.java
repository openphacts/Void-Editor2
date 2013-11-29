package editor.rest;

import java.io.File;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.ResponseBuilder;

import editor.domain.voidAttributes;
import editor.service.voidService;
/**
 * Using Restful to send information back and forth. 
 * 
 * @author Lefteris Tatakis
 *
 */
@Path("/void")
public class VoidRestService {
 
	private static final voidService  results = new voidService();
	
	 @Path("/output")
	 @POST
	 @Consumes(MediaType.APPLICATION_JSON)
	public String postVoidCreation(voidAttributes data) {
		results.setVoidInfo(data);
		return results.getVoid();
	 }
	 
	 @Path("/file")
	 @GET
	 @Produces("application/text")
	public Response  getVoidFile() {
		File file = new File(results.getLocation());
		ResponseBuilder response = Response.ok((Object) file);
		response.header("Content-Disposition","attachment; filename=void.ttl");
		return response.build();
	 }
}
