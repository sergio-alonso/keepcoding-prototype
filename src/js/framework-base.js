/*
 * The Base Library provides basic funcionality.
 *
 * Application should be loosely coupled to the base library.
 * Only the application core has any idea what base library is being used
 *
 * Base Library Jobs:
 * - Browser normalization
 * - General purpose utilities
 *   - Parsers/serializers for XML, JSON...
 *   - Object manipulation
 *   - DOM manipulation
 *   - Ajax communication
 * - Provide low level extensibility
 *
 */

/*
 * Somwhere says that cdn is better
 * Ensure library is loaded
 * Access third party scripts
 *
 */

/*
 * jQuery - http://jquery.com/
 * jQuery Plugins - http://plugins.jquery.com/
 * jQuery API - http://api.jquery.com/
 *
 */

/* http://www.jspatterns.com/the-ridiculous-case-of-adding-a-script-element/ */
/* http://www.phpied.com/javascript-include-ready-onload/ */

// TODO: use Core.log, but not avaliable here, boot() is called after use logs

var Core = require('./framework-core');

(function () {
  'use strict'

  var libraries = {}

  var isBaseReady = function () {
    var library
    for (library in libraries) {
      if (libraries[ library ].loaded === false) {
        return false
      }
    }
    return true
  }

  var onLoad = function (name) {
    console.log("base::onLoad() name='" + name + "'")
    libraries[ name ].loaded = true
    if (name === 'jquery') {
      load('bootstrap')
    }
    if (isBaseReady()) {
      console.log('base::isBaseReady() yes, so continue')
      Core.boot()
    }
  }

  var onError = function () {
    console.error('Something was wrong loading library from CDN. Try to reload the browser.')

    // TODO: load from local
  }

  var insertScript = function (name, src, depend) {
    console.log("base::insertScript() name='" + name + "'")
    libraries[ name ] = {
      src: src,
      depend: depend,
      loaded: false
    }
  }

  var load = function (name) {
    try {
      var script = document.createElement('script')
      var head = document.getElementsByTagName('script')[ 0 ]

      script.type = 'text/javascript'
      script.src = libraries[ name ].src
      script.onreadystatechange = function () {
        if (this.readyState === 'complete') {
          onLoad(name)
        }
      }
      script.onload = function () { onLoad(name) }
      script.onerror = function () { onError() }

      head.parentNode.insertBefore(script, head)
    } catch (err) {
      console.log(err)
    }
  }

  /* R
  var loadAll = function() {
    var library;
    for ( library in libraries ) {
      load( library );
    }
  };
   */

  insertScript('jquery', '//ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js')
  insertScript('bootstrap', '//maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js')
  insertScript('masonry', '//unpkg.com/masonry-layout@4/dist/masonry.pkgd.min.js')
  insertScript('imagesloaded', '//npmcdn.com/imagesloaded@4.1/imagesloaded.pkgd.min.js')
  insertScript('momentjs',
                '//cdnjs.cloudflare.com/ajax/libs/moment.js/2.17.1/moment-with-locales.min.js')

  // LoadAll();
  load('jquery')

  // After load(jquery) load(bootstrap);
  load('masonry')
  load('imagesloaded')
  load('momentjs')

  // TODO: handle dependencies between libraries
})()

/*
 * CDN momentjs fallback
 *
 * <script src="//cdnjs.cloudflare.com/ajax/libs/moment.js/2.10.3/moment.js"></script>
 * <script>
 *    if (!window.moment) {
 *        document.write('<script src="assets/plugins/moment/moment.min.js"><\/script>');
 *    }
 * </script>
 *
 */
