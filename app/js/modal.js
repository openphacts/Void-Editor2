'use strict';

//angular.module('app', ['ui.bootstrap']);
// http://angular-ui.github.io/bootstrap/

var ModalExportCtrl = function ($scope, $modal, $log) {
    $scope.open = function () {

        $modal.open({
            templateUrl: 'myModalContent.html',
            controller: ModalInstanceCtrl
        });
    };


};

var ModalInstanceCtrl = function ($scope, $modalInstance) {
    $scope.close = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.data = " @prefix dcterms: <http://purl.org/dc/terms/> .\n "+
        "@prefix foaf: <http://xmlns.com/foaf/0.1/> .\n"+
        "@prefix pav: <http://purl.org/pav/2.0/> .\n"+
        "@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .\n"+
        "@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .\n"+
        "@prefix skos: <http://www.w3.org/2004/02/skos/core#> .\n"+
        "@prefix void: <http://rdfs.org/ns/void#> .\n"+
        "@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .\n"+
        "@prefix : <#> .\n"+
        "## your VoID description \n"+
              " <> rdf:type void:DatasetDescription ;\n"+
              "dcterms:title 'Example VoID Document'^^xsd:string ;\n"+
            "dcterms:description 'Example description of the VoID document'^^xsd:string ;\n"+
           "pav:createdBy <> ;\n"+
          "pav:createdOn '2013-10-28'^^xsd:date ;\n"+
        "foaf:primaryTopic :myDS .\n"+
        "";
};