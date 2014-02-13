package editor.domain;

import static org.junit.Assert.*;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;

import org.json.simple.JSONObject;
import org.junit.BeforeClass;
import org.junit.Test;

public class DataUploadStatsFunctionalityJunitTests {
	private static JSONObject stats = null;
	private DataUpload dataUploadFile = null;
	
	@BeforeClass
	public static void setup() {
		InputStream is = null;
		try {
			 is = new FileInputStream("C:\\Users\\Lefteris\\Desktop\\Void-Editor2\\voidEditor\\src\\test\\res\\editor\\domain\\testVoid.ttl");
			 DataUpload dataUploadFile = new DataUpload(is);
			 stats = dataUploadFile.getStatistics();
			 //System.out.println(tmp.toJSONString());
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			try {is.close();} catch (IOException ex) {ex.printStackTrace();}
		}
	
	}
	
	@Test
	public void testTotalNumberOfTriples() {
		assertTrue("Making sure result of numberOfUniqueSubjects is correct", stats.get("numberOfUniqueSubjects").toString().equals("5") );
	}
	
	@Test
	public void testNumberOfUniqueSubjects() {
		assertTrue("Making sure result of numberOfUniqueObjects is correct", stats.get("numberOfUniqueObjects").toString().equals("30") );
	}
	
	@Test
	public void testNumberOfUniqueObjects() {
		assertTrue("Making sure result of totalNumberOfTriples is correct", stats.get("totalNumberOfTriples").toString().equals("34") );
	}
	
	@Test
	public void testIsJSONObject() {
		assertTrue("Making sure result returns a JsonObject", stats instanceof JSONObject );
	}
	

}
