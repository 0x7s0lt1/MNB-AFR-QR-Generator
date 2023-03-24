let App = {

    // generated json 
    json : null,

    // mnb schema
    schema: {
        version : 3
    },

    // ui button elements
    button : {
        generate : document.getElementById('generate-btn'),
        download : {
            json: document.getElementById('d-json'),
            image: document.getElementById('d-image'),
        }
    },

    // qr code conrtainer
    qr : document.getElementById("qrcode"),
    qrWrapper : document.getElementById("qrcode-wrapper"),

    // input fields
    field: {

        //Kedvezményezett Adatai
        BIC : {
            element: document.getElementById('BIC'),
            required: true,
            pattern: /^[a-zA-Z]{11}$/ 
        },
        name :{
            element:  document.getElementById('name'),
            required: true,
            pattern: /^.{1,70}$/
        },
        IBAN : {
            element: document.getElementById('IBAN'),
            required: true,
            pattern: /^[a-zA-Z0-9]{28}$/
        },
        domain : {
            element: document.getElementById('domain'),
            required: false,
            pattern: /^((?!-))(xn--)?[a-z0-9][a-z0-9\-_]{0,61}[a-z0-9]{0,}\\-.?((xn--)?([a-z0-9\-.]{1,61}|[a-z0-9-]{1,30})\\-.?[a-z]{2,})$/

        },

        // Összeg
        value : {
            element: document.getElementById('value'),
            required: true,
            pattern: /^(10{7}|[1-9]\d{0,6}|0)$/
        },
        currency: {
            element: document.getElementById('currency'),
            required: true,
            pattern: /^[a-zA-Z]{3}$/
        },
        text : {
            element: document.getElementById('text'),
            required: false,
            pattern: /^.{1,70}$/,
        },

        // Metaadatok
        identification : {
            element: document.getElementById('identification'),
            required: true,
            pattern: /^.{1,2}$/
        },
        expiry: {
            element: document.getElementById('expiry'),
            required: true,
            pattern: /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?$/
        },
        repeatability: {
            element: document.getElementById('repeatability'),
            required: true,
            pattern: /^.{0,1}$/
        },

        //Egyéb azonosítók 
        positionId : {
            element: document.getElementById('position-id'),
            required:false,
            pattern: /^[a-zA-Z0-9]{4}$/
        },
        shopId : {
            element: document.getElementById('shop-id'),
            required: false,
            pattern: /^.{1,35}$/
        },
        machineId : {
            element: document.getElementById('machine-id'),
            required: false,
            pattern: /^.{1,35}$/
        },
        billId : {
            element: document.getElementById('bill-id'),
            required: false,
            pattern: /^.{1,35}$/
        },
        costumerId : {
            element: document.getElementById('costumer-id'),
            required: false,
            pattern: /^.{1,35}$/
        },
        transactionId : {
            element: document.getElementById('transaction-id'),
            required: false,
            pattern: /^.{1,35}$/

        },
        discountId : {
            element:document.getElementById('discount-id'),
            required: false,
            pattern: /^.{1,35}$/
        },
        NAVCode : {
            element: document.getElementById('NAV-code'),
            required: false,
            pattern: /^.{1,35}$/
        },
    },

    // initialization
    init : function(){
        App.button.generate.addEventListener('click',App.handleClick,false);
    },

    // handle generate button click event
    handleClick : function(){
        if( App.validateFields() ) App.generateQr( App.gerenarateSchema() );
    },

    // clear and generate qr and the download links
    generateQr: function(_schema){

        App.qr.innerHTML = "";
        
        new QRCode(App.qr, {
            text: JSON.stringify(_schema),
            width: 250,
            height: 250,
            colorDark : "#000000",
            colorLight : "#ffffff",
            correctLevel : QRCode.CorrectLevel.H
        });

        let file_name_prefix = "MNB_QR_" + App.field.name.element.value + "_" + App.field.value.element.value;

        App.button.download.json.href = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(App.json));
        App.button.download.json.download = file_name_prefix + ".json";

        App.button.download.image.href = App.qr.querySelector('canvas').toDataURL();
        App.button.download.image.download = file_name_prefix + ".png";


        App.qrWrapper.style.display = 'block';

    },

    // validate input values
    validateFields: function(){

        let is_valid = true;

        Object.keys(App.field).forEach(key => {

            App.field[key].element.classList.remove('is-invalid');

            if(App.field[key].element.value.trim() === '' && App.field[key].required){
                App.field[key].element.classList.add('is-invalid');
                is_valid = false;
            }

            if(App.field[key].required && !App.field[key].element.value.match(App.field[key].pattern)){
                App.field[key].element.classList.add('is-invalid');
                is_valid = false;
            }

            if(App.field[key].element.value.trim() != '' && !App.field[key].element.value.match(App.field[key].pattern)){
                App.field[key].element.classList.add('is-invalid');
                is_valid = false;
            }


        })

        return is_valid;

    },

    // generate the json object
    gerenarateSchema : function(){

        App.json = {
            "M": {
              "I": Number(App.field.identification.element.value),
              "V": App.schema.version,
              "C": 1,
              "E": Number(Date.parse(App.field.expiry.element.value)),
              "R": Number(App.field.repeatability.element.value)
            },
            "R": {
              "B": App.field.BIC.element.value,
              "N": App.field.name.element.value,
              "I": App.field.IBAN.element.value
            },
            "a": {
              "V": Number(App.field.value.element.value),
              "C": App.field.currency.element.value,
            },
            "t": App.field.text.element.value,
            "i": {
                "p": App.field.positionId.element.value,
                "s": App.field.shopId.element.value,
                "m": App.field.machineId.element.value,
                "b": App.field.billId.element.value,
                "c": App.field.costumerId.element.value,
                "t": App.field.transactionId.element.value,
                "d": App.field.discountId.element.value,
                "n": App.field.NAVCode.element.value
            }
        }

        return App.json;
    },

}

window.addEventListener('load', App.init, false);