/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"project/ZTrackJob/test/integration/AllJourneys"
	], function () {
		QUnit.start();
	});
});