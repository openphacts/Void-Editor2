package editor.ontologies;
 
import com.hp.hpl.jena.rdf.model.*;
 
/**
 * 
 * @author Lefteris Tatakis
 */
public class BDB {
    /** <p>The RDF model that holds the vocabulary terms</p> */
    private static Model m_model = ModelFactory.createDefaultModel();
    
    /** <p>The namespace of the vocabulary as a string</p> */
    public static final String NS = "http://vocabularies.bridgedb.org/ops#";
    
    /** <p>The namespace of the vocabulary as a string</p>
     *  @see #NS
     *  @return Namespace */
    public static String getURI() {return NS;}
    
    /** <p>The namespace of the vocabulary as a resource</p> */
    public static final Resource NAMESPACE = m_model.createResource( NS );
    
    /** <p>The rdfs:Class that is the rdf:type of all entities in a class-based partition.</p> */
    public static final Property class_ = m_model.createProperty( "http://vocabularies.bridgedb.org/ops#class" );

    /** Assertion Method which created the Linkset. */
   public static final Property assertionMethod= m_model.createProperty("http://vocabularies.bridgedb.org/ops#assertionMethod");
    /** Objects Datatype of Linkset. */
   public static final Property targetDatatype= m_model.createProperty("http://vocabularies.bridgedb.org/ops#objectsDatatype");
    /** Subjects Datatype of Linkset.*/
   public static final Property subjectDatatype= m_model.createProperty("http://vocabularies.bridgedb.org/ops#subjectsDatatype");
    /** <p> The formal justification of the linkset.</p>*/
   public static final Property linksetJustification = m_model.createProperty( "http://vocabularies.bridgedb.org/ops#linksetJustification" );
}
