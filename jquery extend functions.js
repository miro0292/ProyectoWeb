//$(document).ajaxStop($.unblockUI).ajaxError($.unblockUI).ajaxComplete($.unblockUI);
$(document).ready(function () {

    window.margin = 0;
    $.ajaxRequest = (function (url, data, onSuccess, onError) {
        $.ajax({
            url: url,
            data: data,
            type: 'POST',
            success: onSuccess,
            error: onError
        });
    });

    $.getNotify = (function (message, status) {
        switch (status.toString()) {
            case "1":
                $.notify((message), "success");
                break
            case "2":
                $.notify((message), "info");
                break
            case "3":
                $.notify((message), "warn");
                break
            case "4":
                $.notify((message), "error");
                break
            default:

        }
    });

    $.getNotifyOver = (function (objectId, message, status) {
        switch (status.toString()) {
            case "1":
                $("#" + objectId).notify(message, "success");
                break
            case "2":
                $("#" + objectId).notify(message, "info");
                break
            case "3":
                $("#" + objectId).notify(message, "warn");
                break
            case "4":
                $("#" + objectId).notify(message, "error");
                break
            default:

        }
    });

    $.showMenu = (function () {
        $("#_menu").toggle();
        var val = window.margin;
        window.margin = $("#page-wrapper").css("margin-left")
        $("#page-wrapper").css("margin-left", val);
        $(window).trigger('resize');
    });

    function hiddenMenu() {
        $("#_menu").prop("hidden", "true");
    }

    $.isNumber = (function (n, c) {
        if (n == "") return true;
        var r = !isNaN(parseFloat(n)) && isFinite(n);
        if (!r && c != null && c != 'undefined')
            $.getNotifyOver(c, 'Solo valores númericos', 2);
        return r;
    });

    $.isNumberControl = (function (n, minv, maxv, validatemax, c) {
        if (n == "") return true;
        var r = !isNaN(parseFloat(n)) && isFinite(n);
        if (!r && c != null && c != 'undefined' && c.attr("id") != null) {
            $.getNotifyOver(c.attr("id"), 'Solo valores númericos', 2);
        }
        else if (n < minv) {
            r = false;
            $.getNotifyOver(c.attr("id"), ('El valor no puede ser menor a ' + minv), 2);
        } else if (validatemax && (n > maxv)) {
            r = false;
            $.getNotifyOver(c.attr("id"), ('El valor no puede ser mayor a ' + maxv), 2);
        }
        return r;
    });


    ($.fn.extractObject = function () {
        var accum = {};
        function add(accum, namev, value) {
            if (namev.length == 1)
                accum[namev[0]] = value;
            else {
                if (accum[namev[0]] == null)
                    accum[namev[0]] = {};
                add(accum[namev[0]], namev.slice(1), value);
            }
        };
        this.find('input, textarea, select').each(function () {
            add(accum, $(this).attr('name').split('.'), $(this).val());
        });
        return accum;
    });

    ($.fn.putObject = function (data) {
        if (data != null && data != undefined) {
            this.find('input, textarea, select').each(function () {
                var name = $(this).attr('name');
                var val = find_value(name);
                if (val != null && val != undefined)
                    $(this).val(val);
            });
            this.find('label').each(function () {
                var name = $(this).attr('name');
                var val = find_value(name);
                if (val != null && val != undefined)
                    $(this).text(val);
            });
            function find_value(key) {
                var value = null;
                $.each(data, function (i, k) {
                    if (i == key) {
                        value = k;
                    }
                });
                return value;
            }
        }
    });

    (function ($) {
        $.fn.inputNumeric = function (options) {
            var options = $.extend(true, {}, $.fn.inputNumeric.options, options);
            var minv = options.minv;
            var validatemax = options.validatemax;
            var maxv = options.maxv;
            var callback = options.callback;
            var maxl = options.maxl;
            this.data("lastval", this.val());
            this.on("input", function (e) {
                if ($(this).data("lastval") != $(this).val()) {
                    if (maxl != null && $(this).val().length <= maxl) {
                        if ($.isNumberControl($(this).val(), minv, maxv, validatemax, $(this))) {
                            $(this).data("lastval", $(this).val());
                            if ($(this).val() != '' && $.isNumber($(this).val()) && callback != null)
                                callback($(this).val());
                        } else {
                            $(this).val($(this).data("lastval"));
                        }
                    } else {
                        $(this).val($(this).data("lastval"));
                        $.getNotifyOver($(this).attr("id"), ('El máximo de caracteres permitidos son ' + maxl), 2);
                    }
                }
            });
        }
        $.fn.inputNumeric.options = {
            minv: 0,
            validatemax: false,
            maxv: 100000,
            callback: null,
            maxl: 5
        };
    })(jQuery);

    jQuery.fn.extend({
        inputMoney: function () {
            this.priceFormat({
                prefix: '$ ',
                centsSeparator: ',',
                thousandsSeparator: '.',
                limit: 12,
                centsLimit: 0
            });
        },
        inputDateTime: function () {
            this.datetimepicker({
                format: 'd/m/Y H:i',
            });
        },
        inputDate: function () {
            this.datetimepicker({
                format: 'd/m/Y',
                timepicker: false
            });
        },
        inputDateAnio: function (anio) {
            this.datetimepicker({
                format: 'd/m/Y',
                timepicker: false,
                minDate: anio.toString() + '/01/01',
                maxDate: anio.toString() + '/12/31'
            })
        },
        controlNumeric: function (filter, options) {
            this.each(function () {
                $(this).find(filter).inputNumeric(options);
            });
        },
        disable: function (state) {
            return this.each(function () {
                this.disabled = state;
            });
        },
        readonly: function (state) {
            return this.each(function () {
                this.readOnly = state;
            });
        },
        setdataTable: function () {
            $(this).DataTable({
                responsive: true,
                language: language,
                displayLength: 25
            });
        },
        orderdataTable: function (order) {
            var table = this.DataTable();
            table
                .order(order)
                .draw();
        }
    });

    $.setTemplate = (function (templateName, data, controlAppend) {
        var control = $("#" + controlAppend + "");
        control.empty();
        var template = $("#" + templateName + "").html();
        var html = Mustache.render(template, data);
        control.append(html);
    });

    var language = {
        decimal: ",",
        search: "Buscar:",
        lengthMenu: "Ver _MENU_ registros",
        info: "Registros del _START_ al _END_ de _TOTAL_ encontrados.",
        infoEmpty: "0 Elementos encontrados",
        infoFiltered: "filtradas _MAX_ registros en total",
        infoPostFix: "",
        loadingRecords: "Cargando...",
        zeroRecords: "No hay datos disponibles en la tabla",
        emptyTable: "No hay datos disponibles en la tabla",
        paginate: {
            first: "Primera",
            previous: "Anterior",
            next: "Siguiente",
            last: "Ultima"
        }
    };
})

