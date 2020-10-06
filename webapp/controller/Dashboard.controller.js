sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox"
], function (Controller, MessageBox) {
	"use strict";

	return Controller.extend("project.ZTrackJob.controller.Dashboard", {
		onInit: function () {
			var that = this;
			that._loadDashboard();
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

		_loadDashboard: function (oEvent) {
			var oModelMachine = this.getOwnerComponent().getModel("MachineSet");
			var oModelJob = this.getOwnerComponent().getModel("JobSet");

			var countMachines = this.getView().byId("countMachines");
			countMachines.setValue(oModelMachine.getData().Machines.length);

			var countJobs = this.getView().byId("countJobs");
			countJobs.setValue(oModelJob.getData().Jobs.length);
			
			this.getView().setModel(oModelJob);
			
			var Status1 = "ONGOING";
			var Status2 = "UPCOMING";
			var Status3 = "CANCELLED";
			var Status4 = "COMPLETED";
			if (Status1 && Status1.length > 0) {
				var oFilter1 = new sap.ui.model.Filter("Status", sap.ui.model.FilterOperator.Contains, Status1);
				var obinding1 = this.getView().byId("tblOngoingJobs").getBinding("items");
				obinding1.filter(oFilter1);
			}
			if (Status2 && Status2.length > 0) {
				var oFilter2 = new sap.ui.model.Filter("Status", sap.ui.model.FilterOperator.Contains, Status2);
				var obinding2 = this.getView().byId("tblUpcomingJobs").getBinding("items");
				obinding2.filter(oFilter2);
			}
			if (Status3 && Status3.length > 0) {
				var oFilter3 = new sap.ui.model.Filter("Status", sap.ui.model.FilterOperator.Contains, Status3);
				var obinding3 = this.getView().byId("tblCancelledJobs").getBinding("items");
				obinding3.filter(oFilter3);
			}
			if (Status4 && Status4.length > 0) {
				var oFilter4 = new sap.ui.model.Filter("Status", sap.ui.model.FilterOperator.Contains, Status4);
				var obinding4 = this.getView().byId("tblCompletedJobs").getBinding("items");
				obinding4.filter(oFilter4);
			}

		},
		
		_onPressTiles: function (oEvent) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			if (oEvent.getSource().getHeader() === "Machines") {
				oRouter.navTo("ManageMachine");
			} else if (oEvent.getSource().getHeader() === "Jobs") {
				oRouter.navTo("ManageJobs");
			} 
		},
		
		_onEditMachine: function (oEvent) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			var objJob = oEvent.getSource().getBindingContext().getObject();
			
			oRouter.navTo("EditJob", {
				JobId: objJob.JobId
			});

		}
		
	});
});