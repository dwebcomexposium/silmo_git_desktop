;(function($, window, document, undefined) {
	var $win = $(window);
	var $doc = $(document);

	function getCookie(name) {
	    var nameEQ = name + '=';
	    var ca = document.cookie.split(';');

	    for (var i=0; i < ca.length; i++) {
	        var c = ca[i];

	        while (c.charAt(0) == ' ') {
	        	c = c.substring(1,c.length)
	        };

	        if (c.indexOf(nameEQ) == 0) {
	        	return c.substring(nameEQ.length,c.length);
	        }
	    }

	    return null;
	}

	function setCookie(name, value) {
	    var expires = '';
     	var date    = new Date();

        date.setTime(date.getTime() + (1000*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();

	    document.cookie = name + '=' + (value || '')  + expires + '; path=/';
	}

	$win.on('load', function() {
		if (!getCookie('popup-no-open')) {
			setTimeout(openPopup, 3000);
		}
	});

	$('.checkbox input[type=checkbox').on('click', function() {
		if ( $('.checkbox').find('input:checked').length ) {

			setTimeout(function() {
				$('.popup-alt').removeClass('show');
				setCookie('popup-no-open', 1);
			}, 500);
		}
	});

	$doc.on('click', function(e) {
		var $target = $(e.target);

		if ( !$target.closest('.popup__inner').length ) {
			$('.popup-alt').removeClass('show');
		}
	});

	$('.btn-close-popup').on('click', function(e) {
		e.preventDefault();

		$('.popup-alt').removeClass('show');
	});

	function openPopup() {
		$('.popup-alt').addClass('show');
	}

})(jQuery, window, document);
