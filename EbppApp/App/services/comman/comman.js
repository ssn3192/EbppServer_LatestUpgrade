(function () {
    'use strict';

    var commonModule = angular.module('common', []);

    commonModule.factory('common',
        ['$q', '$rootScope', '$timeout', 'logger', 'toaster', common]);

    function common($q, $rootScope, $timeout, logger, toaster) {
        var throttles = {};

        var service = {
            // common angular dependencies
            $q: $q,
            $timeout: $timeout,
            // generic
            isNumber: isNumber,
            isPhoneNumber: isPhoneNumber,
            logger: logger,
            textContains: textContains,
            isNull: isNull,
            isNotNull: isNotNull,
            prettyPrint: prettyPrint,
            findNonJsonLdProperties: findNonJsonLdProperties,
            expiryMonthOptions: expiryMonthOptions,
            expiryYearOptions: expiryYearOptions,
            configErrorHandling: configErrorHandling,
            coerceInitialValidation: coerceInitialValidation,
            resetHiddenFields: resetHiddenFields,
            validate: validate,
            CURRENCY_PATTERN: /^((0?\.((0[1-9])|[1-9]\d))|([1-9]\d*(\.\d{2})?))$/,
            PASSWORD_PATTERN: /((?=.*\d)(?=.*[A-Z]).{6,})/,
            EMAIL_PATTERN: /^[_a-zA-Z0-9]+(\.[_a-zA-Z0-9]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(\.[a-zA-Z]{2,})$/,
            isValidCardNumber: isValidCardNumber
        };

        /**
         * Luhn algorithm in JavaScript: validate credit card number supplied as string of numbers
         * @author ShirtlessKirk. Copyright (c) 2012.
         * @license WTFPL (http://www.wtfpl.net/txt/copying)
         */
        var passesLuhnCheck = (function (arr) {
            return function (ccNum) {
                var
                    len = ccNum.length,
                    bit = 1,
                    sum = 0,
                    val;

                while (len) {
                    val = parseInt(ccNum.charAt(--len), 10);
                    sum += (bit ^= 1) ? arr[val] : val;
                }

                return sum && sum % 10 === 0;
            };
        }([0, 2, 4, 6, 8, 1, 3, 5, 7, 9]));

        return service;

        function isNumber(val) {
            // negative or positive
            return /^[-]?\d+$/.test(val);
        }

        function isPhoneNumber(phoneStr) {
            phoneStr = phoneStr.replace(/\D/g, ''); //strips parens, dots, dashes, etc.
            return phoneStr.length === 10
                    && parseInt(phoneStr, 10) >= 2000000000 //area code can't start with 0 or 1
                    && parseInt(phoneStr.slice(-7), 10) >= 2000000; //exchange can't start with 0 or 1
        }

        function isNull(val) {
            if (!(val == null)) {
                if (val === '') {
                    return true;
                }
                return false;
            }
            return true;
        }

        function isNotNull(val) {
            return !isNull(val);
        }

        function textContains(text, searchText) {
            return text && -1 !== text.toLowerCase().indexOf(searchText.toLowerCase());
        }

        function prettyPrint(obj) {
            return JSON.stringify(obj, undefined, 2);
        }

        function findNonJsonLdProperties(doc) {
            var results = [];
            Object.keys(doc).forEach(function (key) {
                if (!key.startsWith('@')) {
                    console.log(key);
                    results.push(key);
                }

            });
            return results;

        }

        function findObject(collection, searchField, searchValue) {
            var results = [];

            for (var i = 0 ; i < collection.length ; i++) {
                if (collection[i][searchField] === searchValue) {
                    results.push(collection[i]);
                }
            }

            return results;
        };

        function expiryMonthOptions() {
            return [
                { name: 'January', value: '01' },
                { name: 'February', value: '02' },
                { name: 'March', value: '03' },
                { name: 'April', value: '04' },
                { name: 'May', value: '05' },
                { name: 'June', value: '06' },
                { name: 'July', value: '07' },
                { name: 'August', value: '08' },
                { name: 'September', value: '09' },
                { name: 'October', value: '10' },
                { name: 'November', value: '11' },
                { name: 'December', value: '12' }
            ];
        }

        function expiryYearOptions(argsObj) {
            argsObj = argsObj || {};
            var futureYearsExtent = argsObj.futureYearsExtent || 11;

            var fullYear = new Date().getFullYear();
            var fullYearAsString = fullYear.toString();
            var expiryYearOptions = [{ name: fullYearAsString, value: fullYearAsString }];

            for (var i = 1, n = futureYearsExtent; i <= n; i++) {
                fullYearAsString = (fullYear + i).toString();
                expiryYearOptions.push({
                    name: fullYearAsString,
                    value: fullYearAsString
                });
            }

            return expiryYearOptions;
        }

        function isValidCardNumber(value) {
            var valid = false;

            if (/^\d{13,16}$/.test($.trim(value))) {
                valid = passesLuhnCheck(value);
            }

            return valid;
        }

        function configErrorHandling($scope, vm, fieldsValidatedUsingMatcher) {
            var fields = fieldsValidatedUsingMatcher;
            if (fields) {
                for (var i = 0, n = fields.length; i < n; i++) {
                    watchFieldsValidatedUsingMatcher($scope, vm, fields[i]);
                }
            }

            vm.validationErrors = {};

            $scope.$watchCollection('vm.validationErrors', function (newValue, oldValue) {
                var sortedKeys;

                // validationErrors need to be accessible by their index so they can be removed
                // but this could result in a sparse array, so we create a condensed array from it
                vm.condensedValidationErrors = [];

                if (!$.isEmptyObject(newValue)) {   // sort integers; see: http://stackoverflow.com/a/1063027/34806
                    sortedKeys = Object.keys(vm.validationErrors).sort(function (a, b) { return a - b });
                    vm.condensedValidationErrors = [];

                    for (var i = 0, n = sortedKeys.length; i < n; i++) {
                        vm.condensedValidationErrors.push(vm.validationErrors[sortedKeys[i]]);
                    }
                }
            });
        };

        function watchFieldsValidatedUsingMatcher($scope, vm, fieldName) {
            $scope.$watch('vm.model.' + fieldName, function (newValue, oldValue) {
                var formController;
                var modelControllerKey;
                var modelController;
                var viewValue;

                // XOR; see: http://www.howtocreate.co.uk/xor.html
                if (!(typeof newValue === 'undefined') !== !(typeof oldValue === 'undefined')) {
                    formController = $scope.$$childHead.form;
                    modelControllerKey = (function () {
                        var mckey;
                        for (var key in formController) {
                            if (formController.hasOwnProperty(key) && key.startsWith(formController.$name)) {
                                if (key.indexOf('_' + fieldName + '_') >= 0) {
                                    mckey = key;
                                    break;
                                }
                            }
                        }
                        return mckey;
                    })();

                    modelController = formController[modelControllerKey];
                    viewValue = modelController ? modelController.$viewValue : undefined;

                    if (typeof viewValue !== 'undefined') {
                        vm.model[fieldName] = modelController.$viewValue;
                    }
                }
            });
        }

        function coerceInitialValidation(fieldName) {
            // By converting undefined to an empty string this ensures validation occurs first time the field loses focus
            // Example return value:    model.username === undefined ? model.username="" : void
            var blurExpression = ["model.", fieldName, " === undefined ? model.", fieldName, "=\"\" : void"].join("");
            return blurExpression;
        };

        function resetHiddenFields(vm) {
            return {
                ach: function () { resetEither('ach', vm) },
                card: function () { resetEither('card', vm) }
            }

            function resetEither(either, vm) {
                var fieldObj;
                var eitherSuffix = '"' + either + '"';
                var field;
                var validationArgs;
                var errorMessage;
                var errors;

                for (var i = 0, n = vm.fields.length; i < n; i++) {
                    fieldObj = vm.fields[i];

                    if (fieldObj.hideExpression && fieldObj.hideExpression.endsWith(eitherSuffix) && fieldObj.className === 'row') {
                        for (var j = 0, k = fieldObj.fieldGroup.length; j < k; j++) {
                            field = fieldObj.fieldGroup[j]
                            vm.model[field.key] = undefined; // erases values, e.g. ach values, when card radio button clicked (and vice versa)

                            if (field.validators) {
                                // quoted error message is 4th argument to common.validate in the configuration
                                validationArgs = field.validators[field.key].toString().match(/\((.+)\)/)[1];
                                errorMessage = validationArgs.split(',')[3].slice(2, -1); // strip quotes
                                errors = vm.validationErrors = vm.validationErrors || {};

                                for (var error in errors) {
                                    if (errors[error] === errorMessage) {
                                        delete vm.validationErrors[error];
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        function validate(validator, callerArgs, vm, errorMessage, optional) {
            var callerArgs = Array.prototype.slice.call(callerArgs);

            var args = callerArgs.concat([vm, errorMessage]);
            if (optional) {
                args.push(optional);
            }

            return validators()[validator].apply({}, args) || false;

            function validators() {
                return {
                    requiredValue: function (viewValue, modelValue, scope, unknown, vm, errorMessage) {
                        // Handles strings, currency, and passwords being submitted; passwords first
                        // being selected are presently being handled by the matchingValue validator below

                        var parentScope = scope.$parent;

                        // The first array index parameter is for input's, the second for select's
                        var field = parentScope.fields[parentScope.index || parentScope.$parent.$index];
                        var fieldType = field.type;
                        var modelKey = field.key;

                        var fieldId = parentScope.id || scope.id; //first case is for input's, second for select's
                        var errorMessageIndex = determineErrorMessageIndex(fieldId, parentScope.form.$name);

                        var value = modelValue || viewValue;
                        var passes;

                        var firstCurrencyFocus = fieldType === 'currency'
                            && value === '' && typeof vm.model[modelKey] === 'undefined' && isNaN(modelValue);


                        if (value === undefined || firstCurrencyFocus) {
                            // Disable the submit button by disabling the form on first load; see: http://stackoverflow.com/a/21111710/34806
                            $timeout(function () {
                                parentScope.form.$invalid = true;
                            });

                            return undefined; // Avoids indicating errors on field(s) when the form first loads
                        }

                        value = $.trim(value); //necessary? Formly may do this already

                        if (fieldType === 'currency' && !service.CURRENCY_PATTERN.test(value)) {
                            value = 0; // coerce error
                        }

                        if (value) {
                            delete vm.validationErrors[errorMessageIndex];
                        }
                        else {
                            vm.validationErrors[errorMessageIndex] = errorMessage;
                        }

                        passes = !!value;

                        if (!passes) {
                            $timeout(function () {
                                parentScope.form.$invalid = true;
                            });
                        }

                        return passes;
                    },

                    matchingValue: function (viewValue, modelValue, scope, unknown, vm, errorMessage, matcher) {
                        /*
                        * The matcher can be a string, which works well for radio buttons, or a regex or function
                        */
                        var value = modelValue || viewValue;
                        var passes;
                        var parentScope = scope.$parent;
                        var parentScopeId;
                        var errorMessageIndex;

                        if (value !== undefined) {
                            if (typeof matcher === 'string') {
                                passes = $.trim(value) === matcher;
                            }
                            else if (matcher instanceof RegExp) {
                                passes = matcher.test($.trim(value));
                            }
                            else if (typeof matcher === 'function') {
                                passes = matcher(value);
                            }
                        }
                        else {
                            return;
                        }

                        parentScopeId = parentScope.id || parentScope.$$childHead.id;
                        errorMessageIndex = determineErrorMessageIndex(parentScopeId, parentScope.form.$name);

                        if (passes) {
                            delete vm.validationErrors[errorMessageIndex];
                        }
                        else if (value !== undefined) {
                            vm.validationErrors[errorMessageIndex] = errorMessage;

                            $timeout(function () {
                                scope.$parent.form.$invalid = true;
                            });
                        }

                        return passes;
                    },

                    optionalMatch: function (viewValue, modelValue, scope, unknown, vm, errorMessage, test) {
                        var value = modelValue || viewValue;
                        var parentScope = scope.$parent;
                        var errorMessageIndex = determineErrorMessageIndex(parentScope.id, parentScope.form.$name);

                        if (value) {
                            if (test(value)) {
                                delete vm.validationErrors[errorMessageIndex];
                                return true;
                            }
                            else {
                                vm.validationErrors[errorMessageIndex] = errorMessage;
                                return false;
                            }
                        }
                        else if (typeof value === 'undefined') {
                            return true;
                        }
                        else { // It once had a (string) value but is now an empty string
                            delete vm.validationErrors[errorMessageIndex];
                        }
                    }
                };
            }

            function determineErrorMessageIndex(fieldId, formName) {
                var formSelector = 'form[name="' + formName + '"]';
                var field = $('input[id="' + fieldId + '"]');

                if (field.length === 0) {
                    field = $('select[id="' + fieldId + '"]');
                }

                var formFields = $(formSelector).find('input[id^="vm"]')
                                    .add($(formSelector).find('select[id^="vm"]'));

                return formFields.index(field);
            }
        };
    }
})();