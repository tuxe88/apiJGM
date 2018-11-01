'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;



//JGM
var Bloque = new Schema({
    nombre: {
        type: String,
        required: 'Es necesario un nombre para el bloque'
    }
});

var Interbloque = new Schema({
    nombre: {
        type: String,
        required: 'Es necesario un nombre para el interbloque'
    },
    bloques: [Bloque]
});

var Provincia = new Schema({
    _id: {
        type: String,
        required: 'Es necesario un id para la provincia',
    },
    nombre: {
        type: String
    }
});

var Diputado = new Schema({

    nombre: {
        type: String
    }
    ,
    apellido: {
        type: String
    },
    cuil: {
        type: String
    },
    provincia: {
        type:Provincia
    },
    bloque:{
        type:Bloque
    }
});


var Pregunta = new Schema({
    texto:String
});

var Extra = new Schema({
    texto:String,
    cuil:String,
    contacto:String,
    nombre:String,
    apellido:String,
    diputado: Diputado,
    bloque: Bloque,
    interbloque:Interbloque
});

var Requerimiento = new Schema({
    introduccion: String,
    preguntas: [Pregunta],
    diputado: Diputado,
    bloque: Bloque,
    interbloque: Interbloque,
    extra: Extra
});




var Informe = new Schema({
    _id: {
        type: String,
        required: 'Es necesario un id para el informe',
    },
    numero: {
        type: Number
    },
    fecha_inicio: {
        type: Date,
        default: Date.now
    },
    fecha_fin: {
        type: Date
    },
});


var Role = new Schema({
  _id: {
    type: String,
    required: 'Es necesario un id para el rol',
  },
  name: {
    type: String,
    required: 'Es necesario un nombre para el rol'
  },
  description: {
    type: String,
    required: 'Es necesaria una descripción para el rol'
  }
});

var App = new Schema({
  _id: {
    type: String,
    required: 'Es necesario un identificador único de la aplicación',
  },
  name: {
    type: String,
    required: 'Es necesario un nombre para la aplicación',
  },
  roles: {
    type: [Role]
  }
});

var Client = new Schema({
  _id: {
    type: String,
    required: 'Es necesario un id (owner)'
  },
  api_key: {
    type: String,
    required: 'Es necesario un ApiKey'
  },
  enabled: {
    type: Boolean,
    default: true
  },
  apps: {
    type: [App]
  }
});

var UserSet = new Schema({
  _id: {
    type: String,
    required: "Es necesario un id de rol"
  },
  role: {
    type: String,
    required: "Es necesario un rol"
  },
  extra: {
    type: Array,
    default: null
  },
  created_date: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    default: [1]
  }
});

var ClientContainer = new Schema({
  _id: {
    type: String,
    required: "Es necesario el clientId para vincular los UserSets"
  },
  usersets: {
    type: [UserSet]
  }
})

var User = new Schema({
  _id: {
    type: String,
    required: 'Es necesario un identificador único del usuario',
  },
  first_name: {
    type: String,
    required: 'Es necesario un nombre',
  },
  last_name: {
    type: String,
    required: 'Es necesario un apellido',
  },
  cuil: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    default: ''
  },
  last_update: {
    type: Date,
    default: Date.now
  },
  client_containers: {
    type: [ClientContainer]
  }
});

//-------------------JGM------------------------
module.exports = mongoose.model('Bloque', Bloque);
module.exports = mongoose.model('Interbloque', Interbloque);
module.exports = mongoose.model('Diputado', Diputado);
module.exports = mongoose.model('Provincia', Provincia);
module.exports = mongoose.model('Extra', Extra);
module.exports = mongoose.model('Informe', Informe);
module.exports = mongoose.model('Requerimiento', Requerimiento);
module.exports = mongoose.model('Pregunta', Pregunta);

//-------------------JGM------------------------
module.exports = mongoose.model('User', User);
module.exports = mongoose.model('App', App);
module.exports = mongoose.model('Role', Role);
module.exports = mongoose.model('UserSets', UserSet);
module.exports = mongoose.model('Clients', Client);
module.exports = mongoose.model('ClientContainers', ClientContainer);
