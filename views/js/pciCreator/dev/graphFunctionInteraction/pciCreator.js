define([
    'lodash',
    'taoQtiItem/qtiCreator/editor/customInteractionRegistry',
    'graphFunctionInteraction/creator/widget/Widget',
    'tpl!graphFunctionInteraction/creator/tpl/markup',
    'tpl!graphFunctionInteraction/creator/tpl/responseCondition',
    'parccTei/pciCreator/helper/responseCondition'
], function(_, ciRegistry, Widget, markupTpl, rcTpl, responseCondition){

    var _typeIdentifier = 'graphFunctionInteraction';

    var likertScaleInteractionCreator = {
        /**
         * (required) Get the typeIdentifier of the custom interaction
         * 
         * @returns {String}
         */
        getTypeIdentifier : function(){
            return _typeIdentifier;
        },
        /**
         * (required) Get the widget prototype
         * Used in the renderer
         * 
         * @returns {Object} Widget
         */
        getWidget : function(){
            return Widget;
        },
        /**
         * (optional) Get the default properties values of the pci.
         * Used on new pci instance creation
         * 
         * @returns {Object}
         */
        getDefaultProperties : function(pci){
            return {
                graphs : 'linear,absolute,quadratic,exponential,logarithmic,cosine,tangent',
                xMin : -10,
                xMax : 10,
                yMin : -10,
                yMax : 10,
                graphColor : '#bb1a2a',
                graphWidth : 3
            };
        },
        /**
         * (optional) Callback to execute on the 
         * Used on new pci instance creation
         * 
         * @returns {Object}
         */
        afterCreate : function(pci){

            //turn into custom rp and substitute the resp cond
            responseCondition.replace(pci, rcTpl({
                responseIdentifier : pci.attr('responseIdentifier'),
                score : 1
            }));

            //set default (and fixed) correct "numberPointsRequired" value
            pci.getResponseDeclaration().correctResponse = [{
                fieldIdentifier : 'numberPointsRequired',
                baseType : 'integer',
                value : 2//it is presently always 2
            }];
        },
        /**
         * (required) Gives the qti pci xml template 
         * 
         * @returns {function} handlebar template
         */
        getMarkupTemplate : function(){
            return markupTpl;
        },
        /**
         * (optional) Allows passing additional data to xml template
         * 
         * @returns {function} handlebar template
         */
        getMarkupData : function(pci, defaultData){

            return _.defaults(defaultData, {
                prompt : pci.data('prompt')
            });
        }
    };

    //since we assume we are in a tao context, there is no use to expose the a global object for lib registration
    //all libs should be declared here
    return likertScaleInteractionCreator;
});