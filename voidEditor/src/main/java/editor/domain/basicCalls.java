package editor.domain;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.io.StringReader;
import java.net.URL;
import java.util.Calendar;
import java.util.GregorianCalendar;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;

import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;

import com.hp.hpl.jena.rdf.model.Model;



public class basicCalls {
	// Call to open any xml file
	public static Document openXmlURL(String url) throws ParserConfigurationException, SAXException, IOException{
		DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
		DocumentBuilder db = dbf.newDocumentBuilder();
		return db.parse(new URL(url).openStream());
	}

	public static Document openXmlFile(String xmlFileName) throws ParserConfigurationException, SAXException, IOException{
		File file = new File(xmlFileName);
		DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
		DocumentBuilder db = dbf.newDocumentBuilder();
		return db.parse(file);
	}

	public static Document openXmlString(String xmlFileString) throws ParserConfigurationException, SAXException, IOException{
		DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
		DocumentBuilder db = dbf.newDocumentBuilder();
		InputSource is = new InputSource();
		is.setCharacterStream(new StringReader(xmlFileString));
		return db.parse(is);
	}

	public static int saveDOMasXML(Document xmlDocument, String fileName) throws TransformerException{
		TransformerFactory transformerFactory = TransformerFactory.newInstance();
		Transformer transformer = transformerFactory.newTransformer();
		DOMSource source = new DOMSource(xmlDocument);
		StreamResult result = new StreamResult(new File(fileName));
		transformer.transform(source, result);
		return 0;
	}

	public static String now(){
		Calendar now = GregorianCalendar.getInstance();
		return Integer.toString(now.get(Calendar.YEAR))+Integer.toString(now.get(Calendar.MONTH)+1)+Integer.toString(now.get(Calendar.DATE));

	}

	public static void saveRDF2File(Model model, String filename, String format) throws FileNotFoundException{
		FileOutputStream fout;
		fout = new FileOutputStream(filename);
		model.write(fout, format);
	}

	public static int xmlNodeExist(Element parent, String nodeName){

		return parent.getElementsByTagName(nodeName).getLength();
	}

	public static void appendToFile(String filename, String content) throws IOException{
		FileWriter fstream = new FileWriter(filename,true);
		BufferedWriter out = new BufferedWriter(fstream);
		out.write(content);
		out.close();
	}



	public static void printMemoryStatus () {

		// Based on from: http://viralpatel.net/blogs/2009/05/getting-jvm-heap-size-used-memory-total-memory-using-java-runtime.html
		Runtime runtime = Runtime.getRuntime();
		int mb = 1024*1024;
		System.out.println("##### Heap utilization statistics [MB] #####");
		//Print used memory
		System.out.println("Used Memory:"
				+ (runtime.totalMemory() - runtime.freeMemory()) / mb);
		//Print free memory
		System.out.println("Free Memory:"
				+ runtime.freeMemory() / mb);
		//Print total available memory
		System.out.println("Total Memory:" + runtime.totalMemory() / mb);
		//Print Maximum available memory
		System.out.println("Max Memory:" + runtime.maxMemory() / mb);
	}


	public static String getStringNodeContent(Node node, String nodeName){
		String returnValue = "";
		if (((Element) node).getElementsByTagName(nodeName).item(0)!=null) {
			returnValue=((Element) node).getElementsByTagName(nodeName).item(0).getTextContent();
		}
		return returnValue;
	}

	public static String getStringAttributeContent(Node node, String attributeName){
		String returnValue = "";
		if (node.getAttributes().getNamedItem(attributeName)!=null){
			returnValue = node.getAttributes().getNamedItem(attributeName).getTextContent();
		}
		return returnValue;
	}
	public static Float getFloatNodeContent(Node node, String nodeName){
		Float returnValue = null;
		if (node!=null) {
			returnValue=Float.valueOf(((Element) node).getElementsByTagName(nodeName).item(0).getTextContent());
		}
		return returnValue;
	}

	public static Float getFloatAttributeContent(Node node, String attributeName){
		Float returnValue = null;
		if (node.getAttributes().getNamedItem(attributeName).getTextContent()!=null){
			returnValue = Float.valueOf(node.getAttributes().getNamedItem(attributeName).getTextContent());
		}
		return returnValue;
	}

}
