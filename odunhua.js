(function(){
    'use strict';

    const base = 'https://odunhua.tv';

    function search(query, callback){
        fetch(base + '/search?wd=' + encodeURIComponent(query))
            .then(r => r.text())
            .then(html => {
                let items = [];
                let regex = /<a href="(\/vod\/[^"]+)"[^>]*title="([^"]+)"[^>]*>\s*<img[^>]*data-original="([^"]+)"/g;
                let match;

                while ((match = regex.exec(html)) !== null) {
                    items.push({
                        title: match[2],
                        url: base + match[1],
                        poster: match[3]
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
                let regex = /<a href="([^"]+)"[^>]*class="btn btn-sm btn-default"/g;
                let match;

                while ((match = regex.exec(html)) !== null) {
                    episodes.push({
                        title: 'Серия',
                        url: base + match[1]
                    });
                }

                callback(episodes);
            });
    }

    function play(url, callback){
        fetch(url)
            .then(r => r.text())
            .then(html => {
                let match = html.match(/"url":"([^"]+)"/);
                if(match){
                    callback({
                        file: match[1].replace(/\\/g, '')
                    });
                }
            });
    }

    Lampa.api.add('odunhua', {
        title: 'ODunhua (Китайские аниме)',
        search: search,
        get: getEpisodes,
        play: play
    });

})();
