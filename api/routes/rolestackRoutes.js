'use strict';
module.exports = function(app) {
  var rolestack = require('../controllers/rolestackController');


//-------------------------JGM----------------------
//BLOQUE
    app.route('/get/bloque')
        .get(rolestack.list_all_bloques);

//INTERBLOQUE
    app.route('/get/interbloque')
        .get(rolestack.list_all_interbloques);

//DIPUTADO
    app.route('/get/diputado')
        .get(rolestack.list_all_diputados);

    app.route('/get/diputado/bloque/:bloque_id')
        .get(rolestack.get_diputados_by_bloque);

    app.route('/get/diputado/interbloque/:interbloque_id')
        .get(rolestack.get_diputados_by_interbloque);

//EXTRA
    app.route('/get/extra')
        .get(rolestack.list_all_extras);

    app.route('/get/extra/:guid')
        .get(rolestack.get_extra_by_guid);

    app.route('/update/extra')
        .post(rolestack.update_extra_by_guid);

//INFORME
    app.route('/get/informe')
        .get(rolestack.list_all_informes);

    app.route('/get/informe/:informe_id')
        .get(rolestack.get_informe);

//REQUERIMIENTO
    app.route('/get/requerimiento')
        .get(rolestack.list_all_requerimientos);

    app.route('/get/requerimiento/:requerimiento_id')
        .get(rolestack.get_requerimiento);

    app.route('/get/requerimiento/bloque/:bloque_id')
        .get(rolestack.get_requerimientos_by_bloque);

    app.route('/get/requerimiento/usuario/:guid')
        .get(rolestack.get_requerimientos_by_extra);

    app.route('/get/requerimiento/interbloque/:interbloque_id')
        .get(rolestack.get_requerimientos_by_interbloque);

    app.route('/post/requerimiento')
        .post(rolestack.save_requerimiento);

//-------------------------JGM----------------------





  app.route('/users/:id/:app_id/role')
    .get(rolestack.get_role);

  app.route('/users/roles/set')
    .post(rolestack.user_set_role);

  app.route('/apps/set')
    .post(rolestack.apps_set);

  app.route('/apps/roles/set')
    .post(rolestack.apps_roles_set);

  app.route('/apps')
    .get(rolestack.get_apps);

  app.route('/users/cache/:cuil')
    .get(rolestack.users_by_cuil);

  app.route('/users')
    .get(rolestack.get_users);

    app.route('/apps/:app_id/users')
      .get(rolestack.get_users_app);

};
