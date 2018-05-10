function getAbsoluteHeight(el) {
    // Get the DOM Node if you pass in a string
    el = (typeof el === 'string') ? document.querySelector(el) : el;
    var styles = window.getComputedStyle(el);
    var margin = parseFloat(styles['marginTop']) +
        parseFloat(styles['marginBottom']);
    return Math.ceil(el.offsetHeight + margin);
}

function isInViewport(element) {
    var rect = element.getBoundingClientRect();
    var html = document.documentElement;
    return (
        rect.top < (window.innerHeight || html.clientHeight)
    );
}

var buttonScroll = document.querySelector('.scroll-down');

if (buttonScroll) {
    var sect = buttonScroll.closest('.section');
    var sectSize = getAbsoluteHeight(sect) + 100;
    buttonScroll.addEventListener('click', function(e) {
        e.preventDefault();
        var i = window.pageYOffset;
        var int = setInterval(function() {
            window.scrollTo(0, i);
            i += 10;
            if (i > sectSize) clearInterval(int);
        }, 10);
    });
}


var buttonToCopy = document.querySelector('.copy-text__button');
if (buttonToCopy) {
    buttonToCopy.addEventListener('click', function(e) {
        e.preventDefault();
        var frameCopy = buttonToCopy.closest('.copy-text');
        var fieldCopy = document.querySelector('.copy-text__input');
        if (fieldCopy) {
            fieldCopy.focus();
            fieldCopy.select();
            document.execCommand("copy");
        }
    });
}

var movingImg = document.querySelector('.js-moving-image');

if (movingImg) {
    window.addEventListener('scroll', function(e) {
        if (isInViewport(movingImg)) {
            var windowStep = window.innerHeight / 10;
            var part = movingImg.getBoundingClientRect().top / windowStep;
            var percent = 39 - (40 / 10 * part);
            if (percent <= 40) {
                movingImg.style.transform = "translateX(-" + percent + "%)";
            }
        }
    });
}

var activeButtons = document.querySelectorAll('.js-activeButton');
if (activeButtons) {
    activeButtons.forEach(function(submitButton) {
        var formSection = submitButton.closest('.section');
        var formCheckbox = formSection.querySelector('.reg-confirm-input');
        var formInputs = formSection.querySelectorAll('input');
        var formTextarea = formSection.querySelectorAll('textarea');

        formSection.addEventListener('change', function() {
            var confirm = true;
            formInputs.forEach(function(input) {
                if (input.value === '' && input.type !== 'file') {
                    confirm = false;
                }
                if (formCheckbox && formCheckbox.checked === false) {
                    confirm = false;
                }
            });
            formTextarea.forEach(function(textArea) {
                if (textArea.value === '') {
                    confirm = false;
                }
            });
            confirm ? submitButton.disabled = false : submitButton.disabled = true;
        });
    });
};

if (document.querySelector('#ya-share')) {
    var shareUrl = document.querySelector('.copy-text__input').value;
    var share = Ya.share2('ya-share', {
        content: {
            url: shareUrl
        }
    });
}

var gotoRegLink = document.querySelector('.js-goto-reg');

if (gotoRegLink) {
    gotoRegLink.addEventListener('click', function(evt) {
        evt.preventDefault();
        window.location.href = window.location.origin + "/#reg";
        location.reload();
    });
}

var page = document.documentElement;
var body = document.body;
var scrollPosition;
var isScrollLink = false;

var loginBlock = document.querySelector('#login');
var regBlock = document.querySelector('#reg');

if (loginBlock && regBlock && window.location.hash !== "#login") {
    loginBlock.style.display = 'none';
} else if (loginBlock && window.location.hash === "#login") {
    regBlock.style.display = 'none';
};

var switchRegLog = function(delayTime) {
    if (loginBlock && regBlock) {
        if (window.location.hash === "#login") {
            loginBlock.style.display = 'block';
            regBlock.style.display = 'none';
            setTimeout(function() { loginBlock.scrollIntoView({ behavior: 'smooth' }) }, delayTime);
        }
        if (window.location.hash === "#reg") {
            regBlock.style.display = 'block';
            loginBlock.style.display = 'none';
            setTimeout(function() { regBlock.scrollIntoView({ behavior: 'smooth' }) }, delayTime);
        }
    };
};

window.addEventListener('click', function(evt) {
    if (evt.target.getAttribute('href') == '#reg' || evt.target.getAttribute('href') == '#login') {
        scrollPosition = page && page.scrollTop || body && body.scrollTop || 0;
        isScrollLink = true;
        evt.preventDefault;
    }
});

window.addEventListener('scroll', function(evt) {
    if (isScrollLink) {
        evt.preventDefault;
        isScrollLink = false;
        window.scrollTo(0, scrollPosition);
        switchRegLog(1)
    }
});

window.addEventListener("hashchange", function(evt) {
    evt.preventDefault;
    window.scrollTo(0, scrollPosition);
    switchRegLog(1)
}, false);

window.addEventListener("DOMContentLoaded", function() {
    switchRegLog(1);
});

var langButton = document.querySelector('.js-lang');
var langNodeToShow = document.querySelectorAll('.language__link')[1];
langButton.addEventListener('click', function(evt) {
    evt.preventDefault();
    langNodeToShow.classList.toggle('is-visible');
    langButton.closest('.language__list').classList.toggle('is-active');
    langNodeToShow.addEventListener('click', function(evt) {
        evt.preventDefault();
        var enLangPath = '/en';
        var refLinkPosition = window.location.href.indexOf('?r=');
        var refLink = '';
        if (refLinkPosition != -1) {
            refLink = window.location.href.slice(refLinkPosition);
        }
        if (langNodeToShow.classList.contains('language__link--en')) {
            window.location.href = enLangPath + window.location.pathname + refLink + window.location.hash;
        } else {
            window.location.href = window.location.href.replace('/en/', '/') + window.location.hash;
        }
    });
});
document.addEventListener('click', function(evt) {
    if (!evt.target.closest('.header__language')) {
        langNodeToShow.classList.remove('is-visible');
        langButton.closest('.language__list').classList.remove('is-active');
    }
});

if (document.querySelector('#new_post') && window.location.hash === '#success') {
    var form = document.querySelector('#new_post');
    var successSection = document.querySelector('.section--success');
    var timeoutNum = 5;
    var timeoutCounter = document.querySelector('.js-redirect-counter');
    successSection.classList.remove('is-hidden');
    form.classList.add('is-hidden');
    var engVersion = '/en/';
    setTimeout(function() {
        window.location.href.indexOf(engVersion) + 1 ? window.location = window.location.origin + engVersion : window.location = window.location.origin;
    }, 5000);
    setInterval(function() {
        timeoutNum--;
        timeoutCounter.textContent = timeoutNum;
    }, 1000);
}

var checkCharacterCount = function() {
    var textarea = document.querySelector('.section__bid-textarea');
    if (textarea) {
        var userFiles = document.querySelector('.section__bid-questionary a.link');
        var uploadInput = document.querySelector('.section__bid-questionary input[type="file"]');
        var sendButton = document.querySelector('.section__bid-button');
        var textCount = {
            node: document.querySelector('.section__bid-tip span'),
            max: 300,
            current: textarea.value.length,
            update: function() {
                this.current = this.max - textarea.value.length;
                this.node.textContent = this.current;
                if (this.current < this.max && (uploadInput.value || userFiles)) {
                    sendButton.disabled = false;
                } else if (this.current > this.max) {
                    this.current = 0;
                } else {
                    sendButton.disabled = true;
                }
            }
        }
        textarea.addEventListener('keyup', function() {
            textCount.update();
        });
        uploadInput.addEventListener('change', function() {
            if (textarea.value.length) {
                sendButton.disabled = false;
            }
        });
    }
}

checkCharacterCount();