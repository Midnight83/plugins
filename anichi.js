(function(){
    'use strict';

    const base = 'https://anichi.org';

    function search(query, callback){
        fetch(base + '/?s=' + encodeURIComponent(query))
            .then(r => r.text())
            .then(html => {
                let items = [];
                let regex = /<a href="(https:\/\/anichi\.org\/[^"]+)"[^>]*class="poster"[^>]*>\s*<img[^>]*src="([^"]+)"[^>]*alt="([^"]+)"/g;
                let match;

                while ((match = regex.exec(html)) !== null) {
                    items.push({
                        title: match[3],
                        url: match[1],
                        poster: match[2]
                    });
                }

                callback(items);
            });
    }

    function getEpisodes(url, callback){
        fetch(url)
            .then(r => r.text())
            .then(html => {
                let episodes = [];
                let regex = /data-episode="([^"]+)"\s*data-video="([^"]+)"/g;
                let match;

                while ((match = regex.exec(html)) !== null) {
                    episodes.push({
                        title: 'Серия ' + match[1],
                        url: match[2]
                    });
                }

                callback(episodes);
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
