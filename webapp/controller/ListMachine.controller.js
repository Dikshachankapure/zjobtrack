sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/ui/core/routing/History",
	"sap/ui/model/json/JSONModel",
	'sap/ui/model/Filter',
], function (Controller, MessageBox, History, JSONModel, Filter) {
	"use strict";

	return Controller.extend("project.ZTrackJob.controller.ListMachine", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf project.ZTrackJob.view.ListMachine
		 */
		onInit: function () {
			var oModel = this.getOwnerComponent().getModel("MachineSet");
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
			oRouter.navTo("AddMachine");
		},

		onEdit: function (oEvent) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			var objMachine = oEvent.getSource().getBindingContext().getObject();
			//Get the Model. 
			oRouter.navTo("EditMachine", {
				MachineId: objMachine.MachineId
			});
		},

		onDelete: function (oEvent) {
			var oList = this.byId("tblMachines");

			var aItems = oList.getItems();
			var oModelItems = oList.getModel();
			var values = oModelItems.getData();

			var deleteRecord = oEvent.getSource().getBindingContext().getObject();
			if (aItems.length > 0) {
				for (var i = 0; i < values.Machines.length; i++) {
					if (values.Machines[i].MachineId === deleteRecord.MachineId) {
						//	pop this._data.Products[i] 
						values.Machines.splice(i, 1);
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
				var oFilter1 = new sap.ui.model.Filter("MachineName", sap.ui.model.FilterOperator.Contains, query);
				var oFilter2 = new sap.ui.model.Filter("MachineSerialNo", sap.ui.model.FilterOperator.Contains, query);

				var allFilter = new sap.ui.model.Filter([oFilter1, oFilter2], false);
			}
			var obinding = this.getView().byId("tblMachines").getBinding("items");
			obinding.filter(allFilter);
		}

	});

});