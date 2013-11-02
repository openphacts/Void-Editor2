package editor.service;

import editor.domain.voidAttributes;
import editor.domain.voidTurtle;

public class voidService {

	voidAttributes voidInfo ; 
	
	public voidService  (voidAttributes info){
		voidInfo = info;
	}
	
	public String getVoid() {
		voidTurtle tmp = new voidTurtle(voidInfo);
		tmp.createVoid();
		return tmp.getVoid();
	}
}
