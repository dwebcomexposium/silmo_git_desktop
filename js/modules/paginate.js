/**!
 AJAX pagination
 Links that load HTML via XHR into target element and update the links list

 @contributors: Geoffrey Crofte (AlsacrÃ©ations), Guillaume Focheux (AlsacrÃ©ations), Rodolphe (AlsacrÃ©ations)
 @date-created: 2015-04-13
 @last-update: 2015-07-06
 */

;
(function($) {

  function pagination_change(e) {

    // Vars
    var separator = '?page=';
    var $this = $(this);
    var page = $this.data('page');
    if(page===undefined) return true; // Don't disturb true links (not page links)

    e.preventDefault();
    if($this.parent().hasClass('is-inactive')) {
      return false;
    }

    var $pagination_container = $this.closest('.cxp-pagination');
    var $target_container = $('[data-container-id=' + $pagination_container.data('container') + ']');
    var pagemax = $pagination_container.data('pageMax');
    var pagedisp = $this.closest('.pagination').data('pagedisp');
    if(pagedisp===undefined) pagedisp = 10;
    var pageBefore = $('.is-active a', $pagination_container).data('page'); // current
    var url = $this.data('url');
    var $link = $this;

    // Prev/next links are NOT numbers
    if (isNaN(parseInt(page))) {

      $link = $('.is-active a', $pagination_container);
      if(pagedisp<1) { // Pagination without numbers (only prev/next links)
        var currentpage = $pagination_container.data('currentpage');
        if(!currentpage) currentpage = 1;
        if(page=='next') currentpage++;
        else if(page=='prev') currentpage--;
        $pagination_container.data('currentpage',currentpage);
        page = currentpage;
      } else {
        if (page == 'next') {
          page = Math.min(pagemax, parseInt($link.data('page')) + 1);
        } else if (page == 'prev') {
          page = Math.max(1, parseInt($link.data('page')) - 1);
        }
      }
    }

    $link = $('[data-page=' + page + ']', $pagination_container);

    // Regenerate page groups
    if (pagedisp > 0 && $link.length == 1) {
      $('li:not(.pagin-prev,.pagin-next)', $pagination_container).remove();
      var pagestart = page - Math.min(page - 1, Math.floor(pagedisp / 2));
      var pageend = Math.min(pagestart + pagedisp - 1, pagemax);
      if (pageend - pagestart + 1 < pagedisp) {
        pagestart = Math.min(pagestart, Math.max(1, pageend - pagedisp + 1))
      }

      var html = '';
      var i = 1;

      // First link (page 1)
      if (pagestart !== 1) {
        html += '<li class="pagin-item"><a href="' + separator + (i) + '" data-url="' + $pagination_container.data('url') + separator + (i) + '" data-page="' + (i) + '" title="page ' + (i) + '">' + (i) + '</a></li>';
        if (pagestart > 2) {
          html += '<li class="pagin-item">...</li>';
        }
      }

      // Links around page
      for (i = pagestart; i <= pageend; i++) {
        html += '<li class="pagin-item"><a href="' + separator + (i) + '" data-url="' + $pagination_container.data('url') + separator + (i) + '" data-page="' + (i) + '" title="page ' + (i) + '">' + (i) + '</a></li>';
      }

      // Last link (page max)
      if (pageend !== pagemax) {
        i = pagemax;
        if (pageend < pagemax - 1) {
          html += '<li class="pagin-item">...</li>';
        }
        html += '<li class="pagin-item"><a href="' + separator + (i) + '" data-url="' + $pagination_container.data('url') + separator + (i) + '" data-page="' + (i) + '" title="page ' + (i) + '">' + (i) + '</a></li>';
      }

      // Insert links
      $('.pagin-next', $pagination_container).before(html);
      $link = $('[data-page=' + page + ']', $pagination_container);
    }

    url = $link.data('url');
    if(!url) url = $pagination_container.data('url')+separator+page; // if pagedisp==0

    $('.pagin-grids-next, .pagin-next',$pagination_container).toggleClass('is-inactive',page===pagemax);
    $('.pagin-grids-prev, .pagin-prev',$pagination_container).toggleClass('is-inactive',page<=1);

    // CSS classes
    $('li', $pagination_container).removeClass('is-active');
    $link.closest('li').addClass('is-active');

    // Ajax load
    if ($target_container !== false && $target_container.length>0) {

      // HTML5 History API push
			/*
      if (history.pushState) {
        if (!$pagination_container.data('pushState')) {
          history.replaceState({
            page: pageBefore,
            container: $pagination_container.data('container')
          }, document.title, $(this).attr('href'));
        }
        history.pushState({
          page: page,
          container: $pagination_container.data('container')
        }, document.title, $(this).attr('href'));
        $pagination_container.data('pushState', true);
      }
			*/
      $target_container.load(url, function() {
        // Scroll top top of content
        var top = $pagination_container.offset().top;
        if(top) $('body,html').animate({
          scrollTop:top
        },'fast');
      });
    } else {
      console.log('Target container not found for pagination');
    }
  }

  // Pagination plugin
  $.fn.cxpPagination = function() {
    $(this).each(function() {
      $(this).on('click', 'a', pagination_change);
    });
  };

  $('.cxp-pagination').cxpPagination();

	// HTML5 History API pop
	/*
  $(window).on('popstate', function(e) {
    var state = e.originalEvent.state;
		if(state !== undefined && state.page !== undefined && state.container !== undefined) {
			$('[data-container='+state.container+']').find('[data-page='+state.page+']').trigger('click');
		}
  });
	*/

})(jQuery);
