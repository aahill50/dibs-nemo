/*global nemo:true, describe:true, it:true */
var Nemo = require('nemo'),
    chai = require('chai'),
    expect = chai.expect,
    mocha = require('mocha'),
    plugins = require('./config/plugins.json'),
    nemoFactory = require('nemo-mocha-factory'),
    nemo = {},
    setup = {
        "view": ["homepage"]
    };

process.env.nemoData = JSON.stringify({
    targetBrowser: "chrome",
    targetServer: "localhost",
    localServer: true,
    seleniumJar: "/usr/bin/selenium-server-standalone.jar",
    targetBaseUrl: "http://www.1stdibs.com",
    autoBaseDir: __dirname
});

describe('1stdibs - Global Search', function() {
    this.timeout(5000); //Set the default ms to wait for a page load before failing
    nemoFactory({"context": nemo, "plugins": plugins, "setup": setup});

    beforeEach(function(done) {
        nemo.driver.get(nemo.props.targetBaseUrl);
        nemo.driver.sleep(100).then(function() {
            done();
        }, function(err) {
            done(err);
        });
    });

    it('should have a search input field', function(done) {
        var page = nemo.view.homepage;

        page.searchBarVisible().then(function(isVisible) {
                done();
            }, function(err) {
                done(err);
            });
    });

    it('should show search results when a valid search term is entered', function(done) {
        var page = nemo.view.homepage;

        page.searchBar().sendKeys("gold");
        nemo.driver.sleep(500).then(function() {
            page.searchResultsVisible().then(function(isVisible) {
                if (isVisible) {
                    return done();
                }
                return done(new Error("Search results not visible"));
            }, function(err) {
                done(err);
            });
        })
    });

    it('should not show search results when an invalid search term is entered', function(done) {
        var page = nemo.view.homepage;

        page.searchBar().sendKeys("hjkfsahjk");
        nemo.driver.sleep(500).then(function() {
            page.searchResultsVisible().then(function(isVisible) {
                if (!isVisible) {
                    return done();
                }
                return done(new Error("Search results were visible"));
            }, function(err) {
                done(err);
            });
        })
    });
});



