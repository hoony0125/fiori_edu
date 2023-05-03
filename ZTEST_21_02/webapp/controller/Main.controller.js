sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	'sap/m/Token',
	"sap/ui/model/FilterOperator"
], function(Controller, JSONModel, Filter, Token, FilterOperator) {
	"use strict";
	var aData, oNewModel;
	var oFilterEbeln, oFilterBukrs;
	return Controller.extend("ZTEST_21_02.controller.Main", {

		onInit: function() {
			//	idEbeln = this.byId("idFilterEbeln").getValue();
			//	idBukrs = this.byId("idFilterBukrs").getValue();

			oFilterEbeln = this.getView().byId("idFilterEbeln");
			oFilterBukrs = this.getView().byId("idFilterBukrs");
			oFilterEbeln.getTokens();
			oFilterBukrs.getTokens();

			var fnValidator = function(args) {
				var text = args.text;
				return new Token({
					key: text,
					text: "*" + text + "*"
				});
			};

			oFilterEbeln.addValidator(fnValidator);
			oFilterBukrs.addValidator(fnValidator);
			this.onDataView();

		},
		onAfterRendering: function() {
			
			var oBinding = this.getView().byId("poList").getBinding("items");
			
			oBinding.attachChange( function (a) {
				// attachChange는 binding을 위한 메소드 같다. not function이 뜨면 getBinding이 맞는지 확인 
				var sLength = a.getSource().getModel().getBindings()[0].getLength();
				//a.getSource().getCount();
				this.getView().byId("cntRead").setText("조회건수 : " + sLength + "건");
			
			}.bind(this));

		},

		onDataView: function() {
			this._oModel = this.getOwnerComponent().getModel();

			this._oModel.read("/ZPO00HD_0020_DDL", {
				success: function(oData, response) {

					aData = oData.results;
					oNewModel = new JSONModel(aData);
					this.getOwnerComponent().setModel(oNewModel, "poModel");

				}.bind(this),
				error: function(oError) {}
			});
		},
		onSearch: function(oEvent) {
			//	var oListBinding = this.getView().byId("poList").getModel("poModel").getData();
			var oListBinding = this.getView().byId("poList").getBinding("items");
			var sEbelnLength = oFilterEbeln.getTokens().length;
			var sBukrsLength = oFilterBukrs.getTokens().length;
			var sEbelnWord = [];
			var sBukrsWord = [];
			var aFilters = [],
				oFilter1 = [],
				oFilter2 = [];

			for (var i = 0; i < sEbelnLength; i++) {
				//	var aTokens = ;
				var aKey = oFilterEbeln.getTokens()[i].getKey();
				sEbelnWord.push(aKey);
			}
			sEbelnWord.forEach(function(item) {
				oFilter1 = new Filter({
					path: "Ebeln",
					operator: sap.ui.model.FilterOperator.Contains,
					value1: item,
					value2: null
				});
				aFilters.push(oFilter1);
			
			/* 방법2 
			aFilters.push(new Filter({
					path: "Ebeln",
					operator: sap.ui.model.FilterOperator.Contains,
					value1: oFilterEbeln.getTokens()[i].getKey();
			})
			*/

			});

			for (var j = 0; j < sBukrsLength; j++) {
				//	var bTokens = ;
				var bKey = oFilterBukrs.getTokens()[j].getKey();
				sBukrsWord.push(bKey);
			}
			sBukrsWord.forEach(function(item) {
				oFilter2 = new Filter({
					path: "Bukrs",
					operator: sap.ui.model.FilterOperator.Contains,
					value1: item,
					value2: null
				});
				aFilters.push(oFilter2);
			});

			//필터 배열에 필터 객체 추가	

			//aFilters.push(oFilter);

			// 필터링
			oListBinding.filter(aFilters, "Application");
	

		},
		onClear: function() {
			oFilterEbeln.removeAllTokens();
			oFilterBukrs.removeAllTokens();

			this.onSearch();
			
		/* 방법2 	
		var oListBinding = this.getView().byId("poList").getBinding("items");
			oListBinding.filter([],"Application");*/
		},
		onNavButton: function(oEvent) {

			var sPath = oEvent.getParameter("listItem").getBindingContextPath();
			// oEvent.getSource().getBindingContext().getProperty()
			var sEbeln = this.getView().getModel().getData(sPath).Ebeln;

			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.navTo("routerDetail", {
				"Ebeln": sEbeln
			});
		}

	});

});