define([
    'lodash',
    'taoQtiItem/qtiCreator/widgets/states/factory',
    'taoQtiItem/qtiCreator/widgets/interactions/customInteraction/states/Question',
    'taoQtiItem/qtiCreator/widgets/helpers/formElement',
    'taoQtiItem/qtiCreator/editor/simpleContentEditableElement',
    'taoQtiItem/qtiCreator/editor/containerEditor',
    'tpl!fractionModelInteraction/creator/tpl/propertiesForm'
], function(_, stateFactory, Question, formElement, simpleEditor, containerEditor, formTpl){

    'use strict';

    var StateQuestion = stateFactory.extend(Question, function(){

        var interaction = this.widget.element;
        var $container = this.widget.$container;
        var changeCallback = function changeCallback(selection){
            var selected = _.values(selection);
            interaction.prop('selectedPartitionsInit', _.filter(selected).length);
            interaction.prop('partitionInit', selected.length);
            interaction.prop('selectedPartitions', JSON.stringify(selected));
            interaction.triggerPci('configchange', [_.clone(interaction.properties)]);
        };

        //inti color pickers
        this.initColorPickers();

        //init title editor
        simpleEditor.create($container, '.shape-title', function(text){
            interaction.prop('title', text);
            interaction.updateMarkup();
        });

        //init prompt editor
        containerEditor.create($container.find('.prompt'), {
            change : function(text){
                interaction.data('prompt', text);
                interaction.updateMarkup();
            },
            markup : interaction.markup,
            markupSelector : '.prompt',
            related : interaction
        });

        //init event listeners
        interaction
            .onPci('changepartition', changeCallback)
            .onPci('selectedpartition', changeCallback);

    }, function(){

        var interaction = this.widget.element;

        //remove event listeners
        interaction.offPci('changepartition');
        interaction.offPci('selectedpartition');

        //destroy editors
        simpleEditor.destroy(this.widget.$container);
        containerEditor.destroy(this.widget.$container.find('.prompt'));
        this.destroyColorPickers();
    });

    StateQuestion.prototype.initForm = function(){

        //code to init your interaction property form (on the right side bar)

        var widget = this.widget,
            interaction = widget.element,
            $form = widget.$form,
            response = interaction.getResponseDeclaration();

        function _getChangeCallback(refresh){
            return function(interaction, value, name){
                interaction.prop(name, value);
                if(refresh){
                    interaction.triggerPci('configchange', [_.clone(interaction.properties)]);
                }
            };
        }

        //render the form using the form template
        $form.html(formTpl({
            serial : response.serial,
            radius : interaction.prop('radius'),
            selectedPartitionsColor : interaction.prop('selectedPartitionsColor'),
            partitionColor : interaction.prop('partitionColor'),
            outlineColor : interaction.prop('outlineColor'),
            outlineThickness : interaction.prop('outlineThickness'),
            identifier : interaction.attr('responseIdentifier')
        }));

        //init form javascript
        formElement.initWidget($form);

        //init data change callbacks
        formElement.setChangeCallbacks($form, interaction, {
            radius : _getChangeCallback(true),
            selectedPartitionsColor : _getChangeCallback(true),
            partitionColor : _getChangeCallback(true),
            outlineColor : _getChangeCallback(true),
            outlineThickness : _getChangeCallback(true),
            identifier : function(i, value){
                response.id(value);
                interaction.attr('responseIdentifier', value);
            }
        });
    };

    return StateQuestion;
});
