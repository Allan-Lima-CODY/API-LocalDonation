import express from "express";
import axios from "axios";
import methods from "../generalMethods.js";
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

addressDonationRoutes.post("/addressdonation/:id", async (req, res, error) => {
    const DonationsInstitutionsID = req.params.id;

    const hasAddress = await methods.VerifyIfHadAddress(res, DonationsInstitutionsID);

    if (!hasAddress) {
        const { CEP, Number, Complementary } = req.body;

        try {
            const response = await axios.get(`https://viacep.com.br/ws/${CEP}/json/`);
            const { localidade, uf, bairro, logradouro } = response.data;

            console.log(response.data);

            const sql = 'INSERT INTO donationsaddress(DonationsInstitutionsID, CEP, State, City, Province, PublicPlace, Number, Complementary) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
            const values = [DonationsInstitutionsID, CEP, Number, Complementary, localidade, uf, bairro, logradouro];

            connection.query(sql, values, (error, results) => {
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
        } catch (error) {
            res.status(400).json({ error: 'Invalid CEP!' });
        }
    }
});

addressDonationRoutes.put("/addressdonation", async (req, res, error) => {
    const { CEP, Number, Complementary, DonationsInstitutionsID } = req.body;

    try {
        const response = await axios.get(`https://viacep.com.br/ws/${CEP}/json/`);
        const { localidade, uf, bairro, logradouro } = response.data;

        let sql = "UPDATE donationsaddress SET DonationsInstitutionsID = ?, " +
        "CEP = ?, " +
        "State = ?, " +
        "City = ?, " +
        "Province = ?, " +
        "PublicPlace = ?, " +
        "Number = ?, " +
        "Complementary = ? " +
        "WHERE DonationsAddressID = ?";

        const values = [CEP, uf, localidade, bairro, logradouro, Number, Complementary, DonationsInstitutionsID];

        connection.query(sql, values, (error, results) => {
            console.log(sql);
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
    } catch (error) {
        res.status(400).json({ msg: "Invalid CEP!" });
    }
});

export default addressDonationRoutes;