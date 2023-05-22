import express from "express";
import connection from "../connection.js";

const addressDonationRoutes = express.Router();

addressDonationRoutes.get("/listaddressdonation", (req, res, error) => {
    const sql = "SELECT DonationsAddressID, " +
        "DonationsInstitutionsID, " +
        "CEP, " +
        "State, " +
        "City, " +
        "Province, " +
        "PublicPlace, " +
        "Number, " +
        "Complementary " +
        "FROM donationsaddress DA";

    connection.query(sql, (error, results) => {
        if (results.length > 0) {
            if (!error) {
                res.status(200).json({ msg: "Data returned with success!", addressDonation: results });
            } else {
                res.status(404).json({ msg: error });
            }
        } else {
            res.status(404).json({ msg: "Data not found!" });
        }
    });
});

addressDonationRoutes.get("/addressdonation", (req, res, error) => {
    let sql = "SELECT DonationsAddressID, " +
        "DonationsInstitutionsID, " +
        "CEP, " +
        "State, " +
        "City, " +
        "Province, " +
        "PublicPlace, " +
        "Number, " +
        "Complementary " +
        "FROM donationsaddress DA " +
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
                res.status(200).json({ msg: "Data returned successfully!", addressDonation: results });
            } else {
                res.status(500).json({ msg: "Error returning data from the database." });
            }
        } else {
            res.status(404).json({ msg: "Data not found!" });
        }
    });
});

addressDonationRoutes.post("/addressdonation", (req, res, error) => {

    const sql = 'INSERT INTO donationsaddress(DonationsInstitutionsID, CEP, State, City, Province, PublicPlace, Number, Complementary) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    const { DonationsInstitutionsID, CEP, State, City, Province, PublicPlace, Number, Complementary } = req.body;

    connection.query(sql, [DonationsInstitutionsID, CEP, State, City, Province, PublicPlace, Number, Complementary], (error, results) => {
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

addressDonationRoutes.put("/addressdonation", (req, res, error) => {
    let sql = "UPDATE donationsaddress SET DonationsInstitutionsID = ?, " +
        "CEP = ?, " +
        "State = ?, " +
        "City = ?, " +
        "Province = ?, " +
        "PublicPlace = ?, " +
        "Number = ?, " +
        "Complementary = ? " +
        "WHERE DonationsAddressID = ?";

    const { DonationsInstitutionsID, CEP, State, City, Province, PublicPlace, Number, Complementary, DonationsAddressID } = req.body;

    connection.query(sql, [DonationsInstitutionsID, CEP, State, City, Province, PublicPlace, Number, Complementary, DonationsAddressID], (error, results) => {
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

addressDonationRoutes.delete("/addressdonation", (req, res, error) => {
    let sql = 'DELETE FROM donationsaddress WHERE ';
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

export default addressDonationRoutes;