'use strict';

var mongoose = require('mongoose'),
UserSet = mongoose.model('UserSets'),
Client = mongoose.model('Clients'),
ClientContainer = mongoose.model('ClientContainers'),
App = mongoose.model('App'),
Role = mongoose.model('Role'),
User = mongoose.model('User'),

//-------------------------JGM----------------------------
Bloque = mongoose.model('Bloque'),
Interbloque = mongoose.model('Interbloque'),
Provincia = mongoose.model('Provincia'),
Diputado = mongoose.model('Diputado'),
Informe = mongoose.model('Informe'),
Extra = mongoose.model('Extra'),
Requerimiento = mongoose.model('Requerimiento'),
Pregunta = mongoose.model('Pregunta');




var lastEntries = null;
var lastUsers = null;

//BLOQUE
exports.list_all_bloques = function(req, res) {
    Bloque.find({}, function(err, b) {
        if (err)
            res.send(err);
        res.send(customSuccessMessage(b));
    });
};

//INTERBLOQUE
exports.list_all_interbloques = function(req, res) {
    Interbloque.find({}, function(err, task) {
        if (err)
            res.send(err);
        res.send(customSuccessMessage(task));
    });
};


//DIPUTADO
exports.list_all_diputados = function(req, res) {
    Diputado.find({}, function(err, d) {
        if (err)
            res.send(err);

        res.send(customSuccessMessage(d));
    });
};

exports.get_diputados_by_bloque = function(req, res) {

    Diputado.find({ 'bloque._id': req.params.bloque_id }, function (err, doc) {

        if(doc==null||err!=null){
            res.send(customErrorMessage("No se encontro el bloque"));
            return;
        }

        return res.json(doc);
    });
};

exports.get_diputados_by_interbloque = function(req, res) {

    Diputado.find({ 'interbloque.bloque._id': req.params.interbloque_id }, function (err, doc) {

        if(doc==null||err!=null){
            res.send(customErrorMessage("No se encontro el interbloque"));
            return;
        }

        return res.json(doc);
    });
};




//PROVINCIA
exports.list_all_provincias = function(req, res) {
    Provincia.find({}, function(err, task) {
        if (err)
            res.send(err);
        res.json(task);
    });
};


//INFORME
exports.list_all_informes = function(req, res) {
    Informe.find({}, function(err, task) {
        if (err)
            res.send(err);
        res.json(task);
    });
};

exports.get_informe = function(req, res) {

    Informe.findOne({ 'numero': req.params.informe_id }, function (err, doc) {

        if(doc==null||err!=null){
            res.send(customErrorMessage("No se encontró el informe"));
            return;
        }

        return res.json(doc);
    });
};

//REQUERIMIENTO
exports.list_all_requerimientos = function(req, res) {
    Requerimiento.find({}, function(err, task) {
        if (err)
            res.send(err);
        res.json(task);
    });
};

exports.get_requerimiento = function(req, res) {

    Requerimiento.findOne({ '_id': req.params.requerimiento_id}, function (err, doc) {

        if(doc==null||err!=null){
            res.send(customErrorMessage("No se encontró el requerimiento"));
            return;
        }

        return res.json(doc);
    });
};


exports.get_requerimientos_by_bloque = function(req, res) {

    Requerimiento.find({ 'bloque._id': req.params.bloque_id}, function (err, docs) {

        if(docs==null||err!=null){
            res.send(customErrorMessage("No se encontró ningun requerimiento asociado al bloque"));
            return;
        }

        return res.json(docs);
    });
};

exports.get_requerimientos_by_extra = function(req, res) {

    Requerimiento.find({ 'extra.guid': req.params.extra_id}, function (err, docs) {

        if(docs==null||err!=null){
            res.send(customErrorMessage("No se encontró ningun requerimiento asociado al usuario"));
            return;
        }

        return res.send(customSuccessMessage(docs));
    });
};

exports.get_requerimientos_by_interbloque = function(req, res) {

    Requerimiento.find({ 'interbloque._id': req.params.interbloque_id}, function (err, docs) {

        if(docs==null||err!=null){
            res.send(customErrorMessage("No se encontró ningun requerimiento asociado al bloque"));
            return;
        }

        return res.json(docs);
    });
};

exports.save_requerimiento = function(req, res) {

    if(req.body.bloque_id==null && req.body.diputado_id==null){
        res.send(customErrorMessage("El requerimiento debe estar asociado a un diputado, bloque o interbloque."));
        return;
    }

    var nuevoRequerimiento = new Requerimiento();
    var preguntas = Array();

    req.body.preguntas.forEach(function(element) {
        var p = new Pregunta();
        p.texto = element;
        preguntas.push(p);
    });

    if( preguntas.length<1 ){
        res.send(customErrorMessage("El requerimiento debe tener al menos una pregunta"));
        return;
    }

    getExtraByGuid(req.body.user.guid,function(extraId, extra){

        if(extraId == null){
            //console.log(extraId+ " no hay extra");
            res.send(customErrorMessage("Su usuario no tiene asociado un rol. Comuníquese con computación recinto. Interno 2471."));
        }else{

            nuevoRequerimiento.preguntas = preguntas;
            nuevoRequerimiento.introduccion = req.body.introduccion;
            nuevoRequerimiento.extra = extra;

            getDiputadoById(req.body.diputado_id, function(diputadoId,diputado){

                if(diputadoId==null){
                    getBloqueById(req.body.bloque_id, function(bloqueId,bloque){
                        if(bloqueId==null){
                            res.send(customErrorMessage("Diputado y Bloques no existente"));
                        }else{
                            nuevoRequerimiento.bloque = bloque;
                            nuevoRequerimiento.diputado = null;
                            nuevoRequerimiento.interbloque = getInterbloqueByBloque(bloque,function(interbloqueId,interbloque){

                                if(interbloqueId!=null){
                                    nuevoRequerimiento.interbloque = interbloque;
                                }else{
                                    nuevoRequerimiento.interbloque = null;
                                }

                                nuevoRequerimiento.save()
                                    .then(requerimiento => {
                                        //console.log(customSuccessMessage("prueba"));
                                        res.status(200);
                                        res.send(customSuccessMessage("Requerimiento guardado correctamente"));
                                    })
                                    .catch(err => {
                                        console.log(err);
                                        res.status(400);
                                        res.send(customErrorMessage("No se pudo guardar el requerimiento"));
                                    });
                            });

                        }
                    });

                    return;
                }else{
                    nuevoRequerimiento.diputado = diputado;
                    nuevoRequerimiento.bloque = diputado.bloque;
                    nuevoRequerimiento.interbloque = getInterbloqueByBloque(diputado.bloque,function(interbloqueId,interbloque){

                        if(interbloqueId!=null){
                            nuevoRequerimiento.interbloque = interbloque;
                        }else{
                            nuevoRequerimiento.interbloque = null;
                        }

                        nuevoRequerimiento.save()
                            .then(requerimiento => {
                                res.status(200);
                                res.send(customSuccessMessage("Requerimiento guardado correctamente"));
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(400);
                                res.send(customErrorMessage("No se pudo guardar el requerimiento"));
                            });
                    });

                }
            });

        }

    });

}



//EXTRAS

exports.update_extra_by_guid = function (req, res) {

    getExtraById(req.body.extra_id, function(err, extra){

        getDiputadoById(req.body.diputado_id, function(id,diputado){

            if(diputado != null){

                extra.diputado = diputado;
                extra.bloque = diputado.bloque;
                extra.interbloque = diputado.interbloque;

                extra.save()
                    .then(extra => {
                        res.status(200);
                        res.send(customSuccessMessage("Diputado asociado correctamente."));
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(400);
                        res.send(customErrorMessage("Ocurrió un error asociando el diputado."));
                    });
            }else{
                getBloqueById(req.body.bloque_id,function(id,bloque){

                    if(bloque!=null){

                        extra.diputado = null;
                        extra.bloque = bloque;
                        extra.interbloque = bloque.interbloque;

                        extra.save()
                            .then(extra => {
                                res.status(200);
                                res.send(customSuccessMessage("Bloque asociado correctamente."));
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(400);
                                res.send(customErrorMessage("Ocurrió un error asociando el bloque."));
                            });

                    }else{

                        getInterbloqueById(req.body.interbloque_id,function(id,interbloque){

                            if(interbloque!=null) {

                                extra.diputado = null;
                                extra.bloque = null;
                                extra.interbloque = interbloque;

                                extra.save()
                                .then(extra => {
                                    res.status(200);
                                    res.send(customSuccessMessage("Interbloque asociado correctamente."));
                                })
                                .catch(err => {
                                    console.log(err);
                                    res.status(400);
                                    res.send(customErrorMessage("Ocurrió un error asociando el interbloque."));
                                });

                            }else{
                                res.status(200);
                                res.send(customErrorMessage("Ocurrió un error al asociar el usuario con un diputado, bloque o interbloque."));
                            }

                        });

                    }

                });
            }

        });

    });
}

exports.list_all_extras = function(req, res) {
    Extra.find({}, function(err, extra) {
        if (err)
            res.send(err);
        res.send(customSuccessMessage(extra));
    });
};

exports.get_extra_by_guid = function(req, res) {

    Extra.findOne({'guid': req.params.guid}, function (err, extra) {

        if(err){
            res.send((customErrorMessage("Ocurrió un error buscando al usuario")))
        }

        //si el extra no existe tengo que buscar los datos del user en la base de usuarios y crearlo
        if(extra==null){
            res.send(customErrorMessage("Usuario no encontrado"));
        }

        return res.json(customSuccessMessage(extra))
    });

};

//-------------------------JGM----------------------------

exports.create_userset = function(req, res) {
  var new_userset = new UserSet(req.body);
  new_userset.save(function(err, userset) {
    if (err){
      res.send(errorMessage(err));
    }else{
      res.json(successMessage());
    }
  });
};

exports.user_set_role = function(req, res) {
  var found = false;
  var apiKey = req.get("Authorization");
  var mUser = null;
  var mApp = null;
  var mRole = null;
  var mClient = null;
  if(apiKey == null){
    res.send(customErrorMessage("Esta API requiere autorización."));
    return;
  }
  if(req.body.id == null){
    res.send(customErrorMessage("El parámetro id es mandatorio."));
    return;
  }
  if(req.body.app_id == null){
    res.send(customErrorMessage("El parámetro app_id es mandatorio."));
    return;
  }
  if(req.body.role_id == null){
    res.send(customErrorMessage("El parámetro role_id es mandatorio."));
    return;
  }
  getOwnerByKey(apiKey, function(clientId, client){
      mClient = clientId;
      if(clientId==null){
        res.send(customErrorMessage("ApiKey inválida (" + apiKey + ")"));
        return;
      }else{
        User.findOne({ '_id': req.body.id }, function (err, doc) {
          if(doc==null||err!=null){
              res.send(customErrorMessage("No se encontró el usuario"));
              return;
          }
          var container = doc.client_containers.id(client._id);
          var app = client.apps.id(req.body.app_id);
          if(app==null){
            res.send(customErrorMessage("La aplicación no existe"));
            return;
          }
          var role = app.roles.id(req.body.role_id);
          if(role==null){
            res.send(customErrorMessage("El rol no existe"));
            return;
          }
          if(container==null){
            container = new ClientContainer({'_id': client._id});
            container.usersets.push({'_id': app._id, 'role': role._id});
            doc.client_containers.push(container);
            doc.save();
            res.send(customSuccessMessage());
          }else{
            var roleset = container.usersets.id(app._id);
            if(roleset==null){
              container.usersets.push({'_id': app._id, 'role': role._id});
            }else{
              roleset.role = role._id;
            }
            doc.save();
            res.send(customSuccessMessage());
          }
          return;
        });
      }
  });
}

exports.get_users = function(req, res) {
  var found = false;
  var apiKey = req.get("Authorization");
  if(apiKey == null){
    res.send(customErrorMessage("Esta API requiere autorización."));
    return;
  }
  getOwnerByKey(apiKey, function(apiOwner, client){
    if(apiOwner==null){
      res.send(customErrorMessage("ApiKey inválida (" + apiKey + ")"));
      return;
    }else{
      lastUsers = new Array();
      var cursor = User.find({ 'client_containers._id': client._id }).cursor();
      cursor.on('data', function(doc) {
        lastUsers[lastUsers.length] = doc;
      });
      cursor.on('close', function() {
        res.send(customSuccessMessage(lastUsers));
      });
    }
  });
};

exports.get_users_app = function(req, res) {
  var found = false;
  var apiKey = req.get("Authorization");
  if(apiKey == null){
    res.send(customErrorMessage("Esta API requiere autorización."));
    return;
  }
  if(req.params.app_id == null){
    res.send(customErrorMessage("El parámetro app_id es mandatorio."));
    return;
  }
  getOwnerByKey(apiKey, function(apiOwner, client){
    if(apiOwner==null){
      res.send(customErrorMessage("ApiKey inválida (" + apiKey + ")"));
      return;
    }else{
      lastUsers = new Array();
      var cursor = User.find({ 'client_containers._id': client._id, 'client_containers.usersets._id': req.params.app_id}).cursor();
      cursor.on('data', function(doc) {

        lastUsers[lastUsers.length] = {
          'first_name': doc.first_name,
          'last_name': doc.last_name,
          'cuil': doc.cuil,
          'email': doc.email,
          '_id': doc._id,
          'role': doc.client_containers.id(client._id).usersets.id(req.params.app_id).role
        };
      });
      cursor.on('close', function() {
        res.send(customSuccessMessage(lastUsers));
      });
    }
  });
};

exports.get_role = function(req, res) {
  var found = false;
  var apiKey = req.get("Authorization");
  if(apiKey == null){
    res.send(customErrorMessage("Esta API requiere autorización."));
    return;
  }
  if(req.params.id == null){
    res.send(customErrorMessage("El parámetro id es mandatorio."));
    return;
  }
  if(req.params.app_id == null){
    res.send(customErrorMessage("El parámetro app es mandatorio."));
    return;
  }
  getOwnerByKey(apiKey, function(apiOwner, client){
    if(apiOwner==null){
      res.send(customErrorMessage("ApiKey inválida (" + apiKey + ")"));
      return;
    }else{
      User.findOne({ '_id': req.params.id }, function (err, doc) {
        if(doc==null||err!=null){
          res.send(customErrorMessage("No se encontró el usuario"));
          return;
        }
        var clientContainer = doc.client_containers.id(client.id);
        if(clientContainer == null){
          res.send(customErrorMessage("El usuario no está asociado a la aplicación"));
          return;
        }
        var app = clientContainer.usersets.id(req.params.app_id);
        if(app == null){
          res.send(customErrorMessage("El usuario no está asociado a la aplicación"));
          return;
        }
        res.send(customSuccessMessage(app));
        return;
      });
    }
  });
};

exports.users_by_cuil = function(req, res) {
  var found = false;
  var apiKey = req.get("Authorization");
  if(apiKey == null){
    res.send(customErrorMessage("Esta API requiere autorización."));
    return;
  }
  if(req.params.cuil == null){
    res.send(customErrorMessage("El parámetro cuil es mandatorio."));
    return;
  }
  getOwnerByKey(apiKey, function(clientId, client){
    if(clientId==null){
      res.send(customErrorMessage("ApiKey inválida (" + apiKey + ")"));
      return;
    }else{
        buscarCuil(req.params.cuil, function(users){
            if(users==null){
                res.send(customErrorMessage("No se pudo conectar al servidor de ActiveDirectory"));
                return;
            }
            /* Los cacheo en Mongo */
            for(var i = 0; i < users.length; i++){
              var cUser = users[i];
              User.update({'_id': cUser.user_id}, { 'first_name': cUser.first_name, 'last_name': cUser.last_name, 'email': cUser.email, 'cuil': cUser.cuil }, {upsert: true}, function(err, doc){

              });
            }
            /* Devuelvo a cliente */
            res.send(customSuccessMessage(users));
            return;
        });
    }
  });
};

exports.apps_roles_set = function(req, res) {
  var found = false;
  var mApp = null;
  var apiKey = req.get("Authorization");
  if(apiKey == null){
    res.send(customErrorMessage("Esta API requiere un rol"));
    return;
  }
  if(req.body.id == null){
    res.send(customErrorMessage("El parámetro id es mandatorio."));
    return;
  }
  if(req.body.name == null){
    res.send(customErrorMessage("El parámetro name es mandatorio."));
    return;
  }
  if(req.body.description == null){
    res.send(customErrorMessage("El parámetro description es mandatorio."));
    return;
  }
  if(req.body.app_id == null){
    res.send(customErrorMessage("El parámetro app_id es mandatorio."));
    return;
  }
  getOwnerByKey(apiKey, function(clientId, client){
    if(clientId==null){
      res.send(customErrorMessage("ApiKey inválida (" + apiKey + ")"));
      return;
    }else{
      var app = client.apps.id(req.body.app_id);
      if(app==null){
        res.send(customErrorMessage("La aplicación no existe"));
      }else{
        var role = app.roles.id(req.body.id);
        if(role==null){
          app.roles.push({'_id': req.body.id, 'name': req.body.name, 'description': req.body.description});
        }else{
          role.name = req.body.name;
          role.description = req.body.description;
        }
        client.save();
        res.send(customSuccessMessage());
      }
      return;
    }
  });
}

exports.apps_set = function(req, res) {
  var found = false;
  var apiKey = req.get("Authorization");
  if(apiKey == null){
    res.send(customErrorMessage("Esta API requiere autorización."));
    return;
  }
  if(req.body.id == null){
    res.send(customErrorMessage("El parámetro id es mandatorio."));
    return;
  }
  if(req.body.name == null){
    res.send(customErrorMessage("El parámetro name es mandatorio."));
    return;
  }
  getOwnerByKey(apiKey, function(clientId, client){
    if(clientId==null){
      res.send(customErrorMessage("ApiKey inválida (" + apiKey + ")"));
      return;
    }else{
      Client.findOne({'_id': client.id, 'apps._id': req.body.id}, function(err, doc){
        if(err!=null){
          res.send(customErrorMessage("No se pudo crear la aplicación"));
          return;
        }
        if(doc==null){
          var app = {'_id': req.body.id, 'name': req.body.name};
          client.apps.push(app);
          client.save();
          res.send(successMessage());
          return;
        }else{
          client.apps.id(req.body.id).name = req.body.name;
          client.save();
          res.send(successMessage());
          return;
        }
      });
    }
  });
}

exports.get_apps = function(req, res) {
  var found = false;
  var apiKey = req.get("Authorization");
  if(apiKey == null){
    res.send(customErrorMessage("Esta API requiere autorización."));
    return;
  }
  getOwnerByKey(apiKey, function(clientId, client){
    if(clientId==null){
      res.send(customErrorMessage("ApiKey inválida (" + apiKey + ")"));
      return;
    }else{
      res.send(client.apps);
    }
  });
};

function buscarCuil(cuil, callback) {
    lastEntries = new Array();
    var ldap = require('ldapjs');
    var client = ldap.createClient({
        url: 'ldap://hcdn.gob.ar:389',
				timeout: 8000,
				connectTimeout: 8000
    });
    client.bind("HCDN\\appl.login.dse", "53311Fa0", function(err) {
        if(err!=null){
          callback(null);
        }
    });
    var opts = {
        scope: 'sub',
        filter: '(&(objectClass=user)(postalCode=' + cuil + '))',
        attributes: ['postalCode', 'sAMAccountName', 'givenName', 'sn', 'objectGUID', 'mail']
    };
    client.search('OU=HCDN,DC=hcdn,DC=gob,DC=ar', opts, function(err, res) {
        res.on('searchEntry', function(entry) {
            //console.log('entry: ' + JSON.stringify(entry.object));
            lastEntries[lastEntries.length] = entry;
        });

        res.on('error', function(err) {
            callback(null);
        });

        res.on('end', function(result) {
            var i = 0;
            var readable = Array();
            for(i = 0; i < lastEntries.length; i++){
                var ce = lastEntries[i].object;
                var guid = formatGUID(lastEntries[i].raw.objectGUID);
                var mCuil = '';
                var mail = '';
                if(ce.postalCode != undefined && ce.postalCode != null){
                  mCuil = ce.postalCode;
                }
                if(ce.mail != undefined && ce.mail != null){
                  mail = ce.mail;
                }
                readable[readable.length] = {
                      'first_name': ce.givenName,
                      'last_name': ce.sn,
                      'user_id': guid,
                      'cuil': mCuil,
                      'email': mail
                };
              }
              callback(readable);
        });
      });
}

function formatGUID(objectGUID) {

    var data = new Buffer(objectGUID, 'binary');

    // GUID_FORMAT_D
    var template = '{3}{2}{1}{0}-{5}{4}-{7}{6}-{8}{9}-{10}{11}{12}{13}{14}{15}';

    // check each byte
    for (var i = 0; i < data.length; i++) {

        // get the current character from that byte
        var dataStr = data[i].toString(16);
        dataStr = data[i] >= 16 ? dataStr : '0' + dataStr;

        // insert that character into the template
        template = template.replace(new RegExp('\\{' + i + '\\}', 'g'), dataStr);

    }
    return template;

}

function getRoleByUser(owner, app, userId, callback){
  UserSet.findOne({ 'owner': owner, 'app': app, 'user_id': userId }, 'user_id role extra', function (err, userset) {
    callback(userset);
  });
}

function getOwnerByKey(apiKey, callback){
  Client.findOne({ 'api_key': apiKey }, function (err, client) {
      if(client==null){
        callback(null);
      }else{
        callback(client._id, client);
      }
  });
}

function getInterbloqueByBloque(bloque, callback){

    Interbloque.findOne( { "bloques" :bloque } , function (err, bloque) {
        if(bloque==null){
            callback(null);
        }else{
            callback(bloque._id, bloque);
        }
    });
}

function getBloqueById(_id, callback){

    if(_id=="-1" || _id===null) {
        _id = null;
    }

    var ObjectId = mongoose.Types.ObjectId;
    var a = new ObjectId(_id);

    Bloque.findOne( { "_id" :a } , function (err, bloque) {
        if(bloque==null){
            callback(null);
        }else{
            callback(bloque._id, bloque);
        }
    });
}

function getExtraByGuid(guid, callback){

    Extra.findOne({ 'guid': guid }, function (err, extra) {
        if(extra==null){
            callback(null);
        }else{
            callback(extra._id, extra);
        }
    });

}

function getExtraById(_id, callback){

    if(_id=="-1" || _id===null) {
        _id = null;
    }

    var ObjectId = mongoose.Types.ObjectId;
    var a = new ObjectId(_id);

    Extra.findOne({ '_id': a }, function (err, extra) {
        if(extra==null){
            callback(null);
        }else{
            callback(extra._id, extra);
        }
    });
}

function getDiputadoById(_id, callback){

    if(_id=="-1" || _id===null) {
        _id = null;
    }

    var ObjectId = mongoose.Types.ObjectId;
    var a = new ObjectId(_id);

    Diputado.findOne({ '_id': a }, function (err, diputado) {
        if(diputado==null){
            callback(null);
        }else{
            callback(diputado._id, diputado);
        }
    });
}

function getInterbloqueById(_id, callback){

    var ObjectId = mongoose.Types.ObjectId;
    var a = new ObjectId(_id);

    Interbloque.findOne({ '_id': a }, function (err, interbloque) {
        if(interbloque==null){
            callback(null);
        }else{
            callback(interbloque._id, interbloque);
        }
    });
}

function successMessage(){
  var r = {
    success: true
  };
  return r;
}

function customSuccessMessage(pData){
  var r = {
    success: true,
    message: pData
  };
  return r;
}

function customErrorMessage(pMessage){
  var r = {
    success: false,
    message: pMessage
  };
  return r;
}

function errorMessage(err){
  err.success = false;
  return err;
}

