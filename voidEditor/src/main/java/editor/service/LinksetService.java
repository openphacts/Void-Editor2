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
 * @since 19/06/2014
 * @author Lefteris Tatakis
 */
public class LinksetService {

	private LinksetAttributes linksetInfo ;
	private LinksetTurtle tmp ;
	private JSONObject jsonUpload;
	public LinksetService(){}

    /** @param info The information provided by the users.    */
	public void setLinksetInfo(LinksetAttributes info){
		linksetInfo = info;
	}

    /**
     * @return The VoID created in a String format.
     * @throws RDFParseException
     * @throws RDFHandlerException
     * @throws VoidValidatorException
     * @throws IOException
     */
	public String getVoid() throws RDFParseException, RDFHandlerException, VoidValidatorException, IOException {
		tmp = new LinksetTurtle(linksetInfo);
		tmp.createVoid();
		return tmp.getVoid();
	}

    /**
     *
     * @return The temp location of the VoID file that is generated.
     * @throws RDFParseException
     * @throws RDFHandlerException
     * @throws VoidValidatorException
     * @throws IOException
     */
	public String getLocation() throws RDFParseException, RDFHandlerException, VoidValidatorException, IOException {
		tmp = new LinksetTurtle(linksetInfo);
		tmp.createVoid();
		return tmp.getLocation();
	}

}
