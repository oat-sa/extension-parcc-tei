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
            if(runner){
                runner.clear();
            }
        }
    });

    QUnit.asyncTest('renders', function(assert){
        var $container = $('#' + fixtureContainerId);

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
            .assets(strategies)
            .init()
            .render($container);
    });

    QUnit.asyncTest('response', function(assert){
        
        var response = {
            record : [
                {
                    name : 'points_1',
                    base : {
                        list : {
                            point : [[5, -1]]
                        }
                    }
                },
                {
                    name : 'setPoints_3',
                    base : {
                        list : {
                            point : [[6, 2], [2, -2], [-5, -7]]
                        }
                    }
                },
                {
                    name : 'segments_4',
                    base : {
                        list : {
                            point : [[-7, 7], [7, 9]]
                        }
                    }
                },
                {
                    name : 'lines_6',
                    base : {
                        list : {
                            point : [[-7, 3], [2, -8]]
                        }
                    }
                },
                {
                    name : 'solutionSet_8',
                    base : {
                        list : {
                            point : [[-10, 6.67], [3.64, -10], [-10, -10]]
                        }
                    }
                }
            ]
        };

        var $container = $('#' + fixtureContainerId);
        assert.equal($container.length, 1, 'the item container exists');
        assert.equal($container.children().length, 0, 'the container has no children');

        runner = qtiItemRunner('qti', itemData)
            .on('render', function(){

                var interaction,
                    interactions = this._item.getInteractions();

                assert.equal(_.size(interactions), 1, 'one interaction');
                interaction = interactions[0];

                //set the response
                interaction.setResponse(response);
            })
            .on('responsechange', function(res){

                QUnit.start();
                assert.ok(_.isPlainObject(res), 'response changed');
                assert.ok(_.isPlainObject(res.RESPONSE), 'response identifier ok');
                assert.deepEqual(res.RESPONSE, response, 'response set/get ok');
            })
            .assets(strategies)
            .init()
            .render($container);

    });

});

