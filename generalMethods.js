import exportedLogin from "./routes/login.js";
import connection from "./connection.js";

async function VerifyIfHadAddress(res, DonationsInstitutionsID) {
    const sql = "SELECT DonationsInstitutionsID FROM donationsaddress WHERE DonationsInstitutionsID = " + DonationsInstitutionsID;

    try {
        const results = await new Promise((resolve, reject) => {
            connection.query(sql, (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });

        if (results.length > 0) {
            res.status(200).json({ msg: "That institution had an address registered!" });
            return false;
        } else {
            return true;
        }
    } catch (error) {
        console.error(error);
        return false;
    }
}

const methods = {
    VerifyIfHadAddress
}

export default methods;