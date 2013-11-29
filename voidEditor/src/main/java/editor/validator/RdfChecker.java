package editor.validator;

import info.aduna.lang.FileFormat;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import org.openrdf.rio.RDFFormat;
import org.openrdf.rio.RDFHandler;
import org.openrdf.rio.RDFHandlerException;
import org.openrdf.rio.RDFParseException;
import org.openrdf.rio.RDFParser;
import org.openrdf.rio.RDFParserFactory;
import org.openrdf.rio.RDFParserRegistry;
import org.openrdf.rio.helpers.ParseErrorCollector;
import org.openrdf.rio.helpers.RDFHandlerBase;

/**
 *
 * @author Christian
 */
public class RdfChecker extends RDFHandlerBase implements RDFHandler{

    public static String DEFAULT_BASE_URI = "http://no/BaseURI/Set/";

    private static RDFFormat getFormat(String fileName) {
        if (fileName.endsWith(".n3")){
            fileName = "try.ttl";
        }
        RDFParserRegistry reg = RDFParserRegistry.getInstance();
        FileFormat fileFormat = reg.getFileFormatForFileName(fileName);
        if (fileFormat == null || !(fileFormat instanceof RDFFormat)){
            //added bridgeDB/OPS specific extension here if required.
            throw new IllegalStateException("Unable to get guess format from file ending");
        } else {
            return (RDFFormat)fileFormat;
        }
    }

    public static RDFParser getParser(RDFFormat format) {
        RDFParserRegistry reg = RDFParserRegistry.getInstance();
        RDFParserFactory factory = reg.get(format);
        return factory.getParser();
    }

    public void check(String fileName) throws IOException, RDFParseException, RDFHandlerException {
        File file = new File(fileName);
        System.out.println("Checking: " + file.getAbsolutePath());
        FileReader reader = null;
        reader = new FileReader(file);
        RDFFormat rdfFormat = getFormat(fileName);
        RDFParser parser = getParser(rdfFormat);
        parser.setRDFHandler(this);
        ParseErrorCollector collector = new ParseErrorCollector();
        parser.setParseErrorListener(collector);
        parser.setVerifyData(true);
        parser.parse (reader, DEFAULT_BASE_URI);
        boolean ok = true;
        if (!collector.getWarnings().isEmpty()){
            System.err.println(collector.getWarnings());
            ok = false;
        }
        if (!collector.getErrors().isEmpty()){
            System.err.println(collector.getErrors());
            ok = false;
        }
        if (!collector.getFatalErrors().isEmpty()){
            System.err.println(collector.getFatalErrors());
            ok = false;
        }
        if (ok){
            System.out.println ("OK!");
        }
    }

    public static void main(String[] args) throws Exception {
        RdfChecker checker = new RdfChecker();
        checker.check(args[0]);
    }
}