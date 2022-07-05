importScripts('js/sw-utils.js')

const STATIC_CACHE      = 'static-v1';
const DYNAMIC_CACHE     = 'dynamic-v2';
const INMUTABLE_CACHE   = 'inmutable-v1';

const APP_SHELL = [
    //'/',
    'index.html',
    'css/style.css',
    'img/favicon.ico',
    'img/avatars/hulk.jpg',
    'img/avatars/ironman.jpg',
    'img/avatars/spiderman.jpg',
    'img/avatars/thor.jpg',
    'img/avatars/wolverine.jpg',
    'js/app.js',
    'js/sw-utils.js'
]

const APP_SHEL_INMUTABLE = [
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'css/fontawesome.css',
    'css/animate.css',
    'js/libs/jquery.js'
]

self.addEventListener('install', e => {

    const cacheStatic = caches.open( STATIC_CACHE )
    .then(cache => {
        cache.addAll( APP_SHELL );
    })

    const cacheInmutable = caches.open( INMUTABLE_CACHE )
    .then( cache => {
        cache.addAll( APP_SHEL_INMUTABLE );
    })


    e.waitUntil( Promise.all([cacheStatic, cacheInmutable]) );
});

self.addEventListener('activate', e => {

    const borrado = caches.keys()
    .then(keys => {
        keys.forEach(key => {
            if( key !== STATIC_CACHE && key.includes('static') ){
                caches.delete( key )
            }
        });
    })

    e.waitUntil( borrado );
});


self.addEventListener( 'fetch', e => {
    let respuesta;

    if(e.request.url.includes('chrome-extension')){
        respuesta = fetch(e.request).then(res => res)
    }
    else{
        respuesta = caches
        .match( e.request )
        .then(res => {

            if( res ) return res;
            else{
                return fetch( e.request )
                .then( fetchRes => {
                    return actualizarCacheDinamico( DYNAMIC_CACHE, e.request, fetchRes );
                }) 

            }

        });
    }
    e.respondWith( respuesta );
})
