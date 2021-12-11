// Add the username as a link to the header bar only if the user is logged in.

var $ = id => {return document.getElementById(id);};

const USERNAME = Result.userName;
headLinks = $('link')
console.log(headLinks)
const countLinks = () => {
    links = headLinks.getElementsByTagName('a').length
    return links
}

if(countLinks() > 1 && USERNAME === undefined){
    headLinks.lastChild.remove();
} else if(countLinks() == 1 && USERNAME !== undefined){
    newA = document.createElement('a');
    newA.setAttribute('href', `/user/${USERNAME}`);
    newA.setAttribute('id', 'user-link');
    headLinks.appendChild(newA).innerText = USERNAME;
}