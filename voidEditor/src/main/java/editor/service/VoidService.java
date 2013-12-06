package editor.service;

import editor.domain.VoidAttributes;
import editor.domain.VoidTurtle;
import editor.rest.VoidRestService;
/**
 * Provides the {@link VoidRestService} with a variety of functions that are used. 
 * 
 * @author Lefteris Tatakis
 *
 */
public class VoidService {

	private VoidAttributes voidInfo ; 
	private VoidTurtle tmp ;
	
	public VoidService  (){}
	
	public void setVoidInfo(VoidAttributes info){
		voidInfo = info;
	}
	
	public String getVoid() {
		tmp = new VoidTurtle(voidInfo);
		tmp.createVoid();
		return tmp.getVoid();
	}
	
	public String getLocation() {
		tmp = new VoidTurtle(voidInfo);
		tmp.createVoid();
		return tmp.getLocation();
	}

}
