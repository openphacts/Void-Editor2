package editor.domain;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;

import org.json.simple.JSONObject;
import org.openrdf.rio.RDFHandlerException;
import org.openrdf.rio.RDFParseException;

public class LocalDataStatsTest {

	public static void main(String[] args) {

		
		InputStream is = null;
		 
		try {
 
			 is = new FileInputStream("C:\\Users\\Lefteris\\Desktop\\Void-Editor2\\voidEditor\\src\\test\\res\\editor\\domain\\testVoid.ttl");
			 
			 DataUpload temp = new DataUpload(is);
			 JSONObject tmp = temp.getStatistics();
				System.out.println(tmp.toJSONString());

			 
		} catch ( RDFHandlerException e) {
			e.printStackTrace();
		}catch (RDFParseException  e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			try {
				is.close();
			} catch (IOException ex) {
				ex.printStackTrace();
			}
		}
	}
}
