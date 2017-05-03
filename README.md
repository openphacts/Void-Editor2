# VoID Editor v2

The Open PHACTS VoID editor v2 is developed and maintained by <a href="http://ltatakis.com" target="_blank"
rel="dcterms:creator doap:maintainer">Lefteris Tatakis</a>, as a final year undergraduate project at the University of Manchester, UK.
This project is supervised by Prof Carole Goble and has been developed within the context of the <a href="http://www.openphacts.com/" target="_blank">Open PHACTS</a> 
project and aims to help dataset publishers to create a valid, according to the <a href="http://www.openphacts.org/specs/2013/WD-datadesc-20130912/"
target="_blank">Open PHACTS specification</a>, VoID description for deployment
with their dataset.The code was last updated on <span property="dcterms:modified">
May 2016 </span>. The code for the Open PHACTS editor is available from <a href="https://github.com/openphacts/Void-Editor2" target="_blank">
https://github.com/openphacts/Void-Editor2</a>. In case you have a feature request or want to file a bug, please raise a GitHub issue.

__Features:__
- Create VoID according to [OPS specs](http://www.openphacts.org/specs/2013/WD-datadesc-20130912/)
- Upload existing VoID to continue work on it
- Upload your data to allow statistical analysis
- Connect to your SPARQL endpoint to allow statistical analysis
- Connects to [ORCID](http://orcid.org/) to get information about the dataset owner
- Cite the distribution formats the data is available in
- Reference incorporating datasets
- Exports VoID
- Allows users to view there progress so far - with "under the hood"
									
## Linkset Creator 

An extension of the VoID Editor to allow the creation of descriptions of the links between two datasets.

__Features:__
- Create VoID according to [OPS specs](http://www.openphacts.org/specs/2013/WD-datadesc-20130912/)
- Connects to [ORCID](http://orcid.org/) to get information about dataset owner
- Selecting the source and target datasets of the Linkset
- Exports VoID
- Allows users to view there progress so far - with "under the hood"

#Installation

The VoID Editor and Linkset Editor require a servlet engine such as [tomcat server](http://tomcat.apache.org/) to be running on your machine. We have tested the editors with Tomcat 7 running on CentOS.

The files can be built using [maven](http://maven.apache.org/) and issuing the command from the `voidEditor` directory.

```mvn clean package -DskipTests```

The resulting war file, in the target directory, can be deployed on your servlet engine in the usual way.

##Configuration

The name of the war file will determine is deployment location, i.e. `http://localhost:8080/name-of-war-file`. If you change this value, then you need to edit the `URLPreface` variable in `voidEditor/src/main/webapp/js/datasets/services.js`.
