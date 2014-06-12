package editor.service;

import java.io.IOException;

import org.json.simple.JSONObject;
import org.openrdf.rio.RDFHandlerException;
import org.openrdf.rio.RDFParseException;

import uk.ac.manchester.cs.datadesc.validator.rdftools.VoidValidatorException;
import editor.domain.DataUpload;
import editor.domain.LinksetAttributes;
import editor.domain.LinksetTurtle;
import editor.domain.VoidUpload;
import editor.rest.VoidRestService;
/**
 * Provides the {@link VoidRestService} with a variety of functions that are used. 
 * 
 * @author Lefteris Tatakis
 *
 */
public class LinksetService {

	private LinksetAttributes linksetInfo ;
	private LinksetTurtle tmp ;
	private JSONObject jsonUpload;
	public LinksetService(){}
	
	public void setLinksetInfo(LinksetAttributes info){
		linksetInfo = info;
	}
	
	public String getVoid() throws RDFParseException, RDFHandlerException, VoidValidatorException, IOException {
		tmp = new LinksetTurtle(linksetInfo);
		tmp.createVoid();
		return tmp.getVoid();
	}
	
	public String getVoidValidationResults() throws RDFParseException, RDFHandlerException, VoidValidatorException, IOException {
		tmp = new LinksetTurtle(linksetInfo);
		tmp.createVoid();
		return tmp.getValidationResults();
	}
	
	public String getLocation() throws RDFParseException, RDFHandlerException, VoidValidatorException, IOException {
		tmp = new LinksetTurtle(linksetInfo);
		tmp.createVoid();
		return tmp.getLocation();
	}
	
	public JSONObject getUploadedRDFInJson(){
		return jsonUpload;
	}
	

}
