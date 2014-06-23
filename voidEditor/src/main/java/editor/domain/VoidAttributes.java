package editor.domain;

/**
 * The object which represents the information sent from the AngularJS side for the  Void Dataset description.
 * @author Lefteris Tatakis
 */

public class VoidAttributes{
	  public String givenName = "";	
	  public String familyName = "";
	  public String userEmail= "";
	  public String title= "" ;
	  public String description = ""; 
	  public String publisher= "";
	  public String datePublish= "";
	  public String monthPublish= "";
	  public String yearPublish= "";
	  public String webpage= "";
	  public String licence = "";
	  public String downloadFrom= "";
	  public String sparqlEndpoint= "";
	  public String version= "";
	  public String previousVersion= "";
	  public String updateFrequency= "";
	  public Object sources;
	  public Object contributors;
	  public String URI ="http://www.openphacts.org/";
	  public String totalNumberOfTriples="";
	  public String numberOfUniqueSubjects="";
	  public String numberOfUniqueObjects ="";
	  public String ORCID ="";
	  public String datasetType = "";
}