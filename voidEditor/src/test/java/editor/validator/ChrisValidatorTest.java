
package editor.validator;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;

import org.openrdf.rio.RDFFormat;

import uk.ac.manchester.cs.datadesc.validator.Validator;
import uk.ac.manchester.cs.datadesc.validator.ValidatorExampleConstants;
import uk.ac.manchester.cs.datadesc.validator.metadata.MetaDataSpecification;
import uk.ac.manchester.cs.datadesc.validator.rdftools.VoidValidatorException;


public class ChrisValidatorTest {
	protected static Validator validator;
	public static void main(String[] args) {

		//read file
		InputStream is = null;
		try {
			MetaDataSpecification.LoadSpecification(ValidatorExampleConstants.SIMPLE_FILE, 
			           ValidatorExampleConstants.SIMPLE_NAME, ValidatorExampleConstants.SIMPLE_DESCRIPTION);
		} catch (VoidValidatorException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}
		try {
			    File file = new File("C:\\Users\\Lefteris\\Desktop\\Void-Editor2\\voidEditor\\src\\test\\res\\editor\\domain\\testVoid.ttl");
		        FileInputStream stream = new FileInputStream(file); 
		        System.out.println(stream.available());
		        String result = validator.validateInputStream(stream, RDFFormat.TURTLE.getName(), 
		                ValidatorExampleConstants.SIMPLE_NAME, Boolean.TRUE);
		        System.out.println( result);
		}  catch (IOException e) {
			e.printStackTrace();
		} catch (VoidValidatorException e) {
			e.printStackTrace();
		} 
	}

}