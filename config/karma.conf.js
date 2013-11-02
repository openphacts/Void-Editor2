module.exports = function(config){
    config.set({
    basePath : '../',

    files : [
        'voidEditor/src/main/webapp/lib/angular/angular.js'  ,
        'voidEditor/src/main/webapp/lib/angular/angular-*.js',
        'voidEditor/src/main/webapp/lib/ui-bootstrap/ui-bootstrap-tpl*.js',
        'voidEditor/src/main/webapp/js/**/*.js',
        'test/unit/*.js'
    ],

    exclude: ['voidEditor/src/main/webapp/lib/angular/angular-scenario.js'],

    autoWatch : true,

    frameworks: ['jasmine'],

    browsers : ['Chrome'],

    plugins : [
      'karma-junit-reporter',
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-jasmine'
    ],

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }

})}
