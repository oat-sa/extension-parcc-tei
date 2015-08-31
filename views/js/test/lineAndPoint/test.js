define([
    'jquery',
    'lodash',
    'taoQtiItem/runner/qtiItemRunner',
    'json!parccTei/test/samples/lineAndPoint.json'
], function($, _, qtiItemRunner, itemData){

    'use strict';

    var runner;
    var fixtureContainerId = 'item-container';
    var outsideContainerId = 'outside-container';

    //override asset loading in order to resolve it from the runtime location
    var strategies = [{
            name : 'portableElementLocation',
            handle : function handlePortableElementLocation(url){
                if(/graphLineAndPointInteraction/.test(url.toString())){
                    return '../../../parccTei/views/js/pciCreator/dev/' + url.toString();
                }
            }
        }, {
            name : 'default',
            handle : function defaultStrategy(url){
                return url.toString();
            }
        }];

    module('Graph Line & Point Interaction', {
        teardown : function(){
            return;
            if(runner){
                runner.clear();
            }
        }
    });

    QUnit.asyncTest('renders', function(assert){
        var $container = $('#' + outsideContainerId);

        assert.equal($container.length, 1, 'the item container exists');
        assert.equal($container.children().length, 0, 'the container has no children');

        runner = qtiItemRunner('qti', itemData)
            .on('render', function(){

                assert.equal($container.children().length, 1, 'the container a elements');
                assert.equal($container.children('.qti-item').length, 1, 'the container contains a the root element .qti-item');
                assert.equal($container.find('.qti-interaction').length, 1, 'the container contains an interaction .qti-interaction');
                assert.equal($container.find('.qti-interaction.qti-customInteraction').length, 1, 'the container contains a custom interaction');
                assert.equal($container.find('.qti-customInteraction .pointAndLineFunctionInteraction').length, 1, 'the custom interaction is a graph line & point');
                assert.equal($container.find('.qti-customInteraction .prompt').length, 1, 'the interaction contains a prompt');

                QUnit.start();
            })
            .on('responsechange', function(response){
                
                console.log('response', response);
            })
            .assets(strategies)
            .init()
            .render($container);
    });
});

