package editor.domain;

import static org.junit.Assert.assertTrue;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.junit.BeforeClass;
import org.junit.Test;
import org.openrdf.rio.RDFHandlerException;
import org.openrdf.rio.RDFParseException;

public class VoidUploadJunitTest {
	private static 	InputStream is = null;
	private static VoidUpload temp ;
	private static JSONObject result;
	
	@BeforeClass
	public static void setup() {
		try {
			 is = new FileInputStream("C:\\Users\\Lefteris\\Desktop\\Void-Editor2\\voidEditor\\src\\test\\res\\editor\\domain\\testVoid.ttl");
			 VoidUpload temp = new VoidUpload(is);
			 result = temp.getResult();
		} catch (RDFParseException  e) {
			e.printStackTrace();
		}
		 catch ( RDFHandlerException e) {
				e.printStackTrace();
		 }catch (IOException e) {e.printStackTrace();}
		finally {
			try {is.close();} catch (IOException ex) {ex.printStackTrace();}
		}
	
	}
	
	@Test
	public void testIsJSONObject() {
		assertTrue("Making sure result returns a JsonObject", result instanceof JSONObject );
	}

	@Test
	public void testJSONObjectContaints1() {
		assertTrue("Making sure result contains licence",result.containsKey("licence"));
	}
	
	@Test
	public void testJSONObjectContaints2() {
		assertTrue("Making sure result contains downloadFrom",result.containsKey("downloadFrom"));
	}
	
	@Test
	public void testJSONObjectContaints3() {
		assertTrue("Making sure result contains familyName",result.containsKey("familyName"));
	}
	
	
	@Test
	public void testJSONObjectContaints4() {
		assertTrue("Making sure result contains userEmail",result.containsKey("userEmail"));
	}
	
	@Test
	public void testJSONObjectContaints5() {
		assertTrue("Making sure result contains givenName",result.containsKey("givenName"));
	}
	
	
	@Test
	public void testJSONObjectContaints6() {
		assertTrue("Making sure result contains sources",result.containsKey("sources"));
	}
	
	@Test
	public void testJSONObjectContaints7() {
		assertTrue("Making sure result contains publisher",result.containsKey("publisher"));
	}
	
	@Test
	public void testJSONObjectContaints8() {
		assertTrue("Making sure result contains title",result.containsKey("title"));
	}
	
	@Test
	public void testJSONObjectContaints9() {
		assertTrue("Making sure result contains URI",result.containsKey("URI"));
	}
	
	@Test
	public void testJSONObjectContaints10() {
		assertTrue("Making sure result contains description",result.containsKey("description"));
	}
	
	@Test
	public void testJSONObjectContaints11() {
		assertTrue("Making sure result contains webpage",result.containsKey("webpage"));
	}
	
	@Test
	public void testJSONObjectResult1() {
		assertTrue("Making sure result is have the correct uri",((String) result.get("URI")).contains("manchester.ac.uk"));
	}
	
	@Test
	public void testJSONObjectResult2() {
		assertTrue("Making sure result is have the correct title",((String) result.get("title")).length()>3);
	}
	
	@Test
	public void testJSONObjectResult3() {
		assertTrue("Making sure result is have the correct webpage",((String) result.get("webpage")).contains("manchester.ac.uk"));
	}
	
	@Test
	public void testJSONObjectResult4() {
		assertTrue("Making sure result is have the correct description",((String) result.get("description")).length()>4);
	}
	
	@Test
	public void testJSONObjectResult5() {
		assertTrue("Making sure result is have the correct publisher",((String) result.get("publisher")).contains("manchester.ac.uk"));
	}
	
	@Test
	public void testJSONObjectResult6() {
		assertTrue("Making sure result is have the correct sources",((JSONArray) result.get("sources")).size()>1);
	}
	
	
	@Test
	public void testJSONObjectResult7() {
		assertTrue("Making sure result is have the correct giveName",((String) result.get("givenName")).contains("Lefteris"));
	}
	
	@Test
	public void testJSONObjectResult8() {
		assertTrue("Making sure result is have the correct userEmail",((String) result.get("userEmail")).contains("@"));
	}
	
	@Test
	public void testJSONObjectResult9() {
		assertTrue("Making sure result is have the correct downloadFrom",((String) result.get("downloadFrom")).contains("http"));
	}
	
	@Test
	public void testJSONObjectResult10() {
		assertTrue("Making sure result is have the correct licence",((String) result.get("licence")).contains("http"));
	}
}
