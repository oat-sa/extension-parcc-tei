/**
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; under version 2
 * of the License (non-upgradable).
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 *
 * Copyright (c) 2016 (original work) Open Assessment Technologies SA;
 */
define(['lodash', 'jquery', 'taoQtiItem/qtiCreator/helper/xmlRenderer'], function(_, $, xmlRenderer){
    'use strict';

    function replaceResponseCondition(interaction, newResponseConditionXml, criteria){

        var item = interaction.getRootElement();
        var rp = item.responseProcessing;
        var renderedRp = rp.render(xmlRenderer.get()) || '<responseProcessing template=\"EMPTY\"/>';
        var $rpXml = $($.parseXML(renderedRp));
        var newRcXml = $.parseXML(newResponseConditionXml);
        var newRc = $rpXml[0].importNode(newRcXml.documentElement, true);
        var responseIdentifier = interaction.attr('responseIdentifier');
        var responseDeclaration = interaction.getResponseDeclaration();
        var $newRespVar = $(newRcXml).find('variable[identifier="'+responseIdentifier+'"]');

        //prepare replacement criteria
        criteria = _.defaults(criteria || {}, {
            responseIdentifierCount : $newRespVar.length
        });

        if($rpXml.length){
            if($rpXml[0].documentElement.getAttribute('template')){

                //simply substitute the whole rp
                $rpXml[0].documentElement.removeAttribute('template');

                //append the new one
                $rpXml[0].documentElement.appendChild(newRc);

            }else{
                //if it is not a standard template, replace its rc with the new one
                if($newRespVar.length === criteria.responseIdentifierCount){
                    var $existingVar = $rpXml.find('variable[identifier="' + responseIdentifier + '"]');
                    var $existingRespCond = $existingVar.closest('responseCondition');

                    // Remove old node
                    if($existingRespCond.length) {
                        $existingRespCond.remove();
                    }

                    // Append the new one
                    $rpXml[0].documentElement.appendChild(newRc);
                }else{
                    throw new Error('Unexpected number of rc found');
                }
            }

            //programmatically modifying the response condition requires the whole item RP mode of item to turn into custom mode
            rp.setProcessingType('custom');
            delete responseDeclaration.template;

            //serialize
            rp.xml = (new XMLSerializer()).serializeToString($rpXml[0].documentElement);
        }
    }

    return {
        replace : replaceResponseCondition
    };
});
