const express = require('express');
const cors = require('./cors')
const TasksRouter = express.Router()

const User = require('../models/users')
const Tasks = require('../models/tasks/task')
const DateTasks = require('../models/tasks/dateTask')
const FavTasks = require('../models/tasks/favTask')
const AssingTasks = require('../models/tasks/assigntask')
const Group = require('../models/group')
const List = require('../models/list')
const { buscarTextoEnObjeto } = require('../helpers/libs')

TasksRouter.options("*", cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
});
TasksRouter.post('/create-task/:userId', cors.corsWithOptions, (req, res) => {
    Tasks.create(req.body)
        .then((task, err) => {
            if (err) {
                const error = new Error('Task wasnt created')
                throw error;
            } else {
                User.findById(req.params.userId)
                    .then(user => {
                        let show = user.tasks.unshift(task._id)
                        let showed = user.todaytasks.unshift(task._id)
                        user.save()
                            .then(user => {
                                User.findById(req.params.userId)
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
                                    .then(user => {
                                        res.statusCode = 200;
                                        res.setHeader("Content-Type", "application/json");
                                        res.json(user)
                                    })
                            })
                    })
            }

        })
        .catch((err) => {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.json({ err: err });
        });
})
TasksRouter.put('/update-task/:userId/:taskId', cors.corsWithOptions, (req, res) => {
    Tasks.findByIdAndUpdate(req.params.taskId, {
        $set: req.body
    }, { new: true })
        .then(user => {
            User.findById(req.params.userId)
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
                .then(user => {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json(user)
                })
        })
        .catch((err) => {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.json({ err: err });
        });

})
TasksRouter.put('/task-done/:userId/:taskId', cors.corsWithOptions, (req, res) => {
    Tasks.findByIdAndUpdate(req.params.taskId, {
        $set: req.body
    }, { new: true })
        .then(user => {
            User.findById(req.params.userId)
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
                .then(user => {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json(user)
                })
        })
        .catch((err) => {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.json({ err: err });
        });

})
TasksRouter.delete('/delete-task/:userId/:taskId', cors.corsWithOptions, (req, res) => {
    User.findById(req.params.userId)
        .then(user => {
            let showid = user.tasks.findIndex(item => { item == req.params.taskId })
            let showedid = user.todaytasks.findIndex(item => { item == req.params.taskId })
            if (showid != -1) {
                let show = user.tasks.splice(showid, 1)
            }
            if (showedid != -1) {
                let showed = user.todaytasks.splice(showedid, 1)
            }
            user.save()
                .then(() => {
                    Tasks.findByIdAndRemove(req.params.taskId)
                        .then(user => {
                            User.findById(req.params.userId)
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
                                .then(user => {
                                    res.statusCode = 200;
                                    res.setHeader("Content-Type", "application/json");
                                    res.json(user)
                                })
                        })
                })
        })
        .catch((err) => {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.json({ err: err });
        });

})


TasksRouter.post('/create-datetask/:userId', cors.corsWithOptions, (req, res) => {
    DateTasks.create(req.body)
        .then((task, err) => {
            if (err) {
                const error = new Error('Task wasnt created')
                throw error;
            } else {
                User.findById(req.params.userId)
                    .then(user => {
                        let show = user.datetasks.unshift(task._id)
                        user.save()
                            .then(user => {
                                User.findById(req.params.userId)
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
                                    .then(user => {
                                        res.statusCode = 200;
                                        res.setHeader("Content-Type", "application/json");
                                        res.json(user)
                                    })
                            })
                    })
            }

        })
        .catch((err) => {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.json({ err: err });
        });
})
TasksRouter.put('/update-datetask/:userId/:taskId', cors.corsWithOptions, (req, res) => {
    DateTasks.findByIdAndUpdate(req.params.taskId, {
        $set: req.body
    }, { new: true })
        .then(user => {
            User.findById(req.params.userId)
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
                .then(user => {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json(user)
                })
        })
        .catch((err) => {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.json({ err: err });
        });

})
TasksRouter.put('/task-datetask-done/:userId/:taskId', cors.corsWithOptions, (req, res) => {
    DateTasks.findByIdAndUpdate(req.params.taskId, {
        $set: req.body
    }, { new: true })
        .then(user => {
            User.findById(req.params.userId)
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
                .then(user => {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json(user)
                })
        })
        .catch((err) => {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.json({ err: err });
        });

})
TasksRouter.delete('/delete-datetask-task/:userId/:taskId', cors.corsWithOptions, (req, res) => {
    User.findById(req.params.userId)
        .then(user => {
            let showid = user.tasks.findIndex(item => { item == req.params.taskId })
            let showedid = user.todaytasks.findIndex(item => { item == req.params.taskId })
            if (showid != -1) {
                let show = user.tasks.splice(showid, 1)
            }
            if (showedid != -1) {
                let showed = user.todaytasks.splice(showedid, 1)
            }
            user.save()
                .then(() => {
                    DateTasks.findByIdAndRemove(req.params.taskId)
                        .then(user => {
                            User.findById(req.params.userId)
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
                                .then(user => {
                                    res.statusCode = 200;
                                    res.setHeader("Content-Type", "application/json");
                                    res.json(user)
                                })
                        })
                })
        })
        .catch((err) => {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.json({ err: err });
        });

})


TasksRouter.post('/create-favtask/:userId', cors.corsWithOptions, (req, res) => {
    console.log(req.body);
    console.log(req.params.userId);
    FavTasks.create(req.body)
        .then((task, err) => {
            console.log("task", task);
            if (err) {
                const error = new Error('Task wasnt created')
                throw error;
            } else {
                User.findById(req.params.userId)
                    .then(user => {
                        let show = user.favTasks.unshift(task._id)
                        user.save()
                            .then(user => {
                                User.findById(req.params.userId)
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
                                    .then(user => {
                                        res.statusCode = 200;
                                        res.setHeader("Content-Type", "application/json");
                                        res.json(user)
                                    })
                            })
                    })
            }

        })
        .catch((err) => {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.json({ err: err });
        });
})
TasksRouter.put('/update-favtask/:userId/:taskId', cors.corsWithOptions, (req, res) => {
    FavTasks.findByIdAndUpdate(req.params.taskId, {
        $set: req.body
    }, { new: true })
        .then(user => {
            User.findById(req.params.userId)
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
                .then(user => {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json(user)
                })
        })
        .catch((err) => {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.json({ err: err });
        });

})
TasksRouter.post('/add-favtask/:userId/:taskId', cors.corsWithOptions, (req, res) => {
    FavTasks.create(req.body)//crear el delete para el schema de la tarea eliminada de task y todaytask, y favtask de la otra api
        .then((task, err) => {
            if (err) {
                const error = new Error('Task wasnt created')
                throw error;
            } else {
                User.findById(req.params.userId)
                    .then(user => {
                        let tasksIndex = user.tasks.findIndex((item) => item == req.params.taskId)
                        let tasksDrop = user.tasks.splice(tasksIndex, 1)
                        let todaytasksIndex = user.todaytasks.findIndex((item) => item == req.params.taskId)
                        let todaytasksIndexDrop = user.todaytasks.splice(todaytasksIndex, 1)
                        let showed = user.favTasks.unshift(task._id)
                        user.save()
                            .then(user => {
                                Tasks.findByIdAndDelete(req.params.taskId)
                                    .then((task, err) => {
                                        if (err) {
                                            const error = new Error('Task wasnt created')
                                            throw error;
                                        }
                                    })
                            })
                            .then(user => {
                                User.findById(req.params.userId)
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
                                    .then(user => {
                                        res.statusCode = 200;
                                        res.setHeader("Content-Type", "application/json");
                                        res.json(user)
                                    })
                            })
                    })
            }

        })
        .catch((err) => {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.json({ err: err });
        });
})
TasksRouter.post('/drop-favtask/:userId/:taskId', cors.corsWithOptions, (req, res) => {
    Tasks.create(req.body)//crear el delete para el schema de la tarea eliminada de task y todaytask, y favtask de la otra api
        .then((task, err) => {
            if (err) {
                const error = new Error('Task wasnt created')
                throw error;
            } else {
                User.findById(req.params.userId)
                    .then(user => {
                        let show = user.tasks.unshift(task._id)
                        let showed = user.todaytasks.unshift(task._id)
                        let tasksIndex = user.favTasks.findIndex((item) => item == req.params.taskId)
                        let tasksDrop = user.favTasks.splice(tasksIndex, 1)
                        user.save()
                            .then(user => {
                                Tasks.findByIdAndDelete(req.params.taskId)
                                    .then((task, err) => {
                                        if (err) {
                                            const error = new Error('Task wasnt created')
                                            throw error;
                                        }
                                    })
                            })
                            .then(user => {
                                User.findById(req.params.userId)
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
                                    .then(user => {
                                        res.statusCode = 200;
                                        res.setHeader("Content-Type", "application/json");
                                        res.json(user)
                                    })
                            })
                    })
            }

        })
        .catch((err) => {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.json({ err: err });
        });
})
TasksRouter.put('/task-favtask-done/:userId/:taskId', cors.corsWithOptions, (req, res) => {
    FavTasks.findByIdAndUpdate(req.params.taskId, {
        $set: req.body
    }, { new: true })
        .then(user => {
            User.findById(req.params.userId)
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
                .then(user => {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json(user)
                })
        })
        .catch((err) => {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.json({ err: err });
        });

})
TasksRouter.delete('/delete-favtask-task/:userId/:taskId', cors.corsWithOptions, (req, res) => {
    User.findById(req.params.userId)
        .then(user => {
            let showid = user.tasks.findIndex(item => { item == req.params.taskId })
            let showedid = user.todaytasks.findIndex(item => { item == req.params.taskId })
            if (showid != -1) {
                let show = user.tasks.splice(showid, 1)
            }
            if (showedid != -1) {
                let showed = user.todaytasks.splice(showedid, 1)
            }
            user.save()
                .then(() => {
                    FavTasks.findByIdAndRemove(req.params.taskId)
                        .then(user => {
                            User.findById(req.params.userId)
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
                                .then(user => {
                                    res.statusCode = 200;
                                    res.setHeader("Content-Type", "application/json");
                                    res.json(user)
                                })
                        })
                })
        })
        .catch((err) => {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.json({ err: err });
        });

})


TasksRouter.post('/create-user-group/:userId', cors.corsWithOptions, (req, res) => {
    Group.create(req.body)//crear el delete para el schema de la tarea eliminada de task y todaytask, y favtask de la otra api
        .then((task, err) => {
            if (err) {
                const error = new Error('Group wasnt created')
                throw error;
            } else {
                User.findById(req.params.userId)
                    .then(user => {
                        let show = user.groups.unshift(task._id)
                        user.save()
                            .then(user => {
                                User.findById(req.params.userId)
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
                                    .then(user => {
                                        res.statusCode = 200;
                                        res.setHeader("Content-Type", "application/json");
                                        res.json(user)
                                    })
                            })
                    })
            }

        })
        .catch((err) => {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.json({ err: err });
        });
})
TasksRouter.get('/add-user-group/:userId/:groupId/:adduserId', cors.corsWithOptions, (req, res) => {
    Group.findById(req.params.groupId)//crear el delete para el schema de la tarea eliminada de task y todaytask, y favtask de la otra api
        .then((grp, err) => {
            if (err) {
                const error = new Error('Group wasnt created')
                throw error;
            } else {
                let show = grp.members.unshift(req.params.adduserId)
                grp.save()
                    .then(group => {
                        User.findById(req.params.adduserId)
                            .then(user => {
                                let show = user.groups.unshift(req.params.groupId)
                                user.save()
                                    .then(() => {
                                        User.findById(req.params.userId)
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
                                            .then(user => {
                                                res.statusCode = 200;
                                                res.setHeader("Content-Type", "application/json");
                                                res.json(user)
                                            })
                                    })
                            })
                    })
            }

        })
        .catch((err) => {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.json({ err: err });
        });
})
TasksRouter.post('/create-tasks-group/:userId/:groupId', cors.corsWithOptions, (req, res) => {
    AssingTasks.create(req.body)//crear el delete para el schema de la tarea eliminada de task y todaytask, y favtask de la otra api
        .then((task, err) => {
            if (err) {
                const error = new Error('Group wasnt created')
                throw error;
            } else {
                Group.findById(req.params.groupId)
                    .then(group => {
                        let show = group.tasks.unshift(task._id)
                        group.save()
                    })
                    .then(() => {
                        User.findById(req.body.appointed)
                            .then(user => {
                                let show = user.assigntasks.unshift(task._id)
                                user.save()
                            })
                    })
                    .then(group => {
                        User.findById(req.params.userId)
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
                        .then(user => {
                            res.statusCode = 200;
                            res.setHeader("Content-Type", "application/json");
                            res.json(user)
                        })
                    })
            }

        })
        .catch((err) => {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.json({ err: err });
        });
})
TasksRouter.put('/update-assingTasks/:userId/:oldUserId/:taskId', cors.corsWithOptions, (req, res) => {
    AssingTasks.findByIdAndUpdate(req.params.taskId, {
        $set: req.body
    }, { new: true })
        .then(task => {
            let userCheck = req.body.appointed != req.params.oldUserId
            if (userCheck) {
                User.findById(req.body.appointed)
                    .then(user => {
                        let change = user.assigntasks.unshift(req.params.taskId)
                        user.save()
                            .then(() => {
                                User.findById(req.params.oldUserId)
                                    .then(usuario => {
                                        let showid = usuario.assigntasks.findIndex(item => item == req.params.taskId)
                                        if (showid != -1) {
                                            let showed = usuario.assigntasks.splice(showid, 1)
                                        }
                                        usuario.save()
                                    })
                            })
                    })
            }
        })
        .then(user => {
            User.findById(req.params.userId)
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
                .then(user => {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json(user)
                })
        })
        .catch((err) => {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.json({ err: err });
        });

})
TasksRouter.put('/assingTasks-done/:userId/:taskId', cors.corsWithOptions, (req, res) => {
    AssingTasks.findByIdAndUpdate(req.params.taskId, {
        $set: req.body
    }, { new: true })
        .then(user => {
            User.findById(req.params.userId)
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
                .then(user => {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json(user)
                })
        })
        .catch((err) => {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.json({ err: err });
        });

})
TasksRouter.delete('/task-group-delete/:usuario/:userId/:groupId/:taskId', cors.corsWithOptions, (req, res) => {
    User.findById(req.params.userId)
        .then(user => {
            let taskIndex = user.assigntasks.findIndex(item => item == req.params.taskId)
            if (taskIndex != -1) {
                let show = user.assigntasks.splice(taskIndex, 1)
            }
            user.save()
                .then(user => {
                    Group.findById(req.params.groupId)
                        .then(gr => {
                            let task = gr.tasks.findIndex(item => item == req.params.taskId)
                            if (task != -1) {
                                let show = gr.tasks.splice(task, 1)
                            }
                            gr.save()
                                .then(user => {
                                    AssingTasks.findByIdAndRemove(req.params.taskId)
                                        .then(() => {
                                            User.findById(req.params.usuario)
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
                                                .then(usuario => {
                                                    res.statusCode = 200;
                                                    res.setHeader("Content-Type", "application/json");
                                                    res.json(usuario)
                                                })
                                        })
                                })
                        })
                })
        })
        .catch((err) => {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.json({ err: err });
        });
})
TasksRouter.delete('/group-delete-user/:userId/:deleteUser/:id', cors.corsWithOptions, (req, res) => {
    User.findById(req.params.deleteUser)
        .then(user => {
            console.log(user.groups)
            let idIndex = user.groups.findIndex(item => item == req.params.id)
            if (idIndex != -1) {
                let showed = user.groups.splice(idIndex, 1)
            }
            user.save()
                .then(() => {
                    Group.findById(req.params.id)
                        .then(grp => {
                            console.log(grp)

                            let showid = grp.members.findIndex(item => item == req.params.deleteUser)
                            console.log(showid)
                            console.log(grp.members[showid])
                            if (showid != -1) {
                                let showed = grp.members.splice(showid, 1)
                            }
                            grp.save()
                                .then(user => {
                                    User.findById(req.params.userId)
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
                                        .then(user => {
                                            res.statusCode = 200;
                                            res.setHeader("Content-Type", "application/json");
                                            res.json(user)
                                        })
                                })
                        })
                })
        })
        .catch((err) => {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.json({ err: err });
        });

})
TasksRouter.delete('/group-delete/:userId/:id', cors.corsWithOptions, (req, res) => {

    Group.findById(req.params.id)
        .then(gr => {
            for (let i = 0; i < gr.members.length; i++) {
                let idMmber = gr.members[i]
                User.findById(idMmber)
                    .populate('assigntasks')
                    .then(usr => {
                        console.log("usr", usr)
                        const indices = usr.assigntasks.map((elemento, index) => {
                            if (elemento.group == req.params.id) {
                                return index;
                            }
                            return null;
                        }).filter(index => index !== null);
                        console.log("indices", indices)

                        for (let i = usr.assigntasks.length - 1; i >= 0; i--) {
                            if (usr.assigntasks[i].group == req.params.id) {
                                usr.assigntasks.splice(i, 1); // Elimina el objeto en el índice i
                            }
                        }
                        usr.save()
                    })
            }
        })
        .then(() => {
            Group.findById(req.params.id)
                .then(gr => {
                    console.log("gr", gr)
                    for (let i = 0; i < gr.members.length; i++) {
                        let idMmber = gr.members[i]
                        User.findById(idMmber)
                            .then(usuario => {
                                let showind = usuario.groups.findIndex(item => item == req.params.id)
                                if (showind != -1) {
                                    let showed = usuario.groups.splice(showind, 1)
                                }
                                usuario.save()
                            })
                    }
                })
        })
        .then(() => {
            Group.findById(req.params.id)
                .then(gr => {
                    const tareasIds = gr.tasks;
                    return AssingTasks.deleteMany({ _id: { $in: tareasIds } });
                })
        })
        .then(() => {
            User.findById(req.params.userId)
                .then(user => {
                    let showid = user.groups.findIndex(item => item == req.params.id)
                    if (showid != -1) {
                        let showed = user.groups.splice(showid, 1)
                    }
                    user.save()
                        .then(() => {
                            Group.findByIdAndRemove(req.params.id)
                                .then(user => {
                                    User.findById(req.params.userId)
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
                                        .then(user => {
                                            res.statusCode = 200;
                                            res.setHeader("Content-Type", "application/json");
                                            res.json(user)
                                        })
                                })
                        })
                })
        })
        .catch((err) => {
            console.log("error", err)
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.json({ err: err });
        });
})


TasksRouter.post('/create-user-list/:userId', cors.corsWithOptions, (req, res) => {
    List.create(req.body)//crear el delete para el schema de la tarea eliminada de task y todaytask, y favtask de la otra api
        .then((list, err) => {
            if (err) {
                const error = new Error('Group wasnt created')
                throw error;
            } else {
                User.findById(req.params.userId)
                    .then(user => {
                        let show = user.lists.unshift(list._id)
                        user.save()
                            .then(user => {
                                User.findById(req.params.userId)
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
                                    .then(user => {
                                        res.statusCode = 200;
                                        res.setHeader("Content-Type", "application/json");
                                        res.json(user)
                                    })
                            })
                    })
            }

        })
        .catch((err) => {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.json({ err: err });
        });
})
TasksRouter.post('/create-task-list/:userId/:listId', cors.corsWithOptions, (req, res) => {
    List.findById(req.params.listId)//crear el delete para el schema de la tarea eliminada de task y todaytask, y favtask de la otra api
        .then((list, err) => {
            if (err) {
                const error = new Error('Group wasnt created')
                throw error;
            } else {
                let show = list.tasks.unshift(req.body)
                list.save()
                    .then(() => {
                        User.findById(req.params.userId)//crear el delete para el schema de la tarea eliminada de task y todaytask, y favtask de la otra api
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
                            .then((list, err) => {
                                res.statusCode = 200
                                res.setHeader("Content-Type", "application/json");
                                res.json(list)
                            })
                    })
            }

        })
        .catch((err) => {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.json({ err: err });
        });
})
TasksRouter.post('/task-list-update/:userId/:listId/:taskId', cors.corsWithOptions, (req, res) => {
    List.findById(req.params.listId)
        .then(list => {
            for (let i = 0; i < list.tasks.length; i++) {
                if (list.tasks[i]._id == req.params.taskId) {
                    list.tasks[i].description = req.body.description
                    list.tasks[i].done = req.body.done
                }
            }
            list.save()
                .then(user => {
                    User.findById(req.params.userId)
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
                        .then(usuario => {
                            res.statusCode = 200;
                            res.setHeader("Content-Type", "application/json");
                            res.json(usuario)
                        })
                })
        })
        .catch((err) => {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.json({ err: err });
        });
})
TasksRouter.get('/task-list-delete/:userId/:listId/:taskId', cors.corsWithOptions, (req, res) => {
    List.findById(req.params.listId)
        .then(list => {
            let taskIndex = list.tasks.findIndex(item => item._id == req.params.taskId)
            if (taskIndex != -1) {
                let show = list.tasks.splice(taskIndex, 1)
            }
            list.save()
                .then(user => {
                    User.findById(req.params.userId)
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
                        .then(usuario => {
                            res.statusCode = 200;
                            res.setHeader("Content-Type", "application/json");
                            res.json(usuario)
                        })
                })
        })
        .catch((err) => {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.json({ err: err });
        });
})
TasksRouter.get('/read-tasks/:userId', cors.corsWithOptions, (req, res) => {
    User.findById(req.params.userId)
        .then((user) => {
            let show = user.assigntasks.map(item => {
                console.log("read tasks", item);
                AssingTasks.findById(item)
                    .then(assign => {
                        if (!assign.seen) {
                            assign.seen = true;
                            assign.save()
                        }
                    })
            })
        })
        .then(() => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json")
            res.json({ message: "Tasks read done." })
        })
        .catch((err) => {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.json({ err: err });
        });
})
TasksRouter.put('/task-list-done/:userId/:listId/:taskId', cors.corsWithOptions, (req, res) => {
    List.findById(req.params.listId)
        .then(list => {
            for (let i = 0; i < list.tasks.length; i++) {
                if (list.tasks[i]._id == req.params.taskId) {
                    list.tasks[i].done = req.body.done
                }
            }
            list.save()
                .then(user => {
                    User.findById(req.params.userId)
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
                        .then(usuario => {
                            res.statusCode = 200;
                            res.setHeader("Content-Type", "application/json");
                            res.json(usuario)
                        })
                })
        })
        .catch((err) => {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.json({ err: err });
        });
})
TasksRouter.delete('/list-delete/:userId/:id', cors.corsWithOptions, (req, res) => {
    User.findById(req.params.userId)
        .then(user => {
            let showid = user.lists.findIndex(item => { item == req.params.id })
            if (showid != -1) {
                let showed = user.lists.splice(showid, 1)
            }
            user.save()
                .then(() => {
                    List.findByIdAndRemove(req.params.id)
                        .then(user => {
                            User.findById(req.params.userId)
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
                                .then(user => {
                                    res.statusCode = 200;
                                    res.setHeader("Content-Type", "application/json");
                                    res.json(user)
                                })
                        })
                })
        })
        .catch((err) => {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.json({ err: err });
        });

})
module.exports = TasksRouter;