const { src, dest } = require('gulp');
const concat = require('gulp-concat');
const umd = require('gulp-umd');
const minify = require('gulp-minify');

function build() {
    return src([
            'LICENSE',
            'src/core.js',
            'src/components/*.js',
            'src/certhd3/*.js'
        ])
        .pipe(concat('vflow.js'))
        .pipe(umd({
            exports: function(file) {
                let componentTypes = [
                    "Value",
                    "Transformation",
                    "Combination",
                    "D3Scatterplot",
                    "DSVLoader",
                    "DSVParser",
                    "HTMLSelect",
                    "HTMLMultiSelect",
                    "HTMLValue",
                    "HTMLSlider",
                    "RESTCall",
                    "AnalyticsRESTCall",
                    "Datatable",
                    "D3RadarChart",
                    "D3ForceDirectedGraph"
                ];

                let testComponentTypes = [
                    "Mean"
                ];

                let exportStr = "{";
                componentTypes.forEach(type => {
                    exportStr += type + ": " + type + ",";
                });
                testComponentTypes.forEach(type => {
                    exportStr += type + ": " + type + ",";
                });
                exportStr += `
                    link: link,
                `;
                exportStr += "componentTypes: " + JSON.stringify(componentTypes);
                exportStr += "}";

                return exportStr;
            },
            namespace: function(file) {
                return 'vf'
            }
        }))
        .pipe(minify())
        .pipe(dest('build'))
}

exports.build = build;
