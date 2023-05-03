sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/m/MessageToast"
], function(Controller, MessageBox, MessageToast) {
	"use strict";
	var oModel;
	var sEbeln, dEbeln, dEbelp;
	return Controller.extend("ZTEST_21_02.controller.Detail", {

		onInit: function() {
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.getRoute("routerDetail").attachPatternMatched(this._onObjectMatched, this);
		},
		_onObjectMatched: function(oEvent) {
			// debugger;
			sEbeln = oEvent.getParameter("arguments").Ebeln;
			//var sEbelp = oEvent.getParameter("arguments").Ebelp;

			//	debugger;
			oModel = this.getOwnerComponent().getModel(); // 전역으로 선언할 때는 this._를 많이 사용한다.
			//oModel.refresh(); // odatamodel refresh =>보는 화면도 바뀜

			// /ZTUTOR02_0010_DDL(Matnr='TG10');
			//ZPO00HD_0020_DDL('<KEY>')/to_POItem
			var sPath = "/ZPO00HD_0020_DDL(Ebeln='" + sEbeln + "')/to_POItem";
			// 이렇게 하면 Ebeln에 맞는 아이템 항목이 전부 나온다. 
			// urlParameters로 expand를 할 경우, 아이템 정보를 가지고 있는 헤더가 나온다. 
			//var sPath = "/ZPOITEM21_0010_DDL(Ebeln='" + sEbeln + "',Ebelp='" + sEbelp + "')";
			oModel.read(sPath, {
				success: function(oData, response) {
					var aData = oData.results;
					
					var oJSONModel = new sap.ui.model.json.JSONModel(aData);
					//debugger;
					oJSONModel.setSizeLimit(Number.MAX_SAFE_INTEGER);
					//JSONModel의 sizelimit이 늘어난다 
					this.getView().setModel(oJSONModel, "detailModel");

				}.bind(this), // .bind(this)를 해주면, 컨트롤러를 가르키는 this를 쓸 수 있다 .=> this.getView()가 가능해짐  
				// 실패하면 error를 탄다.
				error: function(oError) {
					// debugger;
				}
			});
		},
		onDelete: function(oEvent) {
			dEbeln = oEvent.getSource().getModel("detailModel").getData()[0].Ebeln;
			dEbelp = oEvent.getSource().getModel("detailModel").getData()[0].Ebelp;

			/*방법2 
			var sPath = oEvent.getParameter("listItem").getBindingContextPath();
			var oProperty = this.getView().getModel("detailModel").getProperty(sPath);
			var sEbeln = oProperty.Ebeln;
			var sEbelp = oProperty.Ebelp;*/

			MessageBox.confirm("정말로 삭제합니까?", {
				onClose: function(sButton) {
					if (sButton === MessageBox.Action.OK) {
						var sPath = "/ZPO00ITEM_0020_DDL(Ebeln='" + dEbeln + "',Ebelp='" + dEbelp + "')";

						oModel.remove(sPath, {
							success: function(oData, response) {
								MessageToast.show("삭제 되었습니다.");
							},
							error: function(oError) {
								MessageToast.show("삭제 실패");
							}
						});
					}
				}
			});
		},
		//방법 2
/*		MessageBox.show(
			"정말로 삭제합니까?", {
				icon: MessageBox.Icon.QUESTION,
				title: "확인",
				actions: [MessageBox.ACtion.YES, MessageBox.Action.NO],
				
				emphasizedAction: MessageBox.Action.YES,
				onClose: function(oAction) {
					if (oAction === "YES") {
						oModel.remove(sPath, {
							success: function(oData, response) {
								MessageToast.show("삭제 되었습니다.");
								this._readItems(this.sEbeln);
							}.bind(this),
							error: function(oError) {
								MessageToast.show("삭제 실패");
							}
						});
					} else if (oAction === "NO") {
						MessageToast.show("삭제 취소");
					}
				}.bind(this)
			});*/

		onRefresh: function() {
			var sPath = "/ZPO00HD_0020_DDL(Ebeln='" + sEbeln + "')";
			//var sPath = "/ZPOITEM21_0010_DDL(Ebeln='" + sEbeln + "',Ebelp='" + sEbelp + "')";
			oModel.read(sPath, {
				urlParameters: {
					"$expand": "to_POItem"
				},
				success: function(oData, response) {

					//var aData = oData.results;
					var aData = oData.to_POItem.results;
					//	debugger;
					var oJSONModel = new sap.ui.model.json.JSONModel(aData);
					this.getView().setModel(oJSONModel, "detailModel");
					//debugger;

				}.bind(this), // .bind(this)를 해주면, 컨트롤러를 가르키는 this를 쓸 수 있다 .=> this.getView()가 가능해짐  
				// 실패하면 error를 탄다.
				error: function(oError) {
					// debugger;
				}
			});
		}

	});

});