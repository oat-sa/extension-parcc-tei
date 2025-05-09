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
 * Copyright (c) 2015-2017 Parcc, Inc.
 */


define([
    'jquery',
    'lodash',
    'taoQtiItem/runner/qtiItemRunner',
    'taoQtiItem/portableElementRegistry/ciRegistry',
    'taoQtiItem/portableElementRegistry/provider/localManifestProvider',
    'json!parccTei/test/samples/fraction.json'
], function($, _, qtiItemRunner, ciRegistry, pciTestProvider, itemData){
    'use strict';


    var runner;
    var fixtureContainerId = 'item-container';
    var outsideContainerId = 'outside-container';

    //manually register the pci from its manifest
    pciTestProvider.addManifestPath(
        'fractionModelInteraction',
        'parccTei/pciCreator/ims/fractionModelInteraction/imsPciCreator.json');
    ciRegistry.resetProviders();
    ciRegistry.registerProvider(pciTestProvider.getModuleName());

    QUnit.module('Fraction Interaction');

    QUnit.test('renders', function(assert) {
        const done = assert.async();
        var $container = $('#' + fixtureContainerId);

        assert.equal($container.length, 1, 'the item container exists');
        assert.equal($container.children().length, 0, 'the container has no children');

        runner = qtiItemRunner('qti', itemData)
            .on('render', function() {
                assert.equal($container.children().length, 1, 'the container has elements');
                assert.equal($container.children('.qti-item').length, 1, 'the container contains the root element .qti-item');
                assert.equal($container.find('.qti-interaction').length, 1, 'the container contains an interaction .qti-interaction');
                assert.equal($container.find('.qti-interaction.qti-customInteraction').length, 1, 'the container contains a custom interaction');
                assert.equal($container.find('.qti-customInteraction .fractionModelInteraction').length, 1, 'the custom interaction is a fraction model');
                assert.equal($container.find('.qti-customInteraction .shape-panel').length, 1, 'the interaction contains the shape panel');
                assert.equal($container.find('.qti-customInteraction .shape-controls button').length, 3, 'the interaction contains 3 controls');
                assert.equal($container.find('.qti-customInteraction .shape-container svg').length, 1, 'the interaction contains the svg element');

                runner.clear();
                done();
            })
            .init()
            .render($container);
    });

    QUnit.test('more partitions', function(assert) {
        const done = assert.async();

        var $container = $('#' + fixtureContainerId);

        assert.equal($container.length, 1, 'the item container exists');
        assert.equal($container.children().length, 0, 'the container has no children');

        runner = qtiItemRunner('qti', itemData)
            .on('render', function() {
                var $more, state;

                assert.equal($container.find('.qti-customInteraction .fractionModelInteraction').length, 1, 'the custom interaction is a fraction model');

                state = this.getState();
                assert.ok(typeof state === 'object', 'The state is an object');
                assert.ok(_.isArray(state.RESPONSE.selection), 'The state contains a well-formatted array');
                assert.equal(_.filter(state.RESPONSE.selection).length, 0, 'No selected partition by default');
                assert.equal(state.RESPONSE.selection.length, 2, 'There are 2 partitions by default');

                $more = $('.fractionModelInteraction .shape-controls button.more', $container);
                assert.equal($more.length, 1, 'the more button is there');

                $more.click();
            })
            .on('statechange', function(state) {
                // Verify the state update after clicking "more"
                console.log('State changed:', state);
                assert.ok(_.isArray(state.RESPONSE.selection), 'The state contains a well-formatted array');
                assert.equal(_.filter(state.RESPONSE.selection).length, 0, 'No selected partition in the state');
                assert.equal(state.RESPONSE.selection.length, 3, '3 partitions in the state after clicking "more"');
                runner.clear();
                done();
            })
            .on('error', function(error) {
                window.console.log(error);
                done();
            })
            .init()
            .render($container);
    });

    QUnit.test('less partitions', function(assert){
        const done = assert.async();
        var $container = $('#' + fixtureContainerId);

        // Update the sample to start with 4 partitions
        var updatedFractionData = _.cloneDeep(itemData);
        updatedFractionData.body.elements['interaction_imsportablecustominteraction_5a2a9c6d8d4ac661204810'].properties.partitionInit = 4;

        assert.equal($container.length, 1, 'the item container exists');
        assert.equal($container.children().length, 0, 'the container has no children');

        runner = qtiItemRunner('qti', updatedFractionData)
            .on('render', function(){
                var $fewer,
                    state;

                assert.equal($container.find('.qti-customInteraction .fractionModelInteraction').length, 1, 'the custom interaction is a fraction model');

                state = this.getState();
                assert.ok(typeof state === 'object', 'The state is an object');
                assert.ok(_.isArray(state.RESPONSE.selection), 'The state contains a well-formatted response');
                assert.equal(_.filter(state.RESPONSE.selection).length, 0, 'No selected partition by default');
                assert.equal(state.RESPONSE.selection.length, 4, 'There are 4 partitions by default');

                $fewer = $('.fractionModelInteraction .shape-controls button.fewer', $container);
                assert.equal($fewer.length, 1, 'the less button is there');

                $fewer.click(); // Trigger the "fewer" button click
            })
            .on('statechange', function(state){
                assert.ok(_.isArray(state.RESPONSE.selection), 'The state contains a well-formatted response');
                assert.equal(_.filter(state.RESPONSE.selection).length, 0, 'No selected partition in the state');
                assert.equal(state.RESPONSE.selection.length, 3, '3 partitions in the state after clicking "fewer"');

                runner.clear();
                done();
            })
            .on('error', function(error) {
                window.console.log(error);
                done();
            })
            .init()
            .render($container);
    });

    QUnit.test('select partitions', function(assert){
        const done = assert.async();
        var $container = $('#' + fixtureContainerId);

        // Update the sample to start with 4 partitions
        var updatedFractionData = _.cloneDeep(itemData);
        updatedFractionData.body.elements['interaction_imsportablecustominteraction_5a2a9c6d8d4ac661204810'].properties.partitionInit = 4;

        assert.equal($container.length, 1, 'the item container exists');
        assert.equal($container.children().length, 0, 'the container has no children');

        runner = qtiItemRunner('qti', updatedFractionData)
            .on('render', function(){
                var $partitions,
                    state;

                assert.equal($container.find('.qti-customInteraction .fractionModelInteraction').length, 1, 'the custom interaction is a fraction model');

                state = this.getState();
                assert.ok(typeof state === 'object', 'The state is an object');
                assert.ok(_.isArray(state.RESPONSE.selection), 'The state contains a well-formatted response');
                assert.equal(_.filter(state.RESPONSE.selection).length, 0, 'No selected partition by default');
                assert.equal(state.RESPONSE.selection.length, 4, 'There are 4 partitions by default');

                $partitions = $('.fractionModelInteraction .shape-container svg > path', $container);
                assert.equal($partitions.length, 4, 'There are 4 partitions in the canvas');

                if ($partitions.length > 0) {
                    // Dispatch click event on the first partition (if available)
                    var event = document.createEvent("SVGEvents");
                    event.initEvent("click", true, true);
                    $partitions[0].dispatchEvent(event);
                } else {
                    assert.ok(false, "Partitions were not found in the canvas.");
                }
            })
            .on('statechange', function(state){
                assert.ok(_.isArray(state.RESPONSE.selection), 'The state contains a well-formatted response');
                assert.equal(_.filter(state.RESPONSE.selection).length, 1, '1 partition is selected');
                assert.equal(state.RESPONSE.selection.length, 4, '4 partitions in the state');

                runner.clear();
                done();
            })
            .on('error', function(error) {
                window.console.log(error);
                done();
            })
            .init()
            .render($container);
    });

    QUnit.test('set state', function(assert){
        const done = assert.async();
        var $container = $('#' + fixtureContainerId);
        var state = {
            RESPONSE : {
                selection : [false, true, false, true, true]
            }
        };

        assert.equal($container.length, 1, 'the item container exists');
        assert.equal($container.children().length, 0, 'the container has no children');

        runner = qtiItemRunner('qti', itemData)
            .on('render', function(){
                var self = this,
                    $partitions,
                    responses;

                assert.equal($container.find('.qti-customInteraction .fractionModelInteraction').length, 1, 'the custom interaction is a fraction model');

                $partitions = $('.fractionModelInteraction .shape-container svg > path', $container);
                assert.equal($partitions.length, 5, 'There is 5 partitions in the canvas');
                assert.equal($partitions.filter('[fill="#ff0000"]').length, 3, 'There is 3 selected partitions in the canvas');

                responses = self.getResponses();
                assert.ok(typeof responses === 'object', 'The responses is an object');
                assert.ok(responses.RESPONSE.base && responses.RESPONSE.base.string, 'The state contains a well formated response');
                assert.equal(responses.RESPONSE.base.string, '3/5', 'No selected partition by default');

                runner.clear();
                done();
            })
            .on('error', function(error) {
                window.console.log(error);
                done();
            })
            .init()
            .render($container, { state: state } );
    });

    QUnit.module('Visual test');

    QUnit.test('Display and play', function(assert){
        const done = assert.async();
        var $container = $('#' + outsideContainerId);

        assert.equal($container.length, 1, 'the item container exists');
        assert.equal($container.children().length, 0, 'the container has no children');

        runner = qtiItemRunner('qti', itemData)
            .on('render', function(){
                done();
            })
            .on('error', function(error) {
                assert.ok(false, error);
                done();
            })
            .init()
            .render($container);
    });

});
