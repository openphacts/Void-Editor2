package editor.ontologies; 
import com.hp.hpl.jena.rdf.model.*;
 
/**
 * Vocabulary definitions from http://labs.mondeca.com/vocab/voaf/voaf.rdf 
 * @author Auto-generated by schemagen on 23 Mar 2012 20:30 
 */
public class Voaf {
    /** <p>The RDF model that holds the vocabulary terms</p> */
    private static Model m_model = ModelFactory.createDefaultModel();
    
    /** <p>The namespace of the vocabulary as a string</p> */
    public static final String NS = "http://labs.mondeca.com/vocab/voaf#";
    
    /** <p>The namespace of the vocabulary as a string</p>
     *  @see #NS */
    public static String getURI() {return NS;}
    
    /** <p>The namespace of the vocabulary as a resource</p> */
    public static final Resource NAMESPACE = m_model.createResource( NS );
    
    /** <p>A vocabulary used in the linked data cloud. An instance of voaf:Vocabulary 
     *  relies on or is used by at least another instance of voaf:Vocabulary</p>
     */
    public static final Resource Vocabulary = m_model.createResource( "http://labs.mondeca.com/vocab/voaf#Vocabulary" );
    
    /** <p>Dublin Core properties isPartOf and hasPart are used to link a vocabulary 
     *  to a vocabulary spaceA vocabulary space defines any relevant grouping of vocabularies 
     *  e.g., designed for similar purposes or domains, or designed by the same publisher 
     *  or the same project, etc. A vocabulary can belong to zero, one or more vocabulary 
     *  spaces.</p>
     */
    public static final Resource VocabularySpace = m_model.createResource( "http://labs.mondeca.com/vocab/voaf#VocabularySpace" );
    
    /** <p>-Version 1.1: depreciation of voaf:exampleDataset replaced by voaf:dataset 
     *  -Version 1: creationThis is work in progress. Do not consider any element 
     *  of this ontology as cast in stone.</p>
     */
    public static final Resource voaf = m_model.createResource( "http://labs.mondeca.com/vocab/voaf" );
    
}
