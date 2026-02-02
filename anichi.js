(function(){
    'use strict';

    const base = 'https://anichi.pw';

    function search(query, callback){
        fetch(base + '/?s=' + encodeURIComponent(query))
            .then(r => r.text())
            .then(html => {
                let items = [];

                // Ищем постеры по общему паттерну: ссылка + картинка + alt
                let regex = /<a[^>]+href="([^"]+)"[^>]*class="poster"[^>]*>[\s\S]*?<img[^>]+src="([^"]+)"[^>]+alt="([^"]+)"/g;
                let match;

                while ((match = regex.exec(html)) !== null) {
                    let url = match[1];
                    if (url.indexOf('http') !== 0) url = base + url;

                    let poster = match[2];
                    if (poster.indexOf('http') !== 0) poster = base + poster;

                    items.push({
                        title: match[3],
                        url: url,
                        poster: poster
                    });
                }

                callback(items);
            })
            .catch(e => {
                console.log('AniChi search error', e);
                callback([]);
            });
    }

    function getEpisodes(url, callback){
        fetch(url)
            .then(r => r.text())
            .then(html => {
                let episodes = [];

                // Ищем data-episode / data-video или похожие атрибуты
                let regex = /data-episode="([^"]+)"\s*data-video="([^"]+)"/g;
                let match;

                while ((match = regex.exec(html)) !== null) {
                    let link = match[2];
                    if (link.indexOf('http') !== 0) link = base + link;

                    episodes.push({
                        title: 'Серия ' + match[1],
                        url: link
                    });
                }

                // fallback: если нет data-video, можно потом допилить под iframe
                callback(episodes);
            })
            .catch(e => {
                console.log('AniChi episodes error', e);
                callback([]);
            });
    }

    function play(url, callback){
        callback({
            file: url
        });
    }

    Lampa.api.add('anichi', {
        title: 'AniChi (Дунхуа)',
        search: search,
        get: getEpisodes,
        play: play
    });

})();
