sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Filter",
	"sap/m/MessageToast",
	"sap/m/MessageBox",
	"sap/m/Dialog",
	"sap/m/List",
	"sap/m/StandardListItem",
		"sap/m/Button"
], function(Controller, Filter, MessageToast, MessageBox, Dialog, List, StandardListItem,Button) {
	"use strict";
	var aSelectedRows;
	return Controller.extend("ZTEST_21_03.controller.View1", {
		onInit: function() {
			this._oModel = this.getOwnerComponent().getModel();

			this._oModel.read("/ZSTD00HD_0030_DDL", {
				urlParameters: {
					"$expand": "to_STDItem"
				},
				success: function(oData, response) {
					var aData = oData.results;
					var aNewArr = [];
					aData.forEach(function(_header) {
						var aItems = _header.to_STDItem.results;
						aItems.forEach(function(_item) {
							_item.Bukrs = _header.Bukrs;
							_item.Butxt = _header.Butxt;
							_item.Lifnr = _header.Lifnr;
							_item.LifnrTxt = _header.LifnrTxt;
							_item.Bedat = _header.Bedat;
							_item.Ekorg = _header.Ekorg;
							_item.Ekotx = _header.Ekotx;
							_item.Ekgrp = _header.Ekgrp;
							_item.Eknam = _header.Eknam;
							aNewArr.push(_item);
						});
					});
					var oJsonModel = new sap.ui.model.json.JSONModel(aNewArr);
					oJsonModel.setSizeLimit(Number.MAX_SAFE_INTEGER);
					this.getView().setModel(oJsonModel, "myModel");

				}.bind(this),
				error: function(oError) {
					//debugger;
				}
			});
			this.cboDataView();
		},
		cboDataView: function() {
			this._oModel.read("/ZCBO00HD_0030_DDL", {
				success: function(oData, response) {
					var aData = oData.results;
					var oJsonModel = new sap.ui.model.json.JSONModel(aData);
					this.getView().setModel(oJsonModel, "cboModel");

				}.bind(this),
				error: function(oError) {
					//debugger;
				}
			});
		},

		onSearch: function(oEvent) {
			var oListBinding = this.getView().byId("stdTable").getBinding("items");

			var idEbeln = this.byId("idFilterEbeln").getValue();
			var idBukrs = this.byId("idFilterBukrs").getValue();
			var idLifnrTxt = this.byId("idFilterLifnrTxt").getValue();
			var idEkotx = this.byId("idFilterEkotx").getValue();
			var idEknam = this.byId("idFilterEknam").getValue();

			var aFilters = [];

			var oFilter1 = new Filter({
				path: "Ebeln",
				operator: sap.ui.model.FilterOperator.Contains,
				value1: idEbeln.toUpperCase(),
				value2: null
			});
			var oFilter2 = new Filter({
				path: "Bukrs",
				operator: sap.ui.model.FilterOperator.Contains,
				value1: idBukrs.toUpperCase(),
				value2: null
			});
			var oFilter3 = new Filter({
				path: "LifnrTxt",
				operator: sap.ui.model.FilterOperator.Contains,
				value1: idLifnrTxt.toUpperCase(),
				value2: null
			});
			var oFilter4 = new Filter({
				path: "Ekotx",
				operator: sap.ui.model.FilterOperator.Contains,
				value1: idEkotx.toUpperCase(),
				value2: null
			});
			var oFilter5 = new Filter({
				path: "Eknam",
				operator: sap.ui.model.FilterOperator.Contains,
				value1: idEknam.toUpperCase(),
				value2: null
			});

			//필터 배열에 필터 객체 추가	
			aFilters.push(oFilter1);
			aFilters.push(oFilter2);
			aFilters.push(oFilter3);
			aFilters.push(oFilter4);
			aFilters.push(oFilter5);

			// 필터링
			oListBinding.filter(aFilters, "Application");

		},
		onClear: function() {
			this.byId("idFilterEbeln").setValue("");
			this.byId("idFilterBukrs").setValue("");
			this.byId("idFilterLifnrTxt").setValue("");
			this.byId("idFilterEkotx").setValue("");
			this.byId("idFilterEknam").setValue("");
			this.onSearch();
		},
		onCreate: function(oEvent) {
			aSelectedRows = oEvent.getSource().getParent().getParent().getSelectedContextPaths();
			var oModel = this.getView().getModel("myModel");

			var aNaviItems = [];
			if (aSelectedRows.length !== 0) {
				MessageBox.show(
					aSelectedRows.length + "개의 데이터를 CBO테이블에 추가합니다.", {
						icon: MessageBox.Icon.INFORMATION,
						title: "확인",
						actions: [MessageBox.Action.YES, MessageBox.Action.NO],
						emphasizedAction: MessageBox.Action.YES,
						onClose: function(oAction) {
							if (oAction === "YES") {

								for (var i = 0; i < aSelectedRows.length; i++) {

									var sPath = aSelectedRows[i];
									var oItems = oModel.getProperty(sPath);

									delete oItems.__metadata;
									aNaviItems.push(oItems);

								}
								var oSendData = {
									"Zkey": "1",
									"to_CreateItem": aNaviItems

								};

								this._oModel.create("/ZCREATE00HD_0030_DDL", oSendData, {

									success: function(oData, response) {

										this.getView().byId("stdTable").removeSelections();
										this._oModel.refresh();
										MessageToast.show("데이터 추가 성공");
									}.bind(this),
									error: function(oError) {
										MessageToast.show("데이터 추가 실패");
									}
								});

							} else if (oAction === "NO") {
								MessageToast.show("추가 취소");
							}
						}.bind(this)
					});

			} else if (aSelectedRows.length === 0) {
				MessageToast.show("적어도 하나의 행을 선택하시오.");
			}

		},
		onFinished: function(oEvent) {
			var sLength = oEvent.getParameter("total");
			this.getView().byId("stdTab").setCount(sLength);

		},
		onFinished2: function(oEvent) {
			var cLength = oEvent.getParameter("total");
			this.getView().byId("cboTab").setCount(cLength);
		},
		onDelete: function(oEvent) {

			var dEbeln = oEvent.getParameter("listItem").getBindingContext().getProperty().Ebeln;

			MessageBox.confirm("데이터를 삭제합니까?", {
				onClose: function(sButton) {
					if (sButton === MessageBox.Action.OK) {
						var sPath = "/ZCBO00HD_0030_DDL(Ebeln='" + dEbeln + "')";

						this._oModel.remove(sPath, {
							success: function(oData, response) {
								this._oModel.refresh();
								MessageToast.show("삭제 성공");

							}.bind(this),
							error: function(oError) {
								MessageToast.show("삭제 실패");
							}
						});
					}
				}.bind(this)
			});
		},
		onSearch2: function(oEvent) {

			var sListBinding = this.getView().byId("poList").getBinding("items");

			var idEbeln2 = oEvent.getSource().getValue();

			var aFilters = [];

			var oFilter = new Filter({
				path: "Ebeln",
				operator: sap.ui.model.FilterOperator.Contains,
				value1: idEbeln2,
				value2: null
			});
			//필터 배열에 필터 객체 추가	
			aFilters.push(oFilter);

			// 필터링
			sListBinding.filter(aFilters, "Application");
		},
		onRefresh: function() {
			this._oModel.refresh();

			this.getView().byId("cboSearch").setValue("");

			var oListBinding = this.getView().byId("poList").getBinding("items");
			oListBinding.filter([], "Application");
		},
		onItemList: function(oEvent) {
			var iEbeln = oEvent.getSource().getBindingContext().getProperty().Ebeln;
			var sPath = "/ZCBO00HD_0030_DDL(Ebeln='" + iEbeln + "')/to_CBOItem";
	
			
			this.oResizableDialog = new Dialog({
				title: "구매오더(" + iEbeln + ") 세부품목",
				contentWidth: "650px",
				contentHeight: "350px",
				resizable: true,
				content: new List({
					items: {
						path: sPath,
						template: new StandardListItem({
							title: "{Ebelp}",
							description: "{Matnr}({Maktx})",
							info: "{Netpr}{Waers}"
						})
					}
				}),
				endButton: new Button({
					text: "Close",
					press: function() {
						this.oResizableDialog.close();
					}.bind(this)
				})
			});
			this.getView().addDependent(this.oResizableDialog);
			this.oResizableDialog.open();
		}

	});
});