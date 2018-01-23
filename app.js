var ApiBuilder = require('claudia-api-builder');
var Prismic = require ('prismic-javascript');
const Feed = require('feed');
const PrismicDom  = require('prismic-dom');

var apiEndpoint = 'http://burocraziafacile.prismic.io/api/v2';

var feed = new Feed({
  title: 'BurocraziaFacile.it - Guide Gratuite alle Tue Pratiche',
  description: 'Risparmia Tempo con Burocrazia Facile: Trova Subito le Soluzioni alle Tue Pratiche e Ricevi Online i Documenti che ti Servono!',
  id: 'https://www.burocraziafacile.it/',
  link: 'https://www.burocraziafacile.it/',
  image: 'https://prismic-io.s3.amazonaws.com/burocraziafacile/6ee37555903fbb556179937998dc274d1c730b61_unnamed.png',
  favicon: 'https://www.burocraziafacile.it/favicon.ico',
  copyright: 'All rights reserved 2018, Script Media Group LTD',
  generator: 'SMG', // optional, default = 'Feed for Node.js'
  feedLinks: {
    json: 'https://example.com/json',
    atom: 'https://example.com/atom',
  },
  author: {
    name: 'BurocraziaFacile.it',
    email: 'info@fucinadeltag.it',
    link: 'https://www.burocraziafacile.it/'
  }
})

var linkArticolo = function (articolo) {
    let categoria = articolo.data.categoria.uid;

    let path = categoria + "/" + articolo.uid;

    let url = "https://www.burocraziafacile.it/" + path;

    return (url);
}


var api = new ApiBuilder();

module.exports = api;


api.get('/rss', function (request) {
    return Prismic.getApi(apiEndpoint)
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
        function(results) {

            results.results.forEach(articolo => {
                feed.addItem({
                    title: PrismicDom.RichText.asText(articolo.data.titolo),
                    id: linkArticolo (articolo),
                    link: linkArticolo (articolo),
                    description: PrismicDom.RichText.asHtml(articolo.data.abstract),
                    author: [{
                        name: 'BurocraziaFacile',
                        email: 'info@fucinadeltag.it',
                        link: 'https://www.fucinadeltag.it/'
                    }],
                    date: new Date(articolo.first_publication_date),
                    image: articolo.data.immagine_principale[0].immagine.url
                })
            });

            return feed.rss2();

        }
    )
}, {success: {headers: {'X-Version': '101', 'Content-Type': 'application/rss+xml'}}});
