const { render } = require('timeago.js');
const requires = require('../admin_requires');
const router   =  requires.router;
const pool     =  requires.pool;
const isauth   =  requires.isauth;

// -LIST
router.get('/allinstitucion/', /*isauth.isLoggedIn, isauth.isVip,*/ async (Req, Res) => {
    /*const promises = [];

    promises.push(
        new Promise ((resolve, reject) => {  pool.query('SELECT * FROM institucion', async (error, results) => {
            if(error){
                reject(error);
            }else{
                resolve(results);
            }
        })})
    );

    promises.push(
        new Promise ((resolve, reject) => {  pool.query('SELECT * FROM encargados', async (error, results) => {
            if(error){
                reject(error);
            }else{
                resolve(results);
            }
        })})
    );

    promises.push(
        new Promise ((resolve, reject) => {  pool.query('SELECT * FROM inst_enc', async (error, results) => {
            if(error){
                reject(error);
            }else{
                resolve(results);
            }
        })})
    );

    
    Promise.all(promises).then( (results) =>{
        if(results[2].length > 1){
            results[2].forEach(element => {
                results[0].find((single) => {  
                    if(single.CUE===element.CUE && single.ID_EST===element.ID_EST){
                        results[1].find((single2) => {  
                            if(single2.ID_ENCARGADO===element.ID_ENCARGADO){
                                if(single2.ID_TIPOENC == 1){
                                    single.nombre_director = single2.nombre;
                                    single.apellido_director = single2.apellido;
                                }else{
                                    single.nombre_inspector = single2.nombre;
                                    single.apellido_inspector = single2.apellido;      
                                }
                            }
                        });
                    }
                });
            });
        }

       // console.log(results[0]);
       

    });                                                     



    //Descomentar todo despois, haciendo css
    */
    Res.render('admin/allinstitucion'/*, {ints: results[0]}*/);
});

// -ADD
router.get('/add/institucion', /*isauth.isLoggedIn, isauth.isVip,*/async (Req, Res) => {
    pool.query('SELECT * FROM encargados',  async (error, results) => {
        if(error){
            throw error;
        }else{
            if(results.length){
                const  directores = [];
                const  inspectores = [];
                const size_t = results.length;
                /*const end = () => {if(directores.length+inspectores.length === size_t) { console.log(directores); console.log(inspectores);  Res.render('admin/institucion/addinstitucion', {directores, inspectores}); }}
                Funciona sin la funcion end, de no funcionar activar.
                */
                results.forEach(element => {
                    if(element.ID_TIPOENC == 1){
                        pool.query('SELECT * FROM enc_tel WHERE ID_ENCARGADO = ?', [element.ID_ENCARGADO], async (error, results) => {
                            if(results.length){
                                TEL = await pool.query('SELECT * FROM telefono WHERE ID_TEL = ?', [results[0].ID_TEL]);
                                
                                if(TEL.length){
                                    element.TEL = TEL[0].telefono; 
                                }else{
                                    element.TEL = "";
                                }
                            }else{
                                element.TEL = "";
                            }

                            if(element.hasOwnProperty('EMAIL')){
                                directores.push(element);
                            }

                            //end();
                        });

                        pool.query('SELECT * FROM enc_email WHERE ID_ENCARGADO = ?', [element.ID_ENCARGADO], async (error, results) => {
                            if(results.length){
                                EMAIL = await pool.query('SELECT * FROM email WHERE ID_EMAIL = ?', [results[0].ID_EMAIL]);
                                if(EMAIL.length){
                                    element.EMAIL = EMAIL[0].email;
                                }else{
                                    element.EMAIL = "";
                                }
                                
                            }else{
                                element.EMAIL = "";
                            }

                            if(element.hasOwnProperty('TEL')){
                                directores.push(element);
                            }

                            //end();
                        });


                        
                    }else{
                        pool.query('SELECT * FROM enc_tel WHERE ID_ENCARGADO = ?', [element.ID_ENCARGADO], async (error, results) => {
                            if(results.length){
                                //console.log(results[0].ID_TEL);
                                TEL = await pool.query('SELECT * FROM telefono WHERE ID_TEL = ?', [results[0].ID_TEL]);
                                //console.log(TEL);
                                if(TEL.length){
                                    //console.log(TEL[0]);
                                    element.TEL = TEL[0].telefono; 
                                }else{
                                    element.TEL = "";
                                }
                                
                            }else{
                                element.TEL = "";
                            }

                            if(element.hasOwnProperty('EMAIL')){
                                inspectores.push(element);
                            }
                            
                            //end();
                        });

                        pool.query('SELECT * FROM enc_email WHERE ID_ENCARGADO = ?', [element.ID_ENCARGADO], async (error, results) => {
                            if(results.length){
                                EMAIL = await pool.query('SELECT * FROM email WHERE ID_EMAIL = ?', [results[0].ID_EMAIL]);
                                if(EMAIL.length){
                                    element.EMAIL = EMAIL[0].email;
                                }else{
                                    element.EMAIL = "";
                                }
                                
                            }else{
                                element.EMAIL = "";
                            }

                            if(element.hasOwnProperty('TEL')){
                                inspectores.push(element);
                            }


                           // end();                        
                        });
                    }

                    
                });

                Res.render('admin/institucion/addinstitucion', {directores, inspectores});
            }else{
                Res.render('admin/institucion/addinstitucion');
            }
        }
    });
});

router.post('/add/institucion', /*isauth.isLoggedIn, isauth.isVip,*/async (Req, Res) => { 
    pool.query('SELECT * FROM institucion WHERE CUE = ? OR ID_EST = ?', [Req.body.CUE, Req.body.ESTABLECIMIENTO], async (error, resu) => {
        if(!resu.length){
            var INS_DOM = {
                CUE: 0,
                ID_EST: 0,
                ID_DOM: 0  
            };
        
        
            var INS_TEL = {
                CUE: 0,
                ID_EST: 0,
                ID_TEL: 0  
            };

            pool.query('INSERT INTO institucion (CUE, ID_EST, nombre_establecimiento, ID_MODALIDAD) VALUES (?, ?, ?, ?)', [Req.body.CUE, Req.body.ESTABLECIMIENTO, Req.body.nombre_escuela, Req.body.NIVEL],  async (error, results) => {
                if(INS_DOM.ID_DOM){
                    INS_DOM.CUE = Req.body.CUE;
                    INS_DOM.ID_EST = Req.body.ESTABLECIMIENTO;
                    pool.query('INSERT INTO inst_dom SET ?', [INS_DOM]);
                    console.log(INS_DOM);
                }else{
                    INS_DOM.CUE = Req.body.CUE;
                    INS_DOM.ID_EST = Req.body.ESTABLECIMIENTO;
                }

                if(INS_TEL.ID_TEL){
                    INS_TEL.CUE = Req.body.CUE;
                    INS_TEL.ID_EST = Req.body.ESTABLECIMIENTO;
                    pool.query('INSERT INTO inst_tel SET ?', [INS_TEL]);
                    console.log(INS_TEL);
                }else{
                    INS_TEL.CUE = Req.body.CUE;
                    INS_TEL.ID_EST = Req.body.ESTABLECIMIENTO;
                }


                if(Req.body.directores){
                    pool.query('INSERT INTO inst_enc (CUE, ID_EST, ID_ENCARGADO) VALUES (?, ?, ?)', [Req.body.CUE, Req.body.ESTABLECIMIENTO, Req.body.directores]);
                }

                if(Req.body.inspectores){
                    pool.query('INSERT INTO inst_enc (CUE, ID_EST, ID_ENCARGADO) VALUES (?, ?, ?)', [Req.body.CUE, Req.body.ESTABLECIMIENTO, Req.body.inspectores]);
                }
            });


            pool.query('INSERT INTO domicilio (ID_LOCALIDAD, nmb_calle, nro_calle) VALUES (?, ?, ?)', [Req.body.LOCALIDAD, Req.body.nmb_calle, Req.body.nro_calle],  async (error, results) => {
                if(INS_DOM.CUE && INS_DOM.ID_EST){
                    INS_DOM.ID_DOM = results.insertId;
                    pool.query('INSERT INTO inst_dom SET ?', [INS_DOM]);
                    console.log(INS_DOM);
                }else{
                    INS_DOM.ID_DOM = results.insertId;
                }
            });


            pool.query('INSERT INTO telefono (telefono) VALUES (?)', [Req.body.telefono_escuela],  async (error, results) => {
                if(INS_TEL.CUE && INS_TEL.ID_EST){
                    INS_TEL.ID_TEL = results.insertId;
                    pool.query('INSERT INTO inst_tel SET ?', [INS_TEL]);
                    console.log(INS_TEL);
                }else{
                    INS_TEL.ID_TEL = results.insertId;
                }
            });

            Req.flash('success', 'Se creo la instutucón correctamente!');
            Res.redirect('/allinstitucion/');
        }else{
            Req.flash('error', 'Esa institución ya esta creada con anterioridad!');
            Res.redirect('/allinstitucion/');
        }
    });
   
});

//-EDIT-//
router.get('/edit/institucion/:CUE/:ID_EST', /*isauth.isLoggedIn, isauth.isVip,*/async (Req, Res) => {
    const { CUE, ID_EST } = Req.params;
    const promises = [];

    promises.push( new Promise ((Resolve, Reject) => {
                const micro_enc = [
                    new Promise((Resolve, Reject) => {
                        pool.query('SELECT * FROM `encargados` WHERE ID_TIPOENC = 1', (error, results) => {
                            if(error){
                                Reject(error);
                            }else{
                                Resolve(results);
                            }
                        })
                    }),
                    new Promise((Resolve, Reject) => {
                        pool.query('SELECT * FROM `encargados` WHERE ID_TIPOENC = 2', (error, results) => {
                            if(error){
                                Reject(error);
                            }else{
                                Resolve(results);
                            }
                        })
                    }),
                    new Promise((Resolve, Reject) => {
                        pool.query('SELECT * FROM `enc_tel`', (error, results) => {
                            if(error){
                                Reject(error);
                            }else{
                                const enc_tel_promise = [];
                                if(results.length){
                                    results.forEach(element => {
                                        enc_tel_promise.push(
                                            new Promise((Resolve, Reject) => {
                                                pool.query('SELECT * FROM `telefono` WHERE ID_TEL = ?', [element.ID_TEL], (error, results) => {
                                                    if(error){
                                                        Reject(error);
                                                    }else{
                                                        Object.assign(element, results[0]);
                                                        Resolve(element);
                                                    }
                                                })
                                            
                                            })
                                        );
                                    });

                                    Promise.all(enc_tel_promise).then(values => {Resolve(values)});
                                }else{
                                    Resolve();
                                }
                            }
                        })
                    }),
                    new Promise((Resolve, Reject) => {
                        pool.query('SELECT * FROM `enc_email`', (error, results) => {
                            if(error){
                                Reject(error);
                            }else{
                                const enc_email_promise = [];
                                if(results.length){
                                    results.forEach(element => {
                                        enc_email_promise.push(
                                            new Promise((Resolve, Reject) => {
                                                pool.query('SELECT * FROM `email` WHERE ID_EMAIL = ?', [element.ID_EMAIL], (error, results) => {
                                                    if(error){
                                                        Reject(error);
                                                    }else{
                                                        Object.assign(element, results[0]);
                                                        Resolve(element);
                                                    }
                                                })
                                            
                                            })
                                        );
                                    });
                                    Promise.all(enc_email_promise).then(values => {Resolve(values)});
                                }else{
                                    Resolve();
                                }
                            }
                        })
                    }),
                ];


                Promise.all(micro_enc).then(values => {
                    values[2].forEach(element => {
                        values[0].find(dir_single => {
                            if(element.ID_ENCARGADO === dir_single.ID_ENCARGADO ){
                                Object.assign(dir_single, element);
                            }
                        })

                        values[1].find(ins_single => {
                            if(element.ID_ENCARGADO === ins_single.ID_ENCARGADO ){
                                Object.assign(ins_single, element);
                            }
                        })
                    });

                    values[3].forEach(element => {
                        values[0].find(dir_single => {
                            if(element.ID_ENCARGADO === dir_single.ID_ENCARGADO ){
                                Object.assign(dir_single, element);
                            }
                        })

                        values[1].find(ins_single => {
                            if(element.ID_ENCARGADO === ins_single.ID_ENCARGADO ){
                                Object.assign(ins_single, element);
                            }
                        })
                    });
                    //Terminar
                    Resolve([values[0], values[1]]);
                });
    })
    );

    promises.push(
        new Promise ((Resolve, Reject) => {  pool.query('SELECT * FROM institucion WHERE CUE = ? AND ID_EST = ? ', [CUE, ID_EST],  (error, results) => {
            if(error){
                Reject (error);
            }else{
                if(results.length){
                    Resolve(results[0]);
                }else{
                    Reject('NOT FOUND');
                }   
            }
        })
        })
    );

    promises.push(
        new Promise ((Resolve, Reject) => {  pool.query('SELECT * FROM inst_dom WHERE CUE = ? AND ID_EST = ? ', [CUE, ID_EST],  (error, results) => {
            if(error){
                Reject (error);
            }else{
                if(results.length){
                    pool.query('SELECT * FROM domicilio WHERE  ID_DOM = ?', [results[0].ID_DOM],  (error, results) => {
                        Resolve(results[0]);
                    });
                }else{
                    Resolve({NULL: null});
                }   
            }
        })
        })
    );

    promises.push(
        new Promise ((Resolve, Reject) => {  pool.query('SELECT * FROM inst_tel WHERE CUE = ? AND ID_EST = ? ', [CUE, ID_EST],  (error, results) => {
            if(error){
                Reject (error);
            }else{
                if(results.length){
                    pool.query('SELECT * FROM telefono WHERE ID_TEL = ?', [results[0].ID_TEL],  (error, results) => {
                        Resolve(results[0]);
                    });
                }else{
                    Resolve({NULL: null});
                }   
            }
        })
        })
    );

    promises.push(
        new Promise ((Resolve, Reject) => {  pool.query('SELECT * FROM inst_enc WHERE CUE = ? AND ID_EST = ? ', [CUE, ID_EST],  (error, results) => {
            if(error){
                Reject (error);
            }else{
                if(results.length){
                    if(results.length > 1){
                        Resolve([results[0], results[1]]);
                    }else{
                        Resolve([results[0]]);
                    }
                }else{
                    Resolve([{NULL: null}]);
                }   
            }
        })
        })
    );

    Promise.all(promises).then(values => {
        Object.assign(values[1], values[2]);
        Object.assign(values[1], values[3]);
        Object.assign(values[1], values[4]);

        console.log(values[1]);
        Res.render('admin/institucion/editinstitucion', {directores: values[0][0], inspectores: values[0][1],  institucion: values[1] })
    })

});




//-Encargados-//
router.get('/add/encargado', /*isauth.isLoggedIn, isauth.isVip,*/async (Req, Res) => { 
    Res.render('admin/institucion/encargados/addencargado');
});
 
router.post('/add/encargado', /*isauth.isLoggedIn, isauth.isVip,*/async (Req, Res) => { 
    var ENC_TEL = {
        ID_ENCARGADO: 0,
        ID_TEL: 0  
    };


    var ENC_EMA = {
        ID_ENCARGADO: 0,
        ID_EMAIL: 0  
    };


    pool.query('INSERT INTO encargados (nombre, apellido, ID_TIPOENC) VALUES (?, ?, ?)', [Req.body.nombre, Req.body.apellido, Req.body.TIPO],  async (error, results) => {
        if(error){
            throw error;
        }else{
            if(ENC_TEL.ID_TEL){
                ENC_TEL.ID_ENCARGADO = results.insertId;
                pool.query('INSERT INTO enc_tel SET ?', [ENC_TEL]);
            }else{
                ENC_TEL.ID_ENCARGADO = results.insertId;
            }

            if(ENC_EMA.ID_EMAIL){
                ENC_EMA.ID_ENCARGADO = results.insertId;
                pool.query('INSERT INTO enc_email SET ?', [ENC_EMA]);
            }else{
                ENC_EMA.ID_ENCARGADO = results.insertId;
            }
        }
    });

    if(Req.body.email){
        pool.query('INSERT INTO email (email) VALUES (?)', [Req.body.email],  async (error, results) => {
            if(ENC_EMA.ID_ENCARGADO){
                ENC_EMA.ID_EMAIL = results.insertId;
                pool.query('INSERT INTO enc_email SET ?', [ENC_EMA]);
            }else{
                ENC_EMA.ID_EMAIL = results.insertId;
            }
        });
    }

    if(Req.body.telefono){
        pool.query('INSERT INTO telefono (telefono) VALUES (?)', [Req.body.telefono],  async (error, results) => {
            if(ENC_TEL.ID_ENCARGADO){
                ENC_TEL.ID_TEL = results.insertId;
                pool.query('INSERT INTO enc_tel SET ?', [ENC_TEL]);
            }else{
                ENC_TEL.ID_TEL = results.insertId;
            }
        });
    }

    Res.redirect('/allinstitucion/');
});

module.exports = router;