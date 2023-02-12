const express = require("express");
const path = require("path");
const hbs = require("hbs");
const app = express();
const bodyParser = require('body-parser');
const { json } = require("express");
require("./db/conn");
const ownerRegister = require("./models/owner_register");
const userRegister = require("./models/tenant_register");
const Build = require("./models/add");
const services = require("./models/services");
const Buildinfo = require("./models/buildinfo");
const complaints = require("./models/complaints");
const { handlebars } = require("hbs");
const { resourceLimits } = require("worker_threads");
const payinfo = require("./models/payment");
const port = process.env.PORT || 3000;
const static_path = path.join(__dirname, "../public");
const partial_path = path.join(__dirname, "../src/templates/partials");
const template_path = path.join(__dirname, "../src/templates/views");

app.use(express.static(static_path));

app.set("view engine", "hbs");
hbs.registerPartials(partial_path)
app.set("views", template_path);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));



app.get("/", (req, res) => {
    res.render("index")
});

app.get("/invoice", (req, res) => {
    userRegister.find({}, function (err, users) {
        payinfo.find({}, function (err, payment) {
            Buildinfo.find({}, function (err, buildinfo) {
                res.render('invoice', {
                    data: users,
                    data1: buildinfo,
                    data2: payment
                })
            }).limit(1);
        }).limit(1);
    }).limit(1);
});

app.get("/tenant_payment", (req, res) => {
    Buildinfo.find({}, function (err, result) {
        res.render("tenant_payment", {
            data: result
        })
    }).limit(1);
})

app.get("/owner_login", (req, res) => {
    res.render("owner_login")
})

app.get("/owner_services", (req, res) => {
    services.find({}, function (err, servicesinfo) {
        Build.find({}, function (err, building) {
            res.render("owner_services", {
                data: building,
                data1: servicesinfo
            })
        })
    })
});

app.get("/tenant_login", (req, res) => {
    res.render("tenant_login")
})

app.get("/owner_complaints", (req, res) => {
    complaints.find({}, function (err, compinfo) {
        Build.find({}, function (err, building) {
            res.render("owner_complaints", {
                data: building,
                data1: compinfo
            })
        })
    })
})



app.get("/owner_register", (req, res) => {
    res.render("owner_register");
})

app.get("/tenant_register", (req, res) => {
    res.render("tenant_register");
})

app.get("/forgotpassword", (req, res) => {
    res.render("forgotpassword")
})

app.get("/tenant_services", (req, res) => {
    Build.find({}, function (err, building) {
        res.render("tenant_services", {
            data: building
        })
    }).limit(1);
})

app.get("/tenant_documents", (req, res) => {
    res.render("tenant_documents")
})

app.get("/owner_documents", (req, res) => {
    Build.find({}, function (err, building) {
        res.render("owner_documents", {
            data: building
        })
    });
})

app.get("/owner_add", (req, res) => {
    res.render("owner_add")
})

app.get("/owner_tenants", (req, res) => {
    Build.find({}, function (err, building) {
        res.render("owner_tenants", {
            data: building
        })
    });
})

app.get("/tenant_complaints", (req, res) => {
    Build.find({}, function (err, building) {
        res.render("tenant_complaints", {
            data: building,
        })
    }).limit(1);
})


app.get("/tenant_myabode", (req, res) => {
    Build.find({}, function (err, building) {
        res.render("tenant_myabode", {
            data: building
        })
    }).limit(1);
});

app.get("/tenant_dashboard", (req, res) => {
    Build.find({}, function (err, building) {
        res.render("tenant_dashboard", {
            data: building
        })
    }).limit(1);
}
)


app.get("/owner_home", (req, res) => {
    Build.find({}, function (err, building) {
        res.render("owner_home", {
            data: building
        })
    });
});


app.post("/owner_register", async (req, res) => {
    try {
        const password = req.body.password;
        const cpassword = req.body.confirmpassword;
        if (password === cpassword) {
            const registerowner = new ownerRegister({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                gender: req.body.gender,
                mobile: req.body.mobile,
                age: req.body.age,
                password: req.body.password,
                confirmpassword: req.body.confirmpassword,
            })

            const regsitered = await registerowner.save();
            res.status(201).render("owner_home");

        }
        else {
            res.status(400).send("Password is not matching!");
        }
    }
    catch (error) {
        res.status(400).send("All the feilds are required");
    }
})
app.listen(port, () => {
    console.log(`server is running at port no ${port}`);
})


app.post("/owner_complaints", async (req, res) => {
    complaints.deleteOne({}, function (err, obj) {
        if (err) throw err;
        else {
            console.log("Your complaint has been adddressed!");
            res.render("owner_complaints");
        }
    })
})

app.post("/tenant_payment", async (req, res) => {
    try {
        const name = req.body.card_holder;
        const number = req.body.card_number;
        const month = req.body.mm;
        const year = req.body.yy;
        const cvv = req.body.cvv;
        if (name === "" || number === "" || month === "" || year === "" || cvv === "") {
            res.send("All the fields are required");
        }
        else {
            const newpay = new payinfo({
                cardholder: req.body.card_holder,
                cardnumber: req.body.card_number
            })
            const paid = await newpay.save();
            setTimeout(() => {
                res.render("invoice");
            }, 5000);
        }
    }
    catch (err) {
        res.send(err);
    }
})


app.post("/owner_services", async (req, res) => {
    services.deleteOne({}, function (err, obj) {
        if (err) throw err;
        else {
            console.log("Service has been marked as addressed!");
            res.render("owner_services");
        }
    })
})

app.post("/owner_add", async (req, res, data) => {
    try {
        const name = req.body.name;
        const sloc = req.body.slocality;
        const cont = req.body.contact;
        const bno = req.body.buildingno;
        const str = req.body.street;
        const loct = req.body.locality;
        const loc = req.body.location;
        const state = req.body.state;
        const city = req.body.city;
        const no = req.body.flats;
        const bimage = req.body.buildimage;
        if (loc === "" || state === "" || city === "" || no === "" || bimage === "" || bno === "" || str === "" || loct === "" || name === "" || cont === "") {
            res.send("All fields are required!");
        }
        else {
            const data = Date.now();
            const newbuild = new Build({
                name: req.body.name,
                contact: req.body.contact,
                buildingno: req.body.buildingno,
                location: req.body.location,
                slocality: req.body.slocality,
                locality: req.body.locality,
                street: req.body.street,
                state: req.body.state,
                city: req.body.city,
                flats: req.body.flats,
                buildimage: req.body.buildimage,
                buildid: data,
            })
            exports.data = data;
            const building = await newbuild.save();
            setTimeout(() => {
                res.render("owner_home");
            }, 5000);
        }
    }
    catch (error) {
        res.status(400).send(error);
    }
})


app.post("/owner_home", async (req, res) => {

    try {
        const id = await Build.findOne();
        console.log(id);
        const edibuild = new Buildinfo({
            buildid: id,
            flatno: req.body.flatno,
            Rooms: req.body.Rooms,
            Rent: req.body.Rent
        })
        const edit = await edibuild.save();
        console.log('The building details have been updated')
        setTimeout(() => {
            res.render("owner_home");
        }, 5000);
    }
    catch (error) {
        res.status(400).send(error);
    }

})

app.post("/tenant_services", async (req, res) => {
    try {
        const des = req.body.desc;
        if (des == null) {
            res.send("Enter the service description!");
        }
        else {
            const newservice = new services({
                buildid: req.body.buildid,
                service: req.body.desc
            })
            const serviced = await newservice.save();
            console.log("your service has been requested");
            res.render("tenant_services");
        }
    }
    catch (error) {
        res.status(401).send("Enter all the fields");
    }

})

app.post("/tenant_complaints", async (req, res) => {
    try {
        const name = req.body.name;
        const desc = req.body.complaint;
        if (name == null || desc == null) {
            res.send("Enter all the fields!");
        }
        else {
            const newcomp = new complaints({
                buildid: req.body.buildid,
                name: req.body.name,
                complaint: req.body.complaint
            })
            const comp = await newcomp.save();
            console.log("Your complaint has been raised");
            res.render("tenant_complaints");
        }
    }
    catch (error) {
        res.status(401).send(error);
    }
}
)




app.post("/owner_login", async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const useremail = await ownerRegister.findOne({ email: email });
        if (email == null || password == null) {
            res.send("Fields can't be empty")
        }
        else if (useremail.password === password) {
            res.status(201).render("owner_home");
        }

        else {
            res.send("password not matched")
        }
    }
    catch (error) {
        res.status(400).send("Invalid user")
    }
})


app.post("/tenant_register", async (req, res) => {
    try {
        const password = req.body.password;
        const cpassword = req.body.confirmpassword;
        const mobile = req.body.mobile;
        if (mobile.length < 10) {
            res.status(400).send("Enter a valid number");
        }
        else if (password === cpassword) {
            const registeruser = new userRegister({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                gender: req.body.gender,
                mobile: req.body.mobile,
                age: req.body.age,
                password: req.body.password,
                confirmpassword: req.body.confirmpassword,
                buildingid: req.body.buildingid
            })

            const regsitered = await registeruser.save();
            res.status(201).render("tenant_dashboard");

        }
        else {
            res.status(400).send("Password is not matching!");
        }
    }
    catch (error) {
        res.status(400).send("All the feilds are required");
    }
})



app.post("/tenant_login", async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const useremail = await userRegister.findOne({ email: email });
        if (email == null || password == null) {
            res.send("Fields can't be empty")
        }
        else if (useremail.password === password) {
            console.log(useremail.buildingid)
            a = useremail.buildingid;
            res.status(201).render("tenant_dashboard")
        }

        else {
            res.send("password not matched")
        }
    }
    catch (error) {
        res.status(400).send("Invalid user")
    }
})




app.post("/forgotpassword", async (req, res) => {
    try {
        const email = req.body.email;
        const oldpass = req.body.oldpass;
        const updatepass = await userRegister.findOne({ email: email });
        if (email === null || oldpass === null) {
            res.send("Fields can't be empty")
        }
        else if (updatepass.password === oldpass) {
            res.status(201).render("login")
        }

        else {
            res.send("password not matched")
        }
    }
    catch (error) {
        res.status(400).send("Invalid user")
    }
})


