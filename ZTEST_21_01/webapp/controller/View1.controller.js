sap.ui.define([
	"sap/ui/core/mvc/Controller",
	'sap/m/MessageToast'
], function(Controller,MessageToast) {
	"use strict";

	return Controller.extend("istn.erpZTEST_21_01.controller.View1", {
	
		onPressIcon : function(oEvent){
			var sPath = oEvent.getSource().getBindingContext("Flight").getPath().split("/")[3];
			var oModel = oEvent.getSource().getBindingContext("Flight").getModel();
			
			// var oSeatMax = oModel.getBindings()[0].oList[sPath].Seatsmax;
			// var oSeatsocc = oModel.getBindings()[0].oList[sPath].Seatsocc;
			
			var oSeatMax = oModel.getData().d.results[sPath].Seatsmax;
			var oSeatsocc = oModel.getData().d.results[sPath].Seatsocc;
			
			var results = ( oSeatsocc / oSeatMax ) * 100;

			MessageToast.show(Math.round( results * 100 ) / 100  + "% ");
		},
		
		onPressInfo : function(oEvent){
			var sPath = oEvent.getSource().getBindingContext("Flight").getPath().split("/")[3];
			var oPlanetype = oEvent.getSource().getBindingContext("Flight").getModel().getData().d.results[sPath].Planetype;
			
			MessageToast.show("추가정보 : " + oPlanetype);
		},
		
		onPressCal : function(){
			var oModel = this.getView().byId("myTable").getModel("Flight");	
			var oLength = oModel.getBindings()[0].getLength();
			var totalOcc = 0, totalMax = 0, occ = 0, max = 0, i = 0, j = 0;
		
			for (i = 0; i < oLength; i++){
			//	occ = oModel.getBindings()[0].oList[i].Seatsocc;
				occ = oModel.getBindings()[0].getModel().getData().d.results[i].Seatsocc;
				totalOcc += occ;
			}
			
			for (j =  0; j < oLength; j++){
				//max = oModel.getBindings()[0].oList[j].Seatsmax;
				max = oModel.getBindings()[0].getModel().getData().d.results[j].Seatsmax;
				totalMax += max;
			}
		
			MessageToast.show("Total OCC : " + totalOcc + "\n" +
							  "Total MAX : " + totalMax + "\n" +	
							  "Total % : " + Math.round( (totalOcc / totalMax) * 10000 ) / 100 + "%");
		},
		
		onPressIconBtn: function(){
		var oModel = this.getView().getModel("i18n");
		var oText = oModel.getResourceBundle().getText("buttonClick");
		//this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("tableTitle")	
			MessageToast.show(oText);
		},
		
		onChange : function(){
			var sState = this.getView().byId("switch").getProperty("state");
			
			if(sState){
				this.getView().byId("iconBtn").setVisible(true);
				this.getView().byId("calBtn").setVisible(true);
			}
			else{
				this.getView().byId("iconBtn").setVisible(false);
				this.getView().byId("calBtn").setVisible(false);
			}
		}
	});
});