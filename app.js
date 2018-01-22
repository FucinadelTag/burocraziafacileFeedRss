var ApiBuilder = require('claudia-api-builder');
var Prismic = require ('prismic-javascript');

var apiEndpoint = 'http://burocraziafacile.prismic.io/api/v2';



var api = new ApiBuilder();

module.exports = api;

api.get('/rss', function (event, context) {
    Prismic.getApi(apiEndpoint)
    .then (
        function (api) {
            return api.query(
                [
                    Prismic.Predicates.at('document.type', 'articolo'),
                    Prismic.Predicates.at('my.articolo.tipo', 'articolo')
                ],
                { pageSize : 20, page : 1, orderings : '[document.first_publication_date desc]', fetchLinks: 'categoria.uid' }
            );
        }
    )
    .then (
        function(response) {
            //console.log(response);
            context.succeed(response);
            return 'response';
        }
    )
});
