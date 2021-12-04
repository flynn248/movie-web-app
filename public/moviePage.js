var $ = id => {return document.getElementById(id);};

const MSG = Result.msg;
headLinks = $('link')
const countLinks = () => {
    links = headLinks.getElementsByTagName('a').length
    return links
}

if(countLinks() > 1 && USERNAME === ''){
    headLinks.lastChild.remove();
} else if(countLinks() == 1 && USERNAME !== ''){
    newA = document.createElement('a');
    newA.setAttribute('href', `/user/${USERNAME}`);
    newA.setAttribute('id', 'user-link');
    headLinks.appendChild(newA).innerText = USERNAME;
}