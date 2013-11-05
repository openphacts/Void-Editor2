package editor.service;

import editor.domain.voidAttributes;
import editor.domain.voidTurtle;
/**
 * Provides the {@link VoidRestService} with a variety of functions that are used. 
 * 
 * @author Lefteris Tatakis
 *
 */
public class voidService {

	private voidAttributes voidInfo ; 
	private voidTurtle tmp ;
	
	public voidService  (){}
	
	public void setVoidInfo(voidAttributes info){
		voidInfo = info;
	}
	
	public String getVoid() {
		tmp = new voidTurtle(voidInfo);
		tmp.createVoid();
		return tmp.getVoid();
	}
	
	public String getLocation() {
		tmp = new voidTurtle(voidInfo);
		tmp.createVoid();
		return tmp.getLocation();
	}

}
