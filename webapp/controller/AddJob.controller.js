sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/ui/core/routing/History",
	"sap/ui/core/Fragment",
	"sap/ui/model/Filter",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast"
], function (Controller, MessageBox, History, Fragment, Filter, JSONModel, MessageToast) {
	"use strict";

	return Controller.extend("project.ZTrackJob.controller.AddJob", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf project.ZTrackJob.view.AddJob
		 */
		onInit: function () {
			this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this._oRouter.getRoute("EditJob").attachPatternMatched(this._onEditMatched, this);
		},

		_onNavBack: function () {
			var that = this;
			that._clearData();
			this.getRouter().navTo("ManageJobs", {}, true);
		},

		getRouter: function () {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},

		_onPressMenu: function (oEvent) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			if (oEvent.getSource().getText() === "Dashboard") {
				oRouter.navTo("Dashboard");
			} else if (oEvent.getSource().getText() === "Location Manager") {
				oRouter.navTo("LocationManager");
			} else if (oEvent.getSource().getText() === "Vehicle Manager") {
				oRouter.navTo("VehicleMaster");
			} else if (oEvent.getSource().getText() === "Driver Manager") {
				oRouter.navTo("DriverManager");
			} else if (oEvent.getSource().getText() === "Trip Manager") {
				oRouter.navTo("TripManager");
			} else if (oEvent.getSource().getText() === "Track Vehicle") {
				oRouter.navTo("TrackVehicle");
			}
		},
		
		// Edit Job //
		
		_onEditMatched: function (oEvent) {
			var oParameters = oEvent.getParameters();
			var oModelJob = this.getOwnerComponent().getModel("JobSet");
			this.getView().setModel(oModelJob);
			var oModel = this.getView().getModel();

			var txtJobId = this.getView().byId("txtJobId");
			var txtJobTItle = this.getView().byId("txtJobTItle");
			var txtCompanyCode = this.getView().byId("txtCompanyCode");
			var txtPlant = this.getView().byId("txtPlant");
			var txtStorageLocation = this.getView().byId("txtStorageLocation");
			var txtEmployee = this.getView().byId("txtEmployee");
			var txtMachine = this.getView().byId("txtMachine");
			var dpkAssignDate = this.getView().byId("dpkAssignDate");
			var tpkAssignTimeFrom = this.getView().byId("tpkAssignTimeFrom");
			var tpkAssignTimeTo = this.getView().byId("tpkAssignTimeTo");
			var txtJobInsts = this.getView().byId("txtJobInsts");
		
			var btnSave = this.getView().byId("btnSave");
			var btnClear = this.getView().byId("bnClear");

			if (oParameters.arguments.JobId !== "" || oParameters.arguments.JobId !== null) {
				this.JobId = oParameters.arguments.JobId;
				for (var i = 0; i < oModel.getData().Jobs.length; i++) {
					if (oModel.getData().Jobs[i].JobId.toString() === this.JobId) {
						if (oModel.getData().Jobs[i].Status === "COMPLETED" || oModel.getData().Jobs[i].Status === "ONGOING" || oModel.getData().Jobs[
								i].Status === "CANCELLED") {
							btnSave.setVisible(false);
							btnClear.setVisible(false);
						} else {
							btnSave.setVisible(true);
							btnClear.setVisible(true);
						}
						
						txtJobId.setValue(this.JobId);
						txtJobTItle.setValue(oModel.getData().Jobs[i].JobTitle);
						txtCompanyCode.setValue(oModel.getData().Jobs[i].CompanyId);
						txtPlant.setValue(oModel.getData().Jobs[i].PlantId);
						txtStorageLocation.setValue(oModel.getData().Jobs[i].SLocId);
						txtEmployee.setValue(oModel.getData().Jobs[i].EmployeeId);
						txtMachine.setValue(oModel.getData().Jobs[i].MachineId);
						dpkAssignDate.setValue(oModel.getData().Jobs[i].AssignedDate);
						tpkAssignTimeFrom.setValue(oModel.getData().Jobs[i].FromTime);
						tpkAssignTimeTo.setValue(oModel.getData().Jobs[i].ToTime);
						txtJobInsts.setValue(oModel.getData().Jobs[i].JobInstructions);
						return false;
					}
				}

			} else {
				MessageBox.error("Incorrect Data");
			}
		},

		
	//fragment

		
		_handleValueHelpCompanyCode: function (oEvent) {

			var oModelCompanyCode = this.getOwnerComponent().getModel("CompanyCodeSet");
			this.getView().setModel(oModelCompanyCode);

			var sInputValueCompanyCode = oEvent.getSource().getValue();

			this.inputCompanyCodeId = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialogCompanyCode) {
				this._valueHelpDialogCompanyCode = sap.ui.xmlfragment(
					"project.ZTrackJob.fragments.CompanyCode",
					this
				);
				this.getView().addDependent(this._valueHelpDialogCompanyCode);
			}

			// create a filter for the binding

			this._valueHelpDialogCompanyCode.getBinding("items").filter([new sap.ui.model.Filter(
				"CompanyCode",
				sap.ui.model.FilterOperator.Contains, sInputValueCompanyCode
			)]);

			// open value help dialog filtered by the input value
			this._valueHelpDialogCompanyCode.open(sInputValueCompanyCode);
		},

		_handleValueHelpSearchCompanyCode: function (evt) {
			var sValueCompanyCode = evt.getParameter("value");
			var oFilter = new sap.ui.model.Filter(
				"CompanyCode",
				sap.ui.model.FilterOperator.Contains, sValueCompanyCode
			);
			evt.getSource().getBinding("items").filter([oFilter]);
		},

		_handleValueHelpCloseCompanyCode: function (evt) {
			var oSelectedItem = evt.getParameter("selectedItem");

			if (oSelectedItem) {
				var CompanyCodeInput = this.getView().byId(this.inputCompanyCodeId);
				CompanyCodeInput.setValue(oSelectedItem.getDescription());
			}
			evt.getSource().getBinding("items").filter([]);
		},

		// Company Code //

		// Plant //

		_handleValueHelpPlant: function (oEvent) {

			var oModelPlant = this.getOwnerComponent().getModel("PlantSet");
			this.getView().setModel(oModelPlant);

			var sInputValuePlant = oEvent.getSource().getValue();

			this.inputPlantId = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialogPlant) {
				this._valueHelpDialogPlant = sap.ui.xmlfragment(
					"project.ZTrackJob.fragments.Plant",
					this
				);
				this.getView().addDependent(this._valueHelpDialogPlant);
			}

			// create a filter for the binding

			this._valueHelpDialogPlant.getBinding("items").filter([new sap.ui.model.Filter(
				"PlantId",
				sap.ui.model.FilterOperator.Contains, sInputValuePlant
			)]);

			// open value help dialog filtered by the input value
			this._valueHelpDialogPlant.open(sInputValuePlant);
		},

		_handleValueHelpSearchPlant: function (evt) {
			var sValuePlant = evt.getParameter("value");
			var oFilter = new sap.ui.model.Filter(
				"PlantId",
				sap.ui.model.FilterOperator.Contains, sValuePlant
			);
			evt.getSource().getBinding("items").filter([oFilter]);
		},

		_handleValueHelpClosePlant: function (evt) {
			var oSelectedItem = evt.getParameter("selectedItem");

			if (oSelectedItem) {
				var PlantInput = this.getView().byId(this.inputPlantId);
				PlantInput.setValue(oSelectedItem.getDescription());
			}
			evt.getSource().getBinding("items").filter([]);
		},

		// Plant //

		// Storage Location //

		_handleValueHelpStorageLocation: function (oEvent) {

			var oModelStorageLocation = this.getOwnerComponent().getModel("StorageLocationSet");
			this.getView().setModel(oModelStorageLocation);
			var txtPlant = this.getView().byId("txtPlant").getValue();
			//var sInputValueStorageLocation = oEvent.getSource().getValue();
			if (txtPlant === "" || txtPlant === null || txtPlant === undefined) {
				MessageBox.error("Please Select Plant First");
				return false;
			} else {
				this.inputStorageLocationId = oEvent.getSource().getId();
				// create value help dialog
				if (!this._valueHelpDialogStorageLocation) {
					this._valueHelpDialogStorageLocation = sap.ui.xmlfragment(
						"project.ZTrackJob.fragments.StorageLocation",
						this
					);
					this.getView().addDependent(this._valueHelpDialogStorageLocation);
				}

				// create a filter for the binding

				this._valueHelpDialogStorageLocation.getBinding("items").filter([new sap.ui.model.Filter(
					"PlantId",
					sap.ui.model.FilterOperator.Contains, txtPlant
				)]);

				// open value help dialog filtered by the input value
				this._valueHelpDialogStorageLocation.open(txtPlant);
			}

		},

		_handleValueHelpSearchStorageLocation: function (evt) {
			var sValueStorageLocation = evt.getParameter("value");
			var txtPlant = this.getView().byId("txtPlant").getValue();
			var oFilter1 = new sap.ui.model.Filter(
				"SLocId",
				sap.ui.model.FilterOperator.Contains, sValueStorageLocation
			);
			var oFilter2 = new sap.ui.model.Filter(
				"PlantId",
				sap.ui.model.FilterOperator.Contains, txtPlant
			);

			evt.getSource().getBinding("items").filter([oFilter1, oFilter2]);
		},

		_handleValueHelpCloseStorageLocation: function (evt) {
			var oSelectedItem = evt.getParameter("selectedItem");

			if (oSelectedItem) {
				var StorageLocationInput = this.getView().byId(this.inputStorageLocationId);
				StorageLocationInput.setValue(oSelectedItem.getDescription());
			}
			evt.getSource().getBinding("items").filter([]);
		},

		// Storage Location //

		// Employee //

		_handleValueHelpEmployee: function (oEvent) {

			var oModelEmployee = this.getOwnerComponent().getModel("EmployeeSet");
			this.getView().setModel(oModelEmployee);

			var sInputValueEmployee = oEvent.getSource().getValue();

			this.inputEmployeeId = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialogEmployee) {
				this._valueHelpDialogEmployee = sap.ui.xmlfragment(
					"project.ZTrackJob.fragments.Employee",
					this
				);
				this.getView().addDependent(this._valueHelpDialogEmployee);
			}

			// create a filter for the binding

			this._valueHelpDialogEmployee.getBinding("items").filter([new sap.ui.model.Filter(
				"EmployeeId",
				sap.ui.model.FilterOperator.Contains, sInputValueEmployee
			)]);

			// open value help dialog filtered by the input value
			this._valueHelpDialogEmployee.open(sInputValueEmployee);
		},

		_handleValueHelpSearchEmployee: function (evt) {
			var sValueEmployee = evt.getParameter("value");
			var oFilter = new sap.ui.model.Filter(
				"EmployeeName",
				sap.ui.model.FilterOperator.Contains, sValueEmployee
			);
			evt.getSource().getBinding("items").filter([oFilter]);
		},

		_handleValueHelpCloseEmployee: function (evt) {
			var oSelectedItem = evt.getParameter("selectedItem");

			if (oSelectedItem) {
				var EmployeeInput = this.getView().byId(this.inputEmployeeId);
				EmployeeInput.setValue(oSelectedItem.getDescription());
			}
			evt.getSource().getBinding("items").filter([]);
		},

		// Employee //

		// Machine //

		_handleValueHelpMachine: function (oEvent) {

			var oModelMachine = this.getOwnerComponent().getModel("MachineSet");
			this.getView().setModel(oModelMachine);

			var sInputValueMachine = oEvent.getSource().getValue();

			this.inputMachineId = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialogMachine) {
				this._valueHelpDialogMachine = sap.ui.xmlfragment(
					"project.ZTrackJob.fragments.Machine",
					this
				);
				this.getView().addDependent(this._valueHelpDialogMachine);
			}

			// create a filter for the binding

			this._valueHelpDialogMachine.getBinding("items").filter([new sap.ui.model.Filter(
				"MachineId",
				sap.ui.model.FilterOperator.Contains, sInputValueMachine
			)]);

			// open value help dialog filtered by the input value
			this._valueHelpDialogMachine.open(sInputValueMachine);
		},

		_handleValueHelpSearchMachine: function (evt) {
			var sValueMachine = evt.getParameter("value");
			var oFilter = new sap.ui.model.Filter(
				"MachineName",
				sap.ui.model.FilterOperator.Contains, sValueMachine
			);
			evt.getSource().getBinding("items").filter([oFilter]);
		},

		_handleValueHelpCloseMachine: function (evt) {
			var oSelectedItem = evt.getParameter("selectedItem");

			if (oSelectedItem) {
				var MachineInput = this.getView().byId(this.inputMachineId);
				MachineInput.setValue(oSelectedItem.getDescription());
			}
			evt.getSource().getBinding("items").filter([]);
		},

		// Machine //

		// Save Job // 

		_onSaveUpdate: function () {
			var that = this;
			var txtJobId = this.getView().byId("txtJobId");
			if (txtJobId.getValue() === "0") {
				that._onSaveJob();
			} else {
				that._onUpdateJob();
			}
		},

		_onSaveJob: function () {
			var that = this;
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);

			var txtJobTItle = this.getView().byId("txtJobTItle");
			var txtCompanyCode = this.getView().byId("txtCompanyCode");
			var txtPlant = this.getView().byId("txtPlant");
			var txtStorageLocation = this.getView().byId("txtStorageLocation");
			var txtEmployee = this.getView().byId("txtEmployee");
			var txtMachine = this.getView().byId("txtMachine");
			var dpkAssignDate = this.getView().byId("dpkAssignDate");
			var tpkAssignTimeFrom = this.getView().byId("tpkAssignTimeFrom");
			var tpkAssignTimeTo = this.getView().byId("tpkAssignTimeTo");
			var txtJobInsts = this.getView().byId("txtJobInsts");

			if (txtJobTItle.getValue() === "" || txtCompanyCode.getValue() === "" || txtPlant.getValue() === "" ||
				txtStorageLocation.getValue() === "" || txtEmployee.getValue() === "" || txtMachine.getValue() === "" ||
				dpkAssignDate.getValue() === "" || tpkAssignTimeFrom.getValue() === "" || tpkAssignTimeTo.getValue() === "" || txtJobInsts.getValue() ===
				"") {
				MessageToast.show("Please fill up all required details");
			} else {
				// Get the Model in the view 
				var oModelJob = this.getOwnerComponent().getModel("JobSet");
				this.getView().setModel(oModelJob);

				var oModel = this.getView().getModel();

				// Get the Number of records in the OData Jobs 
				var JobsNumber = oModel.getProperty("/Jobs").length;

				// Populate the new Job ID 
				var NewJobID = JobsNumber + 1;
				var oNewEntry = {};

				oNewEntry = {
					"JobId": NewJobID,
					"JobTitle": txtJobTItle.getValue(),
					"CompanyId": txtCompanyCode.getValue(),
					"PlantId": txtPlant.getValue(),
					"SLocId": txtStorageLocation.getValue(),
					"EmployeeId": txtEmployee.getValue(),
					"MachineId": txtMachine.getValue(),
					"AssignedDate": dpkAssignDate.getValue(),
					"FromTime": tpkAssignTimeFrom.getValue(),
					"ToTime": tpkAssignTimeFrom.getValue(),
					"JobInstructions": txtJobInsts.getValue(),
					"Status": "UPCOMING",
					"Type": "Warning"
				};
				var oModelJobs = oModel.getProperty("/Jobs");
				oModelJobs.push(oNewEntry);
				oModel.setProperty("/Jobs", oModelJobs);
				MessageBox.confirm("Do you want to add new Job?", {
					icon: sap.m.MessageBox.Icon.INFORMATION,
					title: "Confirm",
					actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
					onClose: function (sAction) {
						if (sAction === "YES") {
							oRouter.navTo("ManageJobs");
							that._clearData();
						}
					}
				});
			}
		},
		// Save Job // 

		// Update Job // 
		_onUpdateJob: function () {
			var that = this;
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);

			var txtJobId = this.getView().byId("txtJobId");
			var txtJobTItle = this.getView().byId("txtJobTItle");
			var txtCompanyCode = this.getView().byId("txtCompanyCode");
			var txtPlant = this.getView().byId("txtPlant");
			var txtStorageLocation = this.getView().byId("txtStorageLocation");
			var txtEmployee = this.getView().byId("txtEmployee");
			var txtMachine = this.getView().byId("txtMachine");
			var dpkAssignDate = this.getView().byId("dpkAssignDate");
			var tpkAssignTimeFrom = this.getView().byId("tpkAssignTimeFrom");
			var tpkAssignTimeTo = this.getView().byId("tpkAssignTimeTo");
			var txtJobInsts = this.getView().byId("txtJobInsts");

			if (txtJobTItle.getValue() === "" || txtCompanyCode.getValue() === "" || txtPlant.getValue() === "" ||
				txtStorageLocation.getValue() === "" || txtEmployee.getValue() === "" || txtMachine.getValue() === "" ||
				dpkAssignDate.getValue() === "" || tpkAssignTimeFrom.getValue() === "" || tpkAssignTimeTo.getValue() === "" || txtJobInsts.getValue() ===
				"") {
				MessageToast.show("Please fill up all required details");
			} else {
				// Get the Model in the view 
				var oModelJob = this.getOwnerComponent().getModel("JobSet");
				this.getView().setModel(oModelJob);

				var oModel = this.getView().getModel();
				var oModelJobs = oModel.getProperty("/Jobs");
				for (var i = 0; i < oModel.getData().Jobs.length; i++) {
					if (oModel.getData().Jobs[i].JobId.toString() === txtJobId.getValue()) {
						oModel.getData().Jobs[i].JobId = txtJobId.getValue();
						oModel.getData().Jobs[i].JobTitle = txtJobTItle.getValue();
						oModel.getData().Jobs[i].CompanyId = txtCompanyCode.getValue();
						oModel.getData().Jobs[i].PlantId = txtPlant.getValue();
						oModel.getData().Jobs[i].SLocId = txtStorageLocation.getValue();
						oModel.getData().Jobs[i].EmployeeId = txtEmployee.getValue();
						oModel.getData().Jobs[i].MachineId = txtMachine.getValue();
						oModel.getData().Jobs[i].AssignedDate = dpkAssignDate.getValue();
						oModel.getData().Jobs[i].FromTime = tpkAssignTimeFrom.getValue();
						oModel.getData().Jobs[i].ToTime = tpkAssignTimeTo.getValue();
						oModel.getData().Jobs[i].JobInstructions = txtJobInsts.getValue();
						
						
					} else {
						oModel.getData().Jobs[i].JobId = oModel.getData().Jobs[i].JobId;
						oModel.getData().Jobs[i].JobTitle = oModel.getData().Jobs[i].JobTitle;
						oModel.getData().Jobs[i].CompanyId = oModel.getData().Jobs[i].CompanyId;
						oModel.getData().Jobs[i].PlantId = oModel.getData().Jobs[i].PlantId;
						oModel.getData().Jobs[i].SLocId = oModel.getData().Jobs[i].SLocId;
						oModel.getData().Jobs[i].EmployeeId = oModel.getData().Jobs[i].EmployeeId;
						oModel.getData().Jobs[i].MachineId = oModel.getData().Jobs[i].MachineId;
						oModel.getData().Jobs[i].AssignedDate = oModel.getData().Jobs[i].AssignedDate;
						oModel.getData().Jobs[i].FromTime = oModel.getData().Jobs[i].FromTime;
						oModel.getData().Jobs[i].ToTime = oModel.getData().Jobs[i].ToTime;
						oModel.getData().Jobs[i].JobInstructions = oModel.getData().Jobs[i].JobInstructions;
					}
				}

				oModel.setProperty("/Jobs", oModelJobs);
				MessageBox.confirm("Do you want to Update Job?", {
					icon: sap.m.MessageBox.Icon.INFORMATION,
					title: "Confirm",
					actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
					onClose: function (sAction) {
						if (sAction === "YES") {
							oRouter.navTo("ManageJobs");
							that._clearData();
						}
					}
				});
				
			}
		},
		// Update Job // 

		// Clear Data // 
		_clearData: function () {
			var txtJobId = this.getView().byId("txtJobId");
			var txtJobTItle = this.getView().byId("txtJobTItle");
			var txtCompanyCode = this.getView().byId("txtCompanyCode");
			var txtPlant = this.getView().byId("txtPlant");
			var txtStorageLocation = this.getView().byId("txtStorageLocation");
			var txtEmployee = this.getView().byId("txtEmployee");
			var txtMachine = this.getView().byId("txtMachine");
			var dpkAssignDate = this.getView().byId("dpkAssignDate");
			var tpkAssignTimeFrom = this.getView().byId("tpkAssignTimeFrom");
			var tpkAssignTimeTo = this.getView().byId("tpkAssignTimeTo");
			var txtJobInsts = this.getView().byId("txtJobInsts");

			txtJobId.setValue(0);
			txtJobTItle.setValue("");
			txtCompanyCode.setValue("");
			txtPlant.setValue("");
			txtStorageLocation.setValue("");
			txtEmployee.setValue("");
			txtMachine.setValue("");
			dpkAssignDate.setValue("");
			tpkAssignTimeFrom.setValue("");
			tpkAssignTimeTo.setValue("");
			txtJobInsts.setValue("");

		},
		// Clear Data //
	});

});