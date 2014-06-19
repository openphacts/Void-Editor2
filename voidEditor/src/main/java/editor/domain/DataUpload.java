package editor.domain;

	import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

import org.json.simple.JSONObject;
import org.openrdf.rio.RDFHandlerException;
import org.openrdf.rio.RDFParseException;

import com.hp.hpl.jena.query.Query;
import com.hp.hpl.jena.query.QueryExecution;
import com.hp.hpl.jena.query.QueryExecutionFactory;
import com.hp.hpl.jena.query.QueryFactory;
import com.hp.hpl.jena.query.QuerySolution;
import com.hp.hpl.jena.query.ResultSet;
import com.hp.hpl.jena.rdf.model.Literal;
import com.hp.hpl.jena.rdf.model.Model;
import com.hp.hpl.jena.rdf.model.ModelFactory;
import com.hp.hpl.jena.rdf.model.Property;
import com.hp.hpl.jena.rdf.model.RDFNode;
import com.hp.hpl.jena.rdf.model.Resource;
import com.hp.hpl.jena.rdf.model.Statement;
import com.hp.hpl.jena.rdf.model.StmtIterator;

import editor.validator.RdfChecker;
/**
 * This class handles potential datasets which will be eventually statistically analysed.
 *
 * @since 19/06/2014
 * @author Lefteris Tatakis
 *
 */
	public class DataUpload {
		private  File importedFile;
		private JSONObject result ;

    /**
     * Contructor. Called by VoidService in order to process the data the user provided.
     * @param uploadedInputStream
     * @throws RDFParseException
     * @throws RDFHandlerException
     */
		public DataUpload(InputStream uploadedInputStream) throws RDFParseException, RDFHandlerException{
			importedFile = writeToTempFile(uploadedInputStream);
			processData();
		}

    /**
     * This class checks if data is valid and then calls the statistical analysis classes.
     * @throws RDFParseException
     * @throws RDFHandlerException
     */
		private void processData() throws RDFParseException, RDFHandlerException {
			 
			checkRDF();
			
			Model model = ModelFactory.createDefaultModel(); 
			String path = importedFile.getAbsolutePath() ;
			model.read( path );//, "TURTLE") ;
			Resource mainResourse = null;

			String OS = System.getProperty("os.name").toLowerCase();
			
			if (OS.indexOf("win") >= 0 ) {
				mainResourse = model.getResource(path);
			} else {
				mainResourse = model.getResource("file://"+path); 
			}
			
			DatasetStatistics statisticsObj = new DatasetStatistics( );
			result =  statisticsObj.queryLocalDataModel(model);
			importedFile.delete();
		}

		public JSONObject getStatistics(){
			return result;
		}

    /**
     * Checks that the RDF which is imported is valid.
     * @throws RDFParseException
     * @throws RDFHandlerException
     */
		private void checkRDF() throws RDFParseException, RDFHandlerException {
			RdfChecker checker = new RdfChecker();
	         try {
				checker.check(importedFile);
		  	 } catch (RDFParseException e) {
				throw new RDFParseException("Input file parse error. Is it RDF?");
			 } catch (RDFHandlerException e) {
				throw new RDFHandlerException("Input file Handling error. Is it RDF?");
			 } catch (IOException e) {
				e.printStackTrace();
			 }
		}

    /**
     * Testing class - to print all statements.
     * @param model
     */
		private void printModel (Model model){
			StmtIterator iter = model.listStatements();
			printIterator(iter);
		}
		
		private void printIterator(StmtIterator iter) {
			while (iter.hasNext()) {
				   Statement stmt      = iter.nextStatement();  // get next statement
				    Resource  subject   = stmt.getSubject();     // get the subject
				    Property  predicate = stmt.getPredicate();   // get the predicate
				    RDFNode   object    = stmt.getObject();      // get the object

				    System.out.print(subject.toString());
				    System.out.print(" " + predicate.toString() + " ");
				    if (object instanceof Resource) {
				       System.out.print(object.toString());
				    } else {
				        // object is a literal
				        System.out.print(" \"" + object.toString() + "\"");
				    }
				    System.out.println(" .");
			   }
		}

        /**
         * Write the RDF created to temp file for processing.
         * @param uploadedInputStream
         * @return
         */
		private File writeToTempFile(InputStream uploadedInputStream) {
				File fileOutput= null;
				OutputStream out = null;
				try {
					fileOutput = File.createTempFile("void", ".ttl");
					out = new FileOutputStream(fileOutput);
					int read = 0;
					byte[] bytes = new byte[1024];
					out = new FileOutputStream(fileOutput);
					while ((read = uploadedInputStream.read(bytes)) != -1) {
						out.write(bytes, 0, read);
					}
					out.flush();
				} catch (IOException e) {
					e.printStackTrace();
				} finally { try {out.close();} catch (IOException e) {e.printStackTrace();}}
				
				if (fileOutput == null) System.err.println("File did not write!!!");
				return fileOutput;
			}
	}


