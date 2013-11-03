package editor.service;

import editor.domain.voidAttributes;
import editor.domain.voidTurtle;

public class voidService {

	voidAttributes voidInfo ; 
	voidTurtle tmp ;
	public voidService  (){
		
	}
	
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
	
	public void deleteFile(){
		tmp.deleteFile();
	}
}
