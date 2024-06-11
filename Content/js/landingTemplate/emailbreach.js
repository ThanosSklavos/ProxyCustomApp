
(function ($) {
	$.fn.emailBreach = function (options) {
		var defaults = {
			iconContainerId: this.attr('id') + "_ico"
		};
		var settings = $.extend({}, defaults, options);

		var elem = this;
		var icoElem, iElem, prgElem;
		var timerVar = null;
		var state = 0;

		this.resetIcon = function () {
			iElem.attr('class', 'i-circled i-light i-small icon-info');
			iElem.attr('data-original-title', 'Will check if your email has been compromised in a data breach');
			state = 0;
		}

		this.setBreachedIcon = function (bc) {
			iElem.attr('class', 'i-circled bg-warning i-small icon-email3');
			iElem.attr('data-original-title', `Your email address has been compromised through ${bc} breached site${bc == 1 ? '' : 's'}.\nCheck your email on NameScan's "Free Compromised Email Check" page for more detailed information.`);
			state = 1;
		}

		this.setSafeIcon = function () {
			iElem.attr('class', 'i-circled bg-success i-small icon-email3');
			iElem.attr('data-original-title', 'Your email address is not associated with any data breaches.');
			state = 2;
		}

		this.setUnknownIcon = function () {
			iElem.attr('class', 'i-circled bg-info i-small icon-question');
			iElem.attr('data-original-title', 'Could not check your email in data breach.');
			state = 3;
		}

		this.showProgress = function (show) {
			if (show) {
				iElem.hide();
				prgElem.show();
			}
			else {
				prgElem.hide();
				iElem.show();
			}
		}

		this.checkBreaches = function () {
			var email = elem.val();
			if (/^[a-zA-Z0-9_\-\!#\$%&'\*\+/=\?^`{\|}~](\.?[a-zA-Z0-9_\-\!#\$%&'\*\+/=\?^`{\|}~])*@[a-zA-Z0-9](\.?[a-zA-Z0-9\-])*\.[a-zA-Z]{2,20}$/.test(email)) {
				elem.showProgress(true);
				$.ajax({
					url: 'Service.ashx',
					method: 'Post',
					headers: { 'AppName': 'NameScan', 'Action': 'CheckEmail', 'Code': settings.code },
					data: email,
					success: function (res) {
						var bc = parseInt(res);
						if (bc == -1 || isNaN(bc))
							elem.setUnknownIcon();
						else if (bc == 0)
							elem.setSafeIcon();
						else
							elem.setBreachedIcon(bc);
					},
					error: function (xhr, ajaxOptions, thrownError) {
						elem.setUnknownIcon();
					},
					complete: function () {
						elem.showProgress(false);
					}
				});
			}
		}

		this.initialize = function () {
			this.on('input.email', function (e) {
				elem.resetIcon();
				if (timerVar)
					clearTimeout(timerVar);
				timerVar = setTimeout(elem.checkBreaches, 2000);
			});
			this.on('blur.email', function (e) {
				if (timerVar)
					clearTimeout(timerVar);
				if (state == 0)
					elem.checkBreaches();
			});

			icoElem = $('#' + settings.iconContainerId);
			$('<i style="margin: 5px;" data-toggle="tooltip2" data-placement="auto"></i><img src="Content/Images/progress.gif" style="display:none;margin-left:5px;" />').appendTo(icoElem);
			iElem = icoElem.find('i');
			prgElem = icoElem.find('img');
			iElem.tooltip({ container: 'body' });

			this.resetIcon();
			return this;
		};
		return this.initialize();
	}
})(jQuery);

