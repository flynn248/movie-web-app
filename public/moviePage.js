var $ = id => {return document.getElementById(id);};

const commentBox = (USERNAME) => {
    $('comment-submit-button').addEventListener('click', () =>{
        if(USERNAME === undefined || USERNAME === 'undefined'){ // If user is not logged in
            var willSignUp = window.confirm("You must be signed in to comment on a movie.\nWould you like to sign up?")
            form = $('comment-form')
            form.setAttribute('method', 'get');
            $('comment-box').value = '';
            
            if(willSignUp){ // Will sign up. Go to signup page
                form.setAttribute('action', '/signup');
            }else{ // Won't sign up. Stay on page. Do no submit comment.
                form.setAttribute('action', `/movie/${Result.movieID}`);
            }
        }else{
            comment = $('comment-box').value;
            if(comment.length > 500){
                console.log("Over limit. Reducing size");
                comment = comment.substring(0,500);
            }
    
            $('comment-box').value = comment;
        }
    })

}

const addToFavButton = (USERNAME) => {
    $('favorite-button').addEventListener('click', () => {
        if(USERNAME === undefined || USERNAME === 'undefined'){ // If user is not logged in
            var willSignUp = window.confirm("You must be signed in to favorite a movie.\nWould you like to sign up?")
            form = $('fav-form')
            form.setAttribute('method', 'get');
            
            if(willSignUp){ // Will sign up. Go to signup page
                form.setAttribute('action', '/signup');
            }else{ // Won't sign up. Stay on page. Do no submit comment.
                form.setAttribute('action', `/movie/${Result.movieID}`);
            }
        }
    })
}

const remFromFavButton = (USERNAME, title, movieID) => {
    var form = $('fav-form')
    form.setAttribute('action', `/removeFavorite/${Result.movieID}`);
    
    var favButton = $('favorite-button');
    favButton.innerText = "Remove From Favorites";
    
    favButton.addEventListener('click', () => {
        var willRemove = this.window.confirm(`Would you like to remove ${Result.title} from your favorites list?`)
        if(!willRemove){ // Will sign up. Go to signup page
            form.setAttribute('method', 'get');
            form.setAttribute('action', `/movie/${Result.movieID}`);
        }
    })
}

const rateMovie = () => {
    $('rate-submit').addEventListener('click', () => {
        form = $('rate-form')
        if(USERNAME === undefined || USERNAME === 'undefined'){ // If user is not logged in
            var willSignUp = window.confirm("You must be signed in to rate a movie.\nWould you like to sign up?")
            form.setAttribute('method', 'get');
            
            if(willSignUp){ // Will sign up. Go to signup page
                form.setAttribute('action', '/signup');
            }else{ // Won't sign up. Stay on page. Do no submit comment.
                form.setAttribute('action', `/movie/${Result.movieID}`);
            }
        }else{
            rating = $('rate-button')
            window.alert(`You rated ${Result.title} ${rating.value} / 10`)
            formAction = form.getAttribute('action')
            form.setAttribute('action', `${formAction}/${rating.value}`)
        }
    })
}

const rateButton = () => {
    $('rate-button').addEventListener('change', () =>{
        rating = $('rate-button')
        if(!(rating.value > 0 && rating.value <= 10) || isNaN(rating.value)){
            window.alert("A rating must be between 1-10")
            rating.value = 5
        }
    })
}

window.addEventListener('load', function () {
    const ISFAV = Result.isFav;
    const USERNAME = Result.userName;
    commentBox(USERNAME);
    rateMovie();
    rateButton();
    if(ISFAV === true){
        remFromFavButton(USERNAME, Result.title, Result.movieID);
    }else{
        addToFavButton(USERNAME);
    }


});