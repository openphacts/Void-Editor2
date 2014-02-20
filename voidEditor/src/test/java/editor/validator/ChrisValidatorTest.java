
package editor.validator;

import java.io.File;
import java.io.InputStream;

import org.openrdf.model.Resource;

import uk.ac.manchester.cs.datadesc.validator.RdfValidator;
import uk.ac.manchester.cs.datadesc.validator.metadata.MetaDataSpecification;
import uk.ac.manchester.cs.datadesc.validator.rdftools.RdfFactory;
import uk.ac.manchester.cs.datadesc.validator.rdftools.RdfReader;
import uk.ac.manchester.cs.datadesc.validator.rdftools.VoidValidatorException;


public class ChrisValidatorTest {
	static RdfReader minReader;
    static Resource minContext;
    static MetaDataSpecification specifications;
    private static final boolean INCLUDE_WARNINGS = false;
    
	public static void main(String[] args) throws VoidValidatorException {

		//read file
		InputStream is = null;
		  File file = new File ("C:\\Users\\Lefteris\\Desktop\\Void-Editor2\\voidEditor\\src\\test\\res\\editor\\domain\\testVoid.ttl");
	        minReader = RdfFactory.getMemory();
	        minContext = minReader.loadFile(file);
	        specifications = MetaDataSpecification.specificationByName("opsVoid");
	      
	      String result = RdfValidator.validate(minReader, minContext, specifications, INCLUDE_WARNINGS);
	        System.out.println(result);
		
	}

}