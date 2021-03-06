package editor.domain;

/**
 * The object which represents the information sent from the AngularJS side for the Linkset Void Creation.
 * @since 19/06/2014
 * @author Lefteris Tatakis
 */
public class LinksetAttributes{
	  public String givenName = "";	
	  public String familyName = "";
	  public String userEmail= "";
	  public String title = "";
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
	  public String downloadFrom= "";
	  public String URI ="http://www.openphacts.org/";
	  public String ORCID ="";
	  public String relationship ="";
	  public String justification ="";
	  public Object userTarget ="";
	  public Object userSource ="";
      public Object contributors;
      public String contributor ="";
      public String curator ="";
      public String author ="";
	  public String assertionMethod = "";
	  public String subjectDatatype = "";
	  public String targetDatatype = "";
}