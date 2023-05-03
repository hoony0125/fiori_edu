sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"ZTEST_21_02/model/models"
], function(UIComponent, Device, models) {
	"use strict";

	return UIComponent.extend("ZTEST_21_02.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function() {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// set the device model
			this.setModel(models.createDeviceModel(), "device");

			// Router 초기화 / 호출
			this.getRouter().initialize();
			
			this._hModel();
		},
		_hModel:function(){
			var hash = window.location.hash;
			var hList = hash.split("/");
			var oJSONModel = new sap.ui.model.json.JSONModel(hList);
			this.setModel(oJSONModel,"hModel");
			
			var ebelnHash = oJSONModel.getData()[2];
			return ebelnHash;
		
		}
	});
});