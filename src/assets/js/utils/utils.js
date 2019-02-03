'use strict';

/*globals app */

(function() {
    app.utils = {
        // Global method for creating cookie
        // For creating cookie use this method app.utils.createCookie(name, value, days, path, domain)
        // If any parameter is blank just pass blank quotes in it
        create: function(name, value, days, path, domain) {

            if (name.length === 0) {
                return;
            }

            var expires,pathValue;
            if (days) {
                var date = new Date();
                date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                expires = '; expires=' + date.toGMTString();
            } else {
                expires = '';
            }

            if(path){
                pathValue=path;
            } else{
                pathValue='';
            }

            if (domain) {
                document.cookie = name + '=' + value + expires + '; path=' + pathValue + '; domain=' + domain;
            } else {
                document.cookie = name + '=' + value + expires + '; path=' + pathValue;
            }
        },

        // Global method for read cookie
        // For read cookie use this method app.utils.readCookie(name)
        read: function(name) {

            var expression = '(?:^|;\\s*)' + ('' + name).replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&') + '=([^;]*)';
            return (name = new RegExp(expression).exec(document.cookie)) && name[1];
        },

        // Global method for eraseCookie cookie
        // For erase cookie use this method app.utils.eraseCookie(name)
        // Here negative day is passed to remove the cookies. Negative date means cookies no more exist.

        erase: function(name) {
            this.create(name, '', -1, '/', '');
        },
        getUrlParam: function(name) {
            // Read a page's GET URL and return the query parameter value.
            var vars = [],
                hash;
            var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
            for (var i = 0; i < hashes.length; i++) {
                hash = hashes[i].split('=');
                vars.push(hash[0]);
                vars[hash[0]] = hash[1];
            }
            return vars[name];
        },        
        getDataFromService: function(params) {
          $.ajax({
             url: params.url,
             dataType: params.dataType,
             data: params.data,
             contentType: 'application/json; charset=utf-8',
             cache: false,
             type: params.type,
             success: function(data){
              if ($.isFunction(params.success_callback)) {
                params.success_callback(data);
              }
            },
            error: function (a, b, c) {
              if ($.isFunction(params.error_callback)) {
                params.error_callback();
              }
            }
          });
        },
        /*func - Validate string is in email format or not*/
        validateEmail : function(email) {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        },
        validateNumber :function(phoneNumber){
            var phone = /^([0|\+[0-9]{1,5})?([7-9][0-9]{9})$/;
            return phone.test(phoneNumber);
        }
    };
}(app));
