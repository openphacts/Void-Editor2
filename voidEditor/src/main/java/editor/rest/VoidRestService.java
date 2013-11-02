package editor.rest;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.core.MediaType;

import editor.domain.voidAttributes;
import editor.service.voidService;

@Path("/void")
public class VoidRestService {
 
	 @POST
	 @Consumes(MediaType.APPLICATION_JSON)
	public String postVoidCreation(voidAttributes json) {
		System.out.println("Booom");
		voidService  results = new voidService(json);
		return results.getVoid();
	 }
	 
}
