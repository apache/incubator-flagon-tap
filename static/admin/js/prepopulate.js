/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 * 
 *   http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/*global URLify*/
(function($) {
    'use strict';
    $.fn.prepopulate = function(dependencies, maxLength, allowUnicode) {
        /*
            Depends on urlify.js
            Populates a selected field with the values of the dependent fields,
            URLifies and shortens the string.
            dependencies - array of dependent fields ids
            maxLength - maximum length of the URLify'd string
            allowUnicode - Unicode support of the URLify'd string
        */
        return this.each(function() {
            var prepopulatedField = $(this);

            var populate = function() {
                // Bail if the field's value has been changed by the user
                if (prepopulatedField.data('_changed')) {
                    return;
                }

                var values = [];
                $.each(dependencies, function(i, field) {
                    field = $(field);
                    if (field.val().length > 0) {
                        values.push(field.val());
                    }
                });
                prepopulatedField.val(URLify(values.join(' '), maxLength, allowUnicode));
            };

            prepopulatedField.data('_changed', false);
            prepopulatedField.change(function() {
                prepopulatedField.data('_changed', true);
            });

            if (!prepopulatedField.val()) {
                $(dependencies.join(',')).keyup(populate).change(populate).focus(populate);
            }
        });
    };
})(grp.jQuery);
