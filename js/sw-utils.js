
// Guardar cache dinamico
function actualizarCacheDinamico( dynamicCache, req, res ) {
    if(res.ok){
        caches.open( dynamicCache )
        .then( cache => {
            if(!req.url.includes('chrome-extension')) 
                cache.put( req, res.clone() );
            
            return res.clone();
        })
    } else {
        return res;
    }
}