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

	public class DataUpload {
		private  File importedFile;
		private JSONObject result ;
		
		public DataUpload(InputStream uploadedInputStream){
			importedFile = writeToTempFile(uploadedInputStream);
			processData();
		}
		
		private void processData() {
			 
			checkRDF();
			
			Model model = ModelFactory.createDefaultModel(); 
			String path = importedFile.getAbsolutePath() ;
			model.read( path, "TURTLE") ;
			Resource mainResourse = null;

			String OS = System.getProperty("os.name").toLowerCase();
			
			if (OS.indexOf("win") >= 0 ) {
				mainResourse = model.getResource(path);
			} else {
				mainResourse = model.getResource("file://"+path); 
			}
			
			// Store data 
			//Run queries
			//Retrieve data
			//Store data in array or string
			//Send to user
			//http://jena.apache.org/documentation/query/app_api.html
			//maybe use construct - see in testing
			String queryString = "Select (count(*) as ?triples)  where { ?s ?o ?p };" ;
			Query query = QueryFactory.create(queryString) ;
			QueryExecution qexec = QueryExecutionFactory.create(query, model) ;
			try {
			  ResultSet results = qexec.execSelect() ;
			  for ( ; results.hasNext() ; )
			  {
			    QuerySolution soln = results.nextSolution() ;
			      //RDFNode x = soln.get("varName") ;       // Get a result variable by name.
			      //Resource r = soln.getResource("VarR") ; // Get a result variable - must be a resource
			      //Literal l = soln.getLiteral("VarL") ;   // Get a result variable - must be a literal
			    result.put("totalNumberOfTriples" , "");
			    result.put("numberOfUniqueSubjects" , "");
			    result.put("numberOfUniqueSubjects" , "");
			  }
			} finally { qexec.close() ; }
		}

		public JSONObject getStatistics(){
			return result;
		}
		
		private void checkRDF() {
			RdfChecker checker = new RdfChecker();
	         try {
				checker.check(importedFile);
		  	 } catch (RDFParseException e) {
				System.err.println("In Imported file --> Got a RDFParseException!! ");
				e.printStackTrace();
			 } catch (RDFHandlerException e) {
				System.out.println("In Imported file -->Got a RDFHandlerException ");
				e.printStackTrace();
			 } catch (IOException e) {
				System.out.println("In Imported file -->Got a IOException ");
				e.printStackTrace();
			 }
		}
		
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


