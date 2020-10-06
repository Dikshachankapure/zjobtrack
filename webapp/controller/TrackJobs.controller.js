sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/ui/core/routing/History",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/m/MessageStrip"
], function (Controller, MessageBox, History, JSONModel, Filter, MessageStrip) {
	"use strict";

	return Controller.extend("project.ZTrackJob.controller.TrackJobs", {

		onInit: function () {
			var oModelJob = this.getOwnerComponent().getModel("JobSet");
			this.getView().setModel(oModelJob);
		},

		_getRouter: function () {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},

		_onNavBack: function () {
			this._getRouter().navTo("Dashboard", {}, true);
		},

		_onPressMenu: function (oEvent) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			if (oEvent.getSource().getText() === "Dashboard") {
				oRouter.navTo("Dashboard");
			} else if (oEvent.getSource().getText() === "Manage Machine") {
				oRouter.navTo("ManageMachine");
			} else if (oEvent.getSource().getText() === "Manage Jobs") {
				oRouter.navTo("ManageJobs");
			} else if (oEvent.getSource().getText() === "Track Jobs") {
				oRouter.navTo("TrackJobs");
			}
		},

		onCancel: function (oEvent) {
			var oList = this.byId("tblJobs");

			var aItems = oList.getItems();
			var oModelItems = oList.getModel();
			var values = oModelItems.getData();

			var UpdateRecord = oEvent.getSource().getBindingContext().getObject();
			if (aItems.length > 0) {
				for (var i = 0; i < values.Jobs.length; i++) {
					if (UpdateRecord.JobId === values.Jobs[i].JobId && (values.Jobs[i].Status === "COMPLETED" || values.Jobs[i].Status ===
							"ONGOING")) {
						MessageBox.information("You Can not Cancel this Job");

					} else if (UpdateRecord.JobId === values.Jobs[i].JobId && values.Jobs[i].Status === "CANCELLED") {
						MessageBox.information("This Job is already cancelled");
					} else {
						if (values.Jobs[i].JobId === UpdateRecord.JobId) {
							//	pop this._data.Products[i] 
							values.Jobs[i].Status = "CANCELLED";
							values.Jobs[i].Type = "Error";
							oModelItems.refresh();
							break;
						}
						oModelItems.setData(values);
						oList.setModel(oModelItems);
					}

				}

			}
		},

		onSearch: function (oEvent) {
			var query1 = this.getView().byId("dpkDate").getValue();
			var query2 = this.getView().byId("cmbStatus").getSelectedKey();
			var oFilter1, oFilter2;
			var allFilter = "";
			if (query1.length > 0 && query2.length > 0) {
				oFilter1 = new sap.ui.model.Filter("AssignedDate", sap.ui.model.FilterOperator.EQ, query1);
				oFilter2 = new sap.ui.model.Filter("Status", sap.ui.model.FilterOperator.Contains, query2);
				allFilter = new sap.ui.model.Filter([oFilter1, oFilter2], false);
			} else if (query1.length > 0) {
				oFilter1 = new sap.ui.model.Filter("AssignedDate", sap.ui.model.FilterOperator.EQ, query1);
				allFilter = new sap.ui.model.Filter([oFilter1], false);
			} else if (query2.length > 0) {
				oFilter2 = new sap.ui.model.Filter("Status", sap.ui.model.FilterOperator.Contains, query2);
				allFilter = new sap.ui.model.Filter([oFilter2], false);
			} else {
				oFilter1 = new sap.ui.model.Filter("AssignedDate", sap.ui.model.FilterOperator.EQ, query1);
				oFilter2 = new sap.ui.model.Filter("Status", sap.ui.model.FilterOperator.Contains, query2);
				allFilter = new sap.ui.model.Filter([oFilter1, oFilter2], false);
			}
			var obinding = this.getView().byId("tblJobs").getBinding("items");
			obinding.filter(allFilter);
		}

	});

});