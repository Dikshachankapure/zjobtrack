sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/ui/core/routing/History",
	"sap/ui/model/json/JSONModel",
	'sap/ui/model/Filter',
], function (Controller, MessageBox, History, JSONModel, Filter) {
	"use strict";

	return Controller.extend("project.ZTrackJob.controller.ListJob", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf project.ZTrackJob.view.ListJob
		 */
		onInit: function () {
			var oModel = this.getOwnerComponent().getModel("JobSet");
			this.getView().setModel(oModel);
		},
		
		_onNavBack: function () {
			this.getRouter().navTo("Dashboard", {}, true);
		},

		getRouter: function () {
			return sap.ui.core.UIComponent.getRouterFor(this);
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
		
		onAdd: function (oEvent) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("AddJob");
		},

		onEdit: function (oEvent) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			var objJob = oEvent.getSource().getBindingContext().getObject();
			//Get the Model. 
			oRouter.navTo("EditJob", {
				JobId: objJob.JobId
			});
		},

		onDelete: function (oEvent) {
			var oList = this.byId("tblJobs");

			var aItems = oList.getItems();
			var oModelItems = oList.getModel();
			var values = oModelItems.getData();

			var deleteRecord = oEvent.getSource().getBindingContext().getObject();
			if (aItems.length > 0) {
				for (var i = 0; i < values.Jobs.length; i++) {
					if (values.Jobs[i].JobId === deleteRecord.JobId) {
						//	pop this._data.Products[i] 
						values.Jobs.splice(i, 1);
						oModelItems.refresh();
						break;
					}
				}

				oModelItems.setData(values);
				oList.setModel(oModelItems);
			}

		},

		onSearch: function (oEvt) {

			var query = oEvt.getSource().getValue();
			if (query && query.length > 0) {
				var oFilter1 = new sap.ui.model.Filter("JobTitle", sap.ui.model.FilterOperator.Contains, query);
				var oFilter2 = new sap.ui.model.Filter("JobId", sap.ui.model.FilterOperator.Contains, query);

				var allFilter = new sap.ui.model.Filter([oFilter1, oFilter2], false);
			}
			var obinding = this.getView().byId("tblJobs").getBinding("items");
			obinding.filter(allFilter);
		}

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf project.ZTrackJob.view.ListJob
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf project.ZTrackJob.view.ListJob
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf project.ZTrackJob.view.ListJob
		 */
		//	onExit: function() {
		//
		//	}

	});

});