<!doctype html>
<html lang="en" ng-app="editorApp" ng-controller="editorCtrl">
<head>
  <meta charset="utf-8">
  <meta name="description" content="Dataset Description Tool">
  <meta name="author" content="Lefteris Tatakis">
    <link rel="shortcut icon" href="img/ops_logo.png" >
  <title ng-bind="title">...</title>
  <link rel="stylesheet" href="css/bootstrap-responsive.css">
  <link rel="stylesheet" href="css/progressbar.css">
  <link rel="stylesheet" href="css/bootstrap-combined.min.css">
  <link rel="stylesheet" href="css/animations.css">
  <link rel="stylesheet" href="css/app.css">
  <link rel="stylesheet" href="css/glyphicons.css">
</head>
<body>
<header>
    <!--[if lt IE 10]>
    <alert>
        <strong style="vertical-align: top">Warning:</strong>
        <div style="display: inline-block">
            Your experience of this application may suffer in outdated versions of Internet Explorer,
            including the potential corruption or loss of important information.<br/>
            You are strongly advised to update.
        </div>
    </alert>
    <![endif]-->
    <img class="pull-left" src="img/ops_logo.png" alt="Logo">
    <div class="span12">
        <div class="row ">
              <div class="pull-left">
                <h1><span ng-bind="title">...</span> <small>v2.0</small></h1>
              </div>
        </div>
    </div>
</header>

 <div class="container">
     <div class="row span12">
         <progress ng-controller="editorCarouselCtrl" percent="dynamicProgress"></progress>
     </div>
    <div ng-controller="editorCarouselCtrl"  class="row span12">
        <form role="form" class="form-inline simple-form" role="form" novalidate>
            <carousel interval="interval"  class="carousel">
                <slide ng-repeat="slide in slides" active="slide.active">

                    <div class="custom_carousel" >
                        <div class="include" ng-include="slide.page" >
                        </div>
                    </div>
                </slide>
            </carousel>
        </form>
    </div>

    <div class="container-fluid">
        <div ng-controller="ModalExportCtrl">
            <script type="text/ng-template" id="myModalContent.html">
                <div class="modal-header">
                    <h3>VoID Produced</h3>
                </div>
                <div class="modal-body" >
                    <textarea class="field span8" rows="15" columns="15">
                       {{data}}
                    </textarea>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-warning" ng-click="close()">Close</button>
                </div>
            </script>
            <button  type="button" class="btn btn-default pull-right" ng-click="open()"> Under the Hood</button>
            <button  type="button" class="btn btn-default pull-left "  disabled="disabled"> Advanced User</button>
        </div>
    </div>
    
     <div class="row span12">
         <footer>
             <small>
                 <span class="muted"><span ng-bind="title">...</span> v2 copyright &copy; 2013 OpenPhacts</span>
             </small>
         </footer>
     </div>
 </div>

<script src="lib/jquery/jquery-1.10.2.js"></script>
<script src="lib/jquery-ui/jquery-ui-1.10.3.custom.js"></script>
<script src="lib/angular/angular-stable.js">  </script>
<script src="lib/angular/angular-route.js">  </script>
<script src="lib/angular/angular-resource.js">  </script>
<script src="lib/ui-bootstrap/ui-bootstrap-tpls-0.6.0.js"></script>
<script src="lib/moment/moment.min.js"></script>
<script src="js/controllers.js"></script>
<script src="js/services.js"></script>
<script src="js/app.js"></script>
<script src="js/modal.js"></script>
<script src="js/datepicker.js"></script>
<script src="js/directives.js"></script>
</body>
</html>
