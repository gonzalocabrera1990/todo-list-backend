const express = require("express");
var User = require("../models/users");
var List = require("../models/group");
var Goup = require("../models/list");
const router = express.Router();
const cors = require("./cors");
var passport = require("passport");
var authenticate = require("../authenticate");
const { getUsuario } = require('../helpers/libs');
router.use(express.json());

router.options("*", cors.corsWithOptions, (req, res) => {
  res.sendStatus(200);
});


router.post("/signup", cors.corsWithOptions, (req, res, next) => {
  console.log(req.body);
  User.findOne({ username: req.body.username })
    .then(user => {
      if (user) {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json({
          status: "Ya existe una cuenta con el e-mail elegido"
        });
      } else {
        User.register(
          new User({ username: req.body.username }),
          req.body.password,
          (err, user) => {
            if (err) {
              res.statusCode = 500;
              res.setHeader("Content-Type", "application/json");
              res.json({
                err: err,
                status: "Ha ocurrido un error de servidor. 500"
              });
            } else {
              let saveUser = getUsuario(req.body.username)
              saveUser.then((mira) => {
                user.usuario = mira;
                user.image = { filename: 'images/perfildefault.jpg', likes: 0 };
                user.backgrounds = {}
                if (req.body.country) user.country = req.body.country;
                if (req.body.date) user.date = req.body.date;
                if (req.body.gender) user.gender = req.body.gender;
                if (req.body.firstname) user.firstname = req.body.firstname;
                if (req.body.lastname) user.lastname = req.body.lastname;
                // user.save((err, user) => {
                //   if (err) {
                //     res.statusCode = 500;
                //     res.setHeader("Content-Type", "application/json");
                //     res.json({
                //       err: err,
                //       status: "Ha ocurrido un error en el registro. Intente otra vez"
                //     });
                //     return;
                //   }});
                user.save()
                passport.authenticate("local")(req, res, () => {
                  res.statusCode = 200;
                  res.setHeader("Content-Type", "application/json");
                  res.json({
                    success: true,
                    status: "Registro Exitoso! Vuelve para iniciar sesion"
                  });
                });

              })
            }
          })
      }
    })
})
router.put("/settings/:userID", cors.corsWithOptions, (req, res, next) => {
  User.findById(req.params.userID)
    .then(user => {
      if (!user._id.equals(req.params.userID)) {
        var err = new Error("You are not authorized to update this data!");
        err.status = 403;
        return next(err);
      } else {
        let mostara = req.body.status == "" ? "req.body.status != .." : req.body.status == null ? "null" : req.body.status
        if (req.body.firstname) user.firstname = req.body.firstname;
        if (req.body.lastname) user.lastname = req.body.lastname;
        if (req.body.phrase) user.phrase = req.body.phrase;
        if (req.body.status || req.body.status === false) user.publicStatus = req.body.status;

        user.save((err, user) => {
          if (err) {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.json({
              err: err,
              status: "Ha ocurrido un error en el registro. Intente otra vez"
            });
            return;
          } else {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json({
              success: true,
              status: "Registro Exitoso! Vuelve para iniciar sesion"
            });
          }
        })
      }
    })
})
router.post("/login", cors.corsWithOptions, (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {

    if (err) return next(err);
    if (!user) {
      res.statusCode = 401;
      res.setHeader("Content-Type", "application/json");
      res.json({ success: false, status: "Login Unsuccessful!", err: info });
      return
    }
    req.logIn(user, err => {
      if (err) {
        res.statusCode = 401;
        res.setHeader("Content-Type", "application/json");
        res.json({
          success: false,
          status: "Login Unsuccessful!",
          err: "Could not log in user!"
        });
      } else {
        var token = authenticate.getToken({ _id: req.user._id });
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json({
          success: true,
          status: "Login Successful!",
          token: token,
          userdata: user
        });
      }
    });
  })(req, res, next);
});
router.get("/checkJWTtoken", cors.corsWithOptions, (req, res) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err) return next(err);

    if (!user) {
      res.statusCode = 401;
      res.setHeader("Content-Type", "application/json");
      return res.json({ status: "JWT invalid!", success: false, err: info });
    } else {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      return res.json({ status: "JWT valid!", success: true, user: user });
    }
  })(req, res);
});
router.get("/logout", cors.corsWithOptions, (req, res, next) => {
  if (req.session) {
    req.session.destroy();
    res.clearCookie("session-id");
    res.redirect("/");
  } else {
    var err = new Error("You are not logged in!");
    err.status = 403;
    next(err);
  }
});
router.get("/get-home-user/:userID", cors.corsWithOptions, (req, res) => {
  User.findOne({ username: req.params.userID })
    .populate('tasks')
    .populate('todaytasks')
    .populate('favTasks')
    .populate('datetasks')
    .populate('assigntasks')
    .populate('lists')
    .populate({
      path: 'groups',
      populate: [
        {
          path: 'members'
        },
        {
          path: 'tasks',
          populate: 'appointed'
        },
        {
          path: 'leader'
        }
      ]
    })
    .then((user) => {
      if (user.todaytasks.length) {
        let timestamp = new Date(user.todaytasks[0].timestamp).toJSON().slice(0, 10);
        let currenDate = new Date().toJSON().slice(0, 10);
        if (currenDate > timestamp) {
          let taskday = user.todaytasks
          let indexItem = 0;
          for (let i = 0; i < taskday.length; i++) {
            let timestampItem = new Date(taskday[i].timestamp).toJSON().slice(0, 10);
            console.log("timestampItem", timestampItem);
            if (currenDate > timestampItem) {
              indexItem = i
              break
            }
          }
          let spliceList = user.todaytasks.splice(indexItem)
          user.save()
            .then(() => {
              User.findOne({ username: req.params.userID })
                .populate('tasks')
                .populate('todaytasks')
                .populate('favTasks')
                .populate('datetasks')
                .populate('assigntasks')
                .populate('lists')
                .populate({
                  path: 'groups',
                  populate: [
                    {
                      path: 'members'
                    },
                    {
                      path: 'tasks',
                      populate: 'appointed'
                    },
                    {
                      path: 'leader'
                    }
                  ]
                })
                .then((user) => {
                  res.statusCode = 200;
                  res.setHeader("Content-Type", "application/json");
                  res.json(user);
                  return
                })
            })

        } else {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(user);
        }
      } else {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(user);
      }
    })
    .catch(err => {
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.json({ err: err });
    });
  // .populate({
  //   path : 'notifications',
  //   populate : {
  //     path : 'followingId'
  //   }
  // })
  // .populate('imagesWall')
  // .populate('videosWall')
  // .populate('stories')
  // try {
  //   const user = await User.findOne({ username: req.params.userID })
  //   console.log("user", user);
  //   res.statusCode = 200;
  //   res.setHeader("Content-Type", "application/json");
  //   res.json(user);
  // } catch(err) {
  //   console.log(err)
  //   res.statusCode = 500;
  //   res.setHeader("Content-Type", "application/json");
  //   res.json({ err: err });
  // }
}
);
router.post("/change-background/:userId", cors.corsWithOptions, (req, res, next) => {
  console.log(req.body)
  User.findById(req.params.userId)
    .then(user => {
      let show = user.backgrounds[`${req.body.type}`] = req.body.value
      user.save()
        .then(user => {
          User.findById(req.params.userId)
            .then(user => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json")
              res.json(user.backgrounds)
            })
        })
    })
    .catch(error => {
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json")
      res.json(error)
    })
});

module.exports = router;
// if (user.todaytasks.length) {
//  let timestamp = new Date(user.todaytasks[0].timestamp).toJSON().slice(0, 10);
//   let currenDate = new Date().toJSON().slice(0, 10);
//   console.log("timestamp", timestamp);
//   console.log("currenDate", currenDate);

//   if (currenDate > timestamp) {
//     let taskday = user.todaytasks
//     let indexItem = 0;
//     for (let i = 0; i < taskday.length; i++) {
//       let timestampItem = taskday[i].timestamp.split('T')[0]
//       if (currenDate > timestampItem) {
//         indexItem = i
//         break
//       }
//       let spliceList = user.todaytasks.splice(indexItem)
//       user.save()
//         .then(() => {
//           User.findOne({ username: req.params.userID })
//             .populate('tasks')
//             .populate('todaytasks')
//             .populate('favTasks')
//             .populate('datetasks')
//             .populate('assigntasks')
//             .populate('lists')
//             .populate('groups')
//             .then((user) => {
//               res.statusCode = 200;
//               res.setHeader("Content-Type", "application/json");
//               res.json(user);
//             })
//         })
//     }

//   } else {
//     res.statusCode = 200;
//     res.setHeader("Content-Type", "application/json");
//     res.json(user);
//   }
// } else {
//   res.statusCode = 200;
//   res.setHeader("Content-Type", "application/json");
//   res.json(user);
// }