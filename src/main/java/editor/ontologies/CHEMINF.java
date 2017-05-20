/* Copyright (C) 2013  Egon Willighagen <egonw@users.sf.net>
 *
 * License: new BSD.
 */
package editor.ontologies;
import com.hp.hpl.jena.rdf.model.Property;
import com.hp.hpl.jena.rdf.model.Resource;
import com.hp.hpl.jena.rdf.model.ResourceFactory;

public class CHEMINF {

	public static final String URI =
			"http://semanticscience.org/resource/";

	private static final Resource resource(String local) {
		return ResourceFactory.createResource(URI + local);
	}

	private static final Property property(String local) {
		return ResourceFactory.createProperty(URI, local);
	}

	public static final Property CHEMINF_000200 = property("CHEMINF_000200"); // has attribute

	// Database Identifiers
	public static final Resource CHEMINF_000405 = resource("CHEMINF_000405"); // ChemSpider
	public static final Resource CHEMINF_000406 = resource("CHEMINF_000406"); // DrugBank
	public static final Resource CHEMINF_000407 = resource("CHEMINF_000407"); // ChEBI
	public static final Resource CHEMINF_000408 = resource("CHEMINF_000408"); // HMDB
	public static final Resource CHEMINF_000409 = resource("CHEMINF_000409"); // KEGG
	public static final Resource CHEMINF_000410 = resource("CHEMINF_000410"); // Wikipedia
	public static final Resource CHEMINF_000411 = resource("CHEMINF_000411"); // Reactome
	public static final Resource CHEMINF_000412 = resource("CHEMINF_000412"); // PubChem
}
