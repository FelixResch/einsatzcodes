/**
 * Created by felix on 12/13/16.
 */

$(function () {
    $('#major').keyup(function () {
        if($(this).val().length == 2) {
            $('#priority').focus()
        }
    }).val('').focus();
    $('#priority').keyup(function () {
        if($(this).val().length == 1) {
            $(this).val($(this).val().toUpperCase());
            $('#minor').focus()
        }
    }).val('');
    $('#minor').keyup(function (e) {
        if($(this).val().length == 2 || e.which == 13) {
            lookupCode()
        }
    }).val('');
    $('#suffix').keyup(function (e) {
        if(e.which >= 65 && e.which <= 91) {
            e.preventDefault();
            $(this).val($(this).val().substr(0, -1) + e.key.toUpperCase())
        } else if(e.which == 13) {
            lookupCode()
        }
    }).val('');
    $('#refresh').click(function () {
        $('.input-code input').val('')
    });
    $('#lookup').click(function () {
        lookupCode()
    })
});

function lookupCode() {
    if(!($('#major').val().length > 0 && $('#priority').val().length > 0 && $('#minor').val().length > 0))
        return;
    var url = '/codes/' + $('#major').val() + '/' + $('#priority').val() + '/' + $('#minor').val();
    if($('#suffix').val().length > 0) {
        url += '/' + $('#suffix').val()
    }
    if('caches' in window) {
        caches.match(url).then(function (response) {
            if(response) {
                response.json().then(function (json) {
                    displayCode(json)
                })
            }
        })
    }
    $.get(url).done(function (data) {
        displayCode(data)
    })
}

function displayCode(data) {
    $('#result').html(data.description);
    $('#major').val(data.code.major);
    $('#priority').val(data.code.priority);
    $('#minor').val(data.code.minor + '');
    $('#code').html(data.code.long);
    $('.result').removeClass('empty')
}

if('serviceWorker' in navigator) {
    navigator.serviceWorker
        .register('./service-worker.js')
        .then(function () {
            console.log('Service worker registered')
        })
}