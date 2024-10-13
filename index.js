const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const EmployeeModel = require("./models/EmployeModel")
const AdminModel = require("./models/AdminModel")

const app = express()
const port = 3001

app.use(express.json())
app.use(cors())

mongoose.connect("mongodb://localhost:27017/Employee_management", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MongoDB Connected")
    })
    .catch((err) => {
        console.log(err)
    })


app.post("/validateadmin", async (req, res) => {
    try {
        const admin = req.body;
        const admin1 = await AdminModel.findOne({ name: admin.name, password: admin.password });

        if (admin1) {
            res.json({ message: "Admin logged in successfully" });
        } else {
            res.json({ message: "Invalid admin" });
        }
    } catch (err) {
        console.error("Error finding admin:", err);
        res.status(500).json({ message: "Server error. Please try again later." });
    }
});

app.post("/addemployee", async (req, res) => {
  try {
    const employee = new EmployeeModel(req.body);
    await employee.save();
    res.json({ message: "Employee added successfully" });
  } catch (err) {
    console.error("Error adding employee:", err);
    res.status(500).json({ message: "Failed to add employee" });
  }
});

app.get("/getemployees", async (req, res) => {
    try {
      const employees = await EmployeeModel.find();
      res.json(employees);
    } catch (err) {
      console.error("Error fetching employees:", err);
      res.status(500).json({ message: "Failed to fetch employees" });
    }
  });

app.delete("/deleteemployee/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await EmployeeModel.findByIdAndDelete(id);
      res.json({ message: "Employee deleted successfully" });
    } catch (err) {
      console.error("Error deleting employee:", err);
      res.status(500).json({ message: "Failed to delete employee" });
    }
  });

  app.put("/updateemployee/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updatedEmployee = await EmployeeModel.findByIdAndUpdate(id, req.body, { new: true });
      if (!updatedEmployee) {
        return res.status(404).json({ message: "Employee not found" });
      }
      res.json({ message: "Employee updated successfully", updatedEmployee });
    } catch (err) {
      console.error("Error updating employee:", err);
      res.status(500).json({ message: "Server error. Failed to update employee." });
    }
  });

  app.get("/getemployee/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updatedEmployee = await EmployeeModel.findOne({_id:id});
      if (!updatedEmployee) {
        return res.status(404).json({ message: "Employee not found" });
      }
      res.json(updatedEmployee );
    } catch (err) {
      console.error("Error updating employee:", err);
      res.status(500).json({ message: "Server error. Failed to update employee." });
    }
  });
  

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})
