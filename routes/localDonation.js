import express from "express";
import connection from "../connection.js";

const localDonationRoutes = express.Router();

localDonationRoutes.get("/listlocaldonation", (req, res, error) => {
    const sql = "SELECT DonationsInstitutionsID, " +
        "Name, " +
        "CNPJ, " +
        "Contact, " +
        "Email " +
        "FROM donationsinstitutions DI";

    connection.query(sql, (error, results) => {
        if (results.length > 0) {
            if (!error) {
                res.status(200).json({ msg: "Data returned with success!", localDonation: results });
            } else {
                res.status(404).json({ msg: error });
            }
        } else {
            res.status(404).json({ msg: "Data not found!" });
        }
    });
});

localDonationRoutes.get("/localdonation", (req, res, error) => {
    let sql = "SELECT DonationsInstitutionsID, " +
        "Name, " +
        "CNPJ, " +
        "Contact, " +
        "Email " +
        "FROM donationsinstitutions DI " +
        "WHERE ";

    const { Column, Value } = req.body;
    let params = [];

    if (typeof Value === 'string') {
        sql += `${Column} LIKE ?`;
        params.push(`%${Value}%`);
    } else {
        sql += `${Column} = ?`;
        params.push(Value);
    }

    connection.query(sql, params, (error, results) => {
        if (results.length > 0) {
            if (!error) {
                res.status(200).json({ msg: "Data returned successfully!", localDonation: results });
            } else {
                res.status(500).json({ msg: "Error returning data from the database." });
            }
        } else {
            res.status(404).json({ msg: "Data not found!" });
        }
    });
});

localDonationRoutes.post("/localdonation", (req, res, error) => {

    const sql = 'INSERT INTO donationsinstitutions(Name, CNPJ, Contact, Email) VALUES (?, ?, ?, ?)';
    const { Name, CNPJ, Contact, Email } = req.body;

    connection.query(sql, [Name, CNPJ, Contact, Email], (error, results) => {
        if (results.affectedRows > 0) {
            if (!error) {
                res.status(200).json({ msg: "Register successfully!" });
            } else {
                res.status(500).json({ msg: "Error registering data from the database." });
            }
        } else {
            res.status(500).json({ msg: "A error ocurred!", error });
        }
    });
});

localDonationRoutes.put("/localdonation", (req, res, error) => {
    let sql = "UPDATE donationsinstitutions SET Name = ?, " +
        "CNPJ = ?, " +
        "Contact = ?, " +
        "Email = ? " +
        "WHERE DonationsInstitutionsID = ?";

    const { Name, CNPJ, Contact, Email, DonationsInstitutionsID } = req.body;

    connection.query(sql, [Name, CNPJ, Contact, Email, DonationsInstitutionsID], (error, results) => {
        if (results.affectedRows > 0) {
            if (!error) {
                res.status(200).json({ msg: "Data updated successfully!" });
            } else {
                res.status(500).json({ msg: "Error updating data from the database." });
            }
        } else {
            res.status(404).json({ msg: "Data not found!" });
        }
    });
});

localDonationRoutes.delete("/localdonation", (req, res, error) => {
    let sql = 'DELETE FROM donationsinstitutions WHERE ';
    const { Column, Value } = req.body;
    let params = [];

    if (typeof Value === 'string') {
        sql += `${Column} LIKE ?`;
        params.push(`%${Value}%`);
    } else {
        sql += `${Column} = ?`;
        params.push(Value);
    }

    connection.query(sql, params, (error, results) => {
        if (results.affectedRows > 0) {
            if (!error) {
                res.status(200).json({ msg: "Data deleted successfully!" });
            } else {
                res.status(500).json({ msg: "Error deleting data from the database." });
            }
        } else {
            res.status(404).json({ msg: "Data not found!" });
        }
    });
});

export default localDonationRoutes;