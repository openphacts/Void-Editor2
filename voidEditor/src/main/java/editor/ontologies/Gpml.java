package editor.ontologies; 
import com.hp.hpl.jena.rdf.model.*;
 
/**
 * Vocabulary definitions from http://vocabularies.wikipathways.org/gpml.rdf 
 * @author Auto-generated by schemagen on 28 Jan 2013 15:45 
 */
public class Gpml {
    /** <p>The RDF model that holds the vocabulary terms</p> */
    private static Model m_model = ModelFactory.createDefaultModel();
    
    /** <p>The namespace of the vocabulary as a string</p> */
    public static final String NS = "http://vocabularies.wikipathways.org/gpml#";
    
    /** <p>The namespace of the vocabulary as a string</p>
     *  @see #NS
     *  @return Namespace*/
    public static String getURI() {return NS;}
    
    /** <p>The namespace of the vocabulary as a resource</p> */
    public static final Resource NAMESPACE = m_model.createResource( NS );
    
    public static final Property align = m_model.createProperty( "http://vocabularies.wikipathways.org/gpml#align" );
    
    public static final Property anchorPosition = m_model.createProperty( "http://vocabularies.wikipathways.org/gpml#anchorPosition" );
    
    public static final Property anchorShape = m_model.createProperty( "http://vocabularies.wikipathways.org/gpml#anchorShape" );
    
    public static final Property arrowHead = m_model.createProperty( "http://vocabularies.wikipathways.org/gpml#arrowHead" );
    
    public static final Property arrowTowards = m_model.createProperty( "http://vocabularies.wikipathways.org/gpml#arrowTowards" );
    
    /** <p>Here comes the description on: author</p> */
    public static final Property author = m_model.createProperty( "http://vocabularies.wikipathways.org/gpml#author" );
    
    /** <p>Here comes the description on: biopaxref</p> */
    public static final Property biopaxref = m_model.createProperty( "http://vocabularies.wikipathways.org/gpml#biopaxref" );
    
    /** <p>Here comes the description on: centerx</p> */
    public static final Property centerx = m_model.createProperty( "http://vocabularies.wikipathways.org/gpml#centerx" );
    
    /** <p>Here comes the description on: centery</p> */
    public static final Property centery = m_model.createProperty( "http://vocabularies.wikipathways.org/gpml#centery" );
    
    public static final Property color = m_model.createProperty( "http://vocabularies.wikipathways.org/gpml#color" );
    
    /** <p>Here comes the description on: data-source</p> */
    public static final Property data_source = m_model.createProperty( "http://vocabularies.wikipathways.org/gpml#data-source" );
    
    public static final Property database = m_model.createProperty( "http://vocabularies.wikipathways.org/gpml#database" );
    
    /** <p>Here comes the description on: email</p> */
    public static final Property email = m_model.createProperty( "http://vocabularies.wikipathways.org/gpml#email" );
    
    public static final Property fillcolor = m_model.createProperty( "http://vocabularies.wikipathways.org/gpml#fillcolor" );
    
    public static final Property fontattributes = m_model.createProperty( "http://vocabularies.wikipathways.org/gpml#fontattributes" );
    
    public static final Property fontdecoration = m_model.createProperty( "http://vocabularies.wikipathways.org/gpml#fontdecoration" );
    
    public static final Property fontname = m_model.createProperty( "http://vocabularies.wikipathways.org/gpml#fontname" );
    
    public static final Property fontsize = m_model.createProperty( "http://vocabularies.wikipathways.org/gpml#fontsize" );
    
    public static final Property fontstrikethru = m_model.createProperty( "http://vocabularies.wikipathways.org/gpml#fontstrikethru" );
    
    public static final Property fontstyle = m_model.createProperty( "http://vocabularies.wikipathways.org/gpml#fontstyle" );
    
    public static final Property fontweight = m_model.createProperty( "http://vocabularies.wikipathways.org/gpml#fontweight" );
    
    public static final Property genmappNotes = m_model.createProperty( "http://vocabularies.wikipathways.org/gpml#genmappNotes" );
    
    public static final Property genmappremarks = m_model.createProperty( "http://vocabularies.wikipathways.org/gpml#genmappremarks" );
    
    public static final Property graphics = m_model.createProperty( "http://vocabularies.wikipathways.org/gpml#graphics" );
    
    /** <p>Here comes the description on: graphid</p> */
    public static final Property graphid = m_model.createProperty( "http://vocabularies.wikipathways.org/gpml#graphid" );
    
    /** <p>Here comes the description on: graphref</p> */
    public static final Property graphref = m_model.createProperty( "http://vocabularies.wikipathways.org/gpml#graphref" );
    
    /** <p>Here comes the description on: groupid</p> */
    public static final Property groupid = m_model.createProperty( "http://vocabularies.wikipathways.org/gpml#groupid" );
    
    /** <p>Here comes the description on: groupref</p> */
    public static final Property groupref = m_model.createProperty( "http://vocabularies.wikipathways.org/gpml#groupref" );
    
    public static final Property hasAnchor = m_model.createProperty( "http://vocabularies.wikipathways.org/gpml#hasAnchor" );
    
    public static final Property height = m_model.createProperty( "http://vocabularies.wikipathways.org/gpml#height" );
    
    public static final Property homologyConvert = m_model.createProperty( "http://vocabularies.wikipathways.org/gpml#homologyConvert" );
    
    /** <p>Here comes the description on: href</p> */
    public static final Property href = m_model.createProperty( "http://vocabularies.wikipathways.org/gpml#href" );
    
    public static final Property id = m_model.createProperty( "http://vocabularies.wikipathways.org/gpml#id" );
    
    /** <p>Here comes the description on: last-modified</p> */
    public static final Property last_modified = m_model.createProperty( "http://vocabularies.wikipathways.org/gpml#last-modified" );
    
    /** <p>Here comes the description on: license</p> */
    public static final Property license = m_model.createProperty( "http://vocabularies.wikipathways.org/gpml#license" );
    
    public static final Property linestyle = m_model.createProperty( "http://vocabularies.wikipathways.org/gpml#linestyle" );
    
    public static final Property linethickness = m_model.createProperty( "http://vocabularies.wikipathways.org/gpml#linethickness" );
    
    /** <p>Here comes the description on: maintainer</p> */
    public static final Property maintainer = m_model.createProperty( "http://vocabularies.wikipathways.org/gpml#maintainer" );
    
    /** <p>Here comes the description on: name</p> */
    public static final Property name = m_model.createProperty( "http://vocabularies.wikipathways.org/gpml#name" );
    
    /** <p>Here comes the description on: organism</p> */
    public static final Property organism = m_model.createProperty( "http://vocabularies.wikipathways.org/gpml#organism" );
    
    public static final Property rectattributes = m_model.createProperty( "http://vocabularies.wikipathways.org/gpml#rectattributes" );
    
    public static final Property relX = m_model.createProperty( "http://vocabularies.wikipathways.org/gpml#relX" );
    
    public static final Property relY = m_model.createProperty( "http://vocabularies.wikipathways.org/gpml#relY" );
    
    public static final Property shapestyleattributes = m_model.createProperty( "http://vocabularies.wikipathways.org/gpml#shapestyleattributes" );
    
    /** <p>Here comes the description on: statetype</p> */
    public static final Property statetype = m_model.createProperty( "http://vocabularies.wikipathways.org/gpml#statetype" );
    
    /** <p>Here comes the description on: style</p> */
    public static final Property style = m_model.createProperty( "http://vocabularies.wikipathways.org/gpml#style" );
    
    /** <p>Here comes the description on: textlabel</p> */
    public static final Property textlabel = m_model.createProperty( "http://vocabularies.wikipathways.org/gpml#textlabel" );
    
    public static final Property unifiedIdentifier = m_model.createProperty( "http://vocabularies.wikipathways.org/gpml#unifiedIdentifier" );
    
    public static final Property valign = m_model.createProperty( "http://vocabularies.wikipathways.org/gpml#valign" );
    
    /** <p>Here comes the description on: version</p> */
    public static final Property version = m_model.createProperty( "http://vocabularies.wikipathways.org/gpml#version" );
    
    public static final Property width = m_model.createProperty( "http://vocabularies.wikipathways.org/gpml#width" );
    
    public static final Property wikipathwaysDescription = m_model.createProperty( "http://vocabularies.wikipathways.org/gpml#wikipathwaysDescription" );
    
    public static final Property zorder = m_model.createProperty( "http://vocabularies.wikipathways.org/gpml#zorder" );
    
    public static final Resource Anchor = m_model.createResource( "http://vocabularies.wikipathways.org/gpml#Anchor" );
    
    /** <p>Here comes the description on: Biopax</p> */
    public static final Resource Biopax = m_model.createResource( "http://vocabularies.wikipathways.org/gpml#Biopax" );
    
    /** <p>Here comes the description on: DataNode</p> */
    public static final Resource DataNode = m_model.createResource( "http://vocabularies.wikipathways.org/gpml#DataNode" );
    
    /** <p>Here comes the description on: Group</p> */
    public static final Resource Group = m_model.createResource( "http://vocabularies.wikipathways.org/gpml#Group" );
    
    /** <p>Here comes the description on: InfoBox</p> */
    public static final Resource InfoBox = m_model.createResource( "http://vocabularies.wikipathways.org/gpml#InfoBox" );
    
    /** <p>Here comes the description on: Label</p> */
    public static final Resource Label = m_model.createResource( "http://vocabularies.wikipathways.org/gpml#Label" );
    
    /** <p>Here comes the description on: Legend</p> */
    public static final Resource Legend = m_model.createResource( "http://vocabularies.wikipathways.org/gpml#Legend" );
    
    /** <p>Here comes the description on: Line</p> */
    public static final Resource Line = m_model.createResource( "http://vocabularies.wikipathways.org/gpml#Line" );
    
    /** <p>Here comes the description on: Pathway</p> */
    public static final Resource Pathway = m_model.createResource( "http://vocabularies.wikipathways.org/gpml#Pathway" );
    
    public static final Resource Point = m_model.createResource( "http://vocabularies.wikipathways.org/gpml#Point" );
    
    public static final Resource PublicationXref = m_model.createResource( "http://vocabularies.wikipathways.org/gpml#PublicationXref" );
    
    /** <p>Here comes the description on: Shape</p> */
    public static final Resource Shape = m_model.createResource( "http://vocabularies.wikipathways.org/gpml#Shape" );
    
    /** <p>Here comes the description on: State</p> */
    public static final Resource State = m_model.createResource( "http://vocabularies.wikipathways.org/gpml#State" );
    
    public static final Resource Xref = m_model.createResource( "http://vocabularies.wikipathways.org/gpml#Xref" );
    
    public static final Resource requiresCurationAttention = m_model.createResource( "http://vocabularies.wikipathways.org/gpml#requiresCurationAttention" );
    
    public static final Resource University = m_model.createResource( "http://vocabularies.wikipathways.org/gpml#Maastricht%20University" );
    
    public static final Resource andra = m_model.createResource( "http://vocabularies.wikipathways.org/gpml#andra" );
    
}
