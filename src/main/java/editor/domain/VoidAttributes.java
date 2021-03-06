package editor.domain;

/**
 * The object which represents the information sent from the AngularJS side, for the Void Dataset description creation.
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
	  public String version= "";
	  public String previousVersion= "";
	  public String updateFrequency= "";
	  public Object sources;
      public Object distributions;
	  public Object contributors;
	  public String totalNumberOfTriples="";
	  public String numberOfUniqueSubjects="";
	  public String numberOfUniqueObjects ="";
	  public String ORCID ="";
      public String contributor ="";
      public String curator ="";
      public String author ="";
}