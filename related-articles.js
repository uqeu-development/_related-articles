
$(document).ready(() => {

    const RELATED_ARTICLES_URL = "https://cdn.jsdelivr.net/gh/uqeu-development/_related-articles@latest/related-articles.json";
    let RELATED_ARTICLES = {};

    getCurrentPageId = (relatedArticles) => {
        // let url = window.location.pathname;
        let url = "uk/en/content/airism-face-mask.html" //dev purposes
        url = url.substring(url.lastIndexOf('/') + 1);

        let pageContentId = ""

        relatedArticles.map((article, index) => {
            const currentArticleId = relatedArticles[index].content_id + '.html' //append .html to the end of content ID to compare to URL
            if (currentArticleId === url) {
                pageContentId = currentArticleId
            }
        })
        return pageContentId.replace(".html", "");
    }
    getCurrentRegion = () => {
        // const region = window.location.href;
        const region = 'uk/en/content/airism-face-mask.html'
        let currentRegion = "";

        if (region.includes('uk/en')) {
            currentRegion = 'uk/en';
        } else if (region.includes('se/en')) {
            currentRegion = 'se/en';
        } else if (region.includes('dk/en')) {
            currentRegion = 'dk/en';
        } else if (region.includes('eu/en')) {
            currentRegion = 'eu/en';
        } else if (region.includes('es/es')) {
            currentRegion = 'es/es';
        } else if (region.includes('fr/fr')) {
            currentRegion = 'fr/fr';
        } else if (region.includes('de/de')) {
            currentRegion = 'de/de';
        } else if (region.includes('it/it')) {
            currentRegion = 'it/it';
        }
        return currentRegion;
    }
    trimText = (type, string) => {
        if (type === "title") {
            if (string.includes('|')) {
                const index = string.indexOf('|')
                return string.substring(0, index);
            } else {
                return string;
            }
        } else {
            //trim description
            if (string.includes('.')) {
                const index = string.indexOf('.');
                return string.substring(0, index) + ".";
            }
        }
    }
    getRelatedArticles = async (relatedArticles, currentId, region) => {
        let RELATED_ARTICLES_TO_SHOW = {}

        for (let i = 0; i < relatedArticles.length; i++) {
            let parser = new DOMParser();

            if (relatedArticles[i].content_id === currentId) {
                let related = relatedArticles[i].related_articles;
                if (related.length === 0) {
                    RELATED_ARTICLES_TO_SHOW = {};
                } else {
                    related = related.split(',')
                    for (let i = 0; i < related.length; i++) {
                        const c = related[i].trim();
                        let s = relatedArticles[i].server;
                        let url = `https://www.uniqlo.com/${region}/${s}/${c}.html`
                        let response = await fetch(url);
                        let data = await response.text();
                        let doc = parser.parseFromString(data, "text/html")
                        let articleTitle = doc.title;
                        articleTitle = trimText("title", articleTitle);
                        let articleDescription = doc.querySelector("meta[name='description']").getAttribute("content");
                        articleDescription = trimText("description", articleDescription);

                        RELATED_ARTICLES_TO_SHOW[c] = {
                            "article_title": articleTitle,
                            "article_description": articleDescription,
                            "img_url": relatedArticles[i].img_url,
                            "release_date": relatedArticles[i].release_date,
                            "expiry_date": relatedArticles[i].expiry_date,
                            "server": relatedArticles[i].server,
                            "content_id": c
                        }
                    }
                }
            }
        }
        return RELATED_ARTICLES_TO_SHOW
    }
    fetchContent = async (url) => {
        const response = await fetch(url);
        const relatedArticles = await response.json();
        return relatedArticles;
    }
    fetchHTML = async (url) => {
        const response = await fetch(url);
        const html = await response.text();
        return html;
    }

    try {
        fetchContent(RELATED_ARTICLES_URL).then(async (relatedArticles) => {
            RELATED_ARTICLES = relatedArticles;

            const CURRENT_REGION = getCurrentRegion();
            const CURRENT_CONTENT_ID = getCurrentPageId(RELATED_ARTICLES);

            let RELATED_ARTICLES_TO_SHOW = await getRelatedArticles(RELATED_ARTICLES, CURRENT_CONTENT_ID, CURRENT_REGION)

            //check if the content assets has any related articles 
            if (Object.keys(RELATED_ARTICLES_TO_SHOW).length !== 0) {
                let related_articles_container = document.createElement('div');
                related_articles_container.setAttribute('class', 'ra-section')
                let raAnchor;
                Object.keys(RELATED_ARTICLES_TO_SHOW).map((article, index) => {
                    const article_img = RELATED_ARTICLES_TO_SHOW[article].img_url
                    const article_title = RELATED_ARTICLES_TO_SHOW[article].article_title;
                    const article_description = RELATED_ARTICLES_TO_SHOW[article].article_description;
                    const article_server = RELATED_ARTICLES_TO_SHOW[article].server;
                    const article_id = RELATED_ARTICLES_TO_SHOW[article].content_id;
                    const article_url = `https://www.uniqlo.com/${CURRENT_REGION}/${article_server}/${article_id}.html`
                    raAnchor = document.createElement('a');
                    raAnchor.setAttribute('href', article_url)
                    raAnchor.setAttribute('target', "_blank");
                    raAnchor.setAttribute('class', 'ra-container')

                    const raContainer = document.createElement('div');
                    // raContainer.setAttribute('class', 'ra-container');


                    const raBlock = document.createElement('div');
                    raBlock.setAttribute('class', 'ra-block');
                    raContainer.appendChild(raBlock)

                    const raBlockImg = document.createElement('div');
                    raBlockImg.setAttribute('class', 'ra-block-img');
                    const raImg = document.createElement('img');
                    raImg.setAttribute('src', article_img)
                    raImg.setAttribute('alt', article_title)
                    raBlockImg.appendChild(raImg);
                    raBlock.appendChild(raBlockImg)

                    const raBlockInfo = document.createElement('div');
                    raBlockInfo.setAttribute('class', 'ra-block-info');

                    const raBlockTitle = document.createElement('h4');
                    raBlockTitle.innerHTML = article_title;

                    const raBlockDescription = document.createElement('p');
                    raBlockDescription.innerHTML = article_description;

                    raBlockInfo.appendChild(raBlockTitle);
                    raBlockInfo.appendChild(raBlockDescription);

                    raBlock.appendChild(raBlockInfo)

                    raAnchor.appendChild(raContainer);
                    related_articles_container.appendChild(raAnchor);

                    //css
                    const ra_styles = document.createElement('style');
                    ra_styles.innerHTML = `
                        .ra-section{
                            display: flex;
                            justify-content: space-between;
                            width: 100%;
                            padding-top: 40px;
                            padding-bottom: 40px;
                            border-top: 1px solid black;
                            margin-top: 40px;
                        }
                        .ra-container{
                            width: 30%;
                            margin: 0 auto;
                        }

                        .ra-container .ra-block{
                            display: flex;
                        }
                        .ra-container .ra-block-img {
                            min-width: 75px;
                            min-height: 75px;
                            max-height: 75px;
                            max-width: 75px;
                            margin-right: 10px;
                        }
                        .ra-container .ra-block-img img{
                            width: 100%;
                        }
                        .ra-container .ra-block-info h4{
                            margin-bottom: 5px;
                        }
                        .ra-container .ra-block-info p{
                            margin-top: 0px;
                            margin-bottom: 0px;
                            font-size: 12px !important;
                        }

                        @media only screen and (max-width: 800px){
                            .ra-section{
                                flex-direction: column;
                                
                            }
                            .ra-container{
                                width: 80%;
                                margin-bottom: 20px;
                            }
                        }
                    `

                    related_articles_container.appendChild(ra_styles)
                })
                const container = document.getElementById('container');
                container.appendChild(related_articles_container)
            }


            else {

            }

        }
        );
    } catch (error) {
        console.log(error)
    }






})