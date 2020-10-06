sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/ui/core/routing/History",
	"sap/ui/model/json/JSONModel",
], function (Controller, MessageBox, History, JSONModel, MessageToast) {
	"use strict";

	return Controller.extend("project.ZTrackJob.controller.AddMachine", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf project.ZTrackJob.view.AddMachine
		 */
		onInit: function () {
			this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this._oRouter.getRoute("EditMachine").attachPatternMatched(this._onEditMatched, this);
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

		_onEditMatched: function (oEvent) {
			var oParameters = oEvent.getParameters();
			var oModelMachine = this.getOwnerComponent().getModel("MachineSet");
			this.getView().setModel(oModelMachine);
			var oModel = this.getView().getModel();

			var txtMachineId = this.getView().byId("txtMachineId");
			var txtMachineName = this.getView().byId("txtMachineName");
			var txtMachineSerialNo = this.getView().byId("txtMachineSerialNo");
			var txtMachineDesc = this.getView().byId("txtMachineDesc");
			if (oParameters.arguments.MachineId !== "" || oParameters.arguments.MachineId !== null) {
				this.MachineId = oParameters.arguments.MachineId;
				if (oModel.getData().Machines.length > 0) {
					for (var i = 0; i < oModel.getData().Machines.length; i++) {
						if (oModel.getData().Machines[i].MachineId.toString() === this.MachineId) {
							txtMachineId.setValue(this.MachineId);
							txtMachineName.setValue(oModel.getData().Machines[i].MachineName);
							txtMachineSerialNo.setValue(oModel.getData().Machines[i].MachineSerialNo);
							txtMachineDesc.setValue(oModel.getData().Machines[i].MachineDescription);
							return false;
						}
					}
				}

			} else {
				MessageBox.error("Data Not available");
			}
		},

		_onNavBack: function () {
			this.getRouter().navTo("ManageMachine", {}, true);
			var that = this;
			that._clearData();
		},

		getRouter: function () {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},

		_onSaveUpdate: function () {
			var that = this;
			var txtMachineId = this.getView().byId("txtMachineId");
			if (txtMachineId.getValue() === "0") {
				that._onSaveMachine();
			} else {
				that._onUpdateMachine();
			}
		},

		_onSaveMachine: function () {
			var that = this;
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);

			var txtMachineName = this.getView().byId("txtMachineName");
			var txtMachineSerialNo = this.getView().byId("txtMachineSerialNo");
			var txtMachineDesc = this.getView().byId("txtMachineDesc");

			if (txtMachineName.getValue() === "") {
				MessageToast.show("Machine Name is required");
			} else {
				// Get the Model in the view 
				var oModelMachine = this.getOwnerComponent().getModel("MachineSet");
				this.getView().setModel(oModelMachine);

				var oModel = this.getView().getModel();

				// Get the Number of records in the OData Machines 
				var MachinesNumber = oModel.getProperty("/Machines").length;

				// Populate the new Machine ID 
				var NewMachineID = MachinesNumber + 1;
				var oNewEntry = {};

				oNewEntry = {
					"MachineId": NewMachineID,
					"MachineName": txtMachineName.getValue(),
					"MachineSerialNo": txtMachineSerialNo.getValue(),
					"MachineDescription": txtMachineDesc.getValue()
				};
				var oModelMachines = oModel.getProperty("/Machines");
				oModelMachines.push(oNewEntry);
				oModel.setProperty("/Machines", oModelMachines);
				MessageBox.confirm("Do you want to add new Machine?", {
					icon: sap.m.MessageBox.Icon.INFORMATION,
					title: "Confirm",
					actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
					onClose: function (sAction) {
						if (sAction === "YES") {
							oRouter.navTo("ManageMachine");
							that._clearData();
						}
					}
				});
			}
		},

		_onUpdateMachine: function () {
			var that = this;
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);

			var txtMachineId = this.getView().byId("txtMachineId");
			var txtMachineName = this.getView().byId("txtMachineName");
			var txtMachineSerialNo = this.getView().byId("txtMachineSerialNo");
			var txtMachineDesc = this.getView().byId("txtMachineDesc");

			if (txtMachineName.getValue() === "") {
				MessageToast.show("Machine name is required");
			} else {
				// Get the Model in the view 
				var oModelMachine = this.getOwnerComponent().getModel("MachineSet");
				this.getView().setModel(oModelMachine);

				var oModel = this.getView().getModel();
				var oModelMachines = oModel.getProperty("/Machines");
				for (var i = 0; i < oModel.getData().Machines.length; i++) {
					if (oModel.getData().Machines[i].MachineId.toString() === txtMachineId.getValue()) {
						oModel.getData().Machines[i].MachineId = txtMachineId.getValue();
						oModel.getData().Machines[i].MachineName = txtMachineName.getValue();
						oModel.getData().Machines[i].MachineSerialNo = txtMachineSerialNo.getValue();
						oModel.getData().Machines[i].MachineDescription = txtMachineDesc.getValue();
					} else {
						oModel.getData().Machines[i].MachineId = oModel.getData().Machines[i].MachineId;
						oModel.getData().Machines[i].MachineName = oModel.getData().Machines[i].MachineName;
						oModel.getData().Machines[i].MachineSerialNo = oModel.getData().Machines[i].MachineSerialNo;
						oModel.getData().Machines[i].MachineDescription = oModel.getData().Machines[i].MachineDescription;
					}
				}

				oModel.setProperty("/Machines", oModelMachines);
				MessageBox.confirm("Do you want to Update Machine?", {
					icon: sap.m.MessageBox.Icon.INFORMATION,
					title: "Confirm",
					actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
					onClose: function (sAction) {
						if (sAction === "YES") {
							oRouter.navTo("ManageMachine");
							that._clearData();
						}
					}
				});
			}
		},

		_clearData: function () {
			var txtMachineId = this.getView().byId("txtMachineId");
			var txtMachineName = this.getView().byId("txtMachineName");
			var txtMachineSerialNo = this.getView().byId("txtMachineSerialNo");
			var txtMachineDesc = this.getView().byId("txtMachineDesc");

			txtMachineId.setValue(0);
			txtMachineName.setValue("");
			txtMachineSerialNo.setValue("");
			txtMachineDesc.setValue("");

		}

	});

});