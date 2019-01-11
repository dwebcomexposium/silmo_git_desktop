;(function($, window, document, undefined) {
	var $win               = $(window);
	var $doc               = $(document);
	var animatedElements   = '.slider-evenement, .slider-emag, .section-image-link';
	var parallaxedElements = '.link-big-alt, .background';
	var wrappedImages      = '.slider-full img, .article_list .la-item-img, .gla-item-img, .article-title img';
	var wrappedElements    = '.slider-evenement .main-title, .edito.mod-catal h2, .edito-apropos h2, .article-content h2, .article-content h4';
	var tiltOpts           = {
		movement: {
			imgWrapper: {
				translation: {
					x: 0, 
					y: 0, 
					z: 0
				},
				rotation: {
					x: -10, 
					y: 10, 
					z: 0
				},
				reverseAnimation: {
					duration: 200, 
					easing: 'easeOutQuad'
				}
			}
		}
	}

	// Start tilt
	function startTilt($img) {
		$img.wrap('<div class="tilter__figure"></div>');
		
		new TiltFx($img.closest('figure, .la-item').get(0), tiltOpts);

		$img
			.closest('figure, .la-item')
				.addClass('tilter-container');
	}

	// Fix header
	function fixHeader(winST) {
		var $wrapper = $('.global-wrapper');
		var $header = $('.site-banner');
		var mainOT = $('#main').offset().top;

		if (winST > mainOT && !$header.hasClass('fixed')) {
			$wrapper.css({
				'paddingTop': $header.outerHeight()
			});

			$header.addClass('fixed');
		} else if (winST < mainOT) {
			$header.removeClass('fixed');

			$wrapper.css({
				'paddingTop': 0
			});
		}
	}

	// Scroll down animation
	function animateElement(winST) {
		var $animate = $(animatedElements);

		$animate.each(function(){
			var $this = $(this);
			var offset = $this.offset().top;

			if (winST + ($win.outerHeight() * 0.95) > offset) {
				$this.addClass('animated');
			}
		});

		if (winST + $win.outerHeight() > $('.site-footer').offset().top) {
			$animate.addClass('animated');
		}
	}

	// Hide on click
	function hideElementsOnClick($target, element, className, innerElement) {
		element = typeof innerElement != 'undefined' ? innerElement : element;

		if (!$target.is(element + ', ' + element + ' *, .js-toggle.' + className + ', .js-toggle.' + className + ' *')) {
			$('.' + className).each(function(){
				$(this).removeClass(className);
			});
		}
	}

	// Prepare sliders
	function prepareSlider($slider) {
		var $sliderClone = $slider.clone();

		$slider.after($sliderClone);
		$slider.remove();

		$sliderClone
			.attr('style', '')
			.find('.slider-content')
				.attr('style', '');
	}

	// Start Slider
	function startSlider($slider, options) {
		var $slidesContainer = $slider.find('.slider-content').length ? $slider.find('.slider-content') : $slider.find('.slider__slides');

		$slidesContainer.carouFredSel(options);
	}

	// Tweets
	function handleTweets(tweets) {
		var $tweetsContainer = $('#twitter');

		for (var i = 0; i < tweets.length; i++) {
			$tweetsContainer.append('<div class="slider__slide">' + tweets[i] + '</div>');
		}
	}

	// Wrap images
	$(wrappedImages).wrap('<figure></figure>');

	// Wrap elements
	$(wrappedElements).wrapInner('<span></span>');

	// 'Trend by SILMO' text
	$('.slider-emag .main-title-with-link h2').after($('html').attr('lang') == 'en' ? '<p>The online and free magazine of the trends</p>' : '<p>Le magazine en ligne et gratuit des tendances</p>');

	$('.global-wrapper').prepend('<div class="background"></div>');

	// Search 
	$('.gsf-trigger').on('click', function(e){
		e.preventDefault();

		var $this 		= $(this);
		var $searchForm = $('.global-search-form');

		$searchForm.toggleClass('search-visible');

		if ($searchForm.hasClass('search-visible')) {
			setTimeout(function() {
				$searchForm
					.find('.gsf-input')
						.focus();
			}, 50);
		}
	});

	// Parallax
	if ($(parallaxedElements).length) {
		$win.on('scroll', function(){
			$(parallaxedElements).css({
				'transform': 'translateY(' + ($win.scrollTop() / 1.5) + 'px)'
			});
		});
	}

	// Search close outside
	$doc.on('click', function(e){
		var $target = $(e.target);

		hideElementsOnClick($target, '.global-search-form', 'search-visible');
	});

	// Instagram feeds
	if ($('#instafeed').length) {
		var counter = 0;

		var feeds = new Instafeed({
			get        : 'user',
			userId     : '740922722', // SILMO user id
			accessToken: '740922722.1677ed0.55647f45ca814ee98cb58254542102c1', // SILMO access token 

			template   : '<div class="instagram-feed"><a href="{{link}}"><img src="{{image}}" /></a></div>',
			filter     : function(image) {
				return ++counter > 5 ? false : true;
			}
		});

		feeds.run();
	}

	// Twitter post fetcher
	if ($('#twitter').length) {
		twitterFetcher.fetch({
			profile        : {
				screenName: 'silmoparis'
			},
			domId          : 'twitter',
			maxTweets      : 5,
			enableLinks    : true, 
			showUser       : true,
			showTime       : false,
			showDate       : false,
			showImages     : true,
			lang           : 'fr',
			showRetweet    : false,
			showInteraction: false,
			customCallback : handleTweets
		});

		$win.on('load', function(){
			startSlider($('.slider-tweets'), {
				width: '100%',
				items: 1,
				responsive: true,
				scroll: { 
					fx: 'crossfade',
					duration: 600
				},
				swipe: {
					onTouch: true,
					onMouse: false
				},
				auto: {
					play: true,
					timeoutDuration: 7000
				},
				infinite: true,
				prev: {
					button: '.slider-tweets .slider__prev'
				},
				next: {
					button: '.slider-tweets .slider__next'
				},
			});
		});
	}

	// Animted elements
	if (animatedElements != '') {
		$(animatedElements).addClass('animate');
	}

	// Newsletter 
	if ($('.newsletter-form').length) {
		var $form = $('.newsletter-form');

		$form
			.detach()
			.appendTo('body');
		$form
			.find('.nf-form-input input')
			.attr('placeholder', 'Votre email');
		$form
			.find('.nf-main-content')
			.append('<a href="#" class="form-close"/>');

		$('[href*="#newsletter"]').on('click', function(e){
			e.preventDefault();

			$form.addClass('form-shown');
		});

		$doc.on('click', function(e){
			var $target = $(e.target);

			if (($target.is('.form-close, .form-close *') || !$target.is('.nf-main-content, .nf-main-content *, [href*="#newsletter"], [href*="#newsletter"] *')) && $form.hasClass('form-shown')) {
				e.preventDefault();

				$form.removeClass('form-shown');
			}

			if (!$target.is('.lang-switcher, .lang-switcher * ')) {
				$('.lang-switcher').removeClass('is-visible');
			}
		});

		if (window.location.href.indexOf('#newsletter') >= 0) {
			$form.addClass('form-shown');
		}
	}

	// Article list tilt
	if ($('.article_list, .dor, .exposants, .academy').length) {
		$('.la-item-img').each(function(){
			startTilt($(this));
		});

		$('.gla-item-img').each(function(){
			startTilt($(this));
		});
	}

	// Homepage slider
	if ($('.list-articles.slider-full .la-slider').length) {
		prepareSlider($('.list-articles.slider-full .la-slider'));

		$win.on('load', function(){
			startSlider($('.list-articles.slider-full .la-slider'), {
				width: '100%',
				items: 1,
				responsive: true,
				scroll: { 
					fx: 'fade',
					duration: 1500,
					onBefore: function() {
						$(this)
								.find('.la-item.active')
									.removeClass('active');
					},
					onAfter: function() {
						$(this)
								.find('.la-item:first-child')
									.addClass('active');
					}
				},
				swipe: {
					onTouch: true,
					onMouse: false
				},
				auto: {
					play: true,
					timeoutDuration: 7000
				},
				pagination: {
					container: '.list-articles.slider-full .slider-pagin'
				},
				onCreate: function() {
					$(this)
							.find('.la-item:first-child')
								.addClass('active');

					$('.slider-full .la-item-img').each(function(){
						startTilt($(this));
					});
				},
				infinite: true
			});
		});
	}

	// Homapage evenements slider
	if ($('.slider-evenement').length) {
		prepareSlider($('.slider-evenement'));

		$('.slider-evenement .la-item').wrapInner('<div></div>');

		$win.on('load', function(){
			startSlider($('.slider-evenement'), {
				width: '100%',
				items: 3,
				responsive: true,
				scroll: { 
					fx: 'crossfade',
					duration: 1000,
					onBefore: function() {
						$('.slider-evenement .slider-content').each(function(){
							$(this)
								.find('.la-item')
									.each(function(e){
										setTimeout(function() {
											$(this).removeClass('active');
										}.bind(this), e * 150);
									});
						});
					},
					onAfter: function() {
						$('.slider-evenement .la-item:nth-child(-n+3)').each(function(e){
							setTimeout(function() {
								$(this).addClass('active');
							}.bind(this), e * 150);
						});
					}
				},
				swipe: {
					onTouch: true,
					onMouse: false
				},
				auto: {
					play: true,
					timeoutDuration: 7000
				},
				onCreate: function() {
					$('.slider-evenement .la-item > div').each(function(){
						startTilt($(this));
					});

					$('.slider-evenement .la-item:nth-child(-n+3)').addClass('active');
				},
				prev: {
					button: '.slider-evenement .slider-btn-prev'
				},
				next: {
					button: '.slider-evenement .slider-btn-next'
				},
				infinite: true
			});
		});
	}

	$win.on('load', function(){
		setTimeout(function() {
			$('body').addClass('loaded');
		}, 2000);
	}).on('load scroll', function(){
		var winST = $win.scrollTop();

		fixHeader(winST);
		animateElement(winST);
	});
})(jQuery, window, document);
