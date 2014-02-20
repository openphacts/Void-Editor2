package editor.validator;

import java.io.File;

import org.openrdf.model.Resource;

import uk.ac.manchester.cs.datadesc.validator.RdfValidator;
import uk.ac.manchester.cs.datadesc.validator.metadata.MetaDataSpecification;
import uk.ac.manchester.cs.datadesc.validator.rdftools.RdfFactory;
import uk.ac.manchester.cs.datadesc.validator.rdftools.RdfReader;
import uk.ac.manchester.cs.datadesc.validator.rdftools.VoidValidatorException;

/**
 * Based on the work from Christian this class will be provided the void I create and 
 * check if it follows OPS standarts.
 * @author Lefteris
 *
 */
public class Validator {
	private static RdfReader minReader;
	private static Resource minContext;
	private static MetaDataSpecification specifications;
    private static final boolean INCLUDE_WARNINGS = true;
    private String result;
    
	public Validator (File file) throws VoidValidatorException{
	        minReader = RdfFactory.getMemory();
	        minContext = minReader.loadFile(file);
	        specifications = MetaDataSpecification.specificationByName("opsVoid");
	       result = RdfValidator.validate(minReader, minContext, specifications, INCLUDE_WARNINGS);
	}
	
	public boolean passedTests(){
		if (result.endsWith(RdfValidator.SUCCESS)){
			return true;
		}else{
			System.err.println(result);
			return false;
		}
	}
	
	public String showResult(){
		return result;
	}
}
