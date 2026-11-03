(function(root){
const normalize=value=>String(value).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const stopwords=new Set(['di','del','della','delle','dei','degli','da','per','con','e','il','lo','la','i','gli','le','un','uno','una']);
const stem=word=>/^[a-z]{5,}$/.test(word)?word.replace(/[aeio]+$/,''):word;
const aliases={saturimetr:['pulsossimetr'],pulsossimetr:['saturimetr'],stetoscop:['fonendoscop'],fonendoscop:['stetoscop'],elettrocardiograf:['ecg'],ecg:['elettrocardiograf']};
const termsFor=query=>normalize(query).split(/\s+/).filter(t=>t&&!stopwords.has(t)).map(stem);
function prepare(products){return products.map(p=>({...p,normalizedName:normalize(p.name),words:normalize(p.name).split(/\s+/).map(stem)}))}
function wordScore(words,term){if(words.includes(term))return 12;if((aliases[term]||[]).some(a=>words.includes(a)))return 10;if(term.length>=3&&words.some(w=>w.startsWith(term)))return 5;return 0}
function search(products,query){const terms=termsFor(query);if(normalize(query).length<3||!terms.length)return [];return products.map(p=>{let score=0;for(const term of terms){let hit;if(/^\d+$/.test(term)){hit=p.code===term?1000:(term.length<5&&p.code.startsWith(term)?100:0)}else hit=wordScore(p.words,term);if(!hit)return null;score+=hit}if(p.normalizedName===normalize(query))score+=50;return {...p,score}}).filter(Boolean).sort((a,b)=>b.score-a.score||a.name.localeCompare(b.name,'it')||a.code.localeCompare(b.code))}
const api={normalize,termsFor,prepare,search};if(typeof module==='object'&&module.exports)module.exports=api;else root.CatalogSearch=api;
})(globalThis);
